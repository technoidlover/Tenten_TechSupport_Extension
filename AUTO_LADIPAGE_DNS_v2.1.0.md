# Auto Ladipage DNS Feature - Version 2.1.0

## Mô tả

Chức năng Auto Ladipage DNS cho phép tự động tạo DNS records để trỏ domain về Ladipage landing page.

## Tính năng

- Tự động tạo CNAME record (www → dns.ladipage.com)
- Tự động tạo REDIRECT record (@ → <http://www.domain.com/>)
- Hỗ trợ cả domain chính và subdomain
- Sử dụng tab hiện tại (không mở tab mới)
- Theo dõi tiến trình thực hiện
- Có thể dừng automation bất kỳ lúc nào

## Cách sử dụng

### 1. Chuẩn bị

- Đăng nhập vào domain.tenten.vn
- Truy cập vào DNS Settings của domain cần cấu hình
- Đảm bảo có quyền quản lý DNS của domain

### 2. Thực hiện

1. Mở extension popup
2. Click vào "Auto Ladipage DNS"
3. Nhập tên miền cần cấu hình
4. Chọn loại:
   - **Tên miền chính**: Tạo DNS cho domain chính (example.com)
   - **Tên miền phụ**: Tạo DNS cho subdomain (sub.example.com)
5. Click "🚀 Tạo DNS"
6. Extension sẽ tự động thực hiện trong ~30 giây

### 3. Kết quả

- Tên miền chính: Tạo CNAME (www) + REDIRECT (@)
- Tên miền phụ: Tạo CNAME (subdomain)
- Có thể theo dõi log thực hiện trong popup

## Lưu ý

- Phải truy cập vào DNS Settings page của domain trước khi sử dụng
- Extension sẽ kiểm tra xem bạn có đang ở đúng trang không
- Nếu gặp lỗi, kiểm tra console và log trong popup
- Có thể dừng automation bất kỳ lúc nào bằng nút "⛔ Dừng"

## Troubleshooting

- Nếu "Vui lòng truy cập trang domain.tenten.vn trước": Đảm bảo đã mở domain.tenten.vn
- Nếu "Content script chưa sẵn sàng": Extension sẽ tự động inject script
- Nếu "Không tìm thấy CSRF token": Đảm bảo đã truy cập đúng trang DNS Settings
- Nếu automation thất bại: Kiểm tra log chi tiết trong popup

## Công nghệ

- Sử dụng Chrome Extension Manifest V3
- Inject content script để tương tác với DOM
- Sử dụng fetch API để gọi API của Tenten
- Modular architecture với handler pattern
- Smooth UI transitions với CSS animations
