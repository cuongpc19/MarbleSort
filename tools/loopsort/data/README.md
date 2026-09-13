# Bộ level của Loop Sort (bản dựng lại) — SINH RA, không phải mổ từ APK

Bốn file JSON trong thư mục này do `../levelgen.mjs` sinh. Chúng **không** liên quan tới
`Manythings/LoopSort-teardown/data/` ngoài một điều: đường cong độ khó được đo từ đó rồi
chép lại thành các con số mục tiêu trong `levelgen.mjs`.

- `Levels.json` 1299 level — mỗi level trỏ sang một carrier và một spline cùng số
- `Carriers.json` bố cục hàng theo lane, `A;R;Y;B_H;G` = lane A có 4 miếng, miếng thứ ba bị úp
- `Splines.json` hình ray — đa giác vuông góc trên lưới số nguyên, cộng các bến đỗ
- `Areas.json` tên thành phố và mốc mở khoá

⚠ **Level của Loop Sort (Garawell/Voodoo) có bản quyền.** Bản mổ APK trong `Manythings/`
là tài liệu tham khảo — đọc để hiểu cách họ dựng độ khó, không ship. Thư mục này là phần
"tự làm lấy": hình ray, bố cục, thứ tự màu đều do bộ sinh tạo ra.

⚠ **Bốn file này là ARTEFACT, nên commit chúng.** Bộ sinh tất định theo số level, nhưng
bước nghiệm thu có gieo lại: level nào bot không chơi thắng thì sinh lại bằng hạt khác.
Nghĩa là nếu *engine hoặc con bot thay đổi*, chạy lại `levelgen.mjs` sẽ ra một bộ khác —
vẫn hợp lệ, nhưng không trùng bộ này. Bộ nào đang nằm ở đây là bộ người chơi đang chơi.

Sinh lại:

```
node tools/loopsort/levelgen.mjs                   # toàn bộ + nghiệm thu
node tools/loopsort/levelbot.mjs 1-50              # đo độ khó một dải
node tools/loopsort/levelcompare.mjs               # đối chiếu độ khó với bản gốc
```
