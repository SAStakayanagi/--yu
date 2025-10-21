"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import OrderSearchForm from "@/components/order-search-form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Footer from "@/components/footer"

interface OrderedListViewProps {
  initialSearchParams?: { [key: string]: string | string[] | undefined }
}

export default function OrderedListView({ initialSearchParams }: OrderedListViewProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [desiredDeliveryDate, setDesiredDeliveryDate] = useState<Date | undefined>(new Date(2024, 10, 20))
  const [currentPage, setCurrentPage] = useState(1) // Current page state
  const itemsPerPage = 10 // Items per page
  const [f11Mode, setF11Mode] = useState<"ダイアログ検索" | "直接入力">("ダイアログ検索")

  // Dummy data for the table (replace with actual fetched data based on searchParams)
  // Expanded dummy data to demonstrate pagination
  const [tableData, setTableData] = useState(
    Array.from({ length: 25 }, (_, i) => {
      const supplierNum = (i % 4) + 1
      const supplierCode = supplierNum.toString().padStart(4, "0")
      return {
        supplierCode: supplierCode,
        company: `仕入先${supplierNum}`,
        method: ["FAX", "WEB", "EDI", "メール"][i % 4],
        orderCode: `メモ${i + 1}`,
        orderNumber: `T01-000${i + 1}`,
        endUser: `得意先${(i % 3) + 1}`,
        makerCode: `M-${(i % 5) + 1}`,
        productName: `商品名${i + 1}`,
        specification: `規格${i + 1}`,
        model: `モデル${i + 1}`,
        quantity: `${(i % 3) + 1}台`,
        orderQty: `${(i % 5) + 1}`,
        unitPrice: `${(i + 1) * 1000}`,
      }
    }),
  )

  const [filteredData, setFilteredData] = useState(tableData)

  // Add this useEffect after the state declarations
  useEffect(() => {
    setFilteredData(tableData)
  }, [tableData])

  const handleSearch = (searchParams: any) => {
    console.log("OrderedListView 検索条件:", searchParams)
    let filtered = [...tableData]

    // Filter by supplier code
    if (searchParams.supplierCode) {
      filtered = filtered.filter(
        (item) =>
          item.supplierCode.includes(searchParams.supplierCode) ||
          item.company.includes(searchParams.supplierCode) ||
          item.company.toLowerCase().includes(searchParams.supplierCode.toLowerCase()),
      )
    }

    // Filter by supplier name
    if (searchParams.supplierName) {
      filtered = filtered.filter((item) => item.company.includes(searchParams.supplierName))
    }

    // Filter by order method
    if (searchParams.orderMethod) {
      filtered = filtered.filter((item) => item.method === searchParams.orderMethod)
    }

    // Filter by staff code
    if (searchParams.staffCode) {
      filtered = filtered.filter((item) => item.staffCode === searchParams.staffCode)
    }

    // Filter by maker code
    if (searchParams.makerCode) {
      filtered = filtered.filter((item) => item.makerCode.includes(searchParams.makerCode))
    }

    // Filter by order date range
    if (searchParams.orderDateStart || searchParams.orderDateEnd) {
      // For demo purposes, we'll assume all current data is within the date range
      // In a real application, you would compare actual dates
      console.log("日付範囲でフィルタリング:", searchParams.orderDateStart, "〜", searchParams.orderDateEnd)
    }

    setFilteredData(filtered)
    setCurrentPage(1) // Reset to first page after search
    console.log(`OrderedListView 検索結果: ${filtered.length}件`)
  }

  // Get current items for the page
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleCheckboxChange = (index: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, index])
    } else {
      setSelectedItems(selectedItems.filter((i) => i !== index))
    }
  }

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      setSelectedItems(tableData.map((_, index) => index))
    } else {
      setSelectedItems([])
    }
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  const allItemsSelected = selectedItems.length === tableData.length && tableData.length > 0

  return (
    <div className="flex flex-col flex-grow pb-20" style={{ backgroundColor: "#FAF5E9" }}>
      <Card className="w-full flex-grow">
        <CardContent className="p-6 bg-[#FAF5E9] flex flex-grow flex-col py-6">
          {/* Header Section - Use OrderSearchForm with initial search parameters */}
          <OrderSearchForm
            initialSearchParams={initialSearchParams}
            onSearch={handleSearch}
            onF11ModeChange={setF11Mode}
          />
          {/* Table Section */}
          <div className="mb-4 flex-grow">
            <div className="flex items-center gap-2 text-sm mb-2">
              <Checkbox
                checked={allItemsSelected}
                onCheckedChange={(checked) => handleSelectAllChange(checked as boolean)}
              />
              <span>全選択↓</span>
            </div>
            <div className="border border-gray-400 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-400 p-1 w-12">登録</th>
                    <th className="border border-gray-400 p-1 w-20">仕入先コード</th>
                    <th className="border border-gray-400 p-1 w-20">仕入先名</th>
                    <th className="border border-gray-400 p-1 w-16">発注方法</th>
                    <th className="border border-gray-400 p-1 w-24">メーカー連絡メモ</th>
                    <th className="border border-gray-400 p-1 w-20">得意先名</th>
                    <th className="border border-gray-400 p-1 w-16">管理コード</th>
                    <th className="border border-gray-400 p-1 w-16">メーカーコード</th>
                    <th className="border border-gray-400 p-1 w-32">商品名</th>
                    <th className="border border-gray-400 p-1 w-20">規格(型番)</th>
                    <th className="border border-gray-400 p-1 w-20">容量(入数/単位)</th>
                    <th className="border border-gray-400 p-1 w-16">注文数</th>
                    <th className="border border-gray-400 p-1 w-20">原単価</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-400 p-1 text-center">
                        <Checkbox
                          checked={selectedItems.includes(indexOfFirstItem + index)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(indexOfFirstItem + index, checked as boolean)
                          }
                        />
                      </td>
                      <td className="border border-gray-400 p-1">{row.supplierCode}</td>
                      <td className="border border-gray-400 p-1">{row.company}</td>
                      <td className="border border-gray-400 p-1">{row.method}</td>
                      <td className="border border-gray-400 p-1">{row.orderCode}</td>
                      <td className="border border-gray-400 p-1">{row.endUser}</td>
                      <td className="border border-gray-400 p-1"></td>
                      <td className="border border-gray-400 p-1">{row.makerCode}</td>
                      <td className="border border-gray-400 p-1">{row.productName}</td>
                      <td className="border border-gray-400 p-1">{row.specification}</td>
                      <td className="border border-gray-400 p-1">{row.quantity}</td>
                      <td className="border border-gray-400 p-1">{row.orderQty}</td>
                      <td className="border border-gray-400 p-1">{row.unitPrice}</td>
                    </tr>
                  ))}
                  {/* Empty rows to fill up to itemsPerPage */}
                  {Array.from({ length: itemsPerPage - currentItems.length }).map((_, index) => (
                    <tr key={`empty-${index}`}>
                      <td className="border border-gray-400 p-1 text-center">
                        <Checkbox />
                      </td>
                      {[...Array(12)].map((_, cellIndex) => (
                        <td key={cellIndex} className="border border-gray-400 p-1 h-8"></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4 mb-4 bg-[#FAF5E9] relative z-10">
              <Button
                variant="outline"
                className="h-8 text-sm bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                前へ
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  className={cn(
                    "h-8 w-8 text-sm",
                    currentPage === i + 1
                      ? "bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                      : "bg-gray-800 hover:bg-gray-700 text-white border-gray-600",
                  )}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                className="h-8 text-sm bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                次へ
              </Button>
            </div>
          )}
          {/* Bottom Section */}
          <div className="flex items-center gap-4 mt-auto mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-900 font-medium">希望納期</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-32 justify-start text-left font-normal text-sm h-8",
                      !desiredDeliveryDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {desiredDeliveryDate ? format(desiredDeliveryDate, "yyyy/MM/dd") : <span>日付を選択</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={desiredDeliveryDate}
                    onSelect={setDesiredDeliveryDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="h-8 text-sm bg-blue-500 text-white hover:bg-blue-600">
                発注書印刷
              </Button>
              <Button variant="outline" className="h-8 text-sm bg-blue-500 text-white hover:bg-blue-600">
                WEB(CSV)
              </Button>
              <Button variant="outline" className="h-8 text-sm bg-blue-500 text-white hover:bg-blue-600">
                EDI
              </Button>
              <Button variant="outline" className="h-8 text-sm bg-blue-500 text-white hover:bg-blue-600">
                JD-NET
              </Button>
              <Button variant="outline" className="h-8 text-sm bg-blue-500 text-white hover:bg-blue-600">
                メール（PDF）
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Footer f11Mode={f11Mode} />
    </div>
  )
}
