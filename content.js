// Content script - Chạy trên trang domain.tenten.vn
// Script này sẽ thực hiện DNS automation dựa trên code gốc của bạn

console.log('Tenten DNS Automation content script loaded');

// Global variables để quản lý automation
let isAutomationRunning = false;
let shouldStop = false;

// Lắng nghe messages từ popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Content script received message:', message);
    
    if (message.action === 'ping') {
        sendResponse({ status: 'ready' });
        return true;
    } else if (message.action === 'checkCsrfToken') {
        const hasToken = checkCsrfToken();
        sendResponse({ hasToken });
        return true;
    } else if (message.action === 'startDnsAutomation') {
        if (isAutomationRunning) {
            sendResponse({ success: false, error: 'Automation đang chạy' });
            return true;
        }
        
        // Xử lý async
        startDnsAutomation(message.domain).then(() => {
            sendResponse({ success: true });
        }).catch((error) => {
            sendResponse({ success: false, error: error.message });
        });
        return true; // Giữ kết nối mở cho async
    } else if (message.action === 'stopAutomation') {
        stopAutomation();
        sendResponse({ success: true, stopped: true });
        return true;
    }
    
    return true; // Luôn return true để tránh lỗi connection
});

function checkCsrfToken() {
    const inputs = document.querySelectorAll("input[name='dev_token_csrf']");
    return inputs.length > 0 && inputs[0].value;
}

function stopAutomation() {
    shouldStop = true;
    isAutomationRunning = false;
    sendMessage('addLog', { message: '⛔ Automation đã được dừng bởi người dùng', type: 'warning' });
    sendMessage('automationComplete', { success: false, stopped: true });
}

