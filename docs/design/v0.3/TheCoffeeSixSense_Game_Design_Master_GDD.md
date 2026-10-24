# THE COFFEE SIX SENSE
## MASTER GAME DESIGN DOCUMENT (GDD) · PRODUCT BLUEPRINT · MVP SPEC
**Bản tổng hợp làm game — 23/10/2026**  
**Tài liệu sống:** v1.0 · **Ngôn ngữ:** Tiếng Việt  
**Repository chính thức:** `https://github.com/tahulk79/TheCoffeeSixSense.git`  
**Slogan chính:** **Discover Your Sixth Taste**  
**Triết lý:** **From Coffee to Consciousness**

> **Quy ước nguồn gốc quyết định:**  
> **[CHỐT]** = định hướng/giới hạn đã được founder xác nhận.  
> **[ĐÃ THẢO LUẬN]** = thiết kế đã cùng phát triển nhưng chưa chắc là quyết định cuối.  
> **[ĐỀ XUẤT]** = đặc tả được hệ thống hóa để đội phát triển có thể triển khai; cần kiểm chứng.  
> **[CHƯA XÁC MINH]** = trạng thái kỹ thuật chưa có bằng chứng trực tiếp.  
> Các con số cân bằng game, công thức tính điểm, retention và doanh thu là giả thuyết thiết kế, không phải dữ kiện khoa học hoặc kết quả thực nghiệm.

---

# PHẦN I — PRODUCT VISION

## 1. Bản sắc và lời hứa sản phẩm
**The Coffee Six Sense** là trò chơi giáo dục–mô phỏng về specialty coffee, kết hợp trải nghiệm game cozy với kiến thức pha chế thực tế, khả năng ghi nhớ và so sánh các lần pha, thử thách kỹ năng và một lớp khám phá ý nghĩa cá nhân.

- **[CHỐT]** Tên: *The Coffee Six Sense* (viết tắt **C6S**).
- **[CHỐT]** Tagline: *Discover Your Sixth Taste*.
- **[CHỐT]** Triết lý: *From Coffee to Consciousness*.
- **[CHỐT]** “Six” nhấn mạnh **vị thứ sáu**, không đơn thuần là cụm *sixth sense*.
- **[CHỐT]** Vị thứ sáu không được trình bày như một vị giác sinh lý đã được khoa học xác lập. Nó là ý niệm trải nghiệm vượt ra ngoài các mô tả hương vị thông thường.
- **[CHỐT]** Mục tiêu là giúp người chơi **pha cà phê ngon hơn ngoài đời**, đánh giá cà phê tốt hơn, hiểu sự khác biệt trong khẩu vị và phát triển chiều sâu trải nghiệm.

### Định nghĩa làm việc của “Sixth Taste”
**[CHỐT — định hướng]** Kết hợp bốn thành phần, không ép thành một chỉ số tuyệt đối:
A. **Flavor Creativity:** sáng tạo và khám phá tổ hợp hương vị.  
B. **Emotion & Memory:** cảm xúc, ký ức, hoàn cảnh thưởng thức.  
C. **Mastery:** thành thạo kỹ năng, hiểu quy luật pha chế.  
D. **Open Discovery:** khám phá mở, sự bất ngờ và chiêm nghiệm.

**[ĐỀ XUẤT]** Sixth Taste nên được thể hiện như **bộ sưu tập khoảnh khắc khám phá** (discoveries) và những câu chuyện riêng, thay vì điểm “giác ngộ” để cạnh tranh.

## 2. Đối tượng người chơi
- Người tò mò về specialty coffee, kể cả chưa từng pha thủ công.
- Home brewer muốn luyện kỹ thuật pour-over và lưu recipe.
- Người thích cozy simulation, game tiến trình nhẹ nhàng.
- Người chơi thích thử thách, chia sẻ thành tích và học qua trải nghiệm.
- **[ĐỀ XUẤT]** Tránh giả định người chơi đã biết TDS, extraction yield, processing method.

## 3. Định vị trải nghiệm
**[CHỐT]** Phong cách **hybrid cozy + chuyên môn**, thân thiện với người mới nhưng đủ chiều sâu để người có kinh nghiệm quan tâm.

Các nguyên tắc:
1. **Play first, learn naturally:** thao tác dễ hiểu trước, giải thích chuyên môn đúng lúc.
2. **Scientific humility:** mô phỏng là mô phỏng, không tự nhận thay thế thiết bị đo hay nếm thật.
3. **Real-world transfer:** người chơi mang được kiến thức từ game ra tách cà phê thực.
4. **Reflection without pressure:** ký ức và cảm nhận cá nhân không bị xếp hạng.
5. **Fairness:** thử thách đánh giá công bằng, không pay-to-win.
6. **Privacy by default:** nhật ký cá nhân thuộc về người dùng.

