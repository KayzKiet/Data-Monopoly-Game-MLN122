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
- Tên người chơi không được trùng nhau.
- Avatar không được chọn trùng nhau.

Ảnh nhân vật đặt trong `public/images/players`. Ảnh từng ô đặt trong `public/images/tiles`.

## 3. Chỉ số của người chơi

Mỗi người chơi có các chỉ số sau:

- Vốn: tiền dùng để mua tài sản, nâng cấp tài sản và trả phí.
- Ảnh hưởng: mức ảnh hưởng xã hội/thị trường.
- Người dùng: số lượng người dùng, quan trọng với tài sản dữ liệu.
- Dữ liệu: lượng dữ liệu sở hữu, là tài nguyên chiến lược trong kinh tế số.
- Điểm lý luận: điểm nhận được khi trả lời đúng quiz MLN122.
- Tài sản: danh sách tài sản đã mua.
- Vị trí: vị trí hiện tại trên bàn cờ.
- Đang bị điều tra: trạng thái bị điều tra chống độc quyền.

## 4. Cấu trúc bàn cờ

Bàn cờ có 40 ô, đi theo một vòng khép kín.

Các ô được đánh số từ 0 đến 39. Ô số 0 là Khởi nghiệp. Khi người chơi đi đủ 40 bước từ ô 0, token sẽ quay lại đúng ô Khởi nghiệp.

Kích thước hiển thị mục tiêu trên màn 16.5 inch, độ phân giải 1920 x 1080:

- Toàn bộ bàn cờ gốc: khoảng 1180 x 1180 px.
- 4 ô góc: khoảng 150 x 150 px.
- 9 ô nhỏ ở cạnh trên và 9 ô nhỏ ở cạnh dưới: khoảng 98 x 150 px mỗi ô.
- 9 ô nhỏ ở cạnh trái và 9 ô nhỏ ở cạnh phải: khoảng 150 x 98 px mỗi ô.
- Bàn cờ có nút phóng to / thu nhỏ để người chơi đọc rõ thông tin từng ô.

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
- Thuế / Quy định: thuế hoặc quy định.
- Khủng hoảng: khủng hoảng.
- Khí vận / Cơ hội: rút thẻ may rủi hoặc biến động thị trường.
- Quiz lý luận: câu hỏi lý luận.
- Antitrust Investigation: điều tra chống độc quyền.

## 5. Cách chơi mỗi lượt

Mỗi lượt diễn ra theo thứ tự:

1. Người chơi hiện tại bấm Tung xúc xắc.
2. Game tung 2 xúc xắc và lấy tổng số điểm.
3. Token của người chơi di chuyển từng ô theo kết quả xúc xắc.
4. Khi dừng ở ô mới, game xử lý hiệu ứng của ô đó.
5. Người chơi có thể mua tài sản nếu ô chưa có chủ.
6. Người chơi chỉ có thể nâng cấp nếu đang đứng trên ô tài sản của chính mình, tài sản đó đã sở hữu ít nhất 1 vòng và người chơi đủ tiền.
7. Người chơi bấm Kết thúc lượt để chuyển sang người tiếp theo.

Người chơi phải tung xúc xắc ít nhất 1 lần mới được kết thúc lượt.

Luật cặp đặc biệt:

- Nếu tung được cặp 1:1, người chơi được tung thêm 1 lần.
- Nếu tung được cặp 6:6, người chơi được tung thêm 1 lần.
- Lượt tung thêm vẫn phải chờ token di chuyển xong và hiệu ứng ô hiện tại được xử lý xong.
- Nếu lượt tung thêm tiếp tục ra 1:1 hoặc 6:6, người chơi lại được thêm 1 lần tung.

## 6. Đi qua ô Khởi nghiệp

Khi người chơi đi qua ô Khởi nghiệp, người chơi nhận thêm tiền.

Ý nghĩa lý luận: Khởi nghiệp tượng trưng cho chu kỳ tái đầu tư. Tư bản tiếp tục vận động qua các vòng sản xuất, lưu thông và tích lũy.

Trong gameplay hiện tại, đi qua Khởi nghiệp còn có tác dụng mở quyền nâng cấp cho tài sản đã mua. Một tài sản mới mua phải được giữ qua ít nhất 1 vòng trước khi nâng cấp.

## 7. Mua tài sản

Nếu người chơi dừng ở một ô tài sản chưa có chủ và đủ tiền, người chơi có thể mua tài sản đó.

Khi mua, người chơi:

- Trả giá mua hiển thị trên ô.
- Nhận lợi ích ban đầu tùy loại tài sản.
- Trở thành chủ sở hữu của ô đó.
- Chưa được nâng cấp ngay; phải đi đủ 1 vòng sau khi mua.

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

Người chơi chỉ có thể nâng cấp tài sản khi đáp ứng đủ các điều kiện:

- Đang đứng trên ô tài sản của chính mình.
- Tài sản đó chưa đạt cấp tối đa.
- Tài sản đã được sở hữu qua ít nhất 1 vòng, tức là người chơi đã đi qua Khởi nghiệp sau khi mua.
- Người chơi đủ vốn để trả chi phí nâng cấp.

Nâng cấp giúp:

- Tăng giá trị tài sản.
- Tăng tiền thuê mà người chơi khác phải trả khi dừng ở ô đó.
- Tăng quyền lực thị trường.
- Với tài sản dữ liệu, nâng cấp còn làm người chơi khác mất thêm dữ liệu hoặc người dùng khi dừng ở ô đó.

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

