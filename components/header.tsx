"use client"

interface HeaderProps {
  title?: string
}

export default function Header({ title = "発注登録" }: HeaderProps) {
  const currentDate = new Date()
    .toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    })
    .replace(/\//g, "/")
  return (
    <header className="bg-blue-600 text-white p-4 flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <span className="text-xl">☰</span>
        <span className="text-lg font-bold">{title}</span>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span>{currentDate}</span>
        <div className="flex items-center gap-1">
          <span>👤</span>
          <span>田中太郎</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🚪</span>
          <span>ログアウト</span>
        </div>
      </div>
    </header>
  )
}