---

# PHẦN II — GAME SYSTEMS / WORLD DESIGN

## 4. Bản đồ hệ thống tổng thể
**[ĐÃ THẢO LUẬN]** Hệ sinh thái gồm các trụ cột sau:

| Hệ thống | Vai trò | MVP |
|---|---|---|
| **Coffee World** | Không gian game, tiến trình, phục vụ khách; về sau có chuỗi nông trại đến ly cà phê | Chỉ **Coffee Desk** |
| **Coffee Lab** | Thí nghiệm công thức và học kỹ thuật pha | **Có: Pour-over** |
| **Coffee Memory** | Nhật ký cà phê thật, so sánh, khám phá khẩu vị | **Có: bản tối giản** |
| **Coffee Challenges** | Nhiệm vụ và tiến trình chơi | **Có: cơ bản** |
| **Coffee Championship** | Thi đấu cộng đồng, chấm điểm công bằng | **Sau MVP** |
| **Sixth Realm** | Không gian biểu tượng cho khám phá cá nhân | **Sau MVP** |
| **Growth Intelligence & LiveOps** | Phân tích, quản trị, nội dung và tăng trưởng | **Tracking tối thiểu** |

### Hành trình thế giới mở rộng
**Grow → Harvest → Process → Roast → Brew → Serve.**

Đây là **tầm nhìn dài hạn**, không phải cam kết xây đủ trong MVP.

## 5. Core gameplay loop
**[CHỐT — hướng MVP]**

`Select Beans → Grind → Brew → Taste → Serve → Earn → Improve`

Người chơi:
1. Chọn loại hạt / profile.
2. Chọn thông số pha.
3. Thực hiện pha trong giao diện tương tác.
4. Xem kết quả mô phỏng và giải thích vì sao.
5. Nhận feedback, điểm kinh nghiệm/tiến trình hoặc mở thử thách.
6. Điều chỉnh công thức, thử lại.

### Vòng giá trị ngoài đời
`Brew → Taste → Record → Compare → Discover → Improve`

**[CHỐT]** Đây là yếu tố khác biệt cốt lõi: không chỉ “chơi pha cà phê” mà còn giúp người dùng **nhớ lần pha trước, so sánh và cải thiện lần pha sau**.

## 6. Coffee World — thiết kế dài hạn
**[ĐÃ THẢO LUẬN]**
- Bối cảnh cozy 2D: quầy pha, dụng cụ, ánh sáng ấm, chuyển động nhẹ.
- Các khách hàng có sở thích khác nhau: sáng nhẹ, ngọt cân bằng, body dày, hậu vị dài…
- Tiến trình từ pha chế thủ công đến quán cà phê và chuỗi sản xuất.
- Các hệ thống mở rộng: trồng trọt, thu hoạch, sơ chế, rang, tồn kho, kinh tế quán.

**[KHÔNG LÀM TRONG MVP]** Nông trại nhiều mùa vụ, chuỗi cung ứng phức tạp, mô phỏng kinh tế sâu, nhiều địa điểm, multiplayer.

## 7. Coffee Lab — Pour-over Simulator
**[CHỐT]** Pour-over là phương pháp pha trọng tâm ở phiên bản đầu.

### 7.1 Biến số
| Biến | Mô tả | Trạng thái |
|---|---|---|
| Bean profile | Xuất xứ, phương pháp sơ chế, thiên hướng hương vị | MVP |
| Dose (g) | Lượng cà phê | MVP / nguyên mẫu |
| Water (ml/g) | Lượng nước | MVP / nguyên mẫu |
| Brew ratio | Tỷ lệ cà phê:nước | MVP |
| Grind size | Cỡ xay | MVP |
| Water temperature | Nhiệt độ nước | MVP |
| Brew time | Tổng thời gian pha | MVP |
| Pour pattern | Các nhịp rót, bloom, lưu lượng | **Đề xuất nâng cấp** |
| Water chemistry | Khoáng/TDS nước | Sau MVP |
| Roast/processing control | Tự rang, sơ chế | Sau MVP |

### 7.2 Bean archetypes cho prototype
**[ĐÃ CÓ TRONG WEB TEST/PROTOTYPE]**
- **Ethiopia Washed**
- **Colombia Honey**
- **Brazil Natural**

Các profile chỉ là **ví dụ phục vụ game**; không suy diễn rằng mọi hạt cùng xuất xứ/sơ chế đều có hương vị giống nhau.

