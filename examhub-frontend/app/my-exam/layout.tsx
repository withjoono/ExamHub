"use client"

import { Navigation } from "@/components/navigation"
import { DevLoginBanner } from "@/components/auth/DevLogin"

export default function ExamHubLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 개발용 임시 로그인 배너 */}
      <DevLoginBanner />

      {/* 공통 네비게이션 */}
      <Navigation />

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}
