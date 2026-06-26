# Ảnh nền bàn cờ

Đặt ảnh nền tổng thể của bàn cờ trong thư mục này. Game sẽ tự đọc theo đúng tên file bên dưới.

## File cần có

```text
board-outer-blue.png
board-inner-orange.png
```

## Ý nghĩa từng file

- `board-outer-blue.png`: nền màu xanh nằm ngoài bàn cờ, phía sau toàn bộ khung board. Nên là ảnh rộng, ít chi tiết ở giữa để không làm rối ô đất.
- `board-inner-orange.png`: nền màu cam nằm bên trong vòng ô đất, phía dưới khu vực trung tâm và các ô. Nên dùng texture nhẹ, không quá nhiều chữ.

## Kích thước khuyến nghị

- `board-outer-blue.png`: tối thiểu `1920 x 1080 px`, tỉ lệ ngang.
- `board-inner-orange.png`: tối thiểu `1180 x 1180 px`, ảnh vuông.

Ảnh sẽ được phủ bằng `background-size: cover`. Nếu chưa có ảnh, game vẫn hiển thị màu nền mặc định.

## Lưu ý thiết kế

- Tránh đặt chữ quan trọng trong ảnh nền.
- Không dùng ảnh quá tối hoặc quá nhiều chi tiết vì chữ trên ô đất cần dễ đọc.
- Nén ảnh trước khi đưa vào project để web tải nhanh hơn.
