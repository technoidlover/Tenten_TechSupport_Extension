// DNS Records Lookup functionality
// Handles DNS records lookup using Google DNS API

class DnsRecordsHandler {
    constructor(elements) {
        this.elements = elements;
        this.isLoading = false;
    }

    async handleLookup(domain = null) {
        // Get domain from parameter or from input
        const targetDomain = domain || (this.elements.dnsDomainInput ? this.elements.dnsDomainInput.value.trim() : '');
        
        console.log('=== DNS Records Handler Called ===');
        console.log('Target domain:', targetDomain);
        console.log('Elements available:', {
            dnsContainer: !!this.elements.dnsContainer,
            rightPanel: !!this.elements.rightPanel,
            recordTypeSelect: !!this.elements.recordTypeSelect
        });
        
        if (!targetDomain) {
            this.showError('Vui lòng nhập tên miền');
            return;
        }

        if (this.isLoading) {
            console.log('DNS lookup already in progress');
            return;
        }

        console.log('=== DNS Records Lookup Started ===');
        console.log('Domain:', targetDomain);

        // Get selected record type
        const recordType = this.elements.recordTypeSelect ? this.elements.recordTypeSelect.value : 'A';
        console.log('Record type:', recordType);

        // Show loading state in container
        console.log('Setting loading state...');
        this.elements.dnsContainer.innerHTML = '<div class="dns-loading">🔍 Đang tra cứu DNS records...</div>';
        
        // Set loading state
        this.setLoadingState(true);

        try {
            // Clean domain name
            const cleanDomain = this.cleanDomainName(targetDomain);
            console.log('Clean domain:', cleanDomain);
            
            // Lookup DNS records using Google DNS API
            console.log('Calling Google DNS API...');
            const dnsData = await this.lookupDnsRecords(cleanDomain, recordType);
            
            console.log('DNS API response:', dnsData);
            
            // Display results
            this.displayDnsResults(dnsData, cleanDomain, recordType);
            
        } catch (error) {
            console.error('DNS lookup error:', error);
            this.showError('Lỗi tra cứu DNS: ' + error.message);
        } finally {
            this.setLoadingState(false);
        }
    }

    async lookupDnsRecords(domain, recordType) {
        const apiUrl = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${recordType}`;
        
        console.log('DNS API URL:', apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    }

    displayDnsResults(data, domain, recordType) {
        console.log('Displaying DNS results for:', domain, recordType, data);
        
        let html = `
            <div class="dns-results">
                <div class="dns-header">
                    <h3>🔍 DNS Records cho ${domain}</h3>
                    <div class="dns-type">Loại: ${recordType}</div>
                </div>
        `;

        if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
            html += '<div class="dns-answers">';
            html += '<h4>📋 Kết quả:</h4>';
            
            data.Answer.forEach((record, index) => {
                const recordTypeName = this.getRecordTypeName(record.type);
                html += `
                    <div class="dns-record">
                        <div class="record-info">
                            <span class="record-type">${recordTypeName}</span>
                            <span class="record-data">${record.data}</span>
                        </div>
                        <div class="record-meta">
                            <span class="record-ttl">TTL: ${record.TTL}s</span>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        } else {
            html += '<div class="dns-no-results">❌ Không tìm thấy DNS records cho domain này</div>';
        }

        // Add additional info if available
        if (data.Additional && data.Additional.length > 0) {
            html += '<div class="dns-additional">';
            html += '<h4>ℹ️ Thông tin bổ sung:</h4>';
            data.Additional.forEach(record => {
                const recordTypeName = this.getRecordTypeName(record.type);
                html += `
                    <div class="dns-record additional">
                        <span class="record-type">${recordTypeName}</span>
                        <span class="record-data">${record.data}</span>
                        <span class="record-ttl">TTL: ${record.TTL}s</span>
                    </div>
                `;
            });
            html += '</div>';
        }

        html += `
                <div class="dns-footer">
                    <div class="query-time">⏱️ Thời gian truy vấn: ${new Date().toLocaleTimeString('vi-VN')}</div>
                </div>
            </div>
        `;

        this.elements.dnsContainer.innerHTML = html;
    }

    getRecordTypeName(type) {
        const typeMap = {
            1: 'A',
            2: 'NS', 
            5: 'CNAME',
            6: 'SOA',
            15: 'MX',
            16: 'TXT',
            28: 'AAAA',
            33: 'SRV'
        };
        return typeMap[type] || `TYPE${type}`;
    }

    cleanDomainName(domain) {
        return domain
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '')
            .replace(/\/$/, '')
            .toLowerCase()
            .trim();
    }

    showError(message) {
        console.error('DNS Error:', message);
        this.elements.dnsContainer.innerHTML = `
            <div class="dns-error">
                <div class="error-icon">❌</div>
                <div class="error-message">${message}</div>
                <div class="error-time">${new Date().toLocaleTimeString('vi-VN')}</div>
            </div>
        `;
    }

    setLoadingState(loading) {
        this.isLoading = loading;
        
        if (this.elements.dnsSubmitBtn) {
            this.elements.dnsSubmitBtn.disabled = loading;
            this.elements.dnsSubmitBtn.textContent = loading ? 'Đang tra cứu...' : 'Tra cứu DNS';
        }
        
        if (this.elements.dnsDomainInput) {
            this.elements.dnsDomainInput.disabled = loading;
        }
        
        if (this.elements.recordTypeSelect) {
            this.elements.recordTypeSelect.disabled = loading;
        }
    }
}

// Export for use in popup-main.js
window.DnsRecordsHandler = DnsRecordsHandler;
