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
  title: "ExamHub - 선생님이 출제, 학생이 입력, 자동으로 채점!",
  description: "선생님이 출제한 시험에 정답만 입력하면 자동 채점, 성적 분석, 오답 노트까지! | 거북스쿨",
  icons: {
    icon: "/images/mascot.png",
    apple: "/images/mascot.png",
  },
  openGraph: {
    title: "ExamHub - 선생님이 출제, 학생이 입력, 자동으로 채점!",
    description: "선생님이 출제한 시험에 정답만 입력하면 자동 채점, 성적 분석, 오답 노트까지!",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "ExamHub 거북쌤" }],
    siteName: "ExamHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ExamHub - 선생님이 출제, 학생이 입력, 자동으로 채점!",
    description: "선생님이 출제한 시험에 정답만 입력하면 자동 채점, 성적 분석, 오답 노트까지!",
    images: ["/images/og-image.png"],
  },
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








