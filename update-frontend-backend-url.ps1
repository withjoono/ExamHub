# Railway 백엔드 URL로 프론트엔드 업데이트 스크립트
# Railway 배포 완료 후 실행하세요

param(
    [Parameter(Mandatory=$true)]
    [string]$BackendUrl
)

Write-Host "🚀 프론트엔드 백엔드 URL 업데이트 및 재배포" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Railway URL 검증
if (-not $BackendUrl.StartsWith("https://")) {
    Write-Host "❌ 오류: 백엔드 URL은 https://로 시작해야 합니다" -ForegroundColor Red
    Write-Host "예시: https://examhub-backend-production.up.railway.app" -ForegroundColor Yellow
    exit 1
}

Write-Host "📝 백엔드 URL: $BackendUrl" -ForegroundColor Green
Write-Host ""

# .env.production 파일 생성
$envContent = @"
# Production 환경 변수
# Railway 백엔드 URL

NEXT_PUBLIC_API_URL=$BackendUrl
NODE_ENV=production
"@

$envPath = "frontend\.env.production"
Write-Host "📄 $envPath 파일 생성 중..." -ForegroundColor Yellow
$envContent | Out-File -FilePath $envPath -Encoding UTF8
Write-Host "✅ 환경 변수 파일 생성 완료" -ForegroundColor Green
Write-Host ""

# 프론트엔드 빌드
Write-Host "🔨 프론트엔드 빌드 중..." -ForegroundColor Yellow
Set-Location frontend
npm run build:firebase

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 빌드 실패" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "✅ 빌드 완료" -ForegroundColor Green
Write-Host ""

# Firebase 배포
Set-Location ..
Write-Host "🚀 Firebase에 배포 중..." -ForegroundColor Yellow
firebase deploy --only hosting

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 배포 실패" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 배포 완료!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "접속 URL:" -ForegroundColor Cyan
Write-Host "  프론트엔드: https://examhub-app.web.app" -ForegroundColor White
Write-Host "  백엔드: $BackendUrl" -ForegroundColor White
Write-Host "  API 문서: $BackendUrl/api-docs" -ForegroundColor White
Write-Host ""
Write-Host "✅ 전체 배포가 완료되었습니다!" -ForegroundColor Green

