# CLAUDE.md - WhoAmI-Today Frontend

## Project Overview
- React 18.2 + TypeScript 4.9 웹 프론트엔드
- 빌드: CRACO 7.1 (Create React App 커스텀)
- 스타일링: Styled Components 5.3
- 배포: Docker + GitHub Actions

## 아키텍처

### 상태관리
- **Zustand** (슬라이스 패턴) — `stores/useBoundStore.ts`에서 통합
- 슬라이스: user, checkIn, moment, my, notification, signUpInfo, toast

### 데이터 패칭
- **SWR** (stale-while-revalidate) — 무한 스크롤, 페이지네이션
- 커스텀 훅: `useSWRInfiniteScroll.ts`, `useInfiniteFetchFriends.ts`
- **Axios** + 인터셉터 (JWT 자동 갱신, CSRF 토큰) — `utils/apis/axios.ts`

### 디렉토리 구조
```
src/
├── components/          # 기능별 27개 디렉토리 + _common/ (51개 공통 컴포넌트)
├── routes/              # 페이지 라우트 (31개)
├── stores/              # Zustand 슬라이스 (7개)
├── hooks/               # 커스텀 훅 (23개)
├── models/              # TypeScript 타입 정의 + API 타입
├── design-system/       # Button, Inputs, layouts, Font, SvgIcon, colors
├── utils/               # 유틸리티 + apis/
├── constants/           # 앱 설정 상수
├── i18n/                # 국제화 (ko/en)
├── styles/              # 글로벌 스타일 & 테마
└── libs/                # 외부 라이브러리 연동
```

### Path Alias
`@components`, `@hooks`, `@stores`, `@models`, `@utils`, `@design-system`

## 버전 시스템 (Ver.Q / Ver.W)
- `featureFlag.ts`로 버전별 기능 on/off 제어
- 주요 플래그: `CHECK_IN`, `PERSONA`, `QUESTION_RESPONSE_FEATURE`
- API 엔드포인트: `/api/` (Ver.W) vs `/api/q/` (Ver.Q)

### 알려진 이슈
- 프론트엔드가 `/api/q/` 엔드포인트를 실제로 호출하지 않음
- Ver.W 전용 페이지(`/questions`, `/discover`, `/check-in/edit`, `/chats`)에 route guard 없음

## API 연결
- **Production**: `https://whoami-test-group.gina-park.site/api/`
- **Dev**: `http://localhost:8000/api/`
- 인증: JWT (cookie `access_token` + Authorization header) + CSRF

## 외부 연동
- Firebase: Auth, Cloud Messaging, Analytics
- Spotify Web API: 음악 공유
- Sentry: 에러 트래킹
- i18next: 다국어 지원

## 코드 컨벤션

### 포매팅 (Prettier)
- 100자 줄 너비, 2스페이스 인덴트, 싱글 쿼트, trailing comma all, 세미콜론 필수

### 파일/폴더 네이밍
- 컴포넌트 파일: **PascalCase** (`NoteItem.tsx`)
- 스타일 파일: `ComponentName.styled.ts`
- 훅: **camelCase** + `use` prefix (`useAsyncEffect.ts`)
- 스토어/유틸/API: **camelCase** (`user.ts`, `axios.ts`)
- 디렉토리: **kebab-case** (`note-item/`, `post-footer/`)

### 컴포넌트 패턴
- 함수형 컴포넌트만 사용 (`function Component() {} export default Component`)
- Props는 `interface`로 정의
- Styled Components는 별도 `.styled.ts` 파일 + `import * as S from './X.styled'` 네임스페이스 패턴
- 테마 접근: `${({ theme }) => theme[colorKey]}`
- 메모이제이션: `React.memo`로 export 변형 감싸기

### 훅 패턴
- 상태와 함수를 객체로 반환 (`return { data, isLoading, mutate }`)
- 제네릭 활용 (`useSWRInfiniteScroll<T>`)

### API 호출 패턴
- `axios.get<ResponseType>(url)` — 타입 제네릭 필수
- 에러 처리: 콜백 기반 (`onSuccess`, `onError` 파라미터)
- 페이지네이션: `PaginationResponse<T>` 제네릭 타입
- 페이지 번호: `next` URL에서 `page=` 파라미터 추출

