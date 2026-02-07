# ExamHub Firebase 배포 스크립트 (Windows)

Write-Host "🚀 ExamHub Firebase 배포를 시작합니다..." -ForegroundColor Cyan

# 프로젝트 루트 확인
if (-not (Test-Path "firebase.json")) {
    Write-Host "❌ firebase.json 파일을 찾을 수 없습니다. 프로젝트 루트에서 실행해주세요." -ForegroundColor Red
    exit 1
}

# Firebase 로그인 확인
try {
    firebase projects:list 2>&1 | Out-Null
} catch {
    Write-Host "❌ Firebase 로그인이 필요합니다." -ForegroundColor Red
    Write-Host "다음 명령어로 로그인해주세요: firebase login" -ForegroundColor Yellow
    exit 1
}

# 현재 프로젝트 확인
Write-Host "`n📋 현재 Firebase 프로젝트:" -ForegroundColor Yellow
firebase use

$response = Read-Host "이 프로젝트에 배포하시겠습니까? (y/n)"
if ($response -ne 'y' -and $response -ne 'Y') {
    Write-Host "배포를 취소했습니다." -ForegroundColor Yellow
    exit 0
}

# 프론트엔드 빌드
Write-Host "`n🔨 프론트엔드 빌드 중..." -ForegroundColor Cyan
Set-Location frontend
npm run build:firebase

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 프론트엔드 빌드에 실패했습니다." -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..

# Firebase 배포
Write-Host "`n☁️  Firebase Hosting에 배포 중..." -ForegroundColor Cyan
firebase deploy --only hosting

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ 배포가 완료되었습니다!" -ForegroundColor Green
    Write-Host "🌐 배포된 사이트를 확인하세요." -ForegroundColor Cyan
} else {
    Write-Host "❌ 배포에 실패했습니다." -ForegroundColor Red
    exit 1
}


















