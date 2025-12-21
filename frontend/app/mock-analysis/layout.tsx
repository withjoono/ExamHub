"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  FileText, 
  BarChart3, 
  GraduationCap, 
  TrendingUp, 
  Target, 
  BookX,
  ClipboardList,
  Home,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/mock-analysis/input", label: "입력", icon: FileText },
  { href: "/mock-analysis/score-analysis", label: "성적분석", icon: BarChart3 },
  { href: "/mock-analysis/prediction", label: "대학예측", icon: GraduationCap },
  { href: "/mock-analysis/statistics", label: "누적분석", icon: TrendingUp },
  { href: "/mock-analysis/management", label: "분석과 오답", icon: ClipboardList },
  { href: "/mock-analysis/target-university", label: "목표대학", icon: Target },
  { href: "/mock-analysis/wrong-answers", label: "오답노트", icon: BookX },
]

export default function MockAnalysisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const getCurrentPageTitle = () => {
    const item = navItems.find(item => pathname.startsWith(item.href))
    return item?.label || "모의고사 분석"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#9c3d9a] to-[#5a1559] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-lg font-bold text-gray-900">GB-ExamInfo</span>
            </Link>
            
            <Link 
              href="/"
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>홈으로</span>
            </Link>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 -mb-px overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    isActive
                      ? "border-[#7b1e7a] text-[#7b1e7a]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}

