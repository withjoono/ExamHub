# Firebase 배포 가이드

## 사전 준비

### 1. Firebase CLI 설치
```bash
npm install -g firebase-tools
```

### 2. Firebase 로그인
```bash
firebase login
```

### 3. Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: examhub)
4. 프로젝트 ID 확인 및 생성

### 4. Firebase 프로젝트 연결
프로젝트 루트에서 `.firebaserc` 파일을 수정하여 프로젝트 ID를 설정합니다:

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

`your-project-id`를 Firebase Console에서 생성한 프로젝트 ID로 변경하세요.

## 배포 프로세스

### 프론트엔드 배포 (Firebase Hosting)

#### 1. 환경 변수 설정
`frontend/.env.production` 파일을 편집하여 백엔드 API URL을 설정합니다:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NODE_ENV=production
```

#### 2. 프론트엔드 빌드 및 배포
프로젝트 루트에서:

```bash
cd frontend
npm run build:firebase
cd ..
firebase deploy --only hosting
```

또는 프론트엔드 디렉토리에서 한 번에:

```bash
cd frontend
npm run deploy
```

#### 3. 배포 확인
배포가 완료되면 Firebase Hosting URL이 표시됩니다:
```
Hosting URL: https://your-project-id.web.app
```

### 백엔드 배포 옵션

ExamHub 백엔드는 NestJS + PostgreSQL을 사용하므로 다음 옵션 중 하나를 선택할 수 있습니다:

#### 옵션 1: Firebase Cloud Functions (권장하지 않음)
- Firebase Functions는 Node.js 런타임을 제공하지만, PostgreSQL을 직접 호스팅하지 않습니다
- Cloud SQL을 별도로 설정해야 합니다

#### 옵션 2: Google Cloud Run (권장)
1. Docker 이미지 생성
2. Google Cloud Run에 배포
3. Cloud SQL PostgreSQL 인스턴스 연결

#### 옵션 3: 기존 서버 또는 다른 클라우드 서비스
- Heroku, Railway, Render 등
- VPS (AWS EC2, Google Compute Engine 등)

## Firebase Hosting 설정 상세

### firebase.json 구조
```json
{
  "hosting": {
    "public": "frontend/out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Next.js 정적 내보내기
Firebase Hosting은 정적 파일 호스팅 서비스이므로, Next.js를 정적 사이트로 빌드합니다:

`next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  output: 'export', // 정적 내보내기
  images: {
    unoptimized: true, // 정적 내보내기에 필요
  },
}
```

## 백엔드 배포 가이드 (Google Cloud Run 예시)

### 1. Dockerfile 생성
`backend/Dockerfile`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 4003

CMD ["npm", "run", "start:prod"]
```

### 2. Cloud Run 배포
```bash
# Cloud Run 배포
gcloud run deploy examhub-backend \
  --source ./backend \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated
```

### 3. 환경 변수 설정
Cloud Run 콘솔에서 다음 환경 변수를 설정:
- `DATABASE_URL`: PostgreSQL 연결 문자열
- `PORT`: 4003

### 4. 프론트엔드 환경 변수 업데이트
백엔드 URL을 받아서 `frontend/.env.production` 업데이트:
```
NEXT_PUBLIC_API_URL=https://examhub-backend-xxxxx.run.app
```

## 배포 체크리스트

### 프론트엔드
- [ ] Firebase 프로젝트 생성 및 연결
- [ ] `.firebaserc`에 프로젝트 ID 설정
- [ ] `.env.production`에 백엔드 URL 설정
- [ ] 프론트엔드 빌드 테스트 (`npm run build:firebase`)
- [ ] Firebase Hosting에 배포
- [ ] 배포된 사이트 동작 확인

### 백엔드
- [ ] 프로덕션 데이터베이스 준비 (Cloud SQL 또는 다른 PostgreSQL 서비스)
- [ ] 환경 변수 설정 (DATABASE_URL 등)
- [ ] 백엔드 빌드 테스트
- [ ] 백엔드 배포 (Cloud Run 또는 다른 서비스)
- [ ] API 엔드포인트 동작 확인
- [ ] CORS 설정 확인 (프론트엔드 도메인 허용)

## 트러블슈팅

### 빌드 오류
```bash
# 캐시 정리
cd frontend
rm -rf .next out node_modules
npm install
npm run build:firebase
```

### API 연결 오류
1. 브라우저 개발자 도구에서 네트워크 탭 확인
2. CORS 오류가 있는지 확인
3. 백엔드 URL이 올바른지 확인 (`.env.production`)

### Firebase 배포 실패
```bash
# Firebase 로그인 상태 확인
firebase login --reauth

# 프로젝트 확인
firebase projects:list

# 강제 재배포
firebase deploy --only hosting --force
```

## 유용한 명령어

```bash
# Firebase 프로젝트 목록 확인
firebase projects:list

# 현재 프로젝트 확인
firebase use

# 로컬에서 Firebase Hosting 테스트
firebase serve

# 배포 롤백 (이전 버전으로)
firebase hosting:clone SOURCE_SITE_ID:SOURCE_VERSION_ID SITE_ID

# 배포 기록 확인
firebase hosting:releases list
```

## 추가 최적화

### 1. CDN 캐싱
Firebase Hosting은 자동으로 CDN을 사용합니다. `firebase.json`에서 캐시 헤더를 조정할 수 있습니다.

### 2. 커스텀 도메인 연결
Firebase Console > Hosting > 도메인 추가에서 커스텀 도메인을 연결할 수 있습니다.

### 3. SSL/TLS
Firebase Hosting은 자동으로 SSL 인증서를 제공합니다.

### 4. 성능 모니터링
Firebase Performance Monitoring을 추가하여 사이트 성능을 모니터링할 수 있습니다.

## 참고 자료

- [Firebase Hosting 문서](https://firebase.google.com/docs/hosting)
- [Next.js 정적 내보내기](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Google Cloud Run 문서](https://cloud.google.com/run/docs)



