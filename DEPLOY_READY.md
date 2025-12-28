# ✅ Firebase 배포 준비 완료!

## 현재 상태

✅ Firebase CLI 설치 완료
✅ Firebase 로그인 완료
✅ Firebase 설정 파일 생성 (firebase.json, .firebaserc)
✅ Next.js 정적 빌드 설정 완료
✅ 프론트엔드 빌드 성공 (frontend/out 생성됨)
✅ 배포 스크립트 준비 (deploy.ps1, deploy.sh)
✅ Docker 설정 완료 (백엔드용)

## 다음 단계: Firebase에 배포하기

### 방법 1: 기존 Firebase 프로젝트 사용

현재 계정에 다음 프로젝트들이 있습니다:
- ts-admin-479323
- ts-back-nest-5495e
- ts-front-479305

이 중 하나를 ExamHub에 사용하려면:

1. `.firebaserc` 파일 수정:
```json
{
  "projects": {
    "default": "선택한-프로젝트-id"
  }
}
```

2. 배포 실행:
```powershell
.\deploy.ps1
```

### 방법 2: 새 Firebase 프로젝트 생성 (권장)

1. **Firebase Console에서 새 프로젝트 생성:**
   - https://console.firebase.google.com/ 접속
   - "프로젝트 추가" 클릭
   - 프로젝트 이름: "ExamHub" (또는 원하는 이름)
   - Google Analytics: 선택사항
   - 프로젝트 생성 후 **프로젝트 ID** 복사 (예: examhub-12345)

2. **프로젝트 ID 설정:**
   `.firebaserc` 파일을 열고 프로젝트 ID 입력:
   ```json
   {
     "projects": {
       "default": "examhub-12345"
     }
   }
   ```

3. **백엔드 URL 설정 (중요!):**
   `frontend/.env.production` 파일 편집:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```
   
   백엔드가 아직 배포되지 않았다면:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4003
   ```

4. **배포 실행:**
   ```powershell
   .\deploy.ps1
   ```
   
   또는 수동:
   ```powershell
   cd frontend
   npm run build:firebase
   cd ..
   firebase deploy --only hosting
   ```

5. **배포 완료!**
   배포가 성공하면 다음과 같은 URL이 표시됩니다:
   ```
   Hosting URL: https://examhub-12345.web.app
   ```

## 백엔드 배포 (별도 필요)

프론트엔드만 Firebase Hosting에 배포됩니다.
백엔드는 다음 중 하나로 배포해야 합니다:

### 옵션 1: Google Cloud Run (권장)
```bash
cd backend
gcloud run deploy examhub-backend \
  --source . \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated
```

### 옵션 2: Heroku
```bash
cd backend
heroku create examhub-backend
git push heroku main
```

### 옵션 3: Railway
1. https://railway.app 접속
2. New Project > Deploy from GitHub
3. backend 디렉토리 선택
4. 환경 변수 설정 (DATABASE_URL 등)

### 옵션 4: Render
1. https://render.com 접속
2. New Web Service
3. GitHub 저장소 연결
4. Build Command: `npm install && npm run build`
5. Start Command: `npm run start:prod`

## 백엔드 배포 후 프론트엔드 재배포

백엔드를 배포한 후:

1. 백엔드 URL 복사 (예: https://examhub-backend-xxxxx.run.app)

2. `frontend/.env.production` 업데이트:
   ```
   NEXT_PUBLIC_API_URL=https://examhub-backend-xxxxx.run.app
   ```

3. 프론트엔드 재배포:
   ```powershell
   .\deploy.ps1
   ```

## 유용한 명령어

```bash
# 배포 상태 확인
firebase hosting:releases list

# 로컬에서 배포된 사이트 미리보기
firebase serve

# 특정 프로젝트로 전환
firebase use 프로젝트-id

# 배포 취소 (이전 버전으로 롤백)
firebase hosting:clone SOURCE:VERSION_ID SITE_ID
```

## 문제 해결

### "Not logged in" 오류
```bash
firebase login --reauth
```

### "No project active" 오류
`.firebaserc` 파일에 올바른 프로젝트 ID가 설정되었는지 확인

### 빌드 오류
```powershell
cd frontend
Remove-Item -Recurse -Force .next, out, node_modules
npm install
npm run build:firebase
```

---

## 📚 더 많은 정보

- [상세 배포 가이드](./FIREBASE_DEPLOYMENT.md)
- [빠른 시작 가이드](./QUICK_START_FIREBASE.md)

배포에 문제가 있으시면 위 문서들을 참조하세요!

