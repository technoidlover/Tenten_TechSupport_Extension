#  Runsystem Tenten DNS Automation Extension

[![Version](https://img.shields.io/badge/Version-2.3.0-blue)](https://github.com/runsystem/tenten-dns-automation)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-yellow)](https://chrome.google.com/webstore)

**Languages:** [ English](#english) | [ Tiếng Việt](#vietnamese)

---

##  English

### Overview

Extension for Runsystem's Techsupport - **Complete DNS Management Solution** with WHOIS Lookup, DNS Automation, and IP Widget displaying IP/Server information on every webpage.

###  Key Features

####  1. DNS Automation Ladipage

**Automatically create DNS records to point domain to Ladipage**

-  **Auto CSRF Detection**: Automatically fetch CSRF token from Tenten page
-  **CNAME Record**: Create www  dns.ladipage.com record
-  **REDIRECT Record**: Create @  http://www.domain.com/ record
-  **Real-time Progress**: Progress bar and detailed logs
-  **Stop Function**: Stop automation at any time
-  **Auto Refresh**: F5 automatically after success
-  **Error Handling**: No refresh on error to view details

####  2. WHOIS Lookup

**Domain registration information lookup**

-  **Tenten API Integration**: Uses private API https://whois.tenten.vn
-  **CSRF Protection**: Automatically handles CSRF token and session cookies
-  **Complete Info Display**:
  - Domain name and status
  - Registration & expiration dates
  - Owner information
  - Nameservers
  - Registrar information
-  **Smart Input Cleaning**: Automatically cleans URL input
-  **Modern UI**: Beautiful interface with loading states
-  **Independent Operation**: Works independently, no need to visit domain.tenten.vn

####  3. IP Widget v2.3.0

**Widget displaying IP and Server info on every webpage**

#####  Core Features

-  **Fixed Position**: Widget fixed at bottom-right corner
-  **Real IPv4 Detection**: Gets real IP from Google DNS (not hostname)
-  **Country Flag Images**: Displays country flags as PNG (255 countries)
-  **Server Information**: Shows HTTP Server headers
-  **Refresh Button**: Updates information in real-time
-  **Close Button**: Close widget with red hover effect
-  **Responsive Design**: Automatically fits viewport

#####  Technical Specs

- **Size**: 220px width, auto height
- **Font**: 12px-13px, bold weights (600-700)
- **Z-index**: 2147483647 (always on top)
- **Flag Size**: 16x12px PNG images
- **Position**: bottom: 18px, right: 18px
- **APIs**: ipapi.co, ipinfo.io, ip-api.com (fallback)

#####  Visual Improvements

-  **Bold Text**: All information displayed bold and larger
-  **Flag Images**: PNG flags instead of emoji (100% compatibility)
-  **Professional UI**: Gradient header, clean typography
-  **Hover Tooltips**: Country name on flag hover
-  **No Layout Conflicts**: Does not affect webpage layout

###  Installation & Usage

####  Installation

1. **Download Extension**
   `
   git clone repository-url
   # or download ext_code folder
   `

2. **Load into Chrome**
   - Open Chrome  Settings  Extensions
   - Enable "Developer mode"
   - Click "Load unpacked"  select ext_code folder

3. **Verify Installation**
   - Extension icon appears on toolbar
   - Visit any website  IP Widget appears bottom-right

####  Using DNS Automation

1. **Preparation**
   - Login to https://domain.tenten.vn
   - Go to DNS Settings of domain to configure

2. **Run Automation**
   - Click extension icon
   - Enter domain (e.g., example.com)
   - Click " DNS Automation"
   - Monitor progress bar and logs

3. **Results**
   - CNAME: www  dns.ladipage.com
   - REDIRECT: @  http://www.domain.com/
   - Page auto-refreshes on success

###  STATUS: PRODUCTION READY

 **All features implemented and tested**
 **Clean codebase with proper error handling**
 **User-friendly interface with modern design**
 **Cross-browser compatible (Chrome, Edge)**
 **Security best practices applied**

 **Extension ready for deployment and daily use!**

---

##  Tiếng Việt

### Tổng quan

Extension cho Runsystem's Techsupport - **Giải pháp quản lý DNS hoàn chỉnh** với WHOIS Lookup, DNS Automation, và IP Widget hiển thị thông tin IP/Server trên mọi trang web.

###  Tính năng chính

####  1. DNS Automation Ladipage

**Tự động tạo DNS records để trỏ domain về Ladipage**

-  **Auto CSRF Detection**: Tự động lấy CSRF token từ trang Tenten
-  **CNAME Record**: Tạo bản ghi www  dns.ladipage.com
-  **REDIRECT Record**: Tạo bản ghi @  http://www.domain.com/
-  **Real-time Progress**: Progress bar và log chi tiết
-  **Stop Function**: Dừng automation bất kỳ lúc nào
-  **Auto Refresh**: F5 tự động sau khi thành công
-  **Error Handling**: Không refresh khi có lỗi để xem chi tiết

####  2. WHOIS Lookup

**Tra cứu thông tin đăng ký tên miền**

-  **Tenten API Integration**: Sử dụng API riêng https://whois.tenten.vn
-  **CSRF Protection**: Tự động xử lý CSRF token và session cookies
-  **Complete Info Display**:
  - Tên miền và trạng thái
  - Ngày đăng ký & hết hạn
  - Thông tin chủ sở hữu
  - Nameservers
  - Registrar information
-  **Smart Input Cleaning**: Tự động làm sạch URL input
-  **Modern UI**: Giao diện đẹp với loading states
-  **Independent Operation**: Hoạt động độc lập, không cần vào domain.tenten.vn

####  3. IP Widget v2.3.0

**Widget hiển thị IP và Server info trên mọi trang web**

#####  Core Features

-  **Fixed Position**: Widget cố định góc dưới-phải
-  **Real IPv4 Detection**: Lấy IP thực từ DNS Google (không phải hostname)
-  **Country Flag Images**: Hiển thị cờ quốc gia dưới dạng PNG (255 quốc gia)
-  **Server Information**: Hiển thị HTTP Server headers
-  **Refresh Button**: Cập nhật thông tin real-time
-  **Close Button**: Tắt widget với hover effect đỏ
-  **Responsive Design**: Tự động fit viewport

#####  Technical Specs

- **Size**: 220px width, auto height
- **Font**: 12px-13px, bold weights (600-700)
- **Z-index**: 2147483647 (luôn ở trên cùng)
- **Flag Size**: 16x12px PNG images
- **Position**: bottom: 18px, right: 18px
- **APIs**: ipapi.co, ipinfo.io, ip-api.com (fallback)

#####  Visual Improvements

-  **Bold Text**: Tất cả thông tin hiển thị đậm và to hơn
-  **Flag Images**: PNG flags thay vì emoji (tương thích 100%)
-  **Professional UI**: Gradient header, clean typography
-  **Hover Tooltips**: Country name khi hover flag
-  **No Layout Conflicts**: Không ảnh hưởng trang web

###  Cài đặt và Sử dụng

####  Cài đặt

1. **Tải Extension**
   `
   git clone repository-url
   # hoặc download folder ext_code
   `

2. **Load vào Chrome**
   - Mở Chrome  Settings  Extensions
   - Bật "Developer mode"
   - Click "Load unpacked"  chọn folder ext_code

3. **Kiểm tra cài đặt**
   - Extension icon xuất hiện trên toolbar
   - Vào bất kỳ website nào  IP Widget xuất hiện góc dưới-phải

####  Sử dụng DNS Automation

1. **Chuẩn bị**
   - Đăng nhập https://domain.tenten.vn
   - Vào DNS Settings của domain cần config

2. **Chạy Automation**
   - Click extension icon
   - Nhập domain (ví dụ: example.com)
   - Click " DNS Automation"
   - Theo dõi progress bar và logs

3. **Kết quả**
   - CNAME: www  dns.ladipage.com
   - REDIRECT: @  http://www.domain.com/
   - Trang tự động refresh khi thành công

###  TRẠNG THÁI: SẴN SÀNG PRODUCTION

 **Tất cả tính năng đã triển khai và kiểm tra**
 **Codebase sạch với xử lý lỗi đúng cách**
 **Giao diện thân thiện với thiết kế hiện đại**
 **Tương thích đa trình duyệt (Chrome, Edge)**
 **Áp dụng best practices bảo mật**

 **Extension sẵn sàng deploy và sử dụng hàng ngày!**

---

##  Project Structure | Cấu trúc Project

`
ext_code/
  manifest.json          # Extension manifest v3
  popup.html            # Main popup interface  
  popup.css             # Popup styling
  popup.js              # Popup logic & UI
  content.js            # Tenten.vn content script
  ip-widget-content.js  # IP Widget content script
  background.js         # Service worker
  icons/                # Extension icons
  flags/                # Country flag images (255 files)
    US.png, VN.png, ...
    _unknown.png         # Fallback flag
  js/                   # Utility modules
    whois-handler.js
    domain-utils.js
    ui-manager.js
  README.md             # This file
`

---

*Last updated: July 2025 | Version 2.3.0*
*Cập nhật lần cuối: Tháng 7 2025 | Phiên bản 2.3.0*
