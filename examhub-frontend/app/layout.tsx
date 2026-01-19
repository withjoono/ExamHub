import type { Metadata } from "next"
import { Noto_Sans_KR } from "next/font/google"
import "@/styles/globals.css"
import { SSOHandler } from "@/components/auth"

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
})

export const metadata: Metadata = {
  title: "ExamHub - 모의고사 분석",
  description: "모의고사 성적 입력 및 분석 서비스 | 거북스쿨",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        <SSOHandler>
          {children}
        </SSOHandler>
      </body>
    </html>
  )
}








