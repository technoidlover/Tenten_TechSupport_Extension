# 🌐 Runsystem Tenten DNS Automation Extension**English** | [Tiếng Việt](#vietnamese)Extension for Runsystem's Techsupport - **Complete DNS Management Solution** with WHOIS Lookup, DNS Automation, and IP Widget displaying IP/Server information on every webpage.## 🎯 Key Features### ✅ 1. DNS Automation Ladipage**Automatically create DNS records to point domain to Ladipage**- 🔄 **Auto CSRF Detection**: Automatically fetch CSRF token from Tenten page- 📝 **CNAME Record**: Create `www → dns.ladipage.com` record- ↩️ **REDIRECT Record**: Create `@ → http://www.domain.com/` record- 📊 **Real-time Progress**: Progress bar and detailed logs- ⏹️ **Stop Function**: Stop automation at any time- 🔄 **Auto Refresh**: F5 automatically after success- ❌ **Error Handling**: No refresh on error to view details### ✅ 2. WHOIS Lookup**Domain registration information lookup**- 🔍 **Tenten API Integration**: Uses private API https://whois.tenten.vn- 🛡️ **CSRF Protection**: Automatically handles CSRF token and session cookies- 📋 **Complete Info Display**:  - Domain name and status  - Registration & expiration dates  - Owner information  - Nameservers  - Registrar information- 🧹 **Smart Input Cleaning**: Automatically cleans URL input- 💫 **Modern UI**: Beautiful interface with loading states- 🔧 **Independent Operation**: Works independently, no need to visit domain.tenten.vn### ✅ 3. IP Widget v2.3.0**Widget displaying IP and Server info on every webpage**#### 🎨 **Core Features**- 📍 **Fixed Position**: Widget fixed at bottom-right corner- 🌐 **Real IPv4 Detection**: Gets real IP from Google DNS (not hostname)- 🏳️ **Country Flag Images**: Displays country flags as PNG (255 countries)- 🖥️ **Server Information**: Shows HTTP Server headers- 🔄 **Refresh Button**: Updates information in real-time- ✕ **Close Button**: Close widget with red hover effect- 📱 **Responsive Design**: Automatically fits viewport#### ⚙️ **Technical Specs**- **Size**: 220px width, auto height- **Font**: 12px-13px, bold weights (600-700)- **Z-index**: 2147483647 (always on top)- **Flag Size**: 16x12px PNG images- **Position**: bottom: 18px, right: 18px- **APIs**: ipapi.co, ipinfo.io, ip-api.com (fallback)#### 🎯 **Visual Improvements**- ✅ **Bold Text**: All information displayed bold and larger- ✅ **Flag Images**: PNG flags instead of emoji (100% compatibility)- ✅ **Professional UI**: Gradient header, clean typography- ✅ **Hover Tooltips**: Country name on flag hover- ✅ **No Layout Conflicts**: Does not affect webpage layout## 📋 Installation & Usage### 📦 **Installation**1. **Download Extension**   ```   git clone or download ext_code folder   ```2. **Load into Chrome**   - Open Chrome → Settings → Extensions   - Enable "Developer mode"   - Click "Load unpacked" → select `ext_code` folder3. **Verify Installation**   - Extension icon appears on toolbar   - Visit any website → IP Widget appears bottom-right### 🔧 **Using DNS Automation**1. **Preparation**   - Login to https://domain.tenten.vn   - Go to DNS Settings of domain to configure2. **Run Automation**   - Click extension icon   - Enter domain (e.g., `example.com`)   - Click "🚀 DNS Automation"   - Monitor progress bar and logs3. **Results**   - CNAME: `www → dns.ladipage.com`   - REDIRECT: `@ → http://www.domain.com/`   - Page auto-refreshes on success### 🕵️ **Using WHOIS Lookup**1. **Domain Lookup**   - Click extension icon   - Enter domain (e.g., `google.com`)   - Click "🔍 WHOIS Lookup"2. **View Results**   - Complete registration information   - Expiration date and status   - Nameservers and registrar### 🌐 **Using IP Widget**1. **Auto Display**   - Widget automatically appears on all HTTP/HTTPS pages   - Shows IP, country flag, server info2. **Interaction**   - **Refresh**: Click 🔄 to update   - **Close**: Click ✕ to close widget   - **Tooltip**: Hover flag to see country name## 🧪 Testing & Troubleshooting### **IP Widget Testing**```javascript// Test widget functionality1. Visit any website → Widget appears bottom-right2. Check console (F12) for debug logs:   - "Looking up IP for domain: ..."   - "Found IPv4: x.x.x.x"   - "Got geo data from ipapi.co: ..."   - "Flag image loaded: flags/XX.png"```### **Common Issues & Solutions**#### ❌ **Extension not working**- ✅ Check Developer Mode enabled- ✅ Reload extension after code changes- ✅ Check console errors (F12)#### ❌ **DNS Automation fails**- ✅ Ensure logged into domain.tenten.vn- ✅ Go to DNS Settings page first- ✅ Check CSRF token in console logs#### ❌ **IP Widget not showing**- ✅ Check content script permissions- ✅ Verify website is HTTP/HTTPS- ✅ Look for JavaScript errors in console#### ❌ **Flag not showing**- ✅ Check flags/ folder has complete images- ✅ Verify web_accessible_resources in manifest- ✅ Check network tab for failed requests### **Debug Commands**```javascript// Test flag loadingchrome.runtime.getURL('flags/US.png')// Check widget injectionwindow.tentenIpWidgetInjected// Manual IP lookupfetch('https://dns.google/resolve?name=google.com&type=A')```## 📈 Version History & Changelog### **v2.3.0** (Current) - IP Widget Flag Images- ✅ **MAJOR**: Replaced emoji flags with PNG images- ✅ **UI**: Bold text, bigger fonts (12-13px)- ✅ **UX**: Fixed position, close button- ✅ **TECH**: 255 country flag images- ✅ **API**: Multiple geo API fallbacks### **v2.2.0** - IP Widget Enhancement- ✅ IP Widget with emoji flags- ✅ Draggable functionality- ✅ Position reset (double-click)- ✅ Viewport constraints### **v2.1.0** - Auto Ladipage DNS- ✅ DNS Automation for Ladipage- ✅ Auto CSRF detection- ✅ Progress tracking- ✅ Error handling### **v2.0.0** - WHOIS Integration- ✅ WHOIS Lookup functionality- ✅ Tenten API integration- ✅ Modern UI redesign### **v1.x** - Foundation- ✅ Basic DNS automation- ✅ Extension structure- ✅ Manifest v3 migration## 🎯 Roadmap & Future Features### **🔄 Planned Features**- 📡 **Webhook Records**: DNS webhook management- 🎛️ **Custom Records**: A, AAAA, MX, TXT records- 📦 **Batch Operations**: Multi-domain processing- 📊 **Analytics Dashboard**: Usage statistics- 🔔 **Notifications**: Domain expiry alerts### **🚀 Performance Improvements**- ⚡ **Caching**: Local storage for geo data- 🔄 **Background Sync**: Periodic updates- 📱 **Mobile Support**: Responsive design- 🎨 **Themes**: Light/dark mode options## 🤝 Support & Contribution### **Bug Reports**- 🐛 Report issues via GitHub Issues- 📋 Include browser version, OS, error logs- 🔍 Attach screenshots for UI issues### **Feature Requests**- 💡 Suggest new features- 📝 Describe detailed use cases- 🎯 Priority ranking by business value### **Development Setup**```bash# Clone repositorygit clone <repo-url>cd ext_code# Load extension1. Chrome → Extensions → Developer mode ON2. Load unpacked → select ext_code folder3. Test all features# Development workflow1. Edit code2. Reload extension3. Test on websites4. Check console logs5. Commit changes```## 📄 License & Credits### **License**MIT License - Free for personal and commercial use### **Credits**- 🏢 **Runsystem Vietnam** - Business requirements- 🌐 **Tenten.vn** - API integration partner- 🗺️ **Flag Images** - Based on country-flags repository- 🔧 **APIs**: Google DNS, ipapi.co, ipinfo.io### **Third-party Resources**- Flag images: 16x12px PNG format- Google Fonts: Segoe UI fallbacks- Chrome Extensions API v3---## 🎉 **STATUS: PRODUCTION READY**✅ **All features implemented and tested**  ✅ **Clean codebase with proper error handling**  ✅ **User-friendly interface with modern design**  ✅ **Cross-browser compatible (Chrome, Edge)**  ✅ **Security best practices applied**  **🚀 Extension ready for deployment and daily use!**---<a name="vietnamese"></a># 🌐 Runsystem Tenten DNS Automation Extension[English](#english) | **Tiếng Việt**Extension cho Runsystem's Techsupport - **Giải pháp quản lý DNS hoàn chỉnh** với WHOIS Lookup, DNS Automation, và IP Widget hiển thị thông tin IP/Server trên mọi trang web.## 🎯 Tính năng chính### ✅ 1. DNS Automation Ladipage**Tự động tạo DNS records để trỏ domain về Ladipage**- 🔄 **Auto CSRF Detection**: Tự động lấy CSRF token từ trang Tenten- 📝 **CNAME Record**: Tạo bản ghi `www → dns.ladipage.com`- ↩️ **REDIRECT Record**: Tạo bản ghi `@ → http://www.domain.com/`- 📊 **Real-time Progress**: Progress bar và log chi tiết- ⏹️ **Stop Function**: Dừng automation bất kỳ lúc nào- 🔄 **Auto Refresh**: F5 tự động sau khi thành công- ❌ **Error Handling**: Không refresh khi có lỗi để xem chi tiết### ✅ 2. WHOIS Lookup**Tra cứu thông tin đăng ký tên miền**- 🔍 **Tenten API Integration**: Sử dụng API riêng https://whois.tenten.vn- 🛡️ **CSRF Protection**: Tự động xử lý CSRF token và session cookies- 📋 **Complete Info Display**:  - Tên miền và trạng thái  - Ngày đăng ký & hết hạn  - Thông tin chủ sở hữu  - Nameservers  - Registrar information- 🧹 **Smart Input Cleaning**: Tự động làm sạch URL input- 💫 **Modern UI**: Giao diện đẹp với loading states- 🔧 **Independent Operation**: Hoạt động độc lập, không cần vào domain.tenten.vn### ✅ 3. IP Widget v2.3.0**Widget hiển thị IP và Server info trên mọi trang web**#### 🎨 **Core Features**- 📍 **Fixed Position**: Widget cố định góc dưới-phải- 🌐 **Real IPv4 Detection**: Lấy IP thực từ DNS Google (không phải hostname)- 🏳️ **Country Flag Images**: Hiển thị cờ quốc gia dưới dạng PNG (255 quốc gia)- 🖥️ **Server Information**: Hiển thị HTTP Server headers- 🔄 **Refresh Button**: Cập nhật thông tin real-time- ✕ **Close Button**: Tắt widget với hover effect đỏ- 📱 **Responsive Design**: Tự động fit viewport#### ⚙️ **Technical Specs**- **Size**: 220px width, auto height- **Font**: 12px-13px, bold weights (600-700)- **Z-index**: 2147483647 (luôn ở trên cùng)- **Flag Size**: 16x12px PNG images- **Position**: bottom: 18px, right: 18px- **APIs**: ipapi.co, ipinfo.io, ip-api.com (fallback)#### 🎯 **Visual Improvements**- ✅ **Bold Text**: Tất cả thông tin hiển thị đậm và to hơn- ✅ **Flag Images**: PNG flags thay vì emoji (tương thích 100%)- ✅ **Professional UI**: Gradient header, clean typography- ✅ **Hover Tooltips**: Country name khi hover flag- ✅ **No Layout Conflicts**: Không ảnh hưởng trang web## 📋 Cài đặt và Sử dụng### 📦 **Cài đặt**1. **Tải Extension**   ```   git clone hoặc download folder ext_code   ```2. **Load vào Chrome**
   - Mở Chrome → Settings → Extensions
   - Bật "Developer mode"
   - Click "Load unpacked" → chọn folder `ext_code`

