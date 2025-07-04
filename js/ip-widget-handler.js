// IP Widget Handler - Displays website IP information at bottom right corner
class IpWidgetHandler {
    constructor() {
        this.widget = document.getElementById('ipWidget');
        this.toggleBtn = document.getElementById('ipWidgetToggle');
        this.content = document.getElementById('ipWidgetContent');
        this.refreshBtn = document.getElementById('ipRefreshBtn');
        
        this.currentDomainEl = document.getElementById('currentDomain');
        this.currentIPv4El = document.getElementById('currentIPv4');
        this.currentIPv6El = document.getElementById('currentIPv6');
        this.serverInfoEl = document.getElementById('serverInfo');
        
        this.isCollapsed = false;
        this.isLoading = false;
        this.currentTabId = null;
        
        this.setupEventListeners();
        this.startMonitoring();
        
        console.log('✓ IpWidgetHandler initialized');
    }
    
    setupEventListeners() {
        // Toggle widget collapse/expand
        this.toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleWidget();
        });
        
        // Refresh IP info
        this.refreshBtn.addEventListener('click', () => {
            this.refreshIpInfo();
        });
        
        // Make widget draggable (optional enhancement)
        this.makeWidgetDraggable();
    }
    
    toggleWidget() {
        this.isCollapsed = !this.isCollapsed;
        
        if (this.isCollapsed) {
            this.widget.classList.add('collapsed');
            this.toggleBtn.textContent = '+';
        } else {
            this.widget.classList.remove('collapsed');
            this.toggleBtn.textContent = '−';
        }
        
        // Save state to storage
        chrome.storage.local.set({ ipWidgetCollapsed: this.isCollapsed });
    }
    
    async startMonitoring() {
        // Load saved state
        const result = await chrome.storage.local.get(['ipWidgetCollapsed']);
        if (result.ipWidgetCollapsed) {
            this.isCollapsed = true;
            this.toggleWidget();
        }
        
        // Get current tab info
        await this.updateCurrentTab();
        
        // Set up tab change monitoring
        chrome.tabs.onActivated.addListener(async (activeInfo) => {
            this.currentTabId = activeInfo.tabId;
            await this.updateTabInfo();
        });
        
        chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
            if (tabId === this.currentTabId && changeInfo.status === 'complete') {
                await this.updateTabInfo();
            }
        });
    }
    
    async updateCurrentTab() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab) {
                this.currentTabId = tab.id;
                await this.updateTabInfo();
            }
        } catch (error) {
            console.log('Could not get current tab:', error);
        }
    }
    
    async updateTabInfo() {
        try {
            const tab = await chrome.tabs.get(this.currentTabId);
            if (tab && tab.url) {
                const url = new URL(tab.url);
                const domain = url.hostname;
                
                if (domain && !domain.startsWith('chrome-') && !domain.startsWith('moz-')) {
                    this.currentDomainEl.textContent = domain;
                    await this.lookupIpInfo(domain);
                } else {
                    this.resetDisplay();
                }
            }
        } catch (error) {
            console.log('Could not update tab info:', error);
            this.resetDisplay();
        }
    }
    
    async lookupIpInfo(domain) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.widget.classList.add('loading');
        this.refreshBtn.disabled = true;
        
        try {
            // Reset values
            this.currentIPv4El.textContent = 'Loading...';
            this.currentIPv6El.textContent = 'Loading...';
            this.serverInfoEl.textContent = 'Loading...';
            
            // Lookup IPv4
            const ipv4Info = await this.dnsLookup(domain, 'A');
            if (ipv4Info && ipv4Info.length > 0) {
                this.currentIPv4El.textContent = ipv4Info[0].data || '-';
            } else {
                this.currentIPv4El.textContent = '-';
            }
            
            // Lookup IPv6
            const ipv6Info = await this.dnsLookup(domain, 'AAAA');
            if (ipv6Info && ipv6Info.length > 0) {
                this.currentIPv6El.textContent = ipv6Info[0].data || '-';
            } else {
                this.currentIPv6El.textContent = '-';
            }
            
            // Get server info (try to get from headers or other sources)
            await this.getServerInfo(domain);
            
        } catch (error) {
            console.error('Error looking up IP info:', error);
            this.currentIPv4El.textContent = 'Error';
            this.currentIPv6El.textContent = 'Error';
            this.serverInfoEl.textContent = 'Error';
        } finally {
            this.isLoading = false;
            this.widget.classList.remove('loading');
            this.refreshBtn.disabled = false;
        }
    }
    
    async dnsLookup(domain, recordType) {
        try {
            const response = await fetch(`https://dns.google/resolve?name=${domain}&type=${recordType}`, {
                headers: {
                    'Accept': 'application/dns-json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`DNS lookup failed: ${response.status}`);
            }
            
            const data = await response.json();
            return data.Answer || [];
        } catch (error) {
            console.error(`DNS lookup error for ${domain} (${recordType}):`, error);
            return [];
        }
    }
    
    async getServerInfo(domain) {
        try {
            // Try to get basic server info
            this.serverInfoEl.textContent = 'Checking...';
            
            // For now, just show a basic message
            // In a real implementation, you might try to get server headers
            this.serverInfoEl.textContent = 'DNS resolved';
            
        } catch (error) {
            console.error('Error getting server info:', error);
            this.serverInfoEl.textContent = '-';
        }
    }
    
    resetDisplay() {
        this.currentDomainEl.textContent = '-';
        this.currentIPv4El.textContent = '-';
        this.currentIPv6El.textContent = '-';
        this.serverInfoEl.textContent = '-';
    }
    
    refreshIpInfo() {
        if (this.currentDomainEl.textContent && this.currentDomainEl.textContent !== '-') {
            this.lookupIpInfo(this.currentDomainEl.textContent);
        }
    }
    
    makeWidgetDraggable() {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        this.widget.addEventListener('mousedown', (e) => {
            if (e.target === this.toggleBtn || e.target === this.refreshBtn) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = this.widget.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            
            this.widget.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            const newLeft = startLeft + deltaX;
            const newTop = startTop + deltaY;
            
            // Keep widget within viewport bounds
            const maxLeft = window.innerWidth - this.widget.offsetWidth;
            const maxTop = window.innerHeight - this.widget.offsetHeight;
            
            const constrainedLeft = Math.max(0, Math.min(newLeft, maxLeft));
            const constrainedTop = Math.max(0, Math.min(newTop, maxTop));
            
            this.widget.style.left = constrainedLeft + 'px';
            this.widget.style.top = constrainedTop + 'px';
            this.widget.style.right = 'auto';
            this.widget.style.bottom = 'auto';
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                this.widget.style.cursor = 'default';
                
                // Save position to storage
                const rect = this.widget.getBoundingClientRect();
                chrome.storage.local.set({
                    ipWidgetPosition: {
                        left: rect.left,
                        top: rect.top
                    }
                });
            }
        });
        
        // Restore saved position
        chrome.storage.local.get(['ipWidgetPosition']).then((result) => {
            if (result.ipWidgetPosition) {
                const pos = result.ipWidgetPosition;
                this.widget.style.left = pos.left + 'px';
                this.widget.style.top = pos.top + 'px';
                this.widget.style.right = 'auto';
                this.widget.style.bottom = 'auto';
            }
        });
    }
}

// Initialize IP Widget when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.ipWidgetHandler = new IpWidgetHandler();
    });
} else {
    window.ipWidgetHandler = new IpWidgetHandler();
}

// Make it available globally
window.IpWidgetHandler = IpWidgetHandler;
