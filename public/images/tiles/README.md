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

## Kích thước khuyến nghị

- 4 ô góc: `150 x 150 px`, hoặc ảnh vuông lớn hơn như `600 x 600 px`.
- Ô cạnh trên/dưới: `98 x 150 px`, hoặc cùng tỉ lệ gần `2:3` như `392 x 600 px`.
- Ô cạnh trái/phải: `150 x 98 px`, hoặc cùng tỉ lệ gần `3:2` như `600 x 392 px`.

Ảnh sẽ phủ nền bằng `background-size: cover`, nên phần quan trọng nên nằm ở giữa ảnh.

## Ảnh nền bàn cờ

Ảnh nền không đặt trong thư mục này mà đặt ở:

```text
public/images/board
```

Xem hướng dẫn chi tiết trong:

```text
public/images/board/README.md
```

Các file nền đang được game hỗ trợ:

```text
board-outer-blue.png
board-inner-orange.png
```

## Danh sách ảnh cần generate riêng, có số thứ tự và gợi ý prompt

Bạn có thể copy từng dòng để yêu cầu AI generate ảnh. Phần trong ngoặc là ngữ cảnh để AI không hiểu sai tên ô.

Các ô dùng chung ảnh như `fortune-2.png`, `fortune-3.png`, `chance-2.png`, `chance-3.png`, `theory-quiz-2.png`, `theory-quiz-3.png` không nằm trong danh sách prompt chính bên dưới. Xem mục "Các ô có thể dùng chung ảnh" để copy/đổi tên file.

```text
00. startup-start.png (ô Khởi nghiệp, biểu tượng startup, vốn đầu tư, vòng tái đầu tư, không phải ảnh công ty thật)
01. black-river-oil-field.png (mỏ dầu Black River, giàn khoan dầu, tài nguyên khan hiếm, bối cảnh độc quyền dầu mỏ)
02. fortune-1.png (ô Khí vận, lá bài may rủi, vận may cá nhân, biểu tượng dấu hỏi; có thể dùng chung ảnh với fortune-2.png và fortune-3.png)
03. iron-pump-refinery.png (nhà máy lọc dầu Iron Pump, bồn chứa dầu, ống khói, công nghiệp dầu mỏ)
04. nova-search.png (Nova Search là nền tảng tìm kiếm dữ liệu, thanh search, dữ liệu truy vấn, thuật toán tìm kiếm; không phải ngôi sao nova ngoài vũ trụ)
05. platform-tax.png (ô Thuế nền tảng, hóa đơn thuế, luật quy định nền tảng số, biểu tượng cân bằng/thuế)
06. socialsphere.png (SocialSphere là mạng xã hội, người dùng kết nối, mạng lưới cộng đồng, dữ liệu hành vi)
07. chance-1.png (ô Cơ hội, lá bài cơ hội, biến động thị trường/chính sách/công nghệ; có thể dùng chung ảnh với chance-2.png và chance-3.png)
08. continental-pipeline.png (đường ống dầu Continental Pipeline, hạ tầng vận chuyển dầu, ống dẫn xuyên lục địa)
09. steel-port-logistics.png (Steel Port Logistics, cảng thép, container, vận tải hàng hóa, chuỗi cung ứng)
10. theory-quiz-1.png (ô Quiz lý luận MLN122, sách vở, câu hỏi, lớp học; có thể dùng chung ảnh với theory-quiz-2.png và theory-quiz-3.png)
11. shopgrid.png (ShopGrid là sàn thương mại điện tử, giỏ hàng online, dữ liệu giao dịch, người bán/người mua)
12. cloudnest.png (CloudNest là công ty/hạ tầng dữ liệu đám mây, server, cloud infrastructure, trung tâm dữ liệu; không phải tổ chim)
13. petrorail-network.png (PetroRail Network, đường sắt vận chuyển nhiên liệu, toa tàu chở dầu, logistics dầu mỏ)
14. supply-chain-crisis.png (ô Khủng hoảng chuỗi cung ứng, container kẹt, cảnh báo đứt gãy logistics, chi phí vận hành tăng)
15. adsignal.png (AdSignal là mạng quảng cáo số, dữ liệu hành vi, tín hiệu quảng cáo, biểu đồ marketing)
16. northern-drill-site.png (Northern Drill Site, điểm khoan dầu phía bắc, giàn khoan trong vùng lạnh/xa xôi)
18. visionai-lab.png (VisionAI Lab là phòng thí nghiệm AI thị giác, camera, mô hình AI, dữ liệu hình ảnh)
19. oceanic-fuel-harbor.png (Oceanic Fuel Harbor, cảng nhiên liệu đại dương, tàu dầu, bồn chứa ven biển)
20. antitrust-office.png (văn phòng điều tra chống độc quyền, hồ sơ điều tra, kính lúp, tòa nhà cơ quan quản lý)
21. mapstream.png (MapStream là dịch vụ bản đồ số, dữ liệu vị trí, dòng di chuyển, định vị GPS)
23. golden-barrel-depot.png (Golden Barrel Depot, kho thùng dầu, dự trữ nhiên liệu, màu vàng/dầu mỏ)
24. datavault.png (DataVault là kho dữ liệu lớn, bảo mật dữ liệu, ổ cứng/server, két dữ liệu số)
26. streamloop.png (StreamLoop là nền tảng nội dung/streaming, vòng lặp đề xuất, người dùng xem nội dung)
27. marketmind-ai.png (MarketMind AI là AI dự đoán thị trường, biểu đồ dữ liệu, trí tuệ nhân tạo phân tích giá)
28. open-data-regulation.png (ô Quy định dữ liệu mở, luật chia sẻ dữ liệu, biểu tượng dữ liệu mở, chính sách nền tảng)
29. pipeline-gate.png (Pipeline Gate, cổng đường ống dầu, trạm kiểm soát, phí hạ tầng)
30. cloud-tollway.png (Cloud Tollway là cổng thu phí hạ tầng cloud, server, phí truy cập dịch vụ đám mây)
31. trust-crisis.png (ô Khủng hoảng niềm tin, người dùng rời bỏ nền tảng, cảnh báo riêng tư dữ liệu, mất niềm tin)
32. data-union-hub.png (Data Union Hub là cộng đồng/liên minh dữ liệu, nhóm người dùng chia sẻ dữ liệu, hub số)
34. green-fuel-grid.png (Green Fuel Grid, lưới nhiên liệu xanh, năng lượng mới, hạ tầng phân phối)
37. algorithm-exchange.png (Algorithm Exchange là chợ thuật toán, mã lệnh, giao dịch thuật toán, nền tảng AI/data)
38. deep-sea-terminal.png (Deep Sea Terminal, cảng biển sâu, tàu hàng lớn, logistics quốc tế)
39. platform-court.png (Phiên điều trần nền tảng, tòa án/quốc hội, chống độc quyền, công ty nền tảng bị chất vấn)
```

