# Luật chơi Data Monopoly

## 1. Mục tiêu của game

Data Monopoly là web game giáo dục cho chủ đề MLN122: từ độc quyền dầu mỏ đến độc quyền dữ liệu. Người chơi cạnh tranh để tích lũy tiền, tài sản, người dùng, dữ liệu, ảnh hưởng và điểm lý luận.

Thông điệp chính của game là: hình thức độc quyền có thể thay đổi từ tài nguyên vật chất sang dữ liệu và nền tảng số, nhưng xu hướng tập trung tư bản và quyền lực thị trường vẫn tồn tại.

## 2. Số người chơi

Game hỗ trợ từ 2 đến 4 người chơi.

Trước khi bắt đầu, mỗi người chơi cần:

- Nhập tên.
- Chọn ảnh nhân vật.
- Bắt đầu với cùng lượng tài nguyên ban đầu.

Ảnh nhân vật đặt trong `public/images/players`. Ảnh từng ô đặt trong `public/images/tiles`.

## 3. Chỉ số của người chơi

Mỗi người chơi có các chỉ số sau:

- Money: tiền dùng để mua tài sản, nâng cấp tài sản và trả phí.
- Influence: mức ảnh hưởng xã hội/thị trường.
- Users: số lượng người dùng, quan trọng với tài sản dữ liệu.
- Data: lượng dữ liệu sở hữu, là tài nguyên chiến lược trong kinh tế số.
- Theory Points: điểm lý luận nhận được khi trả lời đúng quiz MLN122.
- Assets: danh sách tài sản đã mua.
- Position: vị trí hiện tại trên bàn cờ.
- Under Investigation: trạng thái bị điều tra chống độc quyền.

## 4. Cấu trúc bàn cờ

Bàn cờ có 40 ô, đi theo một vòng khép kín.

Các ô được đánh số từ 0 đến 39. Ô số 0 là Khởi nghiệp. Khi người chơi đi đủ 40 bước từ ô 0, token sẽ quay lại đúng ô Khởi nghiệp.

Kích thước hiển thị mục tiêu trên màn 16.5 inch, độ phân giải 1920 x 1080:

- Toàn bộ bàn cờ: khoảng 740 x 740 px.
- 4 ô góc: khoảng 100 x 100 px.
- 9 ô nhỏ ở cạnh trên và 9 ô nhỏ ở cạnh dưới: khoảng 60 x 100 px mỗi ô.
- 9 ô nhỏ ở cạnh trái và 9 ô nhỏ ở cạnh phải: khoảng 100 x 60 px mỗi ô.
- Bàn cờ được đặt cân đối ở giữa vùng chơi để dễ quan sát toàn bộ cục diện.

Vị trí đặc biệt:

- Ô số 0: Khởi nghiệp.
- Ô số 2, 17, 33: Khí vận.
- Ô số 7, 22, 36: Cơ hội.

Các loại ô chính:

- Khởi nghiệp: điểm xuất phát.
- Oil Field: mỏ dầu.
- Refinery: nhà máy lọc dầu.
- Pipeline: đường ống.
- Logistics: vận chuyển/cảng/kho.
- Search Platform: nền tảng tìm kiếm.
- Social Network: mạng xã hội.
- E-commerce Platform: sàn thương mại điện tử.
- Cloud Infrastructure: hạ tầng đám mây.
- AI Lab: phòng thí nghiệm AI.
- Tax / Regulation: thuế hoặc quy định.
- Crisis: khủng hoảng.
- Khí vận / Cơ hội: rút thẻ may rủi hoặc biến động thị trường.
- Theory Quiz: câu hỏi lý luận.
- Antitrust Investigation: điều tra chống độc quyền.

## 5. Cách chơi mỗi lượt

Mỗi lượt diễn ra theo thứ tự:

1. Người chơi hiện tại bấm Tung xúc xắc.
2. Game tung 2 xúc xắc và lấy tổng số điểm.
3. Token của người chơi di chuyển từng ô theo kết quả xúc xắc.
4. Khi dừng ở ô mới, game xử lý hiệu ứng của ô đó.
5. Người chơi có thể mua tài sản nếu ô chưa có chủ.
6. Người chơi có thể nâng cấp tài sản đang sở hữu nếu đủ tiền.
7. Người chơi bấm Kết thúc lượt để chuyển sang người tiếp theo.

