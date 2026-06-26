# Ảnh cho từng ô trên bàn cờ

Đặt ảnh từng ô vào thư mục này. Game tự đọc ảnh theo công thức:

```text
/images/tiles/{tile-id}.png
```

Ví dụ ô `startup-start` dùng file:

```text
public/images/tiles/startup-start.png
```

## Định dạng ảnh

- Khuyến nghị dùng: `PNG`.
- Có thể dùng `JPG` hoặc `WebP`, nhưng khi đó cần chỉnh đường dẫn trong `src/components/BoardTile.tsx`.
- Ảnh nên nén vừa phải để web chạy nhẹ.
- Nên tạo ảnh lớn hơn kích thước hiển thị thật để khi phóng to bàn cờ vẫn nét.

## Kích thước cần tạo

Bàn cờ có 40 ô, chia thành 3 dạng khung. Khi generate ảnh, hãy tạo đúng tỉ lệ để ảnh không bị cắt mất chủ thể.

| Dạng ô | Vị trí | Kích thước nên tạo | Tỉ lệ | Ghi chú bố cục |
| --- | --- | --- | --- | --- |
| Ô góc | 00, 10, 20, 30 | `600 x 600 px` | 1:1 | Ảnh vuông, chủ thể nằm giữa, tránh đặt chi tiết quan trọng sát mép. |
| Ô ngang | 01-09, 21-29 | `392 x 600 px` | gần 2:3 | Ô nằm trên/dưới bàn cờ, khung đứng cao; ưu tiên chủ thể dọc, tránh chữ quá nhỏ. |
| Ô dọc | 11-19, 31-39 | `600 x 392 px` | gần 3:2 | Ô nằm trái/phải bàn cờ, khung ngang; chủ thể nằm giữa trái/phải, tránh cắt mất vật thể. |

Nếu dùng sprite sheet như ảnh mẫu, mỗi ô có thể nhỏ hơn. Nhưng file cuối cùng nên crop riêng từng ảnh theo đúng tỉ lệ trên.

## Cách đặt nội dung trong ảnh

- Có thể để số thứ tự `00`, `01`, ... trong ảnh ở góc trên trái nếu bạn muốn. Game đã ẩn số `#0`, `#1`, ... trên UI nên không bị trùng số với ảnh.
- Không cần đặt tên ô bằng chữ lớn trong ảnh, vì game đã hiện tên ô riêng.
- Không dùng logo công ty thật nếu ô là công ty giả định như `CloudNest`, `ShopGrid`, `Nova Search`.
- Nên giữ vùng giữa ảnh rõ ràng vì game dùng `background-size: cover`.
- Nếu ảnh có chữ, nên để ngắn và lớn; tránh chữ nhỏ vì khi thu nhỏ trên bàn cờ sẽ khó đọc.

## Ảnh nên lớn hay nhỏ theo từng ô

- Ô góc cần ảnh lớn/vuông: `00`, `10`, `20`, `30`.
- Ô cạnh trên và cạnh dưới cần ảnh khung dọc: `01`, `02`, `03`, `04`, `05`, `06`, `07`, `08`, `09`, `21`, `22`, `23`, `24`, `25`, `26`, `27`, `28`, `29`.
- Ô cạnh trái và cạnh phải cần ảnh khung ngang: `11`, `12`, `13`, `14`, `15`, `16`, `17`, `18`, `19`, `31`, `32`, `33`, `34`, `35`, `36`, `37`, `38`, `39`.

## Ảnh nên hiện gì trên ô

Mỗi ảnh nên thể hiện đúng ý nghĩa ô đất/ô sự kiện. Game sẽ tự hiện thêm:

- Tên rút gọn của ô.
- Loại ô nếu cần.
- Giá mua hoặc phí.
- Avatar người chơi đang đứng trên ô.
- Màu chủ sở hữu nếu tài sản đã có chủ.

Không cần chèn giá tiền vào ảnh. Giá tiền nên để game hiện để tránh bị lệch hoặc sai khi đổi luật.

## Ảnh nền cho bàn cờ

Ảnh nền bàn cờ không đặt trong thư mục này mà đặt ở:

```text
public/images/board
```

Xem hướng dẫn chi tiết trong:

```text
public/images/board/README.md
```

