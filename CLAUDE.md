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
