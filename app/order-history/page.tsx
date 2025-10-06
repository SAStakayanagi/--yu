"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import OrderSearchForm from "@/components/order-search-form"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import OrderHistoryDetailDialog from "@/components/order-history-detail-dialog"

const generateOrderHeaderData = () => {
  const orders = [
    {
      orderNumber: "001-000001",
      orderDate: "2024/01/15",
      supplierCode: "SUP001",
      supplierName: "アスワン",
      orderAmountExTax: 1600000,
      consumptionTax: 160000,
      orderAmountIncTax: 1760000,
      orderClassification: "通常発注",
      directDeliveryClassification: "通常",
      orderMemo: "ロット指定：111",
      details: [
        {
          orderNumber: "001-000001",
          orderFormNo: "000001",
          orderReceiptNumber: "REC001",
          orderLineNumber: 1,
          customerName: "●●大学",
          productCode: "63-6334-36-30",
          productName: "分析天びん 320g",
          quantity: 2,
          purchaseAmount: 800000,
          issueClassification: "発行済",
          orderMemo: "ロット指定：111",
        },
        {
          orderNumber: "001-000001",
          orderFormNo: "000001",
          orderReceiptNumber: "REC001",
          orderLineNumber: 2,
          customerName: "●●大学",
          productCode: "63-6334-36-31",
          productName: "分析天びん用アクセサリー",
          quantity: 1,
          purchaseAmount: 300000,
          issueClassification: "発行済",
          orderMemo: "ロット指定：111",
        },
        {
          orderNumber: "001-000001",
          orderFormNo: "000001",
          orderReceiptNumber: "REC001",
          orderLineNumber: 3,
          customerName: "●●大学",
          productCode: "63-6334-36-32",
          productName: "校正用分銅セット",
          quantity: 1,
          purchaseAmount: 500000,
          issueClassification: "発行済",
          orderMemo: "ロット指定：111",
        },
      ],
    },
    {
      orderNumber: "002-000002",
      orderDate: "2024/01/16",
      supplierCode: "SUP001",
      supplierName: "アスワン",
      orderAmountExTax: 50000,
      consumptionTax: 5000,
      orderAmountIncTax: 55000,
      orderClassification: "特注発注",
      directDeliveryClassification: "通常",
      orderMemo: "特注品",
      details: [
        {
          orderNumber: "002-000002",
          orderFormNo: "000002",
          orderReceiptNumber: "REC002",
          orderLineNumber: 1,
          customerName: "△△研究所",
          productCode: "12-3456-78-90",
          productName: "pHメーター",
          quantity: 1,
          purchaseAmount: 50000,
          issueClassification: "発行済",
          orderMemo: "特注品",
        },
        {
          orderNumber: "002-000002",
          orderFormNo: "000002",
          orderReceiptNumber: "REC002",
          orderLineNumber: 2,
          customerName: "△△研究所",
          productCode: "12-3456-78-91",
          productName: "pHメーター用電極",
          quantity: 2,
          purchaseAmount: 30000,
          issueClassification: "発行済",
          orderMemo: "特注品",
        },
        {
          orderNumber: "002-000002",
          orderFormNo: "000002",
          orderReceiptNumber: "REC002",
          orderLineNumber: 3,
          customerName: "△△研究所",
          productCode: "12-3456-78-92",
          productName: "標準液セット",
          quantity: 1,
          purchaseAmount: 15000,
          issueClassification: "発行済",
          orderMemo: "特注品",
        },
        {
          orderNumber: "002-000002",
          orderFormNo: "000002",
          orderReceiptNumber: "REC002",
          orderLineNumber: 4,
          customerName: "△△研究所",
          productCode: "12-3456-78-93",
          productName: "メンテナンスキット",
          quantity: 1,
          purchaseAmount: 25000,
          issueClassification: "発行済",
          orderMemo: "特注品",
        },
      ],
    },
    {
      orderNumber: "003-000003",
      orderDate: "2024/01/17",
      supplierCode: "SUP002",
      supplierName: "和光",
      orderAmountExTax: 1200000,
      consumptionTax: 120000,
      orderAmountIncTax: 1320000,
      orderClassification: "緊急発注",
      directDeliveryClassification: "通常",
      orderMemo: "緊急発注",
      details: [
        {
          orderNumber: "003-000003",
          orderFormNo: "000003",
          orderReceiptNumber: "REC003",
          orderLineNumber: 1,
          customerName: "□□病院",
          productCode: "98-7654-32-10",
          productName: "遠心分離機",
          quantity: 1,
          purchaseAmount: 1200000,
          issueClassification: "発行済",
          orderMemo: "緊急発注",
        },
        {
          orderNumber: "003-000003",
          orderFormNo: "000003",
          orderReceiptNumber: "REC003",
          orderLineNumber: 2,
          customerName: "□□病院",
          productCode: "98-7654-32-11",
          productName: "遠心分離機用ローター",
          quantity: 2,
          purchaseAmount: 400000,
          issueClassification: "発行済",
          orderMemo: "緊急発注",
        },
        {
          orderNumber: "003-000003",
          orderFormNo: "000003",
          orderReceiptNumber: "REC003",
          orderLineNumber: 3,
          customerName: "□□病院",
          productCode: "98-7654-32-12",
          productName: "遠心管セット",
          quantity: 5,
          purchaseAmount: 150000,
          issueClassification: "発行済",
          orderMemo: "緊急発注",
        },
        {
          orderNumber: "003-000003",
          orderFormNo: "000003",
          orderReceiptNumber: "REC003",
          orderLineNumber: 4,
          customerName: "□□病院",
          productCode: "98-7654-32-13",
          productName: "冷却ユニット",
          quantity: 1,
          purchaseAmount: 300000,
          issueClassification: "発行済",
          orderMemo: "緊急発注",
        },
        {
          orderNumber: "003-000003",
          orderFormNo: "000003",
          orderReceiptNumber: "REC003",
          orderLineNumber: 5,
          customerName: "□□病院",
          productCode: "98-7654-32-14",
          productName: "保守契約",
          quantity: 1,
          purchaseAmount: 200000,
          issueClassification: "発行済",
          orderMemo: "緊急発注",
        },
      ],
    },
    {
      orderNumber: "004-000004",
      orderDate: "2024/01/18",
      supplierCode: "SUP003",
      supplierName: "キシダ化学",
      orderAmountExTax: 100000,
      consumptionTax: 10000,
      orderAmountIncTax: 110000,
      orderClassification: "定期発注",
      directDeliveryClassification: "直送",
      orderMemo: "定期購入",
      details: [
        {
          orderNumber: "004-000004",
          orderFormNo: "000004",
          orderReceiptNumber: "REC004",
          orderLineNumber: 1,
          customerName: "☆☆製薬",
          productCode: "45-6789-01-23",
          productName: "試薬A",
          quantity: 10,
          purchaseAmount: 50000,
          issueClassification: "発行済",
          orderMemo: "定期購入",
        },
        {
          orderNumber: "004-000004",
          orderFormNo: "000004",
          orderReceiptNumber: "REC004",
          orderLineNumber: 2,
          customerName: "☆☆製薬",
          productCode: "45-6789-01-24",
          productName: "試薬B",
          quantity: 5,
          purchaseAmount: 30000,
          issueClassification: "発行済",
          orderMemo: "定期購入",
        },
        {
          orderNumber: "004-000004",
          orderFormNo: "000004",
          orderReceiptNumber: "REC004",
          orderLineNumber: 3,
          customerName: "☆☆製薬",
          productCode: "45-6789-01-25",
          productName: "試薬C",
          quantity: 8,
          purchaseAmount: 20000,
          issueClassification: "発行済",
          orderMemo: "定期購入",
        },
      ],
    },
  ]

  // Generate more sample data
  const expandedOrders = []
  for (let i = 0; i < 25; i++) {
    const baseOrder = orders[i % orders.length]
    expandedOrders.push({
      ...baseOrder,
      orderNumber: `${String(i + 1).padStart(3, "0")}-${String(i + 1).padStart(6, "0")}`,
      orderDate: `2024/01/${String((i % 30) + 1).padStart(2, "0")}`,
      details: baseOrder.details.map((detail) => ({
        ...detail,
        orderNumber: `${String(i + 1).padStart(3, "0")}-${String(i + 1).padStart(6, "0")}`,
        orderFormNo: String(i + 1).padStart(6, "0"),
        orderReceiptNumber: `REC${String(i + 1).padStart(3, "0")}`,
      })),
    })
  }

  return expandedOrders
}

