# Luật chơi Data Monopoly

## 1. Mục tiêu của trò chơi

Data Monopoly là web trò chơi giáo dục về chủ đề từ độc quyền dầu mỏ đến độc quyền dữ liệu. Người chơi bắt đầu với vốn khởi nghiệp, sau đó cạnh tranh để tích lũy tài sản, người dùng, dữ liệu, ảnh hưởng và điểm lý luận.

Thông điệp chính của trò chơi là: hình thức độc quyền có thể thay đổi từ tài nguyên vật chất sang dữ liệu và nền tảng số, nhưng xu hướng tập trung tư bản và quyền lực thị trường vẫn tồn tại.

Lưu ý học thuật: trò chơi tách giữa lý luận gốc trong giáo trình Kinh tế chính trị Mác - Lênin và phần vận dụng hiện đại. Các thuật ngữ như Big Tech, gatekeeper, behavioral surplus, walled garden, DMA hoặc ví dụ Cambridge Analytica được dùng để minh họa logic độc quyền trong kinh tế số, không phải thuật ngữ nguyên bản của giáo trình.

## 2. Learning outcomes sau khi chơi

Sau khi trải nghiệm Data Monopoly, người học được kỳ vọng đạt các kết quả sau:

| Learning outcome | Người học chứng minh qua đâu trong game |
| --- | --- |
| Giải thích được nguyên nhân hình thành độc quyền | Quan sát quá trình mua tài sản, nâng cấp, tích lũy vốn và quyền lực thị trường qua nhiều vòng |
| Phân biệt được tích tụ tư bản và tập trung tư bản | Tích tụ thể hiện qua tái đầu tư/nâng cấp; tập trung thể hiện qua việc tài sản và quyền lực dồn về người chơi mạnh hơn |
| Nhận diện được rào cản gia nhập trong độc quyền dầu mỏ và độc quyền dữ liệu | So sánh tài sản dầu mỏ/hạ tầng với tài sản dữ liệu/nền tảng/AI, cùng chi phí phụ thuộc khi đi vào tài sản của người khác |
| Phân tích được hiệu ứng mạng lưới và vòng lặp dữ liệu - AI | Theo dõi cơ chế người dùng tạo dữ liệu, dữ liệu hỗ trợ AI/nền tảng, từ đó tiếp tục tăng lợi thế |
| Đánh giá được tác động hai mặt của độc quyền | Nhìn thấy người thắng có quyền lực lớn nhưng đồng thời xuất hiện thuế, điều tiết, khủng hoảng, tẩy chay và câu hỏi phản tư xã hội |
| Vận dụng lý luận Mác - Lênin để phân tích Big Tech hiện đại, đồng thời phân biệt rõ lý luận gốc và minh họa hiện đại | Trả lời quiz, đọc giải thích và đối chiếu độc quyền dầu mỏ với độc quyền dữ liệu trong phần tổng kết sau ván |

Các learning outcomes này giúp sản phẩm không chỉ là trò chơi cạnh tranh, mà là một hoạt động học tập có mục tiêu rõ ràng.

## 3. Số người chơi

Trò chơi hỗ trợ từ 2 đến 4 người chơi.

Trước khi bắt đầu, mỗi người chơi cần:

- Nhập tên.
- Chọn ảnh nhân vật.
- Bắt đầu với cùng lượng vốn ban đầu.
- Tên người chơi không được trùng nhau.
- Avatar không được chọn trùng nhau.

Ảnh nhân vật đặt trong `public/images/players`. Ảnh từng ô đặt trong `public/images/tiles`.

Nguồn nhạc nền và âm thanh bổ sung trong game lấy từ Pixabay Music/Pixabay Sound Effects. Các file âm thanh đặt trong `public/sounds`, gồm tiếng tung xúc xắc và các bản nhạc nền. Khi nộp hoặc chia sẻ công khai, nhóm nên ghi rõ nguồn Pixabay và giữ thông tin tác giả/tên file để minh bạch tài nguyên sử dụng.

## 4. Chỉ số của người chơi

Mỗi người chơi có các chỉ số sau:

- Vốn: tiền dùng để mua tài sản, nâng cấp tài sản và trả phí.
- Ảnh hưởng: mức ảnh hưởng xã hội/thị trường.
- Người dùng: số lượng người dùng, quan trọng với tài sản dữ liệu.
- Dữ liệu: lượng dữ liệu sở hữu, là tài nguyên chiến lược trong kinh tế số.
- Điểm lý luận: điểm nhận được khi trả lời đúng câu hỏi lý luận.
- Tài sản: danh sách tài sản đã mua.
- Vị trí: vị trí hiện tại trên bàn cờ.
- Đang bị điều tra: trạng thái bị điều tra chống độc quyền.

### Bảng phân loại chỉ số game

| Chỉ số | Loại chỉ số | Ý nghĩa trong game | Liên hệ lý thuyết |
| --- | --- | --- | --- |
| Vốn | Kinh tế | Tiền dùng để mua tài sản, nâng cấp, trả phí và chịu biến động thị trường | Gắn với tích lũy tư bản, tái đầu tư và khả năng mở rộng quy mô |
| Tài sản | Kinh tế | Các ô người chơi sở hữu, tạo tiền thuê và lợi thế dài hạn | Gắn với kiểm soát tư liệu sản xuất, tài nguyên/hạ tầng/nền tảng |
| Người dùng | Kinh tế số/xã hội | Quy mô người dùng của nền tảng, tạo dữ liệu và lợi thế mạng lưới | Gắn với hiệu ứng mạng lưới và độc quyền dữ liệu |
| Dữ liệu | Kinh tế số | Tài nguyên chiến lược trong game, hỗ trợ nền tảng và AI | Gắn với vận dụng hiện đại về dữ liệu như nguồn lực sản xuất mới |
| Ảnh hưởng | Xã hội/thị trường | Mức sức nặng xã hội, uy tín và khả năng chi phối thị trường trong mô phỏng | Gắn với quyền lực thị trường, vị thế nền tảng và tác động xã hội |
| Điểm lý luận | Game hóa/học tập | Điểm nhận được khi trả lời đúng câu hỏi, phản ánh mức tiếp thu kiến thức | Không phải quyền lực thị trường trực tiếp; dùng để đo kết quả học tập |
| Quyền lực thị trường | Chỉ số tổng hợp mô phỏng | Tổng hợp vốn, tài sản, người dùng, dữ liệu và ảnh hưởng để ước lượng mức chi phối | Gắn với độc quyền, tập trung quyền lực thị trường và rào cản cạnh tranh |
| Điểm tổng | Chỉ số game hóa | Dùng để xếp hạng cuối game, có tính cả điểm kinh tế và điểm học tập | Phục vụ mục tiêu trò chơi, không phải khái niệm lý luận nguyên bản |

Lưu ý: các chỉ số trong game là công cụ mô phỏng và học tập. Chúng giúp người chơi hình dung quan hệ kinh tế - xã hội, nhưng không phải thước đo kinh tế học chính thức.

Khi bắt đầu ván:

- Vốn: có sẵn để mua tài sản ban đầu.
- Ảnh hưởng: 0.
- Người dùng: 0.
- Dữ liệu: 0.
- Điểm lý luận: 0.
- Tài sản: 0.

Các chỉ số không giảm xuống dưới 0. Nếu người chơi bị phạt vượt quá lượng vốn hoặc dữ liệu đang có, trò chơi chỉ trừ đến 0.

## 5. Cấu trúc bàn cờ

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
- Mỏ dầu: mỏ dầu.
- Nhà máy lọc dầu: nhà máy lọc dầu.
- Đường ống: đường ống.
- Logistics: vận chuyển/cảng/kho.
- Nền tảng tìm kiếm: nền tảng tìm kiếm.
- Mạng xã hội: mạng xã hội.
- Sàn thương mại điện tử: sàn thương mại điện tử.
- Hạ tầng đám mây: hạ tầng đám mây.
- Phòng thí nghiệm AI: phòng thí nghiệm AI.
- Thuế / Quy định: thuế hoặc quy định.
- Khủng hoảng: khủng hoảng.
- Khí vận / Cơ hội: rút thẻ may rủi hoặc biến động thị trường.
- Câu hỏi lý luận: câu hỏi lý luận.
- Điều tra chống độc quyền: điều tra chống độc quyền.

## 6. Cách chơi mỗi lượt

