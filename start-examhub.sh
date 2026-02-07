#!/bin/bash

# ExamHub 서버 자동 시작 스크립트
# 포트: Frontend 3003, Backend 4003

echo "====================================="
echo "  ExamHub 서버 시작 스크립트"
echo "  Frontend: http://localhost:3003"
echo "  Backend:  http://localhost:4003"
echo "  API Docs: http://localhost:4003/api-docs"
echo "====================================="
echo ""

# 포트 정리 함수
stop_port_process() {
    local PORT=$1
    echo "포트 $PORT 확인 중..."

    if command -v lsof &> /dev/null; then
        # macOS/Linux with lsof
        PID=$(lsof -ti:$PORT)
        if [ ! -z "$PID" ]; then
            echo "  포트 $PORT 사용 중인 프로세스 종료: PID $PID"
            kill -9 $PID 2>/dev/null
            sleep 0.5
            echo "  프로세스 $PID 종료됨"
        else
            echo "  포트 $PORT 사용 가능"
        fi
    else
        # Linux without lsof
        PID=$(netstat -nlp 2>/dev/null | grep ":$PORT " | awk '{print $7}' | cut -d'/' -f1)
        if [ ! -z "$PID" ]; then
            echo "  포트 $PORT 사용 중인 프로세스 종료: PID $PID"
            kill -9 $PID 2>/dev/null
            sleep 0.5
            echo "  프로세스 $PID 종료됨"
        else
            echo "  포트 $PORT 사용 가능"
        fi
    fi
}

# PostgreSQL 확인
echo ""
echo "[1/5] PostgreSQL 데이터베이스 확인..."
if lsof -i:5433 &> /dev/null || netstat -an 2>/dev/null | grep -q ":5433 "; then
    echo "  ✓ PostgreSQL 실행 중 (포트 5433)"
else
    echo "  ✗ PostgreSQL이 실행되지 않았습니다!"
    echo "    포트 5433에서 PostgreSQL을 실행해주세요."
    exit 1
fi

# 포트 정리
echo ""
echo "[2/5] 포트 정리 중..."
stop_port_process 3003
stop_port_process 4003

# 백엔드 시작
echo ""
echo "[3/5] 백엔드 서버 시작 중..."
BACKEND_PATH="$(dirname "$0")/examhub-backend"
if [ -d "$BACKEND_PATH" ]; then
    # macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e "tell application \"Terminal\" to do script \"cd '$BACKEND_PATH' && echo 'ExamHub Backend Starting...' && npm run start:dev\""
    # Linux with gnome-terminal
    elif command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd '$BACKEND_PATH' && echo 'ExamHub Backend Starting...' && npm run start:dev; exec bash"
    # Linux with xterm
    elif command -v xterm &> /dev/null; then
        xterm -e "cd '$BACKEND_PATH' && echo 'ExamHub Backend Starting...' && npm run start:dev; exec bash" &
    else
        echo "  ⚠ 새 터미널을 열 수 없습니다. 수동으로 실행하세요:"
        echo "    cd $BACKEND_PATH && npm run start:dev"
    fi
    echo "  백엔드 서버 시작됨"
else
    echo "  ✗ 백엔드 디렉토리를 찾을 수 없습니다: $BACKEND_PATH"
    exit 1
fi

# 백엔드 준비 대기
echo ""
echo "[4/5] 백엔드 컴파일 대기 중..."
MAX_WAIT=30
WAITED=0
BACKEND_READY=false

while [ $WAITED -lt $MAX_WAIT ]; do
    sleep 2
    WAITED=$((WAITED + 2))

    if lsof -i:4003 &> /dev/null || netstat -an 2>/dev/null | grep -q ":4003 "; then
        echo "  ✓ 백엔드 서버 준비 완료 ($WAITED 초)"
        BACKEND_READY=true
        break
    fi
    echo "  대기 중... ($WAITED/$MAX_WAIT 초)"
done

if [ "$BACKEND_READY" = false ]; then
    echo "  ⚠ 백엔드 서버가 시간 내에 시작되지 않았습니다."
    echo "    백엔드 터미널을 확인하거나 수동으로 재시작하세요."
fi

# 프론트엔드 시작
echo ""
echo "[5/5] 프론트엔드 서버 시작 중..."
FRONTEND_PATH="$(dirname "$0")/examhub-frontend"
if [ -d "$FRONTEND_PATH" ]; then
    # macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e "tell application \"Terminal\" to do script \"cd '$FRONTEND_PATH' && echo 'ExamHub Frontend Starting...' && npm run dev\""
    # Linux with gnome-terminal
    elif command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd '$FRONTEND_PATH' && echo 'ExamHub Frontend Starting...' && npm run dev; exec bash"
    # Linux with xterm
    elif command -v xterm &> /dev/null; then
        xterm -e "cd '$FRONTEND_PATH' && echo 'ExamHub Frontend Starting...' && npm run dev; exec bash" &
    else
        echo "  ⚠ 새 터미널을 열 수 없습니다. 수동으로 실행하세요:"
        echo "    cd $FRONTEND_PATH && npm run dev"
    fi
    echo "  프론트엔드 서버 시작됨"
else
    echo "  ✗ 프론트엔드 디렉토리를 찾을 수 없습니다: $FRONTEND_PATH"
    exit 1
fi

# 완료 메시지
echo ""
echo "====================================="
echo "  ✓ ExamHub 서버 시작 완료!"
echo "====================================="
echo ""
echo "서비스 접속:"
echo "  • 프론트엔드: http://localhost:3003"
echo "  • 백엔드 API: http://localhost:4003"
echo "  • API 문서:   http://localhost:4003/api-docs"
echo ""
echo "서버를 종료하려면 각 터미널에서 Ctrl+C를 누르세요."
echo ""
