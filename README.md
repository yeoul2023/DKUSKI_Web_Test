# DKU SKI TEAM 웹사이트 개발자 전달 README

## 0. 문서 목적

이 문서는 현재 작성된 `index.html` 데모를 실제 웹서비스로 전환하기 위해, 프론트엔드 수정 방향과 백엔드 구현 요구사항을 개발자에게 전달하기 위한 작업 지시서입니다.

현재 데모는 **디자인, 화면 흐름, 관리자 기능, 입부 신청, 활동 기록, 멤버 표시를 검토하기 위한 단일 HTML 파일**입니다. 실제 운영용 웹사이트로 배포하려면 반드시 백엔드, 인증, 데이터베이스, 파일 저장소, 권한 관리가 추가되어야 합니다.

기준 데모 파일:

```text
index_restored_no_photo_consent_dates_2025_2026.html
```

현재 데모 파일 크기: `140,938 bytes`

---

## 1. 프로젝트 개요

### 서비스명

단국대학교 스키부 공식 웹사이트  
DKU SKI TEAM / Dankook University Ski Club

### 목적

공식 홍보 사이트와 동아리 운영용 관리자 기능을 함께 제공하는 웹서비스를 구축합니다.

핵심 목적은 다음과 같습니다.

1. 외부 방문자에게 스키부 소개, 모집 정보, 활동 기록을 보여줍니다.
2. 신입 부원이 온라인 입부 신청서를 제출할 수 있게 합니다.
3. 관리자가 입부 신청서를 확인하고 승인 또는 거절할 수 있게 합니다.
4. 승인된 신청자를 부원 명단으로 전환합니다.
5. YB / OB 명단을 공개용 정보 기준으로 표시합니다.
6. 활동 기록을 카드형 게시판으로 관리합니다.
7. 실제 배포 시에는 개인정보와 관리자 기능을 안전하게 보호합니다.

---

## 2. 현재 데모의 성격과 한계

현재 데모는 단일 HTML 파일 안에 다음 요소가 포함되어 있습니다.

- Tailwind CDN 기반 스타일
- 정적 HTML 섹션
- JavaScript 기반 SPA 유사 페이지 전환
- `localStorage` 기반 데모 데이터 저장
- 관리자 로그인 데모
- 입부 신청서 데모
- 관리자 승인 요청 데모
- 회원 명단 관리 데모
- 활동 기록 관리 데모
- 모달, 토스트, 필터, 검색 UI

### 중요한 한계

현재 데모는 실제 서비스가 아닙니다.

특히 다음 부분은 실제 배포 시 그대로 사용하면 안 됩니다.

| 항목 | 현재 데모 | 실제 구현 필요사항 |
|---|---|---|
| 관리자 로그인 | `localStorage` 값으로 상태 저장 | 서버 기반 인증 필요 |
| 데이터 저장 | 브라우저 `localStorage` | DB 저장 필요 |
| 입부 신청 | 같은 브라우저에서만 확인 가능 | 백엔드 API로 저장 |
| 회원 관리 | 프론트엔드 배열 조작 | 관리자 권한 API 필요 |
| 활동 기록 | 데모 데이터 + localStorage | 게시글 DB + 이미지 저장소 필요 |
| 개인정보 보호 | UI에서 숨기는 수준 | 서버 권한 검증 필요 |
| 파일 업로드 | URL 입력 중심 | 실제 이미지 업로드/스토리지 필요 |

---

## 3. 현재 페이지 구조

데모는 해시 기반 페이지 전환 구조를 사용합니다.

```js
const pages = ["home", "about", "recruitment", "archive", "members", "admin", "contact"];
```

각 페이지 섹션은 다음 ID를 기준으로 구성되어 있습니다.

| 페이지 | 섹션 ID | 설명 |
|---|---|---|
| 홈 | `page-home` | 메인 히어로, 핵심 가치, 시즌 합숙 소개 |
| 소개 | `page-about` | 동아리 소개, Identity 문구 |
| 모집 | `page-recruitment` | 모집 안내, 입부 신청서 |
| 활동 기록 | `page-archive` | 활동 기록 카드형 게시판 |
| 멤버 | `page-members` | YB / OB 공개 명단 |
| 회원 관리 | `page-admin` | 관리자용 신청/회원/활동 기록 관리 |
| 문의 | `page-contact` | 인스타그램, 이메일, 지원 안내 |

