# PROJECT_CONTEXT.md

## Project Name

**Data Monopoly: Từ độc quyền dầu mỏ đến độc quyền dữ liệu**

Đây là một web game giáo dục cho môn **MLN122 - Đại học FPT**.

## Chủ đề

**Từ độc quyền dầu mỏ đến độc quyền dữ liệu – giới hạn lịch sử của CNTB hiện đại**

## Core Theory

* Độc quyền
* Biểu hiện mới của độc quyền trong CNTB hiện đại
* So sánh độc quyền tài nguyên và độc quyền dữ liệu
* Bàn về giới hạn lịch sử của CNTB hiện đại

## Mục tiêu sản phẩm

Tạo một web game dạng board game/strategy game, giúp người chơi hiểu rằng:

1. Trong thời đại dầu mỏ, độc quyền hình thành thông qua kiểm soát tài nguyên vật chất, hạ tầng, vận chuyển, nhà máy lọc dầu.
2. Trong thời đại dữ liệu, độc quyền hình thành thông qua nền tảng số, dữ liệu người dùng, thuật toán, AI, hiệu ứng mạng lưới.
3. Hình thức độc quyền thay đổi, nhưng bản chất tập trung tư bản và quyền lực thị trường vẫn tồn tại.
4. CNTB hiện đại có giới hạn lịch sử: cạnh tranh có xu hướng dẫn đến tập trung, độc quyền, bất bình đẳng quyền lực và rào cản gia nhập thị trường.

## Luật bản quyền

Không copy thiết kế, hình ảnh, logo, layout, mã nguồn, tên ô đất, hoặc board design từ Monopoly chính thức hoặc bất kỳ website có sẵn nào.

Game chỉ lấy cảm hứng từ cơ chế board game kinh tế. Tất cả nội dung, tên tài sản, giao diện, màu sắc, luật chơi phải tự tạo mới.

## Tech Stack

* React
* Vite
* TypeScript
* Tailwind CSS
* Frontend-only
* Không backend
* Không database
* Dùng localStorage để lưu tiến trình game
* Deploy được lên Vercel

## Lệnh bắt buộc phải chạy được

```bash
npm install
npm run dev
npm run build
```

## Cấu trúc thư mục mong muốn

```text
src/
  main.tsx
  App.tsx
  index.css

  data/
    tiles.ts
    events.ts
    quizzes.ts
    avatars.ts

  types/
    game.ts

  utils/
    gameLogic.ts
    scoring.ts
    storage.ts

  components/
    LandingPage.tsx
    PlayerSetup.tsx
    GameBoard.tsx
    BoardTile.tsx
    PlayerPanel.tsx
    ActionPanel.tsx
    Dice.tsx
    EventModal.tsx
    QuizModal.tsx
    TheoryPage.tsx
    ResultScreen.tsx
    GameLog.tsx
```

## Game Screens

### 1. Landing Page

Nội dung:

* Title: Data Monopoly
* Subtitle: Từ độc quyền dầu mỏ đến độc quyền dữ liệu
* Buttons:

  * Start Game
  * Learn Theory
  * How to Play

### 2. Player Setup

* Chọn số người chơi: 2, 3, hoặc 4
* Nhập tên người chơi
* Chọn avatar bằng emoji/icon
* Bắt đầu game

### 3. Game Board

* Board 32 ô
* Hiển thị người chơi hiện tại
* Nút tung xúc xắc
* Panel hành động
* Panel thống kê người chơi
* Hiển thị tài sản sở hữu
* Modal sự kiện
* Modal quiz
* Game log

### 4. Theory Page

Giải thích bằng tiếng Việt, dễ hiểu, phù hợp thuyết trình đại học:

* Độc quyền là gì?
* Độc quyền tài nguyên là gì?
* Độc quyền dữ liệu là gì?
* Hiệu ứng mạng lưới là gì?
* Dữ liệu vì sao trở thành tài nguyên chiến lược?
* Giới hạn lịch sử của CNTB hiện đại là gì?
* Bảng so sánh độc quyền dầu mỏ và độc quyền dữ liệu

### 5. Result Screen

Sau khi có người thắng, hiển thị:

* Người thắng
* Bảng điểm
* Diễn giải lý luận

Thông điệp kết thúc:

“Bạn đã thắng thị trường. Nhưng xã hội có thật sự tốt hơn không?”

Sau đó giải thích:

* Độc quyền dầu mỏ dựa trên tài nguyên khan hiếm và hạ tầng vật chất.
* Độc quyền dữ liệu dựa trên người dùng, dữ liệu, thuật toán, AI và nền tảng.
* Hình thức độc quyền thay đổi, nhưng sự tập trung quyền lực thị trường vẫn tồn tại.
* Đây là một giới hạn của CNTB hiện đại.

## Gameplay

Game có 2–4 người chơi.

Mỗi người chơi có:

* money
* influence
* users
* data
* theoryPoints
* assets
* position
* isInJail / underInvestigation

Mỗi lượt:

