# 🔧 Railway 배포 문제 해결

## 문제 상황
- Railway가 프로젝트 루트를 보고 있어서 backend 폴더를 찾지 못함
- Root Directory 설정이 보이지 않음 (빌드 실패 때문)

## ✅ 해결 방법: Railway CLI로 backend 폴더에서 직접 배포

### 단계 1: 기존 프로젝트 삭제 (선택사항)

Railway 대시보드에서:
1. Project Settings > Danger > Delete Project

### 단계 2: backend 폴더에서 새로 배포

**새 PowerShell 터미널을 열고:**

```powershell
# 1. backend 폴더로 이동
cd E:\Dev\github\ExamHub\backend

# 2. Railway 로그인 (브라우저가 열립니다)
railway login
```

브라우저에서 GitHub로 로그인하세요.

```powershell
# 3. 새 프로젝트 초기화
railway init
```

프롬프트에서:
- 프로젝트 이름 입력: `examhub-backend` (또는 원하는 이름)

```powershell
# 4. PostgreSQL 추가
railway add
```

화살표 키로 `PostgreSQL` 선택하고 Enter

```powershell
# 5. 환경 변수 설정 (Railway 웹에서 또는 CLI로)
railway variables set NODE_ENV=production
railway variables set PORT=4003
```

또는 웹 대시보드에서:
- https://railway.app/dashboard
- 프로젝트 클릭 > 서비스 클릭 > Variables 탭
- `NODE_ENV=production`, `PORT=4003` 추가

```powershell
# 6. 배포 시작!
railway up
```

배포가 시작됩니다 (5-7분 소요)

```powershell
# 7. 도메인 생성
railway domain
```

```powershell
# 8. 상태 확인
railway status
```

완료!

---

## 🎯 이 방법의 장점

- ✅ backend 폴더가 자동으로 루트가 됨
- ✅ Root Directory 설정 불필요
- ✅ 빌드가 바로 성공함
- ✅ package.json을 정확히 찾음

---

## 📝 실시간 로그 확인

배포 중 로그를 보려면:

```powershell
railway logs
```

Ctrl+C로 종료

---

## ✅ 배포 성공 확인

다음과 같은 로그가 보이면 성공:

```
✓ Building application...
✓ Running prisma migrate deploy...
✓ Starting application...
Application is running on: http://0.0.0.0:4003
```

---

## 🌐 배포 완료 후

도메인을 확인:

```powershell
railway status
```

출력 예시:
```
Project: examhub-backend
Environment: production
Service: backend
Status: Active
URL: https://examhub-backend-production.up.railway.app
```

이 URL을 복사하세요!

---

## 🔄 프론트엔드 업데이트

Railway 도메인을 받으면:

```powershell
cd E:\Dev\github\ExamHub

.\update-frontend-backend-url.ps1 -BackendUrl "https://your-railway-url.up.railway.app"
```

완료!

---

## 💡 왜 이 방법이 더 좋은가?

| 방법 | backend 폴더에서 CLI | 루트에서 웹 대시보드 |
|------|---------------------|---------------------|
| Root Directory 설정 | 불필요 (자동) | 필요 (수동) |
| 빌드 성공률 | 높음 ✅ | 낮음 (설정 오류) |
| 간편함 | 매우 간편 | 복잡 |

---

## 🐛 문제 발생 시

### "Not logged in"
```powershell
railway login
```

### "Project not found"
```powershell
railway init
```

### 빌드 실패
```powershell
railway logs
```
로그 확인 후 문제 해결

---

**이제 backend 폴더에서 배포를 시작하세요!** 🚀
