### 7.3 Hành vi gameplay
**[ĐỀ XUẤT]**
- Thay đổi một biến → thấy kết quả và giải thích tương quan.
- Có preset cho người mới, chế độ chỉnh tay cho người muốn học sâu.
- Feedback diễn đạt như: “Trong mô hình game, lần pha này có xu hướng…” thay vì “Cà phê thực tế chắc chắn…”.
- Có nút **Retry**, **Save to Memory**, **Compare**, **Share**.
- Mỗi màn phải chơi được bằng cảm ứng trên màn hình dọc, không bắt buộc kéo thả chính xác bằng chuột.

### 7.4 Scoring model
**[ĐÃ THẢO LUẬN]** Chấm điểm **deterministic**, cùng đầu vào → cùng kết quả, dễ kiểm thử.

**[ĐỀ XUẤT — KHÔNG PHẢI CÔNG THỨC ĐÃ CHỐT]**:
- Mỗi bean profile có khoảng mục tiêu cho ratio, grind, temperature, time.
- Tính penalty cho độ lệch có chuẩn hóa.
- Tạo `simulated_balance_score` trong thang 0–100.
- Sinh giải thích dựa trên biến số lệch lớn nhất.
- Nếu có seed ngẫu nhiên cho yếu tố thú vị, phải lưu seed để tái hiện kết quả.

**Bất biến quan trọng:** điểm mô phỏng **không phải** kết quả đo extraction yield/TDS hay thước đo chất lượng khách quan. Điểm **player-perceived taste** là dữ liệu khác, không ghi đè bằng điểm máy.

## 8. Taste Lab — hệ cảm quan
**[ĐÃ THẢO LUẬN VÀ THỂ HIỆN TRONG WEB TEST]** Sáu thuộc tính cảm quan dùng để người chơi ghi nhận cảm nhận:
1. **Aroma** — Hương thơm
2. **Acidity** — Độ chua
3. **Sweetness** — Độ ngọt
4. **Bitterness** — Độ đắng
5. **Body** — Thể chất / độ dày miệng
6. **Aftertaste** — Hậu vị

**[ĐÃ THẢO LUẬN]** Thang đánh giá người dùng: **1–5** mỗi thuộc tính.

> **Quan trọng:** Sáu *thuộc tính mô tả cảm quan* ở đây **không đồng nghĩa** với “Sixth Taste” mang tính triết lý. Hai khái niệm phải tách biệt trong nội dung và UI.

**[ĐỀ XUẤT]** Trình bày radar chart hoặc thanh điểm đơn giản, nhưng tránh suy ra “độ ngon” bằng cách cộng thẳng sáu thuộc tính: chua/đắng cao không mặc nhiên là tốt hay xấu.

## 9. Coffee Memory — nhật ký thực tế
**[CHỐT]** Coffee Memory phải giúp người chơi lưu lại, **xem lại và so sánh** các lần pha trước, gợi lại trải nghiệm và rút ra bài học.

### 9.1 Trường dữ liệu cốt lõi
- ID, thời điểm pha, tên công thức.
- Bean: tên, origin, variety, processing, roast (các trường nâng cao tùy chọn).
- Dose, water, ratio, grind, temperature, brew time.
- Thiết bị/giấy lọc (tùy chọn).
- Sáu thuộc tính cảm quan 1–5.
- Tasting notes: hương vị, cảm nhận thực tế.
- **What to change next time**: dự định cải thiện.
- `simulated_score` nếu xuất phát từ game; không trộn với đánh giá thật.
- Dữ liệu mở rộng tùy chọn: TDS đo thực tế, ảnh, bối cảnh, tâm trạng.

### 9.2 Các thao tác bắt buộc theo lộ trình
**MVP:** Create → View History → Compare → Export → Delete.  
**[ĐỀ XUẤT]** Edit, filter/search, duplicate recipe, trend view sau khi ổn định.

### 9.3 Giá trị học tập
**[ĐỀ XUẤT]** So sánh A/B hai phiên:
- Cái gì thay đổi?
- Kết quả cảm nhận khác nhau thế nào?
- Điều gì chưa thể kết luận vì đã thay đổi nhiều biến cùng lúc?
- Lần thử tiếp theo nên đổi **một biến** nào?

### 9.4 Coffee DNA
**[ĐÃ THẢO LUẬN]** Hồ sơ khẩu vị cá nhân được tích lũy qua nhiều lần pha/nếm, dùng để tự hiểu mình; không biến thành nhãn khoa học hoặc chẩn đoán.

### 9.5 Quyền riêng tư
- **[CHỐT]** Guest-first; dữ liệu lưu trên máy khi chưa đăng nhập.
- Chỉ yêu cầu account khi cần đồng bộ.
- Dữ liệu cảm xúc/sức khỏe nếu có: **tự nguyện, riêng tư, không dùng cho quảng cáo**.
- Có xuất/xóa dữ liệu.
- **Không lưu dữ liệu nhạy cảm không cần thiết**.
- LocalStorage có rủi ro mất dữ liệu khi xóa trình duyệt; phải nói rõ cho người dùng.