Mỗi lượt chỉ được tung xúc xắc một lần.

## 6. Đi qua ô Khởi nghiệp

Khi người chơi đi qua ô Khởi nghiệp, người chơi nhận thêm tiền.

Ý nghĩa lý luận: Khởi nghiệp tượng trưng cho chu kỳ tái đầu tư. Tư bản tiếp tục vận động qua các vòng sản xuất, lưu thông và tích lũy.

## 7. Mua tài sản

Nếu người chơi dừng ở một ô tài sản chưa có chủ và đủ tiền, người chơi có thể mua tài sản đó.

Tài sản dầu mỏ gồm:

- Mỏ dầu.
- Nhà máy lọc dầu.
- Đường ống.
- Logistics/cảng/kho.

Tài sản dữ liệu gồm:

- Nền tảng tìm kiếm.
- Mạng xã hội.
- Sàn thương mại điện tử.
- Cloud.
- AI Lab.

Ý nghĩa lý luận: mua tài sản mô phỏng quá trình tích lũy tư bản và kiểm soát nguồn lực quan trọng của thị trường.

## 8. Trả tiền thuê

Nếu người chơi dừng ở tài sản thuộc người chơi khác, người chơi phải trả tiền thuê.

Với tài sản dầu mỏ, tiền thuê chủ yếu thể hiện lợi ích từ tài nguyên vật chất và hạ tầng.

Với tài sản dữ liệu, người chơi có thể mất thêm users hoặc data, mô phỏng sự phụ thuộc vào nền tảng số.

Ý nghĩa lý luận: khi một chủ thể kiểm soát tài nguyên hoặc nền tảng, các chủ thể khác phải phụ thuộc và trả chi phí để tiếp cận thị trường.

## 9. Nâng cấp tài sản

Người chơi có thể nâng cấp tài sản đã sở hữu nếu đủ tiền.

Nâng cấp giúp:

- Tăng giá trị tài sản.
- Tăng tiền thuê.
- Tăng quyền lực thị trường.

Nếu người chơi sở hữu Cloud Infrastructure, một số chi phí nâng cấp được giảm.

Ý nghĩa lý luận: nâng cấp mô phỏng việc doanh nghiệp lớn tiếp tục tái đầu tư để mở rộng quy mô và củng cố vị thế độc quyền.

## 10. Tài sản dầu mỏ và tài sản dữ liệu

Tài sản dầu mỏ chủ yếu tạo ra money và influence.

Tài sản dữ liệu chủ yếu tạo ra users, data và influence.

AI Lab làm tăng giá trị của tài sản dữ liệu, vì dữ liệu nhiều giúp AI mạnh hơn, còn AI mạnh hơn lại giúp nền tảng thu hút thêm người dùng.

Ý nghĩa lý luận: độc quyền dầu mỏ dựa vào tài nguyên khan hiếm và hạ tầng vật chất; độc quyền dữ liệu dựa vào người dùng, dữ liệu, thuật toán, AI và nền tảng.

## 11. Ô Khí vận và Cơ hội

Khi dừng ở ô Khí vận hoặc Cơ hội, người chơi rút một thẻ từ đúng xấp bài tương ứng.

Hai loại xấp bài:

- Khí vận: thiên về may rủi cá nhân, biến động nhỏ, chi phí bất ngờ hoặc khoản thưởng.
- Cơ hội: thiên về biến động thị trường, chính sách, công nghệ hoặc tác động lên nhiều người chơi.

Quy luật lặp lại của thẻ:

1. Mỗi loại ô dùng chung một xấp bài riêng.
2. Khi người chơi dừng ở ô đó, hệ thống rút lá trên cùng.
3. Sau khi thực hiện hiệu ứng, lá bài thường được đưa xuống đáy xấp.
4. Một lá bài chỉ xuất hiện lại sau khi các lá còn lại trong xấp đã được rút qua.
5. Thẻ giữ lại, ví dụ Miễn điều tra một lần, không quay lại xấp ngay. Người chơi giữ thẻ đó cho đến khi luật gameplay sau này cho phép sử dụng.

