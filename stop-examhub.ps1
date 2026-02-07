# ExamHub 서버 종료 스크립트
# 포트 3003, 4003을 사용하는 프로세스를 종료합니다

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  ExamHub 서버 종료 스크립트" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 포트 종료 함수
function Stop-PortProcess {
    param([int]$Port, [string]$Name)

    Write-Host "[$Name] 포트 $Port 프로세스 종료 중..." -ForegroundColor Yellow
    $connections = netstat -ano | Select-String ":$Port\s" | Select-String "LISTENING"

    if ($connections) {
        $killed = $false
        foreach ($connection in $connections) {
            $parts = $connection -split '\s+' | Where-Object { $_ -ne '' }
            $pid = $parts[-1]

            if ($pid -match '^\d+$') {
                try {
                    $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
                    if ($process) {
                        Write-Host "  프로세스 종료: $($process.Name) (PID: $pid)" -ForegroundColor Red
                        Stop-Process -Id $pid -Force -ErrorAction Stop
                        $killed = $true
                    }
                } catch {
                    Write-Host "  프로세스 종료 실패: $_" -ForegroundColor Red
                }
            }
        }

        if ($killed) {
            Start-Sleep -Milliseconds 500
            Write-Host "  ✓ $Name 서버 종료됨" -ForegroundColor Green
        }
    } else {
        Write-Host "  포트 $Port 에서 실행 중인 프로세스 없음" -ForegroundColor Gray
    }
}

# 프론트엔드 종료
Stop-PortProcess -Port 3003 -Name "Frontend"

# 백엔드 종료
Stop-PortProcess -Port 4003 -Name "Backend"

# 완료 메시지
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  ✓ ExamHub 서버 종료 완료" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
