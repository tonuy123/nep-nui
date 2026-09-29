# AI Project Control — Website quảng bá du lịch vùng sâu vùng xa

> **READ-FIRST / SINGLE SOURCE OF TRUTH**  
> Mọi AI tham gia dự án phải đọc toàn bộ file này trước khi inspect, plan, sửa code, chạy lệnh hoặc đề xuất chuyển phase. File này là nguồn sự thật cho đề thi, product scope, architecture, workflow, trạng thái phase và handoff. Nếu nội dung chat mới nhất của Paw mâu thuẫn với file, lệnh mới nhất của Paw thắng; AI phải cập nhật lại phần tương ứng trong file trước khi tiếp tục.

---

## 0. Document control

| Thuộc tính | Giá trị |
|---|---|
| Project root | `D:\webdulich` |
| Owner / Decision maker | Paw |
| Architecture owner / Quality gate | Codex |
| Implementation agent đầu tiên | DeepSeek |
| Cinematic/3D implementation owner | Codex — sole writer cho P2 visual engine, trừ khi Paw tái phân công rõ ràng |
| Ngày tạo baseline | 2026-09-27, Asia/Saigon |
| Trạng thái filesystem khi tạo | Thư mục project trống, chưa có source code |
| Package manager đã có | `npm 11.16.0` |
| Runtime đã có | `Node.js v24.18.0` |
| Tooling đã có | Git `2.55.0.windows.3`, Docker `29.7.2` |
| Tooling chưa có | `pnpm` |
| Git policy | Không tự commit, push, tạo branch hoặc rewrite history |
| Shell | Windows PowerShell 5.1; không dùng `&&` |

### 0.1 Source-of-truth rule

Trước mỗi phase, AI phải xác minh lại filesystem. Snapshot trong file này là baseline, không phải lý do để ghi đè file vừa được người khác tạo. Nếu workspace không còn trống, AI phải đọc và thích nghi với code hiện tại.

### 0.2 Status vocabulary

Chỉ dùng các trạng thái sau:

- `NOT_STARTED`: chưa làm.
- `IN_PROGRESS`: đang làm, chưa đủ evidence.
- `IMPLEMENTED_UNREVIEWED`: đã code và chạy gate của implementer, chưa được independent review.
- `VERIFIED`: đã có review/verification độc lập hoặc Paw chấp thuận bằng evidence.
- `BLOCKED`: không thể tiến tiếp sau khi đã kiểm tra các phương án an toàn; phải ghi blocker cụ thể.

Green build không tự động đồng nghĩa `VERIFIED`.

---

## 1. Đề thi và nội quy cuộc thi

### 1.1 Chủ đề

**Thiết kế website quảng bá du lịch cho điểm đến vùng sâu, vùng xa tại Việt Nam.**

### 1.2 Bài toán cần giải quyết

Nhiều địa danh có cảnh quan, văn hóa và cộng đồng đặc sắc nhưng chưa được biết đến rộng rãi do:

- Thiếu thông tin đáng tin cậy và có cấu trúc.
- Thiếu công cụ khám phá trực quan.
- Nội dung quảng bá rời rạc, khó lập hành trình.
- Trải nghiệm số chưa thể hiện được bản sắc địa phương.

Website phải giúp người dùng:

1. Nhìn thấy bản sắc của điểm đến ngay trong vài giây đầu.
2. Khám phá địa danh, trải nghiệm, hành trình và câu chuyện bản địa.
3. Tìm được thông tin thực dụng: mùa đi, đường đi, chi phí ước tính, độ khó và lưu ý an toàn.
4. Lưu địa điểm/hành trình khi có tài khoản.
5. Gửi yêu cầu tư vấn.
6. Cho phép Editor/Admin quản lý nội dung qua dashboard.

### 1.3 Ràng buộc từ đề thi đã được cung cấp

- Thiết kế phải hấp dẫn về thị giác và có tính ứng dụng.
- Tuân thủ quy định pháp lý và chuẩn mực giáo dục.
- Không sao chép hoặc mô phỏng nguyên mẫu sản phẩm có sẵn.
- Nội dung, hình ảnh, video, font và bản đồ phải có quyền sử dụng hoặc attribution phù hợp.
- Brief gốc thể hiện mốc **120 phút thực chiến**; nếu ban tổ chức cung cấp timeline mới, timeline mới nhất sẽ thay thế mốc này.
- Không bịa đặt dữ kiện văn hóa, lịch sử, lễ hội, đường đi, chi phí hoặc cảnh báo an toàn. Nội dung chưa được kiểm chứng phải ghi rõ là placeholder.

### 1.4 Nội quy nội bộ của team

1. Mỗi phiên chỉ triển khai **một phase** được Paw cho phép.
2. Checklist phải xuất hiện trước hành động và được cập nhật khi hoàn tất từng bước.
3. Trước khi ghi file, inspect workspace và kiểm tra file đích có tồn tại hay không.
4. Giữ nguyên mọi thay đổi ngoài scope; không dọn dẹp hoặc refactor lan sang phase khác.
5. Không tự commit Git.
6. Không thêm dependency khi chưa giải thích mục đích, chi phí bundle/runtime và lựa chọn thay thế.
7. Không hard-code secret; không in secret vào terminal, log, screenshot hoặc report.
8. Không tuyên bố pass nếu chưa chạy đúng command và chưa có exit code/output tương ứng.
9. Không chuyển phase chỉ vì phase hiện tại “gần xong”. Chỉ chuyển khi Paw cho phép.
10. Sau mỗi đợt sửa file phải self-review diff, chạy gate phù hợp và ghi handoff theo template cuối file.

---

## 2. Product vision

### 2.1 Product statement

Website kể câu chuyện về một vùng đất bằng cảnh quan, con người và hành trình tương tác. Sản phẩm kết hợp cinematic visual với thông tin du lịch thực dụng, nhưng vẫn nhanh, responsive, accessible và có backend quản trị nội dung thật.

### 2.2 Positioning

Đây không phải bản clone của `travel.com.vn` và không phải marketplace bán hàng nghìn tour. Ta học luồng discovery rõ ràng của các website du lịch lớn, nhưng sản phẩm phải có bản sắc riêng:

- Editorial storytelling thay cho mật độ banner quảng cáo.
- Nội dung về cộng đồng địa phương thay cho danh mục tour khổng lồ.
- Một cinematic hero đặc trưng thay cho full-site 3D.
- Hành trình gợi ý và map tương tác thay cho booking engine phức tạp.

### 2.3 Primary personas

| Persona | Nhu cầu |
|---|---|
| Visitor | Khám phá nhanh, hiểu điểm đến, xem ảnh/map/hành trình |
| Registered User | Lưu địa danh, lưu hành trình, gửi và theo dõi yêu cầu tư vấn |
| Editor | Soạn destination, experience, itinerary, story và media |
| Admin | Publish content, quản lý user/role, inquiry và audit log |

### 2.4 Primary user journey

```text
Mở link
  → cinematic hero tạo ấn tượng
  → chọn một điểm đến
  → xem trải nghiệm/câu chuyện
  → xem hành trình gợi ý và bản đồ
  → đăng nhập để lưu
  → gửi yêu cầu tư vấn
```

---

## 3. Scope

### 3.1 In scope của sản phẩm hoàn chỉnh

- Public tourism website.
- Cinematic layered mountain hero trên homepage.
- Destination, experience, itinerary, interactive map, local story và travel guide.
- User registration/login/profile.
- Favorite destinations và saved itineraries.
- Inquiry/contact workflow.
- Admin/Editor dashboard.
- PostgreSQL database, migrations và seed data.
- Authentication, refresh sessions và RBAC.
- Media upload thông qua object storage.
- Draft/publish/archive content workflow.
- Audit log cho privileged actions.
- Responsive, accessibility, SEO và performance gates.

### 3.2 Out of scope cho vòng loại hiện tại

- Payment gateway.
- Real booking inventory và seat allocation.
- Dynamic pricing/voucher engine.
- Flight/hotel reservation integration.
- Microservices.
- Kafka/RabbitMQ.
- Machine-learning recommendation.
- Real-time chat.
- Native mobile app.
- Full 3D website hoặc WebGL bắt buộc cho navigation.

### 3.3 Data volume baseline

Architecture phải chuẩn nhưng dataset ban đầu nhỏ:

- 5–6 destinations.
- 6–8 experiences.
- 3 itineraries.
- 3 local stories.
- 4–5 guides.
- 8–12 map POIs.
- 1 admin seed, 1 editor seed và một vài demo users.

---

## 4. Architecture decisions

### 4.1 Architecture style

**Modular monolith trong npm workspace monorepo.** Không dùng microservices ở scope này.

```text
Browser
  → Next.js Web
  → NestJS REST API
  → PostgreSQL
  → S3-compatible media storage
```

### 4.2 Locked stack

| Layer | Decision |
|---|---|
| Workspace | npm workspaces; không giả định `pnpm` đã cài |
| Frontend | Next.js App Router + TypeScript strict |
| Backend | NestJS + TypeScript strict |
| API | REST, version prefix `/api/v1` |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | Short-lived access token + rotated refresh session |
| Password hashing | Argon2id |
| Validation | DTO/schema validation ở API boundary |
| Styling | Tailwind CSS + CSS variables/design tokens |
| Animation | CSS/Motion; GSAP chỉ khi cinematic timeline thật sự cần |
| 3D | React Three Fiber/Drei chỉ ở isolated route/component nếu được duyệt |
| Map | MapLibre hoặc lightweight SVG map; lazy-load |
| Storage | S3-compatible storage hoặc Cloudinary adapter |
| Docs | OpenAPI/Swagger cho backend |
| Local infra | Docker Compose cho PostgreSQL ở phase database |

### 4.3 Target repository tree

```text
D:\webdulich
├── AI_PROJECT_CONTROL.md
├── README.md
├── package.json
├── package-lock.json
├── .gitignore
├── .editorconfig
├── .env.example
├── docker-compose.yml                 # Phase database
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (public)/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── kham-pha/
│   │   │   │   │   ├── trai-nghiem/
│   │   │   │   │   ├── hanh-trinh/
│   │   │   │   │   ├── ban-do/
│   │   │   │   │   ├── chuyen-ban-dia/
│   │   │   │   │   └── cam-nang/
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── dang-nhap/
│   │   │   │   │   └── dang-ky/
│   │   │   │   ├── (account)/tai-khoan/
│   │   │   │   ├── admin/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   └── not-found.tsx
│   │   │   ├── components/
│   │   │   │   ├── layout/
│   │   │   │   ├── navigation/
│   │   │   │   ├── ui/
│   │   │   │   └── placeholders/
│   │   │   ├── features/
│   │   │   │   ├── destinations/
│   │   │   │   ├── experiences/
│   │   │   │   ├── itineraries/
│   │   │   │   ├── map/
│   │   │   │   ├── stories/
│   │   │   │   ├── guides/
│   │   │   │   ├── auth/
│   │   │   │   ├── account/
│   │   │   │   └── admin/
│   │   │   ├── config/
│   │   │   ├── lib/
│   │   │   └── styles/
│   │   └── public/
│   │       └── images/
│   │
│   └── api/
│       ├── src/
│       │   ├── modules/
│       │   │   ├── health/
│       │   │   ├── auth/
│       │   │   ├── users/
│       │   │   ├── destinations/
│       │   │   ├── experiences/
│       │   │   ├── itineraries/
│       │   │   ├── stories/
│       │   │   ├── guides/
│       │   │   ├── media/
│       │   │   ├── favorites/
│       │   │   ├── inquiries/
│       │   │   └── audit/
│       │   ├── common/
│       │   ├── config/
│       │   ├── database/
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed.ts
│       └── test/
│
└── packages/
    ├── contracts/
    ├── ui/
    ├── eslint-config/
    └── tsconfig/
```

Tree trên là target architecture. AI được điều chỉnh chi tiết nhỏ để phù hợp scaffold chính thức, nhưng không được đổi boundary `apps/web`, `apps/api`, `packages/contracts` hoặc nhập backend vào page component.

### 4.4 Layer rules

#### Web

```text
Route/Page
  → Feature component
  → Shared UI component
  → API client/adapter
  → Shared contract
```

- Page không chứa fetch logic dài, validation hoặc domain mutation.
- Shared UI không import feature-specific data access.
- Admin và public dùng layout riêng.
- Interactive map/3D là client island; content chính vẫn server-render được.

#### API

```text
Controller
  → Service
  → Repository
  → Prisma
  → PostgreSQL
```

- Controller chỉ nhận request, validate và map response.
- Service giữ business rules.
- Repository giữ database access.
- Không query Prisma trực tiếp trong Controller.
- Public query chỉ trả content `PUBLISHED`.

---

## 5. Information Architecture và route contract

### 5.1 Main navigation

Top navigation theo yêu cầu cập nhật 2026-09-28 chỉ có:

1. `Tour trọn gói` → `/tour-tron-goi`
2. `Vé máy bay` → `/ve-may-bay`
3. `Khách sạn` → `/khach-san`
4. `Combo du lịch` → `/combo-du-lich`
5. `Dịch vụ cộng thêm` → `/dich-vu-cong-them`

Mỗi mục là một route riêng với chức năng khám phá/lên kế hoạch phù hợp dữ liệu hiện có. Không mô phỏng tồn kho, giá hay thanh toán khi chưa có integration. Sáu route editorial cũ vẫn truy cập trực tiếp từ nội dung/CTA để giữ deep link; chúng không còn nằm trên main navigation.

CTA bên phải: `Lập chuyến đi` → `/combo-du-lich`.

User menu dẫn tới `/dang-nhap` khi guest và `/tai-khoan` khi authenticated. Admin không xuất hiện trong main navigation công khai.

### 5.2 Phase-1 page skeleton contracts

Phase 1 chỉ dựng khung route và composition. Nội dung thật, API data, animation cuối, map cuối và auth logic thuộc phase sau.

#### `/` — Home shell

- Persistent site header.
- `CinematicHeroPlaceholder` có các layer semantic: sky, far mountain, middle mountain, foreground, mist và content.
- H1 text HTML thật, không bake text vào image.
- CTA tới `/kham-pha` và `/hanh-trinh`.
- Placeholder sections: featured destinations, experiences, map teaser, itineraries, local stories, responsible travel, final CTA.
- Footer.

#### `/kham-pha`

- Page hero.
- Filter-bar placeholder.
- Destination grid placeholder.
- Empty/loading/error presentation components có thể tái sử dụng.

#### `/trai-nghiem`

- Category chips placeholder.
- Experience grid placeholder.
- Editorial feature block placeholder.

#### `/hanh-trinh`

- Duration/budget/difficulty filter placeholder.
- Itinerary cards placeholder.
- `Lập chuyến đi` panel placeholder, chưa lưu hoặc submit.

#### `/ban-do`

- Accessible map frame placeholder.
- POI filter placeholder.
- List fallback để người không dùng map vẫn truy cập được nội dung.
- Không import map library trong Phase 1.

#### `/chuyen-ban-dia`

- Editorial lead story.
- Secondary story cards.
- Author/source placeholder.

#### `/cam-nang`

- Guide categories: cách đến, mùa đi, chi phí, an toàn, ứng xử.
- FAQ placeholder.

#### `/dang-nhap` và `/dang-ky`

- Auth layout và form shell có label/accessibility đầy đủ.
- Không gọi API, không lưu token, không giả lập đăng nhập thành công.
- Nút submit có trạng thái “Sẽ kích hoạt ở Auth phase” hoặc handler an toàn không gây navigation giả.

#### `/tai-khoan`

- Account layout placeholder.
- Navigation: Hồ sơ, Địa điểm yêu thích, Hành trình đã lưu, Yêu cầu tư vấn, Bảo mật.
- Chưa có protected-route logic ở Phase 1.

#### `/admin`

- Admin shell riêng với sidebar/topbar.
- Placeholder routes/sections: Tổng quan, Địa danh, Trải nghiệm, Hành trình, Chuyện bản địa, Cẩm nang, Media, Yêu cầu tư vấn, Người dùng, Audit log.
- Chưa có CRUD, auth guard hoặc database query ở Phase 1.

### 5.3 Global shell requirements

- Skip link.
- Semantic landmark: `header`, `nav`, `main`, `footer`.
- Desktop navigation và accessible mobile menu.
- Active route state.
- Keyboard operation và visible focus.
- Header không làm content nhảy khi sticky.
- Mobile-first, không horizontal overflow ở 320px.
- Có `loading`, `error` và `not-found` shell.
- Link nội bộ dùng Next.js `Link`.
- Shared navigation config là một source of truth.

---

## 6. Visual direction

### 6.1 Design tokens baseline

```text
Forest:      #2F4F3E
Earth:       #5B4632
Gold:        #D4A24E
Ivory:       #F7F3E9
Ink:         #17211B
White:       #FFFFFF
```

Typography ưu tiên font hỗ trợ tiếng Việt đầy đủ. Tối đa hai font families và bốn weights trong sản phẩm cuối.

### 6.2 Cinematic hero contract

Mountain reveal mặc định sử dụng 2.5D layered image composition để giữ art direction và tốc độ tải. Đây không phải true 3D geometry. Nếu P2 technical spike chứng minh true 3D đạt performance budget, một isolated 3D terrain/POI scene có thể được thêm bằng React Three Fiber/Drei; 3D không được trở thành điều kiện để đọc nội dung hoặc điều hướng website.

