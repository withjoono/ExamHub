/**
 * Hub 로그인 연동 유틸리티
 * ExamHub에서 Hub(거북스쿨) 로그인 페이지로 리디렉트
 */

// Hub Frontend URL (환경 변수 또는 기본값)
const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || (
  process.env.NODE_ENV === 'production'
    ? 'https://geobukschool.kr'
    : 'http://localhost:5173'
);

// ExamHub Frontend URL
const FRONT_URL = process.env.NEXT_PUBLIC_FRONT_URL || (
  typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3005'
);

/**
 * Hub 로그인 URL 생성
 * 로그인 후 ExamHub로 SSO 토큰과 함께 돌아옴
 * @param returnPath - 로그인 후 돌아올 경로 (기본: /)
 */
export function getHubLoginUrl(returnPath: string = '/'): string {
  const frontUrl = typeof window !== 'undefined' ? window.location.origin : FRONT_URL;
  const redirectUri = `${frontUrl}${returnPath}`;

  return `${HUB_URL}/auth/login?redirect_uri=${encodeURIComponent(redirectUri)}`;
}

/**
 * Hub 회원가입 URL 생성
 * @param returnPath - 회원가입 후 돌아올 경로 (기본: /)
 */
export function getHubRegisterUrl(returnPath: string = '/'): string {
  const frontUrl = typeof window !== 'undefined' ? window.location.origin : FRONT_URL;
  const redirectUri = `${frontUrl}${returnPath}`;

  return `${HUB_URL}/auth/register?redirect_uri=${encodeURIComponent(redirectUri)}`;
}

/**
 * Hub 로그인 페이지로 리디렉트
 */
export function redirectToHubLogin(returnPath?: string): void {
  if (typeof window === 'undefined') return;
  window.location.href = getHubLoginUrl(returnPath);
}

/**
 * Hub 회원가입 페이지로 리디렉트
 */
export function redirectToHubRegister(returnPath?: string): void {
  if (typeof window === 'undefined') return;
  window.location.href = getHubRegisterUrl(returnPath);
}

/**
 * Hub 메인 페이지로 이동
 */
export function redirectToHub(): void {
  if (typeof window === 'undefined') return;
  window.location.href = HUB_URL;
}

/**
 * Hub URL 반환
 */
export function getHubUrl(): string {
  return HUB_URL;
}
