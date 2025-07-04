# Runsystem Tenten DNS Automation

Extension for Runsystem's Techsupport - Tự động tạo CNAME + REDIRECT để trỏ domain Tenten về Ladipage + WHOIS Lookup + **IP Widget v2.2.0**.

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

### ✅ IP Widget v2.2.0 (Mới hoàn thành)
- **Hiển thị IP và Server**: Widget nhỏ gọn ở góc dưới phải mọi trang web
- **IPv4 Address**: Lấy IP thực của website từ DNS Google
- **Country Flag**: Hiển thị cờ quốc gia của IP với hover tooltip
- **Server Info**: Hiển thị thông tin server từ HTTP headers
- **Draggable**: Kéo thả widget bằng cách click header
- **Position Reset**: Double-click header để reset về vị trí ban đầu
- **Compact Design**: Thiết kế nhỏ gọn, không cản trở nội dung trang
- **Refresh Button**: Nút refresh gọn gàng trong header
- **Fixed Layout Issues**: Không bị kéo dài đáy hay thừa khoảng trắng
- **Viewport Constraints**: Widget luôn nằm trong màn hình

#### IP Widget Features:
- 🌐 **Real IPv4 Detection**: Lấy IP thực từ DNS, không phải hostname
- 🏳️ **Country Flag Display**: Emoji cờ quốc gia với tên nước khi hover
- 🔄 **One-Click Refresh**: Cập nhật thông tin IP/server nhanh chóng
- 🖱️ **Smooth Dragging**: Kéo thả mượt mà, không làm biến dạng layout
- 📍 **Smart Positioning**: Tự động giữ widget trong viewport
- 💡 **Clean UI**: Giao diện đẹp, professional, không ảnh hưởng trang web

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

3. **Sử dụng IP Widget**
   - IP Widget sẽ tự động hiển thị ở góc dưới bên phải mọi trang web
   - Kéo thả widget đến vị trí mong muốn
   - Thu gọn/mở rộng bằng nút "-" hoặc "+"
   - Click "🔄 Refresh" để cập nhật thông tin IP
   - Widget sẽ tự động lưu vị trí và trạng thái
   - Mở file `IP_WIDGET_DEMO.html` để test widget

4. **Sử dụng WHOIS Lookup**
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
