import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BackNavigationHandler } from "@/components/back-navigation-handler"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Suspense fallback={null}>
          <BackNavigationHandler />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
