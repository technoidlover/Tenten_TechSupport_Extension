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
    
    // Initialize handlers - Make them global for access
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

    // Initialize application
    init();

    async function init() {
        console.log('=== Initializing Popup v2.0.0 (No Ladipage) ===');
        
        // Load saved domain
        await loadSavedDomain();
        
        // Set initial states
        setInitialStates();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize UI features
        window.uiManager.initializeScrolling();
        
        console.log('=== Popup Initialized v2.0.0 - Clean Version ===');
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
        
        // UI event listeners
        elements.helpLink.addEventListener('click', showHelp);
        elements.closePanelBtn.addEventListener('click', () => window.uiManager.closeRightPanel());
        
        console.log('Event listeners setup complete');
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

    // Final initialization
    console.log('=== Clean Extension Mode v2.0.0 ===');
    console.log('Ladipage DNS Automation functionality removed');
    
    console.log('=== Popup Script Loaded Successfully v2.0.0 ===');
});
