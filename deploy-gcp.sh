#!/bin/bash
# ============================================
# ExamHub - GCP Cloud Run 배포 스크립트 (Linux/Mac)
# ============================================

set -e

PROJECT_ID="${PROJECT_ID:-examhub-project}"
REGION="${REGION:-asia-northeast3}"
BACKEND_ONLY=false
FRONTEND_ONLY=false
SETUP_ONLY=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --project) PROJECT_ID="$2"; shift 2 ;;
        --region) REGION="$2"; shift 2 ;;
        --backend-only) BACKEND_ONLY=true; shift ;;
        --frontend-only) FRONTEND_ONLY=true; shift ;;
        --setup-only) SETUP_ONLY=true; shift ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

echo "🚀 ExamHub GCP 배포 시작..."

# 1. GCP 프로젝트 설정
setup_gcp() {
    echo ""
    echo "📋 GCP 프로젝트 설정 중..."

    gcloud config set project $PROJECT_ID

    echo "API 활성화 중..."
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable run.googleapis.com
    gcloud services enable artifactregistry.googleapis.com
    gcloud services enable sqladmin.googleapis.com

    echo "Artifact Registry 저장소 생성 중..."
    gcloud artifacts repositories create examhub \
        --repository-format=docker \
        --location=$REGION \
        --description="ExamHub Docker images" \
        2>/dev/null || true

    echo "✅ GCP 설정 완료"
}

# 2. Backend 배포
deploy_backend() {
    echo ""
    echo "🔧 Backend 배포 중..."

    cd backend

    IMAGE_TAG="asia-northeast3-docker.pkg.dev/$PROJECT_ID/examhub/backend:latest"

    echo "Docker 이미지 빌드 중..."
    docker build -t $IMAGE_TAG .

    echo "Docker 인증 설정 중..."
    gcloud auth configure-docker asia-northeast3-docker.pkg.dev --quiet

    echo "이미지 푸시 중..."
    docker push $IMAGE_TAG

    echo "Cloud Run 배포 중..."
    gcloud run deploy examhub-backend \
        --image $IMAGE_TAG \
        --region $REGION \
        --platform managed \
        --allow-unauthenticated \
        --port 8080 \
        --memory 512Mi \
        --cpu 1 \
        --min-instances 0 \
        --max-instances 10 \
        --set-env-vars "NODE_ENV=production"

    BACKEND_URL=$(gcloud run services describe examhub-backend --region $REGION --format "value(status.url)")
    echo "✅ Backend 배포 완료: $BACKEND_URL"

    cd ..
    echo $BACKEND_URL
}

# 3. Frontend 배포
deploy_frontend() {
    local backend_url=$1

    echo ""
    echo "🎨 Frontend 배포 중..."

    cd frontend

    # 환경 변수 설정
    if [ -n "$backend_url" ]; then
        cat > .env.production << EOF
NEXT_PUBLIC_API_URL=$backend_url
NEXT_PUBLIC_HUB_URL=https://geobukschool.kr
NEXT_PUBLIC_HUB_API_URL=https://ts-back-nest-479305.du.r.appspot.com
NEXT_PUBLIC_FRONT_URL=https://examhub-app.web.app
NODE_ENV=production
EOF
    fi

    echo "Frontend 빌드 중..."
    npm ci
    npm run build

    echo "Firebase Hosting 배포 중..."
    npx firebase deploy --only hosting

    echo "✅ Frontend 배포 완료: https://examhub-app.web.app"

    cd ..
}

# 메인 실행
main() {
    if [ "$SETUP_ONLY" = true ]; then
        setup_gcp
        exit 0
    fi

    if [ "$FRONTEND_ONLY" = false ]; then
        setup_gcp
        BACKEND_URL=$(deploy_backend)
    fi

    if [ "$BACKEND_ONLY" = false ]; then
        deploy_frontend "$BACKEND_URL"
    fi

    echo ""
    echo "========================================"
    echo "🎉 ExamHub 배포 완료!"
    echo "========================================"
    echo "Backend:  $BACKEND_URL"
    echo "Frontend: https://examhub-app.web.app"
    echo "API Docs: $BACKEND_URL/api-docs"
}

main
