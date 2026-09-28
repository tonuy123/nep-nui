# P2 — Design system, cinematic hero và bố cục public

Ngày lập: 2026-09-27, Asia/Saigon. Owner: Codex. Decision maker: Paw.

## 1. Trạng thái và cách sử dụng

- Plan: Paw đã duyệt ngày 2026-09-27 qua chat: "oke duyệt mày hãy làm đi".
- P1: `VERIFIED`, Paw đã đóng ở Entry 003 trong [master context](../../AI_PROJECT_CONTROL.md).
- P2 hiện tại: `VERIFIED` cho bản local 2.5D, Paw chấp thuận ngày 2026-09-28 ở Entry 008. Shared typography repair và final regression ở Entry 007 bổ sung snapshot Entry 006. Đây là Paw acceptance, chưa có final independent review/release approval. True 3D production được hoãn và chỉ mở bằng scope/approval riêng.
- Đọc toàn bộ master context trước; đọc file này khi plan, implement hoặc review P2. Master giữ authority, đề thi, stack, roadmap và lịch sử; file này giữ chi tiết P2.
- Đây là tài liệu quyết định và theo dõi dự án. Prompt giao việc cho DeepSeek/AI được gửi trong chat, không lưu vào tài liệu này.
- Lệnh Paw mới nhất thắng khi có mâu thuẫn. Chỉ thay đổi status khi có hành động/evidence tương ứng; lập plan không đóng các checkbox implementation.

## 2. Kết quả P2 cần bàn giao

Một homepage có cảnh núi/ruộng bậc thang xuất hiện theo lớp, tiêu đề ở giữa, hai CTA rõ ràng, nội dung bên dưới theo phong cách editorial. Sáu tab public dùng chung design system và có bố cục hoàn chỉnh để P6 gắn dữ liệu thật.

P2 không thay đổi schema, API nghiệp vụ, auth/session, admin CRUD, map engine, booking hoặc payment. Auth/account/admin tiếp tục là shell đã có; token dùng chung nếu sửa phải regression các route này. Nội dung địa danh chưa xác minh tiếp tục được ghi là mẫu/chưa xác minh; không tạo tên, giá, tọa độ hoặc lịch sử giả.

Kiến trúc bản đã bàn giao: **2.5D là đường triển khai chính**. Paw đã chấp thuận bản local này và đóng phạm vi P2 hiện tại ở Entry 008. True 3D là technical spike đã đo lower bound; production scene được hoãn, không suy acceptance 2.5D thành go/no-go vĩnh viễn. Các giới hạn nguồn ảnh/thiết bị/field vitals vẫn phải xử lý trước release.

## 3. Baseline đã kiểm tra trên disk

| Hạng mục | Baseline ngày 2026-09-27 |
|---|---|
| Workspace | `D:\webdulich`, npm workspaces; 103 file không tính generated/dependencies trước thay đổi tài liệu |
| Web | `apps/web`, Next.js 16.3.6 / React 19.3.0 / TypeScript strict / Tailwind 4 |
| Home | `apps/web/src/app/(public)/page.tsx`, Server Component ghép hero và các feature placeholders |
| Public layout | `apps/web/src/app/(public)/layout.tsx`, shared header/main/footer |
| Hero trước P2 | `apps/web/src/components/placeholders/cinematic-hero.tsx`, landscape SVG placeholder; snapshot trước photo animation. Hero đang dùng sau P2 nằm trong `features/cinematic/` |
| Shared UI đã đọc cho plan | `Section`, `PageHero`, `CtaLink`; ưu tiên mở rộng consumer thật |
| Navigation | Sáu tab theo master §5.1; giữ route và active state |
| Motion dependency | Chưa có Motion, GSAP, Three.js, React Three Fiber hoặc Drei trong web package |
| Graph evidence | Tier 2, project `D-webdulich`, generation `2026-09-27T09:29:26Z`; homepage trace 13 callees, search 13 results không còn trang tiếp |
| Coverage limitation | Các path liên quan báo `metadata_changed`; globals.css partial dòng 3. Đã đọc source/config trực tiếp thay vì dựa vào graph stale |

Các version trên là snapshot, không phải lệnh upgrade. Trước implementation phải refresh source, hash, ownership và scripts. Workspace hiện không có Git; bảo toàn thay đổi bằng baseline hash, không tự init/commit.

## 4. Art direction và bố cục

### 4.1 Hướng visual

- Cảm giác: cảnh quan vùng núi, ánh sáng vàng sớm/chiều, yên tĩnh, có chiều sâu; dùng ảnh được Paw chọn làm mood reference.
- Giữ palette forest/earth/gold/ivory/ink của master §6.1. Typography tối đa hai families, hỗ trợ dấu tiếng Việt; kiểm license trước khi thêm font asset.
- Tiêu đề hero đặt giữa trên vùng tương phản tốt; gradient cục bộ đủ đọc, giữ tia nắng và đường ruộng. Typography, khoảng trắng và ảnh tạo điểm nhấn.
- Header sticky, CTA rõ, menu mobile giữ khả năng cuộn trên màn hình thấp. 1024px phải kiểm text/nav wrap và chuyển breakpoint theo chiều rộng nội dung thực tế.
- Không có intro overlay toàn màn hình chặn thao tác hoặc nút Enter bắt buộc. Chuyển tab không chạy lại mountain intro.

### 4.2 Home composition

1. Header → cinematic hero → scroll cue.
2. Điểm đến nổi bật: grid 1/2/3 cột theo viewport, tỷ lệ ảnh cố định, title/meta/CTA nhất quán.
3. Trải nghiệm: nhóm chủ đề và một editorial block có điểm nhấn.
4. Bản đồ teaser: minh họa tĩnh + danh sách/link; map tương tác thuộc P6.
5. Hành trình gợi ý: ba cards với slot thời lượng/độ khó/chi phí; dữ kiện mẫu được đánh dấu.
6. Câu chuyện cộng đồng: một lead story và secondary cards, slot nguồn/tác giả.
7. Du lịch có trách nhiệm → final CTA → footer.

