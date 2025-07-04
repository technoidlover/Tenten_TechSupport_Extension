# IP Widget Feature - Version 2.2.0

## Tính năng mới: Widget hiển thị IP website

### 📋 Mô tả
- Widget hiển thị IP của website ở góc dưới bên phải màn hình
- Tự động hiển thị trên tất cả các trang web (HTTP/HTTPS)
- Có thể kéo thả, thu gọn/mở rộng, và refresh thông tin

### 🚀 Chức năng chính

#### 1. Hiển thị thông tin IP
- **Domain**: Tên miền hiện tại
- **IPv4**: Địa chỉ IPv4 của website
- **IPv6**: Địa chỉ IPv6 của website (nếu có)
- **Server**: Thông tin server (từ HTTP header)

#### 2. Tương tác
- **Thu gọn/Mở rộng**: Click nút "−" hoặc "+" để thu gọn/mở rộng
- **Kéo thả**: Kéo widget đến vị trí mong muốn
- **Refresh**: Click nút "🔄 Refresh" để cập nhật thông tin
- **Tự động lưu**: Lưu vị trí và trạng thái thu gọn

#### 3. Tự động hóa
- Tự động hiển thị khi vào trang web
- Tự động lấy thông tin IP khi khởi tạo
- Tự động khôi phục vị trí và trạng thái đã lưu

### 🔧 Cách hoạt động

#### DNS Resolution
- Sử dụng Google DNS-over-HTTPS API
- Endpoint: `https://dns.google/resolve?name={domain}&type={A|AAAA}`
- Hỗ trợ cả IPv4 (A record) và IPv6 (AAAA record)

#### Server Detection
- Thử lấy header "Server" từ HTTP response
- Fallback: Hiển thị "DNS resolved" nếu không có thông tin server

#### Storage
- Lưu vị trí và trạng thái trong localStorage
- Key: `tenten-ip-widget-state`
- Format: `{left, top, collapsed, domain}`

### 📁 Files được thêm/cập nhật

#### 1. ip-widget-content.js (MỚI)
- Content script inject vào tất cả trang web
- Tạo widget HTML và CSS inline
- Xử lý tương tác và DNS resolution

#### 2. manifest.json (CẬP NHẬT)
- Thêm content script cho `<all_urls>`
- Loại trừ chrome://, extension://, file:// URLs
- Cập nhật version lên 2.2.0

#### 3. popup.html (CẬP NHẬT)
- Thêm script reference cho ip-widget-handler.js
- Cập nhật version display

### 🎨 Styling

#### CSS Classes
- `.tenten-ip-widget-*`: Prefix để tránh conflict
- Responsive design với position: fixed
- Z-index: 999999 để luôn hiển thị trên cùng
- Gradient background giống theme extension

#### Layout
- Width: 280px
- Position: bottom-right (20px từ các cạnh)
- Border-radius: 8px
- Box-shadow: 0 4px 12px rgba(0,0,0,0.15)

### 🔒 Security & Performance

#### Permissions
- Không cần thêm permissions mới
- Sử dụng `<all_urls>` trong content_scripts

#### Error Handling
- Try-catch cho DNS resolution
- Fallback values cho các trường hợp lỗi
- Graceful degradation khi API không khả dụng

#### Performance
- Chỉ resolve DNS khi cần thiết
- Debounce cho drag operations
- Minimal DOM manipulation

### 🧪 Test Cases

#### 1. Basic Functionality
- [x] Widget xuất hiện trên trang web
- [x] Hiển thị tên miền chính xác
- [x] Resolve IPv4 thành công
- [x] Resolve IPv6 (nếu có)
- [x] Hiển thị thông tin server

#### 2. Interaction
- [x] Thu gọn/mở rộng hoạt động
- [x] Kéo thả widget
- [x] Refresh thông tin
- [x] Lưu/khôi phục vị trí

#### 3. Edge Cases
- [x] Trang không có IPv6
- [x] Trang chặn CORS
- [x] Trang có multiple IPs
- [x] Trang với CDN

### 🚨 Known Issues

#### 1. CORS Limitations
- Một số trang có thể chặn DNS API calls
- Fallback: Hiển thị "Error" hoặc "Not available"

#### 2. Server Detection
- Không phải tất cả server đều trả về header "Server"
- Fallback: Hiển thị "DNS resolved"

#### 3. Content Security Policy
- Một số trang có CSP nghiêm ngặt
- Widget vẫn hoạt động nhưng có thể bị giới hạn styling

### 🔄 Future Enhancements

#### 1. Advanced Features
- [ ] Copy IP to clipboard
- [ ] Show multiple IPs (load balancing)
- [ ] Geolocation info
- [ ] Response time measurement

#### 2. UI Improvements
- [ ] More themes/colors
- [ ] Resizable widget
- [ ] Keyboard shortcuts
- [ ] Dark mode support

#### 3. Performance
- [ ] Cache DNS results
- [ ] Batch IP resolution
- [ ] Background updates

### 💡 Usage Tips

1. **Vị trí tối ưu**: Kéo widget đến góc không che khuất nội dung
2. **Thu gọn khi không cần**: Sử dụng nút "−" để thu gọn
3. **Refresh định kỳ**: Click refresh để cập nhật thông tin mới
4. **Kiểm tra IPv6**: Xem website có hỗ trợ IPv6 hay không

### 🏁 Conclusion

Tính năng IP Widget đã được hoàn thiện với đầy đủ các chức năng cơ bản:
- ✅ Hiển thị thông tin IP/domain
- ✅ Tương tác người dùng (drag, toggle, refresh)
- ✅ Tự động hóa và lưu trữ
- ✅ Responsive design
- ✅ Error handling

Extension hiện tại có tất cả các tính năng được yêu cầu:
1. WHOIS Lookup
2. IP/Domain Info
3. DNS Records Checker
4. Auto Ladipage DNS
5. **IP Widget** (MỚI)

---
*Developed by Runsystem Techsupport Team*
*Version 2.2.0 - March 2024*