Ví dụ thẻ Khí vận / Cơ hội:

- Cá mập cắn cáp: nếu sở hữu tài sản dữ liệu, mất tiền và data.
- Trúng số khởi nghiệp: nhận thêm tiền.
- Đầu tư chứng khoán có lời hoặc thua lỗ.
- Bão lũ làm gián đoạn logistics.
- Tăng tốc thị trường: nhận thêm influence, tượng trưng cho lợi thế đi trước.
- Án phạt chống độc quyền: người dẫn đầu bị trừ tiền và influence.

Các thẻ có thể tác động đến:

- Money.
- Influence.
- Users.
- Data.
- Tài sản.
- Người chơi đang dẫn đầu hoặc cuối bảng.

Ví dụ:

Ý nghĩa lý luận: thị trường không đứng yên. Chính sách, khủng hoảng, công nghệ và phản ứng xã hội đều có thể ảnh hưởng đến quyền lực độc quyền.

## 12. Ô Quiz

Khi dừng ở ô Theory Quiz, người chơi trả lời câu hỏi MLN122.

Nếu trả lời đúng:

- Nhận Theory Points.
- Tăng nhẹ Influence.

Nếu trả lời sai:

- Không nhận điểm thưởng.
- Game vẫn hiển thị giải thích để người chơi học lại kiến thức.

Bộ câu hỏi được lấy từ file Source Question.md và đã được đưa vào dữ liệu quiz của game.

## 13. Ô Regulation và Antitrust Investigation

Các ô này mô phỏng sự điều tiết khi quyền lực thị trường quá lớn.

Tác động có thể gồm:

- Trừ tiền.
- Giảm influence.
- Đánh dấu người chơi bị điều tra.

Ý nghĩa lý luận: trong CNTB hiện đại, khi độc quyền phát triển mạnh, nhà nước và xã hội có thể phải can thiệp thông qua thuế, quy định, chống độc quyền hoặc chính sách dữ liệu mở.

## 14. Market Power

Market Power là điểm thể hiện quyền lực thị trường của người chơi.

Điểm này được tính dựa trên:

- Money.
- Giá trị tài sản.
- Users.
- Data.
- Theory Points.

Công thức được scale khoảng 0 đến 100 để dễ đọc trên giao diện.

## 15. Điều kiện thắng

Một người chơi thắng nếu đạt một trong các điều kiện:

1. Kiểm soát ít nhất 60% tổng market power.
2. Đạt 100 theory points và có điểm kinh tế cao nhất.
3. Sau 25 vòng, người có tổng điểm cao nhất thắng.

## 16. Ý nghĩa màn kết quả

Khi kết thúc, game hiển thị câu hỏi:

“Bạn đã thắng thị trường. Nhưng xã hội có thật sự tốt hơn không?”

Ý nghĩa:

- Độc quyền dầu mỏ dựa trên tài nguyên khan hiếm và hạ tầng vật chất.
- Độc quyền dữ liệu dựa trên người dùng, dữ liệu, thuật toán, AI và nền tảng.
- Hình thức độc quyền thay đổi, nhưng sự tập trung quyền lực thị trường vẫn tồn tại.
- Đây là một giới hạn của CNTB hiện đại.

## 17. Gợi ý thuyết trình

Khi trình bày trên lớp, có thể giải thích game theo 3 bước:

1. Người chơi cạnh tranh để mua tài sản và mở rộng quyền lực.
2. Cạnh tranh dần tạo ra người dẫn đầu nhờ tích lũy tiền, tài sản, users và data.
3. Người thắng có thể rất mạnh về thị trường, nhưng game đặt câu hỏi về tác động xã hội của độc quyền.

Kết luận: từ dầu mỏ đến dữ liệu, hình thức kiểm soát thay đổi, nhưng logic tập trung tư bản và quyền lực thị trường vẫn là vấn đề cần phân tích trong MLN122.
