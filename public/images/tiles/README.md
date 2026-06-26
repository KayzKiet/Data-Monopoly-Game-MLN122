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

## Danh sách file cần có

```text
startup-start.png
black-river-oil-field.png
fortune-1.png
iron-pump-refinery.png
nova-search.png
platform-tax.png
socialsphere.png
chance-1.png
continental-pipeline.png
steel-port-logistics.png
theory-quiz-1.png
shopgrid.png
cloudnest.png
petrorail-network.png
supply-chain-crisis.png
adsignal.png
northern-drill-site.png
fortune-2.png
visionai-lab.png
oceanic-fuel-harbor.png
antitrust-office.png
mapstream.png
chance-2.png
golden-barrel-depot.png
datavault.png
theory-quiz-2.png
streamloop.png
marketmind-ai.png
open-data-regulation.png
pipeline-gate.png
cloud-tollway.png
trust-crisis.png
data-union-hub.png
fortune-3.png
green-fuel-grid.png
theory-quiz-3.png
chance-3.png
algorithm-exchange.png
deep-sea-terminal.png
platform-court.png
```

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

## Bảng mô tả file ảnh từng ô

| File ảnh | Ô | Nội dung gợi ý cho ảnh |
| --- | --- | --- |
| `startup-start.png` | Khởi nghiệp | Biểu tượng startup, vốn đầu tư, vòng tái đầu tư. |
| `black-river-oil-field.png` | Black River Oil Field | Mỏ dầu, giàn khoan, tài nguyên khan hiếm. |
| `fortune-1.png` | Khí vận | Lá bài may rủi, dấu hỏi, vận may. |
| `iron-pump-refinery.png` | Iron Pump Refinery | Nhà máy lọc dầu, ống khói, bồn chứa. |
| `nova-search.png` | Nova Search | Thanh tìm kiếm, dữ liệu truy vấn. |
| `platform-tax.png` | Thuế nền tảng | Thuế, hóa đơn, biểu tượng quy định. |
| `socialsphere.png` | SocialSphere | Mạng xã hội, người dùng kết nối. |
| `chance-1.png` | Cơ hội | Lá bài cơ hội, thị trường biến động. |
| `continental-pipeline.png` | Continental Pipeline | Đường ống dầu, hạ tầng vận chuyển. |
| `steel-port-logistics.png` | Steel Port Logistics | Cảng, container, vận tải. |
| `theory-quiz-1.png` | Quiz lý luận | Sách, câu hỏi, biểu tượng MLN122. |
| `shopgrid.png` | ShopGrid | Sàn thương mại điện tử, giỏ hàng, giao dịch. |
| `cloudnest.png` | CloudNest | Hạ tầng đám mây, server, cloud. |
| `petrorail-network.png` | PetroRail Network | Đường sắt vận chuyển nhiên liệu. |
| `supply-chain-crisis.png` | Khủng hoảng chuỗi cung ứng | Đứt gãy chuỗi cung ứng, cảnh báo, container kẹt. |
| `adsignal.png` | AdSignal | Quảng cáo số, biểu đồ, tín hiệu dữ liệu. |
| `northern-drill-site.png` | Northern Drill Site | Điểm khoan dầu phía bắc, giàn khoan. |
| `fortune-2.png` | Khí vận | Lá bài may rủi, biến động cá nhân. |
| `visionai-lab.png` | VisionAI Lab | AI, camera, phòng thí nghiệm dữ liệu. |
| `oceanic-fuel-harbor.png` | Oceanic Fuel Harbor | Cảng nhiên liệu, tàu dầu. |
| `antitrust-office.png` | Điều tra chống độc quyền | Tòa nhà quản lý, kính lúp, hồ sơ điều tra. |
| `mapstream.png` | MapStream | Bản đồ số, vị trí, dữ liệu di chuyển. |
| `chance-2.png` | Cơ hội | Lá bài cơ hội, chính sách hoặc công nghệ mới. |
| `golden-barrel-depot.png` | Golden Barrel Depot | Kho thùng dầu, dự trữ nhiên liệu. |
| `datavault.png` | DataVault | Kho dữ liệu, ổ cứng, bảo mật. |
| `theory-quiz-2.png` | Quiz lý luận | Câu hỏi lý luận, sách vở, bảng học. |
| `streamloop.png` | StreamLoop | Nền tảng nội dung, vòng lặp đề xuất. |
| `marketmind-ai.png` | MarketMind AI | AI dự đoán thị trường, biểu đồ. |
| `open-data-regulation.png` | Quy định dữ liệu mở | Dữ liệu mở, luật chia sẻ dữ liệu. |
| `pipeline-gate.png` | Pipeline Gate | Cổng đường ống, phí hạ tầng. |
| `cloud-tollway.png` | Cloud Tollway | Phí cloud, server, cổng thu phí số. |
| `trust-crisis.png` | Khủng hoảng niềm tin | Người dùng rời bỏ, cảnh báo riêng tư dữ liệu. |
| `data-union-hub.png` | Data Union Hub | Cộng đồng dữ liệu, nhóm người dùng. |
| `fortune-3.png` | Khí vận | Lá bài may rủi, vận động bất ngờ. |
| `green-fuel-grid.png` | Green Fuel Grid | Lưới nhiên liệu xanh, năng lượng mới. |
| `theory-quiz-3.png` | Quiz lý luận | Câu hỏi tổng kết, MLN122. |
| `chance-3.png` | Cơ hội | Lá bài cơ hội, cú hích thị trường. |
| `algorithm-exchange.png` | Algorithm Exchange | Chợ thuật toán, mã lệnh, giao dịch số. |
| `deep-sea-terminal.png` | Deep Sea Terminal | Cảng biển sâu, tàu hàng, logistics quốc tế. |
| `platform-court.png` | Phiên điều trần nền tảng | Tòa án, phiên điều trần, chống độc quyền. |

## Có cần đủ ảnh ngay không?

Không. Nếu thiếu ảnh, ô vẫn hiển thị màu nền và chữ. Khi bạn thêm đúng file PNG vào thư mục này, ảnh sẽ tự hiện sau khi refresh trang.
