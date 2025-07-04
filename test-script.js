// Test Script to Check Extension Functionality
// This script will test all the core functions without browser extension context

console.log('=== Extension Test Script Started ===');

// Test 1: Check if all JS files can be loaded
function testFileLoading() {
    console.log('\n=== Test 1: File Loading Check ===');
    
    const requiredClasses = [
        'DomainUtils',
        'UIManager', 
        'WhoisHandler',
        'IpInfoHandler',
        'DnsRecordsHandler'
    ];
    
    requiredClasses.forEach(className => {
        if (typeof window[className] !== 'undefined') {
            console.log(`✓ ${className} loaded successfully`);
        } else {
            console.error(`✗ ${className} NOT loaded`);
        }
    });
}

// Test 2: Check DOM elements
function testDOMElements() {
    console.log('\n=== Test 2: DOM Elements Check ===');
    
    const requiredElements = [
        'whoisLookup', 'ipInfo', 'dnsRecords',
        'whoisDomainInput', 'whoisSubmitBtn', 'whoisContainer',
        'ipinfoDomainInput', 'ipinfoSubmitBtn', 'ipInfoContainer', 
        'dnsDomainInput', 'dnsSubmitBtn', 'dnsContainer',
        'rightPanel', 'rightPanelTitle', 'rightPanelContent',
        'closePanelBtn', 'recordType'
    ];
    
    let missingElements = [];
    
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✓ Element found: ${id}`);
        } else {
            console.error(`✗ Element missing: ${id}`);
            missingElements.push(id);
        }
    });
    
    if (missingElements.length === 0) {
        console.log('✅ All required DOM elements found');
    } else {
        console.error(`❌ Missing ${missingElements.length} elements:`, missingElements);
    }
    
    return missingElements;
}

// Test 3: Try to initialize handlers
function testHandlerInitialization() {
    console.log('\n=== Test 3: Handler Initialization ===');
    
    // Mock elements object
    const mockElements = {};
    const requiredElements = [
        'whoisContainer', 'whoisDomainInput', 'whoisSubmitBtn',
        'ipInfoContainer', 'ipinfoDomainInput', 'ipinfoSubmitBtn',
        'dnsContainer', 'dnsDomainInput', 'dnsSubmitBtn',
        'rightPanel', 'rightPanelTitle', 'rightPanelContent',
        'recordTypeSelect', 'whoisSection', 'ipInfoSection', 'dnsSection',
        'whoisLookupBtn', 'ipInfoBtn', 'dnsRecordsBtn'
    ];
    
    requiredElements.forEach(key => {
        mockElements[key] = document.getElementById(key.replace('Btn', '').replace('Select', ''));
    });
    
    // Test UIManager
    try {
        if (typeof UIManager !== 'undefined') {
            const uiManager = new UIManager(mockElements);
            console.log('✓ UIManager can be initialized');
        } else {
            console.error('✗ UIManager class not available');
        }
    } catch (error) {
        console.error('✗ UIManager initialization failed:', error);
    }
    
    // Test WhoisHandler
    try {
        if (typeof WhoisHandler !== 'undefined') {
            const whoisHandler = new WhoisHandler(mockElements);
            console.log('✓ WhoisHandler can be initialized');
        } else {
            console.error('✗ WhoisHandler class not available');
        }
    } catch (error) {
        console.error('✗ WhoisHandler initialization failed:', error);
    }
    
    // Test IpInfoHandler
    try {
        if (typeof IpInfoHandler !== 'undefined') {
            const ipInfoHandler = new IpInfoHandler(mockElements);
            console.log('✓ IpInfoHandler can be initialized');
        } else {
            console.error('✗ IpInfoHandler class not available');
        }
    } catch (error) {
        console.error('✗ IpInfoHandler initialization failed:', error);
    }
    
    // Test DnsRecordsHandler
    try {
        if (typeof DnsRecordsHandler !== 'undefined') {
            const dnsRecordsHandler = new DnsRecordsHandler(mockElements);
            console.log('✓ DnsRecordsHandler can be initialized');
        } else {
            console.error('✗ DnsRecordsHandler class not available');
        }
    } catch (error) {
        console.error('✗ DnsRecordsHandler initialization failed:', error);
    }
}

// Test 4: Event listener setup
function testEventSetup() {
    console.log('\n=== Test 4: Event Setup Test ===');
    
    const buttons = ['whoisLookup', 'ipInfo', 'dnsRecords'];
    
    buttons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            const originalClick = button.onclick;
            button.addEventListener('click', function(e) {
                console.log(`✓ Click event works for ${buttonId}`);
                e.preventDefault(); // Prevent actual execution during test
            });
            console.log(`✓ Event listener added to ${buttonId}`);
        } else {
            console.error(`✗ Button ${buttonId} not found for event setup`);
        }
    });
}

// Run all tests
function runAllTests() {
    console.log('🧪 Starting comprehensive extension tests...\n');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                testFileLoading();
                testDOMElements();
                testHandlerInitialization();
                testEventSetup();
                console.log('\n=== Test Summary Complete ===');
            }, 500);
        });
    } else {
        setTimeout(() => {
            testFileLoading();
            testDOMElements();
            testHandlerInitialization();
            testEventSetup();
            console.log('\n=== Test Summary Complete ===');
        }, 500);
    }
}

// Auto-run tests
runAllTests();
