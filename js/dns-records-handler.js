// DNS Records functionality
// Handles DNS records lookup using Google DNS-over-HTTPS API

class DnsRecordsHandler {
    constructor(elements) {
        this.elements = elements;
        this.isLookupInProgress = false;
    }

    handlePanelOpen() {
        const domain = this.elements.domainInput.value.trim();
        
        if (!domain) {
            this.showError('Vui lòng nhập tên miền');
            return;
        }

        console.log('=== DNS Records Panel Opened ===');
        console.log('Domain:', domain);

        // Show right panel with DNS Records title
        window.uiManager.showRightPanel('📋 Bản ghi DNS', 'dns');

        // Set default state
        this.elements.dnsContainer.innerHTML = '<div class="dns-empty">🔍 Chọn loại bản ghi và nhấn "Tra cứu" để xem kết quả</div>';
    }

    async handleLookup() {
        const domain = this.elements.domainInput.value.trim();
        const recordType = this.elements.recordTypeSelect.value;
        
        if (!domain) {
            this.showError('Vui lòng nhập tên miền');
            return;
        }

        if (this.isLookupInProgress) {
            console.log('DNS lookup already in progress');
            return;
        }

        console.log('=== DNS Lookup Started ===');
        console.log('Domain:', domain);
        console.log('Record Type:', recordType);

        // Hiển thị loading state
        this.elements.dnsContainer.innerHTML = `<div class="dns-loading">🔍 Đang tra cứu bản ghi ${recordType} cho ${domain}...</div>`;
        
        // Set loading state
        this.setLoadingState(true);

        try {
            // Clean domain name
            const cleanDomain = this.cleanDomainName(domain);
            console.log('Clean domain:', cleanDomain);
            
            // Call background script for DNS lookup
            console.log('Sending DNS lookup message to background script...');
            const response = await this.sendMessage({ 
                action: 'dnsLookup', 
                domain: cleanDomain, 
                recordType: recordType 
            });
            
            console.log('=== DNS Lookup Response Received ===');
            console.log('Response:', response);
            
            if (response && response.success) {
                console.log('DNS Lookup success, displaying data...');
                this.displayDnsRecords(response.data, recordType, cleanDomain, response.source);
            } else {
                console.error('DNS Lookup API error:', response);
                this.elements.dnsContainer.innerHTML = `<div class="dns-error">❌ Lỗi: ${response?.error || 'Không thể tra cứu bản ghi DNS'}</div>`;
            }
        } catch (error) {
            console.error('DNS Lookup error:', error);
            this.elements.dnsContainer.innerHTML = `<div class="dns-error">❌ Lỗi: ${error.message}</div>`;
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(loading) {
        this.isLookupInProgress = loading;
        if (loading) {
            this.elements.lookupDnsBtn.disabled = true;
            this.elements.lookupDnsBtn.textContent = '🔄 Đang tra cứu...';
        } else {
            this.elements.lookupDnsBtn.disabled = false;
            this.elements.lookupDnsBtn.textContent = '🔍 Tra cứu';
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

    cleanDomainName(domain) {
        // Remove protocol
        domain = domain.replace(/^https?:\/\//, '');
        
        // Remove www
        domain = domain.replace(/^www\./, '');
        
        // Remove path
        domain = domain.split('/')[0];
        
        // Remove port
        domain = domain.split(':')[0];
        
        return domain.toLowerCase().trim();
    }

    displayDnsRecords(records, recordType, domain, source) {
        let html = '';
        
        if (!records || records.length === 0) {
            html = `<div class="dns-empty">❌ Không tìm thấy bản ghi ${recordType} cho ${domain}</div>`;
        } else {
            // Summary
            html += `<div class="dns-summary">
                <div class="dns-summary-title">📊 Tóm tắt bản ghi ${recordType}</div>
                <div class="dns-summary-stats">
                    🔍 Domain: <strong>${domain}</strong><br>
                    📋 Loại: <strong>${recordType}</strong><br>
                    📊 Số lượng: <strong>${records.length} bản ghi</strong>
                </div>
            </div>`;
            
            // Header
            html += `<div class="dns-header">
                <div class="dns-record-type">Loại</div>
                <div class="dns-record-value" style="flex: 1; margin-right: 12px;">Giá trị</div>
                <div class="dns-record-ttl">TTL</div>
            </div>`;
            
            // Records
            records.forEach((record, index) => {
                const isHighlight = index % 2 === 0;
                html += `<div class="dns-record ${isHighlight ? 'highlight' : ''}">
                    <div class="dns-record-type">${record.type || recordType}</div>
                    <div class="dns-record-value">${this.formatDnsValue(record, recordType)}</div>
                    <div class="dns-record-ttl">${record.ttl || 'N/A'}</div>
                </div>`;
            });
        }
        
        // Source info
        if (source) {
            html += `<div class="dns-source">📡 Nguồn: ${source}</div>`;
        }
        
        this.elements.dnsContainer.innerHTML = html;
    }

    formatDnsValue(record, recordType) {
        switch (recordType) {
            case 'A':
            case 'AAAA':
                return record.address || record.value || record.data;
            
            case 'CNAME':
            case 'PTR':
                return record.target || record.value || record.data;
            
            case 'MX':
                const priority = record.priority || record.preference || '';
                const exchange = record.exchange || record.value || record.data;
                return priority ? `${priority} ${exchange}` : exchange;
            
            case 'NS':
                return record.nameserver || record.value || record.data;
            
            case 'TXT':
                let txtValue = record.text || record.value || record.data;
                if (Array.isArray(txtValue)) {
                    txtValue = txtValue.join(' ');
                }
                // Truncate long TXT records
                return txtValue.length > 100 ? txtValue.substring(0, 100) + '...' : txtValue;
            
            case 'SOA':
                const soa = record.value || record.data;
                if (typeof soa === 'object') {
                    return `${soa.mname || ''} ${soa.rname || ''} ${soa.serial || ''}`;
                }
                return soa;
            
            case 'SRV':
                const priority_srv = record.priority || '';
                const weight = record.weight || '';
                const port = record.port || '';
                const target_srv = record.target || record.value || record.data;
                return `${priority_srv} ${weight} ${port} ${target_srv}`.trim();
            
            case 'CAA':
                const flags = record.flags || '';
                const tag = record.tag || '';
                const value_caa = record.value || record.data;
                return `${flags} ${tag} ${value_caa}`.trim();
            
            case 'DS':
            case 'DNSKEY':
                return record.value || record.data || 'Complex record - see raw data';
            
            default:
                return record.value || record.data || record.address || 'Unknown format';
        }
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
window.DnsRecordsHandler = DnsRecordsHandler;
