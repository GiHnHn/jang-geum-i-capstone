# 실행 안내

Node.js, npm, MongoDB와 외부 서비스 설정이 필요합니다. 루트와 `front`의 `.env.example`을 각각 `.env`로 복사하고 값을 입력하세요.

```sh
# 저장소 루트: API 서버
npm ci
npm start

# 별도 터미널: 웹 화면
cd front
npm ci
npm start
```

서버 기본 포트는 5000, 프론트엔드는 3000입니다. 환경변수 예시에 맞춰 OpenAI·Firebase·Naver·Google TTS 인증과 n8n·음성 서버 주소를 설정합니다.

## 실행 범위

- n8n 전체 워크플로우와 음성 모델 가중치는 별도 준비가 필요합니다.
- 회원·로그인·기록 기능에는 미완성 연결이 남아 있습니다.
- 서버·프론트엔드 `npm ci`, 서버 문법 검사, 프론트엔드 배포 빌드를 확인했습니다. 외부 서비스 전체를 연결한 재실행은 검증하지 않았습니다.

[공개본 유지보수 내역](CURATION.md)
