# DKU Ski Site

단국대학교 스키부 웹사이트 데모를 유지보수하기 쉬운 정적 프로젝트 구조로 분리한 버전입니다.

## 실행

```bash
npm run dev
```

브라우저에서 엽니다.

```text
http://localhost:4173/
```

## 주요 파일

- `index.html`: 페이지 구조
- `assets/css/styles.css`: 공통 스타일
- `assets/js/tailwind.config.js`: Tailwind CDN 설정
- `assets/js/data.js`: 데모 데이터
- `assets/js/app.js`: 화면 동작
- `docs/STRUCTURE.md`: 구조 설명과 다음 단계

## 다음 개발 방향

현재 구조는 Firebase/Google Cloud 연동 전 단계입니다. 이후에는 `data.js`와 `localStorage` 기반 로직을 Firestore, Auth, Cloud Storage 연동 코드로 교체하면 됩니다.
