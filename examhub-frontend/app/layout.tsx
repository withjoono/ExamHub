import type { Metadata } from "next"
import { Noto_Sans_KR } from "next/font/google"
import "@/styles/design-system/index.css"
import "@/styles/globals.css"
import { SSOListener } from "@/components/auth/sso-listener"

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
})

export const metadata: Metadata = {
  title: "ExamHub - 모의고사 분석",
  description: "모의고사 성적 입력 및 분석 서비스 | G Skool",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" data-app="examhub" suppressHydrationWarning>
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        <SSOListener />
        {children}
      </body>
    </html>
  )
}