### Zustand 패턴
- 슬라이스별 `State` + `Action` 인터페이스 분리
- `SliceStateCreator<SliceType>` 타입으로 슬라이스 생성 함수 정의
- 셀렉터 패턴: `export const XxxSelector = (state: BoundState) => ({...})`
- 액션 네이밍: devtools label 포함 (`set(..., false, 'slice/actionName')`)

### TypeScript 패턴
- 객체 shape → `interface`, union/조합 → `type`
- `as const` + `typeof` 패턴으로 리터럴 타입
- `FetchState<T>` discriminated union (`'loading' | 'hasValue' | 'hasError'`)
- API 모델: `models/api/`, 도메인 모델: `models/`

### Import 순서 (ESLint 강제)
1. Node builtins (React 등)
2. External (`react-router-dom`, `styled-components` 등)
3. Internal (`@components`, `@hooks`, `@stores` 등)
4. Parent (`../`)
5. Sibling (`./`)
— 각 그룹 내 알파벳 정렬

### i18n 사용
- `const [t] = useTranslation('translation', { keyPrefix: 'section_name' })`
- 모듈 레벨: `import i18n from '@i18n/index'`

---

## Visual / UI rules

### Chips / pills (one canonical style)
- `border-radius: 8px`, `padding: 4px 8px`, `font-size: 14px` (label-large), `border: 1px solid/dashed #D9D9D9`, `background: white`.
- Selected: `#F3E8FF` bg with `#8700FF` text/border. **Note:** `#F3E8FF` is hardcoded in `src/models/chips.ts`, not in the design-system color palette — centralize before adding more usages.
- **No `rounded={999}` anywhere.** All chips use `rounded={8}`.
- Spotify music pills: same 8px standard, with green Spotify border (`SPOTIFY_GREEN = #4AD159`).

### Color palette
- Primary purple `#8700FF`; `SECONDARY` `#87DFFF` (light cyan); `TERTIARY_PINK` `#FF00A8`; `TERTIARY_BLUE` `#0047FF`.
- Grayscale: `BLACK`, `DARK`, `DARK_GRAY`, `MEDIUM_GRAY`, `LIGHT_GRAY`, `LIGHT`, `WHITE`.
- "New post" badge: purple bg `#EEE6F4`.
- Degree of connection text: `DARK_GRAY` (regular, NOT pink/colored).

### Placeholders (empty states)
Empty states on the friends tab MUST match the profile page placeholders exactly. Reuse the `*Placeholder` components in `src/components/profile/placeholders/`:
`MusicPlaceholder`, `SocialBatteryPlaceholder`, `MoodPlaceholder`, `ThoughtPlaceholder`, `InterestPlaceholder`, `BioPlaceholder`, `PronounsBioPlaceholder`, `PersonaPlaceholder`. Reuse, don't reimplement.

### Friend card
- **Social battery:** compact mode (borderless, bare emoji) on friend cards; bordered chip with translated label only on profile / edit pages.
- **Mood emojis:** stacked inline with battery (negative margin overlap), separated by `|` divider. Divider also between close friend badge and battery/mood section.
- **Thought snippet:** separate pill below the username row. Display pills are prefixed with 💭 so they read as quoted thoughts.
- **Click zones** are separated: profile pic + username → profile page; social battery → battery popup; status → status popup; "New post" → posts page; ping icon → ping.

### Visibility toggles
Text-only labels (Public | Friends | Close Friends | Only Me), `label-large` font, `6px` / `10px` padding. **No emoji icons, no colored icons.**

### Other UI components
- **Nudge buttons:** show per-component independently (not all-or-nothing). 4 types: battery, mood, thought, song.
- **Ping/poke buttons:** dashed border + dark-gray text — NOT solid border + purple. Same 8px radius / 4px 8px padding.
- **Bottom nav order (Ver. W):** Friends → Daily Digest → Check-In → Share → Chats. "Daily Digest" is the Ver. W rename of the Discover tab — same `/discover` route + `discover_active/inactive` icon, label from `nav_tab.digest`. Ver. Q order: Friends (label/icon, `/feed` route) → Discover → Share → Chats → My.
- **Check-In tab:** 2x2 grid, popup editors with "Share" button that auto-saves immediately (no global Save button).
- **Share page:** single vertical scroll with Photo (TERTIARY_PINK gradient), Mission (purple gradient), Questions (SECONDARY bg). No tabs.
- **Headers:** all should have notification bell + hamburger menu (including Chats, renamed from "Ping"). "Post" button text says "Share".