```text
Sky
  → far mountains
  → middle mountains
  → foreground mountains
  → mist/vegetation
  → title
  → description and CTA
```

Full animation thuộc phase riêng. Phase 1 chỉ dựng DOM/layer placeholder và final static state. Hero phải usable khi animation, JavaScript hoặc layer image thất bại.

### 6.3 Motion rules

- Intro mục tiêu 2.5–3 giây.
- Animate chủ yếu `transform` và `opacity`.
- Hỗ trợ `prefers-reduced-motion`.
- Không khóa scroll.
- Không ép user bấm “Enter”.
- Header/CTA không bị chặn bởi overlay.
- Không chạy full intro khi đổi giữa các route nội bộ.

### 6.4 Cinematic/3D ownership

- Codex trực tiếp thiết kế, implement, optimize và verify P2 visual engine.
- DeepSeek chỉ dựng P1 DOM/interface placeholder và không được cài, thử nghiệm hoặc chỉnh cinematic/3D runtime.
- P2 bắt đầu bằng benchmark hai phương án: 2.5D layered hero và hybrid 2.5D + isolated true 3D scene.
- Paw chốt go/no-go cho true 3D sau khi xem prototype cùng số liệu bundle, LCP và mobile FPS; visual ấn tượng không được đánh đổi khả năng sử dụng trên thiết bị yếu.

---

## 7. Backend and data blueprint

Phần này là contract cho các phase sau, không phải scope implement của Phase 1.

### 7.1 Roles

```text
USER
EDITOR
ADMIN
```

### 7.2 Core entities

- `users`
- `auth_sessions`
- `destinations`
- `media`
- `destination_media`
- `experiences`
- `itineraries`
- `itinerary_days`
- `stories`
- `guides`
- `favorites`
- `saved_itineraries`
- `inquiries`
- `audit_logs`

### 7.3 Publication state

```text
DRAFT → PUBLISHED → ARCHIVED
```

Public API không trả `DRAFT` hoặc `ARCHIVED`.

### 7.4 API namespace

```text
/api/v1/health
/api/v1/auth/*
/api/v1/destinations/*
/api/v1/experiences/*
/api/v1/itineraries/*
/api/v1/stories/*
/api/v1/guides/*
/api/v1/me/*
/api/v1/admin/*
```

### 7.5 Security baseline

- Argon2id password hashing.
- Access token sống ngắn.
- Rotated refresh session trong `HttpOnly`, `Secure`, `SameSite` cookie.
- Database lưu refresh token hash.
- Backend guard kiểm tra RBAC; ẩn UI không phải authorization.
- Rate limit login, register, forgot-password và inquiry.
- DTO validation và output serialization.
- MIME/size validation cho upload.
- Sanitize rich text trước khi render.
- Audit privileged actions.
- `.env` không commit; `.env.example` chỉ chứa tên biến và giá trị giả an toàn.

---

## 8. Performance, accessibility và quality budgets

| Gate | Mục tiêu |
|---|---|
| LCP | `< 2.5s` ở p75 mobile khi có dữ liệu đo |
| INP | `< 200ms` |
| CLS | `< 0.1` |
| Initial client JS | Mục tiêu `< 180KB gzip`, loại trừ lazy route chunks |
| Mobile hero assets | Mục tiêu `< 700KB` tổng scene |
| 3D asset | Mục tiêu `< 2–3MB`, lazy-load |
| Responsive | 320, 375, 768, 1024, 1440px |
| Accessibility | Keyboard, focus, label, alt text, contrast AA, reduced motion |
| SEO | Semantic headings, metadata, canonical, Open Graph, JSON-LD ở phase content |

Build xanh không thay thế browser-visible verification.

---

## 9. Phase roadmap

### P0 — Governance, architecture và master context

**Status: `IMPLEMENTED_UNREVIEWED`**

- [x] Ghi đề thi và nội quy.
- [x] Chốt product scope.
- [x] Chốt modular-monolith architecture.
- [x] Chốt navigation/routes.
- [x] Chốt target tree.
- [x] Chốt AI workflow và authority boundary Phase 1.
- [ ] Paw review/chấp thuận master context.

Completion criterion: Paw xác nhận context đúng hoặc đưa correction cụ thể.

### P1 — Workspace bootstrap và route shells

**Status: `VERIFIED`**

Repair sau independent review ngày 2026-09-27 đã được Codex triển khai và
chạy gate/production regression, evidence ở Entry 002. Paw đã chấp thuận
bản repair và đóng P1 ngày 2026-09-27; approval được ghi ở Entry 003.
Các trạng thái trong Entry 001/002 giữ nguyên như lịch sử bàn giao.
Approval ở Entry 003 chỉ dành cho P1. P2 được Paw mở riêng ở Entry 005 ngày 2026-09-27; xem status P2 bên dưới.

- [x] Giới hạn chiều cao/scroll menu mobile trên màn hình thấp.
- [x] Bổ sung main landmark và skip-link target cho trang 404.
- [x] Sửa contrast thông tin trạng thái POI/FAQ.
- [x] Bổ sung POI filter placeholder đúng scope P1.
- [x] Đồng bộ Node requirement với runtime/tooling đã kiểm tra.
- [x] Sửa hướng dẫn env theo startup thực tế.
- [x] Chạy gate, kiểm tra production và ghi Entry 002.

- [x] Re-inspect workspace.
- [x] Initialize npm workspaces.
- [x] Scaffold `apps/web` và `apps/api`.
- [x] Tạo `packages/contracts` tối thiểu.
- [x] Dựng design tokens và global styles baseline.
- [x] Dựng public header/footer/mobile navigation.
- [x] Dựng homepage shell và cinematic placeholder.
- [x] Dựng sáu public tab routes.
- [x] Dựng auth/account/admin shells.
- [x] Dựng API health module/endpoint.
- [x] Thêm root scripts cho lint/typecheck/build/test.
- [x] Chạy gates và browser smoke test.
- [x] Ghi handoff và dừng.

Completion criterion: toàn bộ route shell render được, navigation hoạt động, web/API build pass, health endpoint trả success, không có feature sâu hoặc database mutation.

### P2 — Design system, cinematic hero và isolated 3D production

**Status: `VERIFIED` — Paw chấp thuận bản local 2.5D ngày 2026-09-28, Entry 008.**

**Owner: Codex — sole writer cho cinematic/3D visual engine.**

Plan chi tiết đã soạn ngày 2026-09-27 tại
[`docs/plans/P2_VISUAL_PLAN.md`](docs/plans/P2_VISUAL_PLAN.md).
Đọc file này khi plan, implement hoặc review P2: gồm visual direction,
source ảnh 2048 × 1365 và provenance còn mở, sáu mốc P2-A đến P2-F,
client-island architecture, asset/motion contracts, ownership và acceptance.
Paw đã duyệt plan và mở P2 trong chat ngày 2026-09-27:
"oke duyệt mày hãy làm đi". Codex triển khai P2-A đến P2-F;
true 3D production vẫn qua go/no-go sau spike. Chi tiết P2 giữ trong file được trỏ tới;
master tiếp tục giữ roadmap, authority và handoff. Prompt giao AI giữ trong chat.

- [x] Component primitives, homepage và sáu public tab có bố cục riêng.
- [x] Hero source/provenance review; license và địa điểm vẫn `UNVERIFIED`, giữ release gate.
- [x] Static/2.5D và native WebGL comparator đã đo; comparator là lower bound, chưa phải hybrid production benchmark. Physical-mobile FPS chưa đo.
- [x] Native polygon layer pipeline, source bất biến, manifest và responsive encoding.
- [x] Cinematic timeline, controls, session, reduced-motion, failure, no-JS và native bfcache fallback.
- [x] Responsive/Chrome/Edge verification và gates implementer; kết quả, giới hạn và exact files ở Entry 006; final shared typography repair/regression ở Entry 007 và plan §11.

Paw chấp thuận kết quả local hiện tại qua chat: "ừm tạm được ròi đó bây giờ kế hoạch tiếp theo là gì".
P2 đóng cho phạm vi đã bàn giao ở Entry 006/007: hero 2.5D, design system và public layouts.
Đây là Paw acceptance, không phải final independent review hoặc release approval.
True 3D production/release vẫn giữ gate riêng. Paw đã mở visual follow-up local:
native WebGL photo meshes trên nền trắng, sky reveal, title có depth và font
uppercase italic. Source cinematic/font được giữ nguyên trong P4; evidence visual
riêng được ghi trong handoff P4, không suy local preview thành release approval.
Quyền ảnh/địa điểm, physical-mobile verification và field vitals vẫn là các mục trước release.
P3 đã `VERIFIED` local theo Entry 013; P4 đang triển khai theo authorization mới.

Completion criterion hiện tại: Paw chấp thuận bản local theo visual contract và evidence Entry 006/007. Production release vẫn cần đóng các giới hạn nguồn ảnh/thiết bị/field measurement; acceptance này không mở nhánh true 3D.

### P3 — PostgreSQL, Prisma và content API

**Status: `VERIFIED` — Codex independent review + final repairs, Entry 013.**

Implementation P3-A đến P3-F đã hoàn thành ngày 2026-09-28 (`IN_PROGRESS` trong lúc code, chuyển `IMPLEMENTED_UNREVIEWED` sau khi hết gate implementer). Database thật PostgreSQL 17.6, Prisma 7.10 ESM, tám content tables, migration deploy trên fresh DB, seed idempotent, 10 public GET endpoints với publication/media visibility, integration tests trên test DB riêng và OpenAPI 3.1. Evidence implementation ở Entry 011; repair/review cuối ở Entry 012/013.
Independent review ngày 2026-09-28 (Codex) đã reproduce 7 findings ngoài baseline green (F1 test-DB guard/reset, F2 publication read/update race, F3 static OpenAPI detail schemas, F4 cursor năm 0000 gây 500, F5 body/day content không bound, F6 Prisma 7 adapter wrapper làm DB-unavailable thành 500, F7 raw exception message lộ qua logger). DeepSeek đã repair đủ 7 findings trên đúng repair write-set, thêm một additive migration `20260927201703_p3_review_repairs` (publishedAt date domain + content bounds, preflight fail-closed) và regression tests tương ứng; evidence/report ở Entry 012. Bản repair đã có Codex independent review; các sửa cuối và gates tại Entry 013. P3 `VERIFIED` cho phạm vi local backend/API, không phải release approval.
Plan lập ngày 2026-09-28 theo yêu cầu bước tiếp theo của Paw. Paw đã mở triển khai P3 qua yêu cầu prompt cho DeepSeek code plan; authorization và ownership ghi ở Entry 010. DeepSeek đã bắt đầu implementation trong session ngày 2026-09-28.
Mục tiêu: database thật, migration/seed tái lập được và public read API cho năm loại nội dung.
Giữ PostgreSQL + Prisma + NestJS modular monolith; dataset nhỏ, không thêm Redis, queue hoặc microservices.

#### P3.1 Phạm vi và luồng

```text
Public GET → Controller/DTO → Publication service → Repository → Prisma → PostgreSQL
                               ↓
                     DTO output trong packages/contracts
```

- P3 chỉ đọc nội dung qua HTTP. Draft/publish/archive là service rule có tests; mutation HTTP chỉ mở cùng authenticated CMS ở P5.
- Auth/session/user tables và tính năng tài khoản thuộc P4; admin CRUD/upload thuộc P5; bind data/search/map lên web thuộc P6.
- Không sửa cinematic engine, hero assets, public layouts hoặc tạo lại scaffold. `/api/v1/health` và `HealthResponse` hiện tại giữ tương thích.
- Code schema/client Prisma chỉ ở API; web nhận shared DTO, không import ORM types/client.
- Trước code phải refresh source/hash/ownership và chốt exact write-set. Candidate: API database/content modules/tests/config, contracts, Compose/env examples, package/lock/scripts và ba tài liệu hiện có. Không phải blanket permission sửa toàn repo.

#### P3.2 Schema tối thiểu cần chốt trước migration

| Bảng | Trách nhiệm và quan hệ |
|---|---|
| `destinations` | Điểm đến; slug unique, title, summary/content, thông tin thực dụng có nguồn. Không suy địa điểm/tọa độ từ ảnh hero |
| `media` | Asset metadata/alt/credit/provenance, trạng thái clearance; chưa làm upload. Chỉ media đủ quyền và an toàn mới xuất ra public DTO |
| `destination_media` | Liên kết điểm đến–media; composite unique, thứ tự và cover rule rõ ràng |
| `experiences` | Trải nghiệm thuộc một destination; FK có index, nội dung riêng |
| `itineraries` | Hành trình gợi ý; có thể đi qua nhiều destination qua các ngày, không ép vào một destination |
| `itinerary_days` | Nội dung từng ngày, FK itinerary; unique `(itineraryId, dayNumber)`, destination tham chiếu có thể null khi chưa xác minh |
| `stories` | Câu chuyện; destination optional để hỗ trợ câu chuyện vùng/cộng đồng |
| `guides` | Cẩm nang; destination optional để hỗ trợ hướng dẫn chung |

Năm bảng nội dung cấp cao có `status`, `publishedAt`, `createdAt`, `updatedAt`; ID/slug/sort keys phải ổn định. Mỗi resource có thể dùng nullable `coverMediaId` FK nếu chỉ cần một cover; không thêm generic owner ID mất FK integrity.
Chốt độ dài/nullability, plain-text hoặc structured blocks, FK/delete policy và publication dependencies trước migration đầu.
Media đang được tham chiếu dùng delete restrict; `destination_media` có thứ tự unique trong từng destination. Không cho xóa destination đang có dependencies mà không có service policy. Cascade itinerary days chỉ trong transaction xóa itinerary đủ điều kiện ở CMS tương lai.
Không xuất raw HTML chưa sanitize. Không tự thêm toàn bộ entity ở §7.2 khi chưa có consumer trong P3.
Index theo query thật: unique slug; `(status, publishedAt, id)` cho list; FK và tổ hợp destination/status khi có filter.

#### P3.3 Contract HTTP dự kiến

| Resource | List | Detail |
|---|---|---|
| Điểm đến | `GET /api/v1/destinations` | `GET /api/v1/destinations/{slug}` |
| Trải nghiệm | `GET /api/v1/experiences` | `GET /api/v1/experiences/{slug}` |
| Hành trình | `GET /api/v1/itineraries` | `GET /api/v1/itineraries/{slug}` |
| Câu chuyện | `GET /api/v1/stories` | `GET /api/v1/stories/{slug}` |
| Cẩm nang | `GET /api/v1/guides` | `GET /api/v1/guides/{slug}` |

- Public GET không yêu cầu login. Không tạo POST/PATCH/DELETE hoặc endpoint publish không có guard.
- List: `{ data: SummaryDto[], pagination: { nextCursor: string | null, hasMore: boolean } }`; detail: `{ data: DetailDto }`. DTO riêng từng resource, camelCase; list không trả full body/nested collections.
- `limit` mặc định 12, tối đa 50; cursor chứa cả timestamp và ID, kiểm cấu trúc/độ dài/filter, sort cố định `publishedAt DESC, id DESC`, không dùng offset. `publishedAt` giữ ổn định trong một lần publication; republish có timestamp mới. Pagination không hứa snapshot consistency khi dữ liệu đổi. Filter `destinationSlug` chỉ ở resource có quan hệ phù hợp; chưa làm search engine.
- Error thống nhất `{ error: { code, message, details? }, requestId }`. Invalid query/cursor: 400; slug không tồn tại/draft/archived: cùng 404; DB không sẵn sàng: 503, không trả SQL/stack/credential. List rỗng: 200, `data: []`.
- Predicate `PUBLISHED` nằm ở repository/service, không nhận public `status` override. Kiểm cả nested relations và destination phụ thuộc; không dùng một query đúng rồi lộ draft qua detail/include.
- Khi archive destination, experience và story/guide gắn destination đó không còn public dù chưa đổi status child. Stories/guides không có destination vẫn có thể public nếu đủ điều kiện riêng. Destination reference của itinerary day là optional: ngày vẫn giữ nội dung, destination link/DTO bị bỏ nếu destination chưa public; không lộ draft hoặc tự ẩn cả itinerary vì optional reference.
- Media chưa clearance hoặc không có assignment hợp lệ không được trả URL qua public API. Public media DTO chỉ có public URL, alt, dimensions và attribution đủ điều kiện; source nội bộ/storage path/private metadata không thuộc DTO. Cover chưa đủ quyền bị bỏ và dùng UI fallback, không tự publish media hoặc trả URL nguồn. Ảnh Pinterest P2 chưa xác minh không tự trở thành published seed media.
- P3 dùng `Cache-Control: no-store` để chưa có cache giữ nội dung đã archive; strategy cache/invalidation được mở khi CMS và public integration có consumer. CORS theo origin allowlist, payload/select bounded, không query N+1.
- P3-A phải chốt OpenAPI 3.1 YAML đầy đủ DTO/query/response/error cho 10 endpoint trước implementation. Swagger sinh từ implementation phải đối chiếu contract này; plan hiện tại không giả là spec đã hoàn thiện.

#### P3.4 Thứ tự triển khai và output

