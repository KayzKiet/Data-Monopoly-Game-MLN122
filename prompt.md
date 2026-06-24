
## Prompt 8 — Theory page

Read `PROJECT_CONTEXT.md` first.

Implement the `TheoryPage.tsx`.

The page must be in Vietnamese and suitable for MLN122 presentation.

Required sections:

1. Độc quyền là gì?
2. Độc quyền dầu mỏ: kiểm soát tài nguyên vật chất
3. Độc quyền dữ liệu: kiểm soát người dùng, dữ liệu, thuật toán và nền tảng
4. So sánh độc quyền tài nguyên và độc quyền dữ liệu
5. Hiệu ứng mạng lưới
6. Dữ liệu như một loại tài nguyên chiến lược mới
7. Giới hạn lịch sử của CNTB hiện đại
8. Game này mô phỏng lý luận như thế nào?

Add a comparison table:

Columns:

* Tiêu chí
* Độc quyền dầu mỏ
* Độc quyền dữ liệu

Rows:

* Tài nguyên chính
* Hạ tầng kiểm soát
* Cách tạo lợi nhuận
* Rào cản gia nhập
* Vai trò công nghệ
* Tác động xã hội

Keep language clear, concise, and presentation-friendly.

After finishing, run `npm run build` and fix all errors.

---

## Prompt 9 — Result screen and critical ending

Read `PROJECT_CONTEXT.md` first.

Implement `ResultScreen.tsx`.

Tasks:

1. Show winner name, avatar, and final score.
2. Show score breakdown:

   * money
   * asset value
   * users
   * data
   * theory points
   * market power
3. Show ranking table for all players.
4. Add critical ending message:

“Bạn đã thắng thị trường. Nhưng xã hội có thật sự tốt hơn không?”

5. Explain in Vietnamese:

   * Độc quyền dầu mỏ dựa trên tài nguyên khan hiếm và hạ tầng vật chất.
   * Độc quyền dữ liệu dựa trên người dùng, dữ liệu, thuật toán, AI và nền tảng.
   * Hình thức độc quyền thay đổi, nhưng sự tập trung quyền lực thị trường vẫn tồn tại.
   * Đây là một giới hạn của CNTB hiện đại.
6. Add buttons:

   * Play Again
   * Back to Theory
   * Back to Home

After finishing, run `npm run build` and fix all errors.

---

## Prompt 10 — LocalStorage, resume game, polish

Read `PROJECT_CONTEXT.md` first.

Finish persistence and UX polish.

Tasks:

1. Save game state to localStorage after meaningful state changes.
2. On landing page, show “Continue Game” if saved game exists.
3. Add Reset Game confirmation.
4. Improve empty states and error states.
5. Improve mobile responsiveness.
6. Improve button states:

   * disabled
   * hover
   * active
7. Add small animations where useful, but keep performance good.
8. Ensure all Vietnamese text is readable and polished.
9. Check that the game can be played from start to result without breaking.

After finishing, run `npm run build` and fix all errors.

---

## Prompt 11 — README and presentation script

Read `PROJECT_CONTEXT.md` first.

Create or update `README.md`.

README must include:

1. Project title
2. Short project description
3. MLN122 topic alignment
4. Main features
5. Tech stack
6. How to run locally
7. How to build
8. How to deploy to Vercel
9. Game rules summary
10. Educational meaning
11. 1–2 minute presentation script in Vietnamese

The presentation script should explain:

* Why the group chose a game format
* How oil monopoly is represented
* How data monopoly is represented
* What the player learns after winning
* How this connects to the historical limits of modern capitalism

After finishing, run `npm run build` and fix all errors.

---

## Prompt 12 — Final review before deploy

Read `PROJECT_CONTEXT.md` first.

Perform a full final review as if this app will be submitted tomorrow for an MLN122 class presentation.

Tasks:

1. Check all files for TypeScript errors.
2. Run `npm run build`.
3. Fix all build errors.
4. Play through the game manually in code logic and identify bugs.
5. Fix broken state transitions.
6. Improve weak UI copy.
7. Make the UI more polished without changing the concept.
8. Ensure no copyrighted Monopoly assets, layout, logos, or copied content are used.
9. Ensure the educational message is clear.
10. Ensure README is complete.
11. Provide a final summary:

    * Completed features
    * How to run
    * How to deploy
    * Optional future improvements

Do not add backend. Keep the project frontend-only.
