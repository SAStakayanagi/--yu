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

interface OrderDetail {
  makerCode: string
  productName: string
  specification: string
  model: string
  quantity: string
  orderQty: string
  unitPrice: string
  orderNumber: string
  orderLineNumber: string
  customerName: string
  productCode: string
  detailProductName: string
  detailQuantity: string
  purchaseAmount: string
  issueType: string
  orderMemo: string
}

interface SupplierOrder {
  supplierCode: string
  company: string
  method: string
  orderCode: string
  endUser: string
  details: OrderDetail[]
}

export default function OrderedListView({ initialSearchParams }: OrderedListViewProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [desiredDeliveryDate, setDesiredDeliveryDate] = useState<Date | undefined>(new Date(2024, 10, 20))
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [f11Mode, setF11Mode] = useState<"ダイアログ検索" | "直接入力">("ダイアログ検索")

  const [tableData, setTableData] = useState<SupplierOrder[]>([
    {
      supplierCode: "0001",
      company: "仕入先1",
      method: "FAX",
      orderCode: "メモ1",
      endUser: "得意先1",
      details: [
        {
          makerCode: "M-1",
          productName: "商品名1-1",
          specification: "規格1-1",
          model: "モデル1-1",
          quantity: "1台",
          orderQty: "1",
          unitPrice: "1000",
          orderNumber: "R-001",
          orderLineNumber: "1",
          customerName: "顧客A",
          productCode: "P-001",
          detailProductName: "詳細商品名1-1",
          detailQuantity: "10",
          purchaseAmount: "10000",
          issueType: "未発行",
          orderMemo: "メモ1-1",
        },
        {
          makerCode: "M-2",
          productName: "商品名1-2",
          specification: "規格1-2",
          model: "モデル1-2",
          quantity: "2台",
          orderQty: "2",
          unitPrice: "2000",
          orderNumber: "R-002",
          orderLineNumber: "2",
          customerName: "顧客B",
          productCode: "P-002",
          detailProductName: "詳細商品名1-2",
          detailQuantity: "20",
          purchaseAmount: "20000",
          issueType: "発行済",
          orderMemo: "メモ1-2",
        },
      ],
    },
    {
      supplierCode: "0002",
      company: "仕入先2",
      method: "WEB",
      orderCode: "メモ2",
      endUser: "得意先2",
      details: [
        {
          makerCode: "M-3",
          productName: "商品名2-1",
          specification: "規格2-1",
          model: "モデル2-1",
          quantity: "3台",
          orderQty: "3",
          unitPrice: "3000",
          orderNumber: "R-003",
          orderLineNumber: "1",
          customerName: "顧客C",
          productCode: "P-003",
          detailProductName: "詳細商品名2-1",
          detailQuantity: "30",
          purchaseAmount: "30000",
          issueType: "未発行",
          orderMemo: "メモ2-1",
        },
      ],
    },
    {
      supplierCode: "0003",
      company: "仕入先3",
      method: "EDI",
      orderCode: "メモ3",
      endUser: "得意先3",
      details: [
        {
          makerCode: "M-4",
          productName: "商品名3-1",
          specification: "規格3-1",
          model: "モデル3-1",
          quantity: "1台",
          orderQty: "1",
          unitPrice: "4000",
          orderNumber: "R-004",
          orderLineNumber: "1",
          customerName: "顧客D",
          productCode: "P-004",
          detailProductName: "詳細商品名3-1",
          detailQuantity: "40",
          purchaseAmount: "40000",
          issueType: "発行済",
          orderMemo: "メモ3-1",
        },
        {
          makerCode: "M-5",
          productName: "商品名3-2",
          specification: "規格3-2",
          model: "モデル3-2",
          quantity: "2台",
          orderQty: "2",
          unitPrice: "5000",
          orderNumber: "R-005",
          orderLineNumber: "2",
          customerName: "顧客E",
          productCode: "P-005",
          detailProductName: "詳細商品名3-2",
          detailQuantity: "50",
          purchaseAmount: "50000",
          issueType: "未発行",
          orderMemo: "メモ3-2",
        },
        {
          makerCode: "M-6",
          productName: "商品名3-3",
          specification: "規格3-3",
          model: "モデル3-3",
          quantity: "3台",
          orderQty: "3",
          unitPrice: "6000",
          orderNumber: "R-006",
          orderLineNumber: "3",
          customerName: "顧客F",
          productCode: "P-006",
          detailProductName: "詳細商品名3-3",
          detailQuantity: "60",
          purchaseAmount: "60000",
          issueType: "発行済",
          orderMemo: "メモ3-3",
        },
      ],
    },
    {
      supplierCode: "0004",
      company: "仕入先4",
      method: "メール",
      orderCode: "メモ4",
      endUser: "得意先4",
      details: [
        {
          makerCode: "M-7",
          productName: "商品名4-1",
          specification: "規格4-1",
          model: "モデル4-1",
          quantity: "1台",
          orderQty: "1",
          unitPrice: "7000",
          orderNumber: "R-007",
          orderLineNumber: "1",
          customerName: "顧客G",
          productCode: "P-007",
          detailProductName: "詳細商品名4-1",
          detailQuantity: "70",
          purchaseAmount: "70000",
          issueType: "未発行",
          orderMemo: "メモ4-1",
        },
      ],
    },
  ])

  const [filteredData, setFilteredData] = useState(tableData)

  useEffect(() => {
    setFilteredData(tableData)
  }, [tableData])

  const handleSearch = (searchParams: any) => {
    console.log("OrderedListView 検索条件:", searchParams)
    let filtered = [...tableData]

    if (searchParams.supplierCode) {
      filtered = filtered.filter(
        (item) =>
          item.supplierCode.includes(searchParams.supplierCode) ||
          item.company.includes(searchParams.supplierCode) ||
          item.company.toLowerCase().includes(searchParams.supplierCode.toLowerCase()),
      )
    }

    if (searchParams.supplierName) {
      filtered = filtered.filter((item) => item.company.includes(searchParams.supplierName))
    }

    if (searchParams.orderMethod) {
      filtered = filtered.filter((item) => item.method === searchParams.orderMethod)
    }

    if (searchParams.staffCode) {
      filtered = filtered.filter((item) => item.staffCode === searchParams.staffCode)
    }

    if (searchParams.makerCode) {
      filtered = filtered.filter((item) =>
        item.details.some((detail) => detail.makerCode.includes(searchParams.makerCode)),
      )
    }

    if (searchParams.orderDateStart || searchParams.orderDateEnd) {
      console.log("日付範囲でフィルタリング:", searchParams.orderDateStart, "〜", searchParams.orderDateEnd)
    }

    setFilteredData(filtered)
    setCurrentPage(1)
    console.log(`OrderedListView 検索結果: ${filtered.length}件`)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

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
          <OrderSearchForm
            initialSearchParams={initialSearchParams}
            onSearch={handleSearch}
            onF11ModeChange={setF11Mode}
          />
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
                    <th className="border border-gray-400 p-1 w-16">メーカーコード</th>
                    <th className="border border-gray-400 p-1 w-32">商品名</th>
                    <th className="border border-gray-400 p-1 w-20">規格(型番)</th>
                    <th className="border border-gray-400 p-1 w-20">容量(入数/単位)</th>
                    <th className="border border-gray-400 p-1 w-16">注文数</th>
                    <th className="border border-gray-400 p-1 w-20">原単価</th>
                    <th className="border border-gray-400 p-1 w-16">直送区分</th>
                    <th className="border border-gray-400 p-1 w-20">受注番号</th>
                    <th className="border border-gray-400 p-1 w-20">受注行番号</th>
                    <th className="border border-gray-400 p-1 w-24">得意先名</th>
                    <th className="border border-gray-400 p-1 w-20">商品コード</th>
                    <th className="border border-gray-400 p-1 w-32">商品名</th>
                    <th className="border border-gray-400 p-1 w-16">数量</th>
                    <th className="border border-gray-400 p-1 w-20">仕入金額</th>
                    <th className="border border-gray-400 p-1 w-20">発行区分</th>
                    <th className="border border-gray-400 p-1 w-32">発注書メモ欄</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((supplier, supplierIndex) =>
                    supplier.details.map((detail, detailIndex) => (
                      <tr key={`${indexOfFirstItem + supplierIndex}-${detailIndex}`} className="hover:bg-gray-50">
                        {detailIndex === 0 && (
                          <>
                            <td
                              key={`checkbox-${indexOfFirstItem + supplierIndex}`}
                              className="border border-gray-400 p-1 text-center bg-blue-50"
                              rowSpan={supplier.details.length}
                            >
                              <Checkbox
                                checked={selectedItems.includes(indexOfFirstItem + supplierIndex)}
                                onCheckedChange={(checked) =>
                                  handleCheckboxChange(indexOfFirstItem + supplierIndex, checked as boolean)
                                }
                              />
                            </td>
                            <td
                              key={`code-${indexOfFirstItem + supplierIndex}`}
                              className="border border-gray-400 p-1 bg-blue-50"
                              rowSpan={supplier.details.length}
                            >
                              {supplier.supplierCode}
                            </td>
                            <td
                              key={`company-${indexOfFirstItem + supplierIndex}`}
                              className="border border-gray-400 p-1 bg-blue-50"
                              rowSpan={supplier.details.length}
                            >
                              {supplier.company}
                            </td>
                            <td
                              key={`method-${indexOfFirstItem + supplierIndex}`}
                              className="border border-gray-400 p-1 bg-blue-50"
                              rowSpan={supplier.details.length}
                            >
                              {supplier.method}
                            </td>
                            <td
                              key={`order-${indexOfFirstItem + supplierIndex}`}
                              className="border border-gray-400 p-1 bg-blue-50"
                              rowSpan={supplier.details.length}
                            >
                              {supplier.orderCode}
                            </td>
                            <td
                              key={`user-${indexOfFirstItem + supplierIndex}`}
                              className="border border-gray-400 p-1 bg-blue-50"
                              rowSpan={supplier.details.length}
                            >
                              {supplier.endUser}
                            </td>
                          </>
                        )}
                        <td className="border border-gray-400 p-1">{detail.makerCode}</td>
                        <td className="border border-gray-400 p-1">{detail.productName}</td>
                        <td className="border border-gray-400 p-1">{detail.specification}</td>
                        <td className="border border-gray-400 p-1">{detail.quantity}</td>
                        <td className="border border-gray-400 p-1">{detail.orderQty}</td>
                        <td className="border border-gray-400 p-1">{detail.unitPrice}</td>
                        <td className="border border-gray-400 p-1"></td>
                        <td className="border border-gray-400 p-1">{detail.orderNumber}</td>
                        <td className="border border-gray-400 p-1">{detail.orderLineNumber}</td>
                        <td className="border border-gray-400 p-1">{detail.customerName}</td>
                        <td className="border border-gray-400 p-1">{detail.productCode}</td>
                        <td className="border border-gray-400 p-1">{detail.detailProductName}</td>
                        <td className="border border-gray-400 p-1">{detail.detailQuantity}</td>
                        <td className="border border-gray-400 p-1">{detail.purchaseAmount}</td>
                        <td className="border border-gray-400 p-1">{detail.issueType}</td>
                        <td className="border border-gray-400 p-1">{detail.orderMemo}</td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
