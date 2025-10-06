"use client"

import { Button } from "@/components/ui/button"

interface FooterProps {
  f11Mode?: "ダイアログ検索" | "直接入力"
}

export default function Footer({ f11Mode = "ダイアログ検索" }: FooterProps) {
  const buttons = [
    { label: "F1 ヘルプ", active: true },
    { label: "F2", active: false },
    { label: "F3 検索", active: true },
    { label: "F4 クリア", active: true },
    { label: "F5", active: false },
    { label: "F6 新規登録", active: true },
    { label: "F7", active: false },
    { label: "F8", active: false },
    { label: "F9 戻る", active: true },
    { label: "F10", active: false },
    { label: `F11 ${f11Mode}`, active: true },
    { label: "F12 終了", active: true },
  ]
  return (
    <footer className="bg-[#20242C] py-1 flex justify-center gap-0.5 w-full fixed bottom-0 left-0 z-50">
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant="outline"
          className={`h-7 text-xs text-white ${
            button.active ? "bg-[#363B45] hover:bg-[#4a4f5a]" : "bg-[#20242C] hover:bg-[#2a2e36]"
          } border-none rounded-md px-2 py-1`}
        >
          {button.label}
        </Button>
      ))}
    </footer>
  )
}
