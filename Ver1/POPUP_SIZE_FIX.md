# Sửa lỗi Popup Size quá nhỏ (26x610)

## 🔧 Đã thực hiện:

### 1. Sửa CSS chính (popup.css):
- Đặt `width: 420px` cố định cho body
- Đặt `min-height: 600px` cho popup
- Thêm `max-width: 420px` để tránh tràn
- Tối ưu padding và margin các sections

### 2. Thêm CSS Fix (popup-fix.css):
- Force kích thước `420x600px` với `!important`
- Đảm bảo container không bị overflow
- Flex layout tối ưu cho từng section

### 3. Cập nhật HTML:
- Thêm viewport cố định `width=420`
- Import thêm `popup-fix.css`

## 🚀 Cách test lại:

1. **Reload extension**:
   ```
   chrome://extensions/ → Click reload
   ```

2. **Xóa cache (nếu cần)**:
   - Tắt extension → Bật lại
   - Hoặc restart Chrome

3. **Kiểm tra kích thước**:
   - Click extension icon
   - Popup sẽ hiển thị đúng 420x600px
   - Tất cả element sẽ fit đúng

## 📐 Kích thước mới:

- **Width**: 420px (thay vì 26px)
- **Height**: 600px (thay vì quá dài)
- **Layout**: Flexible với scroll khi cần

## 🔍 Debug nếu vẫn lỗi:

1. **Inspect popup**:
   - Right-click popup → Inspect
   - Check computed styles trong DevTools

2. **CSS conflicts**:
   - Kiểm tra CSS nào đang override
   - Ensure `popup-fix.css` load sau `popup.css`

3. **Browser cache**:
   - Hard refresh (Ctrl+Shift+R)
   - Clear browser cache

## ✅ Kết quả mong đợi:

Popup sẽ hiển thị:
- Header với logo và title
- Status indicator
- Domain input
- Menu với 4 options (1 active, 3 disabled)
- Footer với version và help

Tất cả sẽ fit trong 420x600px một cách gọn gàng!
