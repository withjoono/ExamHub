"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { setTokens, getAccessToken } from "@/lib/auth/token-manager"
import { api } from "@/lib/api/client"
import { hubApi } from "@/lib/api/hub-client"
import {
  FileText,
  BarChart3,
  GraduationCap,
  TrendingUp,
  Target,
  BookX,
  ClipboardList,
  Zap,
  Users,
  Trophy,
  Star,
  Crown,
  School,
  BookOpen,
  PenTool,
  Award,
  ChevronRight,
  Swords,
  UserPlus,
  Lock
} from "lucide-react"

function LandingPage({ hubLoginUrl }: { hubLoginUrl?: string }) {
  const loginLink = hubLoginUrl || "/login";

  const examTypes = [
    { title: "교육청/평가원/수능", description: "공식 모의고사 및 수능 성적 분석", icon: FileText, color: "bg-blue-500" },
    { title: "사설 모의고사", description: "메가스터디, 대성, 이투스 등 사설 모의고사", icon: BookOpen, color: "bg-purple-500" },
    { title: "학원/과외 테스트", description: "학원 및 과외 시험 성적 관리", icon: PenTool, color: "bg-green-500" },
    { title: "내신", description: "학교 내신 성적 분석 및 관리", icon: Award, color: "bg-orange-500" },
    { title: "경쟁", description: "친구들과 함께하는 모의고사 배틀", icon: Swords, color: "bg-red-500" },
  ]

  const freeFeatures = [
    { title: "자동 채점", description: "OMR 답안 입력만으로 자동 채점 및 성적 분석", icon: Zap },
    { title: "취약 범위 분석", description: "과목별 취약 단원 및 유형 자동 분석", icon: Target },
    { title: "성적 추이", description: "시험별 성적 변화 추이 그래프 제공", icon: TrendingUp },
    { title: "오답 관리", description: "틀린 문제 자동 저장 및 복습 관리", icon: BookX },
    { title: "모의고사 배틀", description: "친구들과 점수 비교 및 랭킹 경쟁", icon: Swords },
  ]

  const premiumFeatures = [
    { title: "대학 예측", description: "성적 기반 합격 가능 대학 예측 서비스", icon: GraduationCap },
    { title: "오답 관리 프리미엄", description: "AI 기반 오답 분석 및 맞춤 학습 추천", icon: Star },
    { title: "목표 대학 비교", description: "목표 대학 등급컷과 내 성적 실시간 비교", icon: Target },
    { title: "배틀 프리미엄", description: "전국 단위 랭킹 및 상위권 학생 비교 분석", icon: Trophy },
    { title: "마이 그룹", description: "스터디 그룹 생성 및 그룹 내 성적 비교", icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#9c3d9a] to-[#5a1559] rounded-xl flex items-center justify-center shadow-lg shadow-[#d4a5d3]">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Exam</h1>
                <p className="text-xs text-gray-500">모의고사 분석 서비스</p>
              </div>
            </div>
            <Link href={loginLink} className="px-4 py-2 bg-[#7b1e7a] text-white rounded-lg hover:bg-[#5a1559] transition-colors">로그인</Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            내가 푼, 쪽지 시험의 단 한 문제도<br /><span className="text-[#7b1e7a]">이제는 버리는 일이 없도록!</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            교육청, 평가원, 수능, 사설 모의고사부터 학원/과외 시험, 내신까지<br className="hidden md:block" />모든 시험을 한 곳에서 관리하고 분석하세요.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {examTypes.map((exam) => (
            <Link key={exam.title} href="/my-exam" className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 text-center cursor-pointer">
              <div className={`w-12 h-12 ${exam.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                <exam.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{exam.title}</h3>
              <p className="text-xs text-gray-500">{exam.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">무료 기능</span>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">기본 기능은 <span className="text-green-600">무료</span>로 제공됩니다</h3>
            <p className="text-gray-600">회원가입만 하면 바로 사용할 수 있어요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {freeFeatures.map((feature) => (
              <div key={feature.title} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-200">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-[#7b1e7a]/5 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1 bg-[#7b1e7a]/10 text-[#7b1e7a] rounded-full text-sm font-medium mb-4">
              <Crown className="w-4 h-4" />My Exam 멤버십
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">프리미엄 기능으로 <span className="text-[#7b1e7a]">성적 향상</span>을 경험하세요</h3>
            <p className="text-gray-600">더 정밀한 분석과 맞춤형 학습 추천을 제공합니다</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {premiumFeatures.map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl p-6 border border-[#7b1e7a]/20 hover:border-[#7b1e7a]/40 transition-colors shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-[#9c3d9a] to-[#5a1559] rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-[#d4a5d3]/30">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12 border border-amber-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200/30 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-amber-500/20 text-amber-700 rounded-full text-sm font-medium mb-4">
                <School className="w-4 h-4" />거북스쿨 멤버십
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">거북스쿨 회원이신가요?</h3>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                거북스쿨 멤버십 회원은 My Exam의 모든 프리미엄 기능을<br className="hidden md:block" />추가 비용 없이 무료로 이용할 수 있습니다.
              </p>
              <Link href="/membership/gobook" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-medium shadow-lg shadow-amber-200">
                <School className="w-5 h-5" />거북스쿨 멤버십 연동하기<ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-[#7b1e7a] to-[#5a1559]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">성공하는 학생들의 선택, 당신 차례입니다</h3>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">지금 바로 시작하고 체계적인 성적 관리를 경험하세요.<br />기본 기능은 완전 무료입니다.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/my-exam" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#7b1e7a] rounded-xl hover:bg-gray-100 transition-colors font-semibold shadow-lg">
              <UserPlus className="w-5 h-5" />무료로 시작하기
            </Link>
            <Link href={loginLink} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/30 rounded-xl hover:bg-white/20 transition-colors font-semibold">
              이미 계정이 있으신가요?<ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>© 2025 My Exam by 거북스쿨. 모의고사 분석 서비스</p>
        </div>
      </footer>
    </div>
  )
}

function Dashboard() {
  const quickMenus = [
    { title: "성적 입력", href: "/my-exam/input", icon: FileText, color: "bg-[#7b1e7a]" },
    { title: "성적 분석", href: "/my-exam/analysis", icon: BarChart3, color: "bg-blue-500" },
    { title: "대학 예측", href: "/my-exam/prediction", icon: GraduationCap, color: "bg-green-500" },
    { title: "오답 노트", href: "/my-exam/wrong-answers", icon: BookX, color: "bg-red-500" },
  ]

  const allMenus = [
    { title: "모의고사 입력", description: "모의고사 점수 및 답안 입력", href: "/my-exam/input", icon: FileText, color: "bg-[#7b1e7a]" },
    { title: "성적 분석", description: "과목별 성적 분석 및 비교", href: "/my-exam/analysis", icon: BarChart3, color: "bg-blue-500" },
    { title: "대학 예측", description: "합격 가능한 대학 예측", href: "/my-exam/prediction", icon: GraduationCap, color: "bg-green-500" },
    { title: "성적 추이", description: "시험별 성적 변화 분석", href: "/my-exam/statistics", icon: TrendingUp, color: "bg-purple-500" },
    { title: "목표 대학", description: "목표 대학 등급컷 확인", href: "/my-exam/target", icon: Target, color: "bg-pink-500" },
    { title: "오답 노트", description: "틀린 문제 분석 및 정리", href: "/my-exam/wrong-answers", icon: BookX, color: "bg-red-500" },
    { title: "모의고사 배틀", description: "친구들과 점수 비교 경쟁", href: "/my-exam/battle", icon: Swords, color: "bg-orange-500" },
    { title: "마이 그룹", description: "스터디 그룹 관리", href: "/my-exam/group", icon: Users, color: "bg-indigo-500" },
  ]

  const getDDay = () => {
    const today = new Date()
    const year = today.getMonth() >= 11 ? today.getFullYear() + 1 : today.getFullYear()
    const suneung = new Date(year, 10, 13)
    const diff = Math.ceil((suneung.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#9c3d9a] to-[#5a1559] rounded-xl flex items-center justify-center shadow-lg shadow-[#d4a5d3]">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Exam</h1>
                <p className="text-xs text-gray-500">모의고사 분석 서비스</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">수능까지</p>
                <p className="text-lg font-bold text-[#7b1e7a]">D-{getDDay()}</p>
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Lock className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-[#7b1e7a] to-[#9c3d9a] rounded-2xl p-6 md:p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">안녕하세요! 👋</h2>
              <p className="text-white/80">오늘도 열심히 공부하고 계시네요. 화이팅!</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
              <span className="text-white/80">수능까지</span>
              <span className="text-2xl font-bold">D-{getDDay()}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 메뉴</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickMenus.map((menu) => (
              <Link key={menu.href} href={menu.href} className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center">
                <div className={`w-12 h-12 ${menu.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                  <menu.icon className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-gray-900">{menu.title}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">최근 시험</h3>
            <Link href="/my-exam/history" className="text-sm text-[#7b1e7a] hover:underline">전체보기</Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="text-center text-gray-500 py-8">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>아직 입력된 시험이 없습니다</p>
              <Link href="/my-exam/input" className="inline-block mt-4 px-4 py-2 bg-[#7b1e7a] text-white rounded-lg hover:bg-[#5a1559] transition-colors text-sm">첫 시험 입력하기</Link>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">전체 메뉴</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {allMenus.map((menu) => (
              <Link key={menu.href} href={menu.href} className="group bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 ${menu.color} rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  <menu.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-[#7b1e7a] transition-colors">{menu.title}</h4>
                <p className="text-sm text-gray-500">{menu.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 My Exam by 거북스쿨. 모의고사 분석 서비스</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      // 1. SSO 코드 처리 (Hub에서 넘어온 경우)
      // 동적 import로 processSSOLogin 로드 (클라이언트 전용)
      const { processSSOLogin } = await import('@/lib/utils/sso-helper');
      const ssoSuccess = await processSSOLogin();

      if (ssoSuccess) {
        console.log('✅ Hub에서 SSO 자동 로그인 완료');
        setIsLoggedIn(true);
        setIsLoading(false);
        return;
      }

      // 2. URL에서 직접 토큰 확인 (레거시 지원)
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');
      const tokenExpiry = searchParams.get('tokenExpiry');

      if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken, tokenExpiry ? parseInt(tokenExpiry) : 7200);
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        setIsLoggedIn(true);
        setIsLoading(false);
        return;
      }

      // 3. 저장된 토큰으로 로그인 상태 확인
      if (!getAccessToken()) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      // Hub 인증 서버를 통해 토큰 유효성 검증
      const user = await hubApi.get('/auth/me');
      if (user) {
        console.log('[checkLogin] 로그인 확인됨:', user);
        setIsLoggedIn(true);
      } else {
        console.log('[checkLogin] 로그인 실패 또는 토큰 만료');
        setIsLoggedIn(false);
      }

      setIsLoading(false);
    };

    initAuth();
  }, [searchParams]);

  // 로딩 중일 때 스피너 표시
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로그인 확인 중...</p>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return <Dashboard />
  }

  // Hub 로그인 URL
  const hubLoginUrl = "http://localhost:3000/auth/login?redirect=" + encodeURIComponent("http://localhost:3003");

  return <LandingPage hubLoginUrl={hubLoginUrl} />
}