- Cá mập cắn cáp: nếu sở hữu tài sản dữ liệu, mất tiền và dữ liệu.
- Trúng số khởi nghiệp: nhận thêm tiền.
- Đầu tư chứng khoán có lời hoặc thua lỗ.
- Bão lũ làm gián đoạn logistics.
- Tăng tốc thị trường: nhận thêm ảnh hưởng, tượng trưng cho lợi thế đi trước.
- Án phạt chống độc quyền: người dẫn đầu bị trừ tiền và ảnh hưởng.

Các thẻ có thể tác động đến:

- Vốn.
- Ảnh hưởng.
- Người dùng.
- Dữ liệu.
- Tài sản.
- Người chơi đang dẫn đầu hoặc cuối bảng.

Ví dụ:

Ý nghĩa lý luận: thị trường không đứng yên. Chính sách, khủng hoảng, công nghệ và phản ứng xã hội đều có thể ảnh hưởng đến quyền lực độc quyền.

## 12. Ô Quiz

Khi dừng ở ô Quiz lý luận, người chơi trả lời câu hỏi MLN122.

Nếu trả lời đúng:

- Nhận điểm lý luận.
- Tăng nhẹ ảnh hưởng.

Nếu trả lời sai:

- Không nhận điểm thưởng.
- Game vẫn hiển thị giải thích để người chơi học lại kiến thức.

Bộ câu hỏi được lấy từ file Source Question.md và đã được đưa vào dữ liệu quiz của game.

## 13. Ô Thuế, Quy định và Điều trần

Các ô này mô phỏng sự điều tiết khi quyền lực thị trường quá lớn.

Ô Thuế / Quy định:

- Người chơi đang đứng trên ô phải trả phí.
- Người chơi mất ảnh hưởng.
- Nếu sở hữu Cloud Infrastructure, phí có thể được giảm vì hạ tầng vận hành tốt hơn.

Ô Điều trần / Chống độc quyền:

- Người đang dẫn đầu quyền lực thị trường bị nhắm đến.
- Người đó bị trừ vốn.
- Người đó mất ảnh hưởng.
- Người đó bị đánh dấu đang bị điều tra.

Ô Khủng hoảng:

- Người chơi mất chi phí vận hành bằng `$10 x số tài sản đang sở hữu`.
- Nếu là ô Khủng hoảng chuỗi cung ứng, người chơi mất `5 dữ liệu`.
- Nếu là ô Khủng hoảng niềm tin, người chơi mất `15% dữ liệu hiện có`, làm tròn lên.
- Người chơi mất `2 điểm ảnh hưởng`.

Ý nghĩa lý luận: trong CNTB hiện đại, khi độc quyền phát triển mạnh, nhà nước và xã hội có thể phải can thiệp thông qua thuế, quy định, chống độc quyền hoặc chính sách dữ liệu mở.

## 14. Bảng thông tin người chơi

Mỗi người chơi có một bảng thông tin riêng trong game.

Bảng này hiển thị:

- Vốn hiện có.
- Ảnh hưởng.
- Người dùng.
- Dữ liệu.
- Điểm lý luận.
- Quyền lực thị trường.
- Danh sách ô đất/tài sản đã mua.
- Số ô, tên tài sản, cấp hiện tại, tiền thuê cơ bản và trạng thái đã đủ vòng nâng cấp hay chưa.

## 15. Quyền lực thị trường

Quyền lực thị trường là điểm thể hiện mức chi phối thị trường của người chơi.

Điểm này được tính dựa trên:

- Vốn.
- Giá trị tài sản.
- Người dùng.
- Dữ liệu.
- Điểm lý luận.

Công thức được scale khoảng 0 đến 100 để dễ đọc trên giao diện.

## 16. Điều kiện thắng

Một người chơi thắng nếu đạt một trong các điều kiện:

1. Kiểm soát ít nhất 60% tổng quyền lực thị trường.
2. Đạt 100 điểm lý luận và có điểm kinh tế cao nhất.
3. Sau 25 vòng, người có tổng điểm cao nhất thắng.

## 17. Ý nghĩa màn kết quả

Khi kết thúc, game hiển thị câu hỏi:

“Bạn đã thắng thị trường. Nhưng xã hội có thật sự tốt hơn không?”

Ý nghĩa:

- Độc quyền dầu mỏ dựa trên tài nguyên khan hiếm và hạ tầng vật chất.
- Độc quyền dữ liệu dựa trên người dùng, dữ liệu, thuật toán, AI và nền tảng.
- Hình thức độc quyền thay đổi, nhưng sự tập trung quyền lực thị trường vẫn tồn tại.
- Đây là một giới hạn của CNTB hiện đại.

## 18. Gợi ý thuyết trình

Khi trình bày trên lớp, có thể giải thích game theo 3 bước:

1. Người chơi cạnh tranh để mua tài sản và mở rộng quyền lực.
2. Cạnh tranh dần tạo ra người dẫn đầu nhờ tích lũy tiền, tài sản, users và data.
3. Người thắng có thể rất mạnh về thị trường, nhưng game đặt câu hỏi về tác động xã hội của độc quyền.

Kết luận: từ dầu mỏ đến dữ liệu, hình thức kiểm soát thay đổi, nhưng logic tập trung tư bản và quyền lực thị trường vẫn là vấn đề cần phân tích trong MLN122.