## 10. Coffee Challenges
**[CHỐT — MVP tối giản]**
- Các nhiệm vụ nhỏ: hoàn thành lần pha đầu, thử 2 bean profile, cải thiện công thức, lưu nhật ký.
- Có tiến trình và feedback rõ.
- Mục tiêu dạy người chơi **thử nghiệm có chủ đích**, không chỉ tối ưu điểm số.

**[ĐỀ XUẤT]** Ba nhóm:
- **Learn:** hoàn thành hướng dẫn và hiểu thuật ngữ.
- **Experiment:** thay đổi một biến, so sánh kết quả.
- **Master:** đạt mục tiêu mô phỏng với ràng buộc cụ thể.

**Không khóa kiến thức cơ bản sau paywall.**

## 11. Coffee Championship — tầm nhìn sau MVP
**[ĐÃ THẢO LUẬN]**
- Các hạng mục: brewing, roasting, processing, cupping… khi hệ thống tương ứng đủ trưởng thành.
- Giám khảo chấm trên **đầu vào và quy tắc cố định, tái hiện được**, ưu tiên server-side cho cuộc thi có giá trị.
- Công bố tiêu chí và phiên bản scoring; cùng bài thi phải có điều kiện công bằng.
- Có thể phát triển uy tín recipe bằng cộng đồng thực sự áp dụng/đánh giá, không chỉ bằng lượt like.
- Vòng loại miễn phí và chống pay-to-win.
- **Chưa triển khai thi đấu trả phí/giải thưởng giá trị** trước khi rà soát pháp lý tại thị trường mục tiêu.

## 12. Sixth Realm — trải nghiệm biểu tượng
**[ĐÃ THẢO LUẬN]**
- Không gian khám phá mang tính kể chuyện, ký ức, cảm xúc và ý nghĩa cá nhân.
- Mở ra nhờ quá trình trải nghiệm và khám phá, không phải mua điểm “tỉnh thức”.
- Không khẳng định cảm xúc, tâm thức hoặc năng lượng siêu hình là kết quả khoa học đo được.
- Không tạo bảng xếp hạng “giác ngộ”.
- **Sau MVP**; ưu tiên chứng minh gameplay và Coffee Memory trước.

---

# PHẦN III — PLAYER EXPERIENCE / UX

## 13. Nền tảng và thiết kế tương tác
- **[CHỐT MỚI NHẤT]** Web responsive **PC + mobile browser**, thử nghiệm chủ yếu trên **iPad M5**.
- **[CHỐT]** Native iOS/Android chỉ cân nhắc **sau** khi Web MVP được kiểm chứng.
- **[CHỐT]** English + Vietnamese ngay từ đầu.
- **[CHỐT]** Không bắt người chơi đăng ký trước khi thử.
- **[ĐÃ THẢO LUẬN]** Trải nghiệm **portrait-first** từ định hướng mobile ban đầu; desktop tận dụng màn hình ngang, không ép chung một bố cục.

### 13.1 Screen map
| Route / màn | Mục đích | MVP |
|---|---|---|
| `/` — Landing | Giới thiệu, Play CTA | Có |
| `/play` — Coffee Desk | Chọn bean, điều chỉnh, brew | Có |
| `/lab` — Taste Lab | Phân tích/giải thích kết quả | Có hoặc gộp vào Play |
| `/memory` — Coffee Memory | Lưu, xem, so sánh | Có |
| `/challenges` | Nhiệm vụ | Có |
| `/profile` | Hồ sơ và đồng bộ | Tối giản / sau |
| `/admin` | Dashboard quản trị | Sau khi có backend |

Đây là sơ đồ route **đã đề xuất**, chưa phải hợp đồng API/định tuyến cố định.

### 13.2 First-time user experience
**[ĐỀ XUẤT]**
1. Mở trang → nút **Start Brewing**.
2. Chọn một bean với mô tả dễ hiểu.
3. Dùng preset gợi ý.
4. Tinh chỉnh tối đa 1–2 biến.
5. Brew → Taste → Result.
6. Nhận một lời khuyên rõ ràng.
7. Tùy chọn Save / Retry / Share.
8. Giới thiệu Coffee Memory thực tế.

### 13.3 Responsive và accessibility
- Touch target đủ lớn; không phụ thuộc hover.
- Độ tương phản dễ đọc; font không quá nhỏ.
- Không dùng màu sắc làm tín hiệu duy nhất.
- Tránh animation nặng gây nóng máy/hao pin.
- Trên mobile, thông số xếp dọc, nút hành động cố định hoặc dễ chạm.
- Trên desktop, có thể bố trí bàn pha và panel điều khiển song song.

