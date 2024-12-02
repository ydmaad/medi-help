<br/>

<a href="https://medi-help-seven.vercel.app/"><img src='public/medihelp_logo.svg' width=180></a> click !

## 팀원 소개

|            양민애             |            최슬기             |          이세영           |          김도연           |          방지영           |           박유리            |           정수현            |
| :---------------------------: | :---------------------------: | :-----------------------: | :-----------------------: | :-----------------------: | :-------------------------: | :-------------------------: |
| ![purple](/public/purple.svg) | ![purple](/public/purple.svg) | ![blue](/public/blue.svg) | ![blue](/public/blue.svg) | ![blue](/public/blue.svg) | ![green](/public/green.svg) | ![green](/public/green.svg) |
|             INFP              |             ISFJ              |           ENFP            |           ISTJ            |           ISFP            |            ENTP             |            INTP             |
|           👑Leader            |         👑Sub-Leader          |         👸Member          |         👸Member          |         👸Member          |         🎨Designer          |         🎨Designer          |

<br />

# MEDI HELP

<br />

**복용 약물 관리 및 사용자 경험 공유 플랫폼**

![MEDI HELP](/public/readme_main.svg)

**배포 링크** : https://medi-help-seven.vercel.app/

**팀 노션** : https://teamsparta.notion.site/A09-9-a01d8caf97e841f4ad2dbaf17586de1f

**발표 자료** : https://www.miricanvas.com/v/13kowit

**개발 기간** : 2024.07.16~ 2024.08.21 (약 5주간)

**프로젝트 소개** : 복용 중인 약을 효과적으로 관리하고 사용자 간 경험을 공유할 수 있는 종합 디지털 헬스케어 플랫폼

**프로젝트 목표** : 사용자 중심의 정확한 약물 정보 제공과 맞춤형 복용 관리 시스템을 구축하여, 개인의 건강 관리를 돕고 사용자 간 경험 공유를 촉진하는 종합적인 디지털 헬스케어 플랫폼을 구현한다.

**주요기능**

- 기능 1 : 약 검색 기능 - 약품 명을 검색하여 약물정보(이미지, 용도, 용법, 주의사항, 부작용 등) 제공
- 기능 2 : 캘린더 기능 - 복약 기록을 통해 복용 현황을 확인하고 증상 및 부작용을 기록
- 기능 3 : 알람 기능 - 복용할 약을 등록하여 복용 시간을 설정하고 맞춤형 알림을 등록 및 전송

<br />

### 🚦 Project Rules

#### **개발 환경(버전참고)**

- **Environment :** Visual Studio Code, git, github
- **Language :** Javascript, TypeScript
- **Framwork** : Next.js(14.2.5)

- **Library**

  - React
  - tailwind css
  - Zustand
  - framer-motion
  - nodemailer

- **DB**: supabase
- **API**: fullCalendar, e약은요 api, 낱알정보 api
- **Communication** : figma, slack, notion, zep

<br />

#### 서비스 구조

![MEDI HELP](/public/projectArchitecture.svg)

#### **깃허브 규칙**

작업 타입(영어) / 작업내용(한국어)</br>
reviewer : 2명으로 설정</br>
브랜치 이름 : feat/본인브랜치 ex) feat/search</br>
</br>

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

- 마이페이지 약 등록 및 수정 기능

**`이슈`**

- 문제 : 모달을 열고 닫는 상태 관리에서 의도치 않게 모달이 열리지 않거나, 이미 언마운트된 상태에서 상태 업데이트가 발생하는 문제

**`해결`**

1. useState로 모달의 상태를 관리하고 onClose 핸들러를 통해 모달이 닫힐 때 상태를 업데이트

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

### 문제 3

**`기능`**

- 캘린더 페이지(복약 기록 및 복약 시간대 별 날짜에 따른 데이터 관리)

**`이슈`**

- 문제 : 여러 useEffect를 사용한 상태 관리로 인해 동시에 여러 함수가 실행되어 일부만 실행되거나 누락되는 등 예상치 못한 결과가 발생했고, useEffect의 과도한 사용으로 side effect가 증가

**`해결`**

1. useEffect 사용을 최소화
2. 대신 특정 시점(오늘 날짜 기록, 캘린더 날짜 선택, 모달에서 날짜 변경)에 필요한 데이터만 재설정하는 방식으로 변경
3. useEffect로 인한 side effect를 줄이며 유지보수성을 향상

### 문제 4

**`기능`**

- 약 검색 페이지

**`이슈`**

- 문제 : 데이터량이 과다하여 런타임 오류가 발생했고, 검색 시 첫 번째 페이지의 결과만 표시되는 오류

**`해결`**

1. Supabase에 데이터를 저장하고 페이지네이션을 구현하여 20개씩 데이터를 가져오도록 변경
2. 검색 로직을 라우터에서 .ilike() 함수를 사용하여 구현
3. 전체 데이터에서 정확한 검색 결과를 표시할 수 있게 함

### 문제 5

**`기능`**

- 사이드바 이미지(Next.js 애플리케이션에서 SVG 이미지를 표시하기 위해 Image 태그의 src 속성을 사용)

**`이슈`**

- 문제 : src="button.svg"와 같은 상대 경로를 사용했을 때 이미지가 제대로 표시되지 않음

**`해결`**

1. Next.js는 'public' 폴더를 웹사이트의 루트 디렉토리로 취급
2. 슬래시(/)로 시작하는 경로는 이 'public' 폴더를 기준
3. 따라서 "/button.svg"는 실제로 "public/button.svg" 파일을 가리킴
4. 이 방식을 사용하면 현재 페이지의 URL이나 위치에 상관없이 항상 동일한 경로로 이미지에 접근 가능
5. 결과적으로, 모든 페이지에서 일관되게 이미지를 표시할 수 있어 문제가 해결

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