Giữ thứ tự section P1 làm baseline. Không lặp lại full cinematic animation ở các section bên dưới.

### 4.3 Sáu tab public

| Route | Bố cục P2 | Interaction boundary |
|---|---|---|
| `/kham-pha` | Hero gọn, filter bar, grid destination, empty/loading/error presentation | Filter là placeholder được giải thích; search/API thuộc P6 |
| `/trai-nghiem` | Hero gọn, category chips, experience grid, editorial feature | Chưa có filter giả hoặc dữ liệu chưa xác minh |
| `/hanh-trinh` | Hero gọn, duration/budget/difficulty slots, itinerary cards, planner panel | Không lưu itinerary hay submit tư vấn trước phase tương ứng |
| `/ban-do` | Hero gọn, POI filters, map frame/list hai cột desktop và xếp dọc mobile | Giữ list fallback; chưa có map runtime/tile request |
| `/chuyen-ban-dia` | Lead story lớn, secondary cards, author/source slots | Không invent câu chuyện văn hóa hoặc attribution |
| `/cam-nang` | Topic cards, phần nội dung thực dụng dạng mẫu, FAQ presentation | Chưa xuất bản hướng dẫn đường/chi phí/an toàn chưa kiểm chứng |

Image slots chưa có asset đủ quyền dùng giữ visual placeholder có chủ đích. Chỉ ảnh hero đã được chọn; không ngầm giả định có đủ bộ ảnh cho mọi card.

## 5. Source ảnh và quy trình asset

### 5.1 Ảnh ứng viên

| Thuộc tính | Giá trị đã kiểm tra |
|---|---|
| Link Paw cung cấp | `https://pin.it/3BBb3RVHq` |
| Pin sạch | `https://www.pinterest.com/pin/224265256438235287/` |
| JPEG bản lớn | `https://i.pinimg.com/originals/95/7c/f8/957cf873bd8256dbb1359fdb246e1e65.jpg` |
| Local candidate | `C:\Users\DELL\AppData\Local\Temp\p2-image-source-AmP41C\originals.jpg` |
| Kích thước/dung lượng | 2048 × 1365, JPEG, 267143 bytes |
| SHA-256 | `e87dec1261669441ec56c51cd4379fdfaa9c8b337ea63db2d12401309823c452` |
| So sánh với attachment | Attachment PNG 735 × 490; bản lớn đã được xem và xác nhận cùng cảnh |
| Attribution/license | Chưa xác minh tác giả/chủ quyền hoặc giấy phép dùng/biến đổi. Chữ ký đang hiện trong ảnh được giữ nguyên |
| Địa điểm chụp | Chưa xác minh; không suy ra từ title/tag trên Pinterest |

Đường dẫn temp không bền vững. Khi mở P2 phải kiểm tồn tại/hash; nếu mất thì tải lại từ source và đối chiếu. Master source được giữ byte-identical trong `assets/hero/source/`, ngoài public, rồi mới tạo derivatives. Ghi provenance/license/checksum; không hotlink Pinterest khi deploy.

License/địa điểm là decision còn mở: có thể chuẩn bị kỹ thuật bằng scene placeholder; chỉ sử dụng ảnh ứng viên đúng phạm vi quyền đã xác minh. Bản gửi cuộc thi/deploy phải có evidence quyền sử dụng và bối cảnh địa danh phù hợp; ghi nguồn riêng nó không chứng minh có quyền dùng. Có phương án thay asset đủ quyền mà không viết lại engine.

### 5.2 Layer proposal — số lượng cuối do spike quyết định

| Layer dự kiến | Vai trò |
|---|---|
| Poster hoàn chỉnh | Static final state, no-JS và lỗi enhancement |
| Sky/background plate | Bầu trời và nền đã chuẩn bị cho lúc mountain layers chưa xuất hiện |
| Far mountains | Dãy núi xa, chuyển động nhỏ nhất |
| Middle mountains | Dãy núi giữa và thung lũng |
| Near mountains | Sườn núi gần |
| Foreground terraces | Ruộng/cây tiền cảnh, chuyển động lớn hơn nhưng có giới hạn |
| Optional haze | Chỉ khi tách sương đủ sạch; có thể bỏ nếu lộ mask/banding |
| Content HTML | H1, mô tả, CTA và controls; không nằm trong ảnh |

Không ép một ảnh phẳng thành nhiều layer nếu mép không sạch. Dùng 4–6 lớp ảnh thực sự có ích; gộp layer để giữ chất lượng và memory nếu cần.

### 5.3 Pipeline và gate chất lượng

1. Preserve source/checksum/provenance. Công cụ xử lý ảnh được chọn theo khả năng giữ chi tiết nguồn, alpha và hệ tọa độ; bước ảnh chưa chạy trong lượt lập plan.
2. Lập mask ở hệ tọa độ master, tách các vùng thực sự thấy trong ảnh. Nội dung bị che không thể phục hồi chính xác từ một ảnh; phần bù nền phải được ghi là derivative/synthetic nếu có.
3. Tạo background plate phù hợp để núi thực sự lộ lần lượt. Không dùng nguyên poster có đầy đủ núi làm nền luôn hiện rồi tuyên bố các ngọn núi vừa mọc lên.
4. Mọi master layer dùng cùng canvas/alignment; nếu trim transparent bounds phải ghi offset và source canvas trong manifest. Tất cả layer dùng chung phép fit/crop/transform của scene, không mỗi ảnh một `object-position`.
5. Pipeline đã chọn trong prototype: native polygon silhouettes cùng `poster.currentSrc`, thay cho export RGBA lặp lại. Masks không nén lại terrain; Next Image tạo derivatives có quality/sizes rõ. Sau visual red, dùng silhouette chồng xuống đáy và displacement nhỏ, không dùng các dải disjoint lộ mép thẳng. Xem `assets/hero/README.md` và manifest; mỗi scene dùng đúng một responsive photo URL cho mọi silhouette.
6. Poster và bộ layer có variant desktop/mobile cùng crop đã kiểm. Giới hạn chiều cao hero mobile theo content/crop; không ép full-height cover làm phóng ảnh vượt độ nét nguồn.
7. Check composite final so với reference ở 100%/200%; screenshots tại midpoint/end animation phải không có khe hở, double edge, halo, banding hoặc background sai. Báo sai khác do mask/inpainting/compression riêng; không tự hứa reconstruction chính xác một pixel nếu chưa đo.
8. Manifest ghi source hash, layer id/order, dimensions, crop/offset, alpha, file bytes, variant, origin của phần chỉnh và attribution. Đổi source không đổi timeline/controller.

