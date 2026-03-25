"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getUser, type User } from "@/lib/auth/user"
import { Footer } from "@/components/footer"
import {
  ClipboardCheck,
  BarChart3,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronRight,
  BookOpen,
  PenTool,
  TrendingUp,
  Brain,
  ExternalLink,
  LayoutDashboard,
} from "lucide-react"

// ========== 대시보드 (로그인) ==========
function Dashboard({ user }: { user: User }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            안녕하세요, <span className="text-[#2563eb]">{user.name}</span> 님! 👋
          </h1>
          <p className="text-gray-500 mt-1">ExamHub에서 시험 결과를 확인하고 분석하세요</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/main/input" className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-2xl p-5 text-white hover:shadow-lg hover:shadow-blue-200/50 transition-all hover:-translate-y-0.5 text-left">
            <PenTool className="w-7 h-7 mb-3 opacity-80" />
            <div className="font-bold text-sm">정답 입력</div>
            <div className="text-xs text-white/70 mt-1">시험 답안 입력하기</div>
          </Link>
          <Link href="/main/score-analysis" className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white hover:shadow-lg hover:shadow-emerald-200/50 transition-all hover:-translate-y-0.5 text-left">
            <BarChart3 className="w-7 h-7 mb-3 opacity-80" />
            <div className="font-bold text-sm">성적 분석</div>
            <div className="text-xs text-white/70 mt-1">내 성적 리포트</div>
          </Link>
          <Link href="/main/wrong-answers" className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-5 text-white hover:shadow-lg hover:shadow-orange-200/50 transition-all hover:-translate-y-0.5 text-left">
            <BookOpen className="w-7 h-7 mb-3 opacity-80" />
            <div className="font-bold text-sm">오답 노트</div>
            <div className="text-xs text-white/70 mt-1">틀린 문제 모아보기</div>
          </Link>
          <Link href="/main/weakness-analysis" className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white hover:shadow-lg hover:shadow-purple-200/50 transition-all hover:-translate-y-0.5 text-left">
            <TrendingUp className="w-7 h-7 mb-3 opacity-80" />
            <div className="font-bold text-sm">취약 분석</div>
            <div className="text-xs text-white/70 mt-1">취약 단원 파악</div>
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-8 h-8 text-[#2563eb]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">더 많은 기능이 준비 중!</h3>
          <p className="text-gray-500 mb-2">AI 기반 맞춤 학습 추천, 성적 추이 그래프 등 다양한 기능이 곧 오픈됩니다.</p>
          <p className="text-gray-400 text-sm">빠른 시일 내에 만나뵐 수 있도록 준비하겠습니다 🙏</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

// ========== 프로모 페이지 (비로그인 · 학생 중심) ==========
function PromoPage() {
  const handleLogin = () => {
    const { redirectToHubLogin } = require("@/lib/auth/hub-login")
    redirectToHubLogin("/main")
  }

  const TEACHER_APP_URL = "https://teacher-front.web.app/"

  return (
    <>
      {/* ===== 1. Hero ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#1d4ed8]">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 border border-white/20">
                <Zap className="w-4 h-4" />
                정답 입력만으로 끝!
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                정답만 입력하면,<br />
                <span className="bg-gradient-to-r from-cyan-300 to-sky-200 text-transparent bg-clip-text">나머지는 ExamHub가!</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl leading-relaxed">
                시험이 끝나면 정답만 입력하세요.<br className="hidden md:block" />
                <strong className="text-white">채점, 성적 분석, 오답 정리, 취약 단원까지 한번에!</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button onClick={handleLogin} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#2563eb] rounded-2xl hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-2xl shadow-black/20 hover:scale-105">
                  <Zap className="w-5 h-5" />시작하기
                </button>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-48 h-48 md:w-56 md:h-56 relative drop-shadow-2xl">
                <Image src="/images/mascot.png" alt="ExamHub 마스코트" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. How It Works (3-Step) ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-4">✨ 이렇게 간단합니다</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              <span className="text-[#2563eb]">3단계</span>로 끝나는 시험 분석
            </h2>
            <p className="text-gray-500 text-lg">복잡한 건 ExamHub에게 맡기세요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: 1, icon: <PenTool className="w-8 h-8 text-blue-600" />, color: "blue", title: "선생님이 시험 출제", desc: "선생님 전용 앱에서\n문제와 정답을 등록합니다" },
              { step: 2, icon: <ClipboardCheck className="w-8 h-8 text-green-600" />, color: "green", title: "학생이 정답 입력", desc: "시험이 끝나면 ExamHub에서\n내 답안을 입력합니다" },
              { step: 3, icon: <BarChart3 className="w-8 h-8 text-purple-600" />, color: "purple", title: "자동 분석 완료!", desc: "채점 · 성적 분석 · 오답 노트\n취약 단원까지 자동으로!" },
            ].map((item) => (
              <div key={item.step} className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-100/50 text-center group hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#2563eb] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">{item.step}</div>
                <div className={`w-16 h-16 bg-gradient-to-br from-${item.color}-100 to-${item.color}-50 rounded-2xl flex items-center justify-center mx-auto mb-5 mt-2`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 whitespace-pre-line">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. 핵심 기능 4가지 ===== */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-4">🚀 핵심 기능</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              정답 입력 하나로 <span className="text-[#2563eb]">이 모든 게 가능!</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                <Zap className="w-10 h-10 text-white/90 mb-3" />
                <h3 className="text-xl font-bold text-white">⚡ 자동 채점</h3>
                <p className="text-emerald-100 text-sm mt-1">정답 입력 즉시, 자동으로 채점 완료</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  답안을 입력하면 즉시 채점!<br />손으로 맞춰볼 필요 없이 바로 결과를 확인하세요.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-emerald-400" />입력 즉시 실시간 자동 채점</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-emerald-400" />과목별 점수 즉시 확인</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-emerald-400" />정답/오답 한눈에 비교</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6">
                <BarChart3 className="w-10 h-10 text-white/90 mb-3" />
                <h3 className="text-xl font-bold text-white">📊 성적 분석</h3>
                <p className="text-orange-100 text-sm mt-1">내 성적을 데이터로 깊이 분석</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  문항별 정답률, 과목별 성취도,<br />시험별 성적 변화까지 한눈에 파악합니다.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-orange-400" />문항별 정답률 · 난이도 분석</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-orange-400" />시험별 성적 추이 그래프</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-orange-400" />과목별 · 단원별 비교 분석</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6">
                <BookOpen className="w-10 h-10 text-white/90 mb-3" />
                <h3 className="text-xl font-bold text-white">📝 오답 노트</h3>
                <p className="text-rose-100 text-sm mt-1">틀린 문제를 자동으로 모아 정리</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  매번 오답을 정리할 필요 없이,<br />ExamHub가 자동으로 오답 노트를 만들어 줍니다.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-rose-400" />틀린 문제 자동 수집 · 저장</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-rose-400" />과목별 · 단원별 오답 분류</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-rose-400" />누적 오답 데이터로 복습 효율 UP</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-6">
                <TrendingUp className="w-10 h-10 text-white/90 mb-3" />
                <h3 className="text-xl font-bold text-white">🎯 취약 단원 분석</h3>
                <p className="text-purple-100 text-sm mt-1">내가 약한 부분을 정확히 파악</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  오답 데이터를 누적 분석하여<br />취약 단원을 자동으로 찾아드립니다.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-purple-400" />단원별 취약점 자동 분석</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-purple-400" />반복 오답 패턴 진단</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-purple-400" />맞춤형 학습 방향 제안</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. 마스코트 + AI 비전 ===== */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#1e3a8a] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-300/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="w-32 h-32 md:w-40 md:h-40 relative mx-auto mb-6 drop-shadow-lg">
            <Image src="/images/mascot.png" alt="ExamHub 마스코트" fill className="object-contain" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">
            현재는 위의 기능들만 제공하지만...
          </h2>
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 md:p-8">
            <div className="flex items-start gap-3 mb-3">
              <Brain className="w-6 h-6 text-cyan-300 flex-shrink-0 mt-0.5" />
              <p className="text-white/90 text-left text-base md:text-lg leading-relaxed">
                <strong className="text-cyan-300">정답을 입력해 놓으면,</strong><br />
                AI가 이 데이터들을 이용해서 곧 <strong className="text-white">생각지도 못한 도움</strong>을 주게 될 것입니다.
              </p>
            </div>
            <p className="text-white/60 text-sm text-left ml-9">점수만이 아닌, 나의 학습 패턴을 AI가 분석합니다.</p>
          </div>
        </div>
      </section>

      {/* ===== 5. 활용 시나리오 ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold mb-4">🎯 이렇게 활용됩니다</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              어떤 시험이든, <span className="text-[#2563eb]">ExamHub와 함께!</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { emoji: "🏫", title: "학교 쪽지시험 · 단원평가", desc: "선생님이 출제한 시험 후, 정답을 입력하면 즉시 채점! 어떤 문제를 틀렸는지 바로 확인됩니다." },
              { emoji: "📚", title: "학원 주간 테스트", desc: "수업 후 복습 퀴즈 결과가 자동 분석되어, 내가 어디가 약한지 스스로 파악할 수 있습니다." },
              { emoji: "🎓", title: "과외 맞춤 퀴즈", desc: "선생님이 내 수준에 맞춰 출제한 퀴즈 결과가 누적되어, 학습 방향을 정밀하게 잡을 수 있습니다." },
              { emoji: "📱", title: "자기 주도 학습", desc: "오답 노트와 취약 단원을 확인하며, 스스로 부족한 부분을 파악하고 학습 계획을 세울 수 있습니다." },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-2xl border border-gray-100 p-7 flex gap-5 hover:bg-blue-50/30 transition-colors">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-2xl">{item.emoji}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. 선생님을 위한 안내 ===== */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-3xl border border-blue-100 shadow-lg p-8 md:p-10 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <LayoutDashboard className="w-8 h-8 text-[#2563eb]" />
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">선생님이신가요?</h3>
            <p className="text-gray-500 mb-6 max-w-lg mx-auto leading-relaxed">
              선생님 전용 앱에서 시험을 출제하고, 클래스 학생들의 성적을 한눈에 관리하세요.<br />
              학생들이 ExamHub에서 입력한 답안이 자동으로 채점되어, 선생님 앱에서 바로 확인됩니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={TEACHER_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#2563eb] text-white rounded-2xl hover:bg-[#1d4ed8] transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105"
              >
                <ExternalLink className="w-5 h-5" />선생님 앱 바로가기
              </a>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-blue-300" />시험 출제</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-blue-300" />클래스 관리</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-blue-300" />학생 성적 대시보드</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7. CTA ===== */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#1d4ed8] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            &ldquo;<span className="bg-gradient-to-r from-cyan-300 to-sky-200 text-transparent bg-clip-text">입력은 내가, 분석은 ExamHub가, 성장은 나의 것!</span>&rdquo;
          </h3>
          <p className="text-white/70 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
            정답만 입력하면 채점 · 성적 분석 · 오답 노트 · 취약 단원 분석까지 한번에!
          </p>
          <button onClick={handleLogin} className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-[#2563eb] rounded-2xl hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-2xl shadow-black/20 hover:scale-105">
            <Zap className="w-6 h-6" />지금 시작하기<ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

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
