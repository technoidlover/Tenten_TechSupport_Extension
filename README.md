# 🌐 Runsystem Tenten DNS Automation Extension

Extension for Runsystem's Techsupport - **Complete DNS Management Solution** với WHOIS Lookup, DNS Automation, và IP Widget hiển thị thông tin IP/Server trên mọi trang web.

## 🎯 Tính năng chính

### ✅ 1. DNS Automation Ladipage
**Tự động tạo DNS records để trỏ domain về Ladipage**
- 🔄 **Auto CSRF Detection**: Tự động lấy CSRF token từ trang Tenten
- 📝 **CNAME Record**: Tạo bản ghi `www → dns.ladipage.com`
- ↩️ **REDIRECT Record**: Tạo bản ghi `@ → http://www.domain.com/`
- 📊 **Real-time Progress**: Progress bar và log chi tiết
- ⏹️ **Stop Function**: Dừng automation bất kỳ lúc nào
- 🔄 **Auto Refresh**: F5 tự động sau khi thành công
- ❌ **Error Handling**: Không refresh khi có lỗi để xem chi tiết

### ✅ 2. WHOIS Lookup
**Tra cứu thông tin đăng ký tên miền**
- 🔍 **Tenten API Integration**: Sử dụng API riêng https://whois.tenten.vn
- 🛡️ **CSRF Protection**: Tự động xử lý CSRF token và session cookies
- 📋 **Complete Info Display**:
  - Tên miền và trạng thái
  - Ngày đăng ký & hết hạn
  - Thông tin chủ sở hữu
  - Nameservers
  - Registrar information
- 🧹 **Smart Input Cleaning**: Tự động làm sạch URL input
- 💫 **Modern UI**: Giao diện đẹp với loading states
- 🔧 **Independent Operation**: Hoạt động độc lập, không cần vào domain.tenten.vn

### ✅ 3. IP Widget v2.3.0 
**Widget hiển thị IP và Server info trên mọi trang web**

#### 🎨 **Core Features**
- 📍 **Fixed Position**: Widget cố định góc dưới-phải
- 🌐 **Real IPv4 Detection**: Lấy IP thực từ DNS Google (không phải hostname)
- 🏳️ **Country Flag Images**: Hiển thị cờ quốc gia dưới dạng PNG (255 quốc gia)
- 🖥️ **Server Information**: Hiển thị HTTP Server headers
- 🔄 **Refresh Button**: Cập nhật thông tin real-time
- ✕ **Close Button**: Tắt widget với hover effect đỏ
- 📱 **Responsive Design**: Tự động fit viewport

#### ⚙️ **Technical Specs**
- **Size**: 220px width, auto height
- **Font**: 12px-13px, bold weights (600-700)
- **Z-index**: 2147483647 (luôn ở trên cùng)
- **Flag Size**: 16x12px PNG images
- **Position**: bottom: 18px, right: 18px
- **APIs**: ipapi.co, ipinfo.io, ip-api.com (fallback)

#### 🎯 **Visual Improvements**
- ✅ **Bold Text**: Tất cả thông tin hiển thị đậm và to hơn
- ✅ **Flag Images**: PNG flags thay vì emoji (tương thích 100%)
- ✅ **Professional UI**: Gradient header, clean typography
- ✅ **Hover Tooltips**: Country name khi hover flag
- ✅ **No Layout Conflicts**: Không ảnh hưởng trang web

## � Cài đặt và Sử dụng

### 📦 **Installation**
1. **Download Extension**
   ```
   git clone hoặc download folder ext_code
   ```

2. **Load vào Chrome**
   - Mở Chrome → Settings → Extensions
   - Bật "Developer mode"
   - Click "Load unpacked" → chọn folder `ext_code`

3. **Verify Installation**
   - Extension icon xuất hiện trên toolbar
   - Visit bất kỳ website nào → IP Widget xuất hiện góc dưới-phải

