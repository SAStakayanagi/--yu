"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import DetailDeleteConfirmationDialog from "./detail-delete-confirmation-dialog"

interface OrderDetailDisplayDialogProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  selectedItems: any[]
  showDeletedDetails?: boolean
}

export default function OrderDetailDisplayDialog({
  isOpen,
  onClose,
  selectedItems,
  showDeletedDetails = false,
}: OrderDetailDisplayDialogProps) {
  const [selectedDetailItems, setSelectedDetailItems] = useState<string[]>([])
  const [deletedDetailItems, setDeletedDetailItems] = useState<string[]>([])
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [editableDetails, setEditableDetails] = useState<any[]>([])

  // Generate mock order details for selected orders
  const generateOrderDetails = (orderItems: any[]) => {
    const details: any[] = []

    if (!orderItems || !Array.isArray(orderItems)) {
      return details
    }

    orderItems.forEach((order, orderIndex) => {
      if (!order) return

      // Generate 2-3 detail items per order
      const detailCount = Math.floor(Math.random() * 2) + 2

      for (let i = 0; i < detailCount; i++) {
        const detailId = `${order.orderNumber}-${i + 1}`
        details.push({
          id: detailId,
          orderNumber: order.orderNumber,
          orderReceiptNumber: `R${(orderIndex + 1).toString().padStart(6, "0")}`,
          orderLineNumber: i + 1,
          customerName: order.endUser || "得意先名",
          productCode: `P${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}`,
          productName: order.productName || "商品名",
          quantity: Math.floor(Math.random() * 100) + 1,
          purchaseAmount: Math.floor(Math.random() * 100000) + 10000,
          issueClassification: ["通常", "緊急", "特注"][Math.floor(Math.random() * 3)],
          orderMemo: `メモ${i + 1}`,
          isDeleted: deletedDetailItems.includes(detailId),
        })
      }
    })

    return details
  }

  useEffect(() => {
    const safeSelectedItems = selectedItems || []
    const orderDetails = generateOrderDetails(safeSelectedItems.filter(Boolean))
    setEditableDetails(orderDetails)
  }, [selectedItems])

  // Filter details based on showDeletedDetails flag
  const filteredDetails = showDeletedDetails ? editableDetails : editableDetails.filter((detail) => !detail.isDeleted)

  const updateDetailValue = (detailId: string, field: string, value: any) => {
    setEditableDetails((prev) =>
      prev.map((detail) => (detail.id === detailId ? { ...detail, [field]: value } : detail)),
    )
  }

  const handleDetailItemSelect = (detailId: string) => {
    setSelectedDetailItems((prev) =>
      prev.includes(detailId) ? prev.filter((id) => id !== detailId) : [...prev, detailId],
    )
  }

  const handleDeleteDetails = () => {
    if (selectedDetailItems.length === 0) {
      alert("削除する明細を選択してください")
      return
    }
    setShowDeleteConfirmation(true)
  }

  const executeDelete = () => {
    setDeletedDetailItems((prev) => [...prev, ...selectedDetailItems])
    setSelectedDetailItems([])
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl h-[90vh] flex flex-col bg-[#FAF5E9] p-6 rounded-lg shadow-lg">
          <DialogHeader className="bg-blue-600 text-white px-6 py-4 flex items-center justify-start">
            <DialogTitle className="text-xl font-bold text-left w-full">発注明細表示</DialogTitle>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto">
            <div className="border border-gray-400 overflow-x-auto" style={{ backgroundColor: "#FAF5E9" }}>
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
                      発注番号
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
                  {filteredDetails.map((detail, index) => (
                    <tr
                      key={`${detail.orderNumber}-${detail.orderLineNumber}-${index}`}
                      style={{ backgroundColor: "#FAF5E9" }}
                      className={detail.isDeleted ? "opacity-50" : ""}
                    >
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-center text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <Checkbox
                          checked={selectedDetailItems.includes(detail.id)}
                          onCheckedChange={() => handleDetailItemSelect(detail.id)}
                        />
                      </td>
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <input
                          type="text"
                          className="w-full bg-transparent border-none text-xs text-black focus:outline-none"
                          value={detail.orderNumber}
                          onChange={(e) => updateDetailValue(detail.id, "orderNumber", e.target.value)}
                        />
                      </td>
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <input
                          type="text"
                          className="w-full bg-transparent border-none text-xs text-black focus:outline-none"
                          value={detail.orderReceiptNumber}
                          onChange={(e) => updateDetailValue(detail.id, "orderReceiptNumber", e.target.value)}
                        />
                      </td>
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <input
                          type="number"
                          className="w-full bg-transparent border-none text-xs text-black focus:outline-none"
                          value={detail.orderLineNumber}
                          onChange={(e) =>
                            updateDetailValue(detail.id, "orderLineNumber", Number.parseInt(e.target.value) || 0)
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
                          value={detail.customerName}
                          onChange={(e) => updateDetailValue(detail.id, "customerName", e.target.value)}
                        />
                      </td>
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <input
                          type="text"
                          className="w-full bg-transparent border-none text-xs text-black focus:outline-none"
                          value={detail.productCode}
                          onChange={(e) => updateDetailValue(detail.id, "productCode", e.target.value)}
                        />
                      </td>
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <input
                          type="text"
                          className="w-full bg-transparent border-none text-xs text-black focus:outline-none"
                          value={detail.productName}
                          onChange={(e) => updateDetailValue(detail.id, "productName", e.target.value)}
                        />
                      </td>
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-right text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <input
                          type="number"
                          className="w-full bg-transparent border-none text-xs text-black text-right focus:outline-none"
                          value={detail.quantity}
                          onChange={(e) =>
                            updateDetailValue(detail.id, "quantity", Number.parseInt(e.target.value) || 0)
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
                          value={detail.purchaseAmount}
                          onChange={(e) =>
                            updateDetailValue(detail.id, "purchaseAmount", Number.parseInt(e.target.value) || 0)
                          }
                        />
                      </td>
                      <td
                        className="border border-gray-400 px-1 py-0.5 text-black"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        <select
                          className="w-full bg-transparent border-none text-xs text-black focus:outline-none"
                          value={detail.issueClassification}
                          onChange={(e) => updateDetailValue(detail.id, "issueClassification", e.target.value)}
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
                          value={detail.orderMemo}
                          onChange={(e) => updateDetailValue(detail.id, "orderMemo", e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                  {filteredDetails.length === 0 && (
                    <tr style={{ backgroundColor: "#FAF5E9" }}>
                      <td
                        colSpan={11}
                        className="border border-gray-400 px-1 py-4 text-center text-gray-500"
                        style={{ backgroundColor: "#FAF5E9" }}
                      >
                        選択された発注書の明細がありません
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleDeleteDetails}
              className="h-9 text-sm bg-red-500 text-white hover:bg-red-600"
            >
              削除
            </Button>
            <Button
              variant="outline"
              onClick={() => onClose(false)}
              className="h-9 text-sm bg-white hover:bg-gray-100 text-gray-900 border-gray-300"
            >
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DetailDeleteConfirmationDialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
        onConfirm={executeDelete}
      />
    </>
  )
}
