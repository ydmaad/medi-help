## Github Rules</br>

### 깃허브 규칙</br>

작업 타입(영어) / 작업내용(한국어)</br>
reviewer : 2명으로 설정</br>
브랜치 이름 : feat/본인브랜치 ex) feat/search</br>
</br>

### 깃헙 커밋 규칙</br>

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
</br>

## 폴더 구조

```
📦src
 ┣ 📂app
 ┃ ┣ 📂(root)
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┣ 📂signup
 ┃ ┃ ┣ 📂calendar
 ┃ ┃ ┣ 📂community
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┃ ┣ 📂edit
 ┃ ┃ ┃ ┣ 📂post
 ┃ ┃ ┣ 📂magazine
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┣ 📂mypage
 ┃ ┃ ┣ 📂search
 ┃ ┃ ┣ 📜layout.tsx
 ┃ ┃ ┗ 📜page.tsx
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂calendar
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┣ 📂medi
 ┃ ┃ ┃ ┃ ┣ 📂all
 ┃ ┃ ┃ ┃ ┣ 📂names
 ┃ ┃ ┣ 📂community
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┃ ┣ 📂comments
 ┃ ┃ ┃ ┣ 📂search
 ┃ ┃ ┣ 📂magazine
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┣ 📂mypage
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┣ 📂alerts
 ┃ ┃ ┃ ┃ ┣ 📂getMedicineNames
 ┃ ┃ ┃ ┃ ┣ 📂scheduleNotification
 ┃ ┃ ┃ ┃ ┣ 📂subscribe
 ┃ ┃ ┃ ┗ 📂medi
 ┃ ┃ ┃ ┃ ┗ 📂names
 ┃ ┃ ┗ 📂search
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
 ┣ 📂constant
 ┃ ┗ 📜constant.ts
 ┣ 📂contexts
 ┃ ┣ 📜BarTextContext.tsx
 ┃ ┗ 📜ImageContext.tsx
 ┣ 📂hooks
 ┃ ┣ 📜useBarText.ts
 ┃ ┗ 📜useImage.ts
 ┣ 📂lib
 ┃ ┗ 📜supabaseClient.ts
 ┣ 📂store
 ┃ ┗ 📜auth.ts
 ┣ 📂types
 ┃ ┣ 📜calendar.ts
 ┃ ┣ 📜supabase.ts
 ┃ ┗ 📜test_calendar.ts
 ┣ 📂utils
 ┃ ┗ 📂supabase
 ┃ ┃ ┣ 📜client.ts
 ┃ ┃ ┣ 📜middleware.ts
 ┃ ┃ ┗ 📜server.ts
 ┗ 📜middleware.ts
```
