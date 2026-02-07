"use client"

import Link from "next/link"
import {
  FileText,
  BarChart3,
  GraduationCap,
  TrendingUp,
  Target,
  BookX,
  Zap,
  Users,
  Star,
  Crown,
  School,
  BookOpen,
  UserPlus,
  ChevronRight
} from "lucide-react"

export default function MyExamPage() {
  const examTypes = [
    { title: "교육청/평가원/수능", description: "공식 모의고사 및 수능 성적 분석", icon: FileText, color: "bg-blue-500" },
    { title: "사설 모의고사", description: "메가스터디, 대성, 이투스 등 사설 모의고사", icon: BookOpen, color: "bg-purple-500" },
  ]

  const freeFeatures = [
    { title: "자동 채점", description: "OMR 답안 입력만으로 자동 채점 및 성적 분석", icon: Zap },
    { title: "취약 범위 분석", description: "과목별 취약 단원 및 유형 자동 분석", icon: Target },
    { title: "성적 추이", description: "시험별 성적 변화 추이 그래프 제공", icon: TrendingUp },
    { title: "오답 관리", description: "틀린 문제 자동 저장 및 복습 관리", icon: BookX },
  ]

  const premiumFeatures = [
    { title: "대학 예측", description: "성적 기반 합격 가능 대학 예측 서비스", icon: GraduationCap },
    { title: "오답 관리 프리미엄", description: "AI 기반 오답 분석 및 맞춤 학습 추천", icon: Star },
    { title: "목표 대학 비교", description: "목표 대학 등급컷과 내 성적 실시간 비교", icon: Target },
    { title: "마이 그룹", description: "스터디 그룹 생성 및 그룹 내 성적 비교", icon: Users },
  ]

  return (
    <>
      {/* 히어로 섹션 */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            이젠 내가 푼 단 한문제도<br /><span className="text-[#7b1e7a]">버리는 일이 없도록!</span>
          </h2>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16 max-w-2xl mx-auto">
          {examTypes.map((exam) => (
            <Link key={exam.title} href="/main/input" className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 text-center cursor-pointer">
              <div className={`w-12 h-12 ${exam.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                <exam.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{exam.title}</h3>
              <p className="text-xs text-gray-500">{exam.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 무료 기능 섹션 */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">무료 기능</span>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">기본 기능은 <span className="text-green-600">무료</span>로 제공됩니다</h3>
            <p className="text-gray-600">회원가입만 하면 바로 사용할 수 있어요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* 프리미엄 기능 섹션 */}
      <section className="py-16 bg-gradient-to-br from-[#7b1e7a]/5 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1 bg-[#7b1e7a]/10 text-[#7b1e7a] rounded-full text-sm font-medium mb-4">
              <Crown className="w-4 h-4" />My Exam 멤버십
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">프리미엄 기능으로 <span className="text-[#7b1e7a]">성적 향상</span>을 경험하세요</h3>
            <p className="text-gray-600">더 정밀한 분석과 맞춤형 학습 추천을 제공합니다</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* 거북스쿨 멤버십 섹션 */}
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

      {/* CTA 섹션 */}
      <section className="py-16 bg-gradient-to-br from-[#7b1e7a] to-[#5a1559]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">성공하는 학생들의 선택, 당신 차례입니다</h3>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">지금 바로 시작하고 체계적인 성적 관리를 경험하세요.<br />기본 기능은 완전 무료입니다.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/main/input" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#7b1e7a] rounded-xl hover:bg-gray-100 transition-colors font-semibold shadow-lg">
              <UserPlus className="w-5 h-5" />무료로 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>© 2025 My Exam by 거북스쿨. 모의고사 분석 서비스</p>
        </div>
      </footer>
    </>
  )
}
