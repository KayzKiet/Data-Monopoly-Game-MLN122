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

## Prompt thiết kế nền mới

Hai file vẫn phải giữ đúng tên để game tự nhận:

```text
board-outer-blue.png
board-inner-orange.png
```

Bạn có thể đổi màu và phong cách tùy ý, chỉ cần giữ đúng kích thước và tên file. Không nên đặt chữ quan trọng trong ảnh nền vì ô đất, avatar và panel trung tâm sẽ nằm phía trên.

### Phong cách 1: Tech Monopoly tối hiện đại

```text
Tạo ảnh nền board game cho file board-outer-blue.png, kích thước 1920x1080 px, tỉ lệ ngang, phong cách tech monopoly hiện đại, nền xanh đen pha cyan và vàng kim nhẹ, họa tiết mạch điện, bản đồ dữ liệu, đường kết nối mạng, ánh sáng mềm ở mép ảnh, vùng giữa ít chi tiết để không rối bàn cờ, không chữ, không logo thật, không nhân vật, game UI background, sắc nét.
```

```text
Tạo ảnh nền bên trong bàn cờ cho file board-inner-orange.png, kích thước 1180x1180 px, ảnh vuông, phong cách tech monopoly hiện đại, nền than chì pha teal và vàng kim, texture rất nhẹ như mạch điện và dòng dữ liệu, vùng trung tâm sạch để đặt tiêu đề và xúc xắc, không chữ, không logo thật, không chi tiết quá sáng, phù hợp chủ đề độc quyền dữ liệu và độc quyền dầu mỏ.
```

### Phong cách 2: Dầu mỏ vs dữ liệu

```text
Tạo ảnh nền board game cho file board-outer-blue.png, kích thước 1920x1080 px, tỉ lệ ngang, chia cảm giác hai thế giới dầu mỏ và dữ liệu: một bên là đường ống, giàn khoan trừu tượng, một bên là server, cloud, mạng dữ liệu; bảng màu xanh petrol, xanh ngọc, vàng đồng, cam cháy rất tiết chế; không chữ, không logo thật, vùng giữa ít chi tiết, dùng làm nền phía sau bàn cờ.
```

```text
Tạo ảnh nền bên trong bàn cờ cho file board-inner-orange.png, kích thước 1180x1180 px, ảnh vuông, texture chiến lược kinh tế, pha giữa bản đồ đường ống dầu và network graph dữ liệu, màu nền xanh ngọc đậm pha đồng cháy, độ tương phản vừa phải, không chữ, không logo thật, không nhân vật, không làm rối ô đất, phù hợp game Data Monopoly.
```

### Phong cách 3: Bảng chiến lược học thuật

```text
Tạo ảnh nền board game cho file board-outer-blue.png, kích thước 1920x1080 px, tỉ lệ ngang, phong cách bảng chiến lược học thuật hiện đại, màu nền xanh rêu đậm, xanh navy, vàng kem nhẹ, họa tiết bản đồ kinh tế, biểu đồ thị trường, mạng dữ liệu mờ, giấy tài liệu và đường kẻ chiến thuật trừu tượng, không chữ, không logo thật, vùng trung tâm thoáng.
```

```text
Tạo ảnh nền bên trong bàn cờ cho file board-inner-orange.png, kích thước 1180x1180 px, ảnh vuông, phong cách bảng chiến lược kinh tế, màu xanh rêu đậm pha vàng kem và đồng nhẹ, texture giấy bản đồ, đường nối thị trường, node dữ liệu, vòng quay tư bản trừu tượng, không chữ, không logo thật, trung tâm sạch để đặt UI.
```

### Phong cách 4: Neon dữ liệu

```text
Tạo ảnh nền board game cho file board-outer-blue.png, kích thước 1920x1080 px, tỉ lệ ngang, phong cách neon dữ liệu nhưng không quá chói, nền tím than pha xanh cyan, điểm nhấn vàng kim và hồng rất ít, họa tiết mạng lưới dữ liệu, cloud, đường biểu đồ, ánh sáng viền ngoài, không chữ, không logo thật, vùng giữa ít chi tiết để bàn cờ nổi bật.
```

```text
Tạo ảnh nền bên trong bàn cờ cho file board-inner-orange.png, kích thước 1180x1180 px, ảnh vuông, nền gradient tối cyan tím than, texture dữ liệu mờ, grid mỏng, node kết nối, vài ánh vàng kim nhẹ, không chữ, không logo thật, không chi tiết dày, phù hợp đặt tiêu đề Data Monopoly và xúc xắc ở trung tâm.
```

### Negative prompt dùng chung

```text
Không chữ nhỏ, không watermark, không logo thật, không nhân vật nổi bật, không ảnh quá tối, không quá nhiều chi tiết ở trung tâm, không viền trắng, không icon lặp dày đặc, không làm nền giống ảnh stock.
```
