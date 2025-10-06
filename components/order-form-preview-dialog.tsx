"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface OrderFormPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedOrderItems: any[] // 選択された注文アイテムの配列
}

export default function OrderFormPreviewDialog({
  open,
  onOpenChange,
  selectedOrderItems,
}: OrderFormPreviewDialogProps) {
  const handlePrint = () => {
    window.print()
  }

  const validOrderItems = selectedOrderItems
    .filter((item) => item && item.details) // Remove undefined items
    .flatMap((order) => order.details || []) // Flatten details arrays
    .filter((detail) => detail) // Remove any undefined details

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col bg-white p-6 rounded-lg shadow-lg print:h-auto print:max-w-full print:p-0">
        <DialogHeader className="pb-4 print:hidden">
          <DialogTitle className="text-2xl font-bold">発注書プレビュー</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto p-4 border rounded-md print:overflow-visible print:p-0 print:border-none">
          <div className="p-6 bg-white print:p-0">
            <h2 className="text-xl font-bold mb-4 text-center print:text-lg print:mb-2">発注書</h2>
            <div className="mb-6 text-sm print:mb-3">
              <p>発行日: {new Date().toLocaleDateString("ja-JP")}</p>
              <p>仕入先: {validOrderItems[0]?.company || "N/A"}</p>
              {/* 必要に応じて他の共通情報を追加 */}
            </div>
            <table className="w-full text-sm border-collapse print:text-xs">
              <thead>
                <tr className="bg-gray-100 print:bg-gray-50">
                  <th className="border border-gray-300 p-2 text-left print:p-1">商品名</th>
                  <th className="border border-gray-300 p-2 text-left print:p-1">規格(型番)</th>
                  <th className="border border-gray-300 p-2 text-left print:p-1">容量(入数/単位)</th>
                  <th className="border border-gray-300 p-2 text-right print:p-1">注文数</th>
                  <th className="border border-gray-300 p-2 text-right print:p-1">原単価</th>
                  <th className="border border-gray-300 p-2 text-right print:p-1">合計</th>
                </tr>
              </thead>
              <tbody>
                {validOrderItems.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2 print:p-1">{item.productName || "N/A"}</td>
                    <td className="border border-gray-300 p-2 print:p-1">{item.specification || "N/A"}</td>
                    <td className="border border-gray-300 p-2 print:p-1">{item.quantity || "N/A"}</td>
                    <td className="border border-gray-300 p-2 text-right print:p-1">{item.orderQty || "0"}</td>
                    <td className="border border-gray-300 p-2 text-right print:p-1">{item.unitPrice || "0"}</td>
                    <td className="border border-gray-300 p-2 text-right print:p-1">
                      {item.orderQty && item.unitPrice
                        ? (
                            Number.parseFloat(item.orderQty) * Number.parseFloat(item.unitPrice.replace(/,/g, ""))
                          ).toLocaleString()
                        : "0"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {validOrderItems.length === 0 && (
              <p className="text-center text-gray-500 mt-4">選択された商品がありません。</p>
            )}
          </div>
        </div>
        <DialogFooter className="mt-4 flex justify-end gap-2 print:hidden">
          <Button onClick={handlePrint} className="h-9 text-sm bg-blue-500 text-white hover:bg-blue-600">
            印刷
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 text-sm bg-gray-100 hover:bg-gray-200"
          >
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
