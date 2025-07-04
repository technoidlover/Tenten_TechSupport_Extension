// Ladipage DNS Handler - Handles auto DNS creation for Ladipage
class LadipageHandler {
    constructor(elements) {
        this.elements = elements;
        this.currentTabId = null;
        this.isAutomationRunning = false;
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('✓ LadipageHandler initialized');
    }
    
    setupEventListeners() {
        // Handle panel open
        if (this.elements.autoLadipage) {
            this.elements.autoLadipage.addEventListener('click', () => {
                console.log('Auto Ladipage clicked');
                this.handlePanelOpen();
            });
        }
        
        // Handle submit button
        if (this.elements.ladipageSubmitBtn) {
            this.elements.ladipageSubmitBtn.addEventListener('click', () => {
                this.handleLadipageAutomation();
            });
        }
        
        // Handle stop button
        if (this.elements.ladipageStopBtn) {
            this.elements.ladipageStopBtn.addEventListener('click', () => {
                this.stopAutomation();
            });
        }
        
        // Handle Enter key in domain input
        if (this.elements.ladipageDomainInput) {
            this.elements.ladipageDomainInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleLadipageAutomation();
                }
            });
        }
    }
    
    handlePanelOpen() {
        console.log('Opening Ladipage panel...');
        
        // Use UIManager to show right panel
        if (window.uiManager) {
            window.uiManager.showRightPanel('🚀 Auto Ladipage DNS', 'ladipage');
        } else {
            // Fallback if UIManager not available
            this.showPanelManually();
        }
        
        // Clear previous input and results
        if (this.elements.ladipageDomainInput) {
            this.elements.ladipageDomainInput.value = '';
        }
        if (this.elements.ladipageContainer) {
            this.elements.ladipageContainer.innerHTML = '<div class="initial-message">📝 Nhập tên miền ở trên và nhấn "Tạo DNS" để bắt đầu automation</div>';
        }
        
        // Focus on domain input
        setTimeout(() => {
            if (this.elements.ladipageDomainInput) {
                this.elements.ladipageDomainInput.focus();
            }
        }, 100);
        
        console.log('✓ Ladipage panel opened');
    }
    
    showPanelManually() {
        // Fallback panel management
        const sections = ['whoisSection', 'ipInfoSection', 'dnsSection', 'ladipageSection'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'none';
            }
        });
        
        // Show ladipage section
        if (this.elements.ladipageSection) {
            this.elements.ladipageSection.style.display = 'block';
        }
        
        // Show right panel
        if (this.elements.rightPanel) {
            this.elements.rightPanel.style.display = 'block';
            this.elements.body.classList.add('expanded');
        }
        
        // Update title
        if (this.elements.rightPanelTitle) {
            this.elements.rightPanelTitle.textContent = '🚀 Auto Ladipage DNS';
        }
    }
    
    async handleLadipageAutomation() {
        const domain = this.elements.ladipageDomainInput.value.trim();
        
        if (!domain) {
            this.showError('Vui lòng nhập tên miền');
            return;
        }
        
        // Validate domain
        if (!this.isValidDomain(domain)) {
            this.showError('Tên miền không hợp lệ');
            return;
        }
        
        // Get ladipage type
        const ladipageType = document.querySelector('input[name="ladipageType"]:checked')?.value || 'domain';
        
        try {
            // Check if already running
            if (this.isAutomationRunning) {
                this.showError('Automation đang chạy');
                return;
            }
            
            // Check current tab instead of opening new tab
            this.addLog('� Kiểm tra tab hiện tại...', 'info');
            
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.url || !tab.url.includes('domain.tenten.vn')) {
                this.showError('Vui lòng truy cập trang domain.tenten.vn trước khi sử dụng automation');
                this.addLog('💡 Hướng dẫn: Mở tab domain.tenten.vn và truy cập vào DNS Settings của domain', 'warning');
                return;
            }
            
            this.currentTabId = tab.id;
            this.addLog('✅ Đã kết nối với tab domain.tenten.vn', 'success');
            
            // Show progress
            this.showProgress();
            
            // Clear previous logs
            this.clearLogs();
            this.addLog('🚀 Bắt đầu DNS Automation Ladipage...', 'info');
            
            // Check if content script is ready
            this.addLog('📋 Kiểm tra automation script...', 'info');
            
            try {
                const pingResponse = await this.sendMessageToTab(tab.id, { action: 'ping' });
                
                if (!pingResponse || pingResponse.status !== 'ready') {
                    this.addLog('❌ Content script chưa sẵn sàng, đang inject...', 'warning');
                    await this.injectContentScript(tab.id);
                    // Wait for content script to be ready
                    await this.delay(1000);
                } else {
                    this.addLog('✅ Content script đã sẵn sàng', 'success');
                }
                
                // Start automation
                await this.startAutomation(domain, ladipageType, tab.id);
                
            } catch (error) {
                if (error.message.includes('Could not establish connection')) {
                    this.addLog('❌ Content script chưa sẵn sàng, đang inject...', 'warning');
                    await this.injectContentScript(tab.id);
                    await this.delay(1000);
                    await this.startAutomation(domain, ladipageType, tab.id);
                } else {
                    throw error;
                }
            }
            
        } catch (error) {
            this.showError('Lỗi khi tạo DNS Ladipage: ' + error.message);
            this.resetUI();
        }
    }
    
    async injectContentScript(tabId) {
        this.addLog('📋 Đang inject automation script...', 'info');
        
        try {
            // First check if content script is already injected
            const pingResponse = await this.sendMessageToTab(tabId, { action: 'ping' });
            if (pingResponse && pingResponse.status === 'ready') {
                this.addLog('✅ Content script đã sẵn sàng', 'success');
                return;
            }
        } catch (error) {
            // Content script not ready, need to inject
            this.addLog('📋 Content script chưa sẵn sàng, đang inject...', 'info');
        }
        
        return new Promise((resolve, reject) => {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            }, (result) => {
                if (chrome.runtime.lastError) {
                    reject(new Error('Không thể inject script: ' + chrome.runtime.lastError.message));
                } else {
                    this.addLog('✅ Script đã được inject thành công', 'success');
                    resolve();
                }
            });
        });
    }
    
    async startAutomation(domain, ladipageType, tabId) {
        this.isAutomationRunning = true;
        
        try {
            // Wait a bit for content script to be ready
            await this.delay(1000);
            
            // Check if content script is ready
            const pingResponse = await this.sendMessageToTab(tabId, { action: 'ping' });
            
            if (!pingResponse || pingResponse.status !== 'ready') {
                throw new Error('Content script không sẵn sàng');
            }
            
            this.addLog('✅ Kết nối với automation script thành công', 'success');
            
            // Determine automation type
            const action = ladipageType === 'subdomain' ? 'startDnsAutomationSub' : 'startDnsAutomation';
            const domainKey = ladipageType === 'subdomain' ? 'subdomain' : 'domain';
            
            // Start automation
            const response = await this.sendMessageToTab(tabId, {
                action: action,
                [domainKey]: domain
            });
            
            if (response && response.success) {
                this.addLog('✅ Automation đã bắt đầu thành công', 'success');
            } else {
                throw new Error('Không thể bắt đầu automation: ' + JSON.stringify(response));
            }
            
        } catch (error) {
            this.isAutomationRunning = false;
            throw error;
        }
    }
    
    async sendMessageToTab(tabId, message) {
        return new Promise((resolve, reject) => {
            chrome.tabs.sendMessage(tabId, message, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(response);
                }
            });
        });
    }
    
    stopAutomation() {
        if (this.currentTabId && this.isAutomationRunning) {
            this.addLog('🛑 Đang dừng automation...', 'warning');
            
            chrome.tabs.sendMessage(this.currentTabId, { action: 'stopAutomation' }, (response) => {
                if (chrome.runtime.lastError) {
                    this.addLog('⚠️ Không thể gửi lệnh dừng: ' + chrome.runtime.lastError.message, 'warning');
                } else {
                    this.addLog('✅ Lệnh dừng đã được gửi', 'success');
                }
                this.resetUI();
            });
        } else {
            this.addLog('⚠️ Không có automation nào đang chạy', 'warning');
            this.resetUI();
        }
    }
    
    showProgress() {
        if (this.elements.ladipageProgress) {
            this.elements.ladipageProgress.style.display = 'block';
        }
        
        if (this.elements.ladipageSubmitBtn) {
            this.elements.ladipageSubmitBtn.disabled = true;
            this.elements.ladipageSubmitBtn.textContent = '🔄 Đang xử lý...';
        }
    }
    
    hideProgress() {
        if (this.elements.ladipageProgress) {
            this.elements.ladipageProgress.style.display = 'none';
        }
        
        if (this.elements.ladipageSubmitBtn) {
            this.elements.ladipageSubmitBtn.disabled = false;
            this.elements.ladipageSubmitBtn.textContent = '🚀 Tạo DNS';
        }
    }
    
    updateProgress(percent, message) {
        if (this.elements.ladipageProgressFill) {
            this.elements.ladipageProgressFill.style.width = percent + '%';
        }
        
        if (this.elements.ladipageProgressText) {
            this.elements.ladipageProgressText.textContent = message;
        }
    }
    
    resetUI() {
        this.currentTabId = null;
        this.isAutomationRunning = false;
        this.hideProgress();
        this.updateProgress(0, 'Sẵn sàng');
    }
    
    addLog(message, type = 'info') {
        const container = this.elements.ladipageContainer;
        if (!container) return;
        
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        container.appendChild(logEntry);
        container.scrollTop = container.scrollHeight;
    }
    
    showError(message) {
        this.addLog(`❌ ${message}`, 'error');
    }
    
    clearLogs() {
        if (this.elements.ladipageContainer) {
            this.elements.ladipageContainer.innerHTML = '';
        }
    }
    
    isValidDomain(domain) {
        // Basic domain validation
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/;
        return domainRegex.test(domain) && domain.includes('.');
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Handle messages from content script
    handleMessage(message) {
        if (message.action === 'updateProgress') {
            this.updateProgress(message.percent, message.message);
        } else if (message.action === 'addLog') {
            this.addLog(message.message, message.type);
        } else if (message.action === 'automationComplete') {
            if (message.success) {
                this.updateProgress(100, 'Hoàn thành!');
                this.addLog('✅ DNS Automation Ladipage hoàn thành thành công!', 'success');
                this.addLog('🌐 Domain đã được cấu hình trỏ về Ladipage', 'success');
                
                // Auto close progress after 3 seconds
                setTimeout(() => {
                    this.hideProgress();
                }, 3000);
                
            } else if (message.stopped) {
                this.updateProgress(0, 'Đã dừng');
                this.addLog('⛔ Automation đã được dừng bởi người dùng', 'warning');
                
            } else {
                this.updateProgress(0, 'Thất bại');
                this.addLog('❌ DNS Automation thất bại', 'error');
            }
            
            this.resetUI();
        }
    }
}

// Make it available globally
window.LadipageHandler = LadipageHandler;
