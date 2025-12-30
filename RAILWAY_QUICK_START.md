# Railway 빠른 배포 가이드

## 🚀 Railway에 ExamHub 백엔드 배포하기

### 준비사항
- GitHub 계정
- ExamHub 코드가 GitHub에 푸시되어 있어야 함

### 배포 단계

#### 1단계: Railway 접속 및 로그인
1. https://railway.app 접속
2. "Start a New Project" 클릭
3. "Login with GitHub" 선택

#### 2단계: 새 프로젝트 생성
1. "Deploy from GitHub repo" 선택
2. ExamHub 저장소 선택
3. "Add variables" 클릭하기 전에 PostgreSQL 먼저 추가

#### 3단계: PostgreSQL 데이터베이스 추가
1. 같은 프로젝트 내에서 "New" 클릭
2. "Database" 선택
3. "Add PostgreSQL" 클릭
4. 자동으로 생성됨

#### 4단계: 백엔드 서비스 설정
1. GitHub repo 서비스로 돌아가기
2. Settings > General:
   - **Root Directory**: `backend` 입력
   - **Start Command**: `npm run start:prod`

3. Settings > Variables에서 환경 변수 추가:
   ```
   NODE_ENV=production
   PORT=4003
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```

4. Settings > Networking:
   - "Generate Domain" 클릭
   - 생성된 도메인 복사 (예: examhub-backend-production.up.railway.app)

#### 5단계: 배포 트리거
1. Deployments 탭으로 이동
2. "Deploy" 클릭 또는 GitHub에 푸시하면 자동 배포

#### 6단계: 데이터베이스 마이그레이션
배포가 완료되면 마이그레이션이 자동으로 실행됩니다.
(railway.json에 설정되어 있음)

수동으로 실행하려면:
```bash
npm install -g @railway/cli
railway login
railway link  # 프로젝트 선택
railway run npx prisma migrate deploy
```

#### 7단계: 배포 확인
생성된 도메인으로 접속:
- API: https://your-domain.up.railway.app/
- Swagger: https://your-domain.up.railway.app/api-docs

#### 8단계: 프론트엔드 재배포
백엔드 URL로 프론트엔드 업데이트:

1. `frontend/.env.production` 수정:
```env
NEXT_PUBLIC_API_URL=https://your-domain.up.railway.app
NODE_ENV=production
```

2. 재배포:
```powershell
cd frontend
npm run build:firebase
cd ..
firebase deploy --only hosting
```

## ✅ 완료!

이제 다음 URL에서 서비스가 작동합니다:
- 프론트엔드: https://examhub-app.web.app
- 백엔드: https://your-domain.up.railway.app
- API 문서: https://your-domain.up.railway.app/api-docs

## 💰 무료 티어
Railway는 매월 $5 크레딧을 제공합니다.
소규모 서비스는 충분히 운영 가능합니다.

## 🔧 Railway CLI 설치 (선택사항)
```bash
npm install -g @railway/cli
railway login
railway link  # backend 디렉토리에서
railway logs  # 로그 확인
railway run [command]  # 원격 명령 실행
```

## 문제 해결

### 빌드 실패
Railway 대시보드 > Deployments > 해당 배포 > Logs 확인

### DATABASE_URL 오류
- PostgreSQL 서비스가 생성되었는지 확인
- Variables에 `${{Postgres.DATABASE_URL}}` 정확히 입력했는지 확인

### CORS 오류
backend/src/main.ts에 Firebase URL이 추가되었는지 확인

---

**Railway 대신 Render를 사용하고 싶다면 `BACKEND_DEPLOYMENT.md`를 참조하세요!**