Mỗi lượt diễn ra theo thứ tự:

1. Người chơi hiện tại bấm Tung xúc xắc.
2. Trò chơi tung 2 xúc xắc và lấy tổng số điểm.
3. Token của người chơi di chuyển từng ô theo kết quả xúc xắc.
4. Trong lúc di chuyển, một số tình huống thị trường có thể phát sinh theo nhịp di chuyển.
5. Khi dừng ở ô mới, trò chơi xử lý hiệu ứng của ô đó.
6. Người chơi có thể mua tài sản nếu ô chưa có chủ, đủ vốn và trả lời đúng câu hỏi mua tài sản.
7. Người chơi chỉ có thể nâng cấp nếu đang đứng trên ô tài sản của chính mình, tài sản đó đã sở hữu ít nhất 1 vòng và người chơi đủ tiền.
8. Người chơi bấm Kết thúc lượt để chuyển sang người tiếp theo.

Người chơi phải tung xúc xắc ít nhất 1 lần mới được kết thúc lượt.

Luật cặp đặc biệt:

- Nếu tung được cặp 1:1, người chơi được tung thêm 1 lần.
- Nếu tung được cặp 6:6, người chơi được tung thêm 1 lần.
- Lượt tung thêm vẫn phải chờ token di chuyển xong và hiệu ứng ô hiện tại được xử lý xong.
- Nếu lượt tung thêm tiếp tục ra 1:1 hoặc 6:6, người chơi lại được thêm 1 lần tung.

Hiệu ứng trong lúc di chuyển:

- Nếu tung được tổng từ 10 trở lên, người chơi có tài sản dữ liệu nhận thêm một ít người dùng/dữ liệu vì độ phủ thị trường tăng; người chơi có hạ tầng dầu mỏ/logistics/hạ tầng đám mây nhận thêm ảnh hưởng.
- Nếu tung tổng từ 3 trở xuống và đã có tài sản, người chơi phát sinh chi phí vận hành nhỏ.

Ý nghĩa học tập: thị trường không chỉ thay đổi ở điểm dừng cuối cùng. Tốc độ mở rộng, độ phủ, chi phí vận hành và hạ tầng đều ảnh hưởng đến quá trình tích lũy.

## 7. Đi qua ô Khởi nghiệp

Khi người chơi đi qua ô Khởi nghiệp, người chơi nhận thêm tiền.

Ý nghĩa lý luận: Khởi nghiệp tượng trưng cho chu kỳ tái đầu tư. Tư bản tiếp tục vận động qua các vòng sản xuất, lưu thông và tích lũy.

Trong lối chơi hiện tại, đi qua Khởi nghiệp còn có tác dụng mở quyền nâng cấp cho tài sản đã mua. Một tài sản mới mua phải được giữ qua ít nhất 1 vòng trước khi nâng cấp.

Giải thích học thuật: cơ chế này không có nghĩa trong thực tế mọi doanh nghiệp chỉ cần “đi đủ một vòng” là được mở rộng. Đây là cách game hóa chu kỳ tái đầu tư: tài sản cần trải qua một vòng vận động sản xuất - lưu thông trước khi được tái đầu tư, nâng cấp và mở rộng quy mô.

## 8. Mua tài sản

Nếu người chơi dừng ở một ô tài sản chưa có chủ và đủ tiền, người chơi có thể mua tài sản đó.

Trước khi mua, trò chơi sẽ chọn ngẫu nhiên 1 câu hỏi lý luận từ bộ câu hỏi. Người chơi phải trả lời đúng mới được mua ô đó. Nếu trả lời sai, người chơi không mua được ô hiện tại trong lượt này, nhưng vẫn xem được giải thích để học lại và có thể thử lại khi quay lại ô đó ở lượt sau.

Khi mua, người chơi:

- Trả giá mua hiển thị trên ô.
- Được cộng một phần nhỏ điểm lý luận và ảnh hưởng nếu vượt qua câu hỏi mua tài sản.
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
- Phòng thí nghiệm AI.

Ý nghĩa lý luận: mua tài sản mô phỏng quá trình tích lũy tư bản và kiểm soát nguồn lực quan trọng của thị trường. Điều kiện trả lời câu hỏi giúp việc tích lũy tài sản gắn trực tiếp với hiểu biết lý luận, tránh việc chỉ mua theo may rủi.

