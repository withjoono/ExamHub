---
description: ExamHub 인프라 설정 보호 규칙
---

# ExamHub Infrastructure Protection Rule

## 보호 대상 파일
- `.agents/INFRASTRUCTURE_CONFIG.md` — 확정된 프로덕션 인프라 설정

## 규칙

1. **INFRASTRUCTURE_CONFIG.md에 명시된 값을 변경하는 작업 전에, 반드시 사용자에게 허락을 받아야 합니다.**
2. 해당되는 변경 사항:
   - `.firebaserc`의 프로젝트 ID 또는 호스팅 사이트명 변경
   - `app.yaml`의 GCP 프로젝트, Cloud SQL 인스턴스, DB 이름 변경
   - `main.ts`의 CORS origin 중 Firebase/Production URL 변경
   - `schema.prisma`의 DB 스키마 또는 테이블 prefix 변경
   - 로컬 개발 포트 변경 (프론트 3003, 백엔드 4003)
   - 배포 대상 변경 (GCP 계정, 프로젝트, 서비스명)
3. 변경이 필요한 경우, 먼저 `.agents/INFRASTRUCTURE_CONFIG.md`를 읽고 현재 값을 확인한 뒤 사용자에게 변경 이유와 함께 허락을 요청합니다.
