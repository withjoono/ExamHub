# MyExam

> 거북스쿨 모의고사 분석 서비스 - 분리 운영 프로젝트

## 📋 개요

MyExam은 거북스쿨의 **모의고사 분석 서비스**를 분리 운영하기 위한 프로젝트입니다.
메인 서비스(GB-Front, GB-Back-Nest)와 분리되어 독립적으로 개발/배포됩니다.

### 주요 기능

- 📝 **성적 입력**: 모의고사 원점수/표준점수 입력
- 📊 **성적 분석**: 과목별, 조합별 성적 분석
- 🎯 **대학 예측**: 입력된 성적 기반 대학 합격 예측
- 📈 **누적 분석**: 모의고사별 성적 추이 분석
- 🏫 **목표 대학**: 목표 대학 설정 및 등급컷 비교

## 🏗️ 프로젝트 구조

```
MyExam/
├── frontend/              # Next.js 프론트엔드
├── backend/               # NestJS 백엔드
├── shared-packages/       # 공유 패키지 (@geobuk/*)
└── docs/                  # 문서
```

> 📖 상세 아키텍처는 [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) 참조

## 🚀 빠른 시작

### 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

- 로컬 서버: http://localhost:3000

### 백엔드 실행 (예정)

```bash
cd backend
npm install
npm run start:dev
```

- API 서버: http://localhost:4003
- Swagger: http://localhost:4003/api-docs

## 🔧 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React 18, Vite, TanStack Router/Query, Tailwind CSS |
| Backend | NestJS 10, TypeORM, PostgreSQL |
| Auth | JWT (메인 백엔드와 시크릿 공유) |
| Shared | @geobuk/shared-types, @geobuk/shared-entities, @geobuk/common-utils |

## 📚 문서

- [아키텍처 문서](./docs/ARCHITECTURE.md)
- [API 문서](./docs/API.md) (예정)
- [데이터베이스 스키마](./shared-packages/be-shared-packages/docs/be-DATABASE-SCHEMA.md)

## 🔗 관련 프로젝트

- **GB-Front**: 메인 프론트엔드
- **GB-Back-Nest**: 메인 백엔드
- **GB-Back-Planner**: 플래너 서비스

## 📞 문의

프로젝트 관련 문의는 담당자에게 연락하세요.














