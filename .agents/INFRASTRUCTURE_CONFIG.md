# ExamHub Infrastructure Configuration

> [!CAUTION]
> **이 파일의 설정값은 확정된 프로덕션 인프라 설정입니다.**
> **아래 값들을 수정하려면 반드시 사용자의 명시적 허락을 먼저 받아야 합니다.**
> 자동으로 변경하거나, 다른 작업 중 부수적으로 수정하는 것을 금지합니다.

## GCP / Firebase

| 항목 | 값 |
|---|---|
| GCP 계정 | `geobukacademy@gmail.com` |
| 백엔드 GCP 프로젝트 | `ts-back-nest-479305` |
| 프론트엔드 GCP 프로젝트 | `ts-front-479305` |
| Cloud SQL 인스턴스 | `ts-back-nest-479305:asia-northeast3:geobuk-db` |
| DB 이름 | `geobukschool_prod` |
| DB 스키마 | `examhub` |

## 배포

| 항목 | 값 |
|---|---|
| GitHub 저장소 | `withjoono/ExamHub` |
| 백엔드 App Engine 서비스 | `examhub-backend` |
| 프론트엔드 Firebase 호스팅 사이트 | `examhub-front` |
| 프론트엔드 기본 URL | `https://examhub-front.web.app` |
| 프론트엔드 커스텀 도메인 | `https://examhub.kr` |
| 백엔드 URL | `https://examhub-backend-dot-ts-back-nest-479305.du.r.appspot.com` |

## 포트 (로컬 개발)

| 항목 | 포트 |
|---|---|
| 프론트엔드 | `3003` |
| 백엔드 | `4003` |

## DB 테이블 prefix

| 항목 | 값 |
|---|---|
| ExamHub 테이블 | `eh_` |
