# 🌐 Railway 웹 대시보드로 설정하기 (더 쉬운 방법)

CLI에서 문제가 계속 발생한다면, 웹 대시보드로 모든 것을 설정할 수 있습니다.

## 📋 단계별 가이드

### 1단계: Railway 대시보드 접속

https://railway.app/dashboard

### 2단계: 프로젝트 확인

방금 생성한 프로젝트가 보일 것입니다.
프로젝트를 클릭하세요.

### 3단계: 서비스 확인

프로젝트 대시보드에서 두 개의 카드가 보여야 합니다:

1. **backend 서비스** (GitHub 아이콘)
2. **PostgreSQL** (데이터베이스 아이콘)

PostgreSQL이 없다면:
- `New` 버튼 클릭
- `Database` 선택
- `Add PostgreSQL` 클릭

### 4단계: backend 서비스 설정

**backend 서비스 카드**를 클릭하세요.

#### Settings 탭에서:

1. **Source 섹션 확인:**
   - Repository: `withjoono/ExamHub`
   - Branch: `master`
   - Root Directory: `backend` ← **중요!**
   
   Root Directory가 비어있거나 다르면 `backend`로 변경하세요.

2. **Deploy 섹션:**
   - Watch Paths: 기본값 사용

#### Variables 탭에서:

`New Variable` 버튼을 클릭하여 추가:

```
NODE_ENV = production
PORT = 4003
```

`DATABASE_URL`은 PostgreSQL 서비스가 자동으로 제공하므로 추가하지 않아도 됩니다.

#### Networking 탭에서:

`Generate Domain` 버튼 클릭
- 공개 URL이 생성됩니다
- 이 URL을 복사해두세요

### 5단계: 배포 시작

Variables를 저장하면 자동으로 재배포가 시작됩니다.

또는:
1. `Deployments` 탭 클릭
2. `Deploy` 버튼 클릭

### 6단계: 배포 모니터링

`Deployments` 탭에서:
- 진행 중인 배포를 클릭
- 실시간 로그 확인
- 5-7분 소요

### 7단계: 성공 확인

배포가 완료되면:
- ✅ 표시가 나타남
- 로그에 `Application is running` 메시지

생성된 도메인으로 접속:
- `https://your-domain.up.railway.app`
- `https://your-domain.up.railway.app/api-docs` (Swagger)

---

## 🎯 체크리스트

- [ ] PostgreSQL 서비스 추가됨
- [ ] backend 서비스의 Root Directory = `backend`
- [ ] Variables에 `NODE_ENV=production` 추가
- [ ] Variables에 `PORT=4003` 추가
- [ ] 공개 도메인 생성
- [ ] 배포 성공 (✅ 표시)
- [ ] API 접속 확인

---

## 🔧 문제 해결

### "Could not determine how to build the app"

Root Directory가 `backend`로 설정되지 않았습니다.
- Settings > Source > Root Directory: `backend`

### "DATABASE_URL not found"

PostgreSQL 서비스가 추가되지 않았거나 연결되지 않았습니다.
- 프로젝트 대시보드에서 PostgreSQL 카드 확인
- 없다면 `New` > `Database` > `PostgreSQL` 추가

### 빌드 실패

Deployments 탭에서 로그를 확인하세요.
일반적인 원인:
- Root Directory 미설정
- package.json을 찾을 수 없음
- 의존성 설치 실패

---

**웹 대시보드가 더 직관적이고 쉽습니다!** 🌐
