---

## 4. 디자인 유지 원칙

현재 데모에서 디자인 완성도가 높은 편이므로 실제 구현 시 다음 디자인 방향을 최대한 유지합니다.

### 4.1 색상

현재 DKU 계열 색상 팔레트를 사용합니다.

```css
--dku-blue: #00539E;
--primary: #003c75;
--primary-dark: #002A53;
--primary-light: #C2E0F6;
--blue-400: #009DDC;
--blue-200: #77BDE8;
--blue-100: #B8D0ED;
--gold-muted: #C3AD8A;
--surface: #F9F9FF;
--surface-low: #F2F3FA;
--text: #191C21;
--muted: #424751;
--border: #E5E7EB;
```

실제 구현에서도 이 색상 체계를 유지합니다.

### 4.2 레이아웃

현재 레이아웃 특징:

- 최대 컨테이너 폭: `1280px`
- 데스크톱 좌우 여백: `64px`
- 모바일 좌우 여백: `20px`
- 섹션 간격: `80px`
- 카드형 UI 중심
- 둥근 모서리와 얕은 그림자 사용
- DKU Blue / White / Light Surface 조합

### 4.3 폰트

현재 사용 폰트:

```text
Inter
Noto Sans KR
```

한국어 본문 가독성을 위해 `Noto Sans KR` 유지 권장.

### 4.4 유지해야 할 시각 요소

- 상단 고정 헤더
- 흰색/반투명 헤더 + 파란색 활성 메뉴
- 메인 히어로 이미지와 어두운 오버레이
- 카드 hover 효과
- 원형 pill 버튼
- `eyebrow` 라벨 디자인
- 관리자 테이블의 둥근 카드형 컨테이너
- 활동 기록 카드형 게시판

---

## 5. 주요 사용자 유형

실제 구현 시 권한은 최소 다음과 같이 분리합니다.

| 권한 | 설명 |
|---|---|
| Public | 비로그인 방문자 |
| Applicant | 입부 신청자 |
| Member | 승인된 일반 부원 |
| Admin | 주장단/관리자 |
| Super Admin | 최고 관리자, 초기 관리자 계정 관리 권한 |

초기 MVP에서는 `Public`, `Member`, `Admin`만 구현해도 됩니다. 다만 관리자 기능은 반드시 서버 인증 기반으로 보호해야 합니다.

---

## 6. 현재 데모 기능 요약

### 6.1 공개 페이지

공개 사용자가 볼 수 있는 기능:

- 홈 페이지
- 동아리 소개
- 모집 안내
- 입부 신청서
- 활동 기록 조회
- YB / OB 공개 명단 조회
- 문의 정보 확인

### 6.2 입부 신청

현재 데모 신청서 필드:

| 필드 ID | 설명 |
|---|---|
| `name` | 성명 |
| `student_id` | 학번 |
| `department` | 학과 |
| `year` | 학년 |
| `phone` | 연락처 |
| `email` | 이메일 |
| `experience` | 스키 숙련도 |
| `motivation` | 지원 동기 |
| checkbox | 개인정보 수집·이용 동의 |

실제 구현 시 이 신청서는 백엔드 API로 저장되어야 합니다.

### 6.3 관리자 페이지

관리자 페이지 주요 기능:

- 관리자 로그인 데모
- 전체 부원 수 통계
- 승인 대기 요청 목록
- 신청서 상세 확인
- 승인 / 거절
- 부원 명단 관리
- 부원 추가 / 수정 / 삭제
- 관리자 메모
- CSV 내보내기
- 데이터 초기화
- 활동 기록 관리

현재는 전부 `localStorage` 기반입니다.

### 6.4 활동 기록

활동 기록 데이터 구성:

- 제목
- 설명
- 활동 유형
- 날짜
- 시즌
- 장소
- 작성자
- 참여 부원
- 공개 범위
- 대표 이미지 URL
- 태그

