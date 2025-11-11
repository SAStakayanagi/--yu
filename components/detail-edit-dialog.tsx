"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface DetailEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItems: any[]
  onSave: (updatedItems: any[]) => void
}

export default function DetailEditDialog({ open, onOpenChange, selectedItems, onSave }: DetailEditDialogProps) {
  const [editedItems, setEditedItems] = useState<any[]>([])

  useEffect(() => {
    setEditedItems([...selectedItems])
  }, [selectedItems])

  const handleInputChange = (index: number, field: string, value: any) => {
    const updated = [...editedItems]
    updated[index] = { ...updated[index], [field]: value }
    setEditedItems(updated)
  }

  const handleSave = () => {
    onSave(editedItems)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "#FAF5E9" }}>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">明細修正</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {editedItems.map((item, index) => (
            <div key={index} className="border border-gray-300 p-4 rounded bg-white">
              <h3 className="font-semibold mb-3 text-sm">明細 {index + 1}</h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs">仕入先名</Label>
                  <Input
                    value={item.company}
                    onChange={(e) => handleInputChange(index, "company", e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs">発注方法</Label>
                  <Input
                    value={item.method}
                    onChange={(e) => handleInputChange(index, "method", e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs">メーカー連絡メモ</Label>
                  <Input
                    value={item.orderCode}
                    onChange={(e) => handleInputChange(index, "orderCode", e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs">得意先名</Label>
                  <Input
                    value={item.endUser}
                    onChange={(e) => handleInputChange(index, "endUser", e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs">メーカーコード</Label>
                  <Input
                    value={item.makerCode}
                    onChange={(e) => handleInputChange(index, "makerCode", e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs">商品名</Label>
                  <Input
                    value={item.productName}
                    onChange={(e) => handleInputChange(index, "productName", e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs">規格(型番)</Label>
                  <Input
                    value={item.specification}
                    onChange={(e) => handleInputChange(index, "specification", e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs">容量(入数/単位)</Label>
                  <Input
                    value={item.quantity}
                    onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs">注文数</Label>
                  <Input
                    value={item.orderQty}
                    onChange={(e) => handleInputChange(index, "orderQty", e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs">原単価</Label>
                  <Input
                    value={item.unitPrice}
                    onChange={(e) => handleInputChange(index, "unitPrice", e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs">ロット番号</Label>
                  <Input
                    value={item.lotNumber}
                    onChange={(e) => handleInputChange(index, "lotNumber", e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs">使用期限</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal text-xs h-8",
                          !item.expirationDate && "text-muted-foreground",
                        )}
                      >
                        <span className="mr-2">📅</span>
                        {item.expirationDate ? format(item.expirationDate, "yyyy/MM/dd") : <span>日付を選択</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={item.expirationDate}
                        onSelect={(date) => handleInputChange(index, "expirationDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6 py-2 text-sm">
            キャンセル
          </Button>
          <Button onClick={handleSave} className="px-6 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600">
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
