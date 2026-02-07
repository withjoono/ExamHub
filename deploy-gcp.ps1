# ============================================
# ExamHub - GCP Cloud Run 배포 스크립트 (Windows)
# ============================================

param(
    [string]$ProjectId = "examhub-project",
    [string]$Region = "asia-northeast3",
    [switch]$BackendOnly,
    [switch]$FrontendOnly,
    [switch]$SetupOnly
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 ExamHub GCP 배포 시작..." -ForegroundColor Cyan

# 1. GCP 프로젝트 설정
function Setup-GCP {
    Write-Host "`n📋 GCP 프로젝트 설정 중..." -ForegroundColor Yellow

    # 프로젝트 설정
    gcloud config set project $ProjectId

    # 필요한 API 활성화
    Write-Host "API 활성화 중..."
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable run.googleapis.com
    gcloud services enable artifactregistry.googleapis.com
    gcloud services enable sqladmin.googleapis.com

    # Artifact Registry 저장소 생성
    Write-Host "Artifact Registry 저장소 생성 중..."
    gcloud artifacts repositories create examhub `
        --repository-format=docker `
        --location=$Region `
        --description="ExamHub Docker images" `
        2>$null

    Write-Host "✅ GCP 설정 완료" -ForegroundColor Green
}

# 2. Backend 배포
function Deploy-Backend {
    Write-Host "`n🔧 Backend 배포 중..." -ForegroundColor Yellow

    Push-Location backend

    # Docker 이미지 빌드
    $ImageTag = "asia-northeast3-docker.pkg.dev/$ProjectId/examhub/backend:latest"

    Write-Host "Docker 이미지 빌드 중..."
    docker build -t $ImageTag .

    # Docker 인증 설정
    Write-Host "Docker 인증 설정 중..."
    gcloud auth configure-docker asia-northeast3-docker.pkg.dev --quiet

    # 이미지 푸시
    Write-Host "이미지 푸시 중..."
    docker push $ImageTag

    # Cloud Run 배포
    Write-Host "Cloud Run 배포 중..."
    gcloud run deploy examhub-backend `
        --image $ImageTag `
        --region $Region `
        --platform managed `
        --allow-unauthenticated `
        --port 8080 `
        --memory 512Mi `
        --cpu 1 `
        --min-instances 0 `
        --max-instances 10 `
        --set-env-vars "NODE_ENV=production"

    # 배포된 URL 가져오기
    $BackendUrl = gcloud run services describe examhub-backend --region $Region --format "value(status.url)"
    Write-Host "✅ Backend 배포 완료: $BackendUrl" -ForegroundColor Green

    Pop-Location
    return $BackendUrl
}

# 3. Frontend 배포
function Deploy-Frontend {
    param([string]$BackendUrl)

    Write-Host "`n🎨 Frontend 배포 중..." -ForegroundColor Yellow

    Push-Location frontend

    # 환경 변수 설정
    if ($BackendUrl) {
        $envContent = @"
NEXT_PUBLIC_API_URL=$BackendUrl
NEXT_PUBLIC_HUB_URL=https://geobukschool.kr
NEXT_PUBLIC_HUB_API_URL=https://ts-back-nest-479305.du.r.appspot.com
NEXT_PUBLIC_FRONT_URL=https://examhub-app.web.app
NODE_ENV=production
"@
        $envContent | Out-File -FilePath ".env.production" -Encoding UTF8
    }

    # 빌드
    Write-Host "Frontend 빌드 중..."
    npm ci
    npm run build

    # Firebase 배포
    Write-Host "Firebase Hosting 배포 중..."
    npx firebase deploy --only hosting

    Write-Host "✅ Frontend 배포 완료: https://examhub-app.web.app" -ForegroundColor Green

    Pop-Location
}

# 메인 실행
try {
    if ($SetupOnly) {
        Setup-GCP
        exit 0
    }

    if (-not $FrontendOnly) {
        Setup-GCP
        $backendUrl = Deploy-Backend
    }

    if (-not $BackendOnly) {
        Deploy-Frontend -BackendUrl $backendUrl
    }

    Write-Host "`n" -NoNewline
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "🎉 ExamHub 배포 완료!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Backend:  https://examhub-backend-xxxxx-an.a.run.app"
    Write-Host "Frontend: https://examhub-app.web.app"
    Write-Host "API Docs: https://examhub-backend-xxxxx-an.a.run.app/api-docs"

} catch {
    Write-Host "❌ 배포 실패: $_" -ForegroundColor Red
    exit 1
}