2048px là giới hạn nguồn đã có, không có cam kết sắc nét 4K/retina hoặc zoom sâu. Xét cả DPR, chiều cao cover và độ zoom khi chọn variant. `quality=100` không bổ sung chi tiết thật. Với Next Image cần `sizes` đúng và quality allowlist tương ứng; alpha layers đã export phải kiểm việc optimizer đổi format/quality, hoặc phục vụ derivative đã chuẩn bị as-is. Không tắt optimizer toàn website để giải một hero.

## 6. Kiến trúc frontend và motion

```text
HomePage (Server Component)
  → CinematicHero (Server Component: poster, H1, CTA, reserved layout)
    → CinematicScene (client island: layers + controller)
      → scene config / asset manifest / CSS module
  → content sections (Server Components)
Public layout → shared header/footer; navigation không phụ thuộc scene
```

### 6.1 Runtime decision

- Ưu tiên CSS + Web Animations API cho timeline hữu hạn, playback và cleanup; chưa thêm animation dependency trong plan. Motion/GSAP chỉ dùng nếu spike chỉ ra nhu cầu không giải quyết đủ bằng native API và ghi delta bundle/maintenance.
- Scene config giữ order/delay/duration/displacement, focal point, variants và reduced-motion policy. Không đặt trạng thái frame lên global store hoặc `setState` mỗi frame.
- Animation dùng `transform`/`opacity`; parallax là enhancement sau khi intro ổn, không mặc định infinite loop. Khi cần pointer/scroll updates: một requestAnimationFrame, refs/CSS variables, không đọc-write layout xen kẽ mỗi layer.
- Layer decorative có `aria-hidden`, không chặn pointer; controls nằm trên layer. H1/CTA/skip-link vẫn semantic HTML và thao tác được.
- Header/menu/state route không nằm trong controller. Engine chưa hoạt động thì public pages vẫn render và điều hướng được.

### 6.2 Timeline dự kiến — phải kiểm bằng prototype

| Thời gian kể từ lúc scene ready | Visual |
|---|---|
| 0–0.35s | Sky/background ổn định, far mountain bắt đầu rise |
| 0.25–1.05s | Far/middle mountains lần lượt vào đúng vị trí |
| 0.75–1.8s | Near mountain và tiền cảnh vào; easing chậm ở cuối |
| 1.65–2.25s | Tiêu đề được nhấn sáng/reveal trang trí ở giữa; mô tả/CTA rõ |
| 2.25–2.8s | Settle; optional haze nhẹ; scene về idle |

Các lớp overlap thời gian để không tạo cảm giác slideshow. Displacement đo theo scene và bị giới hạn bởi vùng nền đã chuẩn bị; không cam kết ngọn núi đi cả chiều cao màn hình nếu source không đủ.

Title/CTA được server-render và luôn hiển thị, đọc/click được từ first meaningful paint xuyên suốt intro. Enhancement chỉ nhấn sáng hoặc reveal trang trí quanh text vốn đã visible khi cảnh hoàn tất; không fade H1/CTA từ opacity 0 hoặc giấu text chờ núi. LCP/focus pass riêng nó không chứng minh text đã đọc được, nên kiểm visible/computed style và video ở đầu intro.

### 6.3 State, session và failure policy

```text
static → preparing → playing → idle
                      ↕ paused
any enhancement state → static (error/reduced motion/skip)
idle → playing (explicit replay)
```

- Static poster là default, markup không giấu nội dung chờ hydrate.
- Handoff poster → layers phải được xem từ first paint bằng video/trace: không flash màu, tụt toàn cảnh đột ngột hoặc lộ scene dở dang. Nếu chưa có handoff sạch, giữ static thay vì chạy intro lỗi; prototype phải giải quyết điểm này trước polish.
- Enhancement bắt đầu khi required layers decode xong, hero ở viewport, tab visible, user cho phép motion. Timeout mục tiêu tối đa 1500ms sau hydration; chậm/lỗi thì giữ static, không nhảy intro muộn khi user đang đọc.
- Lần đầu vào home trong mỗi tab/session có thể intro. Cờ session ghi khi start/skip; storage bị chặn thì dùng in-memory fallback. Quay lại home qua Link/back không auto replay; replay là hành động chủ động.
- Reduced motion tại load hoặc đổi trong khi play: finish về static/final, bỏ parallax. Skip luôn kết thúc scene; Pause/Resume/Replay có label/focus rõ.
- User scroll khỏi hero: intro kết thúc về final, không restart khi cuộn ngược lên. Tab hidden: pause; trở lại không tạo duplicate timeline. Cleanup observers/listeners/animations khi unmount, kể cả React Strict Mode setup/cleanup lại.
- Poster bị lỗi: background màu/gradient và HTML còn đọc được. Layer lỗi: không thay poster bằng scene dở dang. Asset có load/error kiểm thực tế, không chỉ flag giả.

### 6.4 Budget memory và tải

- Ưu tiên poster LCP theo source variant; các layer là enhancement. Kiểm network waterfall để không tải cả bộ desktop/mobile hoặc preload mọi lớp trước nội dung.
- Giữ tổng hero resources thực tải trên mobile dưới mục tiêu master 700KB, gồm poster + layers + optional haze. Lazy không được dùng để giấu phần scene thực đã tải khỏi budget.
- Một RGBA full canvas 2048 × 1365 ≈ 10.66MiB chưa tính overhead; sáu lớp ≈ 64MiB, cộng poster/GPU có thể lớn hơn. File JPEG 261KiB không đại diện decoded memory.
- Gộp layer, crop có offset, chọn variant và giảm effect theo spike. Khi idle/unmount giải phóng timeline và tài nguyên có thể giải phóng; không bật `will-change` thường trực cho tất cả ảnh.