사진 공개 동의 여부는 제거되었습니다. 동아리 가입 시 사진 사용 동의가 이루어진다는 전제이므로, 활동 기록 단위에서 별도 동의 필드를 관리하지 않습니다.

---

## 7. 실제 백엔드 구현 요구사항

### 7.1 권장 기술 스택

아래 중 하나로 구현할 수 있습니다.

#### 선택지 A: 빠른 MVP

- Frontend: Next.js 또는 React
- Backend: Supabase
- Auth: Supabase Auth
- DB: PostgreSQL
- Storage: Supabase Storage
- Hosting: Vercel

#### 선택지 B: 커스텀 백엔드

- Frontend: Next.js / React / Vue 중 선택
- Backend: Node.js NestJS 또는 Express
- DB: PostgreSQL
- ORM: Prisma
- Storage: S3 호환 스토리지
- Auth: 세션 또는 JWT
- Hosting: Vercel + Railway/Fly.io/Render/AWS 등

#### 선택지 C: Firebase 기반

- Frontend: React 또는 Next.js
- Auth: Firebase Auth
- DB: Firestore
- Storage: Firebase Storage
- Hosting: Firebase Hosting 또는 Vercel

동아리 운영용 MVP라면 **Supabase 기반**이 가장 빠릅니다.

---

## 8. 데이터베이스 설계안

### 8.1 users

로그인 계정 테이블.

```sql
users (
  id uuid primary key,
  email text unique not null,
  name text not null,
  role text not null check (role in ('member', 'admin', 'super_admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)
```

### 8.2 member_profiles

부원 프로필 테이블.

```sql
member_profiles (
  id uuid primary key,
  user_id uuid references users(id),
  name text not null,
  generation text,
  role text,
  major text,
  student_id text,
  phone text,
  email text,
  status text not null check (status in ('yb', 'ob', 'pending', 'rejected', 'inactive')),
  level text,
  memo text,
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)
```

공개 페이지에는 다음 정보만 표시합니다.

- 이름
- 기수
- 역할
- 전공
- 스키 레벨 정도

공개 페이지에 표시하지 말아야 할 정보:

- 학번
- 전화번호
- 이메일
- 관리자 메모
- 내부 상태값
- 신청서 원문

### 8.3 applications

입부 신청서 테이블.

```sql
applications (
  id uuid primary key,
  name text not null,
  student_id text,
  department text,
  year text,
  phone text,
  email text,
  experience text,
  motivation text,
  privacy_consent boolean not null default false,
  status text not null default 'pending'
    check (status in ('pending', 'review', 'approved', 'rejected')),
  admin_memo text,
  decision_reason text,
  decided_by uuid references users(id),
  decided_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)
```

신청 상태값:

| 상태 | 의미 |
|---|---|
| `pending` | 접수됨 |
| `review` | 추가 확인 필요 |
| `approved` | 승인 |
| `rejected` | 거절 |

승인 시 `member_profiles`에 자동으로 부원 프로필을 생성합니다.

### 8.4 archive_posts

활동 기록 게시글 테이블.

```sql
archive_posts (
  id uuid primary key,
  title text not null,
  description text,
  category text not null check (category in ('training', 'trip', 'competition', 'ob')),
  activity_date date,
  season text,
  location text,
  author_id uuid references member_profiles(id),
  visibility text not null default 'public'
    check (visibility in ('public', 'members', 'admin')),
  cover_image_url text,
  tags text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)
```

사진 공개 동의 필드는 만들지 않습니다.

### 8.5 archive_post_participants

활동 기록 참여 부원 연결 테이블.

```sql
archive_post_participants (
  post_id uuid references archive_posts(id) on delete cascade,
  member_id uuid references member_profiles(id) on delete cascade,
  primary key (post_id, member_id)
)
```

### 8.6 media_assets

이미지/파일 업로드 관리 테이블.

```sql
media_assets (
  id uuid primary key,
  owner_id uuid references users(id),
  url text not null,
  storage_path text,
  mime_type text,
  size_bytes integer,
  alt_text text,
  created_at timestamptz default now()
)
```

