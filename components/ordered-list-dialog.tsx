"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import OrderSearchForm from "@/components/order-search-form" // Import the refactored OrderSearchForm
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface OrderedListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialSearchParams?: { [key: string]: string | string[] | undefined }
}

export default function OrderedListDialog({ open, onOpenChange, initialSearchParams }: OrderedListDialogProps) {
  const dialogSourceData = [
    {
      company: "アスワン", // Existing value
      method: "FAX",
      orderCode: "ロット指定：111",
      staffCode: "001",
      orderFormNo: "000001",
      orderNumber: "",
      endUser: "●●大学",
      makerCode: "63-6334-36-30",
      productName: "分析天びん 320g",
      specification: "ML304T/00",
      model: "ML304T/00",
      quantity: "1台",
      orderQty: "2",
      unitPrice: "800,000",
    },
    {
      company: "アスワン", // Existing value
      method: "FAX",
      orderCode: "特注品",
      staffCode: "002",
      orderFormNo: "000002",
      orderNumber: "",
      endUser: "△△研究所",
      makerCode: "12-3456-78-90",
      productName: "pHメーター",
      specification: "PH-200",
      model: "PH-200",
      quantity: "1個",
      orderQty: "1",
      unitPrice: "50,000",
    },
    {
      company: "和光", // Existing value
      method: "FAX",
      orderCode: "緊急発注",
      staffCode: "003",
      orderFormNo: "000003",
      orderNumber: "",
      endUser: "□□病院",
      makerCode: "98-7654-32-10",
      productName: "遠心分離機",
      specification: "CEN-1000",
      model: "CEN-1000",
      quantity: "1台",
      orderQty: "1",
      unitPrice: "1,200,000",
    },
    {
      company: "キシダ化学", // Existing value
      method: "FAX",
      orderCode: "定期購入",
      staffCode: "004",
      orderFormNo: "000004",
      orderNumber: "",
      endUser: "☆☆製薬",
      makerCode: "45-6789-01-23",
      productName: "試薬A",
      specification: "GR-100",
      model: "GR-100",
      quantity: "500g/瓶",
      orderQty: "10",
      unitPrice: "10,000",
    },
    // ここからJD(EDI)のデータ
    {
      company: "アスワン", // Existing value
      method: "JD(EDI)",
      orderCode: "ロット指定：112",
      staffCode: "005",
      orderFormNo: "000005",
      orderNumber: "",
      endUser: "●●大学",
      makerCode: "63-6334-36-30",
      productName: "分析天びん 320g",
      specification: "ML304T/00",
      model: "ML304T/00",
      quantity: "1台",
      orderQty: "2",
      unitPrice: "800,000",
    },
    {
      company: "アスワン", // Existing value
      method: "JD(EDI)",
      orderCode: "特注品",
      staffCode: "006",
      orderFormNo: "000006",
      orderNumber: "",
      endUser: "△△研究所",
      makerCode: "12-3456-78-90",
      productName: "pHメーター",
      specification: "PH-200",
      model: "PH-200",
      quantity: "1個",
      orderQty: "1",
      unitPrice: "50,000",
    },
    {
      company: "和光", // Existing value
      method: "JD(EDI)",
      orderCode: "緊急発注",
      staffCode: "007",
      orderFormNo: "000007",
      orderNumber: "",
      endUser: "□□病院",
      makerCode: "98-7654-32-10",
      productName: "遠心分離機",
      specification: "CEN-1000",
      model: "CEN-1000",
      quantity: "1台",
      orderQty: "1",
      unitPrice: "1,200,000",
    },
    {
      company: "キシダ化学", // Existing value
      method: "JD(EDI)",
      orderCode: "定期購入",
      staffCode: "008",
      orderFormNo: "000008",
      orderNumber: "",
      endUser: "☆☆製薬",
      makerCode: "45-6789-01-23",
      productName: "試薬A",
      specification: "GR-100",
      model: "GR-100",
      quantity: "500g/瓶",
      orderQty: "10",
      unitPrice: "10,000",
    },
    // ここからWG(EDI)のデータ
    {
      company: "アスワン", // Existing value
      method: "WG(EDI)",
      orderCode: "ロット指定：113",
      staffCode: "009",
      orderFormNo: "000009",
      orderNumber: "",
      endUser: "●●大学",
      makerCode: "63-6334-36-30",
      productName: "分析天びん 320g",
      specification: "ML304T/00",
      model: "ML304T/00",
      quantity: "1台",
      orderQty: "2",
      unitPrice: "800,000",
    },
    {
      company: "アスワン", // Existing value
      method: "WG(EDI)",
      orderCode: "特注品",
      staffCode: "010",
      orderFormNo: "000010",
      orderNumber: "",
      endUser: "△△研究所",
      makerCode: "12-3456-78-90",
      productName: "pHメーター",
      specification: "PH-200",
      model: "PH-200",
      quantity: "1個",
      orderQty: "1",
      unitPrice: "50,000",
    },
    {
      company: "和光", // Existing value
      method: "WG(EDI)",
      orderCode: "緊急発注",
      staffCode: "011",
      orderFormNo: "000011",
      orderNumber: "",
      endUser: "□□病院",
      makerCode: "98-7654-32-10",
      productName: "遠心分離機",
      specification: "CEN-1000",
      model: "CEN-1000",
      quantity: "1台",
      orderQty: "1",
      unitPrice: "1,200,000",
    },
    {
      company: "キシダ化学", // Existing value
      method: "WG(EDI)",
      orderCode: "定期購入",
      staffCode: "012",
      orderFormNo: "000012",
      orderNumber: "",
      endUser: "☆☆製薬",
      makerCode: "45-6789-01-23",
      productName: "試薬A",
      specification: "GR-100",
      model: "GR-100",
      quantity: "500g/瓶",
      orderQty: "10",
      unitPrice: "10,000",
    },
    // ここからメールのデータ
    {
      company: "アスワン", // Existing value
      method: "メール",
      orderCode: "ロット指定：114",
      staffCode: "013",
      orderFormNo: "000013",
      orderNumber: "",
      endUser: "●●大学",
      makerCode: "63-6334-36-30",
      productName: "分析天びん 320g",
      specification: "ML304T/00",
      model: "ML304T/00",
      quantity: "1台",
      orderQty: "2",
      unitPrice: "800,000",
    },
    {
      company: "アスワン", // Existing value
      method: "メール",
      orderCode: "特注品",
      staffCode: "014",
      orderFormNo: "000014",
      orderNumber: "",
      endUser: "△△研究所",
      makerCode: "12-3456-78-90",
      productName: "pHメーター",
      specification: "PH-200",
      model: "PH-200",
      quantity: "1個",
      orderQty: "1",
      unitPrice: "50,000",
    },
    {
      company: "和光", // Existing value
      method: "メール",
      orderCode: "緊急発注",
      staffCode: "015",
      orderFormNo: "000015",
      orderNumber: "",
      endUser: "□□病院",
      makerCode: "98-7654-32-10",
      productName: "遠心分離機",
      specification: "CEN-1000",
      model: "CEN-1000",
      quantity: "1台",
      unitPrice: "1,200,000",
    },
    {
      company: "キシダ化学", // Existing value
      method: "メール",
      orderCode: "定期購入",
      staffCode: "016",
      orderFormNo: "000016",
      orderNumber: "",
      endUser: "☆☆製薬",
      makerCode: "45-6789-01-23",
      productName: "試薬A",
      specification: "GR-100",
      model: "GR-100",
      quantity: "500g/瓶",
      orderQty: "10",
      unitPrice: "10,000",
    },
    // ここからWEBのデータ
    {
      company: "アスワン", // Existing value
      method: "WEB",
      orderCode: "ロット指定：115",
      staffCode: "017",
      orderFormNo: "000017",
      orderNumber: "",
      endUser: "●●大学",
      makerCode: "63-6334-36-30",
      productName: "分析天びん 320g",
      specification: "ML304T/00",
      model: "ML304T/00",
      quantity: "1台",
      unitPrice: "800,000",
      orderQty: "2",
    },
    {
      company: "アスワン", // Existing value
      method: "WEB",
      orderCode: "特注品",
      staffCode: "018",
      orderFormNo: "000018",
      orderNumber: "",
      endUser: "△△研究所",
      makerCode: "12-3456-78-90",
      productName: "pHメーター",
      specification: "PH-200",
      model: "PH-200",
      quantity: "1個",
      orderQty: "1",
      unitPrice: "50,000",
    },
    {
      company: "和光", // Existing value
      method: "WEB",
      orderCode: "緊急発注",
      staffCode: "019",
      orderFormNo: "000019",
      orderNumber: "",
      endUser: "□□病院",
      makerCode: "98-7654-32-10",
      productName: "遠心分離機",
      specification: "CEN-1000",
      model: "CEN-1000",
      quantity: "1台",
      unitPrice: "1,200,000",
    },
    {
      company: "キシダ化学", // Existing value
      method: "WEB",
      orderCode: "定期購入",
      staffCode: "020",
      orderFormNo: "000020",
      orderNumber: "",
      endUser: "☆☆製薬",
      makerCode: "45-6789-01-23",
      productName: "試薬A",
      specification: "GR-100",
      model: "GR-100",
      quantity: "500g/瓶",
      orderQty: "10",
      unitPrice: "10,000",
    },
  ].map((item, index) => ({
    ...item,
    // Cycle through the desired company names
    company: ["アスワン", "和光", "キシダ化学"][index % 3],
    orderNumber: `${item.staffCode.padStart(3, "0")}-${item.orderFormNo.padStart(6, "0")}`,
  }))

  const [filteredData, setFilteredData] = useState(dialogSourceData)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [hiddenItems, setHiddenItems] = useState<number[]>([])
  const [isHiddenDetailsDialogOpen, setIsHiddenDetailsDialogOpen] = useState(false)

  useEffect(() => {
    // Reset filtered data when dialog opens or initial search params change
    setFilteredData(dialogSourceData)
    setCurrentPage(1) // Reset pagination
    setSelectedItems([]) // Clear selections
    setHiddenItems([]) // Clear hidden items when dialog reopens
  }, [open, initialSearchParams]) // Depend on 'open' and 'initialSearchParams'

  const handleSearch = (searchParams: any) => {
    console.log("OrderedListDialog 検索条件:", searchParams)
    let filtered = [...dialogSourceData]

    if (searchParams.supplierCode) {
      filtered = filtered.filter(
        (item) =>
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
      filtered = filtered.filter((item) => item.makerCode.includes(searchParams.makerCode))
    }
    if (searchParams.orderFormNo) {
      filtered = filtered.filter((item) => item.orderFormNo.includes(searchParams.orderFormNo))
    }
    // Date filtering (dummy for now, implement actual date comparison if needed)
    if (searchParams.orderDateStart || searchParams.orderDateEnd) {
      console.log(
        "日付範囲でフィルタリング (ダイアログ内):",
        searchParams.orderDateStart,
        "〜",
        searchParams.orderDateEnd,
      )
    }

    setFilteredData(filtered)
    setCurrentPage(1) // Reset to first page after search
    setSelectedItems([]) // Clear selections after new search
    console.log(`ダイアログ内検索結果: ${filtered.length}件`)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleCheckboxChange = (index: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, indexOfFirstItem + index])
    } else {
      setSelectedItems(selectedItems.filter((i) => i !== indexOfFirstItem + index))
    }
  }

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredData.map((_, index) => index))
    } else {
      setSelectedItems([])
    }
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  const allItemsSelected = selectedItems.length === filteredData.length && filteredData.length > 0

  const handleHideSelected = () => {
    if (selectedItems.length === 0) {
      console.log("No items selected to hide")
      return
    }

    // Add selected items to hidden items
    setHiddenItems((prev) => [...prev, ...selectedItems])

    // Clear selections after hiding
    setSelectedItems([])

    console.log(`Hidden ${selectedItems.length} items`)
  }

  const visibleCurrentItems = currentItems.filter((_, index) => !hiddenItems.includes(indexOfFirstItem + index))

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl h-[95vh] flex flex-col bg-[#FAF5E9] p-6 rounded-lg shadow-lg">
          <DialogHeader className="bg-blue-600 text-white px-6 py-4 flex items-center justify-start">
            <DialogTitle className="text-xl font-bold text-left w-full">発注履歴検索</DialogTitle>
          </DialogHeader>
          <OrderSearchForm
            initialSearchParams={initialSearchParams}
            isDialogContext={true}
            onSearch={handleSearch} // Pass the dialog's own search handler
          />
          <div className="mb-2 flex-grow overflow-y-auto">
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
                    <th className="border border-gray-400 p-1 w-20">仕入先名</th>
                    <th className="border border-gray-400 p-1 w-16">発注方法</th>
                    <th className="border border-gray-400 p-1 w-40 whitespace-nowrap">メーカー連絡メモ</th>
                    <th className="border border-gray-400 p-1 w-20">注文番号</th>
                    <th className="border border-gray-400 p-1 w-20">得意先名</th>
                    <th className="border border-gray-400 p-1 w-32 whitespace-nowrap">メーカーコード</th>
                    <th className="border border-gray-400 p-1 w-32">商品名</th>
                    <th className="border border-gray-400 p-1 w-20">規格(型番)</th>
                    <th className="border border-gray-400 p-1 w-40 whitespace-nowrap">容量(入数/単位)</th>
                    <th className="border border-gray-400 p-1 w-16">注文数</th>
                    <th className="border border-gray-400 p-1 w-20">原単価</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleCurrentItems.map((row, index) => {
                    // Find the original index in the filtered data
                    const originalIndex = currentItems.findIndex((item) => item === row)
                    const actualIndex = indexOfFirstItem + originalIndex

                    return (
                      <tr key={actualIndex} className="hover:bg-gray-50">
                        <td className="border border-gray-400 py-0.5 px-1 text-center">
                          <Checkbox
                            checked={selectedItems.includes(actualIndex)}
                            onCheckedChange={(checked) => handleCheckboxChange(actualIndex, checked as boolean)}
                          />
                        </td>
                        <td className="border border-gray-400 py-0.5 px-1">{row.company}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{row.method}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{row.orderCode}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{row.orderNumber}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{row.endUser}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{row.makerCode}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{row.productName}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{row.specification}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{row.quantity}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{row.orderQty}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{row.unitPrice}</td>
                      </tr>
                    )
                  })}
                  {/* Empty rows */}
                  {Array.from({ length: itemsPerPage - visibleCurrentItems.length }).map((_, index) => (
                    <tr key={`empty-${index}`}>
                      <td className="border border-gray-400 py-0.5 px-1 text-center">
                        <Checkbox />
                      </td>
                      {[...Array(11)].map((_, cellIndex) => (
                        <td key={cellIndex} className="border border-gray-400 py-0.5 px-1 h-8"></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination Controls for Dialog */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-2 mt-2">
              <Button
                variant="outline"
                className="h-7 text-xs bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
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
                    "h-7 w-7 text-xs",
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
                className="h-7 text-xs bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                次へ
              </Button>
            </div>
          )}
          {/* Bottom Section */}
          <div className="flex items-center gap-4 mt-auto justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="h-8 text-sm bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleHideSelected}
                disabled={selectedItems.length === 0}
              >
                選択非表示
              </Button>
              <Button
                variant="outline"
                className="h-8 text-sm bg-gray-500 text-white hover:bg-gray-600"
                onClick={() => setIsHiddenDetailsDialogOpen(true)}
                disabled={hiddenItems.length === 0}
              >
                非表示明細
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="h-8 text-sm bg-blue-500 text-white hover:bg-blue-600">
                発注書印刷(再)
              </Button>
              <Button variant="outline" className="h-8 text-sm bg-blue-500 text-white hover:bg-blue-600">
                WEB(CSV)
              </Button>
              <Button variant="outline" className="h-8 text-sm bg-blue-500 text-white hover:bg-blue-600">
                メールPDF(再)
              </Button>
            </div>
          </div>
          <DialogFooter className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 text-sm bg-white hover:bg-gray-100 text-gray-900 border-gray-300"
            >
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isHiddenDetailsDialogOpen} onOpenChange={setIsHiddenDetailsDialogOpen}>
        <DialogContent className="max-w-7xl h-[95vh] flex flex-col bg-[#FAF5E9] p-6 rounded-lg shadow-lg">
          <DialogHeader className="bg-blue-600 text-white px-6 py-4 flex items-center justify-start">
            <DialogTitle className="text-xl font-bold text-left w-full">非表示明細一覧</DialogTitle>
          </DialogHeader>
          <div className="mb-2 flex-grow overflow-y-auto">
            <div className="border border-gray-400 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-400 p-1 w-20">仕入先名</th>
                    <th className="border border-gray-400 p-1 w-16">発注方法</th>
                    <th className="border border-gray-400 p-1 w-40 whitespace-nowrap">メーカー連絡メモ</th>
                    <th className="border border-gray-400 p-1 w-20">注文番号</th>
                    <th className="border border-gray-400 p-1 w-20">得意先名</th>
                    <th className="border border-gray-400 p-1 w-32 whitespace-nowrap">メーカーコード</th>
                    <th className="border border-gray-400 p-1 w-32">商品名</th>
                    <th className="border border-gray-400 p-1 w-20">規格(型番)</th>
                    <th className="border border-gray-400 p-1 w-40 whitespace-nowrap">容量(入数/単位)</th>
                    <th className="border border-gray-400 p-1 w-16">注文数</th>
                    <th className="border border-gray-400 p-1 w-20">原単価</th>
                    <th className="border border-gray-400 p-1 w-16">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {hiddenItems.map((hiddenIndex) => {
                    const hiddenItem = dialogSourceData[hiddenIndex]
                    if (!hiddenItem) return null

                    return (
                      <tr key={hiddenIndex} className="hover:bg-gray-50">
                        <td className="border border-gray-400 py-0.5 px-1">{hiddenItem.company}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{hiddenItem.method}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{hiddenItem.orderCode}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{hiddenItem.orderNumber}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{hiddenItem.endUser}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{hiddenItem.makerCode}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{hiddenItem.productName}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{hiddenItem.specification}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{hiddenItem.quantity}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{hiddenItem.orderQty}</td>
                        <td className="border border-gray-400 py-0.5 px-1">{hiddenItem.unitPrice}</td>
                        <td className="border border-gray-400 py-0.5 px-1 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs bg-green-500 text-white hover:bg-green-600"
                            onClick={() => {
                              // Restore the item (remove from hidden items)
                              setHiddenItems((prev) => prev.filter((index) => index !== hiddenIndex))
                            }}
                          >
                            復元
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                  {hiddenItems.length === 0 && (
                    <tr>
                      <td colSpan={12} className="border border-gray-400 py-4 px-1 text-center text-gray-500">
                        非表示にした明細はありません
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setIsHiddenDetailsDialogOpen(false)}
              className="h-9 text-sm bg-white hover:bg-gray-100 text-gray-900 border-gray-300"
            >
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
