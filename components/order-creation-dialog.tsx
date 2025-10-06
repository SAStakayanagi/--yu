"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface OrderCreationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function OrderCreationDialog({ open, onOpenChange }: OrderCreationDialogProps) {
  const [orderDate, setOrderDate] = useState<Date | undefined>(undefined)
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([])
  const [inventoryType, setInventoryType] = useState<"secured" | "excluded">("secured")
  const [isProcessing, setIsProcessing] = useState(false)

  // Sample supplier data
  const suppliers = [
    { code: "001", name: "アスワン" },
    { code: "002", name: "和光" },
    { code: "003", name: "キシダ化学" },
    { code: "004", name: "東京化成" },
    { code: "005", name: "富士フイルム" },
  ]

  const handleSupplierToggle = (supplierCode: string) => {
    setSelectedSuppliers((prev) =>
      prev.includes(supplierCode) ? prev.filter((code) => code !== supplierCode) : [...prev, supplierCode],
    )
  }

  const handleSelectAllSuppliers = () => {
    if (selectedSuppliers.length === suppliers.length) {
      setSelectedSuppliers([])
    } else {
      setSelectedSuppliers(suppliers.map((s) => s.code))
    }
  }

  const handleRegister = async () => {
    if (!orderDate) {
      alert("受注日を選択してください")
      return
    }

    setIsProcessing(true)

    // Simulate async batch processing
    setTimeout(() => {
      console.log("発注データ作成条件:", {
        orderDate: format(orderDate, "yyyy-MM-dd"),
        selectedSuppliers: selectedSuppliers.length > 0 ? selectedSuppliers : "全て",
        inventoryType,
      })

      alert(
        `発注データ作成を開始しました。\n受注日: ${format(orderDate, "yyyy/MM/dd")}\n仕入先: ${selectedSuppliers.length > 0 ? selectedSuppliers.join(", ") : "全て"}\n在庫タイプ: ${inventoryType === "secured" ? "確保在庫のみ" : "確保在庫除外"}`,
      )

      setIsProcessing(false)
      onOpenChange(false)

      // Reset form
      setOrderDate(undefined)
      setSelectedSuppliers([])
      setInventoryType("secured")
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" style={{ backgroundColor: "#FAF5E9" }}>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">発注データ作成</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4">
          {/* Order Date Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">受注日 *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !orderDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {orderDate ? format(orderDate, "yyyy/MM/dd") : "日付を選択"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={orderDate} onSelect={setOrderDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Supplier Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">仕入先コード（仕入先名）</Label>
            <div className="border rounded-md p-3 max-h-40 overflow-y-auto bg-white">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="select-all-suppliers"
                  checked={selectedSuppliers.length === suppliers.length}
                  onCheckedChange={handleSelectAllSuppliers}
                />
                <Label htmlFor="select-all-suppliers" className="text-sm">
                  全て選択
                </Label>
              </div>
              <div className="space-y-2">
                {suppliers.map((supplier) => (
                  <div key={supplier.code} className="flex items-center space-x-2">
                    <Checkbox
                      id={supplier.code}
                      checked={selectedSuppliers.includes(supplier.code)}
                      onCheckedChange={() => handleSupplierToggle(supplier.code)}
                    />
                    <Label htmlFor={supplier.code} className="text-sm">
                      {supplier.code} - {supplier.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-600">※選択しない場合は全仕入先が対象となります</p>
          </div>

          {/* Inventory Type Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">在庫タイプ</Label>
            <RadioGroup
              value={inventoryType}
              onValueChange={(value: "secured" | "excluded") => setInventoryType(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="secured" id="secured" />
                <Label htmlFor="secured" className="text-sm">
                  確保在庫のみ
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excluded" id="excluded" />
                <Label htmlFor="excluded" className="text-sm">
                  確保在庫除外
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Conditions Info */}
          <div className="bg-blue-50 p-3 rounded-md">
            <h4 className="text-sm font-medium mb-2">発注データ作成条件</h4>
            <ul className="text-xs space-y-1 text-gray-700">
              <li>• 受注データの発注区分が"発注"になっているデータ</li>
              <li>• 該当受注の受注ステータスが"受注確定"になっているデータ</li>
              <li>• 指定した受注日と一致するデータ</li>
              <li>• 指定した仕入先と一致するデータ（選択時）</li>
              <li>• 確保在庫/通常受注の条件が一致するデータ</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <Button
              onClick={handleRegister}
              disabled={isProcessing}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              {isProcessing ? "処理中..." : "登録"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
              キャンセル
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
