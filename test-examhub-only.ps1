# ExamHub API 직접 테스트 스크립트
# Hub 로그인 없이 ExamHub API 테스트

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  ExamHub API 권한 테스트 (직접 테스트)" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$EXAMHUB_URL = "http://localhost:4003"

Write-Host "테스트 A: 권한 불필요 엔드포인트" -ForegroundColor Yellow
Write-Host "---------------------------------------------" -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri "$EXAMHUB_URL/api/mock-exams/test/basic" `
        -Method Get `
        -ErrorAction Stop
    
    Write-Host "✓ 200 OK - 접근 성공" -ForegroundColor Green
    Write-Host "응답: $($response.message)" -ForegroundColor White
    Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor Gray
} catch {
    Write-Host "✗ 실패: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "테스트 B: 토큰 없이 권한 필요 엔드포인트 호출" -ForegroundColor Yellow
Write-Host "---------------------------------------------" -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri "$EXAMHUB_URL/api/mock-exams/test/detailed" `
        -Method Get `
        -ErrorAction Stop
    
    Write-Host "✓ 200 OK - 접근 성공 (예상하지 못한 결과)" -ForegroundColor Yellow
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 403) {
        Write-Host "✓ 403 Forbidden - 권한 체크 정상 작동" -ForegroundColor Green
        try {
            $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "메시지: $($errorResponse.message)" -ForegroundColor Gray
        } catch {
            Write-Host "메시지: 권한이 없습니다." -ForegroundColor Gray
        }
    } elseif ($statusCode -eq 401) {
        Write-Host "✓ 401 Unauthorized - 인증 체크 정상 작동" -ForegroundColor Green
    } else {
        Write-Host "✗ $statusCode - 예상하지 못한 응답" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Hub에서 JWT 토큰을 발급받으려면:" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Hub에 계정 생성:" -ForegroundColor Yellow
Write-Host '   POST http://localhost:4000/auth/register' -ForegroundColor White
Write-Host '   Body: {"email": "test@test.com", "password": "password123", "username": "testuser"}' -ForegroundColor Gray
Write-Host ""
Write-Host "2. 로그인하여 토큰 받기:" -ForegroundColor Yellow
Write-Host '   POST http://localhost:4000/auth/login/email' -ForegroundColor White
Write-Host '   Body: {"email": "test@test.com", "password": "password123"}' -ForegroundColor Gray
Write-Host ""
Write-Host "3. 받은 토큰으로 test-sso-auth.ps1 실행" -ForegroundColor Yellow
Write-Host ""
Write-Host "또는 Postman/curl로 직접 테스트:" -ForegroundColor Cyan
Write-Host "  curl -H 'Authorization: Bearer YOUR_TOKEN' http://localhost:4003/api/mock-exams/test/detailed" -ForegroundColor White
Write-Host ""
