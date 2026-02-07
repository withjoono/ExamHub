#!/bin/bash

# ExamHub Firebase 배포 스크립트

echo "🚀 ExamHub Firebase 배포를 시작합니다..."

# 프로젝트 루트 확인
if [ ! -f "firebase.json" ]; then
  echo "❌ firebase.json 파일을 찾을 수 없습니다. 프로젝트 루트에서 실행해주세요."
  exit 1
fi

# Firebase 로그인 확인
if ! firebase projects:list > /dev/null 2>&1; then
  echo "❌ Firebase 로그인이 필요합니다."
  echo "다음 명령어로 로그인해주세요: firebase login"
  exit 1
fi

# 현재 프로젝트 확인
echo "📋 현재 Firebase 프로젝트:"
firebase use

read -p "이 프로젝트에 배포하시겠습니까? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "배포를 취소했습니다."
  exit 0
fi

# 프론트엔드 빌드
echo ""
echo "🔨 프론트엔드 빌드 중..."
cd frontend
npm run build:firebase

if [ $? -ne 0 ]; then
  echo "❌ 프론트엔드 빌드에 실패했습니다."
  exit 1
fi

cd ..

# Firebase 배포
echo ""
echo "☁️  Firebase Hosting에 배포 중..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ 배포가 완료되었습니다!"
  echo "🌐 배포된 사이트를 확인하세요."
else
  echo "❌ 배포에 실패했습니다."
  exit 1
fi


















