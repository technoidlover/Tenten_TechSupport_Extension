// UI Manager
// Handles UI interactions, panel management, and layout transitions

class UIManager {
    constructor(elements) {
        this.elements = elements;
        this.currentPanel = null;
    }

    showRightPanel(title, content) {
        console.log('=== Showing Right Panel ===');
        console.log('Title:', title);
        console.log('Content type:', content);
        console.log('Elements check:', {
            rightPanelTitle: !!this.elements.rightPanelTitle,
            rightPanel: !!this.elements.rightPanel,
            body: !!this.elements.body,
            whoisSection: !!this.elements.whoisSection,
            ipInfoSection: !!this.elements.ipInfoSection,
            dnsSection: !!this.elements.dnsSection,
            ladipageSection: !!this.elements.ladipageSection
        });
        
        this.elements.rightPanelTitle.textContent = title;
        this.currentPanel = content;
        
        // First expand the body
        this.elements.body.classList.add('expanded');
        console.log('Body expanded');
        
        // Then show the right panel with a slight delay for smooth transition
        setTimeout(() => {
            this.elements.rightPanel.classList.add('active');
            console.log('Right panel activated');
        }, 100);
        
        // Hide all content sections first
        this.hideAllSections();
        
        // Show the requested content
        if (content === 'whois') {
            this.elements.whoisSection.style.display = 'block';
            console.log('WHOIS section shown');
        } else if (content === 'ipinfo') {
            this.elements.ipInfoSection.style.display = 'block';
            console.log('IP Info section shown');
        } else if (content === 'dns') {
            this.elements.dnsSection.style.display = 'block';
            console.log('DNS Records section shown');
        } else if (content === 'ladipage') {
            this.elements.ladipageSection.style.display = 'block';
            console.log('Ladipage section shown');
        }
    }

    closeRightPanel() {
        console.log('=== Closing Right Panel ===');
        
        // First hide the right panel
        this.elements.rightPanel.classList.remove('active');
        
        // Then contract the body after a slight delay
        setTimeout(() => {
            this.elements.body.classList.remove('expanded');
        }, 300);
        
        this.hideAllSections();
        this.currentPanel = null;
    }

    hideAllSections() {
        // Hide all content sections with null checking
        if (this.elements.whoisSection) this.elements.whoisSection.style.display = 'none';
        if (this.elements.ipInfoSection) this.elements.ipInfoSection.style.display = 'none';
        if (this.elements.dnsSection) this.elements.dnsSection.style.display = 'none';
        if (this.elements.ladipageSection) this.elements.ladipageSection.style.display = 'none';
        console.log('All sections hidden');
    }

    showError(message) {
        // Create a temporary error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (errorDiv.parentNode) {
                        errorDiv.parentNode.removeChild(errorDiv);
                    }
                }, 300);
            }
        }, 3000);
    }

    showSuccess(message) {
        // Create a temporary success notification
        const successDiv = document.createElement('div');
        successDiv.className = 'success-notification';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(successDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (successDiv.parentNode) {
                        successDiv.parentNode.removeChild(successDiv);
                    }
                }, 300);
            }
        }, 3000);
    }

    updateStatus(isOnline, message) {
        const statusIndicator = this.elements.statusIndicator;
        const statusText = this.elements.statusText;
        
        if (isOnline) {
            statusIndicator.className = 'status-indicator online';
            statusText.textContent = message || 'Đã kết nối';
        } else {
            statusIndicator.className = 'status-indicator offline';
            statusText.textContent = message || 'Chưa kết nối';
        }
    }

    // Legacy log functions - disabled since logSection was removed
    addLog(message, type = 'info') {
        console.log(`[LOG-${type.toUpperCase()}] ${message}`);
        // Log section removed, just output to console
    }

    clearLogs() {
        console.log('Clear logs called (no-op - log section removed)');
    }

    // Legacy progress functions - disabled since progressSection was removed  
    setProgress(percent, text) {
        console.log(`Progress: ${percent}% - ${text || 'Processing...'}`);
        // Progress section removed, just output to console
    }

    hideProgress() {
        console.log('Hide progress called (no-op - progress section removed)');
    }

    // Add smooth scrolling for menu section
    initializeScrolling() {
        const menuSection = this.elements.menuSection;
        if (menuSection) {
            // Add smooth scrolling behavior
            menuSection.style.scrollBehavior = 'smooth';
            
            // Add scroll indicators if needed
            this.updateScrollIndicators();
            
            menuSection.addEventListener('scroll', () => {
                this.updateScrollIndicators();
            });
        }
    }

    updateScrollIndicators() {
        const menuSection = this.elements.menuSection;
        const scrollTop = menuSection.scrollTop;
        const scrollHeight = menuSection.scrollHeight;
        const clientHeight = menuSection.clientHeight;
        
        // Add visual indicators for scrolling
        if (scrollTop > 0) {
            menuSection.classList.add('scrolled-top');
        } else {
            menuSection.classList.remove('scrolled-top');
        }
        
        if (scrollTop + clientHeight < scrollHeight - 5) {
            menuSection.classList.add('scrolled-bottom');
        } else {
            menuSection.classList.remove('scrolled-bottom');
        }
    }
}

// Export for use in main popup.js
window.UIManager = UIManager;
