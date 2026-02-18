"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowLeft, ChevronDown, Menu, X, Wallet, Bell, Share2, User } from "lucide-react"
import { getUser, cacheUser, clearUserCache, type User as UserType } from "@/lib/auth/user"
import { redirectToHubLogin, getHubUrl, getHubLoginUrl } from "@/lib/auth/hub-login"
import { clearTokens } from "@/lib/auth/token-manager"

interface MenuItem {
  name: string
  href: string
}

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUserState] = useState<UserType | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  useEffect(() => {
    // 비동기로 사용자 정보 가져오기
    async function fetchUser() {
      const userData = await getUser()
      setUserState(userData)
      if (userData) {
        cacheUser(userData) // 캐시에 저장
        return
      }

      // SSO 코드가 URL에 있으면 SSOListener가 처리하도록 대기 (리다이렉트 하지 않음)
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.has('sso_code')) {
        return
      }

      // 토큰이 없고, SSO 자동 로그인을 아직 시도하지 않았으면 Hub으로 리다이렉트
      // sessionStorage로 1회만 시도 (무한 리다이렉트 방지)
      const ssoAttempted = sessionStorage.getItem('examhub_sso_attempted')
      if (!ssoAttempted) {
        sessionStorage.setItem('examhub_sso_attempted', 'true')
        // Hub 로그인 페이지로 이동 (이미 Hub에 로그인되어 있으면 자동으로 SSO 코드 생성 후 복귀)
        // getHubLoginUrl()은 내부적으로 redirect_uri를 포함함
        window.location.href = getHubLoginUrl(window.location.pathname)
      }
    }
    fetchUser()
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogin = () => {
    redirectToHubLogin(window.location.pathname)
  }

  const handleLogout = () => {
    clearTokens()
    clearUserCache()
    setUserState(null)
    window.location.reload()
  }

  const goToHub = () => {
    window.location.href = getHubUrl()
  }

  // ExamHub 메뉴 항목
  const menuItems: MenuItem[] = [
    { name: "ExamHub 홈", href: "/" },
    { name: "입력", href: "/main/input" },
    { name: "성적분석", href: "/main/score-analysis" },
    { name: "대학예측", href: "/main/prediction" },
    { name: "누적분석", href: "/main/statistics" },
    { name: "분석과 오답", href: "/main/management" },
    { name: "목표대학", href: "/main/target-university" },
    { name: "오답노트", href: "/main/wrong-answers" },
  ]

  return (
    <nav className="gb-header" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.92)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Left Section - Logo & Title */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2" style={{ textDecoration: 'none' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-primary)' }}>
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-[15px] font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>ExamHub</span>
            </Link>
          </div>

          {/* Center Section - Navigation Menu (Desktop) */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* 전체 서비스 링크 */}
            <button
              onClick={goToHub}
              className="gb-header-nav-link" style={{ color: 'var(--color-primary)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>전체 서비스</span>
            </button>

            <div className="w-px h-5 bg-gray-200 mx-2" />

            {/* 메뉴 항목들 */}
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="gb-header-nav-link"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Section - Icons & Login (Desktop) */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* 결제 아이콘 */}
            <button
              className="p-2 text-gray-500 hover:text-[#7b1e7a] hover:bg-gray-50 rounded-full transition-colors"
              title="결제"
            >
              <Wallet className="w-5 h-5" />
            </button>

            {/* 알림 아이콘 */}
            <button
              className="p-2 text-gray-500 hover:text-[#7b1e7a] hover:bg-gray-50 rounded-full transition-colors relative"
              title="알림"
            >
              <Bell className="w-5 h-5" />
              {/* 알림 뱃지 (필요시) */}
              {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /> */}
            </button>

            {/* 공유 아이콘 */}
            <button
              className="p-2 text-gray-500 hover:text-[#7b1e7a] hover:bg-gray-50 rounded-full transition-colors"
              title="공유"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* 로그인/사용자 메뉴 */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={goToHub}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      거북스쿨
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="gb-btn gb-btn-primary gb-btn-sm" style={{ borderRadius: '9999px' }}
              >
                로그인
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* 모바일 아이콘들 */}
            <button
              className="p-2 text-gray-500 hover:text-[#7b1e7a]"
              title="알림"
            >
              <Bell className="w-5 h-5" />
            </button>

            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-[#7b1e7a] p-2"
              aria-label="메뉴 열기"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* 전체 서비스 */}
              <button
                onClick={goToHub}
                className="flex items-center space-x-2 w-full px-3 py-2 text-base text-gray-600 hover:text-[#7b1e7a] hover:bg-gray-50 rounded-md"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>전체 서비스</span>
              </button>

              <div className="border-t border-gray-100 my-2" />

              {/* 메뉴 항목들 */}
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base text-gray-700 hover:text-[#7b1e7a] hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="border-t border-gray-100 my-2" />

              {/* 모바일 추가 메뉴 */}
              <div className="flex items-center space-x-4 px-3 py-2">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-[#7b1e7a]">
                  <Wallet className="w-5 h-5" />
                  <span className="text-sm">결제</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-[#7b1e7a]">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm">공유</span>
                </button>
              </div>

              {/* 로그인/로그아웃 */}
              <div className="pt-2">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-700">
                      <span className="font-medium">{user.name}</span>님
                    </div>
                    <button
                      onClick={goToHub}
                      className="w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                    >
                      거북스쿨
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="w-full bg-[#7b1e7a] hover:bg-[#5a1559] text-white px-4 py-2 rounded-full text-sm font-medium"
                  >
                    로그인
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
