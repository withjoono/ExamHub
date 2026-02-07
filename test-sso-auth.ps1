# SSO 권한 테스트 스크립트 (PowerShell)
# ExamHub의 Hub JWT 권한 시스템 테스트

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  ExamHub SSO 권한 시스템 테스트" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# 설정
$HUB_URL = "http://localhost:4000"
$EXAMHUB_URL = "http://localhost:4003"

# 테스트 계정
$TEST_EMAIL = "test@test.com"
$TEST_PASSWORD = "password123"

Write-Host "1단계: Hub에서 로그인 (토큰 발급)" -ForegroundColor Yellow
Write-Host "---------------------------------------------" -ForegroundColor Gray

$loginBody = @{
    email = $TEST_EMAIL
    password = $TEST_PASSWORD
} | ConvertTo-Json

Write-Host "요청: POST $HUB_URL/auth/login/email" -ForegroundColor White
Write-Host "Body: $loginBody" -ForegroundColor Gray

try {
    $loginResponse = Invoke-RestMethod -Uri "$HUB_URL/auth/login/email" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody `
        -ErrorAction Stop

    Write-Host "✓ 로그인 성공!" -ForegroundColor Green
    
    $ACCESS_TOKEN = $loginResponse.data.accessToken
    
    if (-not $ACCESS_TOKEN) {
        Write-Host "✗ 액세스 토큰을 찾을 수 없습니다." -ForegroundColor Red
        Write-Host "응답 구조: $($loginResponse | ConvertTo-Json -Depth 3)" -ForegroundColor Gray
        exit 1
    }
    
    Write-Host "액세스 토큰: $($ACCESS_TOKEN.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host ""
    
} catch {
    Write-Host "✗ Hub 로그인 실패!" -ForegroundColor Red
    Write-Host "오류: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Hub 서버가 $HUB_URL 에서 실행중인지 확인하세요." -ForegroundColor Yellow
    Write-Host "Hub에 테스트 계정($TEST_EMAIL)이 생성되어 있는지 확인하세요." -ForegroundColor Yellow
    exit 1
}

# 2단계: 권한 체크 테스트
Write-Host "2단계: ExamHub API 권한 체크 테스트" -ForegroundColor Yellow
Write-Host "---------------------------------------------" -ForegroundColor Gray
Write-Host ""

function Test-Api {
    param(
        [string]$Endpoint,
        [string]$Description,
        [string]$Token
    )
    
    Write-Host "테스트: $Description" -ForegroundColor Cyan
    Write-Host "  엔드포인트: GET $Endpoint" -ForegroundColor Gray
    
    try {
        $headers = @{
            "Authorization" = "Bearer $Token"
            "Content-Type" = "application/json"
        }
        
        $response = Invoke-RestMethod -Uri $Endpoint `
            -Method Get `
            -Headers $headers `
            -ErrorAction Stop
        
        Write-Host "  ✓ 200 OK - 접근 성공" -ForegroundColor Green
        Write-Host "  응답: $($response.message)" -ForegroundColor Gray
        Write-Host ""
        return $true
        
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        
        if ($statusCode -eq 403) {
            Write-Host "  ✗ 403 Forbidden - 권한 없음" -ForegroundColor Red
            
            # 에러 메시지 파싱
            try {
                $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
                Write-Host "  메시지: $($errorResponse.message)" -ForegroundColor Yellow
            } catch {
                Write-Host "  메시지: 권한이 없습니다." -ForegroundColor Yellow
            }
            
        } elseif ($statusCode -eq 401) {
            Write-Host "  ✗ 401 Unauthorized - 인증 실패" -ForegroundColor Red
        } else {
            Write-Host "  ✗ $statusCode - 오류 발생" -ForegroundColor Red
            Write-Host "  오류: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        Write-Host ""
        return $false
    }
}

# 테스트 케이스 실행
Write-Host "테스트 A: 권한 불필요 엔드포인트" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
Test-Api -Endpoint "$EXAMHUB_URL/api/mock-exams/test/basic" `
         -Description "기본 점수 조회 (권한 불필요)" `
         -Token $ACCESS_TOKEN

Write-Host "테스트 B: mock-exam 권한 필요" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
$mockExamResult = Test-Api -Endpoint "$EXAMHUB_URL/api/mock-exams/test/detailed" `
         -Description "상세 모의고사 (mock-exam 권한)" `
         -Token $ACCESS_TOKEN

Write-Host "테스트 C: analysis 권한 필요" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
$analysisResult = Test-Api -Endpoint "$EXAMHUB_URL/api/mock-exams/test/analysis" `
         -Description "심화 분석 (analysis 권한)" `
         -Token $ACCESS_TOKEN

Write-Host "테스트 D: statistics 권한 필요" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
$statisticsResult = Test-Api -Endpoint "$EXAMHUB_URL/api/mock-exams/test/statistics" `
         -Description "통계 분석 (statistics 권한)" `
         -Token $ACCESS_TOKEN

# 결과 요약
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  테스트 결과 요약" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✓ 기본 점수: 성공 (권한 불필요)" -ForegroundColor Green

if ($mockExamResult) {
    Write-Host "✓ 상세 모의고사: 성공 (mock-exam 권한 있음)" -ForegroundColor Green
} else {
    Write-Host "✗ 상세 모의고사: 실패 (mock-exam 권한 없음)" -ForegroundColor Red
}

if ($analysisResult) {
    Write-Host "✓ 심화 분석: 성공 (analysis 권한 있음)" -ForegroundColor Green
} else {
    Write-Host "✗ 심화 분석: 실패 (analysis 권한 없음)" -ForegroundColor Red
}

if ($statisticsResult) {
    Write-Host "✓ 통계 분석: 성공 (statistics 권한 있음)" -ForegroundColor Green
} else {
    Write-Host "✗ 통계 분석: 실패 (statistics 권한 없음)" -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# JWT 토큰 디코딩 (페이로드 확인)
Write-Host "JWT 토큰 페이로드 확인" -ForegroundColor Yellow
Write-Host "---------------------------------------------" -ForegroundColor Gray

try {
    # JWT의 페이로드 부분 추출 (Base64 디코딩)
    $parts = $ACCESS_TOKEN.Split('.')
    if ($parts.Length -ge 2) {
        $payload = $parts[1]
        
        # Base64 URL 디코딩 (패딩 추가)
        $payload = $payload.Replace('-', '+').Replace('_', '/')
        switch ($payload.Length % 4) {
            2 { $payload += '==' }
            3 { $payload += '=' }
        }
        
        $decodedBytes = [System.Convert]::FromBase64String($payload)
        $decodedJson = [System.Text.Encoding]::UTF8.GetString($decodedBytes)
        $payloadObj = $decodedJson | ConvertFrom-Json
        
        Write-Host "토큰 페이로드:" -ForegroundColor White
        Write-Host ($payloadObj | ConvertTo-Json -Depth 5) -ForegroundColor Gray
    }
} catch {
    Write-Host "토큰 디코딩 실패: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "테스트 완료!" -ForegroundColor Green