### Layout safety
- **`FixedFullScreen`** uses `left: 50%; transform: translate(-50%)` with `SCREEN_WIDTH`. **Never override `left`** without understanding this centering math.
- **Responsive at 320px:** layouts must not break at 320px (iPhone SE 1st gen). Use `flex-wrap` (or equivalent) so rows reflow rather than clip / overflow.

## Feature / UX rules

- **Each check-in component** (battery, mood, thought, song) is independent — separate visibility settings, separate popups when tapped.
- **Visibility is 4-way everywhere:** Public, Friends, Close Friends, Only Me. Frontend `ComponentVisibility` enum in `src/models/checkIn.ts` matches backend `VISIBILITY_CHOICES`.
- **Check-in detail popup** shows only the tapped component, not all together.
- **Social battery in popup** renders like mood: big emoji + translated label (not a pill chip).
- **Reactions** toggle directly with toast ("Reacted 🔥" / "Removed 🔥") — no confirmation dialog.
- **Check-in reactions:** filter by current user ID when loading, show as selected on popup reopen. API returns paginated (`{ results: [...] }`) — handle that.
- **Nudge / poke un-do** uses the app's `CommonDialog` component for confirmation.
- **"New post" badge** disappears after viewing the friend's posts (SWR cache invalidation).
- **Nudge poked state** shows which component was nudged: "Nudged: song ✓", "Nudged: vibe ✓", "Nudged: battery ✓".
- **Profile visibility per-field:** flags on the User model — `pronouns_friends_only`, `bio_friends_only`, plus music/hobbies/online-persona/favorite-platform/least-favorite-platform `*_friends_only` flags. **No `name_friends_only` field exists** as of 2026-04-30 — verify the User model before claiming a name-redaction behavior.
- **Profile accessed** by tapping own username/image on Friends tab (no separate "My" tab in nav).
- **Photo of the Day:** photo-first flow — file picker opens directly from Share tab → crop editor → caption + visibility → post. Component: `src/components/share/PhotoOfTheDayFlow.tsx`.
- **Mission of the Day:** routes to `/notes/new` with `{ state: { missionMode: true } }`. Mission prompt as placeholder. 5 daily attempts, marks complete only after actual post, "Try again (X left)" wording.
- **Thought Snippets:** show "👥 Visible to friends only" note at the bottom. Display pills are prefixed with 💭.

### Prohibited patterns
*(Convention only; not all eslint-enforced — check `.eslintrc.json` before claiming a rule is lint-enforced.)*
- No `for...of` loops — use `.forEach()` or `.map()`.
- No `window.confirm` — use the app's `CommonDialog` component.
- No array index in React keys — use unique identifiers or computed keys like `${emoji}${dupeCount}`.

## Verification workflow

After any frontend change that's previewable:

1. `source ~/.nvm/nvm.sh && nvm use 18` before any node command. The system node is broken.
2. `npx craco build` — must exit clean (no TS / ESLint errors). **NOT sufficient on its own.**
3. Start the dev server. Verify it compiles with no error overlay. The dev server's webpack watch can hold stale module resolution after rebases / conflict resolutions, so this check catches things `craco build` misses.
4. **Mandatory** for visual changes: take a screenshot at 320px AND 393px viewports (and 375px when iOS-relevant). The app is mobile-first and frequently runs at 320px (iPhone SE 1st gen).
5. Check `preview_console_logs` — no JS errors.
6. For spacing / alignment changes: use `preview_eval` to measure pixel gaps; don't trust visual approximation.
7. For state-change flows: hit the change, then reload, then verify state persisted (frontend cache + backend round-trip).

**Backend persistence verification.** After any save operation, query the backend (Django shell or API) to confirm the data persisted. UI showing the right thing is not enough — the round-trip is.

### Prettier
- Always run on changed files before committing — the husky pre-commit hook enforces via lint-staged.
- Use the local binary `node_modules/.bin/prettier`, NOT a fresh `npx prettier`. `npx` can resolve to a different version than the project pins, causing churn.
- If a line is too long, prettier wants it split across lines with trailing commas — check before committing.
