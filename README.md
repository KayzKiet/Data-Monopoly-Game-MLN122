# Data Monopoly: Từ độc quyền dầu mỏ đến độc quyền dữ liệu

Web game giáo dục về kinh tế chính trị Mác - Lênin. Dự án mô phỏng một board game chiến lược giúp người chơi so sánh độc quyền tài nguyên trong thời đại dầu mỏ với độc quyền dữ liệu trong CNTB hiện đại.

## Tính năng chính

- React + Vite + TypeScript + Tailwind CSS.
- Điều hướng bằng state giữa Landing, Setup, Game, Theory và Result.
- Cấu trúc component tách riêng cho board, xúc xắc, panel người chơi, log, modal, lý thuyết và kết quả.
- Seed data ban đầu cho tiles, event cards, quiz, avatar và scoring.
- Frontend-only, không backend, không database.

## Cách chạy local

```bash
npm install
npm run dev
```

Mở URL Vite hiển thị trong terminal, thường là `http://127.0.0.1:5173/`.

## Cách build

```bash
npm run build
```

File production được tạo trong thư mục `dist/`.

## Deploy Vercel

1. Import repository vào Vercel.
2. Framework preset: Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.

## Script thuyết trình 1-2 phút

Data Monopoly là một web game giáo dục về sự chuyển đổi từ độc quyền dầu mỏ sang độc quyền dữ liệu. Trong thời đại dầu mỏ, quyền lực thị trường đến từ việc kiểm soát tài nguyên khan hiếm, nhà máy lọc dầu, đường ống và logistics. Trong thời đại dữ liệu, quyền lực đó chuyển sang nền tảng số, người dùng, dữ liệu, thuật toán, AI và hiệu ứng mạng lưới. Game giúp người chơi thấy rằng hình thức độc quyền thay đổi, nhưng xu hướng tập trung tư bản và quyền lực thị trường vẫn tồn tại. Đây chính là một giới hạn lịch sử của CNTB hiện đại.

## Ghi chú

Dự án không dùng backend và không dùng database. Các bước tiếp theo sẽ bổ sung gameplay, lưu tiến trình bằng localStorage và hoàn thiện nội dung lý thuyết.
