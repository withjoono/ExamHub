'use client';

/**
 * SSO Handler 컴포넌트
 * 앱 시작 시 SSO 토큰을 처리하고 자동 로그인 수행
 */

import { useEffect, useState } from 'react';
import { processSSOTokens, restoreSession } from '@/lib/auth/sso-receiver';

interface SSOHandlerProps {
  children: React.ReactNode;
}

export function SSOHandler({ children }: SSOHandlerProps) {
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    async function handleAuth() {
      // 먼저 SSO 토큰 처리 시도
      const ssoProcessed = await processSSOTokens();

      // SSO 토큰이 없으면 기존 세션 복원 시도
      if (!ssoProcessed) {
        await restoreSession();
      }

      setIsProcessing(false);
    }

    handleAuth();
  }, []);

  if (isProcessing) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-muted-foreground text-sm">로그인 확인 중...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