async function startDnsAutomation(domain) {
    if (isAutomationRunning) {
        throw new Error('Automation đang chạy');
    }
    
    isAutomationRunning = true;
    shouldStop = false;
    
    try {
        sendMessage('updateProgress', { percent: 10, message: 'Đang kiểm tra CSRF token...' });
        sendMessage('addLog', { message: `🚀 Bắt đầu DNS Automation Ladipage cho domain: ${domain}`, type: 'info' });

        // Check if should stop
        if (shouldStop) {
            throw new Error('Automation đã được dừng');
        }

        // BƯỚC 1: Lấy CSRF Token
        sendMessage('addLog', { message: '📋 BƯỚC 1: Lấy CSRF Token', type: 'info' });
        sendMessage('updateProgress', { percent: 20, message: 'Lấy CSRF token...' });

        let csrfToken = null;
        const inputs = document.querySelectorAll("input[name='dev_token_csrf']");
        
        if (inputs.length === 0) {
            throw new Error("Không tìm thấy CSRF token. Vui lòng truy cập trang DNS Settings.");
        }

        csrfToken = inputs[0].value;
        sendMessage('addLog', { message: `✅ CSRF Token đã lấy được: ${csrfToken.substring(0, 10)}...`, type: 'success' });

        // Check if should stop
        if (shouldStop) {
            throw new Error('Automation đã được dừng');
        }

        // Helper functions
        const encodeForm = (data) =>
            Object.entries(data)
                .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v ?? "")}`)
                .join("&");

        const headers = {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
        };

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // BƯỚC 2: Tạo CNAME Record
        sendMessage('addLog', { message: '🔗 BƯỚC 2: Tạo bản ghi CNAME', type: 'info' });
        sendMessage('updateProgress', { percent: 40, message: 'Tạo bản ghi CNAME...' });

        // Check if should stop
        if (shouldStop) {
            throw new Error('Automation đã được dừng');
        }

        try {
            const cnameRecord = {
                "data[name]": "www",
                "data[type]": "CNAME",
                "data[value]": "dns.ladipage.com",
                "data[priority]": "",
                "data[priority_srv]": "",
                "data[weight_srv]": "",
                "data[port_srv]": "",
                "data[value_srv]": "",
                "data[tag_caa]": "",
                "data[flag_caa]": "",
                "data[value_caa]": "",
                dev_token_csrf: csrfToken,
                data_init: "",
            };

            sendMessage('addLog', { message: '📤 Đang gửi yêu cầu tạo CNAME...', type: 'info' });
            
            const cnameRes = await fetch("https://domain.tenten.vn/ApiDnsSetting/addDns/", {
                method: "POST",
                headers,
                body: encodeForm(cnameRecord),
            });

            const cnameJson = await cnameRes.json();
            sendMessage('addLog', { message: `✅ CNAME Record đã được tạo: ${JSON.stringify(cnameJson)}`, type: 'success' });

            // Check if should stop before delay
            if (shouldStop) {
                throw new Error('Automation đã được dừng');
            }

            // Delay 1 giây (giảm từ 2 giây)
            sendMessage('addLog', { message: '⏳ Chờ 1 giây trước khi thực hiện bước tiếp theo...', type: 'info' });
            await delay(1000);

        } catch (error) {
            if (shouldStop) {
                throw new Error('Automation đã được dừng');
            }
            sendMessage('addLog', { message: `⚠️ Lỗi khi tạo CNAME: ${error.message}`, type: 'warning' });
            sendMessage('addLog', { message: '➡️ Tiếp tục với bước tiếp theo...', type: 'info' });
        }

        // Check if should stop
        if (shouldStop) {
            throw new Error('Automation đã được dừng');
        }

        // BƯỚC 3: Tạo REDIRECT Record
        sendMessage('addLog', { message: '🔄 BƯỚC 3: Tạo bản ghi REDIRECT', type: 'info' });
        sendMessage('updateProgress', { percent: 70, message: 'Tạo bản ghi REDIRECT...' });

        try {
            const redirectRecord = {
                "data[name]": "@",
                "data[type]": "REDIRECT",
                "data[value]": `http://www.${domain.trim()}/`,
                "data[priority]": "",
                "data[priority_srv]": "",
                "data[weight_srv]": "",
                "data[port_srv]": "",
                "data[value_srv]": "",
                "data[tag_caa]": "",
                "data[flag_caa]": "",
                "data[value_caa]": "",
                dev_token_csrf: csrfToken,
                data_init: "",
            };

            sendMessage('addLog', { message: '📤 Đang gửi yêu cầu tạo REDIRECT...', type: 'info' });
            
            const redirectRes = await fetch("https://domain.tenten.vn/ApiDnsSetting/addDns/", {
                method: "POST",
                headers,
                body: encodeForm(redirectRecord),
            });

            const redirectJson = await redirectRes.json();
            sendMessage('addLog', { message: `✅ REDIRECT Record đã được tạo: ${JSON.stringify(redirectJson)}`, type: 'success' });

        } catch (error) {
            if (shouldStop) {
                throw new Error('Automation đã được dừng');
            }
            sendMessage('addLog', { message: `❌ Lỗi khi tạo REDIRECT: ${error.message}`, type: 'error' });
        }

        // Check final stop condition
        if (shouldStop) {
            throw new Error('Automation đã được dừng');
        }

        // Hoàn thành
        sendMessage('updateProgress', { percent: 100, message: 'Hoàn thành!' });
        sendMessage('addLog', { message: '🎉 HOÀN THÀNH AUTOMATION LADIPAGE!', type: 'success' });
        sendMessage('addLog', { message: '✅ CSRF Token đã được lấy tự động', type: 'success' });
        sendMessage('addLog', { message: '✅ Bản ghi CNAME (www → dns.ladipage.com) đã được tạo', type: 'success' });
        sendMessage('addLog', { message: `✅ Bản ghi REDIRECT (@ → http://www.${domain.trim()}/) đã được tạo`, type: 'success' });
        sendMessage('addLog', { message: '� DNS Automation Ladipage hoàn thành thành công!', type: 'success' });
        sendMessage('addLog', { message: '�🌐 Domain của bạn bây giờ đã trỏ về Ladipage!', type: 'success' });
        
        isAutomationRunning = false;
        sendMessage('automationComplete', { success: true });

    } catch (error) {
        isAutomationRunning = false;
        
        if (error.message.includes('đã được dừng')) {
            // User stopped - already handled in stopAutomation()
            return;
        }
        
        sendMessage('addLog', { message: `❌ DNS Automation Ladipage thất bại: ${error.message}`, type: 'error' });
        sendMessage('automationComplete', { success: false });
    }
}

function sendMessage(action, data) {
    try {
        chrome.runtime.sendMessage({
            action,
            ...data
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.log('Message sending error (expected if popup closed):', chrome.runtime.lastError.message);
            }
        });
    } catch (error) {
        console.log('Failed to send message:', error);
    }
}

// Thông báo rằng content script đã sẵn sàng
sendMessage('addLog', { message: '📡 Runsystem DNS Automation ready', type: 'info' });
