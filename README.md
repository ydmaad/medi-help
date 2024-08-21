## A09 리더쉽구만

<br />

**복용 약물 관리 및 사용자 경험 공유 플랫폼**

<br />

**팀원 소개**

---

| 양민애 | 최슬기 | 이세영 | 김도연 | 방지영 |  박유리  |  정수현  |
| :----: | :----: | :----: | :----: | :----: | :------: | :------: |
|  INFP  |  ISFJ  |  ENFP  |  ISTJ  |  ISFP  |   ENTP   |   INTP   |
|  팀장  |  팀원  |  팀원  |  팀원  |  팀원  | 디자이너 | 디자이너 |

<br />

<br />

**프로젝트 명** : Medi-Help

**배포 링크** : https://medi-help-seven.vercel.app/

**팀 노션** : https://teamsparta.notion.site/A09-9-a01d8caf97e841f4ad2dbaf17586de1f

**중간발표 자료** : https://drive.google.com/drive/folders/1MNYWQIiqZtTwjbn6eQCmDuNrkiaGf0QJ

**시연 영상** : 최종발표때 업데이트 예정

**개발 기간** : 2024.07.16~ 2024.08.21 (약 5주간)

**프로젝트 소개** : 복용 중인 약을 효과적으로 관리하고 사용자 간 경험을 공유할 수 있는 종합 디지털 헬스케어 플랫폼

**프로젝트 목표** : 사용자 중심의 정확한 약물 정보 제공과 맞춤형 복용 관리 시스템을 구축하여, 개인의 건강 관리를 돕고 사용자 간 경험 공유를 촉진하는 종합적인 디지털 헬스케어 플랫폼을 구현한다.
<br />

### 🚦 Project Rules

#### **개발 환경(버전참고)**

- **Environment :** Visual Studio Code, git, github
- **Language :** Javascript, TypeScript
- **Framwork** : Next.js(14.2.5)

- **Library**

  - React
  - full calendar
  - tailwind css
  - Zustand

- **DB**: supabase
- **API**: Service Worker, Web Push API(추가 구현 예정)
- **Communication** : figma, slack, notion, zep

<br />

#### **깃허브 규칙**

작업 타입(영어) / 작업내용(한국어)</br>
reviewer : 2명으로 설정</br>
브랜치 이름 : feat/본인브랜치 ex) feat/search</br>
</br>

- 브랜치 이름 :
  - dev
  - feat/authn
  - feat/mainpage
  - feat/column
  - feat/search
  - feat/mainpage
  - feat/mypage/medilist
  - feat/community
  - feat/calendar
  - feat/myPage/alert2
  - main

#### Commit Convention

✨ update : 해당 파일에 새로운 기능이 생김</br>
🎉 add : 없던 파일을 생성함, 초기 세팅</br>
🐛 bugfix : 버그 수정</br>
♻️ refactor : 코드 리팩토링</br>
🩹 fix : 코드 수정</br>
🚚 move : 파일 옮김/정리</br>
🔥 del : 기능/파일을 삭제</br>
🍻 test : 테스트 코드를 작성</br>
💄 style : css</br>
🙈 gitfix : gitignore 수정</br>
🔨script : package.json 변경(npm 설치 등)
<br />

## ✨️기능 설명 (중간 발표 기준 구현 완료)

<br />

1.  메인 페이지
    - 약 검색, 건강 칼럼 제공, 커뮤니티 미리보기 기능이 통합된 대시보드
2.  약 검색 페이지
    - API 기반 의약품 정보 검색 및 상세 정보 제공 (용법, 용량, 주의사항 포함)
3.  커뮤니티 페이지
    - 사용자 간 약물 경험 공유를 위한 게시글 작성, 조회, 댓글 기능 구현
4.  로그인/회원가입 페이지
    - 이메일 기반 계정 생성 및 로그인, Zustand를 활용한 상태 관리
5.  마이페이지
    - 사용자 프로필 정보 및 복용 중인 약물 목록 조회 기능
6.  캘린더 페이지
    - FullCalendar 활용한 개인 약물 복용 일정 관리 및 기록 기능

## ⚽︎트러블슈팅

### 문제 1

**`기능`**

- FullCalendar 컴포넌트 이벤트 데이터 타입 불일치

**`이슈`**

- 문제 : FullCalendar 컴포넌트의 events prop에 전달되는 데이터 타입이 예상되는 타입과 일치하지 않아 컴파일 에러 발생

**`해결`**

1. EventType[]의 start 속성 타입을 Date | null에서 string | Date로 변경
2. events prop에 전달할 때 events={events as EventInput[]}로 타입 캐스팅
3. null과 undefined의 의미 차이를 고려하여 데이터 처리 로직 수정

