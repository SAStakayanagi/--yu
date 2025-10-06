"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface OrderHistoryDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedOrders: any[]
}

export default function OrderHistoryDetailDialog({ isOpen, onClose, selectedOrders }: OrderHistoryDetailDialogProps) {
  const [selectedDetailItems, setSelectedDetailItems] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPageOption, setItemsPerPageOption] = useState<50 | 100>(50)
  const [editableData, setEditableData] = useState<{ [key: string]: any }>({})

  const allDetails = selectedOrders?.length > 0 ? selectedOrders.flatMap((order) => order.details || []) : []

  const indexOfLastItem = currentPage * itemsPerPageOption
  const indexOfFirstItem = indexOfLastItem - itemsPerPageOption
  const currentItems = allDetails.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(allDetails.length / itemsPerPageOption)

  const getEditableValue = (detailKey: string, field: string, originalValue: any) => {
    return editableData[`${detailKey}-${field}`] !== undefined ? editableData[`${detailKey}-${field}`] : originalValue
  }

  const updateEditableValue = (detailKey: string, field: string, value: any) => {
    setEditableData((prev) => ({
      ...prev,
      [`${detailKey}-${field}`]: value,
    }))
  }

  const handleDetailCheckboxChange = (detailKey: string, checked: boolean) => {
    if (checked) {
      setSelectedDetailItems([...selectedDetailItems, detailKey])
    } else {
      setSelectedDetailItems(selectedDetailItems.filter((key) => key !== detailKey))
    }
  }

  const handleSelectAllDetailsChange = (checked: boolean) => {
    if (checked) {
      const allDetailKeys = allDetails.map((detail) => `${detail.orderNumber}-${detail.orderLineNumber}`)
      setSelectedDetailItems(allDetailKeys)
    } else {
      setSelectedDetailItems([])
    }
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  const allDetailsSelected = selectedDetailItems.length === allDetails.length && allDetails.length > 0

  const handleDeleteSelected = () => {
    if (selectedDetailItems.length === 0) return

    const confirmed = window.confirm(
      "対象発注明細を削除します。よろしいでしょうか？※一度削除するとデータを復元することができません",
    )

    if (confirmed) {
      console.log("Deleting selected detail items:", selectedDetailItems)
      setSelectedDetailItems([])
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col bg-[#FAF5E9] p-6 rounded-lg shadow-lg">
        <DialogHeader className="bg-blue-600 text-white px-6 py-4 flex items-center justify-start">
          <DialogTitle className="text-xl font-bold text-left w-full">発注明細表示</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 text-sm mb-2">
            <Checkbox
              checked={allDetailsSelected}
              onCheckedChange={(checked) => handleSelectAllDetailsChange(checked as boolean)}
            />
            <span>全選択↓</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs">表示件数:</span>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="detailItemsPerPage"
                  value="50"
                  checked={itemsPerPageOption === 50}
                  onChange={() => setItemsPerPageOption(50)}
                />
                <span className="text-xs">50件</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="detailItemsPerPage"
                  value="100"
                  checked={itemsPerPageOption === 100}
                  onChange={() => setItemsPerPageOption(100)}
                />
                <span className="text-xs">100件</span>
              </label>
            </div>
          </div>

          <div className="flex-grow overflow-auto border border-gray-400" style={{ backgroundColor: "#FAF5E9" }}>
            <table className="w-full text-xs" style={{ backgroundColor: "#FAF5E9" }}>
              <thead className="sticky top-0">
                <tr style={{ backgroundColor: "#FAF5E9" }} className="text-black">
                  <th
                    className="border border-gray-400 px-1 py-0.5 w-12 text-black"
                    style={{ backgroundColor: "#FAF5E9" }}
                  >
                    登録
                  </th>
                  <th
                    className="border border-gray-400 px-1 py-0.5 w-24 text-black"
                    style={{ backgroundColor: "#FAF5E9" }}
                  >
                    発注番号
                  </th>
                  <th
                    className="border border-gray-400 px-1 py-0.5 w-20 text-black"
                    style={{ backgroundColor: "#FAF5E9" }}
                  >
                    発注書No
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
                {currentItems.map((detail, index) => {
                  const detailKey = `${detail.orderNumber}-${detail.orderLineNumber}`
                  return (
                    <tr key={detailKey} className="hover:bg-gray-50 text-black" style={{ backgroundColor: "#FAF5E9" }}>
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-center text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <Checkbox
                          checked={selectedDetailItems.includes(detailKey)}
                          onCheckedChange={(checked) => handleDetailCheckboxChange(detailKey, checked as boolean)}
                        />
                      </td>
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <input
                          type="text"
                          className="w-full bg-transparent border-none text-xs text-black focus:outline-none"
                          value={getEditableValue(detailKey, "orderNumber", detail.orderNumber)}
                          onChange={(e) => updateEditableValue(detailKey, "orderNumber", e.target.value)}
                        />
                      </td>
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <input
                          type="text"
                          className="w-full bg-transparent border-none text-xs text-black focus:outline-none"
                          value={getEditableValue(detailKey, "orderFormNo", detail.orderFormNo)}
                          onChange={(e) => updateEditableValue(detailKey, "orderFormNo", e.target.value)}
                        />
                      </td>
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <input
                          type="text"
                          className="w-full bg-transparent border-none text-xs text-black focus:outline-none"
                          value={getEditableValue(detailKey, "orderReceiptNumber", detail.orderReceiptNumber)}
                          onChange={(e) => updateEditableValue(detailKey, "orderReceiptNumber", e.target.value)}
                        />
                      </td>
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-center text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <input
                          type="number"
                          className="w-full bg-transparent border-none text-xs text-black text-center focus:outline-none"
                          value={getEditableValue(detailKey, "orderLineNumber", detail.orderLineNumber)}
                          onChange={(e) =>
                            updateEditableValue(detailKey, "orderLineNumber", Number.parseInt(e.target.value) || 0)
                          }
                        />
                      </td>
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <input
                          type="text"
                          className="w-full bg-transparent border-none text-xs text-black focus:outline-none"
                          value={getEditableValue(detailKey, "customerName", detail.customerName)}
                          onChange={(e) => updateEditableValue(detailKey, "customerName", e.target.value)}
                        />
                      </td>
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <input
                          type="text"
                          className="w-full bg-transparent border-none text-xs text-black focus:outline-none"
                          value={getEditableValue(detailKey, "productCode", detail.productCode)}
                          onChange={(e) => updateEditableValue(detailKey, "productCode", e.target.value)}
                        />
                      </td>
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <input
                          type="text"
                          className="w-full bg-transparent border-none text-xs text-black focus:outline-none"
                          value={getEditableValue(detailKey, "productName", detail.productName)}
                          onChange={(e) => updateEditableValue(detailKey, "productName", e.target.value)}
                        />
                      </td>
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-right text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <input
                          type="number"
                          className="w-full bg-transparent border-none text-xs text-black text-right focus:outline-none"
                          value={getEditableValue(detailKey, "quantity", detail.quantity)}
                          onChange={(e) =>
                            updateEditableValue(detailKey, "quantity", Number.parseInt(e.target.value) || 0)
                          }
                        />
                      </td>
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-right text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <input
                          type="number"
                          className="w-full bg-transparent border-none text-xs text-black text-right focus:outline-none"
                          value={getEditableValue(detailKey, "purchaseAmount", detail.purchaseAmount)}
                          onChange={(e) =>
                            updateEditableValue(detailKey, "purchaseAmount", Number.parseInt(e.target.value) || 0)
                          }
                        />
                      </td>
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <select
                          className="w-full bg-transparent border-none text-xs text-black focus:outline-none"
                          value={getEditableValue(detailKey, "issueClassification", detail.issueClassification)}
                          onChange={(e) => updateEditableValue(detailKey, "issueClassification", e.target.value)}
                        >
                          <option value="通常">通常</option>
                          <option value="緊急">緊急</option>
                          <option value="特注">特注</option>
                        </select>
                      </td>
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <input
                          type="text"
                          className="w-full bg-transparent border-none text-xs text-black focus:outline-none"
                          value={getEditableValue(detailKey, "orderMemo", detail.orderMemo)}
                          onChange={(e) => updateEditableValue(detailKey, "orderMemo", e.target.value)}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

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

          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              className="h-9 text-sm bg-red-500 text-white hover:bg-red-600"
              onClick={handleDeleteSelected}
              disabled={selectedDetailItems.length === 0}
            >
              削除
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="h-9 text-sm bg-white hover:bg-gray-100 text-gray-900 border-gray-300"
            >
              閉じる
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
