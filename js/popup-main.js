// Main Popup Script - Cleaned version without Ladipage DNS Automation
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
        
        // Menu buttons (Ladipage elements removed)
        whoisLookupBtn: document.getElementById('whoisLookup'),
        ipInfoBtn: document.getElementById('ipInfo'),
        dnsRecordsBtn: document.getElementById('dnsRecords'),
        autoLadipage: document.getElementById('autoLadipage'),
        helpLink: document.getElementById('helpLink'),
        
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
        
        // Ladipage elements
        ladipageSection: document.getElementById('ladipageSection'),
        ladipageContainer: document.getElementById('ladipageContainer'),
        ladipageDomainInput: document.getElementById('ladipageDomainInput'),
        ladipageSubmitBtn: document.getElementById('ladipageSubmitBtn'),
        ladipageProgress: document.getElementById('ladipageProgress'),
        ladipageProgressFill: document.getElementById('ladipageProgressFill'),
        ladipageProgressText: document.getElementById('ladipageProgressText'),
        ladipageStopBtn: document.getElementById('ladipageStopBtn'),
        
        // DNS specific elements
        recordTypeSelect: document.getElementById('recordType'),
        
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
    
    // Check critical elements for handlers (Ladipage elements removed)
    const criticalElements = [
        'whoisContainer', 'whoisDomainInput', 'whoisSubmitBtn',
        'ipInfoContainer', 'ipinfoDomainInput', 'ipinfoSubmitBtn',
        'dnsContainer', 'dnsDomainInput', 'dnsSubmitBtn',
        'ladipageContainer', 'ladipageDomainInput', 'ladipageSubmitBtn',
        'rightPanel', 'rightPanelTitle', 'rightPanelContent',
        'recordTypeSelect', 'whoisSection', 'ipInfoSection', 'dnsSection', 'ladipageSection',
        'whoisLookupBtn', 'ipInfoBtn', 'dnsRecordsBtn', 'autoLadipage'
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
    try {
        window.uiManager = new UIManager(elements);
        console.log('✓ UIManager initialized successfully');
    } catch (error) {
        console.error('✗ Failed to initialize UIManager:', error);
    }
    
    // Initialize handlers - Make them global for access
    console.log('Initializing handlers...');
    console.log('Handler availability check:', {
        WhoisHandler: typeof WhoisHandler,
        IpInfoHandler: typeof IpInfoHandler,
        DnsRecordsHandler: typeof DnsRecordsHandler,
        LadipageHandler: typeof LadipageHandler,
        UIManager: typeof UIManager,
        DomainUtils: typeof DomainUtils
    });
    
    try {
        if (typeof WhoisHandler !== 'undefined') {
            window.whoisHandler = new WhoisHandler(elements);
            console.log('✓ WhoisHandler initialized successfully');
        } else {
            console.error('✗ WhoisHandler class not found');
        }
    } catch (error) {
        console.error('✗ Failed to initialize WhoisHandler:', error);
    }
    
    try {
        if (typeof IpInfoHandler !== 'undefined') {
            window.ipInfoHandler = new IpInfoHandler(elements);
            console.log('✓ IpInfoHandler initialized successfully');
        } else {
            console.error('✗ IpInfoHandler class not found');
        }
    } catch (error) {
        console.error('✗ Failed to initialize IpInfoHandler:', error);
    }
    
    try {
        if (typeof DnsRecordsHandler !== 'undefined') {
            window.dnsRecordsHandler = new DnsRecordsHandler(elements);
            console.log('✓ DnsRecordsHandler initialized successfully');
        } else {
            console.error('✗ DnsRecordsHandler class not found - will create dummy');
            window.dnsRecordsHandler = {
                handlePanelOpen: function() { console.log('Dummy DNS handler'); },
                handleLookup: function() { console.log('Dummy DNS lookup'); }
            };
        }
    } catch (error) {
        console.error('✗ Failed to initialize DnsRecordsHandler:', error);
        window.dnsRecordsHandler = {
            handlePanelOpen: function() { console.log('Dummy DNS handler'); },
            handleLookup: function() { console.log('Dummy DNS lookup'); }
        };
    }
    
    try {
        if (typeof LadipageHandler !== 'undefined') {
            window.ladipageHandler = new LadipageHandler(elements);
            console.log('✓ LadipageHandler initialized successfully');
        } else {
            console.error('✗ LadipageHandler class not found');
        }
    } catch (error) {
        console.error('✗ Failed to initialize LadipageHandler:', error);
    }

    // Initialize application
    init();
    
    // Setup message listener for content script communication
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('Popup received message:', message);
        
        // Forward message to appropriate handler
        if (window.ladipageHandler && window.ladipageHandler.handleMessage) {
            window.ladipageHandler.handleMessage(message);
        }
        
        // Always return true to keep message channel open
        return true;
    });

    async function init() {
        console.log('=== Initializing Popup v2.0.0 (No Ladipage) ===');
        
        try {
            // Load saved domain
            await loadSavedDomain();
            
            // Set initial states
            setInitialStates();
            
            // Setup event listeners
            setupEventListeners();
            
            // Initialize UI features
            if (window.uiManager && typeof window.uiManager.initializeScrolling === 'function') {
                window.uiManager.initializeScrolling();
            } else {
                console.warn('UIManager scrolling initialization skipped');
            }
            
            console.log('=== Popup Initialized v2.0.0 - Clean Version ===');
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }

    async function loadSavedDomain() {
        try {
            if (typeof DomainUtils === 'undefined') {
                console.warn('DomainUtils not available, skipping saved domain load');
                return;
            }
            
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
        // Enable ready features with error handling
        if (elements.whoisLookupBtn) {
            elements.whoisLookupBtn.classList.remove('disabled');
            elements.whoisLookupBtn.style.pointerEvents = 'auto';
        }
        
        if (elements.ipInfoBtn) {
            elements.ipInfoBtn.classList.remove('disabled');
            elements.ipInfoBtn.style.pointerEvents = 'auto';
        }
        
        if (elements.dnsRecordsBtn) {
            elements.dnsRecordsBtn.classList.remove('disabled');
            elements.dnsRecordsBtn.style.pointerEvents = 'auto';
        }
        
        console.log('Initial states set for all buttons');
    }

    function setupEventListeners() {
        console.log('=== Setting up Event Listeners ===');
        
        // Check all critical elements before setting up listeners
        if (!elements.whoisSubmitBtn || !elements.ipinfoSubmitBtn || !elements.dnsSubmitBtn) {
            console.error('❌ Critical submit buttons missing:', {
                whoisSubmitBtn: !!elements.whoisSubmitBtn,
                ipinfoSubmitBtn: !!elements.ipinfoSubmitBtn,
                dnsSubmitBtn: !!elements.dnsSubmitBtn
            });
            return;
        }
        
        // Main menu items - direct panel navigation
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
        
        // Domain input submit buttons with error handling
        try {
            elements.whoisSubmitBtn.addEventListener('click', () => {
                const domain = elements.whoisDomainInput.value.trim();
                console.log('WHOIS submit clicked with domain:', domain);
                if (domain) {
                    if (window.whoisHandler) {
                        window.whoisHandler.handleLookup(domain);
                    } else {
                        console.error('WhoisHandler not available');
                    }
                } else {
                    console.warn('No domain entered for WHOIS lookup');
                }
            });
        } catch (error) {
            console.error('Error setting up WHOIS submit listener:', error);
        }
        
        try {
            elements.ipinfoSubmitBtn.addEventListener('click', () => {
                const domain = elements.ipinfoDomainInput.value.trim();
                console.log('IP Info submit clicked with domain:', domain);
                if (domain) {
                    if (window.ipInfoHandler) {
                        window.ipInfoHandler.handleLookup(domain);
                    } else {
                        console.error('IpInfoHandler not available');
                    }
                } else {
                    console.warn('No domain entered for IP Info lookup');
                }
            });
        } catch (error) {
            console.error('Error setting up IP Info submit listener:', error);
        }
        
        try {
            elements.dnsSubmitBtn.addEventListener('click', () => {
                const domain = elements.dnsDomainInput.value.trim();
                console.log('DNS submit clicked with domain:', domain);
                if (domain) {
                    if (window.dnsRecordsHandler) {
                        window.dnsRecordsHandler.handleLookup(domain);
                    } else {
                        console.error('DnsRecordsHandler not available');
                    }
                } else {
                    console.warn('No domain entered for DNS lookup');
                }
            });
        } catch (error) {
            console.error('Error setting up DNS submit listener:', error);
        }
        
        // Enter key support for inputs with error handling
        if (elements.whoisDomainInput) {
            elements.whoisDomainInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    elements.whoisSubmitBtn.click();
                }
            });
        }
        
        if (elements.ipinfoDomainInput) {
            elements.ipinfoDomainInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    elements.ipinfoSubmitBtn.click();
                }
            });
        }
        
        if (elements.dnsDomainInput) {
            elements.dnsDomainInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    elements.dnsSubmitBtn.click();
                }
            });
        }
        
        // UI event listeners
        if (elements.helpLink) {
            elements.helpLink.addEventListener('click', showHelp);
        }
        
        if (elements.closePanelBtn) {
            elements.closePanelBtn.addEventListener('click', () => {
                if (window.uiManager) {
                    window.uiManager.closeRightPanel();
                } else {
                    console.error('UIManager not available');
                }
            });
        }
        
        console.log('Event listeners setup complete');
    }

    function showHelp() {
        console.log('=== Showing Help ===');
        
        // Check if uiManager is available
        if (!window.uiManager) {
            console.error('UIManager not available for showHelp');
            return;
        }
        
        // Show help in right panel
        window.uiManager.showRightPanel('📖 Hướng dẫn sử dụng', 'help');
        
        // Get right panel content element
        const rightPanelContent = document.getElementById('rightPanelContent');
        if (rightPanelContent) {
            rightPanelContent.innerHTML = `
                <div class="help-container">
                    <h3>📖 Hướng dẫn sử dụng</h3>
                    
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
                    
                    <div class="help-section">
                        <h4>🚀 Auto Ladipage DNS</h4>
                        <ol>
                            <li>Truy cập domain.tenten.vn và đăng nhập</li>
                            <li>Vào DNS Settings của domain cần cấu hình</li>
                            <li>Click "Auto Ladipage DNS" trong extension</li>
                            <li>Nhập tên miền cần cấu hình</li>
                            <li>Chọn loại: tên miền chính hoặc tên miền phụ</li>
                            <li>Click "Tạo DNS" - extension sẽ tự động thực hiện</li>
                            <li>Theo dõi tiến trình trong log</li>
                        </ol>
                    </div>
                </div>
            `;
            console.log('Help content loaded successfully');
        } else {
            console.error('rightPanelContent element not found');
        }
    }

    // Direct panel navigation functions
    function showWhoisPanel() {
        console.log('=== Showing WHOIS Panel ===');
        
        if (!window.uiManager) {
            console.error('UIManager not available for showWhoisPanel');
            return;
        }
        
        window.uiManager.showRightPanel('🔍 Thông tin WHOIS', 'whois');
        
        // Clear previous input and results
        if (elements.whoisDomainInput) elements.whoisDomainInput.value = '';
        if (elements.whoisContainer) {
            elements.whoisContainer.innerHTML = '<div class="initial-message">📝 Nhập tên miền ở trên và nhấn "Tra cứu" để xem thông tin WHOIS</div>';
        }
        
        // Focus on input
        setTimeout(() => {
            if (elements.whoisDomainInput) {
                elements.whoisDomainInput.focus();
            }
        }, 300);
    }
    
    function showIpInfoPanel() {
        console.log('=== Showing IP Info Panel ===');
        
        if (!window.uiManager) {
            console.error('UIManager not available for showIpInfoPanel');
            return;
        }
        
        window.uiManager.showRightPanel('🌍 Thông tin IP/Domain', 'ipinfo');
        
        // Clear previous input and results
        if (elements.ipinfoDomainInput) elements.ipinfoDomainInput.value = '';
        if (elements.ipInfoContainer) {
            elements.ipInfoContainer.innerHTML = '<div class="initial-message">📝 Nhập domain/IP ở trên và nhấn "Tra cứu" để xem thông tin địa lý</div>';
        }
        
        // Focus on input
        setTimeout(() => {
            if (elements.ipinfoDomainInput) {
                elements.ipinfoDomainInput.focus();
            }
        }, 300);
    }
    
    function showDnsRecordsPanel() {
        console.log('=== Showing DNS Records Panel ===');
        
        if (!window.uiManager) {
            console.error('UIManager not available for showDnsRecordsPanel');
            return;
        }
        
        window.uiManager.showRightPanel('📋 Bản ghi DNS', 'dns');
        
        // Clear previous input and results
        if (elements.dnsDomainInput) elements.dnsDomainInput.value = '';
        if (elements.dnsContainer) {
            elements.dnsContainer.innerHTML = '<div class="initial-message">📝 Nhập tên miền ở trên và nhấn "Tra cứu" để xem bản ghi DNS</div>';
        }
        
        // Focus on input
        setTimeout(() => {
            if (elements.dnsDomainInput) {
                elements.dnsDomainInput.focus();
            }
        }, 300);
    }

    // Final initialization
    console.log('=== Extension Mode v2.1.0 ===');
    console.log('Ladipage DNS Automation functionality added');
    
    console.log('=== Popup Script Loaded Successfully v2.1.0 ===');
});