| Mốc | Công việc | Gate trước mốc sau |
|---|---|---|
| P3-A | Refresh workspace; kiểm Docker/port; xác minh compatibility Node 24/Nest 12 ESM/TS 6 với Prisma và pin dependency phù hợp; chốt schema, DTO và OpenAPI | Exact files/ownership + schema/contract được review; không upgrade stack tùy ý |
| P3-B | Compose PostgreSQL local, named volume/healthcheck, API config và Prisma module/connection lifecycle | DB kết nối thật; env example không có secret; không prune/xóa volume có sẵn |
| P3-C | Schema/migration và seed upsert transaction | Fresh dedicated DB migrate sạch; seed hai lần không trùng/ghi đè nội dung đang biên tập; FK/unique/order constraints đúng |
| P3-D | Repository + publication service + output mapping | Unit và real-DB probes cho publication/relations/media/invalid inputs; không đưa mutation lên public HTTP |
| P3-E | Năm module, 10 GET endpoints, pagination/validation/error handling và Swagger | Response đúng contract, published-only tại list/detail/nested, query bounded, health regression pass |
| P3-F | Integration tests, lint/typecheck/test/build; kiểm HTTP thật, self-review và handoff | Exact files/commands/evidence/risks; implementer báo `IMPLEMENTED_UNREVIEWED`, chờ Paw/reviewer đóng P3 |

Seed dùng deterministic keys và quy tắc insert/update rõ, không truncate hoặc xóa toàn DB.
Chỉ publish nội dung du lịch có nguồn đã kiểm; thiếu điểm đến/rights thì giữ draft hoặc API rỗng trung thực.
Fixture DRAFT/PUBLISHED/ARCHIVED, ảnh chưa clearance và nội dung giả dành riêng dedicated test DB/schema, không trộn vào seed public.
Integration tests phải có guard xác nhận test database trước reset; không dùng DB local đang chứa nội dung của Paw.
Negative cases bắt buộc: timestamp trùng, cursor sai/filter đổi, limit quá mức, trang cuối, parent archive sau child publish, optional destination bị ẩn, media mất clearance và seed transaction rollback khi FK lỗi.

- [x] P3-A — Schema/contracts/compatibility/write-set.
- [x] P3-B — PostgreSQL và Prisma lifecycle.
- [x] P3-C — Migration và idempotent seed.
- [x] P3-D — Repository/publication/media visibility rules.
- [x] P3-E — Public GET APIs và Swagger.
- [x] P3-F — Gates, real HTTP evidence và handoff.

Completion criterion: database mới migrate được; seed chạy hai lần đúng chính sách; public API không lộ draft/archive hoặc related/media chưa đủ điều kiện; pagination/invalid-input/DB-error/health regressions pass trên PostgreSQL thật; web/API/contracts build pass. Chưa coi auth/admin/data-bound frontend hoàn thành ở P3.

### P4 — Authentication, RBAC và user area

**Status: `IMPLEMENTED_UNREVIEWED` — P4 source, local integration và browser evidence ở Entry 014.**

**Authorization update 2026-09-28:** Paw giao Codex tự review/fix P3 còn lỗi, note dự án rồi mở P4; đồng thời chỉnh header theo nhóm chức năng mở route riêng, tham khảo Travel nhưng không sao chép. Plan/contract/ownership: [docs/plans/P4_AUTH_PLAN.md](docs/plans/P4_AUTH_PLAN.md). P4 source chỉ mở sau final P3 gates; P5–P7 chưa mở.


- [x] Register/login/refresh/logout.
- [x] Argon2id và rotated refresh sessions.
- [x] User profile.
- [x] Favorites/saved itineraries.
- [x] Inquiry history.
- [x] Route/API authorization tests.

Completion criterion đạt ở local: negative-boundary tests chứng minh USER không vào Editor/Admin API và revoked session không refresh được. P4 chờ Paw review; P5 chưa mở.

### P4b — Northwest editorial homepage và product navigation

**Status: `IMPLEMENTED_UNREVIEWED` — source, production build và browser gates xong tại Entry 015; P5/P6 master giữ nguyên trạng thái.**

