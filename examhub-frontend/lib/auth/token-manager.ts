/**
 * 토큰 관리 유틸리티
 * SSO 토큰 저장, 조회, 삭제 관리
 */

const ACCESS_TOKEN_KEY = 'examhub_access_token';
const REFRESH_TOKEN_KEY = 'examhub_refresh_token';
const TOKEN_EXPIRY_KEY = 'examhub_token_expiry';

/**
 * 토큰 저장
 * @param accessToken - 액세스 토큰
 * @param refreshToken - 리프레시 토큰
 * @param expiresIn - 만료 시간(초)
 */
export function setTokens(
  accessToken: string,
  refreshToken: string,
  expiresIn: number = 7200
): void {
  if (typeof window === 'undefined') return;

  const expiryTime = Date.now() + expiresIn * 1000;

  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiryTime));
}

/**
 * 액세스 토큰 조회
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * 리프레시 토큰 조회
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * 토큰 만료 여부 확인
 */
export function isTokenExpired(): boolean {
  if (typeof window === 'undefined') return true;

  const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiryTime) return true;

  return Date.now() > parseInt(expiryTime, 10);
}

/**
 * 토큰 삭제 (로그아웃)
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

/**
 * 토큰 존재 여부 확인
 */
export function hasTokens(): boolean {
  return !!getAccessToken() && !!getRefreshToken();
}