---

# PHẦN IV — PROGRESSION, ECONOMY, SOCIAL

## 14. Progression
**[ĐỀ XUẤT]**
- **Knowledge unlocks:** mở bài học/công cụ qua trải nghiệm, không paywall nội dung căn bản.
- **Recipe mastery:** theo dõi số lần thử và chất lượng giải thích, không chỉ điểm.
- **Personal discoveries:** bộ sưu tập những kết luận người chơi tự ghi nhận.
- **Cosmetic rewards:** skin quầy pha, cốc, background… chỉ cân nhắc sau khi có retention.

## 15. Economy
**[ĐÃ THẢO LUẬN]** Game dài hạn có thể có tiền tệ ảo và quản lý quán, nhưng **chưa chốt công thức earn/spend, sink/source, giá vật phẩm, bảng cân bằng**.

**[ĐỀ XUẤT CHO MVP]** Không xây kinh tế phức tạp. Dùng điểm tiến trình và unlock nhẹ, tránh tiền ảo nếu không phục vụ trải nghiệm.

## 16. Social & viral loop
**[ĐÃ THẢO LUẬN]**
- Kết quả pha có thể chia sẻ dưới dạng scorecard.
- Mẫu thông điệp: “My Brewing Score: 87/100. Can you beat my recipe?”
- Deep link thử thách, ví dụ `/play?challenge=brew01&ref=ABC123`.
- Không tiết lộ tasting notes cá nhân hoặc dữ liệu riêng tư khi chia sẻ nếu chưa có đồng ý.
- Tracking referral ẩn danh ở mức tối thiểu.

## 17. Monetization
**[ĐÃ THẢO LUẬN]** Giả thuyết ban đầu: **Founder’s Pack ~US$4.99 mua một lần**, chỉ mở sau khi đã kiểm chứng nhu cầu.

**[CHỐT — giới hạn]**
- Không vội làm subscription.
- Không làm pay-to-win.
- Coffee Memory cơ bản nên miễn phí.
- Không mua quảng cáo khi chưa có MVP chơi được.
- Không triển khai payment trong prototype.

---

# PHẦN V — MVP BUILD SPEC / ENGINEERING

## 18. Scope cứng của Web MVP
### Phải có
- Web mở được trên Safari iPad, mobile và PC.
- Chọn bean, chỉnh các thông số pour-over, chạy mô phỏng, xem feedback.
- Kết quả đủ rõ để người chơi muốn thử lại.
- Coffee Memory tối giản: lưu, xem, so sánh, xuất/xóa.
- EN/VI.
- Guest play, không cần account để thử.
- Theo dõi sự kiện cơ bản khi có backend.
- Có URL web thử nghiệm công khai hoặc giới hạn người thử.

### Chưa làm
- Full coffee farming, roasting, processing economy.
- Multiplayer và Championship production.
- AI chatbot chạy liên tục.
- Sixth Realm nhiều tầng.
- Native app và app store.
- Backend phức tạp, hệ thống microservices, marketing automation lớn.

## 19. Prototype v0.1 — hiện trạng được ghi nhận
**[ĐÃ BÀN GIAO]** Gói `The_Coffee_Six_Sense_Prototype_v0.1.zip`, gồm:
- `index.html`
- `styles.css`
- `app.js`
- `README.md`

**[ĐÃ ĐƯỢC MÔ TẢ]** Giao diện cozy, ba loại bean, điều chỉnh công thức, chấm điểm mô phỏng, Coffee Memory lưu localStorage, JSON export, EN/VI, responsive.

**[ĐÃ CÓ THÊM WEB TEST TRONG LỊCH SỬ DỰ ÁN]** Một bản `TheCoffeeSixSense-WebTest.html` có Coffee Desk, các biến dose/water/temp/grind, sáu thang cảm quan, ghi chú và đề xuất lần pha sau.

**[CHƯA XÁC MINH]** Bản ZIP và WebTest có cùng một codebase hay không; chưa xác minh kiểm thử trên iPad thực tế, GitHub push hoặc deploy. Không gọi v0.1 là production-ready.

## 20. Kiến trúc kỹ thuật
**[ĐÃ THẢO LUẬN, CHƯA CHỐT CUỐI]**
- Web frontend: **React + TypeScript**; cân nhắc **Phaser** nếu cần minigame 2D thực sự.
- Backend: **Supabase Free** (Postgres/Auth/Edge Functions) khi có nhu cầu sync/analytics.
- Prototype có thể dùng **HTML/CSS/JS tĩnh + localStorage** để giảm chi phí và độ phức tạp.
- Hosting: **Cloudflare Pages** hoặc phương án static hosting tương đương.
- Source control: **GitHub**.

