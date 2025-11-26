"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProductSearchDialog from "@/components/product-search-dialog"
import SupplierSearchDialog from "@/components/supplier-search-dialog"

export default function InventorySecuringPage() {
  const [f11Mode, setF11Mode] = useState<"ダイアログ検索" | "直接入力">("ダイアログ検索")
  const [isProductSearchOpen, setIsProductSearchOpen] = useState(false)
  const [isSupplierSearchOpen, setIsSupplierSearchOpen] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState<"50" | "100">("50")

  // Order form header fields
  const [orderFormData, setOrderFormData] = useState({
    orderNo: "", // Auto-generated
    orderDate: new Date(),
    deliveryDate: undefined as Date | undefined,
    staffName: "ログインユーザー", // Default to current logged-in user
    assistantName: "ログインアシスタント", // Default to current logged-in user
    totalPurchaseAmount: 0, // Auto-calculated
    totalPurchaseAmountWithTax: 0, // Auto-calculated
    taxAmount: 0, // Auto-calculated
    taxRate: 10, // Auto-calculated
    totalTaxAmount: 0, // Auto-calculated
    internalMemo: "",
    supplierName: "", // New field to store selected supplier name
  })

  // Order detail items
  const [orderDetails, setOrderDetails] = useState([
    {
      productCode: "",
      productName: "",
      makerCode: "",
      specification: "",
      capacity: "",
      janCode: "",
      temperatureCategory: "",
      regulationCategory: "一般", // Default value
      productCategory: "試薬", // Default value
      orderMethod: "FAX", // Default value
      quantity: "",
      unitPrice: 0,
      taxRate: 10,
      issueCategory: "",
      makerMemo: "",
      lotNumber: "",
      lotExpiration: undefined as Date | undefined,
    },
  ])

  // Auto-generate order number on component mount
  useEffect(() => {
    const generateOrderNo = () => {
      const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)) // A-Z
      const numbers = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")
      return `${letter}${numbers}`
    }

    setOrderFormData((prev) => ({
      ...prev,
      orderNo: generateOrderNo(),
    }))
  }, [])

  // Auto-calculate totals when order details change
  useEffect(() => {
    const totalPurchaseAmount = orderDetails.reduce((sum, item) => {
      const quantity = Number.parseInt(item.quantity) || 0
      const unitPrice = item.unitPrice || 0
      return sum + quantity * unitPrice
    }, 0)

    const totalTaxAmount = orderDetails.reduce((sum, item) => {
      const quantity = Number.parseInt(item.quantity) || 0
      const unitPrice = item.unitPrice || 0
      const taxRate = item.taxRate || 0
      return sum + (quantity * unitPrice * taxRate) / 100
    }, 0)

    const totalPurchaseAmountWithTax = totalPurchaseAmount + totalTaxAmount

    setOrderFormData((prev) => ({
      ...prev,
      totalPurchaseAmount,
      totalPurchaseAmountWithTax,
      totalTaxAmount,
    }))
  }, [orderDetails])

  const addOrderDetailRow = () => {
    setOrderDetails([
      ...orderDetails,
      {
        productCode: "",
        productName: "",
        makerCode: "",
        specification: "",
        capacity: "",
        janCode: "",
        temperatureCategory: "",
        regulationCategory: "一般", // Default value
        productCategory: "試薬", // Default value
        orderMethod: "FAX", // Default value
        quantity: "1", // Default quantity
        unitPrice: 0,
        taxRate: 10,
        issueCategory: "",
        makerMemo: "",
        lotNumber: "",
        lotExpiration: undefined,
      },
    ])
  }

  const updateOrderDetail = (index: number, field: string, value: any) => {
    const newDetails = [...orderDetails]
    newDetails[index] = { ...newDetails[index], [field]: value }
    setOrderDetails(newDetails)
  }

  const handleProductSelect = (product: any) => {
    console.log("Selected product:", product)

    // Find the first empty row or add a new row
    const emptyRowIndex = orderDetails.findIndex(
      (detail) => !detail.productCode && !detail.productName && !detail.makerCode,
    )

    const newProductDetail = {
      productCode: product.code || "",
      productName: product.name || "",
      makerCode: product.makerCode || "",
      specification: product.specification || "",
      capacity: product.capacity || "",
      janCode: product.janCode || "",
      temperatureCategory: product.temperatureCategory || "",
      regulationCategory: "一般", // Default value
      productCategory: "試薬", // Default value
      orderMethod: "FAX", // Default value
      quantity: "1", // Default quantity
      unitPrice: product.unitPrice || 0,
      taxRate: product.taxRate || 10,
      issueCategory: "通常", // Default value
      makerMemo: "",
      lotNumber: "",
      lotExpiration: undefined,
    }

    if (emptyRowIndex !== -1) {
      // Update existing empty row
      const newDetails = [...orderDetails]
      newDetails[emptyRowIndex] = newProductDetail
      setOrderDetails(newDetails)
    } else {
      // Add new row
      setOrderDetails([...orderDetails, newProductDetail])
    }

    alert(`商品「${product.name}」を発注明細に追加しました。`)
  }

  const handleSupplierSelect = (supplier: any) => {
    console.log("Selected supplier for inventory reservation order:", supplier)
    // Update the order form to reflect the selected supplier as the designated supplier for this inventory reservation order
    // This selection designates the supplier for the current inventory reservation order
    alert(`仕入先「${supplier.name}」を今回の在庫確保発注の指定先として選択しました。`)
    setOrderFormData((prev) => ({
      ...prev,
      supplierName: supplier.name,
    }))
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#FAF5E9" }}>
      <Header title="在庫確保登録" />

      <div className="flex-1 p-4">
        <Card className="w-full">
          <CardContent className="p-6 bg-[#FAF5E9]">
            {/* Top buttons */}
            <div className="flex justify-end gap-2 mb-4">
              <Button
                variant="outline"
                className="h-8 text-sm bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => setIsProductSearchOpen(true)}
              >
                <Search className="mr-1 h-4 w-4" />
                商品検索
              </Button>
              <Button
                variant="outline"
                className="h-8 text-sm bg-green-500 text-white hover:bg-green-600"
                onClick={() => setIsSupplierSearchOpen(true)}
              >
                <Search className="mr-1 h-4 w-4" />
                仕入先検索
              </Button>
            </div>

            {/* Order form header section */}
            <div className="mb-6 p-3 border border-gray-300 rounded bg-[#FAF5E9]">
              <h3 className="text-lg font-semibold mb-3">発注書情報</h3>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <Label htmlFor="orderNo" className="text-sm">
                    発注書No *
                  </Label>
                  <Input id="orderNo" value={orderFormData.orderNo} disabled className="bg-gray-100 h-8 text-sm" />
                </div>
                <div>
                  <Label htmlFor="orderDate" className="text-sm">
                    発注日 *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-8 text-sm",
                          !orderFormData.orderDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {orderFormData.orderDate ? format(orderFormData.orderDate, "yyyy/MM/dd") : "日付を選択"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={orderFormData.orderDate}
                        onSelect={(date) => setOrderFormData((prev) => ({ ...prev, orderDate: date || new Date() }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="deliveryDate" className="text-sm">
                    納品予定日
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-8 text-sm",
                          !orderFormData.deliveryDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {orderFormData.deliveryDate ? format(orderFormData.deliveryDate, "yyyy/MM/dd") : "日付を選択"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={orderFormData.deliveryDate}
                        onSelect={(date) => setOrderFormData((prev) => ({ ...prev, deliveryDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="staffName" className="text-sm">
                    担当者名 *
                  </Label>
                  <Input
                    id="staffName"
                    value={orderFormData.staffName}
                    onChange={(e) => setOrderFormData((prev) => ({ ...prev, staffName: e.target.value }))}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="assistantName" className="text-sm">
                    アシスタント名 *
                  </Label>
                  <Input
                    id="assistantName"
                    value={orderFormData.assistantName}
                    onChange={(e) => setOrderFormData((prev) => ({ ...prev, assistantName: e.target.value }))}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="internalMemo" className="text-sm">
                    社内連絡メモ
                  </Label>
                  <Textarea
                    id="internalMemo"
                    value={orderFormData.internalMemo}
                    onChange={(e) => setOrderFormData((prev) => ({ ...prev, internalMemo: e.target.value }))}
                    className="h-16 text-sm resize-none"
                  />
                </div>
                <div>
                  <Label htmlFor="supplierName" className="text-sm">
                    指定仕入先
                  </Label>
                  <Input
                    id="supplierName"
                    value={orderFormData.supplierName}
                    disabled
                    className="bg-gray-100 h-8 text-sm"
                  />
                </div>
              </div>

              {/* Financial summary section */}
              <div className="mt-3 p-2 bg-gray-50 rounded border">
                <h4 className="font-semibold mb-2 text-sm">金額情報</h4>
                <div className="grid grid-cols-5 gap-3 text-sm">
                  <div>
                    <Label className="text-xs">合計仕入額（税抜）</Label>
                    <div className="font-mono text-right p-1 bg-white border rounded text-xs">
                      ¥{orderFormData.totalPurchaseAmount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">合計仕入額（税込）</Label>
                    <div className="font-mono text-right p-1 bg-white border rounded text-xs">
                      ¥{orderFormData.totalPurchaseAmountWithTax.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">消費税率</Label>
                    <div className="font-mono text-right p-1 bg-white border rounded text-xs">
                      {orderFormData.taxRate}%
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">合計消費税額</Label>
                    <div className="font-mono text-right p-1 bg-white border rounded text-xs">
                      ¥{orderFormData.totalTaxAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order details section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">発注明細</h3>
                <Button variant="outline" className="h-8 text-sm bg-transparent" onClick={addOrderDetailRow}>
                  明細行追加
                </Button>
              </div>

              <div className="border border-gray-300 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 w-32">商品名 *</th>
                      <th className="border border-gray-300 p-2 w-24">メーカーコード *</th>
                      <th className="border border-gray-300 p-2 w-24">規格(型番) *</th>
                      <th className="border border-gray-300 p-2 w-24">容量(単位) *</th>
                      <th className="border border-gray-300 p-2 w-24">JANコード *</th>
                      <th className="border border-gray-300 p-2 w-20">管理温度区分 *</th>
                      <th className="border border-gray-300 p-2 w-20">法規制区分 *</th>
                      <th className="border border-gray-300 p-2 w-20">商品区分 *</th>
                      <th className="border border-gray-300 p-2 w-20">発注方法 *</th>
                      <th className="border border-gray-300 p-2 w-16">数量 *</th>
                      <th className="border border-gray-300 p-2 w-20">原価(仕切値) *</th>
                      <th className="border border-gray-300 p-2 w-16">消費税率 *</th>
                      <th className="border border-gray-300 p-2 w-24">メーカー連絡メモ</th>
                      <th className="border border-gray-300 p-2 w-20">LOT番号</th>
                      <th className="border border-gray-300 p-2 w-24">LOT有効期限</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.map((detail, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.productName}
                            onChange={(e) => updateOrderDetail(index, "productName", e.target.value)}
                            className="w-full h-6 text-xs"
                            disabled
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.makerCode}
                            onChange={(e) => updateOrderDetail(index, "makerCode", e.target.value)}
                            className="w-full h-6 text-xs"
                            disabled
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.specification}
                            onChange={(e) => updateOrderDetail(index, "specification", e.target.value)}
                            className="w-full h-6 text-xs"
                            disabled
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.capacity}
                            onChange={(e) => updateOrderDetail(index, "capacity", e.target.value)}
                            className="w-full h-6 text-xs"
                            disabled
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.janCode}
                            onChange={(e) => updateOrderDetail(index, "janCode", e.target.value)}
                            className="w-full h-6 text-xs"
                            disabled
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.temperatureCategory}
                            onChange={(e) => updateOrderDetail(index, "temperatureCategory", e.target.value)}
                            className="w-full h-6 text-xs"
                            disabled
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Select
                            value={detail.regulationCategory}
                            onValueChange={(value) => updateOrderDetail(index, "regulationCategory", value)}
                          >
                            <SelectTrigger className="w-full h-6 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="一般">一般</SelectItem>
                              <SelectItem value="毒物">毒物</SelectItem>
                              <SelectItem value="劇物">劇物</SelectItem>
                              <SelectItem value="危険物">危険物</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Select
                            value={detail.productCategory}
                            onValueChange={(value) => updateOrderDetail(index, "productCategory", value)}
                          >
                            <SelectTrigger className="w-full h-6 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="試薬">試薬</SelectItem>
                              <SelectItem value="機器">機器</SelectItem>
                              <SelectItem value="消耗品">消耗品</SelectItem>
                              <SelectItem value="その他">その他</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Select
                            value={detail.orderMethod}
                            onValueChange={(value) => updateOrderDetail(index, "orderMethod", value)}
                          >
                            <SelectTrigger className="w-full h-6 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FAX">FAX</SelectItem>
                              <SelectItem value="JD(EDI)">JD(EDI)</SelectItem>
                              <SelectItem value="WG(EDI)">WG(EDI)</SelectItem>
                              <SelectItem value="メール">メール</SelectItem>
                              <SelectItem value="WEB">WEB</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.quantity}
                            onChange={(e) => updateOrderDetail(index, "quantity", e.target.value)}
                            className="w-full h-6 text-xs"
                            type="number"
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.unitPrice}
                            onChange={(e) =>
                              updateOrderDetail(index, "unitPrice", Number.parseFloat(e.target.value) || 0)
                            }
                            className="w-full h-6 text-xs"
                            type="number"
                            disabled
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Select
                            value={detail.taxRate.toString()}
                            onValueChange={(value) => updateOrderDetail(index, "taxRate", Number.parseInt(value))}
                          >
                            <SelectTrigger className="w-full h-6 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10%</SelectItem>
                              <SelectItem value="8">8%</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Textarea
                            value={detail.makerMemo}
                            onChange={(e) => updateOrderDetail(index, "makerMemo", e.target.value)}
                            className="w-full h-6 text-xs resize-none"
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.lotNumber}
                            onChange={(e) => updateOrderDetail(index, "lotNumber", e.target.value)}
                            className="w-full h-6 text-xs"
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal h-6 text-xs p-1",
                                  !detail.lotExpiration && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-1 h-3 w-3" />
                                {detail.lotExpiration ? format(detail.lotExpiration, "yyyy/MM/dd") : "選択"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={detail.lotExpiration}
                                onSelect={(date) => updateOrderDetail(index, "lotExpiration", date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" className="h-8 text-sm bg-transparent" onClick={() => window.history.back()}>
                キャンセル
              </Button>
              <Button
                variant="outline"
                className="h-8 text-sm bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => {
                  console.log("在庫確保登録実行", { orderFormData, orderDetails })
                  alert("在庫確保登録が完了しました")
                }}
              >
                登録
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search dialogs */}
      <ProductSearchDialog
        open={isProductSearchOpen}
        onOpenChange={setIsProductSearchOpen}
        onSelect={handleProductSelect}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <SupplierSearchDialog
        open={isSupplierSearchOpen}
        onOpenChange={setIsSupplierSearchOpen}
        onSelect={handleSupplierSelect}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <Footer f11Mode={f11Mode} />
    </div>
  )
}