## 7. Sáu mốc triển khai và điều kiện chuyển mốc

Mỗi mốc là một bounded slice trong P2, không phải phase mới. Chỉ bắt đầu implementation sau khi Paw mở P2; các mốc phụ thuộc chạy đúng thứ tự. Một mốc fail thì repair mốc đó, giữ phần đã đúng.

| Mốc | Việc làm | Dependency / output / gate |
|---|---|---|
| P2-A | Chốt art direction, source rights/location, focal crop, storyboard và visual tokens | Đầu vào: master + ảnh. Output: reference desktop/mobile, provenance và decision register; scene placeholder dùng được nếu quyền ảnh còn mở |
| P2-B | Technical spike tối thiểu: static baseline, 2.5D prototype, hybrid isolated 3D comparator | Sau A; dùng pilot layers. Output: cùng thiết bị/profile, bundle/LCP/CLS/frame/transfer evidence, ảnh/video; Paw go/no-go true 3D. Đây là nơi quyết định runtime/layer count, chưa làm toàn web |
| P2-C | Bộ asset/layer hoàn chỉnh, manifest, responsive variants và static hero composition | Sau B chọn 2.5D path; gate alpha/alignment/edge/crop/transfer/decoded memory. Source byte-identical; asset failures giữ content |
| P2-D | Cinematic engine, timeline, controls, session/reduced-motion/error lifecycle | Sau C; Codex sole writer. Gate intro/skip/pause/replay/tabhidden/route/unmount và LCP không bị reveal che |
| P2-E | Shared UI và visual layout homepage/sáu tab theo §4 | Sau D có hero baseline; có thể làm design primitives sau A trong write-set độc lập khi root giao. Data/API vẫn thuộc phase sau |
| P2-F | Production verification, tối ưu, independent review và handoff | Sau C/D/E; artifacts, exact paths, commands/exit codes, known risks. Status `IMPLEMENTED_UNREVIEWED`; Paw quyết định đóng P2 |

### 7.1 Checklist implementation — handoff checkpoint

- [x] P2-A — local reference/crop/provenance/decision register; license/location ghi `UNVERIFIED`, chưa mở release.
- [x] P2-B — baseline/static/2.5D + native WebGL lower-bound comparator; có evidence và bản 2.5D được Paw chấp thuận. Full hybrid production hoãn, không suy mobile FPS từ desktop.
- [x] P2-C — source/layers/manifest/Next Image variants; source hash giữ nguyên, nested masks và asset bytes đã kiểm.
- [x] P2-D — controls/session/failed decode/deadline/scroll/resize/offline-loaded assets/reduced-motion và native bfcache đã kiểm.
- [x] P2-E — shared UI/home/sáu public tab; Chrome 192 route/viewport checks, Edge 20 route checks.
- [x] P2-F — gates implementer, production browser/performance verification, sửa findings từ bounded source review và handoff. Paw đã chấp thuận bản local ở Entry 008; final independent review và release gates chưa hoàn tất.

### 7.2 Ownership và write boundary

Codex giữ architecture, source/layer quality, toàn bộ `features/cinematic`, hero integration, technical spike/3D và final verification. Read-only agents có thể review visual/measurement/plan. DeepSeek chỉ nhận shared UI/public layout work nếu root gửi scope rõ sau approval; không tự sửa cinematic, global tokens do root đang giữ, hoặc cùng file với root. Mỗi implementer nhận exact write-set sau live refresh và phải biết có người khác trong workspace.

Tree đã triển khai sau P2; exact file inventory ở Entry 006. Không tạo lại scaffold hoặc thêm module chưa có consumer:

```text
assets/hero/source/                   # original.jpg + provenance.json, không public
assets/hero/work/                     # sky-generated.png, phần nền synthetic
apps/web/public/images/hero/          # terraces.jpg + sky-generated.png + manifest.json
apps/web/src/features/cinematic/
  cinematic-hero.tsx                  # server composition
  cinematic-scene.tsx                 # client island, controls có consumer ngay tại đây
  scene-config.ts                    # config + native masks ở cùng source canvas
  cinematic.module.css
  use-cinematic-controller.ts         # lifecycle/control logic
apps/web/src/components/ui/           # landscape-art.tsx + primitives đã mở rộng
apps/web/src/features/*/              # public visual compositions
scripts/hero/
  build-manifest.mjs
  verify-assets.mjs
  terrain-spike.mjs                   # chỉ benchmark, không import bởi production
```

Candidate sửa: home page, shared UI/styles, feature placeholder compositions và public route composition nếu cần. Header/mobile-nav chỉ sửa có mục đích layout đã xác định, giữ regression P1. `next.config.ts` chỉ sửa khi image settings thực sự cần. `package.json`/lock chỉ đổi khi dependency được giải thích và spike quyết định. `apps/api`/`packages/contracts` giữ ngoài write-set P2.

Write-set được mở rộng có mục đích cho `apps/web/src/app/loading.tsx`: no-JS browser probe đã tái hiện toàn bộ nội dung streamed bị hidden, màn hình chỉ còn "Đang tải nội dung…". Bỏ global loading boundary không cần thiết trên các route static hiện tại để HTML hiển thị trực tiếp; không sửa React internal streaming DOM hoặc giả user agent. Loading UI ở phase dữ liệu phải đặt tại vùng async thực sự cần, bên dưới shell/content fallback, và kiểm visibility khi tắt JS.

### 7.3 Nhánh production true 3D nếu được duyệt

