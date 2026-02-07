# ExamHub 서버 자동 시작 스크립트
# 포트: Frontend 3003, Backend 4003

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  ExamHub 서버 시작 스크립트" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3003" -ForegroundColor Green
Write-Host "  Backend:  http://localhost:4003" -ForegroundColor Green
Write-Host "  API Docs: http://localhost:4003/api-docs" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 포트 정리 함수
function Stop-PortProcess {
    param([int]$Port)

    Write-Host "포트 $Port 확인 중..." -ForegroundColor Yellow
    $connections = netstat -ano | Select-String ":$Port\s" | Select-String "LISTENING"

    if ($connections) {
        foreach ($connection in $connections) {
            $parts = $connection -split '\s+' | Where-Object { $_ -ne '' }
            $pid = $parts[-1]

            if ($pid -match '^\d+$') {
                Write-Host "  포트 $Port 사용 중인 프로세스 종료: PID $pid" -ForegroundColor Red
                try {
                    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                    Start-Sleep -Milliseconds 500
                    Write-Host "  프로세스 $pid 종료됨" -ForegroundColor Green
                } catch {
                    Write-Host "  프로세스 종료 실패: $_" -ForegroundColor Red
                }
            }
        }
    } else {
        Write-Host "  포트 $Port 사용 가능" -ForegroundColor Green
    }
}

# PostgreSQL 확인
Write-Host "`n[1/5] PostgreSQL 데이터베이스 확인..." -ForegroundColor Cyan
$pgConnection = netstat -ano | Select-String ":5433\s" | Select-String "LISTENING"
if ($pgConnection) {
    Write-Host "  ✓ PostgreSQL 실행 중 (포트 5433)" -ForegroundColor Green
} else {
    Write-Host "  ✗ PostgreSQL이 실행되지 않았습니다!" -ForegroundColor Red
    Write-Host "    포트 5433에서 PostgreSQL을 실행해주세요." -ForegroundColor Yellow
    exit 1
}

# 포트 정리
Write-Host "`n[2/5] 포트 정리 중..." -ForegroundColor Cyan
Stop-PortProcess -Port 3003
Stop-PortProcess -Port 4003

# 백엔드 시작
Write-Host "`n[3/5] 백엔드 서버 시작 중..." -ForegroundColor Cyan
$backendPath = Join-Path $PSScriptRoot "examhub-backend"
if (Test-Path $backendPath) {
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'ExamHub Backend Starting...' -ForegroundColor Cyan; npm run start:dev" -WindowStyle Normal
    Write-Host "  백엔드 서버 시작됨 (새 창)" -ForegroundColor Green
} else {
    Write-Host "  ✗ 백엔드 디렉토리를 찾을 수 없습니다: $backendPath" -ForegroundColor Red
    exit 1
}

# 백엔드 준비 대기
Write-Host "`n[4/5] 백엔드 컴파일 대기 중..." -ForegroundColor Cyan
$maxWait = 30
$waited = 0
$backendReady = $false

while ($waited -lt $maxWait) {
    Start-Sleep -Seconds 2
    $waited += 2

    $backendConnection = netstat -ano | Select-String ":4003\s" | Select-String "LISTENING"
    if ($backendConnection) {
        Write-Host "  ✓ 백엔드 서버 준비 완료 ($waited 초)" -ForegroundColor Green
        $backendReady = $true
        break
    }
    Write-Host "  대기 중... ($waited/$maxWait 초)" -ForegroundColor Yellow
}

if (-not $backendReady) {
    Write-Host "  ⚠ 백엔드 서버가 시간 내에 시작되지 않았습니다." -ForegroundColor Yellow
    Write-Host "    백엔드 창을 확인하거나 수동으로 재시작하세요." -ForegroundColor Yellow
}

# 프론트엔드 시작
Write-Host "`n[5/5] 프론트엔드 서버 시작 중..." -ForegroundColor Cyan
$frontendPath = Join-Path $PSScriptRoot "examhub-frontend"
if (Test-Path $frontendPath) {
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'ExamHub Frontend Starting...' -ForegroundColor Cyan; npm run dev" -WindowStyle Normal
    Write-Host "  프론트엔드 서버 시작됨 (새 창)" -ForegroundColor Green
} else {
    Write-Host "  ✗ 프론트엔드 디렉토리를 찾을 수 없습니다: $frontendPath" -ForegroundColor Red
    exit 1
}

# 완료 메시지
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  ✓ ExamHub 서버 시작 완료!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "서비스 접속:" -ForegroundColor White
Write-Host "  • 프론트엔드: http://localhost:3003" -ForegroundColor Green
Write-Host "  • 백엔드 API: http://localhost:4003" -ForegroundColor Green
Write-Host "  • API 문서:   http://localhost:4003/api-docs" -ForegroundColor Green
Write-Host ""
Write-Host "서버를 종료하려면 각 창을 닫거나 Ctrl+C를 누르세요." -ForegroundColor Yellow
Write-Host ""