### 8.7 audit_logs

관리자 작업 로그.

```sql
audit_logs (
  id uuid primary key,
  actor_id uuid references users(id),
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
)
```

권장 기록 대상:

- 관리자 로그인
- 신청서 승인
- 신청서 거절
- 회원 정보 수정
- 회원 삭제
- 활동 기록 삭제
- 관리자 권한 변경

---

## 9. API 설계안

### 9.1 인증

```http
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

반드시 서버에서 세션 또는 토큰을 검증해야 합니다.

### 9.2 입부 신청

```http
POST /api/applications
GET  /api/admin/applications
GET  /api/admin/applications/:id
PATCH /api/admin/applications/:id/status
PATCH /api/admin/applications/:id/memo
DELETE /api/admin/applications/:id
```

#### POST /api/applications 요청 예시

```json
{
  "name": "홍길동",
  "studentId": "3220XXXX",
  "department": "전자전기공학부",
  "year": "2학년",
  "phone": "010-0000-0000",
  "email": "student@dankook.ac.kr",
  "experience": "초보",
  "motivation": "겨울 합숙과 스키 훈련에 참여하고 싶습니다.",
  "privacyConsent": true
}
```

#### PATCH /api/admin/applications/:id/status 요청 예시

```json
{
  "status": "approved",
  "decisionReason": ""
}
```

승인 처리 시 서버에서 부원 프로필을 생성합니다.

### 9.3 부원 관리

```http
GET    /api/members/public
GET    /api/admin/members
POST   /api/admin/members
GET    /api/admin/members/:id
PATCH  /api/admin/members/:id
DELETE /api/admin/members/:id
GET    /api/admin/members/export.csv
```

### 9.4 활동 기록

```http
GET    /api/archive-posts
GET    /api/archive-posts/:id
POST   /api/archive-posts
PATCH  /api/archive-posts/:id
DELETE /api/archive-posts/:id
```

권한 기준:

| 작업 | 권한 |
|---|---|
| 외부 공개 글 조회 | Public |
| 부원 공개 글 조회 | Member 이상 |
| 관리자 공개 글 조회 | Admin 이상 |
| 글 작성 | Member 이상 또는 Admin |
| 본인 글 수정 | 작성자 |
| 본인 글 삭제 | 작성자 |
| 부적절한 글 삭제 | Admin |
| 모든 글 수정 | Admin, 운영 정책에 따라 조정 |

실제 정책은 운영진 결정에 맞춰 조정 가능합니다.

### 9.5 파일 업로드

```http
POST /api/uploads
DELETE /api/uploads/:id
```

업로드 제한:

- 이미지 파일만 허용: jpg, jpeg, png, webp
- 파일 크기 제한: 예시 5MB 또는 10MB
- MIME 타입 검증
- 확장자 검증
- 랜덤 파일명 저장
- 원본 파일명 그대로 저장 금지

---

## 10. 프론트엔드 전환 지침

### 10.1 단일 HTML에서 컴포넌트 구조로 분리

현재 단일 HTML을 실제 프로젝트에서는 다음처럼 분리합니다.

```text
src/
  app/
    page.tsx
    about/page.tsx
    recruitment/page.tsx
    archive/page.tsx
    members/page.tsx
    admin/page.tsx
    contact/page.tsx
  components/
    Header.tsx
    Footer.tsx
    Hero.tsx
    PageTitle.tsx
    ArchiveCard.tsx
    MemberCard.tsx
    ApplicationForm.tsx
    AdminRequestTable.tsx
    AdminMemberTable.tsx
    Modal.tsx
    Toast.tsx
  lib/
    api.ts
    auth.ts
    validators.ts
  styles/
    globals.css