**[ĐỀ XUẤT]** Không chuyển sang Phaser chỉ để vẽ giao diện form/slider; chỉ dùng khi interaction thực sự cần game loop, canvas, sprite hoặc animation chuyên biệt.

### 20.1 Dữ liệu tối thiểu
**[ĐỀ XUẤT]**
```text
BeanProfile(id, name, origin, process, flavor_tags, model_parameters)
BrewSession(id, anonymous_user_id?, bean_id, dose_g, water_g,
            grind, temp_c, time_s, simulated_score, model_version,
            created_at)
TasteEntry(id, brew_session_id?, aroma, acidity, sweetness,
           bitterness, body, aftertaste, notes, next_change, created_at)
Challenge(id, title, rule_version, rule_json, active)
ChallengeAttempt(id, challenge_id, brew_session_id, result, created_at)
```
- Nếu là local-only, cấu trúc trên chỉ là schema logic, **không** hàm ý đã có database.
- Với cloud, cần auth/authorization và row-level security trước khi lưu dữ liệu cá nhân.

### 20.2 Analytics event map
**[ĐÃ THẢO LUẬN]**
`landing_viewed`, `play_clicked`, `game_started`, `tutorial_completed`,
`brew_started`, `brew_completed`, `taste_submitted`, `memory_saved`,
`memory_compared`, `challenge_completed`, `result_shared`,
`referral_opened`, `return_visit`, `feedback_submitted`.

**[ĐỀ XUẤT]** Event envelope:
`event_id`, `anonymous_player_id`, `session_id`, `timestamp`, `app_version`,
`platform`, `locale`, `source`, `campaign_id`.

**Quy tắc:** không gửi nội dung ghi chú cá nhân hoặc dữ liệu sức khỏe/cảm xúc vào analytics mặc định.

### 20.3 Chất lượng kỹ thuật
- Type-check, lint, build, test mô hình điểm số.
- Test determinism: cùng đầu vào → cùng đầu ra.
- Test ranh giới slider, giá trị âm/rỗng, ngôn ngữ EN/VI.
- Test lưu, reload, export, delete dữ liệu.
- Test mobile portrait/tablet/desktop.
- Version model scoring để không làm hỏng khả năng so sánh lịch sử.
- Không lưu token/API key trong frontend hoặc repository.

---

# PHẦN VI — VALIDATION & GO-TO-MARKET

## 21. Phân kỳ phát triển
| Giai đoạn | Sản phẩm bàn giao | Tiêu chí nghiệm thu |
|---|---|---|
| **M1 — Playable Prototype** | Coffee Desk, Brew, Result, responsive, EN/VI | Chơi được end-to-end trên Safari iPad và desktop |
| **M2 — Coffee Memory** | Log thực tế, history, compare, export/delete | Lưu/reload và so sánh hai lần pha chính xác |
| **M3 — Backend & Analytics** | Sync tùy chọn, tracking, admin tối thiểu | Quyền truy cập dữ liệu đúng; event đo được |
| **M4 — Private Alpha** | Web URL cho 20–30 người | Phản hồi định tính, lỗi chính được xử lý |
| **M5 — Growth Experiment** | Share/referral và community beta | Đo retention và activation trước khi mở rộng |

**[ĐÃ THẢO LUẬN]** Ước lượng 6–8 tuần cho MVP trong điều kiện lý tưởng, **không phải cam kết tiến độ**; phụ thuộc khả năng công cụ, phạm vi và QA.

## 22. Thử nghiệm người dùng
**[ĐÃ THẢO LUẬN]**
- **Wave 1:** 20–30 private alpha, ưu tiên quan sát người chơi và phỏng vấn.
- **Wave 2:** 100–200 community beta.
- **Wave 3:** 500–1.000 public beta nếu chỉ số giữ chân có tín hiệu tốt.
- Thực hiện khoảng **10–15 cuộc phỏng vấn** để hiểu nguyên nhân bỏ cuộc, độ thú vị, mức hữu ích của Coffee Memory.

### KPI giả thuyết, chưa phải benchmark
- Landing → Play ≥25%.
- Tutorial completion ≥70%.
- First brew completion ≥60%.
- D1 retention ≥25%.
- D7 retention ≥10%.
- Share rate ≥5%.
- Positive qualitative feedback ≥70%.

**Cảnh báo:** Mẫu alpha nhỏ, chưa đủ để kết luận thống kê chắc chắn; dùng KPI như tín hiệu quyết định thử tiếp/sửa lại, không phải chứng minh thành công.

