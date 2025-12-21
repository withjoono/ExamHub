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

export default function HomePage() {
  const menuItems = [
    {
      title: "모의고사 입력",
      description: "모의고사 점수 및 답안 입력",
      href: "/mock-analysis/input",
      icon: FileText,
      color: "bg-[#7b1e7a]",
    },
    {
      title: "성적 분석",
      description: "과목별 성적 분석 및 비교",
      href: "/mock-analysis/score-analysis",
      icon: BarChart3,
      color: "bg-blue-500",
    },
    {
      title: "대학 예측",
      description: "합격 가능한 대학 예측",
      href: "/mock-analysis/prediction",
      icon: GraduationCap,
      color: "bg-green-500",
    },
    {
      title: "누적 분석",
      description: "시험별 성적 추이 분석",
      href: "/mock-analysis/statistics",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      title: "분석과 오답",
      description: "과목별 분석 및 오답 관리",
      href: "/mock-analysis/management",
      icon: ClipboardList,
      color: "bg-indigo-500",
    },
    {
      title: "목표 대학",
      description: "목표 대학 등급컷 확인",
      href: "/mock-analysis/target-university",
      icon: Target,
      color: "bg-pink-500",
    },
    {
      title: "오답 노트",
      description: "틀린 문제 분석 및 정리",
      href: "/mock-analysis/wrong-answers",
      icon: BookX,
      color: "bg-red-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#9c3d9a] to-[#5a1559] rounded-xl flex items-center justify-center shadow-lg shadow-[#d4a5d3]">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GB-ExamInfo</h1>
                <p className="text-xs text-gray-500">모의고사 분석 서비스</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            모의고사 <span className="text-[#7b1e7a]">분석</span> 서비스
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            모의고사 성적을 입력하고 상세한 분석 결과를 확인하세요.
            <br />
            합격 예측부터 오답 분석까지 한 곳에서 관리할 수 있습니다.
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#7b1e7a] transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 GB-ExamInfo. 모의고사 분석 서비스</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