Sau P2-B, một quyết định go phải kèm bounded slice: vị trí scene, source/model/texture đủ quyền, interaction, exact files/dependencies, byte/frame budgets và thiết bị nghiệm thu. Candidate vị trí là teaser bên dưới homepage, kích hoạt theo thao tác user; static teaser hiện trước và hero chính vẫn là 2.5D. Model địa hình minh họa phải ghi rõ là minh họa; POI/tọa độ thật chỉ dùng sau khi có dữ liệu được xác minh, không dựng geography giả.

Codex sole writer cho slice này trong feature island riêng, sau B và trước F; có thể song song với E khi write-set không giao nhau. Gate gồm activation/lazy network, WebGL unavailable/context loss, reduced motion, cleanup khi rời route và physical-device FPS. Nếu go chưa chốt scope/evidence, nhánh production chưa bắt đầu; tiếp tục hoàn thiện 2.5D. Nếu no-go, ghi decision rồi nghiệm thu P2 theo hero 2.5D.

## 8. Verification và performance protocol

### 8.1 Technical spike công bằng

- Production build + production server; ghi Node/browser/version/device/DPR/viewport và GPU mode. Không benchmark dev server hoặc headless `--disable-gpu` rồi suy ra GPU/mobile FPS.
- Ba cấu hình: static, 2.5D, hybrid. Giữ text/layout/ảnh/profile như nhau; hybrid đo cả default lazy và lúc user kích hoạt 3D. So sánh tổng byte và cost khi scene thực chạy.
- Tối thiểu 7 cold runs/config/profile và warm-cache runs tách riêng. Ghi raw values, median/range, LCP element, CLS, long tasks, transferred bytes và chunks; không gọi lab samples là p75 field. Không chọn lượt đẹp nhất; chỉ chạy lại performance suite khi asset/runtime/bundle thay đổi hoặc có vấn đề cần xác minh.
- Mỗi run ghi scene có start/finish thật, decode-ready time hay rơi vào static fallback và lý do. Với 1.6Mbps, 700KB mất khoảng 3.5s truyền lý tưởng trước overhead; deadline 1500ms có thể chủ động bỏ intro trên mạng chậm. Báo tỷ lệ activation/fallback từng profile; không dùng LCP của static fallback để chứng minh animation đạt performance. Profile mạng bình thường/warm cũng phải có evidence intro thực chạy và frames sạch.
- Profile mobile lab cố định dự kiến: 375 × 812, DPR 2; network 1.6Mbps down/750Kbps up/150ms latency, CPU 4× slowdown. Ghi số thực tế tool áp dụng và nguồn throttling; desktop unthrottled là profile riêng. Đây là lab profile đề xuất, không đại diện mọi điện thoại.
- Mobile FPS phải có ít nhất một điện thoại thật khi có thể: model/OS/browser/refresh rate, frame intervals, dropped frames, min/median và trace. Mục tiêu chuyển động gần 60fps trên thiết bị được ghi rõ, không có sustained jank trên 100ms. Chưa có thiết bị thì ghi `UNMEASURED`; chưa đủ evidence để duyệt true 3D production trên mobile.
- React/canvas/RAF timestamps không tự chứng minh frame thực được composited. Dùng browser trace/frame evidence và xem video/thiết bị; không biến emulation responsive thành test vật lý.

### 8.2 Các gate giữ theo master

| Gate | Acceptance/report |
|---|---|
| LCP | Mục tiêu <2.5s; lab median/range theo profile, field p75 chỉ khi có RUM/CrUX đủ dữ liệu |
| INP | Mục tiêu <200ms; lab tương tác đo menu/controls/navigation ghi là sample, Lighthouse TBT không gọi là INP |
| CLS | <0.1; giữ space của hero/ảnh/font, đo cả load và các thao tác |
| Initial client JS | Mục tiêu <180KB gzip; cộng mọi client chunk home phải tải, kể cả enhancement tự tải ngay; báo baseline và delta P2 |
| Mobile hero transfer | Mục tiêu <700KB cho toàn scene thực tải; báo từng asset, cold/warm riêng và decoded-memory estimate |
| Optional 3D | Mục tiêu asset <2–3MB, lazy-load; activation cost/bundle/FPS và fallback phải có evidence |
| Visual | Final/midpoint không mép kép/khe hở/halo; crop giữ nội dung tại DPR1/2; không hứa vượt nguồn |
| Usability | H1/CTA/skip/menu usable ở static, playing, paused, failed và no-JS |

Budget fail phải sửa hoặc ghi decision exception được Paw chấp thuận; không tăng budget hay đổi tên resource để báo pass. Lab/field/physical-device evidence được ghi riêng.

### 8.3 Regression matrix

