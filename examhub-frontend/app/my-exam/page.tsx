"use client"

import Link from "next/link"
import {
  FileText,
  BarChart3,
  GraduationCap,
  TrendingUp,
  Target,
  BookX,
  ClipboardList
} from "lucide-react"

export default function MyExamDashboard() {
  const quickMenus = [
    { title: "성적 입력", href: "/my-exam/input", icon: FileText, color: "bg-[#7b1e7a]" },
    { title: "성적 분석", href: "/my-exam/score-analysis", icon: BarChart3, color: "bg-blue-500" },
    { title: "대학 예측", href: "/my-exam/prediction", icon: GraduationCap, color: "bg-green-500" },
    { title: "오답 노트", href: "/my-exam/wrong-answers", icon: BookX, color: "bg-red-500" },
  ]

  const allMenus = [
    { title: "모의고사 입력", description: "모의고사 점수 및 답안 입력", href: "/my-exam/input", icon: FileText, color: "bg-[#7b1e7a]" },
    { title: "성적 분석", description: "과목별 성적 분석 및 비교", href: "/my-exam/score-analysis", icon: BarChart3, color: "bg-blue-500" },
    { title: "대학 예측", description: "합격 가능한 대학 예측", href: "/my-exam/prediction", icon: GraduationCap, color: "bg-green-500" },
    { title: "성적 추이", description: "시험별 성적 변화 분석", href: "/my-exam/statistics", icon: TrendingUp, color: "bg-purple-500" },
    { title: "목표 대학", description: "목표 대학 등급컷 확인", href: "/my-exam/target-university", icon: Target, color: "bg-pink-500" },
    { title: "오답 노트", description: "틀린 문제 분석 및 정리", href: "/my-exam/wrong-answers", icon: BookX, color: "bg-red-500" },
    { title: "분석과 오답", description: "통합 분석 및 오답 관리", href: "/my-exam/management", icon: ClipboardList, color: "bg-indigo-500" },
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
      <section className="max-w-7xl mx-auto px-4 py-8 pt-4">
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
            <Link href="/my-exam/input" className="text-sm text-[#7b1e7a] hover:underline">전체보기</Link>
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

