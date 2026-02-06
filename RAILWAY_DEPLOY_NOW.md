# 🚂 Railway 배포 - 지금 바로 시작하세요!

## ✅ 준비 완료 사항
- ✅ GitHub 저장소: https://github.com/withjoono/ExamHub
- ✅ 최신 코드 푸시 완료 (방금 업데이트됨)
- ✅ Railway 설정 파일 준비 (railway.json, Procfile)
- ✅ 프론트엔드 이미 배포됨: https://examhub-app.web.app
- ✅ Railway CLI 설치 확인 완료 (v4.16.1)

---

## 🎯 두 가지 배포 방법

### 방법 1: Railway 웹 대시보드 (추천 - 가장 쉬움) ⭐

**소요 시간**: 약 10분

**장점**: 
- GUI로 직관적
- 모든 설정을 한눈에 확인
- 초보자에게 친절

**가이드**: `RAILWAY_DEPLOYMENT_GUIDE.md` 참고

**빠른 시작**:
1. https://railway.app 접속
2. "New Project" > "Deploy from GitHub repo"
3. `withjoono/ExamHub` 선택
4. Settings > General > Root Directory: `backend`
5. "New" > "Database" > "PostgreSQL" 추가
6. Variables 탭에서 환경 변수 추가:
   - `NODE_ENV=production`
   - `PORT=4003`
7. Settings > Networking > "Generate Domain"

---

### 방법 2: Railway CLI (빠른 배포)

**소요 시간**: 약 5분

**장점**:
- 터미널에서 모든 작업
- 빠른 배포
- 개발자 친화적

**가이드**: `RAILWAY_CLI_DEPLOY.md` 참고

**빠른 시작** (새 PowerShell 터미널에서):
```powershell
# 1. 백엔드 디렉토리로 이동
cd E:\Dev\github\ExamHub\backend

# 2. Railway 로그인 (브라우저 열림)
railway login

# 3. 프로젝트 초기화
railway init

# 4. PostgreSQL 추가
railway add
# (메뉴에서 PostgreSQL 선택)

# 5. 환경 변수 설정 (웹 대시보드에서)
# https://railway.app/dashboard에서 Variables 탭:
# NODE_ENV=production
# PORT=4003

# 6. 배포
railway up

# 7. 도메인 생성
railway domain

# 8. 상태 확인
railway status
```

---

## 🔄 배포 후 프론트엔드 업데이트

Railway 배포가 완료되고 도메인을 받으면:

### 자동 업데이트 스크립트 사용 (권장)

```powershell
cd E:\Dev\github\ExamHub

# Railway 도메인을 여기에 입력하세요
.\update-frontend-backend-url.ps1 -BackendUrl "https://your-railway-domain.up.railway.app"
```

예시:
```powershell
.\update-frontend-backend-url.ps1 -BackendUrl "https://examhub-backend-production.up.railway.app"
```

이 스크립트가 자동으로:
1. `.env.production` 파일 생성
2. 프론트엔드 빌드
3. Firebase에 재배포

---

## 📋 배포 체크리스트

### Railway 백엔드 배포
- [ ] Railway 프로젝트 생성
- [ ] GitHub 저장소 연결
- [ ] Root Directory를 `backend`로 설정
- [ ] PostgreSQL 데이터베이스 추가
- [ ] 환경 변수 설정 (`NODE_ENV`, `PORT`)
- [ ] 배포 성공 확인 (5-7분 소요)
- [ ] 공개 도메인 생성 및 복사
- [ ] API 동작 확인 (https://your-domain.up.railway.app)

### 프론트엔드 업데이트
- [ ] Railway 도메인 복사
- [ ] `update-frontend-backend-url.ps1` 스크립트 실행
- [ ] Firebase 재배포 완료
- [ ] 전체 서비스 동작 확인

---

## 🌐 배포 완료 후 접속 URL

배포가 모두 완료되면:

| 서비스 | URL |
|--------|-----|
| **프론트엔드** | https://examhub-app.web.app |
| **백엔드 API** | https://your-railway-domain.up.railway.app |
| **API 문서** | https://your-railway-domain.up.railway.app/api-docs |
| **Railway 대시보드** | https://railway.app/dashboard |

---

## 🔧 주요 설정 파일

모든 설정이 이미 완료되어 있습니다:

| 파일 | 위치 | 설명 |
|------|------|------|
| `railway.json` | `backend/` | Railway 빌드 및 배포 설정 |
| `Procfile` | `backend/` | 프로세스 시작 명령 |
| `.dockerignore` | `backend/` | Docker 빌드 제외 파일 |
| `prisma/schema.prisma` | `backend/prisma/` | 데이터베이스 스키마 |

---

## 💡 Railway 환경 변수 설정

Railway Variables 탭에서 설정해야 하는 변수:

```plaintext
NODE_ENV=production
PORT=4003
```

**참고**: `DATABASE_URL`은 PostgreSQL 추가 시 자동으로 설정됩니다!

---

## 🐛 문제 발생 시

### 빌드 실패
- Railway 대시보드 > Deployments > 로그 확인
- Root Directory가 `backend`로 설정되었는지 확인

### DATABASE_URL 오류
- PostgreSQL 서비스가 추가되었는지 확인
- Variables 탭에서 `DATABASE_URL` 자동 생성 확인

### CORS 오류
- `backend/src/main.ts`에 Firebase URL이 포함되어 있음 (이미 설정됨)

### 자세한 문제 해결
- `RAILWAY_DEPLOYMENT_GUIDE.md`의 "문제 해결" 섹션 참고

---

## 📚 상세 가이드

더 자세한 내용은 다음 문서를 참고하세요:

1. **RAILWAY_DEPLOYMENT_GUIDE.md** - 웹 대시보드 상세 가이드
2. **RAILWAY_CLI_DEPLOY.md** - CLI 상세 가이드
3. **RAILWAY_QUICK_START.md** - 빠른 시작 가이드

---

## 💰 비용 안내

**Railway 무료 티어**:
- 매월 $5 크레딧 제공
- 소규모 서비스는 충분히 운영 가능
- 사용량은 Railway 대시보드에서 모니터링

**예상 월 비용**:
- 백엔드 서비스: ~$3
- PostgreSQL: ~$2
- 총 ~$5 (무료 크레딧 범위 내)

---

## 🎉 배포 시작하기

준비가 되셨나요? 다음 중 하나를 선택하세요:

### 옵션 A: 웹 대시보드로 배포 (추천)
1. https://railway.app 접속
2. `RAILWAY_DEPLOYMENT_GUIDE.md` 단계별 가이드 따라하기

### 옵션 B: CLI로 빠른 배포
1. 새 PowerShell 터미널 열기
2. `RAILWAY_CLI_DEPLOY.md` 명령어 실행

---

## ❓ 질문이나 문제가 있으신가요?

언제든 물어보세요! 배포 과정에서 막히는 부분이 있다면 도와드리겠습니다.

**Happy Deploying! 🚀**
