## Các ô có thể dùng chung ảnh

Nếu muốn giảm số lượng ảnh cần tạo, các nhóm sau có thể dùng chung một ảnh và copy/đổi tên file:

- Khí vận: generate `02. fortune-1.png`, sau đó copy thành `17. fortune-2.png` và `33. fortune-3.png`.
- Cơ hội: generate `07. chance-1.png`, sau đó copy thành `22. chance-2.png` và `36. chance-3.png`.
- Quiz lý luận: generate `10. theory-quiz-1.png`, sau đó copy thành `25. theory-quiz-2.png` và `35. theory-quiz-3.png`.

Ví dụ: tạo một ảnh `fortune-1.png`, sau đó copy thành `fortune-2.png` và `fortune-3.png`.

## Mỗi ô hiện gì trên giao diện

Mỗi ô trên bàn cờ có thể hiển thị:

- Số ô: ví dụ `#12`.
- Tên rút gọn của ô: ví dụ `CloudNest`, `Khí vận`, `Điều trần`.
- Loại ô: ví dụ `Mỏ dầu`, `Cloud`, `Quiz`, `Thuế`.
- Giá mua nếu là tài sản: ví dụ `$190`.
- Phí nếu là ô thuế/quy định/điều trần: ví dụ `Phí $45`.
- Avatar người chơi đang đứng trên ô.
- Màu chủ sở hữu ở đáy ô nếu tài sản đã có chủ.

Thông tin chi tiết hơn như tiền thuê, lợi ích nâng cấp, người khác mất gì khi vào ô... được hiển thị ở panel bên phải khi người chơi đứng trên ô đó.

## Có cần đủ ảnh ngay không?

Không. Nếu thiếu ảnh, ô vẫn hiển thị màu nền và chữ. Khi bạn thêm đúng file PNG vào thư mục này, ảnh sẽ tự hiện sau khi refresh trang.
