"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface OrderPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItems: any[]
  onPrint: () => void
  onSavePDF: () => void
}

export default function OrderPreviewDialog({
  open,
  onOpenChange,
  selectedItems,
  onPrint,
  onSavePDF,
}: OrderPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]" style={{ backgroundColor: "#FAF5E9" }}>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">発注書プレビュー</DialogTitle>
        </DialogHeader>

        <div className="bg-white p-6 border border-gray-300 rounded min-h-[500px]">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">発注書</h2>
            <p className="text-sm text-gray-600 mt-2">注文番号: {selectedItems[0]?.orderNumber || "N/A"}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">発注明細</h3>
            <table className="w-full border border-gray-300 text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">商品名</th>
                  <th className="border border-gray-300 p-2">規格</th>
                  <th className="border border-gray-300 p-2">数量</th>
                  <th className="border border-gray-300 p-2">単価</th>
                  <th className="border border-gray-300 p-2">金額</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{item?.productName || ""}</td>
                    <td className="border border-gray-300 p-2">{item?.specification || ""}</td>
                    <td className="border border-gray-300 p-2">{item?.orderQty || ""}</td>
                    <td className="border border-gray-300 p-2">¥{item?.unitPrice || "0"}</td>
                    <td className="border border-gray-300 p-2">
                      ¥{(() => {
                        const unitPrice = item?.unitPrice ? Number.parseInt(item.unitPrice.replace(/,/g, "")) : 0
                        const orderQty = item?.orderQty ? Number.parseInt(item.orderQty) : 0
                        return (unitPrice * orderQty).toLocaleString()
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6 py-2 text-sm">
            キャンセル
          </Button>
          <Button onClick={onPrint} className="px-6 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600">
            印刷
          </Button>
          <Button onClick={onSavePDF} className="px-6 py-2 text-sm bg-green-500 text-white hover:bg-green-600">
            PDF保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
