"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function BackNavigationHandler() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // F9キーが押下された場合
      if (event.key === "F9") {
        event.preventDefault()
        router.back()
      }
    }

    // キーボードイベントリスナーを追加
    window.addEventListener("keydown", handleKeyDown)

    // クリーンアップ関数でイベントリスナーを削除
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [router])

  // このコンポーネントは何も表示しない
  return null
}
