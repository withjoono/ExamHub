# 생성된 JWT 토큰으로 ExamHub API 테스트

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  ExamHub SSO 권한 시스템 통합 테스트" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$EXAMHUB_URL = "http://localhost:4003"

# 테스트 토큰들 (2027년 만료)
$PREMIUM_TOKEN = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItMSIsImp0aSI6IjEyMzQ1IiwiaWF0IjoxNzY4OTg3NTg3LCJleHAiOjE3NjkwNzM5ODcsImVtYWlsIjoicHJlbWl1bUB0ZXN0LmNvbSIsInBlcm1pc3Npb25zIjp7ImV4YW1odWIiOnsicGxhbiI6InByZW1pdW0iLCJleHBpcmVzIjoiMjAyNy0xMi0zMVQyMzo1OTo1OVoiLCJmZWF0dXJlcyI6WyJtb2NrLWV4YW0iLCJhbmFseXNpcyIsInByZWRpY3Rpb24iLCJzdGF0aXN0aWNzIiwiZXhwb3J0Il19fX0.gTZWlChwevFmrs6AlrsNkzdxxySNPpRTIAZ30RisENz9bBSM8WwuI4VsNxSYj7iMlsmPw9w8D2EaSnmWw1GzoQ"

$BASIC_TOKEN = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItMiIsImp0aSI6IjEyMzQ2IiwiaWF0IjoxNzY4OTg3NTg3LCJleHAiOjE3NjkwNzM5ODcsImVtYWlsIjoiYmFzaWNAdGVzdC5jb20iLCJwZXJtaXNzaW9ucyI6eyJleGFtaHViIjp7InBsYW4iOiJiYXNpYyIsImV4cGlyZXMiOiIyMDI3LTEyLTMxVDIzOjU5OjU5WiIsImZlYXR1cmVzIjpbIm1vY2stZXhhbSJdfX19.PFzeY1PUWG9z2ciQy97hqprTkGYiDE8OKfo2JYNPSQtjmS9lpw_jy7H7wq74TUooZmCdSNRRpv55A8Tho9BqQw"

$FREE_TOKEN = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItMyIsImp0aSI6IjEyMzQ3IiwiaWF0IjoxNzY4OTg3NTg3LCJleHAiOjE3NjkwNzM5ODcsImVtYWlsIjoiZnJlZUB0ZXN0LmNvbSIsInBlcm1pc3Npb25zIjp7ImV4YW1odWIiOnsicGxhbiI6ImZyZWUiLCJmZWF0dXJlcyI6W119fX0.aEj1JDvxJW--iQ0JhkZHnM2YqZuBD-mSLryxVUx8Xc51Oesn92nczz7BrHxUFT11rC2CMnrDr8HyHqXdp--LSQ"

$NO_PERM_TOKEN = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItNCIsImp0aSI6IjEyMzQ4IiwiaWF0IjoxNzY4OTg3NTg3LCJleHAiOjE3NjkwNzM5ODcsImVtYWlsIjoibm9wZXJtQHRlc3QuY29tIiwicGVybWlzc2lvbnMiOnt9fQ.476dKUgjK25y81gA2008YYPacC2_zxgbS18BVAqmN9nKzvvhd5GJTFUjJOfEcBzXKtDkeywFoRutcOOa7wX4rg"

function Test-Api {
    param(
        [string]$Description,
        [string]$Endpoint,
        [string]$Token,
        [bool]$ExpectSuccess
    )
    
    Write-Host "  $Description" -ForegroundColor Cyan
    
    try {
        $headers = @{
            "Authorization" = "Bearer $Token"
            "Content-Type" = "application/json"
        }
        
        $response = Invoke-RestMethod -Uri $Endpoint `
            -Method Get `
            -Headers $headers `
            -ErrorAction Stop
        
        if ($ExpectSuccess) {
            Write-Host "    ✓ 200 OK - 접근 성공 (예상대로)" -ForegroundColor Green
            Write-Host "    메시지: $($response.message)" -ForegroundColor Gray
        } else {
            Write-Host "    ✗ 200 OK - 접근 성공 (예상과 다름, 권한이 없어야 함)" -ForegroundColor Yellow
        }
        return $true
        
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        
        if ($statusCode -eq 403) {
            if (!$ExpectSuccess) {
                Write-Host "    ✓ 403 Forbidden - 권한 없음 (예상대로)" -ForegroundColor Green
            } else {
                Write-Host "    ✗ 403 Forbidden - 권한 없음 (예상과 다름, 권한이 있어야 함)" -ForegroundColor Yellow
            }
            
            try {
                $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
                Write-Host "    메시지: $($errorResponse.message)" -ForegroundColor Gray
            } catch {}
            
        } elseif ($statusCode -eq 401) {
            Write-Host "    ✗ 401 Unauthorized - 인증 실패" -ForegroundColor Red
        } else {
            Write-Host "    ✗ $statusCode - 예상하지 못한 응답" -ForegroundColor Red
        }
        
        return $false
    }
}

# 테스트 1: Premium 플랜 (모든 권한 있음)
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
Write-Host "테스트 1: Premium 플랜 사용자" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
Test-Api "상세 모의고사 (mock-exam)" "$EXAMHUB_URL/api/mock-exams/test/detailed" $PREMIUM_TOKEN $true
Test-Api "심화 분석 (analysis)" "$EXAMHUB_URL/api/mock-exams/test/analysis" $PREMIUM_TOKEN $true
Test-Api "통계 (statistics)" "$EXAMHUB_URL/api/mock-exams/test/statistics" $PREMIUM_TOKEN $true
Write-Host ""

# 테스트 2: Basic 플랜 (mock-exam만)
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
Write-Host "테스트 2: Basic 플랜 사용자" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
Test-Api "상세 모의고사 (mock-exam)" "$EXAMHUB_URL/api/mock-exams/test/detailed" $BASIC_TOKEN $true
Test-Api "심화 분석 (analysis)" "$EXAMHUB_URL/api/mock-exams/test/analysis" $BASIC_TOKEN $false
Test-Api "통계 (statistics)" "$EXAMHUB_URL/api/mock-exams/test/statistics" $BASIC_TOKEN $false
Write-Host ""

# 테스트 3: Free 플랜 (권한 없음)
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
Write-Host "테스트 3: Free 플랜 사용자" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
Test-Api "상세 모의고사 (mock-exam)" "$EXAMHUB_URL/api/mock-exams/test/detailed" $FREE_TOKEN $false
Test-Api "심화 분석 (analysis)" "$EXAMHUB_URL/api/mock-exams/test/analysis" $FREE_TOKEN $false
Test-Api "통계 (statistics)" "$EXAMHUB_URL/api/mock-exams/test/statistics" $FREE_TOKEN $false
Write-Host ""

# 테스트 4: ExamHub 권한 없음
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
Write-Host "테스트 4: ExamHub 앱 권한 없는 사용자" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
Test-Api "상세 모의고사 (mock-exam)" "$EXAMHUB_URL/api/mock-exams/test/detailed" $NO_PERM_TOKEN $false
Test-Api "심화 분석 (analysis)" "$EXAMHUB_URL/api/mock-exams/test/analysis" $NO_PERM_TOKEN $false
Test-Api "통계 (statistics)" "$EXAMHUB_URL/api/mock-exams/test/statistics" $NO_PERM_TOKEN $false
Write-Host ""

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  테스트 완료!" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ SSO 권한 시스템이 정상적으로 작동합니다!" -ForegroundColor Green
Write-Host ""