## 23. Marketing và ngân sách
**[CHỐT]**
- Trần **US$300** dành cho AI coding/công cụ bổ sung.
- Ngân sách **US$3.000 marketing riêng biệt**.
- **Không chi quảng cáo trước khi có MVP**; chưa cần domain, social/ad accounts riêng trước thời điểm thích hợp.
- Organic-first, không tiêu hết marketing budget cùng lúc.

**[ĐÃ THẢO LUẬN]** Thử nghiệm sau MVP: private alpha $0, community beta organic hoặc chi rất ít, rồi paid experiment nhỏ (ví dụ tổng **$300** đầu tiên của ngân sách marketing); giữ phần còn lại cho vòng đã có tín hiệu.

### Creative themes
- “Can You Brew Better Coffee?”
- “Why Does Your Coffee Taste Different?”
- “Beat the Coffee Judge.”

### Đo hiệu quả
Ưu tiên **Cost per Activated Player**, first brew completion, D1/D7 retention, Coffee Memory use và referral conversion; không tối ưu chỉ theo lượt xem.

---

# PHẦN VII — FOUNDER OPERATING MODEL & DELIVERY

## 24. Vibe coding 100% qua ChatGPT
**[CHỐT]**
- Founder dùng **iPad M5**.
- Founder **không muốn copy-paste code/prompt qua lại** giữa ChatGPT và Replit.
- ChatGPT là đầu mối điều phối: đặc tả → code → test → gói bàn giao → hướng dẫn triển khai → sửa lỗi.
- Founder phụ trách định hướng, phê duyệt chi phí/quyền truy cập, kiểm thử trải nghiệm.
- **Không mua Replit Agent khi chưa thực sự cần**.
- Không coi ChatGPT Work là điều kiện bắt buộc; founder không thấy Work trên iPad tại thời điểm trao đổi.

**[GIỚI HẠN THỰC TẾ]** Kết nối một ứng dụng trong Settings không đồng nghĩa phiên chat có quyền gọi API đọc/ghi. Phải kiểm tra công cụ thực tế trước khi tuyên bố đã push hoặc deploy.

## 25. Repository và phát hành
**[CHỐT]** Repository chính thức:
`https://github.com/tahulk79/TheCoffeeSixSense.git`

Repository cũ `tahulk79/C6S` **không còn dùng**.

**[ĐÃ XÁC NHẬN BỞI FOUNDER]** GitHub đã được kết nối với ChatGPT qua Safari sau khi lỗi trong app.

**[CHƯA XÁC MINH]** Quyền đọc/ghi qua connector trong phiên hiện tại; branch mặc định; các file đã có trên repo; commit/push; hosting/deployment.

### Release checklist
- [ ] Kiểm tra nội dung repo mới và branch mặc định.
- [ ] Kiểm tra thực tế khả năng đọc/ghi GitHub.
- [ ] Đối chiếu ZIP v0.1, WebTest và repo để chọn source chuẩn.
- [ ] Chạy build/test và kiểm tra trực quan.
- [ ] Commit code có README, changelog, license decision.
- [ ] Deploy lên static hosting; mở link trên Safari iPad M5.
- [ ] Ghi nhận lỗi, sửa v0.2, phát hành lại.
- [ ] Chỉ sau khi playable MVP ổn định mới mở beta/marketing.

## 26. Rủi ro cần quản trị
1. **Scope creep:** xây cả nông trại, giải đấu, Sixth Realm trước khi core brew loop hấp dẫn.
2. **Giả khoa học:** người chơi hiểu điểm mô phỏng là chất lượng cà phê thật.
3. **UX quá kỹ thuật:** người mới bỏ cuộc trước khi pha xong.
4. **Dữ liệu dễ mất:** localStorage không được backup hoặc đồng bộ.
5. **Chi phí AI:** vòng lặp agent sửa đi sửa lại không có giới hạn.
6. **Phụ thuộc nền tảng:** code nằm trong công cụ AI, không có bản lưu độc lập.
7. **Không đo được retention:** chạy marketing khi chưa biết ai quay lại.
8. **Bảo mật/quyền riêng tư:** log cảm xúc/ghi chú bị đưa vào analytics.
9. **Công bằng thi đấu:** chấm điểm thiếu tái hiện, pay-to-win hoặc vấn đề pháp lý.
10. **Nhầm trạng thái triển khai:** kết nối plugin thành công nhưng chưa có quyền ghi hoặc website chạy được.

---

# PHẦN VIII — BACKLOG CÓ THỂ ĐƯA VÀO DEVELOPMENT