Giải thích học thuật: trả lời đúng câu hỏi làm tăng ảnh hưởng là cơ chế game hóa. Nó biểu thị việc người chơi có năng lực nhận diện đúng quy luật vận động của thị trường, từ đó ra quyết định tốt hơn trong mô phỏng. Đây không phải quy luật kinh tế trực tiếp ngoài đời thực.

## 9. Trả tiền thuê

Nếu người chơi dừng ở tài sản thuộc người chơi khác, người chơi phải trả tiền thuê.

Với tài sản dầu mỏ, tiền thuê chủ yếu thể hiện lợi ích từ tài nguyên vật chất và hạ tầng.

Với tài sản dữ liệu, người chơi có thể mất thêm người dùng hoặc dữ liệu, mô phỏng sự phụ thuộc vào nền tảng số.

Ý nghĩa lý luận: khi một chủ thể kiểm soát tài nguyên hoặc nền tảng, các chủ thể khác phải phụ thuộc và trả chi phí để tiếp cận thị trường.

Giải thích học thuật: việc người chơi mất người dùng hoặc dữ liệu khi dừng vào tài sản dữ liệu của người khác là cách game mô phỏng sự phụ thuộc nền tảng, chi phí chuyển đổi, lock-in và việc dữ liệu/người dùng có thể bị hút về hệ sinh thái mạnh hơn. Không nên hiểu đây là quy luật cơ học tuyệt đối.

## 10. Nâng cấp tài sản

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

Nếu người chơi sở hữu Hạ tầng đám mây, một số chi phí nâng cấp được giảm.

Ý nghĩa lý luận: nâng cấp mô phỏng việc doanh nghiệp lớn tiếp tục tái đầu tư để mở rộng quy mô và củng cố vị thế độc quyền.

Giải thích học thuật: hạ tầng đám mây làm giảm chi phí nâng cấp là cách biểu đạt lợi thế hạ tầng, quy mô và khả năng tối ưu vận hành của nền tảng lớn. Trong thực tế, tác động này còn phụ thuộc vào công nghệ, tổ chức, thị trường và chính sách.

## 11. Tài sản dầu mỏ và tài sản dữ liệu

Tài sản dầu mỏ chủ yếu tạo ra vốn và ảnh hưởng.

Tài sản dữ liệu chủ yếu tạo ra người dùng, dữ liệu và ảnh hưởng.

Phòng thí nghiệm AI làm tăng giá trị của tài sản dữ liệu, vì dữ liệu nhiều giúp AI mạnh hơn, còn AI mạnh hơn lại giúp nền tảng thu hút thêm người dùng.

Cuối mỗi lượt, nếu người chơi có tài sản dữ liệu và đã có người dùng, trò chơi tự chuyển một phần người dùng thành dữ liệu mới. Nói cách khác: càng nhiều người dùng, nền tảng càng tạo thêm dữ liệu hành vi; dữ liệu đó lại có thể làm mạnh thuật toán, AI và quyền lực thị trường.

Ý nghĩa lý luận: độc quyền dầu mỏ dựa vào tài nguyên khan hiếm và hạ tầng vật chất; độc quyền dữ liệu dựa vào người dùng, dữ liệu, thuật toán, AI và nền tảng.

## 12. Ô Khí vận và Cơ hội

Khi dừng ở ô Khí vận hoặc Cơ hội, người chơi rút một thẻ từ đúng xấp bài tương ứng.

Hai loại xấp bài:

- Khí vận: thiên về may rủi cá nhân, biến động nhỏ, chi phí bất ngờ hoặc khoản thưởng.
- Cơ hội: thiên về biến động thị trường, chính sách, công nghệ hoặc tác động lên nhiều người chơi.

Quy luật lặp lại của thẻ:

1. Mỗi loại ô dùng chung một xấp bài riêng.
2. Khi người chơi dừng ở ô đó, hệ thống rút lá trên cùng.
3. Sau khi thực hiện hiệu ứng, lá bài thường được đưa xuống đáy xấp.
4. Một lá bài chỉ xuất hiện lại sau khi các lá còn lại trong xấp đã được rút qua.
5. Thẻ giữ lại, ví dụ Miễn điều tra một lần, không quay lại xấp ngay. Người chơi giữ thẻ đó cho đến khi luật lối chơi sau này cho phép sử dụng.

