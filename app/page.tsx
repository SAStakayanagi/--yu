import Component from "@/japanese-order-form"
import Header from "@/components/header"

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow overflow-y-auto">
        <Component />
      </main>
    </div>
  )
}
