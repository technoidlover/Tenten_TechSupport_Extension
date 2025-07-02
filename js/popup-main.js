// Main Popup Script - Refactored with modular components
// This is the main entry point that coordinates all functionality modules

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Popup Script Loading ===');
    
    // Get all DOM elements
    const elements = {
        // Input elements
        domainInput: document.getElementById('domainInput'),
        
        // Status elements
        statusIndicator: document.getElementById('statusIndicator'),
        statusText: document.getElementById('statusText'),
        
        // Menu buttons
        dnsAutomationBtn: document.getElementById('dnsAutomation'),
        whoisLookupBtn: document.getElementById('whoisLookup'),
        ipInfoBtn: document.getElementById('ipInfo'),
        dnsRecordsBtn: document.getElementById('dnsRecords'),
        helpLink: document.getElementById('helpLink'),
        stopButton: document.getElementById('stopButton'),
        
        // Progress and log elements
        progressSection: document.getElementById('progressSection'),
        progressFill: document.getElementById('progressFill'),
        progressText: document.getElementById('progressText'),
        logSection: document.getElementById('logSection'),
        logContainer: document.getElementById('logContainer'),
        
        // Content sections
        whoisSection: document.getElementById('whoisSection'),
        whoisContainer: document.getElementById('whoisContainer'),
        ipInfoSection: document.getElementById('ipInfoSection'),
        ipInfoContainer: document.getElementById('ipInfoContainer'),
        dnsSection: document.getElementById('dnsSection'),
        dnsContainer: document.getElementById('dnsContainer'),
        
        // DNS specific elements
        recordTypeSelect: document.getElementById('recordType'),
        lookupDnsBtn: document.getElementById('lookupDnsBtn'),
        
        // Right panel elements
        rightPanel: document.getElementById('rightPanel'),
        rightPanelTitle: document.getElementById('rightPanelTitle'),
        rightPanelContent: document.getElementById('rightPanelContent'),
        closePanelBtn: document.getElementById('closePanelBtn'),
        
        // Layout elements
        body: document.body,
        menuSection: document.querySelector('.menu-section')
    };

    // Initialize UI Manager
    window.uiManager = new UIManager(elements);
    
    // Initialize handlers
    const whoisHandler = new WhoisHandler(elements);
    const ipInfoHandler = new IpInfoHandler(elements);
    const dnsRecordsHandler = new DnsRecordsHandler(elements);
    
    // Global variable để track automation
    let currentTabId = null;

    // Initialize application
    init();

    async function init() {
        console.log('=== Initializing Popup v1.6.2 ===');
        
        // Load saved domain
        await loadSavedDomain();
        
        // Check Tenten page status IMMEDIATELY when popup opens
        console.log('🚀 Immediate Tenten status check on popup open...');
        await checkTentenPageStatus();
        
        // Set initial states
        setInitialStates();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize UI features
        window.uiManager.initializeScrolling();
        
        // Setup tab listener for future updates
        setupTabListener();
        
        console.log('=== Popup Initialized v1.6.4 INSTANT ===');
    }

    function setupTabListener() {
        console.log('Setting up ULTRA INSTANT tab listeners v1.6.4 - ZERO DELAYS...');
        
        // Listen for tab updates - INSTANT CHECK (no conditions)
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            console.log('Tab updated event:', { tabId, status: changeInfo.status, url: tab.url });
            // Check IMMEDIATELY for any tab update - zero delay, no status filtering
            checkTentenPageStatus();
        });

        // Listen for tab activation - INSTANT CHECK
        chrome.tabs.onActivated.addListener((activeInfo) => {
            console.log('Tab activated event:', activeInfo.tabId);
            // IMMEDIATE check when tab activated - absolute zero delay
            checkTentenPageStatus();
        });
        
        // Window focus detection - INSTANT CHECK
        chrome.windows.onFocusChanged.addListener((windowId) => {
            if (windowId !== chrome.windows.WINDOW_ID_NONE) {
                console.log('Window focused - instant check');
                checkTentenPageStatus();
            }
        });
        
        // Popup visibility change - INSTANT CHECK
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                console.log('Popup visible - instant check');
                checkTentenPageStatus();
            }
        });

        // Page navigation detection via beforeunload
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.url) {
                console.log('URL changed - instant check');
                checkTentenPageStatus();
            }
        });
        
        console.log('✅ ULTRA INSTANT listeners v1.6.4 setup complete');
    }

    async function loadSavedDomain() {
        try {
            const savedDomain = await DomainUtils.loadSavedDomain();
            if (savedDomain) {
                elements.domainInput.value = savedDomain;
                console.log('Loaded saved domain:', savedDomain);
            }
        } catch (error) {
            console.error('Error loading saved domain:', error);
        }
    }

    function setInitialStates() {
        // DNS Automation - requires Tenten page
        elements.dnsAutomationBtn.classList.add('disabled');
        elements.dnsAutomationBtn.style.pointerEvents = 'none';
        const dnsStatus = elements.dnsAutomationBtn.querySelector('.menu-status');
        if (dnsStatus) {
            dnsStatus.textContent = 'TENTEN';
            dnsStatus.className = 'menu-status needs-tenten';
        }
        
        // Enable ready features
        elements.whoisLookupBtn.classList.remove('disabled');
        elements.whoisLookupBtn.style.pointerEvents = 'auto';
        
        elements.ipInfoBtn.classList.remove('disabled');
        elements.ipInfoBtn.style.pointerEvents = 'auto';
        
        elements.dnsRecordsBtn.classList.remove('disabled');
        elements.dnsRecordsBtn.style.pointerEvents = 'auto';
    }

    function setupEventListeners() {
        // Domain input with debounced save
        const debouncedSave = DomainUtils.debounce((domain) => {
            DomainUtils.saveDomain(domain);
        }, 500);
        
        elements.domainInput.addEventListener('input', (e) => {
            debouncedSave(e.target.value);
        });
        
        // Menu button event listeners
        elements.dnsAutomationBtn.addEventListener('click', handleDnsAutomation);
        elements.whoisLookupBtn.addEventListener('click', () => whoisHandler.handleLookup());
        elements.ipInfoBtn.addEventListener('click', () => ipInfoHandler.handleLookup());
        elements.dnsRecordsBtn.addEventListener('click', () => dnsRecordsHandler.handlePanelOpen());
        elements.lookupDnsBtn.addEventListener('click', () => dnsRecordsHandler.handleLookup());
        
        // UI event listeners
        elements.helpLink.addEventListener('click', showHelp);
        elements.closePanelBtn.addEventListener('click', () => window.uiManager.closeRightPanel());
        
        // Global stop function
        window.stopAutomation = stopAutomation;
        
        console.log('Event listeners setup complete');
    }

    // Tenten-specific functionality - INSTANT CHECK v1.6.4
    async function checkTentenPageStatus() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            console.log('=== INSTANT Tenten Status Check v1.6.4 ===');
            console.log('Tab URL:', tab.url);
            console.log('ZERO DELAY - Instant response mode');
            
            // Ultra-fast check: just check URL contains domain.tenten.vn
            const isOnTentenDomain = tab.url && tab.url.includes('domain.tenten.vn');
            
            console.log('On Tenten domain:', isOnTentenDomain);
            
            if (isOnTentenDomain) {
                console.log('🟢 INSTANT: Tenten domain detected - enabling DNS NOW');
                window.uiManager.updateStatus(true, 'Sẵn sàng DNS Automation');
                
                // Enable DNS Automation INSTANTLY
                elements.dnsAutomationBtn.classList.remove('disabled');
                elements.dnsAutomationBtn.style.pointerEvents = 'auto';
                elements.dnsAutomationBtn.style.opacity = '1';
                elements.dnsAutomationBtn.style.filter = 'none';
                
                const dnsStatus = elements.dnsAutomationBtn.querySelector('.menu-status');
                if (dnsStatus) {
                    dnsStatus.textContent = 'READY';
                    dnsStatus.className = 'menu-status ready';
                }
                
                console.log('� DNS Button enabled INSTANTLY - NO DELAY');
                
            } else {
                console.log('🔴 Not on Tenten - disabling DNS');
                window.uiManager.updateStatus(false, 'Cần mở domain.tenten.vn');
                
                // Disable DNS Automation
                elements.dnsAutomationBtn.classList.add('disabled');
                elements.dnsAutomationBtn.style.pointerEvents = 'none';
                elements.dnsAutomationBtn.style.opacity = '0.6';
                elements.dnsAutomationBtn.style.filter = 'grayscale(1)';
                
                const dnsStatus = elements.dnsAutomationBtn.querySelector('.menu-status');
                if (dnsStatus) {
                    dnsStatus.textContent = 'TENTEN';
                    dnsStatus.className = 'menu-status needs-tenten';
                }
                
                console.log('DNS Button disabled - need Tenten page');
            }
        } catch (error) {
            console.error('Error in instant check:', error);
            
            // Disable on error
            elements.dnsAutomationBtn.classList.add('disabled');
            elements.dnsAutomationBtn.style.pointerEvents = 'none';
            elements.dnsAutomationBtn.style.opacity = '0.6';
            window.uiManager.updateStatus(false, 'Lỗi kiểm tra trang');
        }
    }

    async function handleDnsAutomation() {
        const domain = elements.domainInput.value.trim();
        
        if (!domain) {
            window.uiManager.showError('Vui lòng nhập tên miền');
            return;
        }

        console.log('=== DNS Automation Ladipage Started v1.6.2 ===');
        console.log('Domain:', domain);
        console.log('Version: 1.6.2 - Fast Response & Auto Refresh');

        try {
            // Get current tab and verify it's the correct page
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            currentTabId = tab.id;
            
            console.log('Current tab:', {
                id: tab.id,
                url: tab.url
            });

            // Simplified verification - only check URL (no title check for speed)
            const isOnTentenDomain = tab.url && tab.url.includes('domain.tenten.vn');
            
            if (!isOnTentenDomain) {
                window.uiManager.showError('Vui lòng mở trang domain.tenten.vn trước');
                return;
            }

            // Show progress and logs
            window.uiManager.setProgress(5, 'Bắt đầu DNS Automation Ladipage...');
            window.uiManager.clearLogs();
            window.uiManager.addLog('🚀 Bắt đầu DNS Automation Ladipage cho: ' + domain, 'info');
            window.uiManager.addLog('📋 Tab ID: ' + currentTabId, 'info');
            window.uiManager.addLog('🌐 URL: ' + tab.url, 'info');
            
            // Enable stop button
            elements.stopButton.style.display = 'inline-block';

            // Test content script connection first
            window.uiManager.setProgress(10, 'Kiểm tra kết nối với content script...');
            window.uiManager.addLog('🔌 Kiểm tra kết nối với content script...', 'info');
            
            // Send ping message first to test connection
            chrome.tabs.sendMessage(currentTabId, {
                action: 'ping'
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Content script connection failed:', chrome.runtime.lastError);
                    window.uiManager.addLog('❌ Không thể kết nối với content script', 'error');
                    window.uiManager.addLog('💡 Hãy thử refresh trang và thử lại', 'warning');
                    window.uiManager.showError('Lỗi kết nối content script - Refresh trang và thử lại');
                    window.uiManager.hideProgress();
                    elements.stopButton.style.display = 'none';
                    return;
                }
                
                console.log('Content script connected:', response);
                window.uiManager.addLog('✅ Kết nối content script thành công', 'success');
                
                // Now send the actual automation command
                setTimeout(() => {
                    startActualAutomation(domain);
                }, 500);
            });

        } catch (error) {
            console.error('DNS Automation error:', error);
            window.uiManager.showError('Lỗi: ' + error.message);
            window.uiManager.hideProgress();
            elements.stopButton.style.display = 'none';
        }
    }
    
    function startActualAutomation(domain) {
        console.log('=== Starting Actual Automation ===');
        window.uiManager.setProgress(15, 'Bắt đầu automation...');
        window.uiManager.addLog('⚡ Bắt đầu thực hiện automation...', 'info');
        
        // Send message to content script with correct action name
        const cleanDomain = DomainUtils.cleanDomainName(domain);
        chrome.tabs.sendMessage(currentTabId, {
            action: 'startDnsAutomation',  // Fixed: match content script listener
            domain: cleanDomain
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Error sending automation message:', chrome.runtime.lastError);
                window.uiManager.addLog('❌ Lỗi gửi lệnh automation: ' + chrome.runtime.lastError.message, 'error');
                window.uiManager.showError('Lỗi gửi lệnh automation');
                window.uiManager.hideProgress();
                elements.stopButton.style.display = 'none';
            } else {
                console.log('Automation message sent successfully:', response);
                window.uiManager.addLog('📤 Lệnh automation đã được gửi', 'success');
                if (response && response.success === false) {
                    window.uiManager.addLog('❌ Content script error: ' + response.error, 'error');
                    window.uiManager.showError('Lỗi từ content script: ' + response.error);
                    window.uiManager.hideProgress();
                    elements.stopButton.style.display = 'none';
                }
            }
        });
    }

    function stopAutomation() {
        console.log('=== Stopping Automation ===');
        
        if (currentTabId) {
            chrome.tabs.sendMessage(currentTabId, {
                action: 'stopAutomation'
            }, (response) => {
                console.log('Stop message sent:', response);
            });
        }
        
        window.uiManager.addLog('⛔ Automation đã được dừng bởi người dùng', 'warning');
        window.uiManager.hideProgress();
        elements.stopButton.style.display = 'none';
        currentTabId = null;
    }

    function showHelp() {
        console.log('=== Showing Help ===');
        
        window.uiManager.clearLogs();
        window.uiManager.addLog('=== HƯỚNG DẪN SỬ DỤNG ===', 'info');
        window.uiManager.addLog('--- DNS AUTOMATION ---', 'info');
        window.uiManager.addLog('1. Truy cập domain.tenten.vn và đăng nhập', 'info');
        window.uiManager.addLog('2. Vào trang DNS Settings của domain', 'info');
        window.uiManager.addLog('3. Nhập tên miền và click DNS Automation', 'info');
        window.uiManager.addLog('4. Extension sẽ tự động tạo CNAME và REDIRECT trong ~30s', 'info');
        window.uiManager.addLog('5. Trang sẽ tự động reload sau 1 giây khi hoàn thành', 'info');
        window.uiManager.addLog('--- WHOIS LOOKUP ---', 'info');
        window.uiManager.addLog('1. Nhập tên miền cần tra cứu', 'info');
        window.uiManager.addLog('2. Click WHOIS Lookup để xem thông tin đăng ký', 'info');
        window.uiManager.addLog('3. Thông tin bao gồm: ngày đăng ký, hết hạn, chủ sở hữu, etc.', 'info');
        window.uiManager.addLog('--- IP/DOMAIN INFO ---', 'info');
        window.uiManager.addLog('1. Nhập tên miền hoặc IP cần tra cứu', 'info');
        window.uiManager.addLog('2. Click IP/Domain Info để xem thông tin địa lý', 'info');
        window.uiManager.addLog('3. Thông tin bao gồm: ISP, quốc gia, thành phố, timezone, etc.', 'info');
        window.uiManager.addLog('--- DNS RECORDS ---', 'info');
        window.uiManager.addLog('1. Nhập tên miền cần tra cứu', 'info');
        window.uiManager.addLog('2. Click DNS Records để mở panel', 'info');
        window.uiManager.addLog('3. Chọn loại bản ghi (A, AAAA, CNAME, MX, etc.)', 'info');
        window.uiManager.addLog('4. Click "Tra cứu" để xem kết quả', 'info');
        window.uiManager.addLog('5. Hỗ trợ 12 loại bản ghi DNS phổ biến', 'info');
    }

    // Listen for messages from content script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('Popup received message:', message);
        
        if (message.action === 'updateProgress') {
            window.uiManager.setProgress(message.progress, message.text);
        } else if (message.action === 'addLog') {
            window.uiManager.addLog(message.message, message.type || 'info');
        } else if (message.action === 'automationComplete') {
            window.uiManager.addLog('✅ DNS Automation Ladipage hoàn thành thành công!', 'success');
            window.uiManager.addLog('🎯 Domain của bạn bây giờ đã trỏ về Ladipage!', 'success');
            window.uiManager.setProgress(100, 'Hoàn thành - Sẽ tự động refresh sau 3 giây');
            elements.stopButton.style.display = 'none';
            
            // Auto refresh after 3 seconds
            let countdown = 3;
            window.uiManager.addLog(`🔄 Tự động refresh trang sau ${countdown} giây...`, 'info');
            
            const countdownInterval = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    window.uiManager.setProgress(100, `Hoàn thành - Sẽ tự động refresh sau ${countdown} giây`);
                    // Update last log with countdown
                    const logs = document.querySelectorAll('.log-entry');
                    if (logs.length > 0) {
                        const lastLog = logs[logs.length - 1];
                        if (lastLog.textContent.includes('Tự động refresh')) {
                            lastLog.textContent = `🔄 Tự động refresh trang sau ${countdown} giây...`;
                        }
                    }
                } else {
                    clearInterval(countdownInterval);
                    window.uiManager.addLog('🔄 Đang refresh trang...', 'info');
                    
                    // Refresh the tab
                    if (currentTabId) {
                        chrome.tabs.reload(currentTabId, () => {
                            console.log('Tab refreshed successfully');
                            window.uiManager.addLog('✅ Trang đã được refresh!', 'success');
                            
                            // Hide progress after refresh
                            setTimeout(() => {
                                window.uiManager.hideProgress();
                                // Re-check status after refresh
                                setTimeout(checkTentenPageStatus, 1000);
                            }, 1000);
                        });
                    }
                }
            }, 1000);
            
            // Show success notification
            window.uiManager.showSuccess('DNS Automation Ladipage hoàn thành!');
        } else if (message.action === 'automationError') {
            window.uiManager.addLog(`❌ Lỗi: ${message.error}`, 'error');
            window.uiManager.hideProgress();
            elements.stopButton.style.display = 'none';
            window.uiManager.showError('Automation thất bại: ' + message.error);
        }
        
        sendResponse({ received: true });
    });

    // Final initialization
    console.log('=== INSTANT RESPONSE MODE v1.6.4 ===');
    console.log('NO POLLING - Pure event-driven instant detection');
    
    console.log('=== Popup Script Loaded Successfully v1.6.4 INSTANT ===');
});
