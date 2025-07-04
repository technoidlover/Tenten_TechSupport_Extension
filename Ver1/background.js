// Background script - Service worker cho Chrome Extension
console.log('Tenten DNS Automation background script loaded');

// Xử lý installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Extension installed');
        
        // Mở trang hướng dẫn hoặc welcome page
        chrome.tabs.create({
            url: 'https://domain.tenten.vn'
        });
    }
});

// Xử lý messages từ content script và popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background received message:', message, 'from:', sender);
    
    // Luôn return true để giữ kết nối mở
    return true;
});

// Xử lý click vào extension icon
chrome.action.onClicked.addListener((tab) => {
    // Popup sẽ mở tự động, không cần xử lý gì thêm
    console.log('Extension icon clicked');
});
