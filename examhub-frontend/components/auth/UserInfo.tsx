'use client';

/**
 * 사용자 정보 표시 컴포넌트
 */

import { useEffect, useState } from 'react';
import { getUser, Member } from '@/lib/auth/sso-receiver';
import { clearTokens } from '@/lib/auth/token-manager';
import { getHubUrl } from '@/lib/auth/hub-login';
import { Button } from '@/components/ui/button';

export function UserInfo() {
  const [user, setUserState] = useState<Member | null>(null);

  useEffect(() => {
    setUserState(getUser());
  }, []);

  const handleLogout = () => {
    clearTokens();
    setUserState(null);
    // 페이지 새로고침하여 상태 초기화
    window.location.reload();
  };

  const goToHub = () => {
    window.location.href = getHubUrl();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        <span className="font-medium">{user.name}</span>
        <span className="text-muted-foreground ml-2">님</span>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={goToHub}>
          거북스쿨
        </Button>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          로그아웃
        </Button>
      </div>
    </div>
  );
}
