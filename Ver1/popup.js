// Popup script để xử lý UI và giao tiếp với content script
document.addEventListener('DOMContentLoaded', function() {
    const domainInput = document.getElementById('domainInput');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const dnsAutomationBtn = document.getElementById('dnsAutomation');
    const progressSection = document.getElementById('progressSection');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const logSection = document.getElementById('logSection');
    const logContainer = document.getElementById('logContainer');
    const helpLink = document.getElementById('helpLink');
    const stopButton = document.getElementById('stopButton');

    // Global variable để track automation
    let currentTabId = null;

    // Lưu và tải domain từ storage
    loadSavedDomain();
    checkTentenPageStatus();

    // Event listeners
    domainInput.addEventListener('input', saveDomain);
    dnsAutomationBtn.addEventListener('click', handleDnsAutomation);
    helpLink.addEventListener('click', showHelp);
    
    // Global stop function để có thể gọi từ HTML
    window.stopAutomation = stopAutomation;

    // Kiểm tra xem người dùng có đang ở trang Tenten không
    async function checkTentenPageStatus() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (tab.url && tab.url.includes('domain.tenten.vn')) {
                updateStatus(true, 'Đã kết nối với Tenten');
                
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
                updateStatus(false, 'Cần truy cập domain.tenten.vn');
            }
        } catch (error) {
            updateStatus(false, 'Lỗi kết nối');
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
        addLog('1. Truy cập domain.tenten.vn và đăng nhập', 'info');
        addLog('2. Vào trang DNS Settings của domain', 'info');
        addLog('3. Nhập tên miền và click DNS Automation', 'info');
        addLog('4. Extension sẽ tự động tạo CNAME và REDIRECT trong ~30s', 'info');
        addLog('5. Trang sẽ tự động reload sau 1 giây khi hoàn thành', 'info');
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

    // Refresh status mỗi 5 giây
    setInterval(checkTentenPageStatus, 5000);
});
