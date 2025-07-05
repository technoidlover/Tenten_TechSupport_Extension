// Popup script để xử lý UI và giao tiếp với content script
document.addEventListener('DOMContentLoaded', function() {
    const domainInput = document.getElementById('domainInput');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const dnsAutomationBtn = document.getElementById('dnsAutomation');
    const whoisLookupBtn = document.getElementById('whoisLookup');
    const ipInfoBtn = document.getElementById('ipInfo');
    const dnsRecordsBtn = document.getElementById('dnsRecords');
    const progressSection = document.getElementById('progressSection');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const logSection = document.getElementById('logSection');
    const logContainer = document.getElementById('logContainer');
    const whoisSection = document.getElementById('whoisSection');
    const whoisContainer = document.getElementById('whoisContainer');
    const ipInfoSection = document.getElementById('ipInfoSection');
    const ipInfoContainer = document.getElementById('ipInfoContainer');
    const dnsSection = document.getElementById('dnsSection');
    const dnsContainer = document.getElementById('dnsContainer');
    const recordTypeSelect = document.getElementById('recordType');
    const lookupDnsBtn = document.getElementById('lookupDnsBtn');
    const helpLink = document.getElementById('helpLink');
    const stopButton = document.getElementById('stopButton');
    const portCheckerBtn = document.getElementById('portChecker');
    const portSection = document.getElementById('portSection');
    
    // Right panel elements
    const rightPanel = document.getElementById('rightPanel');
    const rightPanelTitle = document.getElementById('rightPanelTitle');
    const rightPanelContent = document.getElementById('rightPanelContent');
    const closePanelBtn = document.getElementById('closePanelBtn');
    const body = document.body;

    // Global variable để track automation
    let currentTabId = null;

    // Lưu và tải domain từ storage
    loadSavedDomain();
    checkTentenPageStatus();
    
    // Set initial states
    dnsAutomationBtn.classList.add('disabled');
    dnsAutomationBtn.style.pointerEvents = 'none';
    const dnsStatus = dnsAutomationBtn.querySelector('.menu-status');
    if (dnsStatus) {
        dnsStatus.textContent = 'TENTEN';
        dnsStatus.className = 'menu-status needs-tenten';
    }
    
    whoisLookupBtn.classList.remove('disabled');
    whoisLookupBtn.style.pointerEvents = 'auto';

    ipInfoBtn.classList.remove('disabled');
    ipInfoBtn.style.pointerEvents = 'auto';

    dnsRecordsBtn.classList.remove('disabled');
    dnsRecordsBtn.style.pointerEvents = 'auto';

    // Event listeners
    domainInput.addEventListener('input', saveDomain);
    dnsAutomationBtn.addEventListener('click', handleDnsAutomation);
    whoisLookupBtn.addEventListener('click', handleWhoisLookup);
    ipInfoBtn.addEventListener('click', handleIpInfo);
    dnsRecordsBtn.addEventListener('click', handleDnsRecords);
    lookupDnsBtn.addEventListener('click', handleDnsLookup);
    helpLink.addEventListener('click', showHelp);
    closePanelBtn.addEventListener('click', closeRightPanel);
    portCheckerBtn.addEventListener('click', handlePortChecker);
    
    // Global stop function để có thể gọi từ HTML
    window.stopAutomation = stopAutomation;

    // Kiểm tra xem người dùng có đang ở trang Tenten không
    async function checkTentenPageStatus() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (tab.url && tab.url.includes('domain.tenten.vn')) {
                updateStatus(true, 'Đã kết nối với Tenten');
                
                // Enable DNS Automation button
                dnsAutomationBtn.classList.remove('disabled');
                dnsAutomationBtn.style.pointerEvents = 'auto';
                const dnsStatus = dnsAutomationBtn.querySelector('.menu-status');
                if (dnsStatus) {
                    dnsStatus.textContent = 'READY';
                    dnsStatus.className = 'menu-status ready';
                }
                
                // Kiểm tra CSRF token
                chrome.tabs.sendMessage(tab.id, { action: 'checkCsrfToken' }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.log('Content script not ready yet');
                        updateStatus(true, 'Đã kết nối với Tenten');
                        return;
                    }
                    
                    if (response && response.hasToken) {
                        updateStatus(true, 'Sẵn sàng thực thi');
                    } else {
                        updateStatus(false, 'Cần truy cập trang DNS Settings');
                    }
                });
            } else {
                updateStatus(false, 'WHOIS sẵn sàng, DNS cần Tenten');
                
                // Disable DNS Automation button
                dnsAutomationBtn.classList.add('disabled');
                dnsAutomationBtn.style.pointerEvents = 'none';
                const dnsStatus = dnsAutomationBtn.querySelector('.menu-status');
                if (dnsStatus) {
                    dnsStatus.textContent = 'TENTEN';
                    dnsStatus.className = 'menu-status needs-tenten';
                }
            }
            
            // WHOIS luôn available
            whoisLookupBtn.classList.remove('disabled');
            whoisLookupBtn.style.pointerEvents = 'auto';
            
        } catch (error) {
            updateStatus(false, 'Lỗi kết nối');
            dnsAutomationBtn.classList.add('disabled');
            dnsAutomationBtn.style.pointerEvents = 'none';
            const dnsStatus = dnsAutomationBtn.querySelector('.menu-status');
            if (dnsStatus) {
                dnsStatus.textContent = 'TENTEN';
                dnsStatus.className = 'menu-status needs-tenten';
            }
        }
    }

    function updateStatus(isOnline, message) {
        statusIndicator.className = `status-indicator ${isOnline ? 'online' : 'offline'}`;
        statusText.textContent = message;
    }

    function loadSavedDomain() {
        chrome.storage.local.get(['savedDomain'], (result) => {
            if (result.savedDomain) {
                domainInput.value = result.savedDomain;
            }
        });
    }

    function saveDomain() {
        chrome.storage.local.set({ savedDomain: domainInput.value });
    }

    async function handleDnsAutomation() {
        // Kiểm tra nếu button bị disabled
        if (dnsAutomationBtn.classList.contains('disabled')) {
            showError('Vui lòng truy cập domain.tenten.vn trước khi sử dụng DNS Automation');
            return;
        }
        
        const domain = domainInput.value.trim();
        
        if (!domain) {
            showError('Vui lòng nhập tên miền');
            return;
        }

        try {
            // Kiểm tra tab hiện tại
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.url || !tab.url.includes('domain.tenten.vn')) {
                showError('Vui lòng truy cập trang domain.tenten.vn trước');
                return;
            }

            // Kiểm tra content script có sẵn sàng không
            addLog('Kiểm tra kết nối với trang web...', 'info');
            
            chrome.tabs.sendMessage(tab.id, { action: 'ping' }, (response) => {
                if (chrome.runtime.lastError) {
                    addLog('❌ Content script chưa sẵn sàng, đang inject...', 'warning');
                    
                    // Inject content script nếu chưa có
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content.js']
                    }).then(() => {
                        addLog('✅ Content script đã được inject', 'success');
                        // Thử lại sau 500ms (giảm từ 1 giây)
                        setTimeout(() => startAutomation(domain, tab.id), 500);
                    }).catch((error) => {
                        showError('Không thể inject content script: ' + error.message);
                        resetUI();
                    });
                } else {
                    addLog('✅ Kết nối trang web thành công', 'success');
                    startAutomation(domain, tab.id);
                }
            });
            
        } catch (error) {
            showError('Lỗi khi kiểm tra tab: ' + error.message);
            resetUI();
        }
    }

    function stopAutomation() {
        if (currentTabId) {
            addLog('🛑 Đang dừng automation...', 'warning');
            
            chrome.tabs.sendMessage(currentTabId, { action: 'stopAutomation' }, (response) => {
                if (chrome.runtime.lastError) {
                    addLog('⚠️ Không thể gửi lệnh dừng: ' + chrome.runtime.lastError.message, 'warning');
                } else {
                    addLog('✅ Lệnh dừng đã được gửi', 'success');
                }
                resetUI();
            });
        } else {
            addLog('⚠️ Không có automation nào đang chạy', 'warning');
            resetUI();
        }
    }

    function autoReloadPage(delay = 1000) {
        if (currentTabId) {
            addLog(`🔄 Tự động reload trang sau ${delay/1000} giây...`, 'info');
            
            setTimeout(() => {
                chrome.tabs.reload(currentTabId, () => {
                    if (chrome.runtime.lastError) {
                        addLog('⚠️ Không thể reload trang: ' + chrome.runtime.lastError.message, 'warning');
                    } else {
                        addLog('✅ Trang đã được reload để kiểm tra kết quả', 'success');
                        
                        // Đợi 1 giây rồi check lại status (giảm từ 2 giây)
                        setTimeout(() => {
                            checkTentenPageStatus();
                        }, 1000);
                    }
                });
            }, delay);
        }
    }

    function startAutomation(domain, tabId) {
        // Lưu tabId để có thể stop
        currentTabId = tabId;
        
        // Hiển thị progress
        progressSection.style.display = 'block';
        logSection.style.display = 'block';
        
        // Disable button và add loading state
        dnsAutomationBtn.classList.add('loading');
        dnsAutomationBtn.style.pointerEvents = 'none';
        
        // Hiện nút stop
        if (stopButton) stopButton.style.display = 'inline-block';

        // Clear log
        logContainer.innerHTML = '';
        
        // Gửi message đến content script
        chrome.tabs.sendMessage(tabId, {
            action: 'startDnsAutomation',
            domain: domain
        }, (response) => {
            if (chrome.runtime.lastError) {
                showError('Lỗi giao tiếp với trang web: ' + chrome.runtime.lastError.message);
                addLog('Debug: ' + chrome.runtime.lastError.message, 'error');
                resetUI();
                return;
            }
            
            if (response && response.success) {
                addLog('✅ Bắt đầu quá trình DNS automation...', 'success');
            } else {
                showError('Không thể bắt đầu automation - response: ' + JSON.stringify(response));
                resetUI();
            }
        });
    }

    function updateProgress(percent, message) {
        progressFill.style.width = percent + '%';
        progressText.textContent = message;
    }

    function addLog(message, type = 'info') {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    function showError(message) {
        addLog(`❌ ${message}`, 'error');
    }

    function resetUI() {
        currentTabId = null;
        dnsAutomationBtn.classList.remove('loading');
        dnsAutomationBtn.style.pointerEvents = 'auto';
        updateProgress(0, 'Sẵn sàng');
        
        // Ẩn nút stop
        if (stopButton) stopButton.style.display = 'none';
    }

    function showHelp() {
        addLog('=== HƯỚNG DẪN SỬ DỤNG ===', 'info');
        addLog('--- DNS AUTOMATION ---', 'info');
        addLog('1. Truy cập domain.tenten.vn và đăng nhập', 'info');
        addLog('2. Vào trang DNS Settings của domain', 'info');
        addLog('3. Nhập tên miền và click DNS Automation', 'info');
        addLog('4. Extension sẽ tự động tạo CNAME và REDIRECT trong ~30s', 'info');
        addLog('5. Trang sẽ tự động reload sau 1 giây khi hoàn thành', 'info');
        addLog('--- WHOIS LOOKUP ---', 'info');
        addLog('1. Nhập tên miền cần tra cứu', 'info');
        addLog('2. Click WHOIS Lookup để xem thông tin đăng ký', 'info');
        addLog('3. Thông tin bao gồm: ngày đăng ký, hết hạn, chủ sở hữu, etc.', 'info');
    }

    async function handleWhoisLookup() {
        const domain = domainInput.value.trim();
        
        if (!domain) {
            showError('Vui lòng nhập tên miền');
            return;
        }

        console.log('=== WHOIS Lookup Started ===');
        console.log('Domain:', domain);

        // Show right panel with WHOIS title
        showRightPanel('🔍 Thông tin WHOIS', 'whois');

        // Hiển thị loading state
        whoisContainer.innerHTML = '<div class="whois-loading">🔍 Đang tra cứu thông tin WHOIS...</div>';
        
        // Disable button
        whoisLookupBtn.classList.add('loading');
        whoisLookupBtn.style.pointerEvents = 'none';

        try {
            // Clean domain name (remove http/https, www, etc.)
            const cleanDomain = cleanDomainName(domain);
            console.log('Clean domain:', cleanDomain);
            
            // Call background script for WHOIS
            console.log('Sending message to background script...');
            chrome.runtime.sendMessage(
                { action: 'whoisLookup', domain: cleanDomain },
                (response) => {
                    console.log('=== WHOIS Response Received ===');
                    console.log('Chrome runtime error:', chrome.runtime.lastError);
                    console.log('Response:', response);
                    
                    if (chrome.runtime.lastError) {
                        console.error('Chrome runtime error:', chrome.runtime.lastError);
                        throw new Error('Lỗi kết nối với background script: ' + chrome.runtime.lastError.message);
                    }
                    
                    if (response && response.success) {
                        console.log('WHOIS success, displaying data...');
                        displayWhoisInfo(response.data, response.warning, response.source);
                    } else {
                        console.error('WHOIS failed:', response);
                        throw new Error(response?.error || 'Không thể lấy thông tin WHOIS');
                    }
                    
                    // Re-enable button
                    whoisLookupBtn.classList.remove('loading');
                    whoisLookupBtn.style.pointerEvents = 'auto';
                }
            );

        } catch (error) {
            console.error('WHOIS Error:', error);
            whoisContainer.innerHTML = `<div class="whois-error">❌ Lỗi: ${error.message}</div>`;
            
            // Re-enable button
            whoisLookupBtn.classList.remove('loading');
            whoisLookupBtn.style.pointerEvents = 'auto';
        }
    }

    function cleanDomainName(domain) {
        // Remove protocol
        domain = domain.replace(/^https?:\/\//, '');
        // Remove www
        domain = domain.replace(/^www\./, '');
        // Remove trailing slash and path
        domain = domain.split('/')[0];
        // Remove port if any
        domain = domain.split(':')[0];
        
        return domain.toLowerCase();
    }

    function displayWhoisInfo(whoisData, warning = null, source = null) {
        const fields = [
            { label: 'Tên miền:', value: whoisData.domainName || 'N/A' },
            { label: 'Ngày đăng ký:', value: formatDate(whoisData.creationDate) || 'N/A' },
            { label: 'Ngày hết hạn:', value: formatDate(whoisData.expirationDate) || 'N/A' },
            { label: 'Chủ sở hữu:', value: whoisData.registrantName || whoisData.registrant?.name || 'N/A' },
            { label: 'Cờ trạng thái:', value: formatStatusFlags(whoisData.status) || 'N/A' },
            { label: 'Nơi đăng ký:', value: whoisData.registrarName || whoisData.registrar?.name || 'N/A' },
            { label: 'Nameserver:', value: formatNameservers(whoisData.nameServers) || 'N/A' }
        ];

        let whoisHtml = fields.map(field => `
            <div class="whois-field">
                <div class="whois-label">${field.label}</div>
                <div class="whois-value">${field.value}</div>
            </div>
        `).join('');

        if (warning) {
            whoisHtml = `<div class="whois-warning">⚠️ ${warning}</div>` + whoisHtml;
        }
        
        if (source) {
            whoisHtml += `<div class="whois-source">📡 Nguồn: ${source}</div>`;
        }

        whoisContainer.innerHTML = whoisHtml;
    }

    function formatDate(dateString) {
        if (!dateString || dateString === 'N/A') return 'N/A';
        
        try {
            // Handle DD/MM/YYYY format from Tenten
            if (dateString.includes('/')) {
                const parts = dateString.split('/');
                if (parts.length === 3) {
                    // Check if it's DD/MM/YYYY format (day first)
                    const day = parseInt(parts[0]);
                    const month = parseInt(parts[1]);
                    const year = parseInt(parts[2]);
                    
                    // Validate ranges
                    if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900) {
                        // Create date in YYYY-MM-DD format for proper parsing
                        const isoDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                        const date = new Date(isoDate);
                        
                        // Verify the date is valid
                        if (!isNaN(date.getTime())) {
                            return date.toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            });
                        }
                    }
                }
            }
            
            // Try parsing as-is for other formats
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date.toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
            }
            
            // If parsing fails, return original string
            return dateString;
        } catch (error) {
            console.log('Date formatting error:', error, 'for date:', dateString);
            return dateString;
        }
    }

    function formatStatusFlags(status) {
        if (!status) return 'N/A';
        
        if (Array.isArray(status)) {
            return status.join(', ');
        }
        
        return status;
    }

    function formatNameservers(nameservers) {
        if (!nameservers) return 'N/A';
        
        if (Array.isArray(nameservers)) {
            return nameservers.join(', ');
        }
        
        return nameservers;
    }

    function displayDnsRecords(records, recordType, domain, source) {
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
                    <div class="dns-record-value">${formatDnsValue(record, recordType)}</div>
                    <div class="dns-record-ttl">${record.ttl || 'N/A'}</div>
                </div>`;
            });
        }
        
        // Source info
        if (source) {
            html += `<div class="dns-source">📡 Nguồn: ${source}</div>`;
        }
        
        dnsContainer.innerHTML = html;
    }

    function formatDnsValue(record, recordType) {
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

    // Lắng nghe messages từ content script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('Popup received message:', message);
        
        if (message.action === 'updateProgress') {
            updateProgress(message.percent, message.message);
        } else if (message.action === 'addLog') {
            addLog(message.message, message.type);
        } else if (message.action === 'automationComplete') {
            if (message.success) {
                updateProgress(100, 'Hoàn thành!');
                addLog('✅ DNS Automation Ladipage hoàn thành thành công!', 'success');
                addLog('🌐 Domain đã được cấu hình trỏ về Ladipage', 'success');
                
                // Auto reload sau 1 giây khi thành công (giảm từ 3 giây)
                autoReloadPage(1000);
                
                // Reset UI sau khi auto reload (giảm từ 4 giây)
                setTimeout(() => {
                    resetUI();
                }, 2000);
                
            } else if (message.stopped) {
                updateProgress(0, 'Đã dừng');
                addLog('⛔ Automation đã được dừng bởi người dùng', 'warning');
                addLog('📖 Không reload để bạn có thể đọc log', 'info');
                resetUI();
                
            } else {
                // Có lỗi - không auto reload để user đọc lỗi
                updateProgress(0, 'Thất bại');
                addLog('❌ DNS Automation thất bại', 'error');
                addLog('📖 Không reload để bạn có thể đọc chi tiết lỗi', 'warning');
                resetUI();
            }
        }
        
        // Luôn return true để giữ kết nối mở
        return true;
    });

    // IP Info functionality
    function handleIpInfo() {
        const host = domainInput.value.trim();
        if (!host) {
            showError('Vui lòng nhập tên miền hoặc IP address');
            return;
        }

        console.log('=== IP Info Lookup Started ===');
        console.log('Host:', host);

        // Show right panel with IP Info title
        showRightPanel('🌍 Thông tin IP/Domain', 'ipinfo');

        // Show loading
        ipInfoContainer.innerHTML = '<div class="ipinfo-loading">🔍 Đang tra cứu thông tin IP/Domain...</div>';
        
        // Disable button
        ipInfoBtn.classList.add('loading');
        ipInfoBtn.style.pointerEvents = 'none';

        console.log('Sending IP Info request for:', host);

        // Send message to background script
        chrome.runtime.sendMessage(
            { action: 'ipInfo', host: host },
            (response) => {
                console.log('=== IP Info Response Received ===');
                console.log('Chrome runtime error:', chrome.runtime.lastError);
                console.log('Response:', response);
                
                if (chrome.runtime.lastError) {
                    console.error('Chrome runtime error:', chrome.runtime.lastError);
                    ipInfoContainer.innerHTML = `<div class="ipinfo-error">❌ Lỗi kết nối với background script: ${chrome.runtime.lastError.message}</div>`;
                } else if (response && response.success) {
                    console.log('IP Info success, displaying data...');
                    displayIpInfo(response.data, response.warning, response.source);
                } else {
                    console.error('IP Info API error:', response);
                    ipInfoContainer.innerHTML = `<div class="ipinfo-error">❌ Lỗi: ${response?.error || 'Không thể tra cứu thông tin IP'}</div>`;
                }
                
                // Re-enable button
                ipInfoBtn.classList.remove('loading');
                ipInfoBtn.style.pointerEvents = 'auto';
            }
        );
    }

    async function handleDnsRecords() {
        const domain = domainInput.value.trim();
        
        if (!domain) {
            showError('Vui lòng nhập tên miền');
            return;
        }

        console.log('=== DNS Records Panel Opened ===');
        console.log('Domain:', domain);

        // Show right panel with DNS Records title
        showRightPanel('📋 Bản ghi DNS', 'dns');

        // Set default state
        dnsContainer.innerHTML = '<div class="dns-empty">🔍 Chọn loại bản ghi và nhấn "Tra cứu" để xem kết quả</div>';
    }

    async function handleDnsLookup() {
        const domain = domainInput.value.trim();
        const recordType = recordTypeSelect.value;
        
        if (!domain) {
            showError('Vui lòng nhập tên miền');
            return;
        }

        console.log('=== DNS Lookup Started ===');
        console.log('Domain:', domain);
        console.log('Record Type:', recordType);

        // Hiển thị loading state
        dnsContainer.innerHTML = `<div class="dns-loading">🔍 Đang tra cứu bản ghi ${recordType} cho ${domain}...</div>`;
        
        // Disable button
        lookupDnsBtn.disabled = true;
        lookupDnsBtn.textContent = '🔄 Đang tra cứu...';

        try {
            // Clean domain name
            const cleanDomain = cleanDomainName(domain);
            console.log('Clean domain:', cleanDomain);
            
            // Call background script for DNS lookup
            console.log('Sending DNS lookup message to background script...');
            chrome.runtime.sendMessage(
                { action: 'dnsLookup', domain: cleanDomain, recordType: recordType },
                (response) => {
                    console.log('=== DNS Lookup Response Received ===');
                    console.log('Chrome runtime error:', chrome.runtime.lastError);
                    console.log('Response:', response);
                    
                    if (chrome.runtime.lastError) {
                        console.error('Chrome runtime error:', chrome.runtime.lastError);
                        dnsContainer.innerHTML = `<div class="dns-error">❌ Lỗi kết nối với background script: ${chrome.runtime.lastError.message}</div>`;
                    } else if (response && response.success) {
                        console.log('DNS Lookup success, displaying data...');
                        displayDnsRecords(response.data, recordType, cleanDomain, response.source);
                    } else {
                        console.error('DNS Lookup API error:', response);
                        dnsContainer.innerHTML = `<div class="dns-error">❌ Lỗi: ${response?.error || 'Không thể tra cứu bản ghi DNS'}</div>`;
                    }
                    
                    // Re-enable button
                    lookupDnsBtn.disabled = false;
                    lookupDnsBtn.textContent = '🔍 Tra cứu';
                }
            );
        } catch (error) {
            console.error('DNS Lookup error:', error);
            dnsContainer.innerHTML = `<div class="dns-error">❌ Lỗi: ${error.message}</div>`;
            
            // Re-enable button
            lookupDnsBtn.disabled = false;
            lookupDnsBtn.textContent = '🔍 Tra cứu';
        }
    }

    function hideAllSections() {
        progressSection.style.display = 'none';
        logSection.style.display = 'none';
        whoisSection.style.display = 'none';
        ipInfoSection.style.display = 'none';
        dnsSection.style.display = 'none';
        portSection.style.display = 'none';
    }

    function displayIpInfo(data, warning, source) {
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

        for (const field of fields) {
            if (field.value && field.value !== 'N/A' && field.value !== 'Không có thông tin') {
                const highlightClass = field.highlight ? ' highlight' : '';
                html += `
                    <div class="ipinfo-field${highlightClass}">
                        <div class="ipinfo-label">${field.label}</div>
                        <div class="ipinfo-value">${field.value}</div>
                    </div>
                `;
            }
        }
        
        if (html === '' || (warning && html === `<div class="ipinfo-warning">${warning}</div>`)) {
            html += '<div class="ipinfo-empty">Không có thông tin IP/Domain</div>';
        }
        
        if (source) {
            html += `<div class="ipinfo-source">📡 Nguồn: ${source}</div>`;
        }
        
        ipInfoContainer.innerHTML = html;
    }

    // Refresh status mỗi 5 giây
    setInterval(checkTentenPageStatus, 5000);

    function showRightPanel(title, content) {
        console.log('=== Showing Right Panel ===');
        console.log('Title:', title);
        console.log('Content type:', content);
        
        rightPanelTitle.textContent = title;
        
        // First expand the body
        body.classList.add('expanded');
        
        // Then show the right panel with a slight delay for smooth transition
        setTimeout(() => {
            rightPanel.classList.add('active');
        }, 100);
        
        // Hide all content sections first
        hideAllSections();
        
        // Show the requested content
        if (content === 'whois') {
            whoisSection.style.display = 'block';
            console.log('WHOIS section shown');
        } else if (content === 'ipinfo') {
            ipInfoSection.style.display = 'block';
            console.log('IP Info section shown');
        } else if (content === 'dns') {
            dnsSection.style.display = 'block';
            console.log('DNS Records section shown');
        } else if (content === 'port') {
            portSection.style.display = 'block';
            console.log('Port Checker section shown');
        }
    }

    function closeRightPanel() {
        console.log('=== Closing Right Panel ===');
        
        // First hide the right panel
        rightPanel.classList.remove('active');
        
        // Then contract the body after a slight delay
        setTimeout(() => {
            body.classList.remove('expanded');
        }, 300);
        
        hideAllSections();
    }

    async function handlePortChecker() {
        console.log('=== Port Checker Started ===');
        
        // Show right panel with Port Checker title
        showRightPanel('🔌 Port Checker', 'port');
        
        // Clear previous results and initialize
        const portContainer = document.getElementById('portContainer');
        if (portContainer) {
            portContainer.innerHTML = '<div class="port-empty">🔌 Nhập IP/domain và port để kiểm tra kết nối</div>';
        }
        
        // Ensure port checker handler is available
        let attempts = 0;
        const maxAttempts = 10;
        
        const waitForHandler = () => {
            attempts++;
            
            if (typeof window.portCheckerHandler !== 'undefined') {
                console.log('Port Checker Handler found, initializing event listeners...');
                window.portCheckerHandler.initEventListeners();
                console.log('Port Checker ready to use!');
                return;
            }
            
            if (attempts < maxAttempts) {
                console.log(`Waiting for Port Checker Handler... (attempt ${attempts}/${maxAttempts})`);
                setTimeout(waitForHandler, 100);
            } else {
                console.error('Port Checker Handler failed to initialize after maximum attempts');
                // Try to create it manually
                try {
                    console.log('Creating Port Checker Handler manually...');
                    window.portCheckerHandler = new PortCheckerHandler();
                    window.portCheckerHandler.initEventListeners();
                    console.log('Port Checker Handler created manually and ready!');
                } catch (error) {
                    console.error('Failed to create Port Checker Handler manually:', error);
                    // Show error in UI
                    if (portContainer) {
                        portContainer.innerHTML = '<div class="port-error">❌ Lỗi khởi tạo Port Checker. Vui lòng thử lại.</div>';
                    }
                }
            }
        };
        
        waitForHandler();
    }
});