3. **Kiểm tra cài đặt**
   - Extension icon xuất hiện trên toolbar
   - Vào bất kỳ website nào → IP Widget xuất hiện góc dưới-phải

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
   - Click "🔍 WHOIS Lookup"

2. **Xem kết quả**
   - Thông tin đăng ký đầy đủ
   - Ngày hết hạn và trạng thái
   - Nameservers và registrar

### 🌐 **Sử dụng IP Widget**

1. **Tự động hiển thị**
   - Widget tự động hiện trên mọi trang HTTP/HTTPS
   - Hiển thị IP, country flag, server info

2. **Tương tác**
   - **Refresh**: Click 🔄 để cập nhật
   - **Close**: Click ✕ để tắt widget
   - **Tooltip**: Hover flag để xem tên quốc gia

## 🧪 Kiểm tra & Khắc phục sự cố

### **Kiểm tra IP Widget**

```javascript
// Test chức năng widget
1. Vào bất kỳ website nào → Widget xuất hiện góc dưới-phải
2. Check console (F12) xem debug logs:
   - "Looking up IP for domain: ..."
   - "Found IPv4: x.x.x.x"
   - "Got geo data from ipapi.co: ..."
   - "Flag image loaded: flags/XX.png"
```

### **Sự cố thường gặp & Giải pháp**

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

