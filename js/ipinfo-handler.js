// IP Info functionality
// Handles IP/Domain geographic information lookup using check-host.net API

class IpInfoHandler {
    constructor(elements) {
        this.elements = elements;
        this.isLoading = false;
    }

    async handleLookup() {
        const domain = this.elements.domainInput.value.trim();
        
        if (!domain) {
            this.showError('Vui lòng nhập tên miền hoặc IP');
            return;
        }

        if (this.isLoading) {
            console.log('IP Info lookup already in progress');
            return;
        }

        console.log('=== IP Info Lookup Started ===');
        console.log('Host:', domain);

        // Show right panel with IP Info title
        window.uiManager.showRightPanel('🌍 Thông tin IP/Domain', 'ipinfo');

        // Hiển thị loading state
        this.elements.ipInfoContainer.innerHTML = '<div class="ipinfo-loading">🌍 Đang tra cứu thông tin IP/Domain...</div>';
        
        // Set loading state
        this.setLoadingState(true);

        try {
            // Clean domain name
            const cleanHost = this.cleanHostName(domain);
            console.log('Clean host:', cleanHost);
            
            // Call background script for IP Info
            console.log('Sending IP Info message to background script...');
            const response = await this.sendMessage({ action: 'ipInfo', host: cleanHost });
            
            console.log('=== IP Info Response Received ===');
            console.log('Response:', response);
            
            if (response && response.success) {
                console.log('IP Info success, displaying data...');
                this.displayIpInfo(response.data, response.warning, response.source);
            } else {
                console.error('IP Info API error:', response);
                this.elements.ipInfoContainer.innerHTML = `<div class="ipinfo-error">❌ Lỗi: ${response?.error || 'Không thể tra cứu thông tin IP'}</div>`;
            }
        } catch (error) {
            console.error('IP Info error:', error);
            this.elements.ipInfoContainer.innerHTML = `<div class="ipinfo-error">❌ Lỗi: ${error.message}</div>`;
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(loading) {
        this.isLoading = loading;
        if (loading) {
            this.elements.ipInfoBtn.classList.add('loading');
            this.elements.ipInfoBtn.style.pointerEvents = 'none';
        } else {
            this.elements.ipInfoBtn.classList.remove('loading');
            this.elements.ipInfoBtn.style.pointerEvents = 'auto';
        }
    }

    async sendMessage(message) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Chrome runtime error:', chrome.runtime.lastError);
                    resolve({
                        success: false,
                        error: 'Lỗi kết nối với background script: ' + chrome.runtime.lastError.message
                    });
                } else {
                    resolve(response);
                }
            });
        });
    }

    cleanHostName(host) {
        // Remove protocol
        host = host.replace(/^https?:\/\//, '');
        
        // Remove www
        host = host.replace(/^www\./, '');
        
        // Remove path
        host = host.split('/')[0];
        
        // Remove port
        host = host.split(':')[0];
        
        return host.toLowerCase().trim();
    }

    displayIpInfo(data, warning, source) {
        let html = '';
        
        if (warning) {
            html += `<div class="ipinfo-warning">${warning}</div>`;
        }
        
        // Create IP info fields
        const fields = [
            { label: 'Host:', value: data.host, highlight: true },
            { label: 'IP Address:', value: data.ipAddress, highlight: true },
            { label: 'Hostname:', value: data.hostname },
            { label: 'IP Range:', value: data.ipRange },
            { label: 'ISP:', value: data.isp },
            { label: 'Organization:', value: data.organization },
            { label: 'Country:', value: data.country },
            { label: 'Region:', value: data.region },
            { label: 'City:', value: data.city },
            { label: 'Timezone:', value: data.timezone },
            { label: 'Local Time:', value: data.localTime },
            { label: 'Postal Code:', value: data.postalCode }
        ];
        
        // Filter out empty fields and create HTML
        const validFields = fields.filter(field => field.value && field.value.trim() !== '');
        
        if (validFields.length === 0) {
            html += '<div class="ipinfo-empty">❌ Không tìm thấy thông tin IP cho host này</div>';
        } else {
            validFields.forEach(field => {
                const highlightClass = field.highlight ? ' highlight' : '';
                html += `<div class="ipinfo-field${highlightClass}">
                    <div class="ipinfo-label">${field.label}</div>
                    <div class="ipinfo-value">${field.value}</div>
                </div>`;
            });
        }
        
        // Source info
        if (source) {
            html += `<div class="ipinfo-source">📡 Nguồn: ${source}</div>`;
        }
        
        this.elements.ipInfoContainer.innerHTML = html;
    }

    showError(message) {
        if (window.uiManager && window.uiManager.showError) {
            window.uiManager.showError(message);
        } else {
            alert(message);
        }
    }
}

// Export for use in main popup.js
window.IpInfoHandler = IpInfoHandler;