Ví dụ thẻ Khí vận / Cơ hội:

- Cá mập cắn cáp: nếu sở hữu tài sản dữ liệu, mất tiền và dữ liệu.
- Trúng số khởi nghiệp: nhận thêm tiền.
- Đầu tư chứng khoán có lời hoặc thua lỗ.
- Bão lũ làm gián đoạn logistics.
- KOL đánh giá tích cực: nhận thêm người dùng, và nếu có tài sản dữ liệu thì nhận thêm dữ liệu.
- Tín dụng hạ tầng đám mây miễn phí: hỗ trợ mở rộng hạ tầng hoặc nhận vốn thay thế.
- Tăng tốc thị trường: nhận thêm ảnh hưởng, tượng trưng cho lợi thế đi trước.
- Án phạt chống độc quyền: người dẫn đầu bị trừ tiền và ảnh hưởng.
- Vòng lặp người dùng - dữ liệu: người có nhiều người dùng nhất tiếp tục tăng người dùng và dữ liệu.
- Tẩy chay nền tảng: người có nhiều dữ liệu nhất mất người dùng và ảnh hưởng.
- Sandbox chính sách: người cuối bảng nhận người dùng, dữ liệu và điểm lý luận để mô phỏng chính sách mở cơ hội cạnh tranh.
- Khóa nhà cung ứng: người dẫn đầu tăng ảnh hưởng, người khác chịu chi phí tiếp cận thị trường.

Các thẻ có thể tác động đến:

- Vốn.
- Ảnh hưởng.
- Người dùng.
- Dữ liệu.
- Tài sản.
- Người chơi đang dẫn đầu hoặc cuối bảng.

Ví dụ:

Ý nghĩa lý luận: thị trường không đứng yên. Chính sách, khủng hoảng, công nghệ và phản ứng xã hội đều có thể ảnh hưởng đến quyền lực độc quyền.

## 13. Ô Câu hỏi

Khi dừng ở ô Câu hỏi lý luận, người chơi trả lời câu hỏi lý luận.

Nếu trả lời đúng:

- Nhận điểm lý luận.
- Tăng nhẹ ảnh hưởng.

Nếu trả lời sai:

- Không nhận điểm thưởng.
- Trò chơi vẫn hiển thị giải thích để người chơi học lại kiến thức.

Bộ câu hỏi được lấy từ file Source Question.md và đã được đưa vào dữ liệu câu hỏi của trò chơi.

Bộ câu hỏi cũng được dùng cho thử thách mua tài sản. Mỗi lần bấm mua, câu hỏi được chọn ngẫu nhiên để tạo nhịp chơi khó đoán hơn.

## 14. Ô Thuế, Quy định và Điều trần

Các ô này mô phỏng sự điều tiết khi quyền lực thị trường quá lớn.

Ô Thuế / Quy định:

- Người chơi đang đứng trên ô phải trả phí.
- Người chơi mất ảnh hưởng.
- Nếu sở hữu Hạ tầng đám mây, phí có thể được giảm vì hạ tầng vận hành tốt hơn.

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

## 15. Bảng thông tin người chơi

Mỗi người chơi có một bảng thông tin riêng trong trò chơi.

Bảng này hiển thị:

- Vốn hiện có.
- Ảnh hưởng.
- Người dùng.
- Dữ liệu.
- Điểm lý luận.
- Quyền lực thị trường.
- Danh sách ô đất/tài sản đã mua.
- Số ô, tên tài sản, cấp hiện tại, tiền thuê cơ bản và trạng thái đã đủ vòng nâng cấp hay chưa.

## 16. Quyền lực thị trường

Quyền lực thị trường là điểm thể hiện mức chi phối thị trường của người chơi.

Điểm này được tính dựa trên:

- Vốn.
- Giá trị tài sản.
- Người dùng.
- Dữ liệu.
- Ảnh hưởng.

Công thức được scale khoảng 0 đến 100 để dễ đọc trên giao diện.