### **Lệnh Debug**

```javascript
// Test flag loading
chrome.runtime.getURL('flags/US.png')

// Check widget injection
window.tentenIpWidgetInjected

// Manual IP lookup
fetch('https://dns.google/resolve?name=google.com&type=A')
```

## 📈 Lịch sử phiên bản & Changelog

### **v2.3.0** (Hiện tại) - IP Widget Flag Images

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

## 🎯 Roadmap & Tính năng tương lai

### **🔄 Tính năng đang lên kế hoạch**

- 📡 **Webhook Records**: Quản lý DNS webhook
- 🎛️ **Custom Records**: Bản ghi A, AAAA, MX, TXT
- 📦 **Batch Operations**: Xử lý multi-domain
- 📊 **Analytics Dashboard**: Thống kê sử dụng
- 🔔 **Notifications**: Cảnh báo hết hạn domain

### **🚀 Cải tiến hiệu suất**

- ⚡ **Caching**: Local storage cho geo data
- 🔄 **Background Sync**: Cập nhật định kỳ
- 📱 **Mobile Support**: Thiết kế responsive
- 🎨 **Themes**: Light/dark mode options

## 🤝 Hỗ trợ & Đóng góp

### **Báo cáo lỗi**

- 🐛 Báo cáo sự cố qua GitHub Issues
- 📋 Bao gồm phiên bản browser, OS, error logs
- 🔍 Đính kèm screenshots nếu có UI issues

### **Đề xuất tính năng**

- 💡 Đề xuất tính năng mới
- 📝 Mô tả chi tiết use cases
- 🎯 Xếp hạng độ ưu tiên theo giá trị business

### **Thiết lập Development**

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

✅ **Tất cả tính năng đã triển khai và kiểm tra**  
✅ **Codebase sạch với xử lý lỗi đúng cách**  
✅ **Giao diện thân thiện với thiết kế hiện đại**  
✅ **Tương thích đa trình duyệt (Chrome, Edge)**  
✅ **Áp dụng best practices bảo mật**  

**🚀 Extension sẵn sàng deploy và sử dụng hàng ngày!**

---

## 📁 Project Structure / Cấu trúc Project

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
- ✅ **Permission Minimal**: Only request necessary permissions

---

*Last updated: December 2024 | Version 2.3.0*  
*Cập nhật lần cuối: December 2024 | Phiên bản 2.3.0*
