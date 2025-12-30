# 🎯 ExamHub 백엔드 배포 - 지금 바로 시작하기

## 현재 상태
✅ 백엔드 코드 준비 완료
✅ Firebase CORS 설정 완료
✅ Railway 설정 파일 준비 완료 (railway.json, Procfile)
✅ Docker 설정 완료 (Dockerfile)

## 🚀 Railway로 배포하기 (권장 - 가장 쉬움)

### 옵션 A: Railway CLI 사용 (GitHub 불필요)

#### 1. Railway CLI 설치
```powershell
npm install -g @railway/cli
```

#### 2. Railway 로그인
```powershell
railway login
```
브라우저가 열리면 GitHub 계정으로 로그인

#### 3. 백엔드 디렉토리로 이동
```powershell
cd E:\Dev\github\ExamHub\backend
```

#### 4. Railway 프로젝트 생성
```powershell
railway init
```
프로젝트 이름 입력: `examhub-backend`

#### 5. PostgreSQL 추가
```powershell
railway add
```
"PostgreSQL" 선택

#### 6. 환경 변수 설정
Railway 웹 대시보드에서:
1. https://railway.app/dashboard 접속
2. examhub-backend 프로젝트 클릭
3. Variables 탭 클릭
4. 다음 변수 추가:
```
NODE_ENV=production
PORT=4003
```

DATABASE_URL은 PostgreSQL 추가 시 자동으로 설정됩니다.

#### 7. 배포!
```powershell
railway up
```

#### 8. 도메인 생성
```powershell
railway domain
```
또는 웹 대시보드 > Settings > Networking > Generate Domain

#### 9. 배포된 URL 확인
```powershell
railway status
```

---

### 옵션 B: Railway 웹 대시보드 사용 (GitHub 필요)

#### 1. GitHub에 코드 푸시
먼저 GitHub에 저장소를 만들고 푸시해야 합니다:

```powershell
cd E:\Dev\github\ExamHub

# GitHub에서 새 저장소 생성 후 (예: https://github.com/username/examhub)
git remote add origin https://github.com/username/examhub.git
git add .
git commit -m "Initial commit with Firebase and Railway config"
git push -u origin master
```

#### 2. Railway에서 배포
1. https://railway.app 접속
2. "Start a New Project" 클릭
3. "Deploy from GitHub repo" 선택
4. ExamHub 저장소 선택
5. Settings > General:
   - Root Directory: `backend`
6. Variables 탭에서 환경 변수 추가:
```
NODE_ENV=production
PORT=4003
```
7. New > Database > PostgreSQL 추가
8. Settings > Networking > Generate Domain

---

## 🌐 Render로 배포하기 (대안)

### Render 배포 단계
1. https://render.com 접속 및 GitHub 로그인
2. "New +" > "Web Service" 클릭
3. "Public Git repository" 선택 또는 GitHub 저장소 연결
4. 설정:
   ```
   Name: examhub-backend
   Root Directory: backend
   Environment: Node
   Build Command: npm install && npx prisma generate && npm run build
   Start Command: npm run start:prod
   ```
5. "Free" 플랜 선택
6. "Create Web Service" 클릭
7. Dashboard > "New +" > "PostgreSQL" 추가
8. Web Service의 Environment에서 DATABASE_URL 연결

---

## 📱 Google Cloud Run으로 배포하기 (Firebase와 통합)

### Cloud Run 배포
```powershell
# 1. Google Cloud SDK 설치되어 있다면
cd E:\Dev\github\ExamHub\backend

# 2. 프로젝트 설정
gcloud config set project examhub-app

# 3. Cloud Run 배포
gcloud run deploy examhub-backend `
  --source . `
  --platform managed `
  --region asia-northeast3 `
  --allow-unauthenticated `
  --set-env-vars NODE_ENV=production,PORT=4003
```

### Cloud SQL 설정 (별도 필요)
```powershell
# PostgreSQL 인스턴스 생성
gcloud sql instances create examhub-db `
  --database-version=POSTGRES_14 `
  --tier=db-f1-micro `
  --region=asia-northeast3

# 데이터베이스 생성
gcloud sql databases create geobuk_mock --instance=examhub-db

# Cloud Run에 연결
gcloud run services update examhub-backend `
  --add-cloudsql-instances=examhub-app:asia-northeast3:examhub-db
```

---

## ✅ 배포 후 할 일

### 1. 백엔드 URL 확인
배포 완료 후 다음 형식의 URL을 받게 됩니다:
- Railway: `https://examhub-backend-production.up.railway.app`
- Render: `https://examhub-backend.onrender.com`
- Cloud Run: `https://examhub-backend-xxxxx.run.app`

### 2. API 동작 확인
```powershell
# 브라우저에서 접속
# Swagger 문서: https://your-backend-url/api-docs
```

### 3. 프론트엔드 재배포
`frontend/.env.production` 파일 수정:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url
NODE_ENV=production
```

프론트엔드 재배포:
```powershell
cd E:\Dev\github\ExamHub\frontend
npm run build:firebase
cd ..
firebase deploy --only hosting
```

---

## 💰 비용 비교

| 플랫폼 | 무료 티어 | 장점 | 단점 |
|--------|-----------|------|------|
| **Railway** | $5/월 크레딧 | 가장 쉬움, CLI 편리 | 크레딧 소진 후 유료 |
| **Render** | 750시간/월 | 넉넉한 무료 티어 | DB는 90일 후 삭제 |
| **Cloud Run** | 200만 요청/월 | Firebase 통합 | Cloud SQL 별도 비용 |

## 🎯 추천
- **빠른 테스트**: Railway CLI (옵션 A)
- **장기 운영**: Google Cloud Run
- **무료로 오래 쓰기**: Render

---

## 🆘 도움이 필요하신가요?

1. **Railway CLI 방법 (옵션 A)**: GitHub 없이 바로 배포 가능
2. **Railway 웹 방법 (옵션 B)**: GitHub 저장소 필요
3. **Render**: 웹에서 쉽게 설정
4. **Cloud Run**: Firebase와 통합하고 싶다면

어떤 방법을 선택하시겠습니까? 각 방법마다 더 자세한 가이드가 준비되어 있습니다!