Game đang hỗ trợ:

```text
board-outer-blue.png
board-inner-orange.png
```

## Prompt generate ảnh từ 00 đến 39

Bạn có thể copy từng dòng để yêu cầu AI generate ảnh. Mỗi dòng ghi rõ kích thước nên tạo, hướng ô, tên file và nội dung cần vẽ. Nếu ô dùng chung ảnh, vẫn có trong danh sách để không thiếu thứ tự.

```text
00. startup-start.png | 600x600 | ô góc | Ô Khởi nghiệp, biểu tượng startup, tên lửa, vốn đầu tư, đồng tiền, vòng tái đầu tư; không phải ảnh công ty thật; có thể để số 00 nhỏ ở góc trên trái.
01. black-river-oil-field.png | 392x600 | ô ngang khung dọc | Mỏ dầu Black River, giàn khoan dầu lúc hoàng hôn, tài nguyên khan hiếm, không khí độc quyền dầu mỏ; có thể để số 01 nhỏ ở góc trên trái.
02. fortune-1.png | 392x600 | ô ngang khung dọc | Ô Khí vận, lá bài may rủi, dấu hỏi, ánh sáng vàng, cảm giác vận may cá nhân; có thể dùng chung cho ô 17 và 33; có thể để số 02 nhỏ ở góc trên trái.
03. iron-pump-refinery.png | 392x600 | ô ngang khung dọc | Nhà máy lọc dầu Iron Pump, bồn chứa dầu, ống khói, đường ống, công nghiệp dầu mỏ; có thể để số 03 nhỏ ở góc trên trái.
04. nova-search.png | 392x600 | ô ngang khung dọc | Nova Search là nền tảng tìm kiếm dữ liệu, thanh search, danh sách kết quả, dữ liệu truy vấn, thuật toán tìm kiếm; không phải ngôi sao nova ngoài vũ trụ; có thể để số 04 nhỏ ở góc trên trái.
05. platform-tax.png | 392x600 | ô ngang khung dọc | Ô Thuế nền tảng, hóa đơn thuế, máy tính, biểu tượng cân công lý, quy định nền tảng số; có thể để số 05 nhỏ ở góc trên trái.
06. socialsphere.png | 392x600 | ô ngang khung dọc | SocialSphere là mạng xã hội, nhiều avatar người dùng kết nối thành mạng lưới, dữ liệu hành vi, tương tác cộng đồng; có thể để số 06 nhỏ ở góc trên trái.
07. chance-1.png | 392x600 | ô ngang khung dọc | Ô Cơ hội, lá bài cơ hội, dấu chấm than, biến động thị trường, chính sách, công nghệ; có thể dùng chung cho ô 22 và 36; có thể để số 07 nhỏ ở góc trên trái.
08. continental-pipeline.png | 392x600 | ô ngang khung dọc | Continental Pipeline, đường ống dầu lớn chạy qua cánh đồng/núi, hạ tầng vận chuyển dầu xuyên lục địa; có thể để số 08 nhỏ ở góc trên trái.
09. steel-port-logistics.png | 392x600 | ô ngang khung dọc | Steel Port Logistics, cảng thép, container, cần cẩu, vận tải hàng hóa, chuỗi cung ứng dầu mỏ/công nghiệp; có thể để số 09 nhỏ ở góc trên trái.
10. theory-quiz-1.png | 600x600 | ô góc | Ô Quiz lý luận MLN122, sách vở, bút chì, dấu hỏi, lớp học/bàn học; có thể dùng chung cho ô 25 và 35; có thể để số 10 nhỏ ở góc trên trái.
11. shopgrid.png | 600x392 | ô dọc khung ngang | ShopGrid là sàn thương mại điện tử, giao diện mua sắm online, giỏ hàng, kiện hàng, dữ liệu giao dịch, người bán/người mua; có thể để số 11 nhỏ ở góc trên trái.
12. cloudnest.png | 600x392 | ô dọc khung ngang | CloudNest là công ty hạ tầng dữ liệu đám mây, server, cloud infrastructure, trung tâm dữ liệu; không phải tổ chim; có thể để số 12 nhỏ ở góc trên trái.
13. petrorail-network.png | 600x392 | ô dọc khung ngang | PetroRail Network, đường sắt vận chuyển nhiên liệu, toa tàu chở dầu, logistics dầu mỏ, nhà ga công nghiệp; có thể để số 13 nhỏ ở góc trên trái.
14. supply-chain-crisis.png | 600x392 | ô dọc khung ngang | Ô Khủng hoảng chuỗi cung ứng, container kẹt tại cảng, biểu đồ giảm, cảnh báo đổ vỡ logistics, chi phí vận hành tăng; có thể để số 14 nhỏ ở góc trên trái.
15. adsignal.png | 600x392 | ô dọc khung ngang | AdSignal là mạng quảng cáo số, loa quảng cáo, dashboard marketing, dữ liệu hành vi, tín hiệu quảng cáo, biểu đồ doanh thu; có thể để số 15 nhỏ ở góc trên trái.
16. northern-drill-site.png | 600x392 | ô dọc khung ngang | Northern Drill Site, điểm khoan dầu phía bắc, giàn khoan trong tuyết/núi lạnh, khai thác tài nguyên xa xôi; có thể để số 16 nhỏ ở góc trên trái.
17. fortune-2.png | 600x392 | ô dọc khung ngang | Ô Khí vận, có thể copy từ fortune-1.png hoặc vẽ biến thể lá bài may rủi, dấu hỏi, vận may cá nhân; có thể để số 17 nhỏ ở góc trên trái.
18. visionai-lab.png | 600x392 | ô dọc khung ngang | VisionAI Lab là phòng thí nghiệm AI thị giác, camera, màn hình nhận diện hình ảnh, mô hình AI, dữ liệu hình ảnh; có thể để số 18 nhỏ ở góc trên trái.
19. oceanic-fuel-harbor.png | 600x392 | ô dọc khung ngang | Oceanic Fuel Harbor, cảng nhiên liệu đại dương, tàu dầu, bồn chứa ven biển, cầu cảng công nghiệp; có thể để số 19 nhỏ ở góc trên trái.
20. antitrust-office.png | 600x600 | ô góc | Văn phòng điều tra chống độc quyền, hồ sơ điều tra, kính lúp, tòa nhà cơ quan quản lý, cảm giác bị điều tra; có thể để số 20 nhỏ ở góc trên trái.
21. mapstream.png | 392x600 | ô ngang khung dọc | MapStream là dịch vụ bản đồ số, điện thoại hiện bản đồ, dữ liệu vị trí, ghim GPS, dòng di chuyển; có thể để số 21 nhỏ ở góc trên trái.
22. chance-2.png | 392x600 | ô ngang khung dọc | Ô Cơ hội, có thể copy từ chance-1.png hoặc vẽ biến thể lá bài cơ hội, dấu chấm than, biến động thị trường/chính sách/công nghệ; có thể để số 22 nhỏ ở góc trên trái.
23. golden-barrel-depot.png | 392x600 | ô ngang khung dọc | Golden Barrel Depot, kho thùng dầu vàng, bồn chứa nhiên liệu, dự trữ năng lượng, cảm giác quý hiếm; có thể để số 23 nhỏ ở góc trên trái.
24. datavault.png | 392x600 | ô ngang khung dọc | DataVault là kho dữ liệu lớn, bảo mật dữ liệu, server, két sắt/ổ cứng số, khóa bảo mật; có thể để số 24 nhỏ ở góc trên trái.
25. theory-quiz-2.png | 392x600 | ô ngang khung dọc | Ô Quiz lý luận MLN122, có thể copy từ theory-quiz-1.png hoặc vẽ biến thể sách vở, câu hỏi, bút, lớp học; có thể để số 25 nhỏ ở góc trên trái.
26. streamloop.png | 392x600 | ô ngang khung dọc | StreamLoop là nền tảng nội dung/streaming, màn hình video, nút play, vòng lặp đề xuất, người dùng xem nội dung; có thể để số 26 nhỏ ở góc trên trái.
27. marketmind-ai.png | 392x600 | ô ngang khung dọc | MarketMind AI là AI dự đoán thị trường, đầu AI, biểu đồ giá, dữ liệu phân tích, trí tuệ nhân tạo tối ưu thị trường; có thể để số 27 nhỏ ở góc trên trái.
28. open-data-regulation.png | 392x600 | ô ngang khung dọc | Ô Quy định dữ liệu mở, biểu tượng open data, khóa mở, tòa nhà/chính sách, luật chia sẻ dữ liệu; có thể để số 28 nhỏ ở góc trên trái.
29. pipeline-gate.png | 392x600 | ô ngang khung dọc | Pipeline Gate, cổng đường ống dầu, trạm kiểm soát, van khóa, phí hạ tầng, đồng tiền/coin; có thể để số 29 nhỏ ở góc trên trái.
30. cloud-tollway.png | 600x600 | ô góc | Cloud Tollway là cổng thu phí hạ tầng cloud, server đám mây, barrier thu phí, biển Toll, phí truy cập dịch vụ đám mây; có thể để số 30 nhỏ ở góc trên trái.
31. trust-crisis.png | 600x392 | ô dọc khung ngang | Ô Khủng hoảng niềm tin, cảnh báo riêng tư dữ liệu, người dùng rời bỏ nền tảng, biểu tượng warning, bình luận tiêu cực; có thể để số 31 nhỏ ở góc trên trái.
32. data-union-hub.png | 600x392 | ô dọc khung ngang | Data Union Hub là cộng đồng/liên minh dữ liệu, nhóm người dùng chia sẻ dữ liệu quanh hub số, hợp tác dữ liệu; có thể để số 32 nhỏ ở góc trên trái.
33. fortune-3.png | 600x392 | ô dọc khung ngang | Ô Khí vận, có thể copy từ fortune-1.png hoặc vẽ biến thể lá bài may rủi, dấu hỏi, vận may cá nhân; có thể để số 33 nhỏ ở góc trên trái.
34. green-fuel-grid.png | 600x392 | ô dọc khung ngang | Green Fuel Grid, lưới nhiên liệu xanh, turbine gió, tấm pin mặt trời, đường ống xanh, hạ tầng phân phối năng lượng mới; có thể để số 34 nhỏ ở góc trên trái.
35. theory-quiz-3.png | 600x392 | ô dọc khung ngang | Ô Quiz lý luận MLN122, có thể copy từ theory-quiz-1.png hoặc vẽ biến thể sách vở, câu hỏi, bút, lớp học; có thể để số 35 nhỏ ở góc trên trái.
36. chance-3.png | 600x392 | ô dọc khung ngang | Ô Cơ hội, có thể copy từ chance-1.png hoặc vẽ biến thể lá bài cơ hội, dấu chấm than, biến động thị trường/chính sách/công nghệ; có thể để số 36 nhỏ ở góc trên trái.
37. algorithm-exchange.png | 600x392 | ô dọc khung ngang | Algorithm Exchange là chợ thuật toán, mã lệnh, giao dịch thuật toán, nền tảng AI/data, cửa hàng số/marketplace; có thể để số 37 nhỏ ở góc trên trái.
38. deep-sea-terminal.png | 600x392 | ô dọc khung ngang | Deep Sea Terminal, cảng biển sâu, tàu hàng lớn, cần cẩu container, logistics quốc tế, hoàng hôn công nghiệp; có thể để số 38 nhỏ ở góc trên trái.
39. platform-court.png | 600x392 | ô dọc khung ngang | Phiên điều trần nền tảng, phòng tòa/quốc hội, chống độc quyền, công ty nền tảng bị chất vấn; nên dùng logo giả lập thay vì logo thật; có thể để số 39 nhỏ ở góc trên trái.
```

