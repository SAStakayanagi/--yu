import Header from "@/components/header"
import OrderedListView from "@/components/ordered-list-view"

interface OrderedListPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function OrderedListPage({ searchParams }: OrderedListPageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow overflow-y-auto">
        <OrderedListView initialSearchParams={searchParams} />
      </main>
    </div>
  )
}