1. Người chơi tung xúc xắc.
2. Di chuyển trên board.
3. Xử lý ô đang đứng:

   * Mua tài sản nếu chưa có chủ.
   * Trả phí nếu tài sản thuộc người khác.
   * Nâng cấp tài sản nếu đủ tiền.
   * Trả thuế/quy định.
   * Nhận sự kiện.
   * Trả lời quiz.
   * Bị điều tra chống độc quyền.
4. Chuyển lượt.

## Tile Types

Board gồm 32 ô, chia thành các loại:

1. Start
2. Oil Field
3. Refinery
4. Pipeline
5. Logistics
6. Search Platform
7. Social Network
8. E-commerce Platform
9. Cloud Infrastructure
10. AI Lab
11. Tax / Regulation
12. Crisis
13. Chance / Event
14. Theory Quiz
15. Antitrust Investigation

## Tên tài sản hư cấu

Không dùng tên công ty thật, không dùng logo thật.

### Oil Age

* Black River Oil Field
* Iron Pump Refinery
* Continental Pipeline
* Steel Port Logistics
* PetroRail Network
* Northern Drill Site
* Oceanic Fuel Harbor
* Golden Barrel Depot

### Data Age

* Nova Search
* SocialSphere
* ShopGrid
* CloudNest
* AdSignal
* VisionAI Lab
* MapStream
* DataVault
* StreamLoop
* MarketMind AI

## Event Cards

Cần có ít nhất 12 event.

Ví dụ:

1. Oil Price Shock
   Oil assets generate more rent for 2 rounds.

2. Antitrust Investigation
   Leading player pays a fine.

3. Data Leak
   Current player loses 25% data.

4. Network Effect
   Player with most users gains extra users.

5. Open Data Regulation
   All players gain basic data.

6. AI Breakthrough
   AI Lab owners gain bonus data value.

7. Startup Innovation
   Last-place player receives comeback bonus.

8. Public Backlash
   Player with highest market power loses influence.

9. Infrastructure Expansion
   Logistics and cloud assets become stronger.

10. Privacy Movement
    Data asset income is reduced this round.

11. Merger Wave
    Players with many assets gain extra market power.

12. Labor Protest
    All players pay operating cost.

## Quiz Requirements

Cần có ít nhất 12 câu hỏi tiếng Việt.

Chủ đề:

* Độc quyền
* Tích tụ tư bản
* Tập trung tư bản
* Độc quyền tài nguyên
* Độc quyền dữ liệu
* Hiệu ứng mạng lưới
* Big Tech
* Rào cản gia nhập thị trường
* AI và lợi thế dữ liệu
* Giới hạn lịch sử của CNTB hiện đại

Mỗi quiz gồm:

* question
* options
* correctAnswer
* explanation

Ví dụ:

Question: Trong CNTB độc quyền, vì sao doanh nghiệp lớn có xu hướng thâu tóm doanh nghiệp nhỏ?

Options:
A. Vì doanh nghiệp nhỏ luôn tự nguyện rời thị trường
B. Vì tích tụ và tập trung tư bản làm tăng quyền lực của doanh nghiệp lớn
C. Vì nhà nước luôn cấm cạnh tranh
D. Vì công nghệ không còn quan trọng

Correct: B

Explanation:
Theo lý luận về độc quyền, cạnh tranh có thể dẫn đến tích tụ và tập trung tư bản, từ đó hình thành các tổ chức độc quyền.

## Scoring

Tạo function:

```ts
calculateMarketPower(player, allPlayers)
```

Công thức gợi ý:

```text
marketPower =
  normalizedMoney * 0.2 +
  normalizedAssetValue * 0.3 +
  normalizedUsers * 0.2 +
  normalizedData * 0.2 +
  normalizedTheoryPoints * 0.1
```

Điểm nên dễ đọc, scale khoảng 0–100.

## Win Conditions

Một người chơi thắng nếu:

1. Kiểm soát ít nhất 60% tổng market power.
2. Hoặc đạt 100 theory points và có economy score cao nhất.
3. Hoặc sau 25 rounds, người có tổng điểm cao nhất thắng.

## Visual Style

* Modern educational web game
* Màu chủ đạo:

  * oil black
  * dark blue
  * digital cyan
  * gold accent
* Giao diện đẹp để trình chiếu trên lớp
* Responsive cho laptop/projector/mobile
* Dùng card, gradient, icon, animation nhẹ
* Text tiếng Việt rõ ràng

## README Requirements

README.md cần có:

1. Mô tả project
2. Chủ đề MLN122
3. Tính năng chính
4. Cách chạy local
5. Cách build
6. Cách deploy Vercel
7. Script thuyết trình 1–2 phút
8. Ghi chú: project không dùng backend

## Quality Requirements

* Không lỗi TypeScript
* Không lỗi console nghiêm trọng
* `npm run build` phải pass
* Code rõ ràng, dễ đọc
* Component tách hợp lý
* Logic game có comment ở phần quan trọng
* Không overengineering
