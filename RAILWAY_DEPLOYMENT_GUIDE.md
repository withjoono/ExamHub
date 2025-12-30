# 🚂 Railway 웹 대시보드 배포 가이드

## 📋 현재 상황
- ✅ GitHub 저장소: https://github.com/withjoono/ExamHub
- ✅ 최신 코드 푸시 완료
- ✅ Railway 설정 파일 준비 완료 (railway.json, Procfile)
- ✅ 프론트엔드 배포 완료: https://examhub-app.web.app

## 🎯 목표
Railway에 ExamHub 백엔드를 배포하고, 프론트엔드와 연결하기

---

## 📝 Railway 웹 배포 단계 (약 10분 소요)

### 1단계: Railway 접속 및 새 프로젝트 생성

1. **Railway 접속**
   - 브라우저에서 https://railway.app 접속
   - `Start a New Project` 또는 `New Project` 버튼 클릭
   - GitHub 계정으로 로그인 (아직 로그인하지 않았다면)

2. **GitHub 저장소 배포 선택**
   - `Deploy from GitHub repo` 옵션 선택
   - 저장소 목록에서 `ExamHub` 선택
   - 또는 직접 입력: `withjoono/ExamHub`

### 2단계: 백엔드 서비스 설정

프로젝트가 생성되면 자동으로 서비스가 추가됩니다.

1. **생성된 서비스 클릭**
   - 프로젝트 대시보드에서 `examhub` 서비스를 클릭

2. **Settings > General 설정**
   - 왼쪽 메뉴에서 `Settings` 클릭
   - `General` 탭에서 다음 설정:
   ```
   Root Directory: backend
   ```
   - **중요**: `backend` 폴더를 Root Directory로 지정해야 합니다!

3. **빌드 설정 확인**
   - Railway가 `railway.json` 파일을 자동으로 감지합니다
   - 빌드 명령: `npm install && npx prisma generate && npm run build`
   - 시작 명령: `npx prisma migrate deploy && npm run start:prod`
   - 이 설정들은 `railway.json`에 이미 정의되어 있습니다

### 3단계: PostgreSQL 데이터베이스 추가

1. **데이터베이스 추가**
   - 프로젝트 대시보드로 돌아가기 (왼쪽 상단 프로젝트 이름 클릭)
   - 오른쪽 상단 `New` 버튼 클릭
   - `Database` 선택
   - `Add PostgreSQL` 클릭
   - 자동으로 PostgreSQL 서비스가 생성됩니다

2. **데이터베이스 연결 확인**
   - PostgreSQL 서비스가 생성되면 `DATABASE_URL` 환경 변수가 자동으로 생성됩니다
   - 백엔드 서비스가 자동으로 이 변수를 참조합니다

### 4단계: 환경 변수 설정

1. **백엔드 서비스로 돌아가기**
   - 프로젝트 대시보드에서 `examhub` 서비스 클릭

2. **Variables 탭 열기**
   - 왼쪽 메뉴에서 `Variables` 클릭

3. **환경 변수 추가**
   - `New Variable` 버튼 클릭하여 다음 변수들을 추가:

   ```plaintext
   NODE_ENV = production
   PORT = 4003
   ```

   **중요**: `DATABASE_URL`은 PostgreSQL 서비스 추가 시 자동으로 설정되므로 직접 추가하지 않아도 됩니다!

4. **변수 저장**
   - 모든 변수를 입력한 후 자동 저장됩니다

### 5단계: 배포 시작

1. **배포 트리거**
   - 환경 변수를 추가하면 자동으로 재배포가 시작됩니다
   - 또는 `Deployments` 탭 > `Deploy` 버튼 클릭

2. **배포 로그 확인**
   - `Deployments` 탭에서 현재 배포 상태 확인
   - 로그를 클릭하여 실시간 빌드 로그 확인
   - 예상 시간: 5-7분

3. **배포 성공 확인**
   - 빌드가 완료되면 ✅ 표시가 나타납니다
   - 로그에 다음과 같은 메시지가 나타나야 합니다:
   ```
   Application is running on: http://0.0.0.0:4003
   Swagger UI available at http://0.0.0.0:4003/api-docs
   ```

### 6단계: 공개 도메인 생성

1. **Settings > Networking으로 이동**
   - 왼쪽 메뉴에서 `Settings` 클릭
   - `Networking` 탭 선택

2. **도메인 생성**
   - `Generate Domain` 버튼 클릭
   - Railway가 자동으로 도메인을 생성합니다
   - 형식: `examhub-backend-production.up.railway.app`

