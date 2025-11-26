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

  const [orderDetails, setOrderDetails] = useState([
    {
      registered: false, // 登録
      orderDate: new Date(), // 発注日
      orderNumber: "", // 受注番号
      makerProductCode: "", // メーカー商品コード
      supplierUniqueCode: "", // 仕入先独自コード
      productCode: "", // 商品コード
      supplierName: "", // 仕入先名
      customerName: "", // 得意先名
      jdUnifiedCode: "", // JD統一コード
      productName: "", // 商品名
      specification: "", // 規格
      capacity: "", // 容量
      quantity: "1", // 数量
      unitPriceExcludingTax: 0, // 仕入単価(税抜)
      orderAmountExcludingTax: 0, // 発注金額(税抜)
      orderCategory: "", // 発注区分
      directDeliveryCategory: "", // 直送区分
      orderFormMemo: "", // 発注書メモ欄
      detailRemarks: "", // 明細備考
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

  useEffect(() => {
    const totalPurchaseAmount = orderDetails.reduce((sum, item) => {
      const quantity = Number.parseInt(item.quantity) || 0
      const unitPrice = item.unitPriceExcludingTax || 0
      const amount = quantity * unitPrice
      return sum + amount
    }, 0)

    const taxRate = 0.1 // 10% tax rate
    const totalTaxAmount = totalPurchaseAmount * taxRate
    const totalPurchaseAmountWithTax = totalPurchaseAmount + totalTaxAmount

    // Update order amount for each detail
    const updatedDetails = orderDetails.map((item) => ({
      ...item,
      orderAmountExcludingTax: (Number.parseInt(item.quantity) || 0) * (item.unitPriceExcludingTax || 0),
    }))

    if (JSON.stringify(updatedDetails) !== JSON.stringify(orderDetails)) {
      setOrderDetails(updatedDetails)
    }

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
        registered: false,
        orderDate: new Date(),
        orderNumber: "",
        makerProductCode: "",
        supplierUniqueCode: "",
        productCode: "",
        supplierName: "",
        customerName: "",
        jdUnifiedCode: "",
        productName: "",
        specification: "",
        capacity: "",
        quantity: "1",
        unitPriceExcludingTax: 0,
        orderAmountExcludingTax: 0,
        orderCategory: "",
        directDeliveryCategory: "",
        orderFormMemo: "",
        detailRemarks: "",
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

    const emptyRowIndex = orderDetails.findIndex(
      (detail) => !detail.productCode && !detail.productName && !detail.makerProductCode,
    )

    const newProductDetail = {
      registered: false,
      orderDate: new Date(),
      orderNumber: "",
      makerProductCode: product.makerCode || "",
      supplierUniqueCode: "",
      productCode: product.code || "",
      supplierName: "",
      customerName: "",
      jdUnifiedCode: product.janCode || "",
      productName: product.name || "",
      specification: product.specification || "",
      capacity: product.capacity || "",
      quantity: "1",
      unitPriceExcludingTax: product.unitPrice || 0,
      orderAmountExcludingTax: product.unitPrice || 0,
      orderCategory: "",
      directDeliveryCategory: "",
      orderFormMemo: "",
      detailRemarks: "",
    }

    if (emptyRowIndex !== -1) {
      const newDetails = [...orderDetails]
      newDetails[emptyRowIndex] = newProductDetail
      setOrderDetails(newDetails)
    } else {
      setOrderDetails([...orderDetails, newProductDetail])
    }

    alert(`商品「${product.name}」を発注明細に追加しました。`)
  }

  const handleSupplierSelect = (supplier: any) => {
    console.log("Selected supplier for inventory reservation order:", supplier)
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
                      <th className="border border-gray-300 p-2 w-16">登録</th>
                      <th className="border border-gray-300 p-2 w-24">発注日</th>
                      <th className="border border-gray-300 p-2 w-24">受注番号</th>
                      <th className="border border-gray-300 p-2 w-28">メーカー商品コード</th>
                      <th className="border border-gray-300 p-2 w-28">仕入先独自コード</th>
                      <th className="border border-gray-300 p-2 w-24">商品コード</th>
                      <th className="border border-gray-300 p-2 w-32">仕入先名</th>
                      <th className="border border-gray-300 p-2 w-32">得意先名</th>
                      <th className="border border-gray-300 p-2 w-24">JD統一コード</th>
                      <th className="border border-gray-300 p-2 w-32">商品名</th>
                      <th className="border border-gray-300 p-2 w-24">規格</th>
                      <th className="border border-gray-300 p-2 w-24">容量</th>
                      <th className="border border-gray-300 p-2 w-16">数量</th>
                      <th className="border border-gray-300 p-2 w-24">仕入単価(税抜)</th>
                      <th className="border border-gray-300 p-2 w-24">発注金額(税抜)</th>
                      <th className="border border-gray-300 p-2 w-20">発注区分</th>
                      <th className="border border-gray-300 p-2 w-20">直送区分</th>
                      <th className="border border-gray-300 p-2 w-32">発注書メモ欄</th>
                      <th className="border border-gray-300 p-2 w-32">明細備考</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.map((detail, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-1 text-center">
                          <input
                            type="checkbox"
                            checked={detail.registered}
                            onChange={(e) => updateOrderDetail(index, "registered", e.target.checked)}
                            className="w-4 h-4"
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal h-6 text-xs p-1",
                                  !detail.orderDate && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-1 h-3 w-3" />
                                {detail.orderDate ? format(detail.orderDate, "yyyy/MM/dd") : "選択"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={detail.orderDate}
                                onSelect={(date) => updateOrderDetail(index, "orderDate", date || new Date())}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.orderNumber}
                            onChange={(e) => updateOrderDetail(index, "orderNumber", e.target.value)}
                            className="w-full h-6 text-xs"
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.makerProductCode}
                            onChange={(e) => updateOrderDetail(index, "makerProductCode", e.target.value)}
                            className="w-full h-6 text-xs"
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.supplierUniqueCode}
                            onChange={(e) => updateOrderDetail(index, "supplierUniqueCode", e.target.value)}
                            className="w-full h-6 text-xs"
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.productCode}
                            onChange={(e) => updateOrderDetail(index, "productCode", e.target.value)}
                            className="w-full h-6 text-xs"
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.supplierName}
                            onChange={(e) => updateOrderDetail(index, "supplierName", e.target.value)}
                            className="w-full h-6 text-xs"
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.customerName}
                            onChange={(e) => updateOrderDetail(index, "customerName", e.target.value)}
                            className="w-full h-6 text-xs"
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.jdUnifiedCode}
                            onChange={(e) => updateOrderDetail(index, "jdUnifiedCode", e.target.value)}
                            className="w-full h-6 text-xs"
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.productName}
                            onChange={(e) => updateOrderDetail(index, "productName", e.target.value)}
                            className="w-full h-6 text-xs"
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.specification}
                            onChange={(e) => updateOrderDetail(index, "specification", e.target.value)}
                            className="w-full h-6 text-xs"
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.capacity}
                            onChange={(e) => updateOrderDetail(index, "capacity", e.target.value)}
                            className="w-full h-6 text-xs"
                          />
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
                            value={detail.unitPriceExcludingTax}
                            onChange={(e) =>
                              updateOrderDetail(index, "unitPriceExcludingTax", Number.parseFloat(e.target.value) || 0)
                            }
                            className="w-full h-6 text-xs"
                            type="number"
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.orderAmountExcludingTax}
                            disabled
                            className="w-full h-6 text-xs bg-gray-100"
                            type="number"
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.orderCategory}
                            onChange={(e) => updateOrderDetail(index, "orderCategory", e.target.value)}
                            className="w-full h-6 text-xs"
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input
                            value={detail.directDeliveryCategory}
                            onChange={(e) => updateOrderDetail(index, "directDeliveryCategory", e.target.value)}
                            className="w-full h-6 text-xs"
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Textarea
                            value={detail.orderFormMemo}
                            onChange={(e) => updateOrderDetail(index, "orderFormMemo", e.target.value)}
                            className="w-full h-6 text-xs resize-none"
                          />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Textarea
                            value={detail.detailRemarks}
                            onChange={(e) => updateOrderDetail(index, "detailRemarks", e.target.value)}
                            className="w-full h-6 text-xs resize-none"
                          />
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
