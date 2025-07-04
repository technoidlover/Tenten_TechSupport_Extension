# Hướng dẫn cài đặt Tenten DNS Automation Extension

## Bước 1: Tải và cài đặt Extension

1. **Mở Chrome/Edge browser**
2. **Vào Extension Management:**
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. **Bật Developer Mode** (toggle ở góc trên bên phải)
4. **Click "Load unpacked"**
5. **Chọn thư mục `ext_code`** (thư mục chứa file manifest.json)
6. **Extension sẽ xuất hiện trong danh sách và toolbar**

## Bước 2: Sử dụng Extension

### Chuẩn bị:
- Đăng nhập vào tài khoản Tenten
- Truy cập: `https://domain.tenten.vn/Domain/setting-dns/[your-domain]`
- Đảm bảo bạn có quyền quản lý DNS cho domain

### Thực hiện:
1. **Click vào icon extension** trên toolbar
2. **Nhập tên miền** của bạn (ví dụ: example.com)
3. **Kiểm tra status** - phải hiển thị "Sẵn sàng thực thi"
4. **Click "DNS Automation"**
5. **Theo dõi progress** và log trong popup
6. **Chờ hoàn thành** - extension sẽ tự động:
   - Lấy CSRF token
   - Tạo CNAME record (www -> dns.ladipage.com)
   - Tạo REDIRECT record (@ -> http://www.yourdomain.com/)

## Troubleshooting

### ❌ "Cần truy cập domain.tenten.vn"
- Đảm bảo bạn đang ở trang domain.tenten.vn
- Refresh trang và thử lại

### ❌ "Cần truy cập trang DNS Settings"
- Vào trang DNS Settings của domain cụ thể
- URL dạng: `https://domain.tenten.vn/Domain/setting-dns/yourdomain.com`

### ❌ "Không tìm thấy CSRF token"
- Đăng nhập lại tài khoản Tenten
- Refresh trang DNS Settings
- Đảm bảo có quyền quản lý domain

### ❌ Extension không load
- Kiểm tra Developer Mode đã bật
- Reload extension trong chrome://extensions/
- Kiểm tra console cho errors

## Tính năng sắp tới

Extension được thiết kế để mở rộng. Các tính năng đang phát triển:

- 🔗 **Webhook Records**: Tạo và quản lý webhook DNS
- ⚙️ **Custom Records**: Tạo bản ghi DNS tùy chỉnh
- 📋 **Batch Operations**: Xử lý hàng loạt nhiều domain
- 📊 **DNS Analytics**: Thống kê và giám sát DNS

*Các tính năng này hiện đang "disabled" trong menu và sẽ được kích hoạt trong các phiên bản tương lai.*

## Hỗ trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra console browser (F12) để xem lỗi
2. Đảm bảo đúng format tên miền (không có http/https)
3. Thử với domain khác để xác định vấn đề
4. Restart browser nếu cần thiết