### 🔧 **Sử dụng DNS Automation**
1. **Chuẩn bị**
   - Đăng nhập https://domain.tenten.vn
   - Vào DNS Settings của domain cần config

2. **Chạy Automation**
   - Click extension icon
   - Nhập domain (ví dụ: `example.com`)
   - Click "🚀 DNS Automation"
   - Theo dõi progress bar và logs

3. **Kết quả**
   - CNAME: `www → dns.ladipage.com`
   - REDIRECT: `@ → http://www.domain.com/`
   - Trang tự động refresh khi thành công

### 🕵️ **Sử dụng WHOIS Lookup**
1. **Tra cứu domain**
   - Click extension icon
   - Nhập domain (ví dụ: `google.com`)
   - Click "� WHOIS Lookup"

2. **Xem kết quả**
   - Thông tin đăng ký đầy đủ
   - Ngày hết hạn và trạng thái
   - Nameservers và registrar

### 🌐 **Sử dụng IP Widget**
1. **Auto Display**
   - Widget tự động hiện trên mọi trang HTTP/HTTPS
   - Hiển thị IP, country flag, server info

2. **Tương tác**
   - **Refresh**: Click 🔄 để cập nhật
   - **Close**: Click ✕ để tắt widget
   - **Tooltip**: Hover flag để xem tên quốc gia

## 📁 Cấu trúc Project

```
ext_code/
├── 📄 manifest.json          # Extension manifest v3
├── 🎨 popup.html            # Main popup interface  
├── 🎨 popup.css             # Popup styling
├── ⚙️ popup.js              # Popup logic & UI
├── ⚙️ content.js            # Tenten.vn content script
├── ⚙️ ip-widget-content.js  # IP Widget content script
├── ⚙️ background.js         # Service worker
├── 📁 icons/                # Extension icons
├── 📁 flags/                # Country flag images (255 files)
│   ├── US.png, VN.png, ...
│   └── _unknown.png         # Fallback flag
├── 📁 js/                   # Utility modules
│   ├── whois-handler.js
│   ├── domain-utils.js
│   └── ui-manager.js
└── 📖 README.md             # This file
```

## 🛠️ Development & Architecture

### **Manifest v3 Structure**
- **Service Worker**: background.js
- **Content Scripts**: 
  - `content.js` (domain.tenten.vn only)
  - `ip-widget-content.js` (all HTTP/HTTPS sites)
- **Web Accessible Resources**: `flags/*.png`
- **Permissions**: activeTab, storage, scripting, tabs

