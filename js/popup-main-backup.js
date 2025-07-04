// Main Popup Script - Refactored with modular components
// This is the main entry point that coordinates all functionality modules

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Popup Script Loading ===');
    console.log('DOM Content Loaded event fired');
    console.log('Document readyState:', document.readyState);
    
    // Test basic DOM access
    const testElement = document.getElementById('whoisLookup');
    console.log('Test element (whoisLookup):', testElement);
    
    // Get all DOM elements
    console.log('Getting DOM elements...');
    const elements = {
        // Status elements
        statusIndicator: document.getElementById('statusIndicator'),
        statusText: document.getElementById('statusText'),
        
        // Menu buttons
        dnsAutomationBtn: document.getElementById('dnsAutomation'),
        dnsSubmenu: document.getElementById('dnsSubmenu'),
        whoisLookupBtn: document.getElementById('whoisLookup'),
        ipInfoBtn: document.getElementById('ipInfo'),
        dnsRecordsBtn: document.getElementById('dnsRecords'),
        helpLink: document.getElementById('helpLink'),
        stopButton: document.getElementById('stopButton'),
        
        // Modal elements
        domainModal: document.getElementById('domainModal'),
        modalTitle: document.getElementById('modalTitle'),
        modalDomainInput: document.getElementById('modalDomainInput'),
        modalDomainLabel: document.getElementById('modalDomainLabel'),
        modalNote: document.getElementById('modalNote'),
        modalClose: document.getElementById('modalClose'),
        modalCancel: document.getElementById('modalCancel'),
        modalConfirm: document.getElementById('modalConfirm'),
        
        // Progress and log elements
        progressSection: document.getElementById('progressSection'),
        progressFill: document.getElementById('progressFill'),
        progressText: document.getElementById('progressText'),
        logSection: document.getElementById('logSection'),
        logContainer: document.getElementById('logContainer'),
        
        // Content sections
        whoisSection: document.getElementById('whoisSection'),
        whoisContainer: document.getElementById('whoisContainer'),
        whoisDomainInput: document.getElementById('whoisDomainInput'),
        whoisSubmitBtn: document.getElementById('whoisSubmitBtn'),
        
        ipInfoSection: document.getElementById('ipInfoSection'),
        ipInfoContainer: document.getElementById('ipInfoContainer'),
        ipinfoDomainInput: document.getElementById('ipinfoDomainInput'),
        ipinfoSubmitBtn: document.getElementById('ipinfoSubmitBtn'),
        
        dnsSection: document.getElementById('dnsSection'),
        dnsContainer: document.getElementById('dnsContainer'),
        dnsDomainInput: document.getElementById('dnsDomainInput'),
        dnsSubmitBtn: document.getElementById('dnsSubmitBtn'),
        
        // DNS specific elements
        recordTypeSelect: document.getElementById('recordType'),
        // lookupDnsBtn removed - using individual submit buttons now
        
        // Right panel elements
        rightPanel: document.getElementById('rightPanel'),
        rightPanelTitle: document.getElementById('rightPanelTitle'),
        rightPanelContent: document.getElementById('rightPanelContent'),
        closePanelBtn: document.getElementById('closePanelBtn'),
        
        // Layout elements
        body: document.body,
        menuSection: document.querySelector('.menu-section')
    };

    // Debug: Check if all essential elements are found
    console.log('=== Elements Check ===');
    const missingElements = [];
    
    // Check critical elements for handlers
    const criticalElements = [
        'whoisContainer', 'whoisDomainInput', 'whoisSubmitBtn',
        'ipInfoContainer', 'ipinfoDomainInput', 'ipinfoSubmitBtn',
        'dnsContainer', 'dnsDomainInput', 'dnsSubmitBtn',
        'rightPanel', 'rightPanelTitle', 'rightPanelContent',
        'recordTypeSelect', 'whoisSection', 'ipInfoSection', 'dnsSection',
        'whoisLookupBtn', 'ipInfoBtn', 'dnsRecordsBtn'
    ];
    
    criticalElements.forEach(key => {
        if (!elements[key]) {
            missingElements.push(key);
            console.error(`Missing element: ${key}`);
        } else {
            console.log(`✓ Found element: ${key}`);
        }
    });
    
    if (missingElements.length > 0) {
        console.error('Missing elements detected:', missingElements);
    } else {
        console.log('✅ All critical elements found');
    }

    // Initialize UI Manager
    window.uiManager = new UIManager(elements);
    
    // Initialize handlers - Make them global for access in modal handlers
    console.log('Initializing handlers...');
    console.log('WhoisHandler available:', typeof WhoisHandler);
    console.log('IpInfoHandler available:', typeof IpInfoHandler);
    console.log('DnsRecordsHandler available:', typeof DnsRecordsHandler);
    
    if (typeof WhoisHandler !== 'undefined') {
        window.whoisHandler = new WhoisHandler(elements);
        console.log('✓ WhoisHandler initialized');
    } else {
        console.error('✗ WhoisHandler not found');
    }
    
    if (typeof IpInfoHandler !== 'undefined') {
        window.ipInfoHandler = new IpInfoHandler(elements);
        console.log('✓ IpInfoHandler initialized');
    } else {
        console.error('✗ IpInfoHandler not found');
    }
    
    if (typeof DnsRecordsHandler !== 'undefined') {
        window.dnsRecordsHandler = new DnsRecordsHandler(elements);
        console.log('✓ DnsRecordsHandler initialized');
    } else {
        console.error('✗ DnsRecordsHandler not found - will create dummy');
        window.dnsRecordsHandler = {
            handlePanelOpen: function() { console.log('Dummy DNS handler'); },
            handleLookup: function() { console.log('Dummy DNS lookup'); }
        };
    }
    
    // Global variables
    let currentModalAction = '';
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
        
        console.log('=== Popup Initialized v1.6.5 ALWAYS READY ===');
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
                // Load saved domain into all domain inputs
                if (elements.whoisDomainInput) elements.whoisDomainInput.value = savedDomain;
                if (elements.ipinfoDomainInput) elements.ipinfoDomainInput.value = savedDomain;
                if (elements.dnsDomainInput) elements.dnsDomainInput.value = savedDomain;
                console.log('Loaded saved domain:', savedDomain);
            }
        } catch (error) {
            console.error('Error loading saved domain:', error);
        }
    }

    function setInitialStates() {
        // DNS Automation - ALWAYS ENABLED v1.6.5
        elements.dnsAutomationBtn.classList.remove('disabled');
        elements.dnsAutomationBtn.style.pointerEvents = 'auto';
        elements.dnsAutomationBtn.style.opacity = '1';
        elements.dnsAutomationBtn.style.cursor = 'pointer';
        const dnsStatus = elements.dnsAutomationBtn.querySelector('.menu-status');
        if (dnsStatus) {
            dnsStatus.textContent = 'READY';
            dnsStatus.className = 'menu-status ready';
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
        console.log('=== Setting up Event Listeners ===');
        
        // DNS Automation submenu toggle
        if (elements.dnsAutomationBtn) {
            console.log('✓ DNS Automation button found');
            elements.dnsAutomationBtn.addEventListener('click', toggleDnsSubmenu);
        } else {
            console.error('✗ DNS Automation button NOT found');
        }
        
        // Other menu items - direct panel navigation
        if (elements.whoisLookupBtn) {
            console.log('✓ WHOIS button found, adding event listener');
            elements.whoisLookupBtn.addEventListener('click', () => {
                console.log('WHOIS button clicked!');
                showWhoisPanel();
            });
        } else {
            console.error('✗ WHOIS button NOT found');
        }
        
        if (elements.ipInfoBtn) {
            console.log('✓ IP Info button found, adding event listener');
            elements.ipInfoBtn.addEventListener('click', () => {
                console.log('IP Info button clicked!');
                showIpInfoPanel();
            });
        } else {
            console.error('✗ IP Info button NOT found');
        }
        
        if (elements.dnsRecordsBtn) {
            console.log('✓ DNS Records button found, adding event listener');
            elements.dnsRecordsBtn.addEventListener('click', () => {
                console.log('DNS Records button clicked!');
                showDnsRecordsPanel();
            });
        } else {
            console.error('✗ DNS Records button NOT found');
        }
        
        // Domain input submit buttons
        elements.whoisSubmitBtn.addEventListener('click', () => {
            const domain = elements.whoisDomainInput.value.trim();
            if (domain) {
                window.whoisHandler.handleLookup(domain);
            }
        });
        
        elements.ipinfoSubmitBtn.addEventListener('click', () => {
            const domain = elements.ipinfoDomainInput.value.trim();
            if (domain) {
                window.ipInfoHandler.handleLookup(domain);
            }
        });
        
        elements.dnsSubmitBtn.addEventListener('click', () => {
            const domain = elements.dnsDomainInput.value.trim();
            if (domain) {
                window.dnsRecordsHandler.handleLookup(domain);
            }
        });
        
        // Enter key support for inputs
        elements.whoisDomainInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                elements.whoisSubmitBtn.click();
            }
        });
        
        elements.ipinfoDomainInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                elements.ipinfoSubmitBtn.click();
            }
        });
        
        elements.dnsDomainInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                elements.dnsSubmitBtn.click();
            }
        });
        
        // Modal event listeners
        elements.modalClose.addEventListener('click', closeDomainModal);
        elements.modalCancel.addEventListener('click', closeDomainModal);
        elements.modalConfirm.addEventListener('click', handleModalConfirm);
        
        // Enter key support for modal
        elements.modalDomainInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleModalConfirm();
            }
        });
        
        // Close modal on backdrop click
        elements.domainModal.addEventListener('click', (e) => {
            if (e.target === elements.domainModal) {
                closeDomainModal();
            }
        });
        
        // UI event listeners
        elements.helpLink.addEventListener('click', showHelp);
        elements.closePanelBtn.addEventListener('click', () => window.uiManager.closeRightPanel());
        
        // DNS Records lookup button - removed as we use individual submit buttons
        // if (elements.lookupDnsBtn) {
        //     elements.lookupDnsBtn.addEventListener('click', () => {
        //         console.log('DNS lookup button clicked');
        //         window.dnsRecordsHandler.handleLookup();
        //     });
        // }
        
        // Global stop function
        window.stopAutomation = stopAutomation;
        
        console.log('Event listeners setup complete');
    }

    // Tenten-specific functionality - INSTANT CHECK v1.6.4
    async function checkTentenPageStatus() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            console.log('=== DNS Always Ready v1.6.5 ===');
            console.log('Tab URL:', tab.url);
            console.log('DNS Button: ALWAYS ENABLED');
            
            // Ultra-fast check: just check URL contains domain.tenten.vn
            const isOnTentenDomain = tab.url && tab.url.includes('domain.tenten.vn');
            
            console.log('On Tenten domain:', isOnTentenDomain);
            
            if (isOnTentenDomain) {
                console.log('🟢 INSTANT: Tenten domain detected - enabling DNS NOW');
                window.uiManager.updateStatus(true, 'Sẵn sàng DNS Automation');
                
                // Enable DNS Automation INSTANTLY - Force Mode v1.6.4
                forceEnableDnsButton();
                
                const dnsStatus = elements.dnsAutomationBtn.querySelector('.menu-status');
                if (dnsStatus) {
                    dnsStatus.textContent = 'READY';
                    dnsStatus.className = 'menu-status ready';
                }
                
                console.log('� DNS Button enabled INSTANTLY - NO DELAY');
                
            } else {
                console.log('� Not on Tenten - but DNS still enabled');
                window.uiManager.updateStatus(true, 'DNS luôn sẵn sàng');
                
                // Keep DNS Automation enabled - v1.6.5 Always Ready
                forceEnableDnsButton();
                
                const dnsStatus = elements.dnsAutomationBtn.querySelector('.menu-status');
                if (dnsStatus) {
                    dnsStatus.textContent = 'READY';
                    dnsStatus.className = 'menu-status ready';
                }
                
                console.log('✅ DNS Button always enabled - any page');
            }
        } catch (error) {
            console.error('Error checking status:', error);
            
            // Keep DNS button enabled even on error - v1.6.5
            forceEnableDnsButton();
            window.uiManager.updateStatus(true, 'DNS luôn sẵn sàng');
        }
    }

    async function handleDnsAutomation(domain) {
        // This function is called from modal confirm with domain already provided
        if (!domain) {
            console.log('DNS Automation cancelled - no domain provided');
            return;
        }

        console.log('=== DNS Automation Ladipage Started v1.9.3 ===');
        console.log('Domain:', domain);
        console.log('Version: 1.9.3 - Right Panel UI & Modal Input');

        try {
            // Save domain
            await DomainUtils.saveDomain(domain);
            
            // Show right panel for DNS Automation Main
            window.uiManager.showRightPanel('🏠 DNS Automation - Tên miền chính', 'ladipage-main');
            
            // Create initial content container
            const mainContainer = document.createElement('div');
            mainContainer.className = 'ladipage-main-container';
            mainContainer.innerHTML = `
                <div class="automation-info">
                    <div class="domain-display">
                        <span class="domain-label">Tên miền chính:</span>
                        <span class="domain-value">${domain}</span>
                    </div>
                    <div class="automation-description">
                        Tạo CNAME + REDIRECT để trỏ về Ladipage
                    </div>
                </div>
                <div class="automation-status" id="mainAutomationStatus">
                    <div class="status-message">Đang chuẩn bị automation...</div>
                </div>
            `;
            
            // Add to right panel content
            const rightPanelContent = document.getElementById('rightPanelContent');
            rightPanelContent.innerHTML = '';
            rightPanelContent.appendChild(mainContainer);

            // Get current tab and verify it's the correct page
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            currentTabId = tab.id;
            
            console.log('Current tab:', { id: tab.id, url: tab.url });

            // Check if on TenTen domain
            const isOnTentenDomain = tab.url && tab.url.includes('domain.tenten.vn');
            
            if (!isOnTentenDomain) {
                mainContainer.querySelector('.automation-status').innerHTML = `
                    <div class="status-error">❌ Vui lòng mở trang domain.tenten.vn trước</div>
                `;
                return;
            }

            // Update status and logs in right panel
            mainContainer.querySelector('.automation-status').innerHTML = `
                <div class="status-message">� Đang kiểm tra kết nối...</div>
            `;
            
            // Test content script connection
            chrome.tabs.sendMessage(currentTabId, { action: 'ping' }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Content script connection failed:', chrome.runtime.lastError);
                    mainContainer.querySelector('.automation-status').innerHTML = `
                        <div class="status-error">❌ Không thể kết nối với content script</div>
                        <div class="status-warning">💡 Hãy thử refresh trang và thử lại</div>
                    `;
                    return;
                }
                
                console.log('Content script connected:', response);
                mainContainer.querySelector('.automation-status').innerHTML = `
                    <div class="status-success">✅ Kết nối thành công, bắt đầu automation...</div>
                `;
                
                // Send automation command
                setTimeout(() => {
                    const cleanDomain = DomainUtils.cleanDomainName(domain);
                    chrome.tabs.sendMessage(currentTabId, {
                        action: 'startDnsAutomation',
                        domain: cleanDomain
                    }, (response) => {
                        if (chrome.runtime.lastError) {
                            console.error('Error sending automation message:', chrome.runtime.lastError);
                            mainContainer.querySelector('.automation-status').innerHTML = `
                                <div class="status-error">❌ Lỗi gửi lệnh automation</div>
                                <div class="status-error">❌ Lỗi: ${chrome.runtime.lastError.message}</div>
                            `;
                        } else {
                            console.log('Automation message sent successfully:', response);
                            mainContainer.querySelector('.automation-status').innerHTML = `
                                <div class="status-success">⚡ Automation đang chạy...</div>
                                <div class="status-success">📤 Lệnh automation đã được gửi</div>
                            `;
                            if (response && response.success === false) {
                                mainContainer.querySelector('.automation-status').innerHTML = `
                                    <div class="status-error">❌ Lỗi từ content script</div>
                                    <div class="status-error">❌ Content script error: ${response.error}</div>
                                `;
                            }
                        }
                    });
                }, 500);
            });

        } catch (error) {
            console.error('DNS Automation error:', error);
            // Try to update status in right panel if container exists
            const mainContainer = document.querySelector('.ladipage-main-container');
            if (mainContainer) {
                mainContainer.querySelector('.automation-status').innerHTML = `
                    <div class="status-error">❌ Lỗi: ${error.message}</div>
                `;
            } else {
                // Fallback to old UI if no container
                window.uiManager.showError('Lỗi: ' + error.message);
            }
        }
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
        
        // Update status in right panel if exists
        updateAutomationStatus('⛔ Automation đã được dừng bởi người dùng', 'warning');
        addAutomationLog('⛔ Dừng bởi người dùng', 'warning');
        currentTabId = null;
    }

    function showHelp() {
        console.log('=== Showing Help ===');
        
        // Show help in right panel
        window.uiManager.showRightPanel('📖 Hướng dẫn sử dụng', 'help');
        
        // Get right panel content element
        const rightPanelContent = document.getElementById('rightPanelContent');
        if (rightPanelContent) {
            rightPanelContent.innerHTML = `
                <div class="help-container">
                    <h3>📖 Hướng dẫn sử dụng</h3>
                    
                    <div class="help-section">
                        <h4>🚀 DNS Automation Ladipage</h4>
                        <ol>
                            <li>Truy cập domain.tenten.vn và đăng nhập</li>
                            <li>Vào trang DNS Settings của domain</li>
                            <li>Click "DNS Automation" và nhập tên miền</li>
                            <li>Extension sẽ tự động tạo CNAME và REDIRECT</li>
                            <li>Trang sẽ tự động reload khi hoàn thành</li>
                        </ol>
                    </div>
                    
                    <div class="help-section">
                        <h4>🔍 WHOIS Lookup</h4>
                        <ol>
                            <li>Click "WHOIS Lookup"</li>
                            <li>Nhập tên miền cần tra cứu</li>
                            <li>Xem thông tin đăng ký: ngày đăng ký, hết hạn, chủ sở hữu</li>
                        </ol>
                    </div>
                    
                    <div class="help-section">
                        <h4>📍 IP/Domain Info</h4>
                        <ol>
                            <li>Click "IP/Domain Info"</li>
                            <li>Nhập tên miền hoặc IP cần tra cứu</li>
                            <li>Xem thông tin địa lý: ISP, quốc gia, thành phố, timezone</li>
                        </ol>
                    </div>
                    
                    <div class="help-section">
                        <h4>🌐 DNS Records</h4>
                        <ol>
                            <li>Click "DNS Records"</li>
                            <li>Nhập tên miền cần tra cứu</li>
                            <li>Chọn loại bản ghi (A, AAAA, CNAME, MX, etc.)</li>
                            <li>Click "Tra cứu" để xem kết quả</li>
                            <li>Hỗ trợ 12 loại bản ghi DNS phổ biến</li>
                        </ol>
                    </div>
                </div>
            `;
        }
    }

    // Force enable DNS button function - v1.6.4 fix
    function forceEnableDnsButton() {
        console.log('=== FORCE ENABLE DNS BUTTON v1.6.4 ===');
        
        // Remove ALL possible blocking
        elements.dnsAutomationBtn.classList.remove('disabled');
        elements.dnsAutomationBtn.removeAttribute('disabled');
        elements.dnsAutomationBtn.style.pointerEvents = 'auto';
        elements.dnsAutomationBtn.style.opacity = '1';
        elements.dnsAutomationBtn.style.filter = 'none';
        elements.dnsAutomationBtn.style.cursor = 'pointer';
        elements.dnsAutomationBtn.style.background = '';
        elements.dnsAutomationBtn.disabled = false;
        
        // Check computed styles for debugging
        const computedStyle = window.getComputedStyle(elements.dnsAutomationBtn);
        console.log('=== DNS Button State Check ===');
        console.log('Has disabled class:', elements.dnsAutomationBtn.classList.contains('disabled'));
        console.log('Style pointer-events:', elements.dnsAutomationBtn.style.pointerEvents);
        console.log('Style opacity:', elements.dnsAutomationBtn.style.opacity);
        console.log('Computed pointer-events:', computedStyle.pointerEvents);
        console.log('Computed opacity:', computedStyle.opacity);
        
        console.log('✅ Force enable complete - button should be clickable now');
    }

    // Listen for messages from content script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('Popup received message:', message);
        
        // Find automation containers in right panel
        const mainContainer = document.querySelector('.ladipage-main-container');
        const subContainer = document.querySelector('.ladipage-sub-container');
        const activeContainer = mainContainer || subContainer;
        
        if (message.action === 'updateProgress') {
            // Update progress in right panel if automation is active
            if (activeContainer) {
                const statusDiv = activeContainer.querySelector('.automation-status');
                if (statusDiv) {
                    statusDiv.innerHTML = `
                        <div class="status-message">⏳ ${message.text} (${message.progress}%)</div>
                    `;
                }
            } else {
                // Fallback to old progress UI if no automation container
                window.uiManager.setProgress(message.progress, message.text);
            }
        } else if (message.action === 'addLog') {
            // Add log to right panel if automation is active
            if (activeContainer) {
                const statusDiv = activeContainer.querySelector('.automation-status');
                if (statusDiv) {
                    const logEntry = document.createElement('div');
                    logEntry.className = `status-${message.type || 'message'}`;
                    logEntry.textContent = message.message;
                    statusDiv.appendChild(logEntry);
                    
                    // Keep only last 5 log entries to avoid clutter
                    const logEntries = statusDiv.querySelectorAll('[class*="status-"]');
                    if (logEntries.length > 5) {
                        logEntries[0].remove();
                    }
                }
            } else {
                // Fallback to old log UI if no automation container
                window.uiManager.addLog(message.message, message.type || 'info');
            }
        } else if (message.action === 'automationComplete') {
            if (activeContainer) {
                const statusDiv = activeContainer.querySelector('.automation-status');
                if (statusDiv) {
                    statusDiv.innerHTML = `
                        <div class="status-success">🎉 DNS Automation Ladipage hoàn thành thành công!</div>
                        <div class="status-success">🎯 Domain của bạn bây giờ đã trỏ về Ladipage!</div>
                        <div class="status-message">🔄 Sẽ tự động refresh sau 3 giây...</div>
                    `;
                    
                    // Auto refresh countdown
                    let countdown = 3;
                    const countdownInterval = setInterval(() => {
                        countdown--;
                        if (countdown > 0) {
                            const countdownMsg = statusDiv.querySelector('.status-message:last-child');
                            if (countdownMsg) {
                                countdownMsg.textContent = `🔄 Sẽ tự động refresh sau ${countdown} giây...`;
                            }
                        } else {
                            clearInterval(countdownInterval);
                            statusDiv.innerHTML = `
                                <div class="status-success">✅ Hoàn thành!</div>
                                <div class="status-message">🔄 Đang refresh trang...</div>
                            `;
                            
                            // Refresh the tab
                            if (currentTabId) {
                                chrome.tabs.reload(currentTabId, () => {
                                    console.log('Tab refreshed successfully');
                                    statusDiv.innerHTML = `
                                        <div class="status-success">✅ Trang đã được refresh!</div>
                                        <div class="status-success">🎯 Automation hoàn thành thành công!</div>
                                    `;
                                });
                            }
                        }
                    }, 1000);
                }
            } else {
                // Fallback to old UI
                window.uiManager.addLog('✅ DNS Automation Ladipage hoàn thành thành công!', 'success');
                window.uiManager.addLog('🎯 Domain của bạn bây giờ đã trỏ về Ladipage!', 'success');
                window.uiManager.setProgress(100, 'Hoàn thành - Sẽ tự động refresh sau 3 giây');
            }
            
            elements.stopButton.style.display = 'none';
            window.uiManager.showSuccess('DNS Automation Ladipage hoàn thành!');
            
        } else if (message.action === 'automationError') {
            if (activeContainer) {
                const statusDiv = activeContainer.querySelector('.automation-status');
                if (statusDiv) {
                    statusDiv.innerHTML = `
                        <div class="status-error">❌ Lỗi: ${message.error}</div>
                        <div class="status-message">Automation thất bại</div>
                    `;
                }
            } else {
                // Fallback to old UI
                window.uiManager.addLog(`❌ Lỗi: ${message.error}`, 'error');
                window.uiManager.hideProgress();
            }
            
            elements.stopButton.style.display = 'none';
            window.uiManager.showError('Automation thất bại: ' + message.error);
        }
        
        sendResponse({ received: true });
    });

    // Submenu handling
    function toggleDnsSubmenu() {
        const isExpanded = elements.dnsAutomationBtn.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse
            elements.dnsAutomationBtn.classList.remove('expanded');
            elements.dnsSubmenu.style.display = 'none';
        } else {
            // Expand
            elements.dnsAutomationBtn.classList.add('expanded');
            elements.dnsSubmenu.style.display = 'block';
        }
    }

    // Modal handling
    // Direct panel navigation functions
    function showWhoisPanel() {
        console.log('=== Showing WHOIS Panel ===');
        window.uiManager.showRightPanel('🔍 Thông tin WHOIS', 'whois');
        
        // Clear previous input and results
        elements.whoisDomainInput.value = '';
        elements.whoisContainer.innerHTML = '<div class="initial-message">📝 Nhập tên miền ở trên và nhấn "Tra cứu" để xem thông tin WHOIS</div>';
        
        // Focus on input
        setTimeout(() => {
            elements.whoisDomainInput.focus();
        }, 300);
    }
    
    function showIpInfoPanel() {
        console.log('=== Showing IP Info Panel ===');
        window.uiManager.showRightPanel('🌍 Thông tin IP/Domain', 'ipinfo');
        
        // Clear previous input and results
        elements.ipinfoDomainInput.value = '';
        elements.ipInfoContainer.innerHTML = '<div class="initial-message">📝 Nhập domain/IP ở trên và nhấn "Tra cứu" để xem thông tin địa lý</div>';
        
        // Focus on input
        setTimeout(() => {
            elements.ipinfoDomainInput.focus();
        }, 300);
    }
    
    function showDnsRecordsPanel() {
        console.log('=== Showing DNS Records Panel ===');
        window.uiManager.showRightPanel('📋 Bản ghi DNS', 'dns');
        
        // Clear previous input and results
        elements.dnsDomainInput.value = '';
        elements.dnsContainer.innerHTML = '<div class="initial-message">📝 Nhập tên miền ở trên và nhấn "Tra cứu" để xem bản ghi DNS</div>';
        
        // Focus on input
        setTimeout(() => {
            elements.dnsDomainInput.focus();
        }, 300);
    }

    // Modal handling functions
    function showDomainModal(action, title, label, placeholder, note = '') {
        console.log('=== Showing Domain Modal ===');
        console.log('Action:', action);
        
        currentModalAction = action;
        
        // Update modal content
        elements.modalTitle.textContent = title;
        elements.modalDomainLabel.textContent = label;
        elements.modalDomainInput.placeholder = placeholder;
        elements.modalDomainInput.value = '';
        
        // Show/hide note
        if (note) {
            elements.modalNote.textContent = note;
            elements.modalNote.style.display = 'block';
        } else {
            elements.modalNote.style.display = 'none';
        }
        
        // Show modal
        elements.domainModal.style.display = 'flex';
        
        // Focus on input
        setTimeout(() => {
            elements.modalDomainInput.focus();
        }, 100);
    }

    function closeDomainModal() {
        console.log('Closing domain modal');
        elements.domainModal.style.display = 'none';
        elements.modalDomainInput.value = '';
        currentModalAction = '';
    }

    function handleModalConfirm() {
        const domain = elements.modalDomainInput.value.trim();
        
        if (!domain) {
            window.uiManager.showError('Vui lòng nhập tên miền');
            return;
        }
        
        console.log('=== Modal Confirm ===');
        console.log('Action:', currentModalAction);
        console.log('Domain:', domain);
        
        // Close modal first
        closeDomainModal();
        
        // Handle different actions
        switch (currentModalAction) {
            case 'ladipage-main':
                handleLadipageMain(domain);
                break;
            case 'ladipage-sub':
                handleLadipageSub(domain);
                break;
            default:
                console.error('Unknown modal action:', currentModalAction);
        }
    }

    // Removed handleModalConfirm - no longer needed with direct panel navigation
    
    // Ladipage handling functions
    function handleLadipageMain(domain) {
        console.log('=== Handling Ladipage Main Domain ===');
        console.log('Domain:', domain);
        
        // Call DNS automation for main domain
        handleDnsAutomation(domain);
    }

    function handleLadipageSub(domain) {
        console.log('=== Handling Ladipage Subdomain ===');
        console.log('Subdomain:', domain);
        
        // Validate subdomain format
        if (!domain.includes('.')) {
            window.uiManager.showError('Tên miền phụ phải có dạng: subdomain.example.com');
            return;
        }
        
        // Call subdomain automation
        handleSubdomainAutomation(domain);
    }

    async function handleSubdomainAutomation(subdomain) {
        console.log('=== Starting Subdomain Automation v1.9.0 ===');
        console.log('Subdomain:', subdomain);
        
        // Show right panel for DNS Automation Subdomain
        window.uiManager.showRightPanel('🌿 DNS Automation - Tên miền phụ', 'ladipage-sub');
        
        // Create initial content
        const subContainer = document.createElement('div');
        subContainer.className = 'ladipage-sub-container';
        
        // Extract subdomain parts for display
        const subParts = subdomain.split('.');
        const subName = subParts[0];
        const mainDomain = subParts.slice(1).join('.');
        
        subContainer.innerHTML = `
            <div class="automation-info">
                <div class="domain-display">
                    <span class="domain-label">Tên miền phụ:</span>
                    <span class="domain-value">${subdomain}</span>
                </div>
                <div class="subdomain-breakdown">
                    <div class="breakdown-item">
                        <span class="breakdown-label">Subdomain:</span>
                        <span class="breakdown-value">${subName}</span>
                    </div>
                    <div class="breakdown-item">
                        <span class="breakdown-label">Domain gốc:</span>
                        <span class="breakdown-value">${mainDomain}</span>
                    </div>
                </div>
                <div class="automation-description">
                    Tạo CNAME: ${subName} → dns.ladipage.com
                </div>
            </div>
            <div class="automation-status" id="subAutomationStatus">
                <div class="status-message">Đang chuẩn bị automation...</div>
            </div>
        `;
        
        // Add to right panel content
        const rightPanelContent = document.getElementById('rightPanelContent');
        rightPanelContent.innerHTML = '';
        rightPanelContent.appendChild(subContainer);
        
        // Check if on Tenten page
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.url || !tab.url.includes('domain.tenten.vn')) {
                subContainer.querySelector('.automation-status').innerHTML = `
                    <div class="status-error">❌ Vui lòng mở trang DNS Settings của domain.tenten.vn trước khi chạy automation</div>
                `;
                return;
            }
            
            currentTabId = tab.id;
            
            // Update status
            subContainer.querySelector('.automation-status').innerHTML = `
                <div class="status-message">🔍 Đang kiểm tra kết nối...</div>
            `;
            
            // Send message to content script
            console.log('Sending startSubdomainAutomation message...');
            chrome.tabs.sendMessage(tab.id, {
                action: 'startSubdomainAutomation',
                subdomain: subdomain
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Failed to send message:', chrome.runtime.lastError);
                    subContainer.querySelector('.automation-status').innerHTML = `
                        <div class="status-error">❌ Không thể kết nối với trang. Vui lòng refresh trang và thử lại.</div>
                    `;
                } else {
                    console.log('Message sent successfully:', response);
                    subContainer.querySelector('.automation-status').innerHTML = `
                        <div class="status-success">✅ Lệnh automation đã được gửi</div>
                        <div class="status-message">⏳ Đang thực hiện automation...</div>
                    `;
                }
            });
            
        } catch (error) {
            console.error('Error in handleSubdomainAutomation:', error);
            subContainer.querySelector('.automation-status').innerHTML = `
                <div class="status-error">❌ Lỗi: ${error.message}</div>
            `;
        }
    }

    // DNS Automation handlers
    async function handleDnsAutomationMain(domain) {
        console.log('=== DNS Automation Ladipage MAIN v1.9.0 ===');
        console.log('Domain:', domain);
        
        // Show right panel for DNS Automation Main
        window.uiManager.showRightPanel('🏠 DNS Automation - Tên miền chính', 'ladipage-main');
        
        // Create initial content
        const mainContainer = document.createElement('div');
        mainContainer.className = 'ladipage-main-container';
        mainContainer.innerHTML = `
            <div class="automation-info">
                <div class="domain-display">
                    <span class="domain-label">Tên miền chính:</span>
                    <span class="domain-value">${domain}</span>
                </div>
                <div class="automation-description">
                    Tạo CNAME + REDIRECT để trỏ về Ladipage
                </div>
            </div>
            <div class="automation-status" id="mainAutomationStatus">
                <div class="status-message">Đang chuẩn bị automation...</div>
            </div>
        `;
        
        // Add to right panel content
        const rightPanelContent = document.getElementById('rightPanelContent');
        rightPanelContent.innerHTML = '';
        rightPanelContent.appendChild(mainContainer);
        
        try {
            // Get current tab and verify it's the correct page
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            currentTabId = tab.id;
            
            console.log('Current tab:', { id: tab.id, url: tab.url });
            
            if (!tab.url || !tab.url.includes('domain.tenten.vn')) {
                mainContainer.querySelector('.automation-status').innerHTML = `
                    <div class="status-error">❌ Vui lòng truy cập trang domain.tenten.vn trước</div>
                `;
                return;
            }
            
            // Update status
            mainContainer.querySelector('.automation-status').innerHTML = `
                <div class="status-message">🔍 Đang kiểm tra kết nối...</div>
            `;
            
            // Check content script
            chrome.tabs.sendMessage(tab.id, { action: 'ping' }, (response) => {
                if (chrome.runtime.lastError) {
                    mainContainer.querySelector('.automation-status').innerHTML = `
                        <div class="status-warning">⚠️ Content script chưa sẵn sàng, đang inject...</div>
                    `;
                    
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content.js']
                    }).then(() => {
                        mainContainer.querySelector('.automation-status').innerHTML = `
                            <div class="status-success">✅ Content script đã được inject</div>
                            <div class="status-message">🚀 Bắt đầu automation...</div>
                        `;
                        setTimeout(() => startDnsAutomationMain(domain, tab.id), 500);
                    }).catch((error) => {
                        mainContainer.querySelector('.automation-status').innerHTML = `
                            <div class="status-error">❌ Không thể inject content script: ${error.message}</div>
                        `;
                    });
                } else {
                    mainContainer.querySelector('.automation-status').innerHTML = `
                        <div class="status-success">✅ Kết nối trang web thành công</div>
                        <div class="status-message">🚀 Bắt đầu automation...</div>
                    `;
                    startDnsAutomationMain(domain, tab.id);
                }
            });
            
        } catch (error) {
            mainContainer.querySelector('.automation-status').innerHTML = `
                <div class="status-error">❌ Lỗi khi kiểm tra tab: ${error.message}</div>
            `;
        }
    }

    async function handleDnsAutomationSub(subdomain) {
        console.log('=== DNS Automation Ladipage SUB v1.6.6 ===');
        console.log('Subdomain:', subdomain);
        
        try {
            // Get current tab and verify it's the correct page
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            currentTabId = tab.id;
            
            if (!tab.url || !tab.url.includes('domain.tenten.vn')) {
                window.uiManager.showError('Vui lòng truy cập trang domain.tenten.vn trước');
                return;
            }
            
            // Show progress and logs
            window.uiManager.showProgress();
            window.uiManager.showLogs();
            
            // Clear previous logs
            window.uiManager.clearLogs();
            window.uiManager.addLog('🚀 Bắt đầu DNS Automation Ladipage cho tên miền phụ', 'info');
            
            // Check content script
            chrome.tabs.sendMessage(tab.id, { action: 'ping' }, (response) => {
                if (chrome.runtime.lastError) {
                    window.uiManager.addLog('❌ Content script chưa sẵn sàng, đang inject...', 'warning');
                    
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content.js']
                    }).then(() => {
                        window.uiManager.addLog('✅ Content script đã được inject', 'success');
                        setTimeout(() => startDnsAutomationSub(subdomain, tab.id), 500);
                    }).catch((error) => {
                        window.uiManager.showError('Không thể inject content script: ' + error.message);
                        window.uiManager.resetUI();
                    });
                } else {
                    window.uiManager.addLog('✅ Kết nối trang web thành công', 'success');
                    startDnsAutomationSub(subdomain, tab.id);
                }
            });
            
        } catch (error) {
            window.uiManager.showError('Lỗi khi kiểm tra tab: ' + error.message);
            window.uiManager.resetUI();
        }
    }

    function startDnsAutomationMain(domain, tabId) {
        chrome.tabs.sendMessage(tabId, {
            action: 'startDnsAutomation',
            domain: domain,
            type: 'main'
        }, (response) => {
            if (chrome.runtime.lastError) {
                window.uiManager.showError('Lỗi kết nối: ' + chrome.runtime.lastError.message);
                window.uiManager.resetUI();
                return;
            }
            
            if (!response.success) {
                window.uiManager.showError('Lỗi automation: ' + response.error);
                window.uiManager.resetUI();
            }
        });
    }

    function startDnsAutomationSub(subdomain, tabId) {
        chrome.tabs.sendMessage(tabId, {
            action: 'startDnsAutomationSub',
            subdomain: subdomain,
            type: 'sub'
        }, (response) => {
            if (chrome.runtime.lastError) {
                window.uiManager.showError('Lỗi kết nối: ' + chrome.runtime.lastError.message);
                window.uiManager.resetUI();
                return;
            }
            
            if (!response.success) {
                window.uiManager.showError('Lỗi automation: ' + response.error);
                window.uiManager.resetUI();
            }
        });
    }

    // Helper functions for automation status updates
    function updateAutomationStatus(message, type = 'info') {
        const containers = [
            document.querySelector('.ladipage-main-container'),
            document.querySelector('.ladipage-sub-container')
        ];
        
        for (const container of containers) {
            if (container) {
                const statusDiv = container.querySelector('.progress-info');
                if (statusDiv) {
                    statusDiv.textContent = message;
                    statusDiv.className = `progress-info ${type}`;
                }
                break;
            }
        }
    }
    
    function addAutomationLog(message, type = 'info') {
        const containers = [
            document.querySelector('.ladipage-main-container'),
            document.querySelector('.ladipage-sub-container')
        ];
        
        for (const container of containers) {
            if (container) {
                const logsDiv = container.querySelector('.automation-logs');
                if (logsDiv) {
                    const logEntry = document.createElement('div');
                    logEntry.className = `log-entry ${type}`;
                    logEntry.textContent = message;
                    logsDiv.appendChild(logEntry);
                    
                    // Keep only last 10 log entries
                    const logEntries = logsDiv.querySelectorAll('.log-entry');
                    if (logEntries.length > 10) {
                        logEntries[0].remove();
                    }
                    
                    // Scroll to bottom
                    logsDiv.scrollTop = logsDiv.scrollHeight;
                }
                break;
            }
        }
    }
    
    // Final initialization
    console.log('=== INSTANT RESPONSE MODE v1.6.4 ===');
    console.log('NO POLLING - Pure event-driven instant detection');
    
    console.log('=== Popup Script Loaded Successfully v1.6.5 ALWAYS READY ===');
});
