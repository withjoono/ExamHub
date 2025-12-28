# Railway 배포 가이드

## Railway란?
Railway는 쉽고 빠르게 애플리케이션을 배포할 수 있는 플랫폼입니다.
- 무료 티어: $5/월 크레딧 제공 (소규모 프로젝트에 충분)
- PostgreSQL 자동 프로비저닝
- GitHub 연동으로 자동 배포
- 환경 변수 관리 쉬움

## 배포 단계

### 1. Railway 계정 생성
1. https://railway.app 접속
2. "Start a New Project" 또는 "Login with GitHub" 클릭
3. GitHub 계정으로 로그인

### 2. 새 프로젝트 생성

#### 방법 A: GitHub 저장소 연결 (권장)
1. Railway 대시보드에서 "New Project" 클릭
2. "Deploy from GitHub repo" 선택
3. ExamHub 저장소 선택
4. Root Directory를 `backend`로 설정

#### 방법 B: CLI 사용
```bash
npm install -g @railway/cli
railway login
cd backend
railway init
railway up
```

### 3. PostgreSQL 데이터베이스 추가
1. 프로젝트 대시보드에서 "New" 클릭
2. "Database" > "Add PostgreSQL" 선택
3. 자동으로 DATABASE_URL 환경 변수가 생성됨

### 4. 환경 변수 설정
프로젝트 > Variables 탭에서 다음 변수를 설정:

```
NODE_ENV=production
PORT=4003
DATABASE_URL=${{Postgres.DATABASE_URL}}  # 자동으로 연결됨
```

### 5. 빌드 설정
Railway는 자동으로 package.json을 감지하지만, 다음을 확인하세요:

**Build Command**: `npm install && npx prisma generate && npm run build`
**Start Command**: `npm run start:prod`

프로젝트 > Settings > Deploy에서 설정 가능

### 6. Prisma 마이그레이션 실행
배포 후 처음 한 번만:

Railway CLI 사용:
```bash
railway login
railway link
railway run npx prisma migrate deploy
railway run npx prisma db seed  # 시드 데이터가 있다면
```

또는 Railway 대시보드 > Deploy logs에서 커맨드 실행

### 7. 배포 확인
1. Railway 대시보드에서 "Deployments" 탭 확인
2. 배포 완료 후 도메인 확인 (예: https://examhub-backend-production.up.railway.app)
3. API 테스트: `https://your-domain.up.railway.app/api-docs`

### 8. 프론트엔드 재배포
백엔드 URL을 받아서:

1. `frontend/.env.production` 수정:
```env
NEXT_PUBLIC_API_URL=https://examhub-backend-production.up.railway.app
```

2. 프론트엔드 재빌드 및 재배포:
```bash
cd frontend
npm run build:firebase
cd ..
firebase deploy --only hosting
```

## 대안: Render

Render도 무료 티어를 제공합니다:

### Render 배포 단계
1. https://render.com 접속 및 GitHub 로그인
2. "New" > "Web Service" 선택
3. ExamHub 저장소 연결
4. 설정:
   - Name: examhub-backend
   - Root Directory: backend
   - Environment: Node
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm run start:prod`
5. "Create Web Service" 클릭
6. PostgreSQL 추가:
   - Dashboard > "New" > "PostgreSQL"
   - 무료 티어 선택
   - Web Service의 환경 변수에 DATABASE_URL 연결

## 대안: Google Cloud Run

Firebase와 같은 생태계:

```bash
# Cloud SQL 인스턴스 생성
gcloud sql instances create examhub-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=asia-northeast3

# 데이터베이스 생성
gcloud sql databases create geobuk_mock \
  --instance=examhub-db

# Cloud Run 배포
cd backend
gcloud run deploy examhub-backend \
  --source . \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --add-cloudsql-instances=PROJECT_ID:asia-northeast3:examhub-db
```

## 트러블슈팅

### Prisma 에러
```
Error: P1001: Can't reach database server
```
해결: DATABASE_URL이 올바르게 설정되었는지 확인

### 빌드 실패
```
Error: Cannot find module '@prisma/client'
```
해결: 빌드 명령에 `npx prisma generate` 추가

### CORS 에러
프론트엔드에서 API 호출 실패 시:
- backend/src/main.ts의 CORS 설정 확인
- Firebase Hosting URL이 허용 목록에 있는지 확인

## 비용

### Railway (추천)
- 무료: $5/월 크레딧 (약 500시간 실행 가능)
- 소규모 프로젝트에 충분

### Render
- 무료: 750시간/월 (충분함)
- PostgreSQL 무료: 90일 후 삭제됨 (유료 전환 필요)

### Google Cloud Run
- 무료: 월 200만 요청까지
- Cloud SQL: 최소 $10/월

## 권장 사항
**초기 테스트**: Railway (가장 쉬움)
**장기 운영**: Google Cloud Run (Firebase와 통합)
**예산 제한**: Render (무료 티어 넉넉함)

