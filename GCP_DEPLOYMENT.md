# ExamHub - GCP Cloud Run 배포 가이드

## 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                        사용자                                │
└─────────────────────────┬───────────────────────────────────┘
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
┌───────────────────────┐   ┌───────────────────────┐
│   Firebase Hosting    │   │     Cloud Run         │
│   (Frontend)          │   │     (Backend API)     │
│   examhub-app.web.app │   │   examhub-backend     │
│   Next.js Static      │   │   NestJS + Prisma     │
└───────────────────────┘   └───────────┬───────────┘
                                        │
                                        ▼
                            ┌───────────────────────┐
                            │     Cloud SQL         │
                            │     (PostgreSQL)      │
                            │     또는 외부 DB      │
                            └───────────────────────┘
```

## 사전 요구사항

1. **GCP 계정** 및 결제 설정
2. **gcloud CLI** 설치 및 로그인
3. **Docker** 설치
4. **Node.js 20+** 설치
5. **Firebase CLI** 설치

```bash
# gcloud 로그인
gcloud auth login

# Firebase CLI 설치
npm install -g firebase-tools
firebase login
```

## 빠른 배포 (원클릭)

### Windows
```powershell
.\deploy-gcp.ps1 -ProjectId "your-project-id"
```

### Linux/Mac
```bash
chmod +x deploy-gcp.sh
./deploy-gcp.sh --project your-project-id
```

## 수동 배포

### 1. GCP 프로젝트 설정

```bash
# 프로젝트 설정
export PROJECT_ID="examhub-project"
export REGION="asia-northeast3"

gcloud config set project $PROJECT_ID

# 필요한 API 활성화
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable sqladmin.googleapis.com

# Artifact Registry 저장소 생성
gcloud artifacts repositories create examhub \
    --repository-format=docker \
    --location=$REGION \
    --description="ExamHub Docker images"
```

### 2. Backend 배포

```bash
cd backend

# Docker 이미지 빌드
docker build -t asia-northeast3-docker.pkg.dev/$PROJECT_ID/examhub/backend:latest .

# Docker 인증
gcloud auth configure-docker asia-northeast3-docker.pkg.dev

# 이미지 푸시
docker push asia-northeast3-docker.pkg.dev/$PROJECT_ID/examhub/backend:latest

# Cloud Run 배포
gcloud run deploy examhub-backend \
    --image asia-northeast3-docker.pkg.dev/$PROJECT_ID/examhub/backend:latest \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --set-env-vars "NODE_ENV=production,DATABASE_URL=your-database-url"
```

### 3. Frontend 배포

```bash
cd frontend

# 환경변수 설정
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://examhub-backend-xxxxx-an.a.run.app
NEXT_PUBLIC_HUB_URL=https://geobukschool.kr
NEXT_PUBLIC_HUB_API_URL=https://ts-back-nest-479305.du.r.appspot.com
NODE_ENV=production
EOF

# 빌드
npm ci
npm run build

# Firebase 배포
firebase deploy --only hosting
```

## 환경변수 설정

### Backend (Cloud Run)

```bash
gcloud run services update examhub-backend \
    --region asia-northeast3 \
    --set-env-vars "\
DATABASE_URL=postgresql://user:pass@host:5432/examhub,\
NODE_ENV=production,\
ALLOWED_ORIGINS=https://examhub-app.web.app,https://examhub.kr"
```

### Frontend (.env.production)

```env
NEXT_PUBLIC_API_URL=https://examhub-backend-xxxxx-an.a.run.app
NEXT_PUBLIC_HUB_URL=https://geobukschool.kr
NEXT_PUBLIC_HUB_API_URL=https://ts-back-nest-479305.du.r.appspot.com
NEXT_PUBLIC_FRONT_URL=https://examhub-app.web.app
NODE_ENV=production
```

## Cloud SQL 설정 (선택사항)

```bash
# Cloud SQL 인스턴스 생성
gcloud sql instances create examhub-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=asia-northeast3

# 데이터베이스 생성
gcloud sql databases create examhub --instance=examhub-db

# 사용자 생성
gcloud sql users create examhub-user \
    --instance=examhub-db \
    --password=YOUR_SECURE_PASSWORD

# Cloud Run과 연결
gcloud run services update examhub-backend \
    --add-cloudsql-instances=$PROJECT_ID:asia-northeast3:examhub-db \
    --set-env-vars="DATABASE_URL=postgresql://examhub-user:PASSWORD@/examhub?host=/cloudsql/$PROJECT_ID:asia-northeast3:examhub-db"
```

## 도메인 연결

### Backend (Cloud Run)
```bash
gcloud run domain-mappings create \
    --service examhub-backend \
    --domain api.examhub.kr \
    --region asia-northeast3
```

### Frontend (Firebase)
Firebase Console > Hosting > 커스텀 도메인 추가 > examhub.kr

## 비용 최적화

1. **Cloud Run**: min-instances=0으로 설정 (사용하지 않을 때 비용 없음)
2. **Cloud SQL**: 개발 시 db-f1-micro 사용 ($7/월)
3. **Firebase Hosting**: 무료 티어 (10GB/월 전송)

## 모니터링

```bash
# Cloud Run 로그 확인
gcloud run services logs read examhub-backend --region asia-northeast3

# 실시간 로그
gcloud run services logs tail examhub-backend --region asia-northeast3
```

## 트러블슈팅

### 1. 빌드 실패
```bash
# 로컬에서 Docker 빌드 테스트
cd backend
docker build -t test .
docker run -p 8080:8080 test
```

### 2. 데이터베이스 연결 실패
- Cloud SQL Proxy 또는 VPC 커넥터 설정 확인
- DATABASE_URL 환경변수 확인

### 3. CORS 오류
- Backend의 CORS 설정에 Frontend URL 추가
- ALLOWED_ORIGINS 환경변수 확인

## 배포 URL

| 서비스 | URL |
|--------|-----|
| Frontend | https://examhub-app.web.app |
| Backend API | https://examhub-backend-xxxxx-an.a.run.app |
| API Docs | https://examhub-backend-xxxxx-an.a.run.app/api-docs |
