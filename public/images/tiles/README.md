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

- 4 ô góc: `100 x 100 px`, hoặc ảnh vuông lớn hơn như `300 x 300 px`.
- Ô cạnh trên/dưới: `60 x 100 px`, hoặc cùng tỉ lệ `3:5` như `180 x 300 px`.
- Ô cạnh trái/phải: `100 x 60 px`, hoặc cùng tỉ lệ `5:3` như `300 x 180 px`.

Ảnh sẽ phủ nền bằng `background-size: cover`, nên phần quan trọng nên nằm ở giữa ảnh.

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

## Có cần đủ ảnh ngay không?

Không. Nếu thiếu ảnh, ô vẫn hiển thị màu nền và chữ. Khi bạn thêm đúng file PNG vào thư mục này, ảnh sẽ tự hiện sau khi refresh trang.
