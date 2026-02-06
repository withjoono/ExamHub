# Firebase 배포 빠른 시작 가이드

## 1단계: Firebase 로그인 (필수)

터미널에서 다음 명령어를 실행하여 Firebase에 로그인하세요:

```bash
firebase login
```

브라우저가 열리면 Google 계정으로 로그인합니다.

## 2단계: Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: examhub 또는 원하는 이름)
4. Google Analytics는 선택사항 (필요시 활성화)
5. 프로젝트 생성 완료

## 3단계: 프로젝트 ID 설정

Firebase Console에서 생성한 프로젝트의 **프로젝트 ID**를 확인하고,
`.firebaserc` 파일을 편집하여 설정합니다:

```json
{
  "projects": {
    "default": "여기에-프로젝트-ID-입력"
  }
}
```

예시:
```json
{
  "projects": {
    "default": "examhub-12345"
  }
}
```

## 4단계: 백엔드 URL 설정 (중요!)

프론트엔드가 백엔드 API와 통신할 수 있도록 URL을 설정합니다.

`frontend/.env.production` 파일을 편집:

```env
# 백엔드가 이미 배포되어 있다면 그 URL을 입력
NEXT_PUBLIC_API_URL=https://your-backend-url.com

# 백엔드를 아직 배포하지 않았다면 임시로 로컬 주소
NEXT_PUBLIC_API_URL=http://localhost:4003
```

## 5단계: 배포 실행

### Windows:
```powershell
.\deploy.ps1
```

### Linux/Mac:
```bash
chmod +x deploy.sh
./deploy.sh
```

### 수동 배포:
```bash
cd frontend
npm run build:firebase
cd ..
firebase deploy --only hosting
```

## 6단계: 배포 확인

배포가 완료되면 다음과 같은 메시지가 표시됩니다:

```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project-id/overview
Hosting URL: https://your-project-id.web.app
```

Hosting URL로 접속하여 사이트가 정상적으로 작동하는지 확인하세요!

## 문제 해결

### "Error: Not logged in" 오류
```bash
firebase login --reauth
```

### "Error: No project active" 오류
`.firebaserc` 파일에 프로젝트 ID가 올바르게 설정되었는지 확인하세요.

### 빌드 오류
```bash
cd frontend
rm -rf .next out node_modules
npm install
npm run build:firebase
```

### API 연결 안됨
1. `frontend/.env.production` 파일에 백엔드 URL이 올바른지 확인
2. 백엔드가 실행 중인지 확인
3. 백엔드에서 CORS 설정이 되어있는지 확인

---

더 자세한 내용은 [FIREBASE_DEPLOYMENT.md](./FIREBASE_DEPLOYMENT.md)를 참조하세요.


