export default function OrderHistoryPage() {
  const router = useRouter()
  const orderHeaderData = generateOrderHeaderData()

  const [filteredData, setFilteredData] = useState(orderHeaderData)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPageOption, setItemsPerPageOption] = useState<50 | 100>(50)
  const [hiddenItems, setHiddenItems] = useState<number[]>([])
  const [isHiddenDetailsDialogOpen, setIsHiddenDetailsDialogOpen] = useState(false)
  const [f11Mode, setF11Mode] = useState<"ダイアログ検索" | "直接入力">("ダイアログ検索")
  const [isOrderHistoryDetailDialogOpen, setIsOrderHistoryDetailDialogOpen] = useState(false)

  const orderClassificationOptions = [
    { value: "1", label: "1:FAX" },
    { value: "2", label: "2:JD(EDI)" },
    { value: "3", label: "3:WG(EDI)" },
    { value: "4", label: "4:メール" },
    { value: "5", label: "5:WEB" },
  ]

  useEffect(() => {
    setFilteredData(orderHeaderData)
    setCurrentPage(1)
    setSelectedItems([])
    setHiddenItems([])
  }, [])

  const handleSearch = (searchParams: any) => {
    console.log("OrderHistory 検索条件:", searchParams)
    let filtered = [...orderHeaderData]

    if (searchParams.supplierCode) {
      filtered = filtered.filter(
        (item) =>
          item.supplierCode.includes(searchParams.supplierCode) ||
          item.supplierName.includes(searchParams.supplierCode),
      )
    }
    if (searchParams.supplierName) {
      filtered = filtered.filter((item) => item.supplierName.includes(searchParams.supplierName))
    }
    if (searchParams.orderNumber) {
      filtered = filtered.filter((item) => item.orderNumber.includes(searchParams.orderNumber))
    }
    if (searchParams.orderFormNo) {
      filtered = filtered.filter((item) =>
        item.details.some((detail) => detail.orderFormNo.includes(searchParams.orderFormNo)),
      )
    }

    setFilteredData(filtered)
    setCurrentPage(1)
    setSelectedItems([])
    console.log(`検索結果: ${filtered.length}件`)
  }

  const handleActionButtonClick = (action: string) => {
    if (selectedItems.length === 0) {
      alert("発注書を選択してください。")
      return
    }

    switch (action) {
      case "発注書印刷(再)":
        console.log("発注書印刷(再) clicked for items:", selectedItems)
        // 発注書印刷(再)の処理
        break
      case "WEB(CSV)":
        console.log("WEB(CSV) clicked for items:", selectedItems)
        // WEB(CSV)の処理
        break
      case "メール・PDF(再)":
        console.log("メール・PDF(再) clicked for items:", selectedItems)
        // メール・PDF(再)の処理
        break
      default:
        break
    }
  }

  const indexOfLastItem = currentPage * itemsPerPageOption
  const indexOfFirstItem = indexOfLastItem - itemsPerPageOption
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPageOption)

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

    setHiddenItems((prev) => [...prev, ...selectedItems])
    setSelectedItems([])
    console.log(`Hidden ${selectedItems.length} items`)
  }

  const handleDetailDisplay = () => {
    if (selectedItems.length === 0) {
      alert("発注書を選択してください。")
      return
    }
    setIsOrderHistoryDetailDialogOpen(true)
  }

  const selectedOrders = useMemo(() => {
    return selectedItems.map((index) => filteredData[index])
  }, [selectedItems, filteredData])

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#FAF5E9" }}>
      <Header title="発注履歴検索" />
      <div className="flex-grow flex flex-col p-6 pb-20">
        <OrderSearchForm
          isDialogContext={true}
          isOrderHistoryContext={true}
          onSearch={handleSearch}
          onF11ModeChange={setF11Mode}
        />

        <div className="mb-2 flex-grow overflow-y-auto">
          <div className="flex items-center gap-2 text-sm mb-2">
            <Checkbox
              checked={allItemsSelected}
              onCheckedChange={(checked) => handleSelectAllChange(checked as boolean)}
            />
            <span>全選択↓</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs">表示件数:</span>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="itemsPerPage"
                  value="50"
                  checked={itemsPerPageOption === 50}
                  onChange={() => setItemsPerPageOption(50)}
                />
                <span className="text-xs">50件</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="itemsPerPage"
                  value="100"
                  checked={itemsPerPageOption === 100}
                  onChange={() => setItemsPerPageOption(100)}
                />
                <span className="text-xs">100件</span>
              </label>
            </div>
          </div>
          <div className="border border-gray-400 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ backgroundColor: "#FAF5E9" }} className="relative z-20 text-black">
                  <th className="border border-gray-400 px-1 py-0.5 w-12 relative z-20 text-black">登録</th>
                  <th className="border border-gray-400 px-1 py-0.5 w-24 relative z-20 text-black">発注番号</th>
                  <th className="border border-gray-400 px-1 py-0.5 w-20 relative z-20 text-black">発注日</th>
                  <th className="border border-gray-400 px-1 py-0.5 w-20 relative z-20 text-black">仕入先コード</th>
                  <th className="border border-gray-400 px-1 py-0.5 w-24 relative z-20 text-black">仕入先名</th>
                  <th className="border border-gray-400 px-1 py-0.5 w-24 relative z-20 text-black">発注金額(税抜)</th>
                  <th className="border border-gray-400 px-1 py-0.5 w-20 relative z-20 text-black">消費税額</th>
                  <th className="border border-gray-400 px-1 py-0.5 w-24 relative z-20 text-black">発注金額(税込)</th>
                  <th className="border border-gray-400 px-1 py-0.5 w-20 relative z-20 text-black">発注区分</th>
                  <th className="border border-gray-400 px-1 py-0.5 w-20 relative z-20 text-black">直送区分</th>
                  <th className="border border-gray-400 px-1 py-0.5 w-32 relative z-20 text-black">発注書メモ欄</th>
                </tr>
              </thead>
              <tbody className="relative z-20">
                {currentItems.map((row, index) => {
                  const actualIndex = indexOfFirstItem + index
                  const isHidden = hiddenItems.includes(actualIndex)
                  if (isHidden) return null

                  return (
                    <tr key={actualIndex} className="hover:bg-gray-50 relative z-20 text-black">
                      <td className="border border-gray-400 px-1 py-0.5 text-center relative z-20 text-black">
                        <Checkbox
                          checked={selectedItems.includes(actualIndex)}
                          onCheckedChange={(checked) => handleCheckboxChange(index, checked as boolean)}
                        />
                      </td>
                      <td className="border border-gray-400 px-1 py-0.5 relative z-20 text-black">{row.orderNumber}</td>
                      <td className="border border-gray-400 px-1 py-0.5 relative z-20 text-black">{row.orderDate}</td>
                      <td className="border border-gray-400 px-1 py-0.5 relative z-20 text-black">
                        {row.supplierCode}
                      </td>
                      <td className="border border-gray-400 px-1 py-0.5 relative z-20 text-black">
                        {row.supplierName}
                      </td>
                      <td className="border border-gray-400 px-1 py-0.5 text-right relative z-20 text-black">
                        {row.orderAmountExTax.toLocaleString()}
                      </td>
                      <td className="border border-gray-400 px-1 py-0.5 text-right relative z-20 text-black">
                        {row.consumptionTax.toLocaleString()}
                      </td>
                      <td className="border border-gray-400 px-1 py-0.5 text-right relative z-20 text-black">
                        {row.orderAmountIncTax.toLocaleString()}
                      </td>
                      <td className="border border-gray-400 px-1 py-0.5 relative z-20 text-black">
                        <select
                          className="w-full bg-transparent border-none text-xs text-black focus:outline-none"
                          value={row.orderClassification}
                          onChange={(e) => {
                            // Update the order classification
                            const updatedData = [...filteredData]
                            const originalIndex = orderHeaderData.findIndex(
                              (item) => item.orderNumber === row.orderNumber,
                            )
                            if (originalIndex !== -1) {
                              orderHeaderData[originalIndex] = {
                                ...orderHeaderData[originalIndex],
                                orderClassification: e.target.value,
                              }
                              updatedData[actualIndex] = {
                                ...updatedData[actualIndex],
                                orderClassification: e.target.value,
                              }
                              setFilteredData(updatedData)
                            }
                          }}
                        >
                          {orderClassificationOptions.map((option) => (
                            <option key={option.value} value={option.label}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border border-gray-400 px-1 py-0.5 relative z-20 text-black">
                        {row.directDeliveryClassification}
                      </td>
                      <td className="border border-gray-400 px-1 py-0.5 relative z-20 text-black">{row.orderMemo}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-2 mt-2 mb-4 relative z-10">
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

        <div className="flex items-center gap-4 mt-4 justify-between mb-4">
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
            <Button
              variant="outline"
              className="h-8 text-sm bg-purple-500 text-white hover:bg-purple-600"
              onClick={handleDetailDisplay}
              disabled={selectedItems.length === 0}
            >
              明細表示
            </Button>
            <div className="relative">
              <select
                className="h-8 px-3 text-sm bg-blue-500 text-white border border-blue-600 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                onChange={(e) => {
                  if (e.target.value) {
                    handleActionButtonClick(e.target.value)
                    e.target.value = "" // Reset selection
                  }
                }}
                disabled={selectedItems.length === 0}
              >
                <option value="">アクション選択</option>
                <option value="発注書印刷(再)">発注書印刷(再)</option>
                <option value="WEB(CSV)">WEB(CSV)</option>
                <option value="メール・PDF(再)">メール・PDF(再)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center mb-4">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="h-9 text-sm bg-white hover:bg-gray-100 text-gray-900 border-gray-300"
          >
            発注画面に戻る
          </Button>
        </div>
      </div>
      <Footer f11Mode={f11Mode} />
      <OrderHistoryDetailDialog
        isOpen={isOrderHistoryDetailDialogOpen}
        onClose={() => setIsOrderHistoryDetailDialogOpen(false)}
        selectedOrders={selectedOrders}
      />
    </div>
  )
}
