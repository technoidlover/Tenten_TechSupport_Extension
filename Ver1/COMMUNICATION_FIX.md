# 🔧 Sửa lỗi "Lỗi giao tiếp với trang web"

## ❌ Lỗi hiện tại:
```
[5:28:14 PM] ❌ Lỗi giao tiếp với trang web
```

## 🔍 Nguyên nhân có thể:

1. **Content script chưa được inject**
2. **Permissions không đủ**  
3. **Trang không phải domain.tenten.vn**
4. **Content script bị crash**

## ✅ Đã cải thiện:

### 1. Auto-inject Content Script:
- Popup sẽ tự động inject content script nếu chưa có
- Retry mechanism khi content script chưa sẵn sàng
- Better error messages với chi tiết

### 2. Ping-Pong Test:
- Thêm `ping` action để test connection
- Content script response `{status: 'ready'}`

### 3. Enhanced Error Handling:
- Detailed error messages
- Debug logs trong console
- Graceful fallback

## 🚀 Cách test ngay:

### Bước 1: Reload Extension
```
1. Vào chrome://extensions/
2. Click reload cho extension
3. Đóng popup và mở lại
```

### Bước 2: Test với file test.html
```
1. Mở test.html
2. Click "Simulate Tenten Page"  
3. Click "Test Extension Connection"
4. Test extension trên trang này trước
```

### Bước 3: Test trên Tenten thật
```
1. Truy cập domain.tenten.vn
2. Đăng nhập và vào DNS Settings
3. Mở extension popup
4. Kiểm tra status "Sẵn sàng thực thi"
```

## 🔧 Debug Commands:

### Trong Popup Console (Right-click popup → Inspect):
```javascript
// Test connection
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'ping'}, console.log);
});

// Check tab URL
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    console.log('Current tab:', tabs[0].url);
});
```

### Trong Trang Web Console (F12):
```javascript
// Check content script
console.log('Content script loaded:', typeof chrome !== 'undefined');

// Check CSRF token
console.log('CSRF tokens:', document.querySelectorAll("input[name='dev_token_csrf']"));
```

## 📊 Expected Flow:

1. **Popup opens** → Check if on domain.tenten.vn
2. **Send ping** → Content script responds
3. **If no response** → Auto-inject content script  
4. **Retry** → Should work now
5. **Start automation** → Send startDnsAutomation message

## 🆘 Nếu vẫn lỗi:

1. **Check URL**: Đảm bảo đang ở `domain.tenten.vn/Domain/setting-dns/...`
2. **Hard refresh**: Ctrl+Shift+R trên trang Tenten
3. **Restart Chrome**: Đôi khi cần restart browser
4. **Check console**: Xem lỗi trong cả popup và trang web console

Extension bây giờ có auto-inject và better error handling! 🎉