## Các ô có thể dùng chung ảnh

Nếu muốn giảm số lượng ảnh cần tạo, các nhóm sau có thể dùng chung một ảnh và copy/đổi tên file:

- Khí vận: generate `fortune-1.png`, sau đó copy thành `fortune-2.png` và `fortune-3.png`.
- Cơ hội: generate `chance-1.png`, sau đó copy thành `chance-2.png` và `chance-3.png`.
- Quiz lý luận: generate `theory-quiz-1.png`, sau đó copy thành `theory-quiz-2.png` và `theory-quiz-3.png`.

## Prompt sửa riêng cho các ô bị bóp

Các ô `11-19` và `31-39` nằm ở cạnh trái/phải của bàn cờ. File ảnh cho nhóm này phải là khung ngang `600 x 392 px`. Nếu tạo nhầm ảnh khung dọc, game sẽ kéo ảnh vào ô ngang và nhìn bị bóp.

Khi generate lại, hãy yêu cầu AI dùng đúng câu mở đầu này:

```text
Tạo ảnh minh họa dạng tile game board, kích thước chính xác 600x392 px, khung ngang landscape, không crop, không viền trắng, chủ thể nằm giữa, có thể để số thứ tự nhỏ ở góc trên trái, không đặt chữ nhỏ khó đọc, phong cách board game số hóa về độc quyền dữ liệu và độc quyền dầu mỏ.
```