3. **도메인 복사**
   - 생성된 도메인을 복사해두세요 (나중에 프론트엔드 설정에 사용)

### 7단계: API 동작 확인

1. **Health Check**
   - 브라우저에서 생성된 도메인 접속
   - 예: `https://examhub-backend-production.up.railway.app`
   - `Hello World!` 또는 API 응답이 표시되면 성공!

2. **Swagger 문서 확인**
   - `https://your-domain.up.railway.app/api-docs` 접속
   - API 문서가 표시되면 정상 작동 중입니다

---

## 🔧 프론트엔드 API URL 업데이트

백엔드 배포가 완료되면 프론트엔드에서 새 백엔드 URL을 사용하도록 업데이트해야 합니다.

### 1. 환경 변수 파일 생성

`frontend/.env.production` 파일을 생성하거나 수정:

```env
NEXT_PUBLIC_API_URL=https://your-railway-domain.up.railway.app
NODE_ENV=production
```

**your-railway-domain**을 실제 Railway 도메인으로 교체하세요!

### 2. 프론트엔드 재빌드 및 재배포

PowerShell에서 다음 명령 실행:

```powershell
cd E:\Dev\github\ExamHub\frontend
npm run build:firebase
cd ..
firebase deploy --only hosting
```

또는 간단하게:

```powershell
cd E:\Dev\github\ExamHub
.\deploy.ps1
```

### 3. 배포 확인

- 프론트엔드: https://examhub-app.web.app
- 백엔드: https://your-railway-domain.up.railway.app
- API 문서: https://your-railway-domain.up.railway.app/api-docs

---

## ✅ 배포 완료 체크리스트

- [ ] Railway 프로젝트 생성
- [ ] GitHub 저장소 연결
- [ ] Root Directory를 `backend`로 설정
- [ ] PostgreSQL 데이터베이스 추가
- [ ] 환경 변수 설정 (NODE_ENV, PORT)
- [ ] 배포 성공 확인
- [ ] 공개 도메인 생성
- [ ] API 동작 확인
- [ ] 프론트엔드 API URL 업데이트
- [ ] 프론트엔드 재배포

---

## 🐛 문제 해결

### 빌드 실패

**증상**: 빌드 중 오류 발생

**해결 방법**:
1. `Deployments` 탭에서 로그 확인
2. Root Directory가 `backend`로 설정되었는지 확인
3. `railway.json` 파일이 backend 폴더에 있는지 확인

### DATABASE_URL 오류

**증상**: Prisma가 데이터베이스에 연결할 수 없음

**해결 방법**:
1. PostgreSQL 서비스가 생성되었는지 확인
2. Variables 탭에서 `DATABASE_URL` 변수가 있는지 확인
3. PostgreSQL 서비스와 백엔드 서비스가 같은 프로젝트에 있는지 확인

### CORS 오류

**증상**: 프론트엔드에서 API 호출 시 CORS 오류

**해결 방법**:
1. `backend/src/main.ts`에 Firebase URL이 추가되었는지 확인:
   ```typescript
   app.enableCors({
     origin: [
       'http://localhost:3000',
       'https://examhub-app.web.app',
       'https://examhub-app.firebaseapp.com'
     ],
     credentials: true,
   });
   ```
2. 변경사항을 GitHub에 푸시하면 자동으로 재배포됩니다

### 배포 시간이 너무 오래 걸림

**증상**: 빌드가 10분 이상 걸림

**해결 방법**:
1. 정상적인 경우 5-7분 소요
2. 10분 이상 걸리면 로그에서 문제 확인
3. 필요시 `Deployments` 탭에서 배포 취소 후 재시도

---

## 💰 Railway 무료 티어

- **무료 크레딧**: 매월 $5
- **예상 사용량**: 소규모 서비스는 충분히 운영 가능
- **모니터링**: Railway 대시보드에서 사용량 확인 가능

---

## 🔗 유용한 링크

- Railway 대시보드: https://railway.app/dashboard
- GitHub 저장소: https://github.com/withjoono/ExamHub
- 프론트엔드: https://examhub-app.web.app
- Railway 문서: https://docs.railway.app

---

## 📞 다음 단계

배포가 완료되면:

1. ✅ 백엔드 API 동작 확인
2. ✅ 프론트엔드 API URL 업데이트
3. ✅ 프론트엔드 재배포
4. 🎉 전체 서비스 테스트

---

**궁금한 점이 있으면 언제든 물어보세요!** 🚀