### 문제 2

**`기능`**

- Supabase 테이블 구조 최적화

**`이슈`**

- 문제 : Supabase 테이블 구조상 복용하는 약 종류가 늘어나면 컬럼 데이터 변경이 불가능한 문제 발생

**`해결`**

1. Supabase Calendar 테이블에서 약 정보를 분리
2. Bridge 테이블 생성하여 캘린더 id, 약 id, user id 정보를 포함
3. 테이블 조인을 통해 필요한 정보를 가져오는 방식으로 구조 변경
4. 이를 통해 약 종류가 늘어나도 유연하게 대응 가능한 구조로 개선

<br />

## 📂파일 구조

<br />

```
📦src
 ┣ 📂app
 ┃ ┣ 📂(root)
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┣ 📂complete
 ┃ ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┣ 📂recover
 ┃ ┃ ┃ ┣ 📂reset
 ┃ ┃ ┃ ┣ 📂signup
 ┃ ┃ ┣ 📂calendar
 ┃ ┃ ┃ ┣ 📂edit
 ┃ ┃ ┣ 📂community
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┃ ┣ 📂edit
 ┃ ┃ ┃ ┣ 📂post
 ┃ ┃ ┣ 📂error404
 ┃ ┃ ┣ 📂magazine
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┣ 📂mypage
 ┃ ┃ ┃ ┣ 📂Medications
 ┃ ┃ ┣ 📂search
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┣ 📜layout.tsx
 ┃ ┃ ┗ 📜page.tsx
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┗ 📂callback
 ┃ ┃ ┣ 📂calendar
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┣ 📂medi
 ┃ ┃ ┃ ┃ ┣ 📂all
 ┃ ┃ ┃ ┃ ┣ 📂names
 ┃ ┃ ┃ ┣ 📂sideEffect
 ┃ ┃ ┣ 📂community
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┃ ┣ 📂comments
 ┃ ┃ ┃ ┃ ┣ 📂comments
 ┃ ┃ ┃ ┣ 📂search
 ┃ ┃ ┣ 📂magazine
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┣ 📂mypage
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┗ 📂medi
 ┃ ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┃ ┗ 📂names
 ┃ ┃ ┗ 📂search
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┣ 📂searchmedi
 ┃ ┣ 📜globals.css
 ┃ ┣ 📜layout.tsx
 ┃ ┣ 📜not-found.tsx
 ┃ ┗ 📜provider.tsx
 ┣ 📂components
 ┃ ┣ 📂atoms
 ┃ ┣ 📂molecules
 ┃ ┗ 📂templates
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┣ 📂calendar
 ┃ ┃ ┃ ┣ 📂calendarModal
 ┃ ┃ ┃ ┗ 📂calendarView
 ┃ ┃ ┣ 📂community
 ┃ ┃ ┣ 📂magazine
 ┃ ┃ ┗ 📂mypage
 ┃ ┃ ┃ ┣ 📂myPageModal
 ┣ 📂constants
 ┣ 📂contexts
 ┃ ┣ 📜BarTextContext.tsx
 ┃ ┗ 📜ImageContext.tsx
 ┣ 📂hooks
 ┃ ┣ 📜useBarText.ts
 ┃ ┣ 📜useImage.ts
 ┃ ┣ 📜useThrottle.ts
 ┃ ┣ 📜useTimeout.ts
 ┃ ┗ 📜useToast.tsx
 ┣ 📂lib
 ┃ ┣ 📜commentsAPI.ts
 ┃ ┗ 📜supabaseClient.ts
 ┣ 📂store
 ┃ ┣ 📜auth.ts
 ┃ ┣ 📜calendar.ts
 ┃ ┗ 📜communitySearchFlag.ts
 ┣ 📂types
 ┃ ┣ 📜calendar.ts
 ┃ ┣ 📜communityTypes.ts
 ┃ ┣ 📜medicationTypes.ts
 ┃ ┗ 📜supabase.ts
 ┣ 📂utils
 ┃ ┗ 📂supabase
 ┃ ┃ ┣ 📜client.ts
 ┃ ┃ ┣ 📜googleAuth.ts
 ┃ ┃ ┣ 📜kakaoAuth.ts
 ┃ ┃ ┣ 📜middleware.ts
 ┃ ┃ ┗ 📜server.ts
 ┃ ┣ 📜dateUtils.ts
 ┃ ┣ 📜notificationMessage.ts
 ┃ ┣ 📜scheduleEmail.ts
 ┃ ┗ 📜sendEmail.ts
 ┣ 📜.DS_Store
 ┗ 📜middleware.ts
```