Lưu ý học thuật: quyền lực thị trường trong game là chỉ số mô phỏng. Chỉ số này không đồng nhất hoàn toàn với khái niệm quyền lực thị trường trong kinh tế học hay kinh tế chính trị. Điểm lý luận không được xem là quyền lực thị trường trực tiếp; điểm lý luận là chỉ số học tập và chỉ góp vào điểm tổng/điều kiện thắng theo hướng giáo dục.

## 17. Điều kiện thắng

Một người chơi thắng nếu đạt một trong các điều kiện:

1. Từ vòng 5 trở đi, sở hữu ít nhất 4 tài sản và kiểm soát ít nhất 60% tổng quyền lực thị trường.
2. Đạt 100 điểm lý luận và có điểm kinh tế cao nhất.
3. Sau 25 vòng, người có tổng điểm cao nhất thắng.

Lưu ý: trò chơi không xét thắng độc quyền ngay ở các vòng đầu, vì lúc đó thị trường chưa đủ thời gian tích lũy. Điều này tránh trường hợp một người vừa mua tài sản đầu tiên đã bị tính là độc quyền.

Lưu ý giáo dục: người thắng trong game là người đạt ưu thế trong mô phỏng, không có nghĩa kết quả đó là tốt nhất cho xã hội. Game cố ý đặt người chơi vào vị trí tích lũy quyền lực để sau đó phản tư về tác động hai mặt của độc quyền.

## 18. Ý nghĩa màn kết quả

Khi kết thúc, trò chơi hiển thị câu hỏi:

“Bạn đã thắng thị trường. Nhưng xã hội có thật sự tốt hơn không?”

Ý nghĩa:

- Độc quyền dầu mỏ dựa trên tài nguyên khan hiếm và hạ tầng vật chất.
- Độc quyền dữ liệu dựa trên người dùng, dữ liệu, thuật toán, AI và nền tảng.
- Hình thức độc quyền thay đổi, nhưng sự tập trung quyền lực thị trường vẫn tồn tại.
- Đây là một giới hạn của CNTB hiện đại.
- Người thắng có thể đạt ưu thế thị trường, nhưng lớp cần thảo luận thêm: quyền lực đó làm tăng hiệu quả, hay làm người chơi khác phụ thuộc và làm giảm cạnh tranh?

Màn kết quả cũng có phần Tổng kết sau ván chơi:

- Người thắng bằng dạng độc quyền nào: dầu mỏ, dữ liệu, hạ tầng hoặc hỗn hợp.
- Nguồn lực then chốt mà người thắng kiểm soát.
- Mức độ người chơi khác phụ thuộc vào tài sản của người thắng.
- Người thắng có bị điều tiết hoặc chống độc quyền hay không.
- Khái niệm lý luận mà kết quả ván chơi minh họa.

Ngoài ra, game hiển thị một số chỉ số xã hội trong mô phỏng:

- Mức cạnh tranh còn lại.
- Mức tập trung thị trường.
- Mức tổn hại người chơi nhỏ/người tiêu dùng.
- Mức điều tiết cần thiết.

Các chỉ số này không phải thước đo kinh tế học chính thức, mà là công cụ phản tư để người chơi thảo luận tác động xã hội của độc quyền.

## 19. Gợi ý thuyết trình

Khi trình bày trên lớp, có thể giải thích trò chơi theo 3 bước:

1. Người chơi cạnh tranh để mua tài sản và mở rộng quyền lực.
2. Cạnh tranh dần tạo ra người dẫn đầu nhờ tích lũy tiền, tài sản, người dùng và dữ liệu.
3. Với nền tảng số, nhiều người dùng tạo thêm dữ liệu; dữ liệu giúp thuật toán/AI mạnh hơn; lợi thế này có thể tiếp tục hút người dùng mới.
4. Các thẻ điều tiết, tẩy chay, khủng hoảng và dữ liệu mở nhắc người học rằng quyền lực độc quyền luôn có giới hạn xã hội, chính sách và kỹ thuật.
5. Người thắng có thể rất mạnh về thị trường, nhưng trò chơi đặt câu hỏi về tác động xã hội của độc quyền.

Kết luận: từ dầu mỏ đến dữ liệu, hình thức kiểm soát thay đổi, nhưng logic tập trung tư bản và quyền lực thị trường vẫn là vấn đề cần phân tích trong kinh tế chính trị Mác - Lênin.


