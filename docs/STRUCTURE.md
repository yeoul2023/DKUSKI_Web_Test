# DKU Ski Site Structure

이 폴더는 기존 단일 `index.html` 데모를 유지보수하기 쉬운 정적 웹 프로젝트로 나눈 버전입니다.

## 폴더 구조

```text
dku-ski-site/
  index.html
  package.json
  server.mjs
  assets/
    css/
      styles.css
    js/
      app.js
      data.js
      tailwind.config.js
  docs/
    STRUCTURE.md
```

## 파일 역할

- `index.html`: 페이지 마크업과 섹션 구조만 담당합니다.
- `assets/css/styles.css`: 공통 디자인 시스템, 카드, 버튼, 모달, 반응형 스타일을 담당합니다.
- `assets/js/tailwind.config.js`: Tailwind CDN 색상, spacing, font 설정을 담당합니다.
- `assets/js/data.js`: 멤버, 신청, 활동 기록 데모 데이터를 담당합니다.
- `assets/js/app.js`: 페이지 전환, 폼 제출, 관리자 데모, 활동 기록 렌더링 등 동작을 담당합니다.
- `server.mjs`: ES module import가 안정적으로 동작하도록 로컬 정적 서버를 실행합니다.

## 실행

```bash
npm run dev
```

브라우저에서 다음 주소를 엽니다.

```text
http://localhost:4173
```

## 다음 단계

1. `data.js`의 데모 데이터를 Firebase Firestore 컬렉션으로 이동합니다.
2. `app.js`의 localStorage 저장 로직을 API 또는 Firebase SDK 호출로 교체합니다.
3. 관리자 로그인 데모를 Firebase Auth 또는 Google Cloud Identity 기반 인증으로 교체합니다.
4. 활동 사진 원본은 Cloud Storage 비공개 경로에 저장하고, 웹에는 압축본 URL만 노출합니다.
