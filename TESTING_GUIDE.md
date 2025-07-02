# 🧪 Testing Extension - Hướng dẫn kiểm tra API thực sự được gọi

## 🚀 1. Load Extension vào Chrome

1. Mở Chrome và đi đến: `chrome://extensions/`
2. Bật "Developer mode" (toggle ở góc trên phải)
3. Click "Load unpacked"
4. Chọn folder: `c:\HelpTenten\ext_code`
5. Extension sẽ xuất hiện với icon runsystem

## 🔍 2. Test WHOIS API

1. Click vào extension icon để mở popup
2. Nhập domain (ví dụ: `google.com`)
3. Click "WHOIS Lookup"
4. Mở Chrome DevTools (F12), vào tab Console
5. **Kiểm tra logs**:
   ```
   === WHOIS Lookup Started ===
   Domain: google.com
   Clean domain: google.com
   Sending message to background script...
   === Background received message ===
   Message: {action: 'whoisLookup', domain: 'google.com'}
   Handling WHOIS lookup for domain: google.com
   Fetching WHOIS for: google.com
   Step 1: Getting CSRF token and session from Tenten homepage...
   ```

## 🌍 3. Test IP Info API

1. Nhập domain/IP (ví dụ: `google.com`)
2. Click "IP/Domain Info"
3. Kiểm tra logs trong Console:
   ```
   === IP Info Lookup Started ===
   Host: google.com
   Sending IP Info request for: google.com
   === Background received message ===
   Message: {action: 'ipInfo', host: 'google.com'}
   Handling IP Info lookup for host: google.com
   Fetching IP Info for: google.com
   Step 1: Getting CSRF token from check-host.net...
   ```

## ✅ 4. Dấu hiệu API đang thực sự chạy

### WHOIS API:
- Console log: `Fetching WHOIS for: [domain]`
- Console log: `Step 1: Getting CSRF token...`
- Console log: `Step 2: Making WHOIS request...`
- Thấy requests trong Network tab tới `whois.tenten.vn`
- Loading spinner xuất hiện trên button
- Response data hiển thị trong popup

### IP Info API:
- Console log: `Fetching IP Info for: [host]`
- Console log: `Step 1: Getting CSRF token from check-host.net...`
- Console log: `Step 2: Making IP info request...`
- Thấy requests trong Network tab tới `check-host.net`
- Loading spinner xuất hiện trên button
- Response data hiển thị trong popup

## 🐛 5. Troubleshooting

### Nếu không thấy background logs:
1. Vào `chrome://extensions/`
2. Click "Service worker" dưới extension
3. Console window sẽ mở cho background script
4. Thử lại test

### Nếu popup không hoạt động:
1. Refresh extension: click reload icon ở `chrome://extensions/`
2. Đóng và mở lại popup
3. Check console errors

### Nếu không thấy network requests:
1. Mở DevTools (F12)
2. Vào tab Network
3. Clear network log
4. Chạy test lại
5. Filter theo domain: `tenten.vn` hoặc `check-host.net`

## 📊 6. Expected Results

### WHOIS Success:
- Hiển thị thông tin domain: ngày đăng ký, hết hạn, chủ sở hữu, etc.
- Warning message nếu có lỗi API nhưng vẫn show fallback data
- Nguồn: "Tenten API" hoặc "Tenten HTML"

### IP Info Success:
- Hiển thị thông tin IP: địa chỉ, hostname, ISP, country, etc.
- Warning message nếu có lỗi API nhưng vẫn show fallback data  
- Nguồn: "Check-Host.net"

## 🎯 7. Performance Check

- WHOIS lookup: ~2-5 giây
- IP Info lookup: ~3-7 giây
- Loading states: Button shows loading animation
- Error handling: Graceful fallback khi API fail
- No silent failures: Luôn có feedback cho user

---

## 📝 Notes

- Extension hoạt động độc lập, không cần mở domain.tenten.vn để dùng WHOIS/IP Info
- API được gọi từ background script, bypass CORS issues
- Real-time console logging để debug và verify API calls
- Fallback data được trả về khi API fails để user không bị stuck