Sau đó ghép thêm mô tả từng ô bên dưới:

```text
11. shopgrid.png | ShopGrid là sàn thương mại điện tử, giao diện mua sắm online, giỏ hàng, kiện hàng, dữ liệu giao dịch, người bán/người mua.
12. cloudnest.png | CloudNest là công ty hạ tầng dữ liệu đám mây, server, cloud infrastructure, trung tâm dữ liệu; không phải tổ chim.
13. petrorail-network.png | PetroRail Network, đường sắt vận chuyển nhiên liệu, toa tàu chở dầu, logistics dầu mỏ, nhà ga công nghiệp.
14. supply-chain-crisis.png | Ô Khủng hoảng chuỗi cung ứng, container kẹt tại cảng, biểu đồ giảm, cảnh báo đổ vỡ logistics, chi phí vận hành tăng.
15. adsignal.png | AdSignal là mạng quảng cáo số, loa quảng cáo, dashboard marketing, dữ liệu hành vi, tín hiệu quảng cáo, biểu đồ doanh thu.
16. northern-drill-site.png | Northern Drill Site, điểm khoan dầu phía bắc, giàn khoan trong tuyết/núi lạnh, khai thác tài nguyên xa xôi.
17. fortune-2.png | Ô Khí vận, lá bài may rủi, dấu hỏi, ánh sáng vàng, cảm giác vận may cá nhân.
18. visionai-lab.png | VisionAI Lab là phòng thí nghiệm AI thị giác, camera, màn hình nhận diện hình ảnh, mô hình AI, dữ liệu hình ảnh.
19. oceanic-fuel-harbor.png | Oceanic Fuel Harbor, cảng nhiên liệu đại dương, tàu dầu, bồn chứa ven biển, cầu cảng công nghiệp.
31. trust-crisis.png | Ô Khủng hoảng niềm tin, cảnh báo riêng tư dữ liệu, người dùng rời bỏ nền tảng, biểu tượng warning, bình luận tiêu cực.
32. data-union-hub.png | Data Union Hub là cộng đồng/liên minh dữ liệu, nhóm người dùng chia sẻ dữ liệu quanh hub số, hợp tác dữ liệu.
33. fortune-3.png | Ô Khí vận, lá bài may rủi, dấu hỏi, ánh sáng vàng, cảm giác vận may cá nhân.
34. green-fuel-grid.png | Green Fuel Grid, lưới nhiên liệu xanh, turbine gió, tấm pin mặt trời, đường ống xanh, hạ tầng phân phối năng lượng mới.
35. theory-quiz-3.png | Ô Quiz lý luận MLN122, sách vở, câu hỏi, bút, lớp học.
36. chance-3.png | Ô Cơ hội, lá bài cơ hội, dấu chấm than, biến động thị trường/chính sách/công nghệ.
37. algorithm-exchange.png | Algorithm Exchange là chợ thuật toán, mã lệnh, giao dịch thuật toán, nền tảng AI/data, cửa hàng số/marketplace.
38. deep-sea-terminal.png | Deep Sea Terminal, cảng biển sâu, tàu hàng lớn, cần cẩu container, logistics quốc tế, hoàng hôn công nghiệp.
39. platform-court.png | Phiên điều trần nền tảng, phòng tòa/quốc hội, chống độc quyền, công ty nền tảng bị chất vấn; dùng logo giả lập thay vì logo thật.
```

## Có cần đủ ảnh ngay không?

Không. Nếu thiếu ảnh, ô vẫn hiển thị màu nền và chữ. Khi bạn thêm đúng file PNG vào thư mục này, ảnh sẽ tự hiện sau khi refresh trang.
