"use client"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import OrderSearchForm from "@/components/order-search-form"
import Footer from "@/components/footer"
import DetailEditDialog from "@/components/detail-edit-dialog"
import OrderPreviewDialog from "@/components/order-preview-dialog"
import OrderDetailDisplayDialog from "@/components/order-detail-display-dialog"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

export default function JapaneseOrderForm() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [desiredDeliveryDate, setDesiredDeliveryDate] = useState<Date | undefined>(undefined)
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [f11Mode, setF11Mode] = useState<"ダイアログ検索" | "直接入力">("ダイアログ検索")
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(null)
  const [expandedOrderDetails, setExpandedOrderDetails] = useState<any[]>([])
  const [deletedOrders, setDeletedOrders] = useState<Set<string>>(new Set())
  const [showDetailDisplayDialog, setShowDetailDisplayDialog] = useState(false)
  const [showDeletedOrders, setShowDeletedOrders] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string>("")

  const [isDetailEditDialogOpen, setIsDetailEditDialogOpen] = useState(false)
  const [isOrderPreviewDialogOpen, setIsOrderPreviewDialogOpen] = useState(false)
  const [isOrderFormPreviewDialogOpen, setIsOrderFormPreviewDialogOpen] = useState(false)
  const [isOrderedListDialogOpen, setIsOrderedListDialogOpen] = useState(false)
  const [isOrderCreationDialogOpen, setIsOrderCreationDialogOpen] = useState(false)
  const [isOrderDetailDisplayDialogOpen, setIsOrderDetailDisplayDialogOpen] = useState(false)
  const [isInventorySecuringDialogOpen, setIsInventorySecuringDialogOpen] = useState(false)

  const [tableData, setTableData] = useState<any[]>([])

  const headerData = useMemo(() => {
    // Group line items by order number to create header records
    const orderGroups = new Map()

    const lineItems = [
      {
        company: "アスワン",
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
        lotNumber: "L001",
        expirationDate: undefined,
      },
      {
        company: "アスワン",
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
        lotNumber: "L002",
        expirationDate: undefined,
      },
      {
        company: "和光",
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
        lotNumber: "L003",
        expirationDate: undefined,
      },
      {
        company: "キシダ化学",
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
        lotNumber: "L004",
        expirationDate: undefined,
      },
    ].map((item) => ({
      ...item,
      orderNumber: `${(item.staffCode || "").padStart(3, "0")}-${(item.orderFormNo || "").padStart(6, "0")}`,
    }))

    // Create header records from line items
    lineItems.forEach((item) => {
      const orderId = item.orderNumber
      if (!orderGroups.has(orderId)) {
        const taxExcludedAmount = Number.parseInt(item.unitPrice.replace(/,/g, "")) * Number.parseInt(item.orderQty)
        const taxAmount = Math.floor(taxExcludedAmount * 0.1)
        const taxIncludedAmount = taxExcludedAmount + taxAmount

        const supplierCode =
          item.company === "アスワン"
            ? "0001"
            : item.company === "和光"
              ? "0002"
              : item.company === "キシダ化学"
                ? "0003"
                : "0004"

        orderGroups.set(orderId, {
          orderNumber: orderId,
          orderDate: "2024/12/17", // Sample date
          supplierCode: supplierCode,
          supplierName: item.company,
          orderAmountExcludingTax: taxExcludedAmount.toLocaleString(),
          consumptionTaxAmount: taxAmount.toLocaleString(),
          orderAmountIncludingTax: taxIncludedAmount.toLocaleString(),
          orderClassification: item.method,
          directDeliveryClassification: "直送",
          productCode: item.makerCode,
          details: [item],
        })
      } else {
        orderGroups.get(orderId).details.push(item)
        // Recalculate totals
        const order = orderGroups.get(orderId)
        const totalExcludingTax = order.details.reduce(
          (sum: number, detail: any) =>
            sum + Number.parseInt(detail.unitPrice.replace(/,/g, "")) * Number.parseInt(detail.orderQty),
          0,
        )
        const totalTax = Math.floor(totalExcludingTax * 0.1)
        const totalIncludingTax = totalExcludingTax + totalTax

        order.orderAmountExcludingTax = totalExcludingTax.toLocaleString()
        order.consumptionTaxAmount = totalTax.toLocaleString()
        order.orderAmountIncludingTax = totalIncludingTax.toLocaleString()
      }
    })

    setTableData(Array.from(orderGroups.values()))
    return Array.from(orderGroups.values())
  }, [])

  // Add this useEffect after the state declarations
  useEffect(() => {
    setFilteredData(tableData)
  }, [tableData])

  const handleSearch = (searchParams: any) => {
    console.log("検索条件:", searchParams)
    let filtered = [...tableData]

    // Filter by supplier code
    if (searchParams.supplierCode) {
      filtered = filtered.filter(
        (item) =>
          item.supplierCode.includes(searchParams.supplierCode) ||
          item.supplierName.includes(searchParams.supplierCode),
      )
    }

    // Filter by supplier name
    if (searchParams.supplierName) {
      filtered = filtered.filter((item) => item.supplierName.includes(searchParams.supplierName))
    }

    if (!searchParams.showDeletedOrders) {
      filtered = filtered.filter((item) => !deletedOrders.has(item.orderNumber))
    }

    setFilteredData(filtered)
    console.log(`検索結果: ${filtered.length}件`)
  }

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      setSelectedItems(tableData.map((item) => item.orderNumber))
    } else {
      setSelectedItems([])
    }
  }

  const handleCheckboxChange = (index: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, tableData[index].orderNumber])
    } else {
      setSelectedItems(selectedItems.filter((i) => i !== tableData[index].orderNumber))
    }
  }

  const indexOfLastItem = 50 // Fixed items per page
  const indexOfFirstItem = 0 // Fixed items per page
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / 50)

  const paginate = (pageNumber: number) => {} // No pagination needed

  const handleRowClick = (orderNumber: string) => {
    const order = filteredData.find((item) => item.orderNumber === orderNumber)
    if (order) {
      setSelectedOrderNumber(orderNumber)
      setExpandedOrderDetails(order.details)
    }
  }

  const detailIndexOfLastItem = 50 // Fixed items per page
  const detailIndexOfFirstItem = 0 // Fixed items per page
  const currentDetailItems = expandedOrderDetails.slice(detailIndexOfFirstItem, detailIndexOfLastItem)
  const detailTotalPages = Math.ceil(expandedOrderDetails.length / 50)

  const detailPaginate = (pageNumber: number) => {} // No pagination needed

  const allItemsSelected =
    currentItems.length > 0 && currentItems.every((item) => selectedItems.includes(item.orderNumber))

  const handleEditDetails = () => {
    if (selectedItems.length === 0) {
      alert("修正する明細を選択してください")
      return
    }
    setIsDetailEditDialogOpen(true)
  }

  const handleSaveEditedDetails = (updatedItems: any[]) => {
    const newTableData = [...tableData]
    selectedItems.forEach((orderNumber, i) => {
      const index = newTableData.findIndex((item) => item.orderNumber === orderNumber)
      if (index !== -1) {
        newTableData[index] = updatedItems[i]
      }
    })
    setTableData(newTableData)
    setSelectedItems([]) // 選択を解除
  }

  const generateOrderNumber = (item: any) => {
    return `${item.orderFormNo}-${item.staffCode}`
  }

  const handleOrderFormPrint = () => {
    if (selectedItems.length === 0) {
      alert("印刷する明細を選択してください")
      return
    }

    // Generate order numbers for selected items
    const updatedTableData = [...tableData]
    selectedItems.forEach((orderNumber) => {
      const index = updatedTableData.findIndex((item) => item.orderNumber === orderNumber)
      if (index !== -1 && !updatedTableData[index].orderNumber) {
        updatedTableData[index].orderNumber = generateOrderNumber(updatedTableData[index])
      }
    })
    setTableData(updatedTableData)

    setIsOrderPreviewDialogOpen(true)
  }

  const handlePrint = () => {
    window.print()
    setIsOrderPreviewDialogOpen(false)
  }

  const handleSavePDF = () => {
    alert("PDFファイルが保存されました")
    setIsOrderPreviewDialogOpen(false)
  }

  const handleWebCSV = () => {
    if (selectedItems.length === 0) {
      alert("出力する明細を選択してください")
      return
    }

    // Generate order numbers
    const updatedTableData = [...tableData]
    selectedItems.forEach((orderNumber) => {
      const index = updatedTableData.findIndex((item) => item.orderNumber === orderNumber)
      if (index !== -1 && !updatedTableData[index].orderNumber) {
        updatedTableData[index].orderNumber = generateOrderNumber(updatedTableData[index])
      }
    })
    setTableData(updatedTableData)

    alert("CSVファイルが生成され、指定フォルダに保存されました")
  }

  const handleJDEDI = () => {
    if (selectedItems.length === 0) {
      alert("出力する明細を選択してください")
      return
    }

    // Generate order numbers
    const updatedTableData = [...tableData]
    selectedItems.forEach((orderNumber) => {
      const index = updatedTableData.findIndex((item) => item.orderNumber === orderNumber)
      if (index !== -1 && !updatedTableData[index].orderNumber) {
        updatedTableData[index].orderNumber = generateOrderNumber(updatedTableData[index])
      }
    })
    setTableData(updatedTableData)

    alert("EDI用データファイルが生成され、指定フォルダに自動保存されました")
  }

  const handleMailPDF = () => {
    if (selectedItems.length === 0) {
      alert("出力する明細を選択してください")
      return
    }

    // Generate order numbers
    const updatedTableData = [...tableData]
    selectedItems.forEach((orderNumber) => {
      const index = updatedTableData.findIndex((item) => item.orderNumber === orderNumber)
      if (index !== -1 && !updatedTableData[index].orderNumber) {
        updatedTableData[index].orderNumber = generateOrderNumber(updatedTableData[index])
      }
    })
    setTableData(updatedTableData)

    alert("PDFファイルが生成され、メール送信用に準備されました")
  }

  const handleShowOrderPreview = () => {
    setIsOrderPreviewDialogOpen(true)
  }

  const handleItemSelect = (orderNumber: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(orderNumber)) {
        return prev.filter((item) => item !== orderNumber)
      } else {
        return [...prev, orderNumber]
      }
    })
  }

  const handleDeleteOrders = () => {
    if (selectedItems.length === 0) {
      alert("削除する発注を選択してください")
      return
    }
    setShowDeleteConfirmation(true)
  }

  const handleConfirmDelete = () => {
    // Add selected orders to deleted set
    const newDeletedOrders = new Set(deletedOrders)
    selectedItems.forEach((orderNumber) => {
      newDeletedOrders.add(orderNumber)
    })
    setDeletedOrders(newDeletedOrders)

    // Remove deleted orders from current view if not showing deleted orders
    const updatedFilteredData = filteredData.filter((item) => !selectedItems.includes(item.orderNumber))
    setFilteredData(updatedFilteredData)

    // Clear selection
    setSelectedItems([])

    console.log(`削除された発注: ${selectedItems.join(", ")}`)
  }

  const handleDetailDisplay = () => {
    if (selectedItems.length === 0) {
      alert("明細を表示する発注書を選択してください")
      return
    }
    setShowDetailDisplayDialog(true)
  }

  const orderClassificationOptions = [
    { value: "1", label: "1:FAX" },
    { value: "2", label: "2:JD(EDI)" },
    { value: "3", label: "3:WG(EDI)" },
    { value: "4", label: "4:メール" },
    { value: "5", label: "5:WEB" },
  ]

  const handleActionSelect = (value: string) => {
    setSelectedAction(value)
  }

  const handleRegister = () => {
    if (!selectedAction) {
      alert("アクションを選択してください")
      return
    }

    if (selectedItems.length === 0) {
      alert("処理する明細を選択してください")
      return
    }

    // Execute the selected action
    switch (selectedAction) {
      case "print":
        handleOrderFormPrint()
        break
      case "web-csv":
        handleWebCSV()
        break
      case "jd-edi":
        handleJDEDI()
        break
      case "wg-edi":
        handleShowOrderPreview()
        break
      case "mail-pdf":
        handleMailPDF()
        break
    }

    // Reset the selected action after execution
    setSelectedAction("")
  }

  const handleOrderClassificationChange = (orderNumber: string, value: string) => {
    const updatedTableData = [...tableData]
    const index = updatedTableData.findIndex((item) => item.orderNumber === orderNumber)
    if (index !== -1) {
      const methodMap: { [key: string]: string } = {
        "1": "FAX",
        "2": "JD(EDI)",
        "3": "WG(EDI)",
        "4": "メール",
        "5": "WEB",
      }
      updatedTableData[index].orderClassification = methodMap[value]
    }
    setTableData(updatedTableData)
    setFilteredData(updatedTableData)
  }

  const handleMemoChange = (orderNumber: string, detailIndex: number, value: string) => {
    const updatedTableData = [...tableData]
    const orderIndex = updatedTableData.findIndex((item) => item.orderNumber === orderNumber)
    if (orderIndex !== -1 && updatedTableData[orderIndex].details[detailIndex]) {
      updatedTableData[orderIndex].details[detailIndex].orderCode = value
      setTableData(updatedTableData)
      setFilteredData(updatedTableData)
    }
  }

  return (
    <div className="flex flex-col flex-grow pb-20" style={{ backgroundColor: "#FAF5E9" }}>
      <Card className="w-full flex-grow">
        <CardContent className="px-6 pt-2 pb-6 bg-[#FAF5E9] flex flex-grow flex-col">
          {/* Header Section */}
          <div className="flex flex-col gap-1 justify-end">
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                className="h-8 text-sm bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => (window.location.href = "/order-history")}
              >
                <span>発注履歴検索</span>
              </Button>
              <Button
                variant="outline"
                className="h-8 text-sm bg-green-500 text-white hover:bg-green-600"
                onClick={() => (window.location.href = "/inventory-securing")}
              >
                在庫確保
              </Button>
            </div>
            <OrderSearchForm ref={null} onF11ModeChange={setF11Mode} onSearch={handleSearch} />
          </div>

          <div className="mb-2 flex-grow overflow-y-auto max-h-[calc(100vh-300px)]">
            <div className="flex items-center gap-2 text-sm mb-2">
              <Checkbox
                checked={allItemsSelected}
                onCheckedChange={(checked) => handleSelectAllChange(checked as boolean)}
              />
              <span>全選択↓</span>
            </div>

            <div
              className="border border-gray-400 overflow-x-auto relative z-20"
              style={{ backgroundColor: "#FAF5E9" }}
            >
              <table className="w-full text-xs" style={{ backgroundColor: "#FAF5E9" }}>
                <thead>
                  <tr style={{ backgroundColor: "#FAF5E9" }}>
                    <th
                      className="border border-gray-400 px-1 py-0.5 w-12 text-black"
                      style={{ backgroundColor: "#FAF5E9" }}
                    >
                      登録
                    </th>
                    <th
                      className="border border-gray-400 px-1 py-0.5 w-20 text-black"
                      style={{ backgroundColor: "#FAF5E9" }}
                    >
                      発注日
                    </th>
                    <th
                      className="border border-gray-400 px-1 py-0.5 w-20 text-black"
                      style={{ backgroundColor: "#FAF5E9" }}
                    >
                      仕入先コード
                    </th>
                    <th
                      className="border border-gray-400 px-1 py-0.5 w-24 text-black"
                      style={{ backgroundColor: "#FAF5E9" }}
                    >
                      仕入先名
                    </th>
                    <th
                      className="border border-gray-400 px-1 py-0.5 w-24 text-black"
                      style={{ backgroundColor: "#FAF5E9" }}
                    >
                      商品コード
                    </th>
                    <th
                      className="border border-gray-400 px-1 py-0.5 w-24 text-black"
                      style={{ backgroundColor: "#FAF5E9" }}
                    >
                      発注金額(税抜)
                    </th>
                    <th
                      className="border border-gray-400 px-1 py-0.5 w-20 text-black"
                      style={{ backgroundColor: "#FAF5E9" }}
                    >
                      消費税額
                    </th>
                    <th
                      className="border border-gray-400 px-1 py-0.5 w-24 text-black"
                      style={{ backgroundColor: "#FAF5E9" }}
                    >
                      発注金額(税込)
                    </th>
                    <th
                      className="border border-gray-400 px-1 py-0.5 w-20 text-black"
                      style={{ backgroundColor: "#FAF5E9" }}
                    >
                      発注区分
                    </th>
                    <th
                      className="border border-gray-400 px-1 py-0.5 w-20 text-black"
                      style={{ backgroundColor: "#FAF5E9" }}
                    >
                      直送区分
                    </th>
                    <th
                      className="border border-gray-400 px-1 py-0.5 w-20 text-black"
                      style={{ backgroundColor: "#FAF5E9" }}
                    >
                      受注番号
                    </th>
                    <th
                      className="border border-gray-400 px-1 py-0.5 w-16 text-black"
                      style={{ backgroundColor: "#FAF5E9" }}
                    >
                      受注行番号
                    </th>
                    <th
                      className="border border-gray-400 px-1 py-0.5 w-24 text-black"
                      style={{ backgroundColor: "#FAF5E9" }}
                    >
                      得意先名
                    </th>
                    <th
                      className="border border-gray-400 px-1 py-0.5 w-24 text-black"
                      style={{ backgroundColor: "#FAF5E9" }}
                    >
                      商品コード
                    </th>
                    <th
                      className="border border-gray-400 px-1 py-0.5 w-32 text-black"
                      style={{ backgroundColor: "#FAF5E9" }}
                    >
                      商品名
                    </th>
                    <th
                      className="border border-gray-400 px-1 py-0.5 w-16 text-black"
                      style={{ backgroundColor: "#FAF5E9" }}
                    >
                      数量
                    </th>
                    <th
                      className="border border-gray-400 px-1 py-0.5 w-20 text-black"
                      style={{ backgroundColor: "#FAF5E9" }}
                    >
                      仕入金額
                    </th>
                    <th
                      className="border border-gray-400 px-1 py-0.5 w-16 text-black"
                      style={{ backgroundColor: "#FAF5E9" }}
                    >
                      発行区分
                    </th>
                    <th
                      className="border border-gray-400 px-1 py-0.5 w-24 text-black"
                      style={{ backgroundColor: "#FAF5E9" }}
                    >
                      発注書メモ欄
                    </th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: "#FAF5E9" }}>
                  {currentItems.map((item, index) => {
                    const isSelected = selectedItems.includes(item.orderNumber)
                    const isDeleted = deletedOrders.has(item.orderNumber)
                    const details = item.details && item.details.length > 0 ? item.details : [null]

                    return details.map((detail: any, detailIndex: number) => {
                      const isFirstDetail = detailIndex === 0
                      const detailCount = details.length

                      let shouldRenderDetailFields = true
                      let detailFieldRowspan = 1

                      if (detail && detailIndex > 0) {
                        // Check if this detail has the same values as the previous detail
                        const prevDetail = details[detailIndex - 1]
                        if (
                          prevDetail &&
                          prevDetail.endUser === detail.endUser &&
                          prevDetail.makerCode === detail.makerCode &&
                          prevDetail.productName === detail.productName &&
                          prevDetail.orderQty === detail.orderQty &&
                          prevDetail.unitPrice === detail.unitPrice &&
                          prevDetail.orderCode === detail.orderCode
                        ) {
                          shouldRenderDetailFields = false
                        }
                      }

                      // If this is the first occurrence, calculate how many consecutive duplicates follow
                      if (detail && shouldRenderDetailFields) {
                        for (let i = detailIndex + 1; i < details.length; i++) {
                          const nextDetail = details[i]
                          if (
                            nextDetail &&
                            nextDetail.endUser === detail.endUser &&
                            nextDetail.makerCode === detail.makerCode &&
                            nextDetail.productName === detail.productName &&
                            nextDetail.orderQty === detail.orderQty &&
                            nextDetail.unitPrice === detail.unitPrice &&
                            nextDetail.orderCode === detail.orderCode
                          ) {
                            detailFieldRowspan++
                          } else {
                            break
                          }
                        }
                      }

                      return (
                        <tr
                          key={`${item.orderNumber}-${detailIndex}`}
                          className={`cursor-pointer hover:bg-gray-100 ${isSelected ? "bg-blue-100" : ""} ${
                            isDeleted ? "opacity-50" : ""
                          }`}
                          style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                          onClick={() => handleRowClick(item.orderNumber)}
                        >
                          {isFirstDetail && (
                            <>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-center text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                                onClick={(e) => e.stopPropagation()}
                                rowSpan={detailCount}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) => handleItemSelect(item.orderNumber)}
                                />
                              </td>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                                rowSpan={detailCount}
                              >
                                {item.orderDate}
                              </td>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                                rowSpan={detailCount}
                              >
                                {item.supplierCode.substring(0, 4)}
                              </td>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                                rowSpan={detailCount}
                              >
                                {item.supplierName}
                              </td>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                                rowSpan={detailCount}
                              >
                                {item.productCode}
                              </td>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-right text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                                rowSpan={detailCount}
                              >
                                ¥{item.orderAmountExcludingTax}
                              </td>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-right text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                                rowSpan={detailCount}
                              >
                                ¥{item.consumptionTaxAmount}
                              </td>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-right text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                                rowSpan={detailCount}
                              >
                                ¥{item.orderAmountIncludingTax}
                              </td>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                                onClick={(e) => e.stopPropagation()}
                                rowSpan={detailCount}
                              >
                                <Select
                                  value={
                                    orderClassificationOptions.find((opt) =>
                                      opt.label.includes(item.orderClassification),
                                    )?.value || "1"
                                  }
                                  onValueChange={(value) => handleOrderClassificationChange(item.orderNumber, value)}
                                >
                                  <SelectTrigger className="w-full h-6 text-xs border-none bg-transparent">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {orderClassificationOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </td>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                                rowSpan={detailCount}
                              >
                                {item.directDeliveryClassification}
                              </td>
                            </>
                          )}
                          {shouldRenderDetailFields ? (
                            <>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                                rowSpan={detailFieldRowspan}
                              >
                                {`R${(index + 1).toString().padStart(6, "0")}`}
                              </td>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                              >
                                {detailIndex + 1}
                              </td>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                                rowSpan={detailFieldRowspan}
                              >
                                {detail ? detail.endUser : ""}
                              </td>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                                rowSpan={detailFieldRowspan}
                              >
                                {detail ? detail.makerCode : ""}
                              </td>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                                rowSpan={detailFieldRowspan}
                              >
                                {detail ? detail.productName : ""}
                              </td>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-right text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                                rowSpan={detailFieldRowspan}
                              >
                                {detail ? detail.orderQty : ""}
                              </td>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-right text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                                rowSpan={detailFieldRowspan}
                              >
                                {detail ? `¥${detail.unitPrice}` : ""}
                              </td>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                              >
                                通常
                              </td>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                                rowSpan={detailFieldRowspan}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Input
                                  value={detail ? detail.orderCode : ""}
                                  onChange={(e) => handleMemoChange(item.orderNumber, detailIndex, e.target.value)}
                                  className="h-6 text-xs border-gray-300 bg-white"
                                />
                              </td>
                            </>
                          ) : (
                            <>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                              >
                                {detailIndex + 1}
                              </td>
                              <td
                                className="border border-gray-400 px-1 py-0.5 text-black"
                                style={{ backgroundColor: isSelected ? "#E3F2FD" : "#FAF5E9" }}
                              >
                                通常
                              </td>
                            </>
                          )}
                        </tr>
                      )
                    })
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="h-8 text-sm bg-red-500 text-white hover:bg-red-600"
                onClick={handleDeleteOrders}
              >
                削除
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="h-8 text-sm bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleRegister}
              >
                登録
              </Button>
              <Select value={selectedAction} onValueChange={handleActionSelect}>
                <SelectTrigger className="w-40 h-8 text-sm">
                  <SelectValue placeholder="アクションを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="print">発注書印刷</SelectItem>
                  <SelectItem value="web-csv">WEB(CSV)</SelectItem>
                  <SelectItem value="jd-edi">JD(EDI)</SelectItem>
                  <SelectItem value="wg-edi">WG(EDI)</SelectItem>
                  <SelectItem value="mail-pdf">メール(PDF)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <DetailEditDialog
        isOpen={isDetailEditDialogOpen}
        onClose={() => setIsDetailEditDialogOpen(false)}
        selectedItems={selectedItems}
        onSave={handleSaveEditedDetails}
      />

      <OrderPreviewDialog
        isOpen={isOrderPreviewDialogOpen}
        onClose={() => setIsOrderPreviewDialogOpen(false)}
        selectedItems={selectedItems}
        onPrint={handlePrint}
        onSavePDF={handleSavePDF}
      />

      <OrderDetailDisplayDialog
        isOpen={showDetailDisplayDialog}
        onClose={() => setShowDetailDisplayDialog(false)}
        selectedItems={selectedItems}
      />

      <DeleteConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        itemCount={selectedItems.length}
      />

      <Footer f11Mode={f11Mode} />
    </div>
  )
}