**UX/UI guardrails chống AI slop (áp dụng cho P4b và các màn hình tiếp theo).** “Slop” là nội dung số chất lượng thấp được AI sản xuất hàng loạt theo [Merriam-Webster](https://www.merriam-webster.com/dictionary/slop). [NN/g](https://www.nngroup.com/articles/ai-prototyping/) ghi nhận prototype AI thiếu brief cụ thể dễ có diện mạo đại trà và lỗi visual hierarchy/contrast/spacing. Vì vậy reviewer phải xét từng màn hình theo tiêu chí sau, không chỉ nhìn build pass:

- Một trang có **một tác vụ chính** và một kết quả có ích: bài điểm đến để đọc, tour để lọc, vé để lập đường đi, khách sạn để kiểm tra tiêu chí, combo để tạo bản nháp, dịch vụ để soạn nhu cầu. Nav không cuộn đến section thay cho route.
- Nội dung gọi đúng địa danh và đặc điểm riêng; câu chữ có nguồn. Không lặp đoạn mô tả chung cho 10 card, không bịa giá, rating, số chỗ, lịch khởi hành hoặc lời chứng thực.
- Ngôn ngữ hình ảnh Tây Bắc dùng typography biên tập, nền giấy sáng, sắc rừng/đất và ảnh địa điểm thật có quyền sử dụng. Minh họa phải ghi rõ là minh họa; không tải ảnh/asset từ đối thủ rồi thay logo.
- Card có hierarchy nhất quán: địa danh, vùng, nét cảnh quan, mô tả ngắn, lối vào bài. Nhịp section và khoảng trắng phục vụ đọc/so sánh; tránh gradient, kính mờ, icon/badge trang trí lặp vô nghĩa.
- Chức năng dùng được bằng bàn phím, screen reader và khi giảm chuyển động; mobile 1 card, tablet 2, desktop 4. Ảnh card/bài dùng WebP tĩnh đã cắt kích thước qua Next Image `unoptimized` để tránh request chuyển ảnh lúc xem trang; không thêm 3D/animation chặn đọc nội dung hoặc làm tăng tải không cần thiết.
- Sau code phải kiểm tra UI production ở nhiều viewport, thao tác nav/card/carousel bằng trình duyệt, và tự hỏi: chi tiết nào chỉ thuộc về Tây Bắc và người dùng dự án này? Nếu thay tên brand mà trang vẫn giống site mẫu, phải chỉnh lại.

- [x] Trang chủ có section Tây Bắc rõ thứ bậc và 10 bài địa điểm có nguồn; carousel hiển thị 4 card desktop, 2 tablet, 1 mobile với nút trước/sau.
- [x] Card dẫn tới bài chi tiết; ảnh có giấy phép và attribution, nơi thiếu ảnh dùng minh họa ghi rõ.
- [x] Năm mục main navigation theo §5.1 dẫn tới năm route/chức năng riêng, không anchor scroll hay booking giả.
- [x] Local Git snapshot và commit thay đổi trước final build; kiểm tra route, responsive, keyboard và browser.

Completion criterion: 10 bài có trang riêng, carousel và cả năm route hoạt động trên production build; ảnh và nội dung có nguồn; không sao chép bố cục/asset/copy từ Travel.com.vn.

### P5 — Admin/Editor CMS

**Status: `NOT_STARTED`**

- [ ] Admin dashboard.
- [ ] Destination/experience/itinerary/story/guide CRUD.
- [ ] Media upload/use protection.
- [ ] Publish workflow.
- [ ] User/role/status management.
- [ ] Inquiry processing.
- [ ] Audit log.

Completion criterion: Editor/Admin matrix đúng, content publish xuất hiện ở public API, unauthorized mutation bị từ chối.

### P6 — Public data integration, map và itinerary UX

**Status: `NOT_STARTED`**

- [ ] Bind public pages với API.
- [ ] Loading/empty/error states.
- [ ] Search/filter.
- [ ] Lazy interactive map + list fallback.
- [ ] Itinerary detail/builder.
- [ ] SEO metadata và structured data.

Completion criterion: user journey từ Home tới save/inquiry chạy end-to-end.

### P7 — Hardening, deployment và contest demo

**Status: `NOT_STARTED`**

- [ ] Security review.
- [ ] Performance/bundle audit.
- [ ] Accessibility audit.
- [ ] Cross-browser/mobile-device verification.
- [ ] Production environment/deployment.
- [ ] Backup/restore drill tối thiểu.
- [ ] Demo script và fallback build.

Completion criterion: deploy có evidence, demo không phụ thuộc service không kiểm soát, known risks được ghi rõ.

---

## 10. Phase 1 authority boundary

DeepSeek được phép trong Phase 1:

- Tạo file/folder nằm trong `D:\webdulich` để scaffold monorepo.
- Cài dependency cần thiết cho Next.js/NestJS/npm workspaces.
- Dựng UI shell, route placeholder, API health endpoint và shared contract tối thiểu.
- Sửa phần `P1` và `Agent handoff ledger` trong file này để phản ánh evidence thực tế.

DeepSeek phải dừng trước các boundary sau:

- Không tạo Prisma schema nghiệp vụ hoặc migration.
- Không chạy PostgreSQL container.
- Không làm auth token/password/session.
- Không làm admin CRUD.
- Không tích hợp S3/Cloudinary.
- Không cài Three.js/GSAP/MapLibre trong Phase 1.
- Không tạo ảnh AI hoặc copy asset từ website tham khảo.
- Không implement fake booking/payment.
- Không implement hoặc chỉnh sửa P2 cinematic/3D visual engine; phần này thuộc sole-writer ownership của Codex.
- Không commit Git.
- Không tự chuyển P2.

Nếu scaffold tool tạo code ngoài scope, DeepSeek phải xóa phần scaffold dư bằng thay đổi có kiểm soát hoặc báo cáo rõ, không âm thầm giữ dependency/code vô dụng.

---

## 11. Phase 1 Definition of Done

P1 chỉ được báo `IMPLEMENTED_UNREVIEWED` khi tất cả điều kiện sau có evidence:

### Repository

- Root npm workspaces nhận diện `apps/*` và `packages/*` cần thiết.
- Root scripts chạy được hoặc delegate chính xác xuống workspace.
- `.gitignore`, `.editorconfig`, `.env.example` không chứa secret.
- README ghi command thật đã kiểm tra.

### Web

- `/`
- `/kham-pha`
- `/trai-nghiem`
- `/hanh-trinh`
- `/ban-do`
- `/chuyen-ban-dia`
- `/cam-nang`
- `/dang-nhap`
- `/dang-ky`
- `/tai-khoan`
- `/admin`

Tất cả route trên phải render HTTP success hoặc framework-equivalent success trong production build.

- Header/footer dùng chung.
- Desktop/mobile navigation không có broken link.
- Active state đúng.
- Hero placeholder giữ đúng layering contract.
- Auth/account/admin chỉ là shell và ghi rõ feature phase sau.
- Không có horizontal overflow ở viewport được test.
- Không có console/hydration error trong browser smoke test.

### API

- NestJS app boot được.
- API prefix `/api/v1`.
- `GET /api/v1/health` trả status rõ ràng.
- Không có database connection trong P1.
- Không có auth stub giả mạo.

### Gates

AI phải phát hiện scripts thật trong `package.json`, sau đó chạy gate tương ứng. Mục tiêu tối thiểu:

```powershell
npm install
npm run lint
npm run typecheck
npm run test
npm run build
```

Nếu script chưa tồn tại, AI phải tạo script rõ ràng hoặc báo vì sao gate không áp dụng. Không được nói “pass” cho command chưa chạy.

### Handoff

- Exact file list.
- Commands + exit codes.
- Browser routes/viewports đã kiểm tra.
- Known limitations.
- Status cuối: `IMPLEMENTED_UNREVIEWED` hoặc `BLOCKED`.
- Dừng, chờ Paw/Codex review.

---

## 12. Review rubric cho Codex/Paw sau khi implementation agent bàn giao

### Architecture

- Đúng workspace boundary.
- Không duplicate navigation/data configuration.
- Không nhét API/domain logic vào page.
- Không thêm dependency ngoài nhu cầu P1.
- Không có dead scaffold hoặc example code không liên quan.

### UX

- Shell nhìn có chủ đích, không phải default template nguyên bản.
- Header/mobile menu usable.
- Route hierarchy nhất quán.
- Placeholder thể hiện đúng bố cục tương lai.
- Admin/public/account có visual boundary rõ.

### Quality

- TypeScript strict không bị vô hiệu hóa.
- Không dùng `any` để né lỗi cốt lõi.
- Link/button semantic đúng.
- Form label đúng.
- Không hydration mismatch.
- Error/loading/not-found state tồn tại.

### Scope

- Không implement feature của P2+.
- Không thêm fake backend behavior.
- Không tạo database migration.
- Không commit.

### Verdict

Codex/Paw dùng một trong ba verdict:

- `PASS_TO_NEXT_PHASE`
- `REPAIR_P1`
- `REJECT_AND_REPLAN`

Chỉ Paw được phép khởi động phase tiếp theo.

---

## 13. Agent handoff ledger

Append entry mới; không sửa lịch sử entry cũ.

### Entry 000 — Master context creation

| Field | Value |
|---|---|
| Date | 2026-09-27 |
| Agent | Codex |
| Phase | P0 |
| Status | `IMPLEMENTED_UNREVIEWED` |
| Scope | Tạo đề thi, nội quy, architecture, route contracts, roadmap và P1 Definition of Done |
| Files changed | `D:\webdulich\AI_PROJECT_CONTROL.md` |
| Verification | Direct-source review passed: 868 lines, 24 balanced Markdown fences, all required sections/routes present, UTF-8 clean, no null byte; execution instructions are kept outside this file |
| Risk | Exact destination chưa được chọn; content facts/assets chưa được cung cấp; P1 không phụ thuộc hai đầu vào này |
| Next authorized work | Paw review document, sau đó giao P1 cho implementation agent |

### Entry 001 — P1 workspace bootstrap và route shells

| Field | Value |
|---|---|
| Date | 2026-09-27 |
| Agent | DeepSeek (opencode CLI) |
| Phase | P1 |
| Status | `IMPLEMENTED_UNREVIEWED` |
| Scope | npm workspace monorepo; Next.js App Router route shells (public/auth/account/admin); NestJS health endpoint `/api/v1/health`; shared `HealthResponse` contract; design tokens; loading/error/not-found; root gates. Không database, auth, CRUD, map, 3D/animation, booking/payment, P2. |
| Files changed | 101 file tạo mới (gồm `package-lock.json`); sửa `AI_PROJECT_CONTROL.md`. Danh sách exact paths bên dưới. |
| Dependencies added | web: `next@16.3.6`, `react`/`react-dom@19.3.0`, `tailwindcss@4.3.3` + `@tailwindcss/postcss@4.3.3`, `eslint@9.39.5` + `eslint-config-next@16.3.6`, `typescript@~6.0.3`, `@types/*`. api: `@nestjs/common|core|platform-express@12.1.0`, `reflect-metadata@0.2.2`, `rxjs@7.8.2`, `@webdulich/contracts` (workspace), `jest@30.5.2`, `ts-jest@29.4.14`, `supertest@7.3.0`, `@nestjs/cli|schematics|testing`, `eslint@9.39.5`, `@eslint/js@9.39.5`, `typescript-eslint@8.70.1`, `globals@17.12.0`, `typescript@~6.0.3`, `@types/*`. contracts: `typescript@~6.0.3`. |
| Commands run | `npm install` exit 0; `npm run lint` exit 0; `npm run typecheck` exit 0; `npm run test` exit 0 (unit 1/1 + e2e 1/1); `npm run build` exit 0 (contracts → api → web, 27 route tĩnh); `node dist/main.js` + `GET /api/v1/health` → HTTP 200 |
| Browser verification | Chrome headless CDP trên production build (`next start`): 11 route × 5 viewport (320/375/768/1024/1440) = 55 lượt — 0 hard failure; 0 console error/exception; 0 horizontal overflow; h1 đúng từng route; active nav đúng; mobile menu mở/đóng bằng close button, Escape, chọn link + focus quay về nút mở; 24 internal link 0 broken; no-JS HTML chứa H1 + CTA + skip link; ảnh chụp lưu tại temp `p1-shots` (không nằm trong repo). |
| Risks | NestJS 12 ESM-only → api dùng `"type": "module"` + `nodenext`; jest chạy bằng `--experimental-vm-modules` (cần lưu ý khi lên CI). ESLint 9.39.5 đã EOL nhưng chưa lên được 10 vì plugin con của `eslint-config-next` cap peer `^9`. Tên hiển thị "Vùng sâu vùng xa" là working title (open decision §14). Web chưa có unit test — shell được verify bằng browser smoke. `packages/ui`, `packages/eslint-config`, `packages/tsconfig` chưa tạo vì chưa có consumer thật. |
| Next authorized work | Paw/Codex review P1. Không bắt đầu P2. |

Exact paths tạo mới (tính từ `D:\webdulich\`):

```text
package.json
package-lock.json
README.md
.gitignore
.editorconfig
.env.example
packages/contracts/package.json
packages/contracts/tsconfig.json
packages/contracts/src/index.ts
apps/api/package.json
apps/api/nest-cli.json
apps/api/tsconfig.json
apps/api/tsconfig.build.json
apps/api/eslint.config.mjs
apps/api/src/main.ts
apps/api/src/app.setup.ts
apps/api/src/app.module.ts
apps/api/src/modules/health/health.module.ts
apps/api/src/modules/health/health.controller.ts
apps/api/src/modules/health/health.service.ts
apps/api/src/modules/health/health.service.spec.ts
apps/api/test/health.e2e-spec.ts
apps/api/test/jest-e2e.json
apps/web/package.json
apps/web/next.config.ts
apps/web/tsconfig.json
apps/web/postcss.config.mjs
apps/web/eslint.config.mjs
apps/web/next-env.d.ts
apps/web/src/styles/globals.css
apps/web/src/config/site.ts
apps/web/src/config/navigation.ts
apps/web/src/lib/cx.ts
apps/web/src/app/layout.tsx
apps/web/src/app/loading.tsx
apps/web/src/app/error.tsx
apps/web/src/app/not-found.tsx
apps/web/src/app/icon.svg
apps/web/src/app/(public)/layout.tsx
apps/web/src/app/(public)/page.tsx
apps/web/src/app/(public)/kham-pha/page.tsx
apps/web/src/app/(public)/trai-nghiem/page.tsx
apps/web/src/app/(public)/hanh-trinh/page.tsx
apps/web/src/app/(public)/ban-do/page.tsx
apps/web/src/app/(public)/chuyen-ban-dia/page.tsx
apps/web/src/app/(public)/cam-nang/page.tsx
apps/web/src/app/(auth)/layout.tsx
apps/web/src/app/(auth)/dang-nhap/page.tsx
apps/web/src/app/(auth)/dang-ky/page.tsx
apps/web/src/app/(account)/tai-khoan/layout.tsx
apps/web/src/app/(account)/tai-khoan/page.tsx
apps/web/src/app/(account)/tai-khoan/yeu-thich/page.tsx
apps/web/src/app/(account)/tai-khoan/hanh-trinh-da-luu/page.tsx
apps/web/src/app/(account)/tai-khoan/yeu-cau-tu-van/page.tsx
apps/web/src/app/(account)/tai-khoan/bao-mat/page.tsx
apps/web/src/app/admin/layout.tsx
apps/web/src/app/admin/page.tsx
apps/web/src/app/admin/diem-den/page.tsx
apps/web/src/app/admin/trai-nghiem/page.tsx
apps/web/src/app/admin/hanh-trinh/page.tsx
apps/web/src/app/admin/chuyen-ban-dia/page.tsx
apps/web/src/app/admin/cam-nang/page.tsx
apps/web/src/app/admin/media/page.tsx
apps/web/src/app/admin/yeu-cau/page.tsx
apps/web/src/app/admin/nguoi-dung/page.tsx
apps/web/src/app/admin/audit-log/page.tsx
apps/web/src/components/layout/site-header.tsx
apps/web/src/components/layout/site-footer.tsx
apps/web/src/components/layout/mobile-nav.tsx
apps/web/src/components/navigation/desktop-nav.tsx
apps/web/src/components/navigation/nav-link.tsx
apps/web/src/components/placeholders/cinematic-hero.tsx
apps/web/src/components/placeholders/placeholder-card.tsx
apps/web/src/components/placeholders/responsible-travel.tsx
apps/web/src/components/placeholders/final-cta.tsx
apps/web/src/components/ui/badge.tsx
apps/web/src/components/ui/cta-link.tsx
apps/web/src/components/ui/empty-state.tsx
apps/web/src/components/ui/loading-state.tsx
apps/web/src/components/ui/page-heading.tsx
apps/web/src/components/ui/page-hero.tsx
apps/web/src/components/ui/section.tsx
apps/web/src/features/destinations/filter-bar-placeholder.tsx
apps/web/src/features/destinations/destination-grid-placeholder.tsx
apps/web/src/features/experiences/category-chips-placeholder.tsx
apps/web/src/features/experiences/experience-grid-placeholder.tsx
apps/web/src/features/experiences/editorial-feature-placeholder.tsx
apps/web/src/features/itineraries/itinerary-filters-placeholder.tsx
apps/web/src/features/itineraries/itinerary-cards-placeholder.tsx
apps/web/src/features/itineraries/trip-planner-placeholder.tsx
apps/web/src/features/map/map-frame-placeholder.tsx
apps/web/src/features/map/poi-list-placeholder.tsx
apps/web/src/features/map/map-teaser-placeholder.tsx
apps/web/src/features/stories/lead-story-placeholder.tsx
apps/web/src/features/stories/story-card-placeholder.tsx
apps/web/src/features/guides/guide-topic-placeholder.tsx
apps/web/src/features/guides/faq-placeholder.tsx
apps/web/src/features/auth/auth-form-shell.tsx
apps/web/src/features/account/account-nav.tsx
apps/web/src/features/admin/admin-nav.tsx
apps/web/src/features/admin/module-placeholder.tsx
```

### Entry 002 — P1 repair sau independent review

| Field | Value |
|---|---|
| Date | 2026-09-27 |
| Agent | Codex; worker riêng cho map/contrast; verification browser và config/docs riêng |
| Phase | P1 — repair sáu findings của Entry 001 |
| Status | `IMPLEMENTED_UNREVIEWED` |
| Scope | Menu mobile màn hình thấp, 404 landmark/skip-link, contrast POI/FAQ, POI filter placeholder, Node engine requirement và hướng dẫn env. P2 vẫn `NOT_STARTED`. |
| Files changed | 10 file sửa và 1 file mới; exact paths bên dưới. Không sửa source API/contracts hoặc dependency version/integrity. |
| Dependencies added | Không có. `package.json` và root `packages[""].engines.node` trong lockfile cùng đổi thành `^24.18.0`; reverse-substitution SHA-256 khớp baseline, chứng minh hai file không có thay đổi khác. |
| Commands run | Focused ESLint menu/404 exit 0; `npm run lint` exit 0; `npm run typecheck` exit 0; `npm run test` exit 0 (1 unit + 1 e2e); `npm run build` exit 0; production web qua `npm run start --workspace @webdulich/web -- --port 3100 --hostname 127.0.0.1`; API qua `PORT=3101` và `npm run start:prod --workspace @webdulich/api`; health HTTP 200 đúng contract. |
| Browser verification | Production Chrome headless: 24 route × 320/375/768/1024/1440px = 120 lượt; 790 hard assertions, 0 failed, harness exit 0. 0 document overflow, 0 active-nav mismatch, 0 unexpected console/hydration/runtime error; 24 internal link HTTP 200. |
| Focused regression | Menu 375×320: panel y=64–320; scrollTop 0→150 trong khi document scrollY giữ 0; Đăng nhập focus y=277–319 hiển thị. 375×568 cùng Escape/close/navigation/focus restoration pass. Ba 404 root/admin/account có một main, skip-link focus đúng main. POI/FAQ contrast thực tế 6.1673:1 trên white. Filter có fieldset/legend/description và sáu native disabled button; không có filter giả hoặc map runtime. No-JS home/map/404 pass. |
| Source integrity | Source inventory trước repair 102 file; sau repair 103 file. Đúng 10 file sửa + 1 file mới, không file xóa hoặc thay đổi ngoài phạm vi. Entry 001 được giữ nguyên; không Git commit/init. |
| Artifacts | Ngoài repository tại `C:\Users\DELL\AppData\Local\Temp\p1-regression-browser-612d870862914a7491ef6b918c9985b3\`: `report.json`, `regression.mjs` và screenshots. Review Chrome/Next/Nest đã đóng sau kiểm tra. |
| Risks | Chưa kiểm trên điện thoại vật lý. Node range chủ đích thu hẹp về 24.x từ 24.18.0, runtime được chạy thực tế là 24.18.0. Jest còn ExperimentalWarning của VM modules. Chưa có acceptance cho P2/cinematic hoặc performance trên thiết bị thật. |
| Next authorized work | Paw/Codex review/chấp thuận bản repair P1; chỉ Paw được mở P2. |

Exact paths sửa (tính từ `D:\webdulich\`):

```text
package.json
package-lock.json
README.md
.env.example
AI_PROJECT_CONTROL.md
apps/web/src/components/layout/mobile-nav.tsx
apps/web/src/app/not-found.tsx
apps/web/src/features/map/poi-list-placeholder.tsx
apps/web/src/features/guides/faq-placeholder.tsx
apps/web/src/app/(public)/ban-do/page.tsx
```

Exact path tạo mới:

```text
apps/web/src/features/map/poi-filters-placeholder.tsx
```

### Entry 003 — Paw chấp thuận và đóng P1

| Field | Value |
|---|---|
| Date | 2026-09-27 |
| Agent | Codex ghi nhận quyết định của Paw |
| Phase | P1 |
| Status | `VERIFIED` |
| Approval | Paw xác nhận trong chat: "oke tao chấp thuận ròi đó" sau báo cáo repair P1 và xác nhận không còn việc treo trong phạm vi review. |
| Evidence basis | Independent review Entry 001, sáu findings đã repair và gate/production regression của Entry 002. |
| Files changed | `AI_PROJECT_CONTROL.md`: trạng thái P1 và entry approval; `README.md`: trạng thái hiện tại. Không thay đổi source/config/dependency. |
| Verification | Kiểm tra trạng thái P1/README nhất quán, P2 vẫn `NOT_STARTED`, ledger cũ được giữ nguyên và Markdown fences cân bằng. Không chạy lại runtime gates cho thay đổi chỉ ở tài liệu. |
| Next authorized work | P1 đóng. Chờ Paw mở P2; approval P1 không tự khởi động phase tiếp theo. |

### Entry 004 — Plan chi tiết P2, chưa triển khai

| Field | Value |
|---|---|
| Date | 2026-09-27 |
| Agent | Codex; read-only agent góp ý acceptance/performance protocol |
| Phase | Chuẩn bị P2 — planning only |
| Status | `IMPLEMENTED_UNREVIEWED` — chỉ tài liệu plan; P2 implementation vẫn `NOT_STARTED` |
| Authorization | Paw yêu cầu trong chat: "oke vậy mày hãy làm plan tiếp theo đi". Scope là lập plan, chưa mở source/asset implementation. |
| Scope | Visual/page compositions, 2.5D hero và optional true 3D spike, source/provenance, layer/motion lifecycle, sáu mốc triển khai, ownership/write boundaries, performance và regression protocol. |
| Files changed | Sửa `D:\webdulich\AI_PROJECT_CONTROL.md` để trỏ plan và append ledger; tạo `D:\webdulich\docs\plans\P2_VISUAL_PLAN.md`. Không sửa source/config/dependency hoặc ảnh. |
| Dependencies added | Không có. Native CSS/Web Animations API là đề xuất mặc định; lựa chọn runtime cuối qua spike. |
| Verification | Đọc master/source/config trực tiếp sau graph coverage; kiểm document links/status/checklist/fences, hash phạm vi tài liệu và lịch sử Entry 000–003. Không chạy lint/test/build/browser cho thay đổi tài liệu; các performance số là target/protocol, chưa phải kết quả P2. |
| Risks | Quyền sử dụng/biến đổi và địa điểm ảnh chưa xác minh; 2048px không bảo đảm độ nét 4K/retina; masking/hidden background và memory cần spike; chưa có mobile-device FPS. |
| Next authorized work | Paw review plan. Khi Paw mở P2: bắt đầu P2-A reference/source/provenance, rồi P2-B prototype và measurement; chưa chuyển P3. |

### Entry 005 — Paw duyệt plan và mở P2

| Field | Value |
|---|---|
| Date | 2026-09-27 |
| Agent | Codex |
| Phase | P2 |
| Status | `IN_PROGRESS` |
| Approval | Paw: "oke duyệt mày hãy làm đi" sau bản plan P2. |
| Scope | P2-A đến P2-F theo `docs/plans/P2_VISUAL_PLAN.md`; Codex sole writer cinematic/3D. Không mở P3. True 3D production giữ go/no-go riêng sau spike. |
| Baseline | 104 file ngoài dependencies/generated, chưa có Git; Node 24.18.0, Next 16.3.6, React 19.3.0. Source ảnh checksum giữ nguyên; lịch sử Entry 000–004 được bảo toàn. |
| Next authorized work | Thực hiện P2 theo thứ tự, ghi decision/evidence và handoff sau verification. |

### Entry 006 — P2 cinematic 2.5D, public visual layouts và evidence

| Field | Value |
|---|---|
| Date | 2026-09-27, Asia/Saigon |
| Agent | Codex root, sole writer cinematic/3D; worker nhận public UI write-set riêng; bounded read-only reviewers |
| Phase | P2-A đến P2-F — local implementation và handoff |
| Status | `IMPLEMENTED_UNREVIEWED` |
| Authority | Paw mở P2 ở Entry 005; lệnh tiếp tục trong chat. Không mở P3, không tự đóng P2 hoặc duyệt true 3D production. |
| Scope | Native CSS/WAAPI photo-depth hero, source/provenance/manifest, controls/session/fallback lifecycle, design primitives và sáu public tab; benchmark-only native WebGL comparator ngoài production imports. |
| Files changed | Baseline 104 → current 119 file ngoài generated/dependencies: đúng 38 sửa + 16 mới + 1 xóa; danh sách literal bên dưới. |
| Dependencies added | Không. Root/web/API/contracts package và lock giữ nguyên. Không Three.js/R3F/Drei/GSAP/Motion dependency. |
| Commands run | npm run lint/typecheck/build: exit 0 trên source cuối. npm run test: exit 0 trong P2, API health unit/e2e; API source unchanged. verify-assets/build-manifest: exit 0; manifest deterministic. |
| Browser verification | Chrome 192 route/viewport checks, 1225 assertions; Edge 20 route checks; 12 lifecycle cases/31 assertions; native persisted bfcache; 5 error/focus cases được audit; final build M5: 55 acceptance assertions, 8 hero viewports, 3 no-JS routes, cold-tab assets, 278 rendered frames, 54 contrast checks. Chi tiết version/phạm vi ở plan §11. |
| Final production build | `M5xMr2LYLWEQNBbD2ioMa`; browser-cold mobile 7 runs LCP median 2068 ms, range 2060–2088; desktop 7 runs median 200 ms, range 180–1556; 7/7 intro ở mỗi profile; 0 runtime/hydration errors. |
| Performance | Initial actually requested JS gzip mobile 148506 B/desktop 152111 B; mobile delta P1 +8898 B. Hero WebP body 201376 B (poster 161584 + sky 39792). CLS mobile 0.0009000764/desktop 0.0001209272. Lab menu/control EventTiming max 80 ms; field INP/LCP p75/physical-device FPS UNMEASURED. |
| Asset evidence | Source/public original JPEG cùng SHA provenance, 2048 × 1365/267143 B. q90 pilot LCP 3072 ms fail → q75 ở cùng 1920 px responsive variant, lossy encode có review. Native nested masks dùng cùng currentSrc; sky plate có synthetic metadata. Không claim 4K, recovered terrain hoặc lossless delivery. |
| Repairs | Strips/gaps → overlap và bounded lift; WAAPI exception rollback; reduced-motion control focus; pagehide finish tránh bfcache replay; bỏ global loading boundary để no-JS HTML visible và thêm no-JS nav; eyebrow backdrop contrast; một serif thống nhất tránh mixed-font Vietnamese glyph spacing. |
| Source integrity | 19 protected API/contracts/package/lock files hash unchanged; không source mutation ngoài inventory, không Git init/commit/push. Entry 000–005 giữ nguyên. Graph Tier 2 generation 09:29:26Z stale/new paths; source reads/hash/browser là fallback, không suy tính đầy đủ từ graph. |
| Review state | Bounded source review có findings đã root reproduce/repair. Agent usage quota dừng trước final independent review; root self-review/gates không phải independent approval. |
| 3D decision | Khuyến nghị giữ 2.5D. Native comparator 24576 vertices/589824 B geometry RAM, 1688 B gzip script CDP, 14 GPU desktop activations; không texture/model/R3F overhead hoặc phone FPS. Paw go/no-go còn mở; không production 3D. |
| Artifacts | `C:\Users\DELL\AppData\Local\Temp\p2-final-1790520974394`; final-desktop/mobile/fullpage, rendered filmstrip, raw reports/scripts; baseline và version mapping ở plan §11. |
| Risks | Ảnh license/location UNVERIFIED: local preview, chưa nộp/deploy. Overlapping silhouettes chỉ approximate depth. Physical-phone/Safari/iOS/Android và field vitals chưa đo; startup long tasks/desktop variance giữ raw. Android/iOS font mapping chưa kiểm. Final independent/Paw review chưa có. |
| Process cleanup | Test-owned production server và headless browsers được dừng sau verification; không kill browser của Paw. |
| Next authorized work | Paw/reviewer kiểm bản P2 và chốt 3D/source rights. P3 PostgreSQL/Prisma/content API vẫn NOT_STARTED; chỉ bắt đầu khi Paw mở phase. |

**Files modified — 38:**

- `D:\webdulich\AI_PROJECT_CONTROL.md`
- `D:\webdulich\apps\web\next.config.ts`
- `D:\webdulich\apps\web\src\app\(public)\ban-do\page.tsx`
- `D:\webdulich\apps\web\src\app\(public)\cam-nang\page.tsx`
- `D:\webdulich\apps\web\src\app\(public)\chuyen-ban-dia\page.tsx`
- `D:\webdulich\apps\web\src\app\(public)\hanh-trinh\page.tsx`
- `D:\webdulich\apps\web\src\app\(public)\kham-pha\page.tsx`
- `D:\webdulich\apps\web\src\app\(public)\page.tsx`
- `D:\webdulich\apps\web\src\app\(public)\trai-nghiem\page.tsx`
- `D:\webdulich\apps\web\src\components\layout\mobile-nav.tsx`
- `D:\webdulich\apps\web\src\components\layout\site-footer.tsx`
- `D:\webdulich\apps\web\src\components\layout\site-header.tsx`
- `D:\webdulich\apps\web\src\components\navigation\desktop-nav.tsx`
- `D:\webdulich\apps\web\src\components\placeholders\final-cta.tsx`
- `D:\webdulich\apps\web\src\components\placeholders\placeholder-card.tsx`
- `D:\webdulich\apps\web\src\components\placeholders\responsible-travel.tsx`
- `D:\webdulich\apps\web\src\components\ui\cta-link.tsx`
- `D:\webdulich\apps\web\src\components\ui\page-hero.tsx`
- `D:\webdulich\apps\web\src\components\ui\section.tsx`
- `D:\webdulich\apps\web\src\features\destinations\destination-grid-placeholder.tsx`
- `D:\webdulich\apps\web\src\features\destinations\filter-bar-placeholder.tsx`
- `D:\webdulich\apps\web\src\features\experiences\category-chips-placeholder.tsx`
- `D:\webdulich\apps\web\src\features\experiences\editorial-feature-placeholder.tsx`
- `D:\webdulich\apps\web\src\features\experiences\experience-grid-placeholder.tsx`
- `D:\webdulich\apps\web\src\features\guides\faq-placeholder.tsx`
- `D:\webdulich\apps\web\src\features\guides\guide-topic-placeholder.tsx`
- `D:\webdulich\apps\web\src\features\itineraries\itinerary-cards-placeholder.tsx`
- `D:\webdulich\apps\web\src\features\itineraries\itinerary-filters-placeholder.tsx`
- `D:\webdulich\apps\web\src\features\itineraries\trip-planner-placeholder.tsx`
- `D:\webdulich\apps\web\src\features\map\map-frame-placeholder.tsx`
- `D:\webdulich\apps\web\src\features\map\map-teaser-placeholder.tsx`
- `D:\webdulich\apps\web\src\features\map\poi-filters-placeholder.tsx`
- `D:\webdulich\apps\web\src\features\map\poi-list-placeholder.tsx`
- `D:\webdulich\apps\web\src\features\stories\lead-story-placeholder.tsx`
- `D:\webdulich\apps\web\src\features\stories\story-card-placeholder.tsx`
- `D:\webdulich\apps\web\src\styles\globals.css`
- `D:\webdulich\docs\plans\P2_VISUAL_PLAN.md`
- `D:\webdulich\README.md`

**Files created — 16:**

- `D:\webdulich\apps\web\public\images\hero\manifest.json`
- `D:\webdulich\apps\web\public\images\hero\sky-generated.png`
- `D:\webdulich\apps\web\public\images\hero\terraces.jpg`
- `D:\webdulich\apps\web\src\components\ui\landscape-art.tsx`
- `D:\webdulich\apps\web\src\features\cinematic\cinematic-hero.tsx`
- `D:\webdulich\apps\web\src\features\cinematic\cinematic-scene.tsx`
- `D:\webdulich\apps\web\src\features\cinematic\cinematic.module.css`
- `D:\webdulich\apps\web\src\features\cinematic\scene-config.ts`
- `D:\webdulich\apps\web\src\features\cinematic\use-cinematic-controller.ts`
- `D:\webdulich\assets\hero\README.md`
- `D:\webdulich\assets\hero\source\original.jpg`
- `D:\webdulich\assets\hero\source\provenance.json`
- `D:\webdulich\assets\hero\work\sky-generated.png`
- `D:\webdulich\scripts\hero\build-manifest.mjs`
- `D:\webdulich\scripts\hero\terrain-spike.mjs`
- `D:\webdulich\scripts\hero\verify-assets.mjs`

**Files deleted — 1:**

- `D:\webdulich\apps\web\src\app\loading.tsx`

Deletion rationale: global loading boundary khiến nội dung streamed ẩn trong no-JS probe. Các route hiện static; bỏ boundary để HTML visible. Future async loading chỉ đặt ở vùng dữ liệu thật sự cần, bên dưới shell/fallback, với no-JS visibility gate.

### Entry 007 — P2 final shared display-font repair và regression

| Field | Value |
|---|---|
| Date | 2026-09-27, Asia/Saigon |
| Agent | Codex root; P2 sole writer |
| Phase | P2 — repair cuối; không mở phase mới |
| Status | `IMPLEMENTED_UNREVIEWED` |
| Problem/result | Georgia thiếu một số glyph tiếng Việt trên browser Windows, tạo mixed-font spacing trong headings. Chuyển shared display token sang Times New Roman/Noto Serif/serif; hero dùng lại token. Body sans và display serif là hai rendered families trên browser đã kiểm, không thêm font download. |
| Scope | Shared font token/CSS hero và docs/evidence. Không sửa controller/timeline/masks/assets/package/API/contracts/auth/admin/data. Entry 000–006 giữ nguyên; Entry 006 là snapshot M5 trước repair này. |
| Files changed | Sáu file sửa, literal list bên dưới. Cumulative P2 vẫn 38 modified +16 created +1 deleted,119 files; inventory Entry 006 vẫn đúng. |
| Dependencies added | Không |
| Commands run | npm run build/lint/typecheck: exit0 sau shared-token repair. API test pass trước đó, source không đổi; không dùng health tests thay UI acceptance. |
| Browser verification | Final build `AELZZd0hE05pj7T59B85c`: Chrome192 route/viewport checks +1225 assertions; Edge20 route checks +no-JS; final hero83 assertions/8viewports/3no-JS routes/28public-font checks/273rendered frames; contrast54 checks/0failures (large min3.111, small min4.955). |
| Final performance | Mobile7 cold runs LCP median2080 ms/range2040–2104; desktop7 median216 ms/range208–248;7/7 completed intro mỗi profile;0 runtime/hydration errors. Initial JS gzip148506 B mobile/152111 B desktop, hero body201376 B, CLS0.0009000764/0.0001209272. |
| Interaction evidence | 10native-input menu/controls actions,73 EventTiming entries, maximum measured interaction duration120 ms under CPU4×. Lab samples không phải field INP. |
| Startup/variance limits | CPU4× có startup long tasks116–664 ms,0overlap scene play trong14runs. Giữ snapshot M5 desktop outlier1556 ms trong raw report, không bỏ lượt. RAF timings là desktop scheduling proxy; physical-phone/field vitals UNMEASURED. |
| Artifacts | Final screenshot/report scripts trong `C:\Users\DELL\AppData\Local\Temp\p2-final-1790520974394`; `p2-typography-final-report.json`, `report.json`, `edge-report.json`, `final-acceptance.json`, `hero-contrast.json`, `interactions.json`, `final-source-integrity.json`; latest version map ở plan §11. |
| Integrity/cleanup | Cumulative write-set/hash unchanged outside listed P2 paths; protected API/contracts/package/lock source hash unchanged. No Git init/commit/push. Task-owned server/headless browsers stopped, no user-browser termination. |
| Risks/review | License/location UNVERIFIED: local preview only. Photo-depth approximation; true3D comparator chưa đủ full-hybrid/physical-mobile evidence. Android/iOS font mapping/field vitals và final independent approval chưa có; giữ status unreviewed. |
| Next authorized work | Paw/reviewer kiểm P2, chốt go/no-go true3D và rights/content. P3 NOT_STARTED; không tự bắt đầu. |

**Files modified — 6:**

- `D:\webdulich\apps\web\src\styles\globals.css`
- `D:\webdulich\apps\web\src\features\cinematic\cinematic.module.css`
- `D:\webdulich\AI_PROJECT_CONTROL.md`
- `D:\webdulich\docs\plans\P2_VISUAL_PLAN.md`
- `D:\webdulich\README.md`
- `D:\webdulich\assets\hero\README.md`

### Entry 008 — Paw chấp thuận bản P2 local 2.5D

| Field | Value |
|---|---|
| Date | 2026-09-28, Asia/Saigon |
| Phase | P2 — acceptance bản đã bàn giao |
| Agent | Codex ghi nhận quyết định của Paw |
| Status | `VERIFIED` cho phạm vi local 2.5D, design system và public layouts |
| Approval | Paw: "ừm tạm được ròi đó bây giờ kế hoạch tiếp theo là gì" sau bản bàn giao và evidence Entry 006/007. |
| Evidence basis | Final build AELZZd0hE05pj7T59B85c, source inventory 119 files và gates/browser/performance/typography evidence Entry 006/007; không chạy lại runtime gates trong turn docs-only này. |
| Limits | Paw acceptance không thay final independent review/release approval. License/location UNVERIFIED, physical-mobile/Safari/font mapping/field vitals vẫn mở trước release. True 3D production hoãn, cần scope/approval riêng nếu triển khai. |
| Next authorized work | Lập kế hoạch P3 theo yêu cầu trong chat; chưa có authorization code P3. |

### Entry 009 — Kế hoạch P3 database và public content API

| Field | Value |
|---|---|
| Date | 2026-09-28, Asia/Saigon |
| Phase | P3 — planning only |
| Agent | Codex sole writer ba tài liệu; agent p3_plan_review soát proposal read-only |
| Status | `IMPLEMENTED_UNREVIEWED` cho tài liệu plan; P3 implementation `NOT_STARTED` |
| Authorization | Paw hỏi kế hoạch tiếp theo; scope là checkpoint P2 và plan, không package install/database start/migration/source implementation. |
| Plan | Master §9/P3: sáu mốc A–F, tám content tables, relation/publication/media policies, 10 public GET endpoints, bounded cursor pagination, fresh migration/idempotent seed, real PostgreSQL integration probes và handoff. Schema/DTO/OpenAPI đầy đủ là output P3-A trước code. |
| Files changed | D:\webdulich\AI_PROJECT_CONTROL.md; D:\webdulich\README.md; D:\webdulich\docs\plans\P2_VISUAL_PLAN.md |
| Dependencies added | None |
| Verification | Graph Tier 2 generation 2026-09-27T09:29:26Z metadata_changed/not_tracked; API/contract/config/doc source đọc trực tiếp. Kiểm hash 119 files, exact 3-doc write-set, Entry 000–007 bất biến, Markdown fences/links/current status nhất quán. Không chạy lint/test/build/browser cho docs-only; không dùng kết quả P2 như gate mới của P3. |
| Review | Read-only proposal review chỉ ra relation matrix, nested visibility, media assignments, cursor ties/consistency và seed safety; đã đưa vào plan. Đây không phải implementation review hoặc Paw approval P3. |
| Risks | Compatibility Prisma/Node/Nest ESM/TS cần preflight khi mở code. Điểm đến/nội dung/rights chưa chốt: không bịa published seed; API có thể rỗng. Giữ dataset nhỏ và modular monolith, chưa cache cho tới CMS invalidation. |
| Next authorized work | Paw review plan; chỉ khi Paw mở implementation P3 mới làm P3-A và chốt exact write-set. Auth P4, CMS P5, frontend integration P6, release P7. |

### Entry 010 — Paw mở P3 và giao implementation cho DeepSeek

| Field | Value |
|---|---|
| Date | 2026-09-28, Asia/Saigon |
| Phase | P3 — authorization/handoff, chưa source implementation |
| Agent | Codex chuẩn bị prompt trong chat; DeepSeek nhận P3 implementation |
| Status | P3 `NOT_STARTED` tới khi DeepSeek bắt đầu; không suy authorization thành code đã hoàn thành |
| Authorization | Paw: "là bây giờ cho tao promt để thằng deepseek nó code plan tiếp theo đi". Cho phép DeepSeek thực hiện P3-A đến P3-F theo master §9/P3 và prompt trong chat; không mở P4–P7. |
| Ownership | Codex giữ architecture/review, kết thúc docs-only turn trước khi DeepSeek sửa. DeepSeek là writer P3 trong write-set được giao, phải xác minh writer conflicts trước edit. Không sửa web/cinematic/assets/P2 plan hoặc tác phẩm người khác. |
| Prompt | Chỉ gửi trong chat, không lưu vào project docs. Prompt có live hashes, write-set/exclusions, schema/publication/query/media contracts, Windows/ESM/test traps, ordered gates, takeover và final report. |
| Files changed in authorization turn | D:\webdulich\AI_PROJECT_CONTROL.md; D:\webdulich\README.md |
| Source baseline | 119 nongenerated files, chưa có Git/Compose/Prisma; Node v24.18.0, npm11.16.0, Docker CLI29.7.2. Docker daemon chưa kiểm trong turn chuẩn bị prompt. |
| Verification | Direct API/config/test source reads sau graph coverage stale; hash kiểm exact hai doc files, không tạo/xóa file, Entry000–009 byte-exact giữ nguyên, fences/links/status hợp lệ. Không chạy source gates hoặc DB trong turn này. |
| Next authorized work | DeepSeek refresh live baseline, ghi checklist và exact paths, chốt schema/DTO/OpenAPI rồi thực hiện P3 tới IMPLEMENTED_UNREVIEWED hoặc BLOCKED có evidence. Không tự VERIFIED hoặc chuyển P4. |

### Entry 011 — P3 PostgreSQL, Prisma và public content API

| Field | Value |
|---|---|
| Date | 2026-09-28, Asia/Saigon |
| Agent | DeepSeek (opencode CLI) |
| Phase | P3 — implementation P3-A đến P3-F |
| Status | `IMPLEMENTED_UNREVIEWED` |
| Authorization | Paw mở P3 và giao DeepSeek qua Entry 010; baseline refresh khớp 9/9 hash, không writer conflict; không sửa lịch sử Entry 000–010. |
| Scope | npm workspace giữ nguyên; PostgreSQL 17.6 local qua compose (dev 55432/test 55433, bind loopback, volume riêng); Prisma 7.10 ESM + driver adapter pg; tám content tables với FK/index/CHECK; migration deploy trên fresh DB; seed transaction/idempotent (public rỗng theo policy); publication service + media visibility rules; năm module, 10 public GET endpoints; query validation + cursor pagination `publishedAt DESC, id DESC`; error envelope/requestId; CORS allowlist; `Cache-Control: no-store`; OpenAPI 3.1 Swagger; unit tests + integration tests trên dedicated test DB. Không auth/session, không CRUD/upload, không map/frontend binding, không Git. |
| Files changed | 16 file sửa (gồm entry này), 74 file mới hand-written, 16 file generated Prisma client (gitignored), 0 xóa; danh sách literal bên dưới. `apps/web/**`, `assets/**`, `scripts/hero/**`, `docs/plans/P2_VISUAL_PLAN.md`, `apps/api/src/modules/health/**` byte-identical (0 frozen violation). |
| Dependencies added | api runtime: `@prisma/client@7.10.0`, `@prisma/adapter-pg@7.10.0` (kèm `pg@^8.16` + `@types/pg` transitively), `@nestjs/swagger@12.0.2`, `class-validator@0.15.1`, `class-transformer@0.5.1`; api dev: `prisma@7.10.0` (semver range hiện tại `^7.10.0`; lockfile pin 7.10.0 — không dùng `prisma@latest` vì latest đang trỏ RC 8.0.0). Không upgrade Next/React/Nest/TypeScript. |
| Contract đã chốt | Tám bảng: destinations/media/destination_media/experiences/itineraries/itinerary_days/stories/guides; ContentStatus + MediaClearance enums; timestamptz(3); FK Restrict cho reference nội dung (itinerary_days cascade theo itinerary); unique slug, unique `(destinationId, mediaId)` và `(destinationId, position)`, unique `(itineraryId, dayNumber)`; index `(status, publishedAt DESC, id DESC)` + FK/cover indexes; CHECK extra: width/height > 0, position >= 0, dayNumber 1..30, slug format, title non-empty, PUBLISHED ⇒ publishedAt NOT NULL. OpenAPI 3.1: `docs/api/P3_OPENAPI.yaml`; Swagger thật: `/api/v1/docs` + `/api/v1/openapi.json` (11 paths = 10 content + health, 27 schemas, openapi 3.1.0). |
| Config deviations | `prisma7.config.ts` là tên config mặc định của Prisma 7.10 (không phải `prisma.config.ts`); config dùng `process.env` (không dotenv); `.env` do `prisma init` tạo đã xóa và ignore rules gộp vào root `.gitignore` — policy: process env only. Dev/test DB dùng port 55432/55433 vì 5432 đang thuộc container `quant_trading_postgres` của project khác (không đụng). Port 3000 có process ngoài đang chạy — không kill; web smoke dùng 3100. |
| Commands run | `npm install` exit 0; `docker compose up -d` exit 0 (2 container healthy); `npx prisma migrate dev --create-only --name p3_content` exit 0; `npx prisma migrate deploy` trên dev exit 0, trên test exit 0; deploy lần 2 "No pending migrations" exit 0; `npm run seed` (dev) ×2 exit 0 — counts giống nhau `{destinations:0, media:0, experience:0, itineraries:0, stories:0, guides:0}` (public seed rỗng theo policy); `npm run lint` exit 0; `npm run typecheck` exit 0; `npm run test` exit 0 (unit 42/42, health/OpenAPI e2e 3/3, không cần DB); `TEST_DATABASE_URL=... npm run test:content` exit 0 (24/24 trên PostgreSQL thật); `npm run build` exit 0 (contracts → api → web, 27 route static). |
| Test evidence | Unit: query validation, cursor codec/anti-tamper/canonical, media mapper URL/clearance, publication transitions, config loader (42). Integration (test DB): DRAFT/ARCHIVED ẩn cả 5 resource; hidden slug vs unknown slug cùng 404; child published + parent draft/archive bị ẩn; parent archive sau child publish phản ánh ngay; story/guide không destination vẫn public; itinerary day mất ref nhưng giữ ngày; media unverified/blocked/bad-url bị loại khỏi cover/gallery; clearance thu hồi phản ánh ngay; pagination 9 record/3 trang không trùng-mất, trang cuối null/false; limit 0/âm/decimal/boolean/oversize/leading-zero/repeated/unknown/status-override bị 400; cursor malformed/oversize/sai resource/sai filter bị 400; slug format sai 400; Cache-Control/requestId/CORS; FK failure rollback; reset guard từ chối dev target, URL `other_test` giả và thiếu TEST_DATABASE_URL; publication service real-DB publish/archive/invalid transition (24). |
| HTTP evidence | Production API `node dist/main.js` (dev DB, port 3101): `GET /api/v1/health` 200 body cũ; 5 list 200 `{"data":[],"pagination":{"nextCursor":null,"hasMore":false}}` (dev DB rỗng theo policy); 404 `{"error":{"code":"NOT_FOUND",...},"requestId":...}`; 400 envelope kèm `details[{field:"limit"}]`; CORS `Access-Control-Allow-Origin: http://localhost:3000`; `Cache-Control: no-store` trên content, không set trên health; OpenAPI 3.1.0 đủ 10 content paths + schemas. Web production smoke (port 3100): `/`, `/kham-pha`, `/dang-nhap`, `/admin` đều 200 và có H1. |
| Runtime behavior | App boot không kết nối DB; health 200 khi DB unreachable (e2e dùng URL unreachable tường minh + restore env); content request khi DB down trả 503 sanitized (không lộ SQL/credential/stack) với pool timeout hữu hạn (connect 3s/statement 5s); PrismaService disconnect khi shutdown. |
| Risks | Seed public cố ý rỗng (chưa có nội dung/rights đã xác minh) — khi có nội dung cần thêm upsert entries theo slug; generated Prisma client gitignored nên fresh clone cần `npm install` (postinstall generate) trước typecheck/build; Swagger document gồm cả `/health` nên có 11 paths (10 content theo contract); jest cần `--experimental-vm-modules` (đã đóng trong scripts); containers `webdulich-postgres-dev/test` đang chạy healthy và được giữ lại cho review (volume riêng; container project khác không bị thay đổi). |
| Next authorized work | Codex/Paw review P3 (đối chiếu code + chạy review). Không bắt đầu P4. |

**Files modified — 16:**

- `D:\webdulich\AI_PROJECT_CONTROL.md`
- `D:\webdulich\README.md`
- `D:\webdulich\package.json`
- `D:\webdulich\package-lock.json`
- `D:\webdulich\.gitignore`
- `D:\webdulich\.env.example`
- `D:\webdulich\apps\api\package.json`
- `D:\webdulich\apps\api\eslint.config.mjs`
- `D:\webdulich\apps\api\tsconfig.json`
- `D:\webdulich\apps\api\tsconfig.build.json`
- `D:\webdulich\apps\api\src\app.module.ts`
- `D:\webdulich\apps\api\src\app.setup.ts`
- `D:\webdulich\apps\api\src\main.ts`
- `D:\webdulich\apps\api\test\health.e2e-spec.ts`
- `D:\webdulich\apps\api\test\jest-e2e.json`
- `D:\webdulich\packages\contracts\src\index.ts`

**Files created — 74 hand-written:**

- `D:\webdulich\compose.yaml`
- `D:\webdulich\docs\api\P3_OPENAPI.yaml`
- `D:\webdulich\apps\api\prisma7.config.ts`
- `D:\webdulich\apps\api\tsconfig.tools.json`
- `D:\webdulich\apps\api\prisma\schema.prisma`
- `D:\webdulich\apps\api\prisma\seed.ts`
- `D:\webdulich\apps\api\prisma\migrations\migration_lock.toml`
- `D:\webdulich\apps\api\prisma\migrations\20260927172738_p3_content\migration.sql`
- `D:\webdulich\packages\contracts\src\content\common.ts`
- `D:\webdulich\packages\contracts\src\content\destinations.ts`
- `D:\webdulich\packages\contracts\src\content\experiences.ts`
- `D:\webdulich\packages\contracts\src\content\itineraries.ts`
- `D:\webdulich\packages\contracts\src\content\stories.ts`
- `D:\webdulich\packages\contracts\src\content\guides.ts`
- `D:\webdulich\apps\api\src\config\app-config.ts`
- `D:\webdulich\apps\api\src\config\app-config.module.ts`
- `D:\webdulich\apps\api\src\config\app-config.spec.ts`
- `D:\webdulich\apps\api\src\database\prisma.service.ts`
- `D:\webdulich\apps\api\src\database\prisma.module.ts`
- `D:\webdulich\apps\api\src\modules\content-common\errors.ts`
- `D:\webdulich\apps\api\src\modules\content-common\database-error.ts`
- `D:\webdulich\apps\api\src\modules\content-common\api-exception.filter.ts`
- `D:\webdulich\apps\api\src\modules\content-common\request-id.middleware.ts`
- `D:\webdulich\apps\api\src\modules\content-common\query.ts`
- `D:\webdulich\apps\api\src\modules\content-common\query.spec.ts`
- `D:\webdulich\apps\api\src\modules\content-common\cursor.ts`
- `D:\webdulich\apps\api\src\modules\content-common\cursor.spec.ts`
- `D:\webdulich\apps\api\src\modules\content-common\slug.ts`
- `D:\webdulich\apps\api\src\modules\content-common\media.mapper.ts`
- `D:\webdulich\apps\api\src\modules\content-common\media.mapper.spec.ts`
- `D:\webdulich\apps\api\src\modules\content-common\destination-ref.mapper.ts`
- `D:\webdulich\apps\api\src\modules\content-common\pagination.ts`
- `D:\webdulich\apps\api\src\modules\content-common\prisma-filters.ts`
- `D:\webdulich\apps\api\src\modules\content-common\prisma-selects.ts`
- `D:\webdulich\apps\api\src\modules\content-common\invariants.ts`
- `D:\webdulich\apps\api\src\modules\content-common\constants.ts`
- `D:\webdulich\apps\api\src\modules\content-common\content-common.module.ts`
- `D:\webdulich\apps\api\src\modules\content-common\dto\public-media.dto.ts`
- `D:\webdulich\apps\api\src\modules\content-common\dto\destination-ref.dto.ts`
- `D:\webdulich\apps\api\src\modules\content-common\dto\pagination.dto.ts`
- `D:\webdulich\apps\api\src\modules\content-common\dto\api-error.dto.ts`
- `D:\webdulich\apps\api\src\modules\content-common\publication\publication.types.ts`
- `D:\webdulich\apps\api\src\modules\content-common\publication\publication.service.ts`
- `D:\webdulich\apps\api\src\modules\content-common\publication\publication.service.spec.ts`
- `D:\webdulich\apps\api\src\modules\content-common\publication\prisma-publication.repository.ts`
- `D:\webdulich\apps\api\src\modules\destinations\destination.repository.ts`
- `D:\webdulich\apps\api\src\modules\destinations\destination.service.ts`
- `D:\webdulich\apps\api\src\modules\destinations\destinations.controller.ts`
- `D:\webdulich\apps\api\src\modules\destinations\destinations.module.ts`
- `D:\webdulich\apps\api\src\modules\destinations\dto.ts`
- `D:\webdulich\apps\api\src\modules\experiences\experience.repository.ts`
- `D:\webdulich\apps\api\src\modules\experiences\experience.service.ts`
- `D:\webdulich\apps\api\src\modules\experiences\experiences.controller.ts`
- `D:\webdulich\apps\api\src\modules\experiences\experiences.module.ts`
- `D:\webdulich\apps\api\src\modules\experiences\dto.ts`
- `D:\webdulich\apps\api\src\modules\itineraries\itinerary.repository.ts`
- `D:\webdulich\apps\api\src\modules\itineraries\itinerary.service.ts`
- `D:\webdulich\apps\api\src\modules\itineraries\itineraries.controller.ts`
- `D:\webdulich\apps\api\src\modules\itineraries\itineraries.module.ts`
- `D:\webdulich\apps\api\src\modules\itineraries\dto.ts`
- `D:\webdulich\apps\api\src\modules\stories\story.repository.ts`
- `D:\webdulich\apps\api\src\modules\stories\story.service.ts`
- `D:\webdulich\apps\api\src\modules\stories\stories.controller.ts`
- `D:\webdulich\apps\api\src\modules\stories\stories.module.ts`
- `D:\webdulich\apps\api\src\modules\stories\dto.ts`
- `D:\webdulich\apps\api\src\modules\guides\guide.repository.ts`
- `D:\webdulich\apps\api\src\modules\guides\guide.service.ts`
- `D:\webdulich\apps\api\src\modules\guides\guides.controller.ts`
- `D:\webdulich\apps\api\src\modules\guides\guides.module.ts`
- `D:\webdulich\apps\api\src\modules\guides\dto.ts`
- `D:\webdulich\apps\api\test\content.e2e-spec.ts`
- `D:\webdulich\apps\api\test\jest-content-e2e.json`
- `D:\webdulich\apps\api\test\helpers\test-db.ts`
- `D:\webdulich\apps\api\test\fixtures\content-fixtures.ts`

**Generated (không hand-edit, gitignored) — 16:** `D:\webdulich\apps\api\src\generated\prisma\**` (client.ts, browser.ts, enums.ts, models.ts, commonInputTypes.ts, internal/*, models/*) sinh bởi `prisma generate` 7.10.0.

### Entry 012 — P3 review repair F1–F7

| Field | Value |
|---|---|
| Date | 2026-09-28, Asia/Saigon |
| Agent | DeepSeek (opencode CLI) |
| Phase | P3 — repair theo independent review; không mở phase mới |
| Status | `IMPLEMENTED_UNREVIEWED` |
| Authorization | Paw giao repair 7 findings trong chat. Reviewer baseline `p3-codex-review-677edffb…/review-source-hashes.json` (193 file) còn nguyên; refresh trước sửa khớp 6/6 key hash (`AI_PROJECT_CONTROL bdeec3c3…`, `test-db b3e81ac5…`, `publication.service bb0c63a2…`, `prisma-publication.repository 18396e36…`, `cursor bc62a486…`, old migration `38120544…`). Entry 000–011 giữ nguyên byte-exact; không writer conflict trong write-set. |
| Findings/repairs | F1: guard thành validated binding harness (`parseValidatedTestDatabaseUrl` + `performGuardedReset` + `createTestDatabaseHarness`); normalize localhost/127.0.0.1 về một identity; bắt buộc explicit port, query chỉ `schema=public`, chặn PGOPTIONS/fragment/percent/multi-segment/::1/remote/unknown-key; previous DATABASE_URL parse lỗi thì fail-closed; reset dùng qualified TRUNCATE trong interactive transaction, verify `current_database()` + `current_schema()=public`, không CASCADE, không export unchecked reset; Nest suites dùng override provider thay vì mutate env. F2: `PublicationRepository.transition(decide)` atomic — interactive transaction SERIALIZABLE, conditional `updateMany` theo status đã đọc, reread record, bounded 3 attempts, chỉ retry P2034/CAS sentinel, hết attempts → 409 `PUBLICATION_CONFLICT`; proposed publishedAt capture một lần mỗi publish; day content đọc trong cùng snapshot. F3: 5 detail schema static flatten thành closed object đầy đủ (bỏ allOf reuse), bound metadata; DTO thêm maxLength/maxItems từ constants; `openapi-schema.e2e-spec.ts` validate payload HTTP thật với static YAML + runtime Swagger bằng Ajv2020/ajv-formats, parity paths/required/props/bounds, negative unknown-field/oversize/oversize-collection. F4: cursor chỉ nhận canonical UTC ms với year 0001..9999; decode invalid → 400 trước DB (repo spy), encode invalid Date → InternalError; migration thêm CHECK publishedAt domain cho 5 bảng. F5: `MAX_CONTENT_BODY_CODE_POINTS=20000`, `MAX_ITINERARY_DAY_CONTENT_CODE_POINTS=5000`; helper đếm code points O(min(N,max+1)); validator body/day nonblank + bound trong transaction; migration CHECK 5 body + itinerary_days.content. F6: classifier đọc có kiểm soát `code`/`originalCode`/`cause`/`meta.driverAdapterError` theo whitelist availability (thêm P2037; không blanket P2039; không match message; visited-set chống cycle); adapter-backed probes (Prisma 7 + PrismaPg inject SQLSTATE ở tầng pg query của test DB thật) pass 53300/57P03/08006, negative 22008/23505. F7: filter chỉ log fixed event `INTERNAL_ERROR`/`DATABASE_UNAVAILABLE` + safe requestId (invalid → UUID); canary tests chứng minh không lọt credential/SQL/stack/cause/meta. |
| Files modified (mine) | Tính từ `D:\webdulich\`: `AI_PROJECT_CONTROL.md`, `README.md`, `apps/api/package.json`, `package-lock.json`, `docs/api/P3_OPENAPI.yaml`, `apps/api/src/modules/content-common/api-exception.filter.ts`, `apps/api/src/modules/content-common/constants.ts`, `apps/api/src/modules/content-common/cursor.ts`, `apps/api/src/modules/content-common/cursor.spec.ts`, `apps/api/src/modules/content-common/database-error.ts`, `apps/api/src/modules/content-common/errors.ts`, `apps/api/src/modules/content-common/publication/publication.types.ts`, `apps/api/src/modules/content-common/publication/publication.service.ts`, `apps/api/src/modules/content-common/publication/publication.service.spec.ts`, `apps/api/src/modules/content-common/publication/prisma-publication.repository.ts`, `apps/api/src/modules/destinations/dto.ts`, `apps/api/src/modules/experiences/dto.ts`, `apps/api/src/modules/itineraries/dto.ts`, `apps/api/src/modules/stories/dto.ts`, `apps/api/src/modules/guides/dto.ts`, `apps/api/test/helpers/test-db.ts`, `apps/api/test/content.e2e-spec.ts`, `apps/api/test/jest-content-e2e.json` |
| Files created (mine) | Tính từ `D:\webdulich\`: `apps/api/prisma/migrations/20260927201703_p3_review_repairs/migration.sql`, `apps/api/src/modules/content-common/content-length.ts`, `apps/api/src/modules/content-common/content-length.spec.ts`, `apps/api/src/modules/content-common/database-error.spec.ts`, `apps/api/src/modules/content-common/api-exception.filter.spec.ts`, `apps/api/src/modules/content-common/publication/prisma-publication.repository.spec.ts`, `apps/api/test/publication-concurrency.e2e-spec.ts`, `apps/api/test/openapi-schema.e2e-spec.ts`, `apps/api/test/test-db-guard.e2e-spec.ts` |
| Dependencies added | api devDeps: `ajv@8.20.0`, `ajv-formats@3.0.1`, `js-yaml@4.3.2`, `@types/js-yaml@4.0.9`, `pg@8.23.0`, `@types/pg@8.23.1` (schema validation + adapter-injection probes; pg khai báo direct thay vì dựa hoisting). Không upgrade Next/React/Nest/Prisma/TypeScript. |
| Migration | Mới: `apps/api/prisma/migrations/20260927201703_p3_review_repairs/migration.sql`, SHA-256 `c8cac84880892c11431649434d37042cdf021168466550c5c773e127a9e3512d`. Old migration giữ nguyên `38120544…`; `migration_lock.toml` giữ nguyên. Probe: fresh owned DB deploy sạch 2 migrations + 11 CHECK; existing compliant DB additive deploy, count 5→5 và hash dữ liệu trước/sau bằng nhau; owned preflight-fail DB (infinity publishedAt; oversized body) fail đúng message table/count/example-id, 0 constraint partial, rows nguyên; seed hai lần counts/không đổi fixture. |
| Commands run | RED: unit 9 fail đúng F4/F5/F6/F7; concurrency e2e reproduce resurrection trên PostgreSQL thật; guard 4 case accept; F3 probe 5/5 detail INVALID. GREEN: `npm run lint` 0; `npm run typecheck` 0; `npm run test` 0 (default 77 pass + 1 skip không DB; có `TEST_DATABASE_URL`: 78/78); `npm run test:content` 0 (4 suite/47 test, PostgreSQL thật); `npm run build` 0; `npx prisma migrate deploy` fresh + existing 0; preflight probes exit 1 đúng thiết kế. |
| Real HTTP evidence | Production `node dist/main.js` với test DB: 10 content endpoint 200; year-zero cursor ×5 → 400 `INVALID_QUERY` field cursor; archived record → 404 cùng contract; health 200 body cũ; DB unreachable (port 6553): health 200, content 503 `DATABASE_UNAVAILABLE` không lộ SQL/credential; `Cache-Control: no-store`, CORS allowlist, `X-Request-Id`; `/api/v1/openapi.json` 200 (11 paths), `/api/v1/docs` 200; web production smoke `/`, `/kham-pha`, `/dang-nhap`, `/admin` 200 + H1. |
| Co-writer note | Trong lúc repair, Paw/Codex thay đổi ngoài write-set tại `apps/web/src/features/cinematic/**` (5 file sửa + `mountain-renderer.ts` mới, mtime 03:18–03:38) — đúng ownership visual turn; DeepSeek không đọc-ghi gì trong các path đó và không revert. Repair diff không có file nào ngoài allowlist. |
| Risks | Dev DB (55432) chưa apply migration repair theo yêu cầu “không tự migrate dev database để tiện chạy test” — cần `migrate deploy` khi muốn dev đồng bộ. Adapter-injection unit probes skip khi thiếu `TEST_DATABASE_URL` (default gates vẫn sạch). Classifier chỉ whitelist code đã biết; wrapper shape khác cho failure kind mới cần bổ sung có review. Web cinematic đang được co-writer sửa song song; các gate web trong entry chạy trên snapshot trước lần save cuối của họ. |
| Next authorized work | Codex/Paw review bản repair P3 (đối chiếu code + chạy lại boundary tests). Không bắt đầu P4; không implement visual/3D. |

### Entry 013 — Codex review P3 repair, final fixes và Paw mở P4

| Field | Value |
|---|---|
| Date | 2026-09-28, Asia/Saigon |
| Agent | Codex architecture/integration; ba bounded agent lanes review và patch, root independent gates |
| Phase/status | P3 VERIFIED local; P4 IN_PROGRESS |
| Authorization | Paw yêu cầu check/fix P3 còn lỗi, note dự án rồi tự chạy P4; header chia mỗi chức năng thành route riêng, tham khảo Travel nhưng cấm sao chép. |
| Findings closed | F1 raw path phải kiểm trước WHATWG normalization; F5 body/day kiểm raw codepoint bound trước trim; F6 regression cũ thiếu severity và dùng raw query, sửa thành actual PrismaPg model query wrapper không cần DB/skip. Các implementation F2/F3/F4/F6/F7 pass direct review và independent probes. |
| Source modified this repair | apps/api/src/modules/content-common/publication/publication.service.ts; publication.service.spec.ts cùng thư mục; apps/api/test/helpers/test-db.ts; apps/api/test/test-db-guard.e2e-spec.ts; apps/api/src/modules/content-common/database-error.spec.ts. |
| Documents | AI_PROJECT_CONTROL.md update status/authorization + entry này; docs/plans/P4_AUTH_PLAN.md mới chứa contract/schema/routes/ownership/gates, không chứa prompt. |
| Write-set verification | Reviewer before206 files; đúng5 API/test files sửa + docs; không xóa; DeepSeek repair baseline23 modified9 created đúng allowlist. Root cinematic5 modified+renderer/fonts4created được tách ownership. Entries000..012 giữ nguyên; old migration SHA38120544158daafc8f0bbaf162ed320546be0c76a14d8090f6f0b49c6a8649db không đổi. |
| Gates source cuối | npm run lint0; typecheck0; defaulttest0 = 87 unit/0skip +3 health/OpenAPI; test:content0 =4suites50tests realPG; contractsbuild0/APIbuild0. Current web source đã qua isolated productionbuild ở visual turn và rootlint/typecheck mới, không rebuild shared .next của process3000. |
| Independent runtime | Production API port13101:5list200/no-store,5year0000cursor400 INVALID_QUERY,health200,Swagger200/11paths. Real PostgreSQL fresh2migrations0; preflightfail1expected/0partial/preservedrow; late ALTER duplicateconstraintfail1expected/0newpartial. Actual installed migrate engine gửi atomic SQL batch; rollback verified, không suy ra từ comment. |
| Evidence | C:/Users/DELL/AppData/Local/Temp/p3-repair-independent-17c30224-5f3a-47f5-be2f-67d4bbb75646: before.json,p3-final.json,p3-final-http.json,migration-failure-probes.json. Không chứa credential. |
| Cleanup/state | Owned API31612 stopped. Port3000 PID24152 và hero preview11400 PID8732 giữ nguyên. Ba ownedreviewDB còn tạm giữ phục vụ migration/integration P4, sẽ cleanup cuối. Dev/test userDB chưa mutate bởi review. |
| P4 decision | Opaque short access + rotated refresh hashed DB, Argon2id, CSRF/origin, USER/EDITOR/ADMIN backend guards, profile/favorites/saved/inquiries, same-origin BFF và original responsive route header. Detailed plan docs/plans/P4_AUTH_PLAN.md. Không booking/payment/flights integration, không CMS/P5 hoặc fullpublicbinding/P6. |
| Risks | Deployment/crossbrowser/physicalmobile/hero license còn P7 gate; classification whitelist cần review khi Prisma upgrade; dev migration thực hiện khi P4 final verifies, không reset dữ liệu. |
| Next authorized work | Implement P4 theo contract, root verify và independent security review; final IMPLEMENTED_UNREVIEWED, không tự mở P5. |

### Entry 014 — P4 implementation, independent findings repaired và local runtime

| Field | Value |
|---|---|
| Date | 2026-09-28, Asia/Saigon |
| Authorization | Paw giao tự tiếp tục P4, sửa lỗi và cập nhật project note; xác nhận không cần hỏi lại quyền thao tác. P4 là phase duy nhất mở sau P3 VERIFIED; không mở P5/P6/P7. |
| Status | `IMPLEMENTED_UNREVIEWED` — implementation và local gates xong; Paw chưa review/accept P4. |
| Architecture | Giữ Nest/Prisma/PostgreSQL + Next App Router. Additive migration 6 bảng: users, auth_sessions, auth_refresh_tokens, favorites, saved_itineraries, inquiries; tổng 14 bảng nghiệp vụ. Opaque token hash SHA-256, Argon2id, refresh rotation/replay revocation, CSRF + exact Origin, backend USER/EDITOR/ADMIN guards, same-origin BFF allowlist, account/profile/collections/inquiries. Header riêng forest/gold trên nền trắng với 6 chức năng là 6 route/H1, không dùng scroll anchor/copy Travel. P2 cinematic/font nguyên byte. |
| Independent review / fixes | Security reviewer không thấy admin bypass, IDOR, CSRF bypass hay token/password leak trong scope đọc source; chỉ ra: (1) IP của Next BFF gộp mọi browser vào rate limit thấp → login/register keyed normalized email hash, inquiry keyed user ID, IP coarse backstop; (2) PrismaPg `cause.originalCode=40001` bị auth bỏ qua → shared bounded/cycle-safe retry classifier, unit probe wrapper/negative; (3) 50 bookmark ẩn do archive làm kẹt cap → trong serializable add dọn chỉ hidden rows của đúng user rồi count; e2e 50→archive→add. Phát hiện ban đầu về inquiry archived leak là false positive vì shared mapper đã chặn status khác PUBLISHED; e2e đổi sang ARCHIVED để khóa boundary. Browser phát hiện guest `auth/me` 401 gọi CSRF/refresh vô ích; BFF trả boolean refresh-cookie hint (không trả token) và client bỏ refresh khi cookie vắng. |
| Dependencies | `argon2@0.45.1` ở API; web khai báo `@webdulich/contracts` workspace link. Không đổi Next/React/Nest/Prisma/TypeScript. |
| Migration | P4 SQL SHA-256 `DFC3437170554D016C29964786574C04A64C7F40B0D66F7BE1BD3B24EF440248`; 3 owned scratch DB được apply và chạy e2e, sau đó drop exact cả 3. Dev DB `webdulich_dev` ban đầu 1 migration/0 content, additive deploy P3 repair + P4 exit0, cuối 3 migrations/14 bảng/0 content/0 user; không reset dev. Shared `webdulich_test` chỉ additive deploy P4 từ 2→3 migrations, 37 content rows trước/sau giữ nguyên, 0 user; không chạy reset suite trên DB này. Hai Docker volumes giữ nguyên. |
| Gates | Root final `npm run lint` 0, `npm run typecheck` 0, `npm run test` 0 = 16 unit suites/106 tests + health/OpenAPI e2e 3. Real PostgreSQL: `test:content` 4 suites/50 tests 0; `test:auth` 2 suites/17 tests 0. Contracts/API/API tools builds 0; web isolated production webpack build 0 và main production Turbopack build 0, 27 routes. Admin bootstrap trên owned DB: create0, duplicate1 sanitized, không seed mặc định. |
| Runtime/browser | Isolated browser CDP: 6 public routes có URL/H1/active state riêng, viewport 320/375/768/1440 không overflow; mobile open/focus/Escape/link; guest account redirect; register/profile/inquiry/logout/login; USER admin panel denied và backend `/admin/access` 403; console/runtime errors0. Screenshot/result ở `C:\Users\DELL\AppData\Local\Temp\p4-browser-verify-artifacts`. Guest retest 6 routes: `auth/me` 401 ×6, CSRF0, refresh0. Main local `http://127.0.0.1:3000` + API3001 sau Docker recovery: CSRF200, public content200; direct BFF HTTP probe register201→me200→invalid access401/hint1→refresh200→me200, probe user cleanup DELETE1. Source-level client probe guest1 call, expired4-call recovery PASS. Full expired-access browser rerun chưa có vì Docker tắt giữa retest; HTTP+BFF+client probes sau recovery cover boundary, không gọi đó là browser evidence. |
| Source/frozen integrity | P2 cinematic/font 9 files SHA-256 match Entry013 baseline. No Git repository/commit/push; no P5 CMS CRUD, full public data binding/P6, booking/payment hay 3D rewrite. Old P3 migrations unchanged. |
| Risks | `npm audit --omit=dev --audit-level=high` exit1: 4 high reports through `prisma@7.10.0` transitive `@prisma/config`→`deepmerge-ts@7.1.5`, `mysql2@3.15.3`; suggested `--force` downgrades Prisma major to6, chưa áp dụng vì breaking. Rate limit in-memory per instance; per-email throttling có thể tạm chặn một account bị nhắm; cần distributed abuse defense trước deploy. Cookie production cần HTTPS/exact origins; refresh-history cleanup, email verify/reset, physical mobile/browser và hero photo rights còn P7. P5 CMS/P6 public data binding chưa triển khai. |
| Next action | Paw review P4 behavior/visual, sau đó mở một phase riêng cho P5 nếu muốn; không tự coi local gates là release approval. |

**P4 created, exact paths (54 handwrittmen files):**

- `docs/plans/P4_AUTH_PLAN.md`
- `packages/contracts/src/auth.ts`
- `apps/api/prisma/bootstrap-admin.ts`
- `apps/api/prisma/migrations/20260928110000_p4_auth/migration.sql`
- `apps/api/src/modules/content-common/transaction-errors.ts`
- `apps/api/src/modules/auth/admin-access.controller.ts`
- `apps/api/src/modules/auth/auth.controller.ts`
- `apps/api/src/modules/auth/auth.cookies.spec.ts`
- `apps/api/src/modules/auth/auth.cookies.ts`
- `apps/api/src/modules/auth/auth.dto.ts`
- `apps/api/src/modules/auth/auth.errors.ts`
- `apps/api/src/modules/auth/auth.guard.ts`
- `apps/api/src/modules/auth/auth.module.ts`
- `apps/api/src/modules/auth/auth.repository.spec.ts`
- `apps/api/src/modules/auth/auth.repository.ts`
- `apps/api/src/modules/auth/auth.service.ts`
- `apps/api/src/modules/auth/auth.tokens.ts`
- `apps/api/src/modules/auth/auth.types.ts`
- `apps/api/src/modules/auth/auth.validation.spec.ts`
- `apps/api/src/modules/auth/auth.validation.ts`
- `apps/api/src/modules/auth/auth-rate-limiter.ts`
- `apps/api/src/modules/auth/csrf.guard.ts`
- `apps/api/src/modules/auth/password.service.spec.ts`
- `apps/api/src/modules/auth/password.service.ts`
- `apps/api/src/modules/auth/public-user.ts`
- `apps/api/src/modules/auth/roles.decorator.ts`
- `apps/api/src/modules/auth/roles.guard.ts`
- `apps/api/src/modules/me/account.repository.ts`
- `apps/api/src/modules/me/collections.repository.ts`
- `apps/api/src/modules/me/me.controller.ts`
- `apps/api/src/modules/me/me.dto.spec.ts`
- `apps/api/src/modules/me/me.dto.ts`
- `apps/api/src/modules/me/me.module.ts`
- `apps/api/src/modules/me/me.service.ts`
- `apps/api/src/modules/me/me.transaction.spec.ts`
- `apps/api/src/modules/me/me.transaction.ts`
- `apps/api/src/modules/me/me.types.ts`
- `apps/api/test/auth.e2e-spec.ts`
- `apps/api/test/me.e2e-spec.ts`
- `apps/api/test/jest-auth-e2e.json`
- `apps/web/src/app/api/backend/[...path]/route.ts`
- `apps/web/src/lib/auth/api-client.ts`
- `apps/web/src/lib/auth/bff.ts`
- `apps/web/src/lib/auth/safe-next.ts`
- `apps/web/src/lib/auth/server.ts`
- `apps/web/src/features/auth/account-action.tsx`
- `apps/web/src/features/auth/admin-links.tsx`
- `apps/web/src/features/auth/session-boundary.tsx`
- `apps/web/src/features/account/account-nav.tsx`
- `apps/web/src/features/account/account-ui.tsx`
- `apps/web/src/features/account/inquiries-panel.tsx`
- `apps/web/src/features/account/profile-panel.tsx`
- `apps/web/src/features/account/saved-content-panel.tsx`
- `apps/web/src/features/account/security-panel.tsx`

**P4 modified, exact paths (31 existing files):**

- `AI_PROJECT_CONTROL.md`
- `README.md`
- `.env.example`
- `package.json`
- `package-lock.json`
- `packages/contracts/src/index.ts`
- `apps/api/package.json`
- `apps/api/prisma/schema.prisma`
- `apps/api/src/app.module.ts`
- `apps/api/src/app.setup.ts`
- `apps/api/test/helpers/test-db.ts`
- `apps/api/test/health.e2e-spec.ts`
- `apps/api/test/openapi-schema.e2e-spec.ts`
- `apps/web/package.json`
- `apps/web/src/app/(account)/tai-khoan/layout.tsx`
- `apps/web/src/app/(account)/tai-khoan/page.tsx`
- `apps/web/src/app/(account)/tai-khoan/bao-mat/page.tsx`
- `apps/web/src/app/(account)/tai-khoan/hanh-trinh-da-luu/page.tsx`
- `apps/web/src/app/(account)/tai-khoan/yeu-cau-tu-van/page.tsx`
- `apps/web/src/app/(account)/tai-khoan/yeu-thich/page.tsx`
- `apps/web/src/app/(auth)/layout.tsx`
- `apps/web/src/app/(auth)/dang-ky/page.tsx`
- `apps/web/src/app/(auth)/dang-nhap/page.tsx`
- `apps/web/src/app/admin/layout.tsx`
- `apps/web/src/app/admin/page.tsx`
- `apps/web/src/app/admin/audit-log/page.tsx`
- `apps/web/src/app/admin/nguoi-dung/page.tsx`
- `apps/web/src/components/layout/mobile-nav.tsx`
- `apps/web/src/components/layout/site-header.tsx`
- `apps/web/src/components/navigation/desktop-nav.tsx`
- `apps/web/src/features/auth/auth-form-shell.tsx`

Generated Prisma client `apps/api/src/generated/prisma/**` được regenerate, gitignored và không hand-edit. Prompt cho coder vẫn chỉ nằm trong chat; docs này là trạng thái/contract/evidence dự án.

### Entry 015 — P4b Northwest showcase, five planning routes và image runtime repair

| Field | Value |
|---|---|
| Date | 2026-09-28, Asia/Saigon |
| Authorization | Paw yêu cầu giữ kế hoạch cũ sau khi cân nhắc landing page ngắn: trang chủ editorial Tây Bắc, 10 card, carousel 4/2/1, năm nhãn header cố định dẫn tới chức năng riêng; cho phép Git snapshot trước build và tiếp tục không hỏi lại. |
| Status | `IMPLEMENTED_UNREVIEWED` — P4b source, review tĩnh, build và browser acceptance đã xong; không tự gán release approval. P4 auth vẫn giữ trạng thái Entry 014; P5/P6/P7 chưa mở. |
| Git | Khởi tạo local `main`; baseline `27a7921` trước sửa; feature `831086e` trước first build; image repair `f341a1b` trước final build. Không remote, không push. Commit tài liệu cuối sẽ nối tiếp Entry này. |
| Scope | Trang chủ section mười nơi/mười nhịp núi; carousel scroll-snap với nút trái/phải; `/kham-pha` và 10 bài `/diem-den/[slug]`; năm route `/tour-tron-goi`, `/ve-may-bay`, `/khach-san`, `/combo-du-lich`, `/dich-vu-cong-them` có tương tác riêng. Header đi route, không anchor. Hero cinematic P2 giữ nguyên. |
| Content | 10 địa danh Sa Pa, Mù Cang Chải, Tà Xùa, Mộc Châu, Y Tý, Bắc Hà, Ngọc Chiến, Mai Châu, Sin Suối Hồ, Mường Thanh; mỗi bài có intro/highlight/travel note và link nguồn du lịch. Tám ảnh Commons/Unsplash có tác giả/license/source ở bài và `/nguon-anh`; hai card thiếu ảnh phù hợp dùng minh họa tự vẽ ghi rõ. Không gán giá/rating/lịch bay/phòng/chỗ trống giả. |
| Image repair | Browser production đầu tiên thấy 5/8 card ảnh blank >30 giây: exact `/_next/image` WebP key treo trên process cũ, process mới trả 200 nhanh; Sharp xử lý source 34–119 ms, nguyên nhân gốc của cache in-flight chưa chứng minh. Chuyển tám ảnh sang 16 WebP tĩnh: card 1200×900, bài rộng tối đa 2400px (Tà Xùa giữ 1959px), `next/image unoptimized`. Tổng card 2,270,082 bytes; bài 6,351,440 bytes; master originals giữ để đối chiếu nguồn. Trade-off: card cố định có thể tải thừa bytes trên máy nhỏ, đổi lại không lệ thuộc optimizer runtime và đủ pixel cho màn hình mật độ cao. |
| Review / fixes | Static independent review tìm ba lỗi: CTA bài chi tiết mất slug, ảnh bài 960–1280px không đủ DPR cao, Tour phân loại Mường Thanh sai; cả ba sửa trước browser. Browser phát hiện thêm image optimizer stall, repair và retest. |
| Gates | Final `npm run lint` exit0; `npm run typecheck` exit0; `npm run test` exit0 (16 unit suites/106 tests + health/OpenAPI e2e 3); `npm run build` exit0 sau commit `f341a1b`, 43 page outputs gồm 10 SSG bài. |
| Browser | Production `next start` port 11405, Chrome headless Playwright temp: viewport 1440/800/390 đo 4/2/1 card, nút next/prev và keyboard Enter, không horizontal overflow; năm desktop links mở đúng route/H1; mobile menu mở/Escape/focus/route; card→bài→Combo giữ slug; Tour filter, flight planner, hotel checklist, add-on draft đều phản hồi; 10 bài HTTP200; tám card WebP giải mã trong Chrome và ảnh bài WebP tải xong. Screenshot ở `D:\codex-task-temp\p4b-browser-verify\home-1440.png`, `home-390.png`, `section-1440.png`, `section-390.png`; test script temp `verify.mjs` không nằm trong repo. |
| Risks | Nhãn thương mại ở header có thể gợi kỳ vọng đặt/bán thật; đầu mỗi trang nói rõ đây là công cụ lập kế hoạch, không xác nhận booking. Ảnh hero P2 do Paw cung cấp vẫn cần chứng minh quyền sử dụng và source resolution trước submission/deploy; chưa kiểm tra thiết bị mobile vật lý. Card static WebP chưa có srcset theo DPR để giảm bytes hơn nữa; P6 data binding và P5 CMS còn riêng. |
| Next action | Paw review visual/product P4b; nếu nhận thì lên một phase riêng cho P5 hoặc P6 theo ưu tiên cuộc thi. Không tự bắt đầu phase khác. |

**P4b exact write-set từ baseline `27a7921` (49 paths, relative to `D:\webdulich`; doc path gồm lần cập nhật Entry này):**

```text
AI_PROJECT_CONTROL.md
apps/web/public/images/destinations/bac-ha-article.webp
apps/web/public/images/destinations/bac-ha-card.webp
apps/web/public/images/destinations/bac-ha.jpg
apps/web/public/images/destinations/mai-chau-article.webp
apps/web/public/images/destinations/mai-chau-card.webp
apps/web/public/images/destinations/mai-chau.jpg
apps/web/public/images/destinations/moc-chau-article.webp
apps/web/public/images/destinations/moc-chau-card.webp
apps/web/public/images/destinations/moc-chau.jpg
apps/web/public/images/destinations/mu-cang-chai-article.webp
apps/web/public/images/destinations/mu-cang-chai-card.webp
apps/web/public/images/destinations/mu-cang-chai.jpg
apps/web/public/images/destinations/muong-thanh-article.webp
apps/web/public/images/destinations/muong-thanh-card.webp
apps/web/public/images/destinations/muong-thanh.jpg
apps/web/public/images/destinations/sa-pa-article.webp
apps/web/public/images/destinations/sa-pa-card.webp
apps/web/public/images/destinations/sa-pa.jpg
apps/web/public/images/destinations/ta-xua-article.webp
apps/web/public/images/destinations/ta-xua-card.webp
apps/web/public/images/destinations/ta-xua.png
apps/web/public/images/destinations/y-ty-article.webp
apps/web/public/images/destinations/y-ty-card.webp
apps/web/public/images/destinations/y-ty.jpg
apps/web/src/app/(public)/combo-du-lich/page.tsx
apps/web/src/app/(public)/dich-vu-cong-them/page.tsx
apps/web/src/app/(public)/diem-den/[slug]/page.tsx
apps/web/src/app/(public)/khach-san/page.tsx
apps/web/src/app/(public)/kham-pha/page.tsx
apps/web/src/app/(public)/nguon-anh/page.tsx
apps/web/src/app/(public)/page.tsx
apps/web/src/app/(public)/tour-tron-goi/page.tsx
apps/web/src/app/(public)/ve-may-bay/page.tsx
apps/web/src/components/layout/site-footer.tsx
apps/web/src/components/placeholders/final-cta.tsx
apps/web/src/config/navigation.ts
apps/web/src/features/destinations/destination-card.tsx
apps/web/src/features/destinations/northwest-carousel.module.css
apps/web/src/features/destinations/northwest-carousel.tsx
apps/web/src/features/destinations/northwest-destinations.ts
apps/web/src/features/product-navigation-a/combo-planner.tsx
apps/web/src/features/product-navigation-a/tour-explorer.tsx
apps/web/src/features/product-navigation-b/add-on-selector.tsx
apps/web/src/features/product-navigation-b/copy-text-button.tsx
apps/web/src/features/product-navigation-b/flight-gateway-planner.tsx
apps/web/src/features/product-navigation-b/flight-gateways.ts
apps/web/src/features/product-navigation-b/stay-checklist.tsx
apps/web/src/lib/auth/safe-next.ts
```

### Entry 016 — P4b UI copy cleanup và sửa dấu tiếng Việt trong WebGL hero

| Field | Value |
|---|---|
| Date | 2026-09-29, Asia/Saigon |
| Agent | Codex |
| Phase / status | P4b polish, `IMPLEMENTED_UNREVIEWED`. Chưa mở P5/P6/P7, chưa commit/push đợt sửa này. |
| Scope | Hero H1 đúng hai dòng “Vùng núi Tây Bắc” / “Việt Nam”; bỏ lời trang trí và CTA trùng ý; rút gọn lời dẫn trang chủ, `/kham-pha` và đầu năm trang header thành tên địa điểm hoặc tác vụ cụ thể. Bỏ khối CTA cuối trang chủ vì lặp ba lựa chọn ngay phía trên. CTA hero thứ hai dẫn thẳng tới Combo planner. |
| WebGL repair | Chữ “BẮC” bị cắt phần dấu Ắ ở texture WebGL do glyph cao hơn CSS line box. Mở rộng vùng texture theo cỡ font, dời tọa độ vẽ chữ tương ứng để giữ nguyên vị trí hiển thị; CSS fallback giữ nguyên. |
| Files changed | `apps/web/src/app/(public)/{page.tsx,kham-pha/page.tsx,tour-tron-goi/page.tsx,ve-may-bay/page.tsx,khach-san/page.tsx,combo-du-lich/page.tsx,dich-vu-cong-them/page.tsx}`; `apps/web/src/features/cinematic/{cinematic-hero.tsx,cinematic.module.css,mountain-renderer.ts}`; `apps/web/src/features/product-navigation-a/tour-explorer.tsx`; xóa component không còn consumer `apps/web/src/components/placeholders/final-cta.tsx`; tài liệu này. |
| Gates | Web lint exit0 trước thay đổi renderer; renderer ESLint riêng từ `apps/web` exit0 sau sửa; web typecheck exit0; web production build exit0 (43 page outputs); `git diff --check` exit0. Lệnh ESLint riêng từ repo root thất bại vì config nằm trong workspace web, đã chạy lại đúng cwd và pass. |
| Browser | Production `next start` port 11405; Chrome reduced-motion 1440/800/390/320: H1 đúng hai dòng, không tràn viewport hoặc đè CTA; sáu route công khai HTTP200 và không tràn 390px. Chrome normal-motion 1440/1920/390 và Brave normal-motion 1920 hoàn tất WebGL (`reason=completed`), screenshot sau animation cho thấy dấu Ắ đầy đủ. Script `verify.mjs` ngoài repo pass: carousel 4/2/1, năm header links, mười bài, ảnh, planner, menu mobile. Evidence tạm ở `D:\codex-task-temp\p4b-browser-verify\copy-*.png`. |
| Risk / next | Chưa kiểm tra điện thoại vật lý; nội dung các trang quản trị/P5/P6 không thuộc đợt copy này. Paw có thể refresh preview `http://127.0.0.1:11405/` để duyệt visual; phase khác chỉ mở theo ưu tiên tiếp theo. |

### Entry 017 — Khối video|info cuối trang chủ và điều hướng carousel hai bên hông

| Field | Value |
|---|---|
| Date | 2026-09-29, Asia/Saigon |
| Agent | opencode CLI (deepseek-flash) |
| Phase / status | P4b follow-up, `IMPLEMENTED_UNREVIEWED`. Không mở P5/P6/P7; không commit. |
| Authorization | Paw yêu cầu trong chat: (1) khối 1/2 video giới thiệu + 1/2 thông tin tham chiếu Cocoon, đặt trên footer; (2) nút `<>` của carousel chuyển thành hai bên hông canh giữa dọc thay vì hàng trên; (3) video chưa có tư liệu nên build khung + placeholder. |
| Scope | `apps/web/src/features/intro-video/intro-video.tsx` + `intro-video-media.tsx` mới: section cuối trang chủ (trên footer), grid đôi full-bleed 50/50, cao tối thiểu 100dvh desktop — nửa trái media (khung phim) tràn từ mép trái tới giữa màn hình với poster Mù Cang Chải, badge “Phim giới thiệu — đang chuẩn bị”, nút play disabled, credit overlay; nửa phải panel nền forest-deep từ giữa tới mép phải chứa info + 3 điểm + CTA. `IntroVideoMedia` là client component chứa sẵn cơ chế video: khi có `videoSrc` thì render `<video muted loop playsInline preload=metadata>` tự play/pause theo IntersectionObserver (40% vào view, tôn trọng prefers-reduced-motion), chưa có file thì giữ poster + placeholder. `northwest-carousel.tsx`: bỏ hàng điều khiển trên, nút ←/→ thành overlay hai bên hông canh giữa dọc, counter “Bộ sưu tập 01/10” chuyển xuống dưới track. |
| Files changed | `apps/web/src/features/intro-video/intro-video.tsx` + `apps/web/src/features/intro-video/intro-video-media.tsx` (mới); `apps/web/src/features/destinations/northwest-carousel.tsx`; `apps/web/src/app/(public)/page.tsx`; tài liệu này. |
| Dependencies added | Không |
| Commands run | `npm run typecheck --workspace @webdulich/web` exit0; `npm run lint --workspace @webdulich/web` exit0; `npm run build --workspace @webdulich/web` exit0 (43 page outputs, 10 SSG bài). |
| Browser verification | Production `next start` port 3000 + Chrome headless Playwright: 31/31 checks pass — layout split 50/50 full-bleed (media 0→720, panel 720→1440 tại 1440px; media cao đúng 900/900 viewport desktop; mobile media full width 390/320); nút prev/next carousel canh giữa dọc lệch 0.0px, sát mép (gap 30px), click next scroll 308px và prev về 0; intro heading hiển thị, nút play disabled, badge placeholder đúng; không overflow ngang; no-JS ẩn controls qua noscript và intro vẫn render. Cơ chế autoplay video chưa test với file thật vì `introVideoSrc` còn `undefined` (chưa có tư liệu). Screenshot: `D:\codex-task-temp\p4b-browser-verify\intro-home-{1440,390,320}.png`. |
| Risks | Nút overlay đè mép card ~44px (pattern slider chuẩn, chưa kiểm thiết bị cảm ứng thật); poster video là ảnh Mù Cang Chải CC0 có credit minh họa rõ, cần thay bằng video khi có tư liệu; agent không xem được ảnh nên chưa có đánh giá visual bởi người — cần Paw nhìn preview/screenshot. |
| Next action | Paw xem preview/screenshot duyệt visual; wire video thật khi có tư liệu; không tự mở phase khác. |

### Entry 018 — Wire video thật cho khối intro trang chủ

| Field | Value |
|---|---|
| Date | 2026-09-29, Asia/Saigon |
| Agent | opencode CLI (deepseek-flash) |
| Phase / status | P4b follow-up, `IMPLEMENTED_UNREVIEWED`. Không mở phase khác; không đụng vùng P5/P6 của DeepSeek. |
| Authorization | Paw yêu cầu trong chat: lấy video trong mục Downloads hôm nay wire vào khối intro trang chủ. |
| Scope | Copy `intro-tay-bac.mp4` (31 giây, 8.2MB, Paw cung cấp) vào `apps/web/public/videos/`; `introVideoSrc` chuyển từ `undefined` sang đường dẫn; panel text cập nhật theo trạng thái đã có video; cơ chế autoplay-on-view dựng sẵn ở Entry 017 được kích hoạt: muted/loop/playsInline, tự play khi 40% khối vào màn hình, tự pause khi rời view, tôn trọng prefers-reduced-motion. |
| Files changed | `apps/web/public/videos/intro-tay-bac.mp4` (mới); `apps/web/src/features/intro-video/intro-video.tsx`; tài liệu này. |
| Commands run | `npm run typecheck --workspace @webdulich/web` exit0; `npm run lint --workspace @webdulich/web` exit0; `npm run build --workspace @webdulich/web` exit0 (43 page outputs). |
| Browser verification | Production `next start` port 3000 + Chrome headless Playwright: 35/35 checks pass — video element muted/loop/playsInline; không tự chạy trước khi vào view (paused=true); scrollIntoView → autoplay thật (paused=false, currentTime=1.511s, readyState=4); cuộn lên đầu → tự pause (true); layout 50/50 full-height, carousel, mobile 390/320 và no-JS không hồi quy. |
| Risks | Nguồn/provenance video do Paw cung cấp chưa được ghi — giữ release gate như ảnh hero P2 (UNVERIFIED). Poster vẫn là ảnh Mù Cang Chải CC0 có credit. Video 8.2MB tải theo preload=metadata khi vào view — chưa đo field/mobile cho khối này. |
| Next action | Paw xem preview `http://127.0.0.1:3000` (cuộn xuống cuối trang) xác nhận video; phase khác chờ Paw mở. |

### Entry 019 — Carousel loop hai chiều, mỗi bấm một card

| Field | Value |
|---|---|
| Date | 2026-09-29, Asia/Saigon |
| Agent | opencode CLI (deepseek-flash) |
| Phase / status | P4b follow-up, `IMPLEMENTED_UNREVIEWED`. Không đụng vùng P5 của DeepSeek. |
| Authorization | Paw duyệt PA A trong chat: nút trái/phải chạy được ngay từ vị trí đầu, mỗi lần bấm chỉ nhích 1 card, wrap tại hai biên. |
| Scope | `northwest-carousel.tsx`: bỏ `disabled` hai đầu; bấm trước tại vị trí đầu → nhảy thẳng về vị trí cuối (instant, không trượt quét qua dãy card); bấm sau tại vị trí cuối → nhảy thẳng về đầu; các bước giữa giữ smooth đúng 1 card như cũ; state rút gọn còn `first` cho counter. `eslint.config.mjs` (web): mở rộng ignores thành `.next*/**` để build artifact distDir phụ `.next-p5` (từ lane P5 chạy song song) không làm fail gate `eslint .` — chỉ đổi ignore, không đổi rule. |
| Files changed | `apps/web/src/features/destinations/northwest-carousel.tsx`; `apps/web/eslint.config.mjs`; tài liệu này. |
| Commands run | `npm run typecheck --workspace @webdulich/web` exit0; `npm run lint --workspace @webdulich/web` exit0 (sau ignore fix; lần đầu fail vì ESLint quét `.next-p5` của lane P5, không phải lỗi source); `npm run build --workspace @webdulich/web` exit0 (43 page outputs). |
| Browser verification | Production `next start` port 3000 + Chrome headless Playwright: 39/39 checks — prev/next enabled ngay từ đầu; prev tại vị trí đầu → 1848/1848 (cuối track); next tại vị trí cuối → 0; next sau wrap dịch đúng 308px = 1 card; các check layout 50/50 full-height, video autoplay/pause, mobile 390/320, no-JS không hồi quy. |
| Risks | Wrap dùng nhảy tức thì (theo chốt "chỉ qua 1 box card"); chưa test thiết bị cảm ứng vật lý. |
| Next action | Paw xem `http://127.0.0.1:3000` xác nhận hành vi carousel; phase khác chờ Paw mở. |

### Handoff template

```text
### Entry NNN — <short title>

| Field | Value |
|---|---|
| Date | YYYY-MM-DD |
| Agent | <name/model> |
| Phase | Pn |
| Status | IMPLEMENTED_UNREVIEWED / VERIFIED / BLOCKED |
| Scope | <exact scope> |
| Files changed | <exact paths> |
| Dependencies added | <name + reason, or none> |
| Commands run | <command + exit code> |
| Browser verification | <routes + viewports + outcome> |
| Risks | <specific remaining risks> |
| Next authorized work | <one bounded next action or await review> |
```

---

## 14. Open decisions — không chặn Phase 1

- Điểm đến cụ thể được quảng bá.
- Tên thương hiệu cuối.
- Bộ ảnh/video có license.
- Ngôn ngữ thứ hai có nằm trong vòng loại hay không.
- Hosting provider cuối.
- Object storage provider cuối.
- Map tile/data provider cuối.

Các quyết định trên phải được Paw chốt trước phase liên quan. AI không được tự bịa để đóng decision.