## 27. User stories ưu tiên
| ID | User story | Priority | Acceptance criteria tóm tắt |
|---|---|---|---|
| C6S-001 | Là người mới, tôi chơi thử mà không đăng nhập | P0 | Từ landing đến brew không cần tài khoản |
| C6S-002 | Tôi chọn được bean profile | P0 | Có tối thiểu 3 lựa chọn; mô tả EN/VI |
| C6S-003 | Tôi chỉnh công thức pour-over | P0 | Input có giới hạn hợp lý, dùng được trên touch |
| C6S-004 | Tôi nhận điểm và giải thích mô phỏng | P0 | Cùng input cùng output; có disclaimer |
| C6S-005 | Tôi thử lại với một thay đổi | P0 | Giữ công thức trước để chỉnh tiếp |
| C6S-006 | Tôi lưu lần pha vào Coffee Memory | P0 | Persist qua reload trong cùng browser |
| C6S-007 | Tôi nhập 6 thuộc tính cảm quan thực | P0 | 1–5, độc lập điểm mô phỏng |
| C6S-008 | Tôi xem lịch sử và so sánh hai lần pha | P0 | Hiển thị biến thay đổi và ghi chú |
| C6S-009 | Tôi xuất/xóa dữ liệu cá nhân | P0 | JSON export và delete rõ ràng |
| C6S-010 | Tôi chuyển EN/VI | P0 | Không mất dữ liệu khi đổi ngôn ngữ |
| C6S-011 | Tôi hoàn thành thử thách đầu tiên | P1 | Tiến trình và điều kiện rõ ràng |
| C6S-012 | Tôi chia sẻ scorecard | P1 | Không tự lộ dữ liệu riêng tư |
| C6S-013 | Tôi đồng bộ dữ liệu giữa thiết bị | P2 | Account tùy chọn, auth an toàn |
| C6S-014 | Tôi dự giải đấu | P3 | Chỉ sau khi scoring, pháp lý và fairness đủ chuẩn |
| C6S-015 | Tôi khám phá Sixth Realm | P3 | Không xếp hạng tâm thức |

## 28. Các quyết định còn mở
- Mô hình điểm số cụ thể, trọng số, phạm vi tham số và cách kiểm định bằng chuyên gia cà phê.
- Gameplay tương tác rót nước: slider/form trước hay minigame thời gian thực.
- Stack cuối cùng: giữ HTML/CSS/JS hay chuyển React/TypeScript/Phaser.
- Schema dữ liệu cloud, auth provider, chính sách backup.
- Art direction chi tiết, assets, âm thanh và accessibility testing.
- Quy tắc XP/challenges và economy.
- Chính sách Founder’s Pack, nội dung trả phí và thời điểm mở bán.
- Mức độ public/private của nhật ký và dữ liệu chia sẻ.
- Hosting/domain cuối cùng, cách triển khai tự động từ GitHub.
- Cách vận hành analytics phù hợp luật bảo vệ dữ liệu theo thị trường.

## 29. Definition of Done — Web MVP
Một tính năng chỉ được coi là **Done** khi:
1. Có source code được lưu phiên bản.
2. Có thể chạy lại và test được.
3. Dùng được bằng cảm ứng trên iPad M5 và màn hình mobile phổ biến.
4. Có nội dung EN/VI tương ứng.
5. Không làm hỏng Coffee Memory đã lưu.
6. Không lộ thông tin riêng tư hay khóa bí mật.
7. Có mô tả giới hạn của điểm mô phỏng.
8. Có link build thử nghiệm và người thật đã kiểm tra.

---

# PHỤ LỤC — CÂU LỆNH BÀN GIAO CHO PHIÊN CHAT SAU

> Hãy tiếp tục phát triển The Coffee Six Sense dựa trên `TheCoffeeSixSense_Game_Design_Master_GDD.md`. Repository chính thức là `tahulk79/TheCoffeeSixSense`. Ưu tiên web responsive, EN/VI, iPad M5, ChatGPT-first, không copy-paste code qua các AI, ngân sách AI bổ sung tối đa $300 và không marketing trước khi có playable MVP. Trước khi triển khai, kiểm tra repo và trạng thái code thực tế; không tự nhận đã push/deploy nếu chưa kiểm chứng. Bắt đầu từ core Pour-over Brew Simulator, Taste Lab 6 thuộc tính, Coffee Memory thực tế có so sánh và feedback cải thiện. Không xây scope dài hạn trước khi core loop hoạt động tốt.

**Kết luận:** Đây là bản **tổng hợp các thiết kế game đã cùng làm rõ**, được phân tầng thành phần đã chốt, phần từng thảo luận và đặc tả đề xuất để lập trình. Nó **không thay thế** mã nguồn, tài sản đồ họa hay những bản GDD chi tiết chưa được tìm thấy trong ngữ cảnh hiện tại.
