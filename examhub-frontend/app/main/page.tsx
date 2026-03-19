"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { getUser, type User } from "@/lib/auth/user"
import { Footer } from "@/components/footer"
import {
  ClipboardCheck,
  BarChart3,
  Users,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield,
  ChevronRight,
  BookOpen,
  Clock,
  PenTool,
  Trophy,
  TrendingUp,
  FileCheck,
  QrCode,
  Brain,
  Eye,
  Layers,
  Timer,
  Download,
  LayoutDashboard,
} from "lucide-react"

// ========== 대시보드 (로그인) ==========
function Dashboard({ user }: { user: User }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 환영 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            안녕하세요, <span className="text-[#2563eb]">{user.name}</span> 선생님! 👋
          </h1>
          <p className="text-gray-500 mt-1">ExamHub에서 시험을 출제하고 관리하세요</p>
        </div>

        {/* 빠른 액션 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button onClick={() => alert('시험 출제 기능이 곧 오픈됩니다!')} className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-2xl p-5 text-white hover:shadow-lg hover:shadow-blue-200/50 transition-all hover:-translate-y-0.5 text-left">
            <PenTool className="w-7 h-7 mb-3 opacity-80" />
            <div className="font-bold text-sm">시험 출제</div>
            <div className="text-xs text-white/70 mt-1">새 퀴즈 만들기</div>
          </button>
          <button onClick={() => alert('채점 관리 기능이 곧 오픈됩니다!')} className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white hover:shadow-lg hover:shadow-emerald-200/50 transition-all hover:-translate-y-0.5 text-left">
            <ClipboardCheck className="w-7 h-7 mb-3 opacity-80" />
            <div className="font-bold text-sm">채점 관리</div>
            <div className="text-xs text-white/70 mt-1">답안 확인 & 채점</div>
          </button>
          <button onClick={() => alert('성적 분석 기능이 곧 오픈됩니다!')} className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-5 text-white hover:shadow-lg hover:shadow-orange-200/50 transition-all hover:-translate-y-0.5 text-left">
            <BarChart3 className="w-7 h-7 mb-3 opacity-80" />
            <div className="font-bold text-sm">성적 분석</div>
            <div className="text-xs text-white/70 mt-1">학생별 리포트</div>
          </button>
          <button onClick={() => alert('학생 관리 기능이 곧 오픈됩니다!')} className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white hover:shadow-lg hover:shadow-purple-200/50 transition-all hover:-translate-y-0.5 text-left">
            <Users className="w-7 h-7 mb-3 opacity-80" />
            <div className="font-bold text-sm">학생 관리</div>
            <div className="text-xs text-white/70 mt-1">반 · 학생 목록</div>
          </button>
        </div>

        {/* 준비 중 안내 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-8 h-8 text-[#2563eb]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">ExamHub 선생님용 서비스 준비 중!</h3>
          <p className="text-gray-500 mb-2">시험 출제, 자동 채점, 성적 분석 기능이 곧 오픈됩니다.</p>
          <p className="text-gray-400 text-sm">빠른 시일 내에 만나뵐 수 있도록 준비하겠습니다 🙏</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

// ========== 프로모 페이지 (비로그인) ==========
function PromoPage() {
  return (
    <>
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#1d4ed8]">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-3xl" />
          {/* 패턴 오버레이 */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 border border-white/20">
            <Shield className="w-4 h-4" />
            선생님을 위한 시험 관리 플랫폼
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            선생님의 모든 시험,<br />
            <span className="bg-gradient-to-r from-cyan-300 to-sky-200 text-transparent bg-clip-text">ExamHub</span>에서 한번에!
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            퀴즈 출제부터 학생 답안 제출, 자동 채점, 성적 분석까지<br className="hidden md:block" />
            <strong className="text-white">선생님의 시험 관리를 하나의 플랫폼에서!</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/main/input" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#2563eb] rounded-2xl hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-2xl shadow-black/20 hover:scale-105">
              <Zap className="w-5 h-5" />시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* 이런 어려움, 공감하시나요? */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-sm font-bold mb-4">😓 이런 어려움, 공감하시나요?</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              시험 출제하고 채점하는 데<br /><span className="text-red-500">시간이 너무 많이 걸리죠?</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-md text-center">
              <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">시험지 만드느라 밤샘</h3>
              <p className="text-sm text-gray-500">문제 편집, 인쇄, 배포까지<br />매번 반복되는 수작업</p>
            </div>
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-md text-center">
              <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">채점에 지침</h3>
              <p className="text-sm text-gray-500">30명, 40명 답안지를<br />하나하나 손으로 채점하는 고통</p>
            </div>
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-md text-center">
              <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">분석은 언제 하죠?</h3>
              <p className="text-sm text-gray-500">문항별 정답률, 학생별 약점은<br />파악하고 싶지만 시간이 없어요</p>
            </div>
          </div>
        </div>
      </section>

      {/* 해결 방법 단계별 */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-4">✨ ExamHub가 해결합니다</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              시험 관리, <span className="text-[#2563eb]">단 3단계</span>로 끝!
            </h2>
            <p className="text-gray-500 text-lg">출제 → 응시 → 분석, 소요 시간: 5분</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-100/50 text-center group hover:shadow-xl transition-all duration-300">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#2563eb] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">1</div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5 mt-2">
                <PenTool className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">시험 출제</h3>
              <p className="text-sm text-gray-500">문제와 정답을 입력하면<br />시험지가 자동으로 생성됩니다</p>
            </div>
            <div className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-100/50 text-center group hover:shadow-xl transition-all duration-300">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#2563eb] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">2</div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5 mt-2">
                <QrCode className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">학생 응시</h3>
              <p className="text-sm text-gray-500">코드나 QR로 시험에 입장하고<br />모바일로 답안을 바로 제출합니다</p>
            </div>
            <div className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-100/50 text-center group hover:shadow-xl transition-all duration-300">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#2563eb] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">3</div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-5 mt-2">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">자동 분석</h3>
              <p className="text-sm text-gray-500">자동 채점과 함께<br />학생별 · 문항별 분석까지 완료!</p>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 기능 섹션 */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-4">🚀 핵심 기능</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              선생님 시험 관리의 <span className="text-[#2563eb]">모든 것</span>
            </h2>
            <p className="text-gray-500 text-lg">ExamHub 하나로 시험의 전 과정을 관리하세요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 시험 출제 */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <PenTool className="w-10 h-10 text-white/90 mb-3" />
                <h3 className="text-xl font-bold text-white">✏️ 간편 시험 출제</h3>
                <p className="text-blue-100 text-sm mt-1">몇 분 만에 시험지 완성</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  객관식, 주관식, OX 등 다양한 유형의<br />
                  문제를 쉽고 빠르게 출제하세요.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-blue-400" />객관식 · 주관식 · OX 문제 지원</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-blue-400" />과목 · 단원별 분류 관리</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-blue-400" />문제은행에서 재사용 가능</div>
                </div>
              </div>
            </div>

            {/* 자동 채점 */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                <Zap className="w-10 h-10 text-white/90 mb-3" />
                <h3 className="text-xl font-bold text-white">⚡ 자동 채점</h3>
                <p className="text-emerald-100 text-sm mt-1">답안 제출 즉시 자동 채점</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  학생이 답안을 제출하면 즉시 채점!<br />
                  선생님의 채점 시간을 0으로 줄여드립니다.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-emerald-400" />실시간 자동 채점</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-emerald-400" />학생별 점수 즉시 확인</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-emerald-400" />채점 결과 학생에게 즉시 알림</div>
                </div>
              </div>
            </div>

            {/* 성적 분석 */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6">
                <BarChart3 className="w-10 h-10 text-white/90 mb-3" />
                <h3 className="text-xl font-bold text-white">📊 성적 분석</h3>
                <p className="text-orange-100 text-sm mt-1">학생별 · 문항별 심층 리포트</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  문항별 정답률, 학생별 성취도,<br />
                  오답 패턴까지 데이터 기반으로 분석합니다.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-orange-400" />문항별 정답률 · 오답률 분석</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-orange-400" />학생별 성취도 리포트</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-orange-400" />반별 · 과목별 비교 분석</div>
                </div>
              </div>
            </div>

            {/* 학생 관리 */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
                <Users className="w-10 h-10 text-white/90 mb-3" />
                <h3 className="text-xl font-bold text-white">👥 학생 관리</h3>
                <p className="text-purple-200 text-sm mt-1">반 구성 · 학생 초대 · 시험 배정</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  반을 만들고 학생을 초대하세요.<br />
                  시험을 반 단위로 배정하고 관리합니다.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-purple-400" />반별 학생 관리</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-purple-400" />코드/QR로 간편 초대</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-purple-400" />시험 결과 누적 관리</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 모토 배너 */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#1e3a8a] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-300/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="mb-4">
            <span className="text-5xl md:text-6xl">📝</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
            &ldquo;<span className="bg-gradient-to-r from-cyan-300 to-sky-200 text-transparent bg-clip-text">시험은 선생님이, 나머지는 ExamHub가!</span>&rdquo;
          </h2>
          <p className="text-white/70 text-sm md:text-base max-w-lg mx-auto">
            출제에만 집중하세요. 채점, 분석, 관리는 ExamHub가 알아서 처리합니다.
          </p>
        </div>
      </section>

      {/* 더 강력한 기능들 */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-bold mb-4">✨ 더 강력한 기능들</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              단순 채점을 넘어,<br /><span className="text-[#2563eb]">교육의 질을 높이다</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 hover:bg-blue-50/50 transition-colors group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5">AI 문제 추천</h3>
              <p className="text-sm text-gray-500">학생들의 오답 데이터를 AI가 분석하여 취약 단원용 문제를 자동으로 추천합니다.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 hover:bg-emerald-50/50 transition-colors group">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Timer className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5">시간 제한 시험</h3>
              <p className="text-sm text-gray-500">시험 시간을 설정하면, 타이머가 자동으로 작동하고 시간이 되면 자동 제출됩니다.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 hover:bg-orange-50/50 transition-colors group">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5">실시간 모니터링</h3>
              <p className="text-sm text-gray-500">학생들의 응시 현황을 실시간으로 확인하고 진행 상태를 모니터링합니다.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 hover:bg-purple-50/50 transition-colors group">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5">문제 은행</h3>
              <p className="text-sm text-gray-500">한번 출제한 문제는 문제은행에 저장! 다음 시험 때 쉽게 재사용할 수 있습니다.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 hover:bg-rose-50/50 transition-colors group">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5">랭킹 & 보상</h3>
              <p className="text-sm text-gray-500">시험 결과 순위표와 성취 배지로 학생들의 학습 동기를 높여줍니다.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 hover:bg-cyan-50/50 transition-colors group">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Download className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5">엑셀 내보내기</h3>
              <p className="text-sm text-gray-500">성적 데이터를 엑셀로 다운로드! 학부모 상담, 행정 보고에 바로 활용하세요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 다양한 사용 사례 */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold mb-4">🎯 활용 사례</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              이런 선생님들이 <span className="text-[#2563eb]">ExamHub</span>를 사용합니다
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-7 flex gap-5">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🏫</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">학교 선생님</h3>
                <p className="text-sm text-gray-500">단원평가, 쪽지시험, 형성평가를 간편하게 출제하고 학생들의 이해도를 빠르게 파악하세요.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-7 flex gap-5">
              <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">학원 강사</h3>
                <p className="text-sm text-gray-500">수업 후 복습 퀴즈, 주간 테스트를 출제하고 학생별 성취도를 학부모에게 리포트하세요.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-7 flex gap-5">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎓</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">과외 선생님</h3>
                <p className="text-sm text-gray-500">학생 맞춤형 퀴즈를 출제하고, 누적 성적 데이터로 학습 방향을 정밀하게 조절하세요.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-7 flex gap-5">
              <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💻</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">온라인 교육자</h3>
                <p className="text-sm text-gray-500">비대면 환경에서도 실시간 시험 진행! 시간 제한과 자동 채점으로 온라인 수업의 효과를 높이세요.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#1d4ed8] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-5">지금 바로 시작하세요!</h3>
          <p className="text-white/80 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
            시험 출제부터 자동 채점, 성적 분석까지<br />ExamHub와 함께라면 시험 관리가 쉬워집니다.
          </p>
          <Link href="/main/input" className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-[#2563eb] rounded-2xl hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-2xl shadow-black/20 hover:scale-105">
            <Zap className="w-6 h-6" />무료로 시작하기<ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <Footer />
    </>
  )
}

// ========== 메인 페이지 ==========
export default function MyExamPage() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    async function checkUser() {
      const userData = await getUser()
      setUser(userData)
      setAuthLoading(false)
    }
    checkUser()
  }, [])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">로딩 중...</div>
      </div>
    )
  }

  return user ? <Dashboard user={user} /> : <PromoPage />
}
