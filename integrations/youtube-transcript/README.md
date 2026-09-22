# YouTube 자막 커스텀 노드

졸업작품 폴더에서 확인한 n8n 노드의 구현 소스입니다. 영상 URL과 언어를 받아 `YoutubeTranscript.fetchTranscript`를 호출하고 자막 배열을 다음 노드에 전달합니다.

## 이 파일이 보여주는 기여

n8n이 사용하는 입력 필드, 실행 함수, 출력 데이터 형식을 정의해 자막 수집 라이브러리를 워크플로우에서 호출할 수 있도록 감쌌습니다. 자막 수집 라이브러리 자체를 처음부터 구현한 것으로 소개하지 않습니다.

- 원본 의존 라이브러리: [Kakulukian/youtube-transcript](https://github.com/Kakulukian/youtube-transcript)
- 보존한 파일: [YoutubeTranscript.node.ts](YoutubeTranscript.node.ts)
- 원본의 기본 언어값은 `en`입니다. 보고서의 한국어 수집 흐름은 워크플로우에서 `ko`를 지정하는 구성으로 해석하며, 한국어 전용 노드라고 표현하지 않습니다.

## 재현 범위

이 폴더는 **소스 기록**입니다. 원본은 로컬 `youtube-transcript_custom/dist/...` 경로에 의존하고, 패키지 이름·등록 경로·아이콘 파일에도 정리가 필요한 부분이 있습니다. 따라서 설치 가능한 n8n 배포 패키지나 독립적인 MCP 서버로 소개하지 않습니다.

기존 폴더에 있던 HttpBin 예제 노드와 빈 credential 템플릿은 이 기능에 연결되지 않아 제외했습니다.