### **API Integration**
- **DNS Lookup**: Google DNS API (https://dns.google/resolve)
- **Geolocation**: 
  - Primary: ipapi.co (HTTPS)
  - Fallback: ipinfo.io, ip-api.com
- **WHOIS**: Tenten private API (whois.tenten.vn)

### **Security Features**
- ✅ **CSRF Protection**: Auto token detection
- ✅ **HTTPS First**: Prioritize secure APIs
- ✅ **Content Security**: No eval(), inline scripts
- ✅ **Permission Minimal**: Chỉ yêu cầu quyền cần thiết

## 🧪 Testing & Troubleshooting

### **IP Widget Testing**
```javascript
// Test widget functionality
1. Visit any website → Widget appears bottom-right
2. Check console (F12) for debug logs:
   - "Looking up IP for domain: ..."
   - "Found IPv4: x.x.x.x"
   - "Got geo data from ipapi.co: ..."
   - "Flag image loaded: flags/XX.png"
```

### **Common Issues & Solutions**

#### ❌ **Extension không hoạt động**
- ✅ Kiểm tra Developer Mode enabled
- ✅ Reload extension sau khi thay đổi code
- ✅ Check console errors (F12)

#### ❌ **DNS Automation fail**  
- ✅ Đảm bảo đã đăng nhập domain.tenten.vn
- ✅ Vào DNS Settings page trước
- ✅ Check CSRF token trong console logs

#### ❌ **IP Widget không hiện**
- ✅ Check content script permissions
- ✅ Verify website là HTTP/HTTPS
- ✅ Look for JavaScript errors in console

#### ❌ **Flag không hiện**
- ✅ Check flags/ folder có đầy đủ images
- ✅ Verify web_accessible_resources trong manifest
- ✅ Check network tab cho failed requests

### **Debug Commands**
```javascript
// Test flag loading
chrome.runtime.getURL('flags/US.png')

// Check widget injection
window.tentenIpWidgetInjected

// Manual IP lookup
fetch('https://dns.google/resolve?name=google.com&type=A')
```

## 📈 Version History & Changelog

### **v2.3.0** (Current) - IP Widget Flag Images
- ✅ **MAJOR**: Thay emoji flags bằng PNG images
- ✅ **UI**: Bold text, bigger fonts (12-13px)
- ✅ **UX**: Fixed position, close button
- ✅ **TECH**: 255 country flag images
- ✅ **API**: Multiple geo API fallbacks

### **v2.2.0** - IP Widget Enhancement  
- ✅ IP Widget với emoji flags
- ✅ Draggable functionality
- ✅ Position reset (double-click)
- ✅ Viewport constraints

### **v2.1.0** - Auto Ladipage DNS
- ✅ DNS Automation cho Ladipage
- ✅ Auto CSRF detection
- ✅ Progress tracking
- ✅ Error handling

### **v2.0.0** - WHOIS Integration
- ✅ WHOIS Lookup functionality  
- ✅ Tenten API integration
- ✅ Modern UI redesign

### **v1.x** - Foundation
- ✅ Basic DNS automation
- ✅ Extension structure
- ✅ Manifest v3 migration

## 🎯 Roadmap & Future Features

### **🔄 Planned Features**
- 📡 **Webhook Records**: DNS webhook management
- 🎛️ **Custom Records**: A, AAAA, MX, TXT records
- 📦 **Batch Operations**: Multi-domain processing  
- 📊 **Analytics Dashboard**: Usage statistics
- 🔔 **Notifications**: Domain expiry alerts

### **🚀 Performance Improvements**
- ⚡ **Caching**: Local storage cho geo data
- 🔄 **Background Sync**: Periodic updates
- 📱 **Mobile Support**: Responsive design
- 🎨 **Themes**: Light/dark mode options

## 🤝 Support & Contribution

### **Bug Reports**
- 🐛 Report issues via GitHub Issues
- 📋 Include browser version, OS, error logs
- 🔍 Attach screenshots nếu có UI issues

### **Feature Requests**  
- 💡 Suggest new features
- 📝 Describe use cases chi tiết
- 🎯 Priority ranking by business value

### **Development Setup**
```bash
# Clone repository
git clone <repo-url>
cd ext_code

# Load extension
1. Chrome → Extensions → Developer mode ON
2. Load unpacked → chọn folder ext_code
3. Test các features

# Development workflow
1. Edit code
2. Reload extension
3. Test trên websites
4. Check console logs
5. Commit changes
```

## 📄 License & Credits

### **License**
MIT License - Free for personal and commercial use

### **Credits**
- 🏢 **Runsystem Vietnam** - Business requirements
- 🌐 **Tenten.vn** - API integration partner  
- 🗺️ **Flag Images** - Based on country-flags repository
- 🔧 **APIs**: Google DNS, ipapi.co, ipinfo.io

### **Third-party Resources**
- Flag images: 16x12px PNG format
- Google Fonts: Segoe UI fallbacks
- Chrome Extensions API v3

---

## 🎉 **TRẠNG THÁI: SẴN SÀNG PRODUCTION**

✅ **All features implemented and tested**  
✅ **Clean codebase with proper error handling**  
✅ **User-friendly interface with modern design**  
✅ **Cross-browser compatible (Chrome, Edge)**  
✅ **Security best practices applied**  

**🚀 Extension ready for deployment and daily use!**

---

*Last updated: December 2024 | Version 2.3.0*