```

Next.js가 아니라 React SPA로 구현해도 같은 구조를 적용합니다.

### 10.2 유지해야 할 DOM/기능 흐름

현재 데모에서 중요한 기능 흐름:

1. 사용자가 모집 페이지에서 신청서 제출
2. 신청서가 관리자 승인 대기 목록에 표시
3. 관리자가 신청서 상세 확인
4. 승인 시 부원 명단으로 전환
5. 멤버 페이지에 공개 가능한 정보만 표시
6. 활동 기록은 카드형으로 노출
7. 활동 기록 상세 모달에서 작성자, 참여 부원, 공개 범위, 태그 표시

### 10.3 localStorage 제거

현재 데모의 localStorage 키:

```js
dku-ski-admin-auth
dku-ski-admin-members
dku-ski-admin-requests
dku-ski-admin-archive-records
```

실제 구현에서는 이 키들을 운영 데이터 저장소로 사용하지 않습니다.

대체 방식:

- 인증 상태: 서버 세션 또는 Auth SDK
- 회원 데이터: DB
- 신청서 데이터: DB
- 활동 기록: DB + 스토리지
- 임시 UI 상태만 localStorage 허용

---

## 11. 보안 및 개인정보 요구사항

### 11.1 공개 금지 개인정보

다음 정보는 공개 페이지에 표시하지 않습니다.

- 학번
- 전화번호
- 이메일
- 관리자 메모
- 입부 신청서 원문
- 거절 사유
- 내부 상태값
- 계정 ID

### 11.2 관리자 API 보호

관리자 기능은 프론트엔드에서 숨기는 것만으로는 부족합니다. 모든 관리자 API는 서버에서 권한을 검증해야 합니다.

필수 검증:

- 로그인 여부
- 관리자 권한 여부
- 요청자 계정 상태
- CSRF 또는 토큰 검증
- Rate limit
- 입력값 검증

### 11.3 신청서 보안

입부 신청서 제출 API에는 다음 방어가 필요합니다.

- 스팸 방지
- 동일 학번/전화번호 중복 신청 제한
- 개인정보 동의 체크 필수
- 전화번호/이메일 형식 검증
- 관리자에게만 상세 정보 노출

### 11.4 이미지 업로드 보안

- MIME 타입 검증
- 파일 크기 제한
- 이미지 리사이징 고려
- 악성 스크립트 업로드 방지
- 원본 파일명 노출 금지
- 업로드 권한 검증

---

## 12. 활동 기록 정책

### 12.1 사진 사용 동의

활동 기록 단위의 사진 공개 동의 필드는 사용하지 않습니다.

이유:

- 동아리 가입 시 사진 사용 동의를 받는다는 전제
- 활동 기록마다 별도 동의 필드를 관리하면 운영 복잡도가 증가
- 실제 운영에서는 가입 약관/개인정보 수집 동의서에 사진 사용 범위를 명시하는 방식이 적합

### 12.2 공개 범위

활동 기록은 다음 공개 범위를 갖습니다.

| 값 | 의미 |
|---|---|
| `public` | 외부 공개 |
| `members` | 부원 공개 |
| `admin` | 관리자 공개 |

프론트엔드에서 숨기는 것만으로는 부족합니다. 서버 쿼리 단계에서 권한별로 반환 데이터를 제한해야 합니다.

### 12.3 작성/삭제 권한

권장 정책:

- 일반 부원: 본인 글 작성/수정/삭제
- 관리자: 모든 글 삭제 가능
- 관리자: 부적절한 글 비공개 처리 가능
- 관리자: 모든 글 수정 가능 여부는 운영 정책에 따라 결정

---

## 13. 관리자 기능 요구사항

### 13.1 관리자 신청서 관리

관리자는 다음 작업을 할 수 있어야 합니다.

- 신청서 목록 조회
- 신청서 상세 조회
- 상태 변경
  - 접수됨
  - 추가 확인 필요
  - 승인
  - 거절
- 관리자 메모 작성
- 승인 시 부원 등록
- 거절 사유 저장
- 신청서 CSV 또는 JSON 백업

### 13.2 회원 관리

관리자는 다음 작업을 할 수 있어야 합니다.

- 회원 목록 조회
- 회원 추가
- 회원 수정
- 회원 삭제 또는 비활성화
- YB / OB / 승인 대기 / 거절 상태 필터
- 이름, 기수, 역할, 전공 검색
- 연락처 복사
- 관리자 메모 작성
- CSV 내보내기

삭제는 실제 삭제보다 `inactive` 처리 권장.

### 13.3 활동 기록 관리

현재 데모에는 활동 기록 관리 UI가 있습니다. 실제 구현에서는 다음 중 하나로 정리합니다.

#### 방식 A: 관리자 페이지에서 관리

- 현재 데모와 유사
- 관리자 페이지에서 활동 기록 CRUD
- 운영자가 통합 관리하기 쉬움

#### 방식 B: 활동 기록 페이지에서 관리

- 일반 부원도 글 작성 가능
- 관리자는 부적절한 글 삭제 가능
- 실제 커뮤니티형 서비스에 더 자연스러움

권장 방향은 **방식 B**입니다. 다만 MVP에서는 방식 A가 더 빠릅니다.

---

## 14. UX 개선 권장사항

### 14.1 신청 완료 화면

신청서 제출 후 단순 alert나 toast만 보여주지 말고 완료 화면을 제공합니다.

표시 정보:

- 신청자 이름
- 학과
- 학년
- 제출 시각
- 신청 번호
- 관리자 검토 안내 문구

### 14.2 관리자 모바일 사용성

실제 운영 중 휴대폰에서 확인할 가능성이 높습니다.

권장:

- 데스크톱: 테이블 유지
- 모바일: 카드형 리스트 제공
- 신청서 상세는 접이식 영역
- 승인/거절 버튼은 카드 하단 배치

### 14.3 검색/필터

현재 데모의 검색/필터 흐름은 유지합니다.

필수 필터:

- 신청서 상태
- 요청 유형
- 회원 상태
- 활동 기록 유형
- 연도
- 공개 범위

### 14.4 토스트/피드백

사용자 액션 후 즉시 피드백을 줍니다.

예시:

- 신청 완료
- 저장 완료
- 삭제 완료
- 권한 없음
- 네트워크 오류
- 이미지 업로드 실패

---

## 15. 실제 배포 전 체크리스트

### 15.1 프론트엔드

- [ ] 단일 HTML을 컴포넌트 구조로 분리
- [ ] Tailwind 설정 정리
- [ ] 디자인 토큰 색상 유지
- [ ] 모든 페이지 반응형 점검
- [ ] 모바일 메뉴 점검
- [ ] 모달 접근성 점검
- [ ] 이미지 alt 텍스트 추가
- [ ] SEO 메타 태그 정리
- [ ] Open Graph 이미지 설정
- [ ] 실제 인스타그램/이메일 링크 연결

### 15.2 백엔드

- [ ] DB 스키마 생성
- [ ] Auth 구현
- [ ] 관리자 권한 검증
- [ ] 신청서 제출 API
- [ ] 신청서 승인 API
- [ ] 회원 관리 API
- [ ] 활동 기록 API
- [ ] 이미지 업로드 API
- [ ] CSV 내보내기 API
- [ ] Audit log 구현
- [ ] Rate limit 적용

### 15.3 보안

- [ ] 관리자 페이지 서버 권한 검증
- [ ] 개인정보 공개 차단
- [ ] 신청서 입력값 검증
- [ ] XSS 방어
- [ ] CSRF 또는 토큰 검증
- [ ] 파일 업로드 보안 검증
- [ ] 환경변수 분리
- [ ] DB 백업 정책

### 15.4 운영

- [ ] 관리자 계정 초기 생성
- [ ] 회장/부회장/훈련팀장 권한 분리 여부 결정
- [ ] 사진 사용 동의 문구를 가입 약관에 포함
- [ ] 개인정보 보관 기간 결정
- [ ] 졸업 후 OB 전환 정책 결정
- [ ] 활동 기록 삭제/비공개 처리 정책 결정

---

## 16. 우선 구현 순서

개발 우선순위는 다음을 권장합니다.

### 1단계: 공개 웹사이트 안정화

- 홈
- 소개
- 모집
- 활동 기록
- 멤버
- 문의
- 반응형 레이아웃
- 정적 콘텐츠 정리

### 2단계: 입부 신청 백엔드 연결

- 신청서 제출 API
- DB 저장
- 관리자 신청서 목록
- 신청서 상세 보기

### 3단계: 관리자 인증

- 로그인
- 관리자 권한
- 세션 유지
- 관리자 페이지 보호

### 4단계: 회원 관리

- 신청 승인 시 회원 생성
- 회원 수정
- 회원 상태 관리
- 공개 멤버 페이지 연동

### 5단계: 활동 기록

- 활동 기록 DB 연결
- 이미지 업로드
- 공개 범위 권한 처리
- 작성/삭제 권한 처리

### 6단계: 운영 기능

- CSV/JSON 백업
- Audit log
- 관리자 권한 분리
- 이메일/카카오톡/문자 안내 연동 여부 검토

---

## 17. 개발자에게 주의시킬 점

1. 현재 데모의 디자인을 크게 바꾸지 말 것.
2. `localStorage` 기반 관리자 기능을 실제 보안 기능으로 착각하지 말 것.
3. 학번, 전화번호, 이메일은 공개 페이지에 절대 노출하지 말 것.
4. 사진 공개 동의 필드는 활동 기록에 만들지 말 것.
5. 사진 사용 동의는 동아리 가입 약관/신청서 동의 문구에서 처리할 것.
6. 활동 기록의 공개 범위는 프론트엔드가 아니라 서버에서 필터링할 것.
7. 관리자 페이지 접근 제한은 반드시 서버에서 검증할 것.
8. 데모의 시각적 완성도를 유지하면서 내부 구조만 실제 서비스 구조로 교체할 것.
9. 기능을 과도하게 늘리기보다 입부 신청, 회원 관리, 활동 기록을 먼저 안정화할 것.
10. 실제 배포 전 개인정보 처리 문구와 운영 약관을 검토할 것.

---

## 18. MVP 완료 기준

다음 조건을 만족하면 1차 운영 가능한 MVP로 봅니다.

- [ ] 공개 페이지가 정상적으로 배포됨
- [ ] 입부 신청서가 실제 DB에 저장됨
- [ ] 관리자가 다른 기기에서 신청서를 확인할 수 있음
- [ ] 관리자가 신청서를 승인/거절할 수 있음
- [ ] 승인된 신청자가 부원 명단으로 전환됨
- [ ] 공개 멤버 페이지에는 민감 정보가 표시되지 않음
- [ ] 활동 기록이 DB에서 불러와짐
- [ ] 관리자가 활동 기록을 작성/수정/삭제할 수 있음
- [ ] 이미지 업로드가 가능함
- [ ] 관리자 페이지는 비로그인 사용자가 접근할 수 없음
- [ ] 모든 관리자 API가 서버 권한 검증을 통과해야만 작동함
- [ ] 모바일과 데스크톱에서 레이아웃이 깨지지 않음

---

## 19. 참고: 현재 데모에서 반드시 유지할 문구

### 국문 슬로건

```text
여유롭지만 가볍지 않고,
자유롭지만 흐트러지지 않는
```

### 영문 슬로건

```text
Free in spirit, grounded in character.
```

### 동아리명

```text
단국대학교 스키부
DKU SKI TEAM
Dankook University Ski Club
```

---

## 20. 최종 요약

현재 `index.html`은 실제 구현 전 디자인과 사용자 흐름을 검토하기 위한 데모입니다.  
개발자는 이 파일을 그대로 운영 서버에 올리는 것이 아니라, 디자인과 흐름을 기준으로 삼아 프론트엔드를 컴포넌트화하고, 모든 운영 데이터는 백엔드와 DB로 이전해야 합니다.

가장 중요한 구현 순서는 다음입니다.

```text
공개 페이지 안정화
→ 입부 신청 DB 저장
→ 관리자 인증
→ 신청서 승인/회원 전환
→ 회원 관리
→ 활동 기록/이미지 업로드
→ 권한 관리/운영 로그
```

보안상 핵심은 다음입니다.

```text
localStorage 관리자 인증 제거
개인정보 공개 차단
관리자 API 서버 권한 검증
활동 기록 공개 범위 서버 필터링
```
