# Bộ level của bản dựng lại — thứ tự màu tự xáo, ray mượn

Các file JSON trong thư mục này do `../remap.mjs` tạo. Đây là bộ **bản build đọc** (`DATA` trỏ
vào `./data/` khi build), nên nó nằm trong repo.

Công thức, theo lệnh chủ dự án 2026-09-16 (*"tự xáo thứ tự màu là đủ"*):

- **Thứ tự màu trong khay là của mình.** Mỗi level xáo lại màu giữa mọi ô. Giữ nguyên số khối
  mỗi khay, **số lượng mỗi màu** (bắt buộc: `DELIVER` = 4, một màu không chia hết cho 4 là một
  bàn không thắng được) và vị trí khối ẩn `?`. Bot thử nhiều cách xáo và giữ cách có độ khó
  **gần bản gốc nhất**.
- **Bảng màu đổi** — mỗi level một hoán vị riêng, gieo theo số level.
- **Con số độ khó lấy theo bản gốc cùng số** — số khay, số màu, `SlotCount`. Đó là đường cong độ
  khó, không phải cách xếp.
- **Hình ray mượn** trong 800 hình ray của Loop Sort, bắt buộc khác hình level đó đang dùng, rồi
  chọn lại số bến cho khớp số khay (trải đều quanh vòng theo góc). Chủ dự án chọn giữ ray mượn vì
  tự vẽ ray toàn lỗi.

`remap.json` là sổ ghi: mỗi level kèm số khay, số màu, số khối, khuôn xếp **mới** (`shape`), tỉ
lệ ô đã đổi màu (`changed`), hình ray đã mượn, hoán vị màu, khung bàn đo được. ⚠ Nó **không**
ghi khuôn xếp của bản gốc — thư mục này đi theo bản build.

## Nghiệm thu 5 level hiện có (2026-09-16)

| lv | khay | màu | ô đổi màu | bot (gốc) | chạm (gốc) | thắng khi bot chơi lệch |
|---|---|---|---|---|---|---|
| 1 | 2 | 1 | 0% (chỉ một màu) | 100% (100%) | 2 (2) | 20/30 |
| 2 | 3 | 2 | 50% | 0% (0%) | 77 (76) | 7/30 |
| 3 | 3 | 3 | 83% | 0% (0%) | 54 (50) | 7/30 |
| 4 | 3 | 3 | 67% | 100% (100%) | 9 (11) | 23/30 |
| 5 | 4 | 4 | 75% | 100% (100%) | 22 (20) | 20/30 |

Bot 0% không có nghĩa là không thắng được: bot là tất định, nên phải cho nó chơi lệch ngẫu nhiên
mới biết bàn có đường thắng hay không — cả 5 level đều có.

## Vì sao ghép chứ không tự sinh

`levelgen.mjs` vẽ ray từ đầu, và hỏng ở chỗ không ai ngờ: **ray nó sinh ra rộng gần gấp đôi ray
của họ** (22–48 đơn vị so với 20–25). Camera khớp cả bàn cờ vào khung hình, nên bàn cờ rộng gấp
đôi tức là khay và vali trên màn hình **bé đi một nửa** — đúng cái đã bị báo nhiều lần. Hình ray
của họ là thứ đã được chỉnh tay qua 1299 level; muốn học thì mượn hình, đừng vẽ lại.

## Nghiệm thu, đối chiếu thẳng với bản gốc trên 20 level đầu

| | bộ ghép | bộ gốc |
|---|---|---|
| bot thắng (6 ván/level, cùng hạt) | **55%** | 55% |
| số chạm trung bình · peak ray | **45 · 9,2** | 46 · 9,2 |
| level khớp đúng kết quả bản gốc | **20/20** | — |
| chênh lệch cỡ khay trên màn hình giữa level to nhất và bé nhất | **0%** | 157% |
| level bị xe chồng lên nhau (`fit < 1`) | **0/20** | 3/20 |
| level có thân xe cắt qua ray | **0/20** | 5/20 |
| tỷ lệ khối ẩn `?` | 34% | 33% |

⚠ **Luật chọn hình ray là "GẦN BẢN GỐC NHẤT", không phải "bot thắng".** Bản đầu đòi bot phải
thắng, và đó là một cái bẫy: nó không giữ độ khó mà **lọc lấy ray dễ** — đo ra bộ ghép thắng
100% trong khi bản gốc 55%, tức đã làm dễ đi cả một bộ level mà vẫn tưởng là giữ nguyên. Độ khó
của bản gốc phải được **đo trước** khi sửa bất cứ thứ gì, và phải đo hết một lượt vì nhiều level
dùng chung carrier.

Cỡ khay trên màn hình bằng nghịch đảo của khung bàn cờ, nên `remap.mjs` **nhắm khung bàn về một
cỡ chuẩn** (`TARGET_SPAN`): lọc hình học trước, xếp hạng ứng viên theo khung bàn, rồi mới cho bot
chơi. Lấy ngay hình đầu tiên qua được hình học thì khung bàn nằm đâu cũng được — và đó chính là
cái làm "khay bé tí ở level này, to ở level kia".

⚠ Mỗi level còn phải qua: mọi bến lệch ≤ 12° so với hướng ray, cách ray 1,5–5,2 đơn vị, không
cặp xe nào chồng nhau, ray đủ dài cho `SlotCount`, và **bot chơi thắng bằng chính engine**.
Hình học kiểm trước vì một bàn có xe chồng nhau vẫn thắng được — bot không bao giờ báo.

⚠ **Level của Loop Sort (Garawell/Voodoo) có bản quyền.** Bản mổ APK trong `Manythings/` là tài
liệu tham khảo và `.gitignore` đã loại nó ra. Thư mục này là dẫn xuất từ đó: hình ray mượn của
họ, cách xếp khay giữ của họ, bảng màu là của mình. Đây là quyết định của chủ dự án, ghi ra đây
để không ai hiểu nhầm là bộ tự làm hoàn toàn.

Sinh lại:

```
node tools/loopsort/remap.mjs --to 20              # ghép 20 level đầu
node tools/loopsort/remap.mjs --to 20 --no-recolor # giữ nguyên màu gốc
node tools/loopsort/levelbot.mjs 1-20 --data tools/loopsort/data   # đo độ khó
```
