# 🚀 Railway CLI 빠른 배포 가이드

## Railway CLI로 5분 안에 배포하기

이 가이드는 Railway CLI를 사용하여 터미널에서 직접 배포하는 방법입니다.

---

## 📋 전제 조건

- ✅ Railway CLI 설치됨 (`railway --version` 확인 완료)
- ✅ GitHub 계정 연결 필요
- ✅ PowerShell 또는 Command Prompt 접근

---

## 🎯 배포 단계 (약 5분)

### 1단계: Railway 로그인

새 PowerShell 터미널을 열고:

```powershell
cd E:\Dev\github\ExamHub\backend
railway login
```

- 브라우저가 자동으로 열립니다
- GitHub 계정으로 로그인
- 인증 완료되면 터미널로 돌아옵니다

### 2단계: 새 Railway 프로젝트 초기화

```powershell
railway init
```

프롬프트가 나타나면:
- 프로젝트 이름: `examhub-backend` (또는 원하는 이름)
- Enter 키 입력

### 3단계: PostgreSQL 데이터베이스 추가

```powershell
railway add
```

메뉴에서:
- 화살표 키로 `PostgreSQL` 선택
- Enter 키 입력
- 데이터베이스가 자동으로 생성되고 `DATABASE_URL`이 설정됩니다

### 4단계: 환경 변수 설정

Railway 웹 대시보드에서 환경 변수를 설정해야 합니다:

1. 브라우저에서 https://railway.app/dashboard 열기
2. `examhub-backend` 프로젝트 클릭
3. 백엔드 서비스 클릭
4. `Variables` 탭 클릭
5. 다음 변수 추가:

```
NODE_ENV=production
PORT=4003
```

**또는** CLI에서 직접 설정 (Railway v3.0 이상):

```powershell
railway variables set NODE_ENV=production
railway variables set PORT=4003
```

### 5단계: 배포 실행

```powershell
railway up
```

- 로컬 파일들이 Railway로 업로드됩니다
- 빌드가 시작됩니다 (5-7분 소요)
- 진행 상황이 터미널에 표시됩니다

배포 중 로그 확인:

```powershell
railway logs
```

### 6단계: 도메인 생성

배포가 완료되면 공개 도메인을 생성합니다:

```powershell
railway domain
```

또는 웹 대시보드에서:
- Settings > Networking > Generate Domain

### 7단계: 배포 상태 확인

```powershell
railway status
```

출력 예시:
```
Project: examhub-backend
Service: backend
Status: Active
URL: https://examhub-backend-production.up.railway.app
```

---

## ✅ 배포 완료!

### API 동작 확인

1. **Health Check**
   ```powershell
   # PowerShell에서
   Invoke-WebRequest https://your-railway-domain.up.railway.app
   ```

2. **Swagger 문서**
   - 브라우저에서 `https://your-railway-domain.up.railway.app/api-docs` 접속

---

## 🔄 프론트엔드 업데이트

백엔드 URL을 프론트엔드에 설정:

### 1. 환경 변수 파일 수정

`frontend/.env.production` 파일 생성/수정:

```env
NEXT_PUBLIC_API_URL=https://your-railway-domain.up.railway.app
NODE_ENV=production
```

**your-railway-domain**을 실제 도메인으로 교체하세요!

### 2. 프론트엔드 재배포

```powershell
cd E:\Dev\github\ExamHub\frontend
npm run build:firebase
cd ..
firebase deploy --only hosting
```

---

## 🛠️ 유용한 Railway CLI 명령어

### 프로젝트 관리

```powershell
# 프로젝트 상태 확인
railway status

# 로그 실시간 확인
railway logs

# 환경 변수 확인
railway variables

# 프로젝트 연결 (다른 디렉토리에서)
railway link
```

### 배포 관리

```powershell
# 재배포
railway up

# 특정 명령 실행
railway run npm run start:prod

# Prisma 마이그레이션 실행
railway run npx prisma migrate deploy

# 데이터베이스 시드 실행
railway run npx prisma db seed
```

### 데이터베이스 관리

```powershell
# PostgreSQL 콘솔 접속
railway run psql $DATABASE_URL

# Prisma Studio 실행 (GUI 데이터베이스 관리)
railway run npx prisma studio
```

---

## 🔧 문제 해결

### "Not logged in" 오류

```powershell
railway login
```

### "No project linked" 오류

```powershell
railway link
```
프로젝트 목록에서 선택

### 빌드 실패

로그 확인:
```powershell
railway logs
```

재배포:
```powershell
railway up --detach
```

### 환경 변수 확인

```powershell
railway variables
```

누락된 변수가 있다면 추가:
```powershell
railway variables set KEY=VALUE
```

---

## 📊 비용 모니터링

```powershell
# 대시보드에서 사용량 확인
railway dashboard
```

또는 웹에서: https://railway.app/dashboard

---

## 🚀 자동 배포 설정 (옵션)

GitHub에 푸시할 때마다 자동으로 배포하려면:

1. Railway 웹 대시보드 접속
2. 프로젝트 > Settings > Service
3. `Connect Repo` 클릭
4. `withjoono/ExamHub` 선택
5. Root Directory: `backend` 설정

이제 GitHub에 푸시할 때마다 자동으로 Railway가 배포합니다!

---

## 📝 Railway vs 웹 대시보드

| 방법 | 장점 | 단점 |
|------|------|------|
| **Railway CLI** | 빠름, 터미널에서 모든 작업 가능 | 로그인 필요, CLI 익숙해야 함 |
| **웹 대시보드** | GUI로 직관적, 초보자 친화적 | GitHub 저장소 연결 필요 |

**추천**: 
- 첫 배포: 웹 대시보드 사용
- 이후 재배포: Railway CLI 사용

---

## 🔗 참고 링크

- Railway CLI 문서: https://docs.railway.app/develop/cli
- Railway 대시보드: https://railway.app/dashboard
- GitHub 저장소: https://github.com/withjoono/ExamHub

---

**배포에 성공하셨나요? 🎉**

문제가 있다면 `RAILWAY_DEPLOYMENT_GUIDE.md`의 문제 해결 섹션을 참고하세요!

