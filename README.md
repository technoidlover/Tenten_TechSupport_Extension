# Runsystem Tenten DNS Automation

Extension for Runsystem's Techsupport - Tự động tạo CNAME + REDIRECT để trỏ domain Tenten về Ladipage + WHOIS Lookup.

## Tính năng hiện tại

### ✅ DNS Automation Ladipage (Đã hoàn thành)
- Tự động lấy CSRF token từ trang Tenten
- Tạo bản ghi CNAME (www → dns.ladipage.com)
- Tạo bản ghi REDIRECT (@ → `http://www.domain.com/`)
- Giao diện trực quan với progress bar và log real-time
- Chức năng dừng automation bất kỳ lúc nào
- **Auto-refresh trang khi thành công** (F5 tự động sau 3 giây)
- **Không refresh khi có lỗi** để Techsupport đọc chi tiết lỗi

### ✅ WHOIS Lookup (Đã hoàn thành)
- **Tra cứu thông tin tên miền**: Lấy thông tin đăng ký domain
- **API Tenten độc quyền**: Chỉ sử dụng API https://whois.tenten.vn/home/check-domain
- **Xử lý CSRF protection**: Tự động lấy CSRF token và session cookies
- **Hiển thị đầy đủ thông tin**:
  - Tên miền
  - Ngày đăng ký
  - Ngày hết hạn
  - Chủ sở hữu
  - Cờ trạng thái
  - Nơi đăng ký
  - Nameserver
- **Clean Input**: Tự động làm sạch tên miền (loại bỏ protocol, www, path)
- **Giao diện trực quan**: Hiển thị thông tin dễ đọc với loading states
- **Hoạt động độc lập**: Không cần truy cập domain.tenten.vn để sử dụng WHOIS

### 🔄 Tính năng sắp tới
- **Webhook Records**: Quản lý webhook DNS
- **Custom Records**: Tạo bản ghi tùy chỉnh  
- **Batch Operations**: Xử lý hàng loạt nhiều domain

## Cách sử dụng

1. **Cài đặt extension**
   - Load unpacked extension trong Chrome Developer Mode
   - Chọn thư mục `ext_code`

2. **Sử dụng DNS Automation**
   - Truy cập https://domain.tenten.vn và đăng nhập
   - Vào trang DNS Settings của domain cần cấu hình
   - Click vào extension icon
   - Nhập tên miền (ví dụ: example.com)
   - Click "DNS Automation"
   - Chờ extension tự động tạo các bản ghi

3. **Sử dụng WHOIS Lookup**
   - Click vào extension icon
   - Nhập tên miền cần tra cứu (ví dụ: google.com)
   - Click "WHOIS Lookup"
   - Xem thông tin đăng ký tên miền được hiển thị

## Cấu trúc project

```
ext_code/
├── manifest.json       # Extension manifest v3
├── popup.html         # Giao diện popup
├── popup.css          # Styles cho popup
├── popup.js           # Logic xử lý popup
├── content.js         # Content script chạy trên Tenten
├── background.js      # Service worker
├── icons/            # Icons cho extension
└── README.md         # File này
```

## Yêu cầu

- Chrome/Edge browser với Developer Mode enabled
- Tài khoản Tenten với quyền quản lý DNS
- Truy cập trang DNS Settings trước khi sử dụng

## Phát triển

Extension được thiết kế để dễ dàng mở rộng:

- Menu items cho các tính năng mới đã được chuẩn bị
- Structure code modular, dễ thêm chức năng
- UI responsive và user-friendly

## Troubleshooting

**Extension không hoạt động:**
- Kiểm tra đã truy cập đúng trang domain.tenten.vn
- Đảm bảo đã đăng nhập và có quyền quản lý DNS
- Refresh trang và thử lại

**Không tìm thấy CSRF token:**
- Truy cập trang DNS Settings của domain trước
- Đảm bảo trang đã load hoàn toàn

## License

MIT License
