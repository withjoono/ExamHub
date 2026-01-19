/**
 * SSO 토큰 수신기
 * Hub에서 전달받은 SSO 토큰을 처리하여 자동 로그인
 */

import { setTokens, clearTokens } from './token-manager';

/**
 * JWT 토큰에서 만료 시간(exp) 추출
 * @param token - JWT 토큰
 * @returns 만료까지 남은 시간 (초) 또는 기본값 (1시간)
 */
function getTokenExpirySeconds(token: string): number {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    if (decoded.exp) {
      // exp는 Unix timestamp (초)
      const expiresInSeconds = decoded.exp - Math.floor(Date.now() / 1000);
      return expiresInSeconds > 0 ? expiresInSeconds : 3600;
    }
  } catch (error) {
    console.warn('JWT 토큰 디코딩 실패, 기본 만료 시간 사용');
  }
  // 기본값: 1시간
  return 3600;
}

// Hub Backend API URL (인증 API)
const HUB_API_URL = process.env.NEXT_PUBLIC_HUB_API_URL || (
  process.env.NODE_ENV === 'production'
    ? 'https://ts-back-nest-479305.du.r.appspot.com'
    : 'http://localhost:4000'
);

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Member {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
  role: string;
  createdAt: string;
}

// 간단한 전역 상태 (필요 시 zustand 등으로 교체 가능)
let currentUser: Member | null = null;

export function getUser(): Member | null {
  return currentUser;
}

export function setUser(user: Member | null): void {
  currentUser = user;
}

/**
 * URL에서 SSO 토큰을 추출하고 처리
 * @returns SSO 토큰이 처리되었으면 true, 아니면 false
 */
export async function processSSOTokens(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const url = new URL(window.location.href);
  const accessToken = url.searchParams.get('sso_access_token');
  const refreshToken = url.searchParams.get('sso_refresh_token');

  // SSO 토큰이 없으면 처리하지 않음
  if (!accessToken || !refreshToken) {
    return false;
  }

  try {
    // JWT에서 실제 만료 시간 추출
    const expirySeconds = getTokenExpirySeconds(accessToken);

    // 토큰 저장
    setTokens(accessToken, refreshToken, expirySeconds);

    // 사용자 정보 조회하여 토큰 유효성 확인
    const meResponse = await fetch(`${HUB_API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!meResponse.ok) {
      throw new Error('사용자 정보 조회 실패');
    }

    const json: ApiResponse<Member> = await meResponse.json();

    if (!json.success || !json.data) {
      throw new Error('사용자 정보가 없습니다');
    }

    // 사용자 정보 저장
    setUser(json.data);

    // URL에서 토큰 제거 (브라우저 히스토리에서 숨김)
    url.searchParams.delete('sso_access_token');
    url.searchParams.delete('sso_refresh_token');
    window.history.replaceState({}, '', url.toString());

    console.log('SSO 로그인 성공:', json.data.name);
    return true;
  } catch (error) {
    console.error('SSO 토큰 검증 실패:', error);
    // 유효하지 않은 토큰 정리
    clearTokens();
    setUser(null);

    // URL에서 토큰 제거
    url.searchParams.delete('sso_access_token');
    url.searchParams.delete('sso_refresh_token');
    window.history.replaceState({}, '', url.toString());

    return false;
  }
}

/**
 * 저장된 토큰으로 사용자 정보 복원 시도
 */
export async function restoreSession(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const accessToken = localStorage.getItem('examhub_access_token');
  if (!accessToken) return false;

  try {
    const meResponse = await fetch(`${HUB_API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!meResponse.ok) {
      throw new Error('세션 복원 실패');
    }

    const json: ApiResponse<Member> = await meResponse.json();

    if (!json.success || !json.data) {
      throw new Error('사용자 정보가 없습니다');
    }

    setUser(json.data);
    return true;
  } catch (error) {
    console.error('세션 복원 실패:', error);
    clearTokens();
    setUser(null);
    return false;
  }
}