- Viewports 320/375/768/1024/1440, desktop 1920; thêm 375 × 320, 568 × 320 landscape và mobile portrait DPR2. Hero ngắn theo content khi màn hình thấp; CTA không bị crop.
- Toàn bộ 24 route P1: H1/main, active nav, internal links, horizontal overflow và console/hydration. Kiểm header/menu/404/auth/account/admin khi shared styles thay đổi.
- Home → tab → home, browser back/forward, bfcache restore và full reload; cùng tab không auto replay, tab mới là session mới. Storage bị chặn vẫn usable.
- Keyboard: skip link, focus menu, Escape, controls, CTA đang animate; contrast AA trên ảnh tại các frame có text; controls không bị decorative layer nhận click.
- No-JS, reduced-motion từ đầu/đổi runtime, 404 image/layer, decode failure, offline/cached poster, slow network, tab hidden/visible, scroll-away, resize/orientation change giữa intro, double click replay và unmount trong play. Request lỗi được tạo có chủ đích phải ghi riêng; không bỏ qua mọi console error để làm test xanh.
- Lazy resources: vào public tab khác không tải scene asset/3D/vendor hero; home không tải cả desktop/mobile variants. Nếu router prefetch tải code trước, báo waterfall riêng; tài nguyên scene không eager ngoài home.
- Chrome và Edge local; Safari/iOS/Android vật lý chỉ ghi pass khi có thiết bị/browser và đã chạy. Công cụ không khả dụng phải nêu gap, không suy diễn tương thích.
- Chạy scripts thực: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`. Root test hiện là API health, không dùng kết quả đó thay acceptance cinematic. Test mới chỉ cho behavior/lifecycle có giá trị, không viết test mirror CSS.

Artifacts screenshots/traces/reports đặt ngoài repo khi review; ledger ghi exact path. Chỉ tạo script verification trong repo khi đã nằm trong implementation write-set. Dừng process test do mình mở sau verify.

## 9. Trade-offs, risks và fallback decisions

| Quyết định | Đánh đổi | Rủi ro / cách xử lý | Performance/scale |
|---|---|---|---|
| 2.5D photo layers | Giữ cảnh thật và art direction; camera/zoom bị giới hạn | Mép mask và vùng bị che; giảm movement/gộp layer, nền chuẩn bị, static fallback | Ít runtime hơn WebGL nhưng nhiều alpha image; đo byte và memory |
| Native CSS/WAAPI | Tránh dependency mới, timeline cần tự quản lý | Lifecycle/pause/Strict Mode; controller nhỏ có cleanup và tests | Chỉ một hero hữu hạn; không React render theo frame |
| Optional true 3D | Có camera/terrain/POI; cần model/texture/setup | WebGL/context loss/device yếu; isolated/lazy/static fallback, Paw go/no-go | Không nằm trên critical path; đo activation, không suy từ desktop |
| Local variants | Chủ động chất lượng/alpha/cache | Thêm build/storage và crop coordination | Static resources có thể cache/CDN ở P7; runtime không fetch Pinterest |
| Server content + client island | Text/navigation vẫn nhanh, scene tách biệt | Hydration/asset readiness; default static, progressive enhancement | Navigation/content không phụ thuộc GPU; giữ cùng shell giữa tab |
| Small verified dataset | Đủ phạm vi cuộc thi, tiết kiệm thời gian biên tập | Thiếu source/license/content; dùng placeholder có nhãn và asset replacement | P3/P6 giữ contract cho DB/API nhỏ, không bày thêm hạ tầng ở P2 |

## 10. Open decisions và bước tiếp theo

| Decision | Owner | Khi nào cần |
|---|---|---|
| Triển khai P2 | Paw — đã duyệt ngày 2026-09-27 | Resolved: "oke duyệt mày hãy làm đi"; Entry 005 |
| Điểm đến/tên thương hiệu/copy cuối | Paw | P2-A visual reference; nội dung thật trước publish |
| Quyền ảnh, quyền biến đổi, attribution và địa điểm | Paw + Codex kiểm evidence | Trước dùng ảnh theo phạm vi được phép; release gate cho cuộc thi/deploy |
| Có true 3D production không | Paw nếu mở scope riêng | Hoãn sau acceptance bản 2.5D ở Entry 008; chưa có authorization production 3D |
| Điện thoại thật dùng benchmark | Paw/Codex theo thiết bị có sẵn | P2-B/P2-F; thiếu thì ghi gap và giữ no-go 3D mobile |

Bước hiện tại: P2 đã được Paw chấp thuận cho bản local 2.5D; lập plan P3 PostgreSQL/Prisma/content API ở master §9 và Entry 009. P3 implementation chưa mở. Artifacts P2 tại `C:\Users\DELL\AppData\Local\Temp\p2-final-1790520974394`; dùng production build, không dùng dev-server numbers. Quyền ảnh/thiết bị thật vẫn là release gates, không được đóng bằng acceptance local.

## 11. Kết quả implementation và evidence ngày 2026-09-27

### 11.1 Bản bàn giao và quyết định runtime

Snapshot bàn giao ngày 2026-09-27: status `IMPLEMENTED_UNREVIEWED`, final production build `AELZZd0hE05pj7T59B85c`; Paw acceptance cập nhật riêng ở Entry 008 ngày 2026-09-28. Entry 007 bổ sung shared display-font repair sau snapshot M5 ở Entry 006; lịch sử cũ được giữ nguyên. Node 24.18.0/npm 11.16.0, Chrome 153.0.8010.53 và Edge 154.0.4258.37 trên Windows. GPU enabled headless dùng ANGLE D3D11 trên AMD Radeon; không dùng `--disable-gpu`. Emulation không phải điện thoại vật lý.

Codex khuyến nghị **giữ 2.5D**: native CSS/WAAPI, bốn silhouette chồng xuống đáy canvas, intro 2800 ms; poster và text/CTA có HTML từ server. Background plate có phần synthetic được ghi trong provenance, terrain và phần sky gốc dùng nguyên photo pixels. Một ảnh phẳng không cung cấp địa hình bị che: đây là chiều sâu mô phỏng với chuyển động nhỏ, không phải các ngọn núi độc lập được phục hồi hay model địa lý. Reviewer cần xem filmstrip để đánh giá mức overlap chấp nhận được; không có phép chứng minh reconstruction pixel-perfect cho các frame đang di chuyển.

Không thêm dependency; `package.json`, lock, API và contracts giữ nguyên hash baseline. Native WebGL comparator nằm ở `scripts/hero/terrain-spike.mjs`, không có production import. Comparator có geometry thật nhưng không texture/model/React Three Fiber/Drei; nó chỉ cho lower bound về cost, chưa chứng minh một hybrid production scene đáp ứng budget. Tại thời điểm bàn giao chưa có go/no-go; sau acceptance local ở Entry 008, nhánh production 3D được hoãn, chưa có evidence physical-mobile để đề xuất go.

### 11.2 Performance protocol và số liệu

Browser-cold = context/storage mới, browser HTTP cache tắt/clear mỗi lượt; loopback production HTTP. Next Image server cache đã có variant (`X-Nextjs-Cache: HIT`), nên đây không phải cold origin/deploy benchmark. Mobile: 375 × 812, DPR2, 1.6Mbps down/750Kbps up, latency 150 ms, CPU4 ×. Desktop: 1440 × 900, DPR1, network/CPU không throttle. Không chạy browser suites song song khi đo. Mỗi bảng dùng toàn bộ bảy lượt, không chọn lượt đẹp nhất.

| Cấu hình | Build/evidence | Mobile lab LCP median [min–max] ms | Desktop lab LCP median [min–max] ms | Initial JS gzip mobile/desktop | Intro/activation |
|---|---|---|---|---|---|
| P1 SVG baseline | baseline report, trước P2 | 1252 [1200–1304] | Không đo cùng baseline này | 139608 / 143216 B (desktop byte inventory) | Không có intro; H1 là LCP, layout/asset khác P2 |
| P2 static reference, reduced motion | `L0saPZ1Uk8_OJGkyJnwyV`, `p2-static-report.json` | 2064 [2048–2096] | 200 [196–208] | 148500 / 152105 B | 0/7 intro, không request sky; vẫn có cùng client bundle, không phải zero-client build |
| P2 2.5D paired comparator | Cùng build L0, `p2-motion-final-report.json` | 2072 [2064–2076] | 188 [184–268] | 148500 / 152105 B | 7/7 intro ở mỗi profile |
| P2 + native 3D after activation | Cùng build L0, `p2-native-spike-report.json` | 2084 [2036–2100] | 192 [180–228] | 148500 / 152105 B; thêm script 1688 B gzip qua CDP | 7/7 intro và 7/7 WebGL activation mỗi profile; LCP xảy ra trước activation |
| P2 warm browser cache | Cùng build L0, `p2-warm-report.json` | 320 [308–332] | Không đo warm desktop | 148500 B inventory; network thực 24808 B | 7/7 intro; không dùng để thay cold budget |
| P2 snapshot trước shared display-font repair | `M5xMr2LYLWEQNBbD2ioMa`, `p2-release-candidate-report.json` | **2068 [2060–2088]** | **200 [180–1556]** | **148506 / 152111 B** | **7/7 intro hoàn tất ở mỗi profile** |
| P2 final shared typography repair | `AELZZd0hE05pj7T59B85c`, `p2-typography-final-report.json` | **2080 [2040–2104]** | **216 [208–248]** | **148506 / 152111 B** | **7/7 intro hoàn tất ở mỗi profile** |

Final raw LCP mobile: `2080, 2104, 2068, 2040, 2080, 2076, 2084` ms. Desktop: `248, 220, 216, 216, 208, 212, 208` ms. Snapshot M5 có lượt desktop1556 ms, vẫn giữ trong `p2-release-candidate-report.json`, không xóa hoặc dùng run mới để thay bằng một giá trị đẹp hơn. Final LCP element là poster `IMG`. Initial JS tính gzip-level6 của unique JS chunks thực được request, kể cả automatic/prefetched code; inactive nomodule không cộng như asset đã tải. Delta mobile so P1: **8898 B gzip**.

Final CLS max mobile **0.0009000764**, desktop **0.0001209272**, dưới0.1. Tổng page network encoded theo CDP (gồm HTTP overhead) mobile 406723 B/desktop 433935 B; đây là phép đo khác initial-JS-gzip, không cộng hai số khác hệ đo. Runtime/hydration console errors =0 ở14 lượt final.

Chrome chọn một WebP photo 1920 × 1280, **161584 B**, và sky 1536 × 1024, **39792 B**; toàn hero **201376 B body**, CDP including headers202230 B. Các silhouette đều dùng `poster.currentSrc`, không tải bốn photo variants. q90 pilot ở cùng độ phân giải dùng327532 B poster và LCP3072 ms (fail); q75 được so ảnh và giữ spatial resolution, đổi lossy encoding. Original2048 × 1365/267143 B vẫn byte-identical. Không hứa 4K/zoom hoặc lossless delivered compression.

Decoded-memory estimate: một photo RGBA1920 × 1280 khoảng9.375 MiB; sky 1536 × 1024 khoảng6 MiB. Nếu browser giữ độc lập poster + original-sky +4terrain copies thì pixel buffers khoảng62.25 MiB, chưa gồm GPU/compositing surfaces. Browser có thể chia sẻ decode cùng URL; RAM/GPU thực chưa được đo. Không lấy201 KB transfer làm memory usage.

Mobile CPU4× ghi startup long tasks 116–664 ms; raw timing giữ trong report. Số long tasks overlap khoảng scene play trong14 lượt final: 0. RAF median6.9 ms là scheduling proxy trên GPU desktop144Hz, **không phải mobile FPS**. Trace ở build R6 có6719 compositor events/83694 events, không có screenshot events. Rendered filmstrip trên final AEL có273 frame được xem riêng, không dùng trace trống hình để chứng minh visual.

Final interaction probe:10 thao tác menu/replay/pause/resume/skip, mobile CPU4 ×, native CDP input;73 EventTiming entries. Max duration trong entries có interactionId>0 là **120 ms**. Đây là lab samples, duration được browser làm tròn và threshold16 ms; events không được ghi không được coi là0 ms. **Field INP, field LCP p75 và physical-device FPS = `UNMEASURED`.**

Native 3D14 activations:24576 vertices, geometry buffer589824 B, script 1688 B gzip injected ngoài HTTP; initialization39.5–47.6 ms dưới mobile CPU4 × và12.9–15.0 ms desktop. RAF interval maximum48.5–55.6 ms ở mobile profile/13.9–20.8 ms desktop; median6.9 ms trên GPU desktop. Không có runtime errors. Geometry bytes là RAM, không được ghi như asset transfer; texture/model/R3F/lazy-loader/context-loss/phone acceptance chưa có trong comparator này.

### 11.3 Gates, regression và findings đã sửa

| Kiểm tra | Evidence / kết quả | Phạm vi/version |
|---|---|---|
| `npm run lint` | Exit0 | Source cuối, sau typography repair |
| `npm run typecheck` | Exit0 | Contracts/API/web; source cuối |
| `npm run test` | Exit0, API health unit +e2e pass | Đã chạy trong P2; API source giữ hash. Không thay UI acceptance |
| `npm run build` | Exit0 | Final build AEL;24 route shells static +404/icon |
| `node scripts/hero/verify-assets.mjs` | Exit0; source/public JPEG hash bằng provenance;4 nested silhouettes;2800 ms | Source cuối |
| `node scripts/hero/build-manifest.mjs` | Exit0; output deterministic SHA không đổi khi chạy lại | Source cuối; có Node module-type warning của TS import, không đổi package để dập warning |
| Chrome route matrix | **192 route/viewport checks,1225 assertions PASS**;24 internal links/0 broken | Final build AEL; chạy lại sau shared typography repair,24 routes ×8 viewports |
| Edge smoke | **20 route checks PASS** +no-JS menu/H1 | Final build AEL, Edge154; chạy lại sau shared typography repair. Safari/iOS/Android chưa test |
| Cinematic lifecycle | **12 cases,31 assertions PASS** | Controller cuối: pause/resume,skip,doubleReplay,sessionreload/SPA,storageblocked/unmount,reduce/reallow,scroll,resize,decode/deadline,offline-loaded assets,freeze/visibility |
| Native bfcache | History back có `pageshow.persisted=true`, về idle/navigation-away, animations canceled | Reproduced RED resume-intro rồi thêm pagehide finish; controller hash giữ nguyên sau đó |
| WAAPI rollback/reduced focus | **5 cases PASS**, audited bằng assertions trong `rollback-audit.json` | First/second-call throw, replay throw và reduce khi focus Pause/Skip; canceled partial animations,0 uncaught error, focus chuyển CTA |
| Final home acceptance | **83 assertions PASS**,8 viewports,3 no-JS routes, cold-tab network,273 rendered frames | Final build AEL; thêm28 font checks trên public H1/display H2/H3/brand, Times New Roman normal/italic glyphs thống nhất, title/CTA nằm trong hero,0 overflow/console error |
| Final contrast | **54 element-frame checks,0 failures**; large text min3.111, small text min4.955 | Final AEL;375DPR2/1440DPR1 ×0/900/1800 ms; giữ shadow và backdrop thật, đo background không text fill |
| Final performance/interactions |14 cold runs +10 actions PASS | Final AEL; raw reports giữ mọi run/outlier |

Repairs có evidence: disjoint strips lộ gold gaps → overlapping silhouettes và displacement nhỏ; WAAPI throw để lại partial animation → transactional rollback; reduce trong focus controls → chuyển focus sang CTA enabled; native bfcache replay → finish trên pagehide; global loading boundary để streamed content hidden khi tắtJS → xóa boundary không cần ở các routes static, thêm no-JS navigation; eyebrow contrast fail → backdrop cục bộ; Georgia fallback làm lệch dấu/khoảng cách → shared serif token thống nhất cho tất cả display headings, hero dùng lại token. Probe tạm từng có selector/quoting lỗi; được sửa bằng source thực, không đổi app để làm probe pass.

Đã có bounded source review từ agents và findings được root tái hiện/repair. Agents hết usage quota trước final review pass, nên không có independent approval toàn P2. Root self-review/verification không được đổi status thành `VERIFIED`. Visual filmstrip/phone và go/no-go vẫn cần Paw/reviewer.

### 11.4 Artifact inventory và handoff

Root evidence directory: `C:\Users\DELL\AppData\Local\Temp\p2-final-1790520974394`.

- `final-desktop.png`, `final-mobile.png`, `final-home-fullpage.png`, `final-no-js-home.png`: screenshot build cuối.
- `final-acceptance.mjs`, `final-acceptance.json`, `rendered-frame-{0,250,600,1200,1800,2600,3200}.jpg`: acceptance và first-paint/midpoint/end filmstrip; offset tính từ frame đầu, không giả offset là exact scene time.
- `performance.mjs`, `p2-typography-final-report.json`: final AEL raw14 runs/chunks/network/state; `p2-release-candidate-report.json` giữ snapshot M5 và outlier. Comparator reports theo bảng11.2; `p2-pilot-report.json` giữ q90 fail.
- `report.json`, `regression.mjs` +14full-page public-tab screenshots: Chrome matrix; `edge-report.json`, `edge-smoke.mjs`: Edge.
- `lifecycle-report.json`, `lifecycle.mjs`, `bfcache.json`, `bfcache.mjs`, `bfcache-red.json`, `red-probes.json`, `red-probes.mjs`, `rollback-audit.json`: behavior/failure evidence.
- `hero-contrast.json`, `hero-contrast.mjs`, `hero-contrast-red.json`: contrast red/repair.
- `interactions.json`, `interactions.mjs`: final lab input samples; `cinematic-trace.json.gz`, `trace-report.json`, `native-3d-active.png`: trace/lower-bound 3D screenshot ở build R6.
- `final-source-integrity.json`: baseline/final file hashes, exact delta và protected-file check.
- P1 baseline: `C:\Users\DELL\AppData\Local\Temp\p2-performance-baseline-2eb241024a8a42e3a29c38a029b529dd\baseline-audited-report.json`.

Baseline104/current119 files ngoài generated/dependencies: **38modified +16created +1deleted**; exact paths ở master Entry006, final typography repair ở Entry007.19 protected API/contracts/package/lock files hash không đổi. Không Git init/commit/push. Graph Tier2 generation09:29:26Z báo55 evidence paths:36 metadata_changed,18 not_tracked,1 missing (global loading đã xóa); đã dùng source reads/hash/browser fallback, không coi graph cũ là current-code proof.

Task-owned browser/server processes được dừng sau verify; không dừng browser của Paw. Temp artifacts có thể bị OS dọn: reviewer cần giữ/copy nếu muốn lưu lâu. Project doc không chứa prompt. Bước tiếp theo là review/chấp thuận P2, chốt 3D và source rights; P3 PostgreSQL/Prisma/content API chưa được mở.

Tài liệu kỹ thuật đối chiếu ngày 2026-09-27: [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API), [Next Image](https://nextjs.org/docs/app/api-reference/components/image), [Web Vitals và lab/field](https://web.dev/articles/vitals). Next Image cũng đã đối chiếu docs cài tại `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`; version thực trên disk là nguồn quyết định khi code.
