import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { BackNavigationHandler } from "@/components/back-navigation-handler"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "在庫確保・発注画面",
  description: "在庫確保と発注を管理するアプリケーション",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={inter.variable}>
      <body>
        <Suspense fallback={null}>
          <BackNavigationHandler />
        </Suspense>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
