# 실행 안내

최종 사용 흐름은 **캐릭터 선택 → n8n 대화 → 레시피 선택 → 음성 조리**입니다. 저장소에는 이 흐름에 사용한 웹 소스와 함께 초기 사진 검색·별도 구매 화면 코드도 남아 있습니다. 각 파일의 용도는 [개발 이력과 코드 구분](DEVELOPMENT_HISTORY.md)을 참고하세요.

## 기본 환경

Node.js, npm, MongoDB가 필요합니다. 루트와 `front`의 `.env.example`을 각각 `.env`로 복사하고 실행 환경에 맞게 값을 입력합니다.

```sh
# 저장소 루트: API 서버
npm ci
npm start

# 별도 터미널: 웹 화면
cd front
npm ci
npm start
```

서버 기본 포트는 5000, 프론트엔드는 3000입니다.

## 최종 흐름에 필요한 설정

| 구분 | 준비 사항 |
|---|---|
| 웹 서버 | `JWT_SECRET`, `MONGO_URI`, `OPENAI_API_KEY` 등 루트 환경변수 예시의 기본 설정 |
| 메신저형 대화 | `N8N_WEBHOOK_URL`, 별도로 구동하는 n8n 워크플로우의 모델·메모리·자막 및 쇼핑 도구 설정 |
| 캐릭터 음성 | `TTS_BAEK_URL` 등 음성 서버 주소, GPT-SoVITS 모델과 참조 음성 |
| 브라우저 음성 입력 | 마이크 권한과 Web Speech API를 지원하는 브라우저 |
| 프론트엔드 API 주소 | `REACT_APP_API_BASE_URL` |

현재 Express 서버는 시작 시 OpenAI 클라이언트도 생성합니다. 따라서 n8n 채팅을 먼저 살펴보더라도 `OPENAI_API_KEY` 설정을 확인해야 합니다. n8n 내부의 모델 인증은 별도로 설정합니다.

음성 요청 코드에는 캐릭터 TTS 주소가 없을 때 사용하는 Google Cloud TTS 대체 경로도 남아 있습니다. 이 경로를 사용할 경우 Google 인증 설정이 필요하며, GPT-SoVITS로 학습한 캐릭터 음성과는 다릅니다.

## 보관한 코드의 처리 경로

- `ChatUI.jsx`는 세션 ID·캐릭터·질문을 `/api/test-command`로 보내고, Express가 이를 n8n 웹훅으로 전달합니다.
- '이 레시피로 요리하기'는 대화의 레시피 텍스트를 `MainApp.js`로 넘깁니다. 이 파일에는 초기 검색 화면과 레시피 전달 처리가 함께 남아 있습니다.
- `CookingAssistant.js`는 음성을 인식해 `/assistant`로 조리 질문을 전달하고, `/tts`에서 받은 음성을 재생합니다. 보관한 웹 코드에서는 이 조리·음성 요청을 n8n 대화 웹훅과 별도 경로로 처리합니다.

## 초기 기능의 설정

Firebase 사진 업로드와 `PurchasePage.js`의 별도 구매 화면은 초기 구현입니다. 채팅에서 상품을 추천하는 n8n의 `naver_shopping` 도구와는 별개입니다.

초기 화면을 실행하려면 Firebase 설정과 Express `/api/search`용 Naver `CLIENT_ID`, `CLIENT_SECRET`이 필요합니다. n8n 쇼핑 도구의 인증과 입력은 해당 워크플로우에서 별도로 설정해야 합니다. 관련 코드의 위치는 [개발 이력](DEVELOPMENT_HISTORY.md)에 기록했습니다.

## 실행 확인 범위

- n8n은 [구성 스크린샷](images/n8n-workflow.png)을 공개했습니다. 실행용 워크플로우 JSON, FastAPI·음성 추론 서버, 음성 학습 데이터와 가중치는 별도로 준비해야 합니다.
- 공개용 정리 시 서버·프론트엔드 `npm ci`, 서버 문법 검사, 프론트엔드 배포 빌드를 확인했습니다. 외부 서비스를 모두 구동한 재실행은 하지 않았습니다.
- 보관 소스의 회원·로그인·기록 처리와 타이머 카운트다운·종료 알림에는 미완성 부분이 있습니다. 최종 사용 흐름의 핵심 기능으로 소개하지 않았습니다.

[프로젝트 소개](../README.md) · [공개용 정리 내역](CURATION.md)
