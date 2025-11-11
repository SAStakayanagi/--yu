"use client"

import type React from "react"

import { useState, useEffect, useImperativeHandle, forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import SupplierSearchDialog from "./supplier-search-dialog"
import ProductSearchDialog from "./product-search-dialog"
import CustomerSearchDialog from "./customer-search-dialog"

export interface OrderSearchFormHandle {
  getSearchParams: () => { [key: string]: string | boolean | undefined }
}

interface OrderSearchFormProps {
  initialSearchParams?: { [key: string]: string[] | string | undefined }
  isDialogContext?: boolean
  isOrderHistoryContext?: boolean
  onSearch?: (searchParams: any) => void
  onF11ModeChange?: (mode: "ダイアログ検索" | "直接入力") => void
}

const OrderSearchForm = forwardRef<OrderSearchFormHandle, OrderSearchFormProps>(
  ({ initialSearchParams, isDialogContext = false, isOrderHistoryContext = false, onSearch, onF11ModeChange }, ref) => {
    const [orderNumber, setOrderNumber] = useState("")
    const [orderFormNo, setOrderFormNo] = useState("")
    const [selectedProduct, setSelectedProduct] = useState({
      code: (initialSearchParams?.productCode as string) || "",
      name: (initialSearchParams?.productName as string) || "",
    })
    const [directDeliveryType, setDirectDeliveryType] = useState<"通常" | "直送" | "全て">("全て")
    const [orderDateStart, setOrderDateStart] = useState<Date | undefined>(
      initialSearchParams?.orderDateStart ? new Date(initialSearchParams.orderDateStart as string) : new Date(),
    )
    const [orderDateEnd, setOrderDateEnd] = useState<Date | undefined>(
      initialSearchParams?.orderDateEnd ? new Date(initialSearchParams.orderDateEnd as string) : new Date(),
    )
    const [selectedCustomer, setSelectedCustomer] = useState({
      code: "",
      name: "",
    })
    const [selectedSupplier, setSelectedSupplier] = useState({
      code: (initialSearchParams?.supplierCode as string) || "",
      name: (initialSearchParams?.supplierName as string) || "",
    })
    const [isSupplierDirectInputMode, setIsSupplierDirectInputMode] = useState(false)
    const [isCustomerDirectInputMode, setIsCustomerDirectInputMode] = useState(false)
    const [isSupplierSearchOpen, setIsSupplierSearchOpen] = useState<boolean>(false)
    const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState<boolean>(false)
    const [isProductSearchOpen, setIsProductSearchOpen] = useState(false)
    const [isProductDirectInputMode, setIsProductDirectInputMode] = useState(false)
    const [showDeletedOrders, setShowDeletedOrders] = useState(false)

    const getSupplierNameByCode = (code: string) => {
      const suppliers = {
        "001": "株式会社サンプル商事",
        "002": "テスト工業株式会社",
        "003": "デモ物産株式会社",
      }
      return suppliers[code as keyof typeof suppliers] || ""
    }

    useEffect(() => {
      if (selectedSupplier.code) {
        const supplierName = getSupplierNameByCode(selectedSupplier.code)
        setSelectedSupplier((prev) => ({ ...prev, name: supplierName }))
      }
    }, [selectedSupplier.code])

    useEffect(() => {
      const handleGlobalF11 = (e: KeyboardEvent) => {
        if (e.key === "F11") {
          e.preventDefault()
          setIsSupplierDirectInputMode((prev) => !prev)
          setIsCustomerDirectInputMode((prev) => !prev)
          setIsProductDirectInputMode((prev) => !prev)
        }
      }

      document.addEventListener("keydown", handleGlobalF11)
      return () => document.removeEventListener("keydown", handleGlobalF11)
    }, [])

    useEffect(() => {
      const currentMode =
        isSupplierDirectInputMode || isProductDirectInputMode || isCustomerDirectInputMode
          ? "直接入力"
          : "ダイアログ検索"
      if (onF11ModeChange) {
        onF11ModeChange(currentMode)
      }
    }, [isSupplierDirectInputMode, isProductDirectInputMode, isCustomerDirectInputMode, onF11ModeChange])

    const handleSupplierKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !isSupplierDirectInputMode) {
        e.preventDefault()
        setIsSupplierSearchOpen(true)
      }
    }

    const handleProductKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !isProductDirectInputMode) {
        e.preventDefault()
        setIsProductSearchOpen(true)
      }
    }

    const handleCustomerKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !isCustomerDirectInputMode) {
        e.preventDefault()
        setIsCustomerSearchOpen(true)
      }
    }

    useImperativeHandle(ref, () => ({
      getSearchParams: () => ({
        orderDateStart: orderDateStart ? format(orderDateStart, "yyyy/MM/dd") : undefined,
        orderDateEnd: orderDateEnd ? format(orderDateEnd, "yyyy/MM/dd") : undefined,
        customerCode: selectedCustomer.code,
        customerName: selectedCustomer.name,
        supplierCode: selectedSupplier.code,
        supplierName: selectedSupplier.name,
        orderFormNo,
        orderNumber,
        productCode: selectedProduct.code,
        directDeliveryType: directDeliveryType === "全て" ? undefined : directDeliveryType,
        showDeletedOrders,
      }),
    }))

    return (
      <div className="space-y-2" style={{ backgroundColor: "#FAF5E9" }}>
        <div className="p-2 rounded-lg border border-gray-300" style={{ backgroundColor: "#FAF5E9" }}>
          <h3 className="text-sm font-medium mb-2 text-gray-700">検索条件</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-gray-600">発注番号</label>
              <Input
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="h-8 text-xs bg-white"
                placeholder="発注番号を入力"
              />
            </div>

            {isOrderHistoryContext && (
              <div className="space-y-1">
                <label className="text-xs text-gray-600">発注書No</label>
                <Input
                  value={orderFormNo}
                  onChange={(e) => setOrderFormNo(e.target.value)}
                  className="h-8 text-xs bg-white"
                  placeholder="発注書Noを入力"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs text-gray-600">発注日</label>
              <div className="flex gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-8 text-xs bg-white justify-start text-left font-normal">
                      <span className="mr-2">📅</span>
                      {orderDateStart ? format(orderDateStart, "yyyy/MM/dd") : "開始日"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={orderDateStart} onSelect={setOrderDateStart} initialFocus />
                  </PopoverContent>
                </Popover>
                <span className="text-xs self-center">〜</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-8 text-xs bg-white justify-start text-left font-normal">
                      <span className="mr-2">📅</span>
                      {orderDateEnd ? format(orderDateEnd, "yyyy/MM/dd") : "終了日"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={orderDateEnd} onSelect={setOrderDateEnd} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-600">得意先</label>
              <div className="flex gap-1">
                <Input
                  value={selectedCustomer.code}
                  onChange={(e) => setSelectedCustomer({ ...selectedCustomer, code: e.target.value })}
                  onKeyDown={handleCustomerKeyDown}
                  className="h-8 text-xs bg-white w-20"
                  placeholder={isCustomerDirectInputMode ? "コード" : "Enterで検索"}
                />
                <Input
                  value={selectedCustomer.name}
                  readOnly
                  className="h-8 text-xs bg-gray-50 flex-1"
                  placeholder="得意先名が表示されます"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white"
                  onClick={() => setIsCustomerSearchOpen(true)}
                >
                  <span className="text-xs">🔍</span>
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-600">仕入先</label>
              <div className="flex gap-1">
                <Input
                  value={selectedSupplier.code}
                  onChange={(e) => setSelectedSupplier({ ...selectedSupplier, code: e.target.value })}
                  onKeyDown={handleSupplierKeyDown}
                  className="h-8 text-xs bg-white w-20"
                  placeholder={isSupplierDirectInputMode ? "コード" : "Enterで検索"}
                />
                <Input
                  value={selectedSupplier.name}
                  readOnly
                  className="h-8 text-xs bg-gray-50 flex-1"
                  placeholder="仕入先名が表示されます"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white"
                  onClick={() => setIsSupplierSearchOpen(true)}
                >
                  <span className="text-xs">🔍</span>
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-600">商品コード</label>
              <div className="flex gap-1">
                <Input
                  value={selectedProduct.code}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, code: e.target.value })}
                  onKeyDown={handleProductKeyDown}
                  className="h-8 text-xs bg-white w-20"
                  placeholder={isProductDirectInputMode ? "コード" : "Enterで検索"}
                />
                <Input
                  value={selectedProduct.name}
                  readOnly
                  className="h-8 text-xs bg-gray-50 flex-1"
                  placeholder="商品名が表示されます"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white"
                  onClick={() => setIsProductSearchOpen(true)}
                >
                  <span className="text-xs">🔍</span>
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-600">直送区分</label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="directDelivery"
                    value="通常"
                    checked={directDeliveryType === "通常"}
                    onChange={(e) => setDirectDeliveryType(e.target.value as "通常" | "直送" | "全て")}
                    className="text-xs"
                  />
                  <span className="text-xs">通常</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="directDelivery"
                    value="直送"
                    checked={directDeliveryType === "直送"}
                    onChange={(e) => setDirectDeliveryType(e.target.value as "通常" | "直送" | "全て")}
                    className="text-xs"
                  />
                  <span className="text-xs">直送</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="directDelivery"
                    value="全て"
                    checked={directDeliveryType === "全て"}
                    onChange={(e) => setDirectDeliveryType(e.target.value as "通常" | "直送" | "全て")}
                    className="text-xs"
                  />
                  <span className="text-xs">全て</span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-600">表示オプション</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id="showDeletedOrders"
                  checked={showDeletedOrders}
                  onChange={(e) => setShowDeletedOrders(e.target.checked)}
                  className="text-xs"
                />
                <label htmlFor="showDeletedOrders" className="text-xs">
                  削除済み発注表示
                </label>
              </div>
            </div>
          </div>

          {!isDialogContext && (
            <div className="w-full flex justify-center mt-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="h-6 text-xs bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => {
                    const params = {
                      orderDateStart: orderDateStart ? format(orderDateStart, "yyyy/MM/dd") : undefined,
                      orderDateEnd: orderDateEnd ? format(orderDateEnd, "yyyy/MM/dd") : undefined,
                      customerCode: selectedCustomer.code,
                      customerName: selectedCustomer.name,
                      supplierCode: selectedSupplier.code,
                      supplierName: selectedSupplier.name,
                      orderFormNo,
                      orderNumber,
                      productCode: selectedProduct.code,
                      directDeliveryType: directDeliveryType === "全て" ? undefined : directDeliveryType,
                      showDeletedOrders,
                    }
                    if (onSearch) {
                      onSearch(params)
                    }
                  }}
                >
                  検索
                </Button>
                <Button
                  variant="outline"
                  className="h-6 text-xs bg-white hover:bg-gray-50"
                  onClick={() => {
                    setOrderDateStart(new Date())
                    setOrderDateEnd(new Date())
                    setSelectedCustomer({ code: "", name: "" })
                    setSelectedSupplier({ code: "", name: "" })
                    setOrderFormNo("")
                    setOrderNumber("")
                    setSelectedProduct({ code: "", name: "" })
                    setDirectDeliveryType("全て")
                    setShowDeletedOrders(false)
                  }}
                >
                  クリア
                </Button>
              </div>
            </div>
          )}

          {isOrderHistoryContext && (
            <div className="w-full flex justify-center mt-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="h-6 text-xs bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => {
                    const params = {
                      orderDateStart: orderDateStart ? format(orderDateStart, "yyyy/MM/dd") : undefined,
                      orderDateEnd: orderDateEnd ? format(orderDateEnd, "yyyy/MM/dd") : undefined,
                      customerCode: selectedCustomer.code,
                      customerName: selectedCustomer.name,
                      supplierCode: selectedSupplier.code,
                      supplierName: selectedSupplier.name,
                      orderFormNo,
                      orderNumber,
                      productCode: selectedProduct.code,
                      directDeliveryType: directDeliveryType === "全て" ? undefined : directDeliveryType,
                      showDeletedOrders,
                    }
                    if (onSearch) {
                      onSearch(params)
                    }
                  }}
                >
                  検索
                </Button>
                <Button
                  variant="outline"
                  className="h-6 text-xs bg-white hover:bg-gray-50"
                  onClick={() => {
                    setOrderDateStart(new Date())
                    setOrderDateEnd(new Date())
                    setSelectedCustomer({ code: "", name: "" })
                    setSelectedSupplier({ code: "", name: "" })
                    setOrderFormNo("")
                    setOrderNumber("")
                    setSelectedProduct({ code: "", name: "" })
                    setDirectDeliveryType("全て")
                    setShowDeletedOrders(false)
                  }}
                >
                  クリア
                </Button>
              </div>
            </div>
          )}
        </div>

        <SupplierSearchDialog
          open={isSupplierSearchOpen}
          onOpenChange={setIsSupplierSearchOpen}
          onSelect={(supplier) => setSelectedSupplier(supplier)}
          itemsPerPage="50"
          onItemsPerPageChange={() => {}}
        />

        <CustomerSearchDialog
          open={isCustomerSearchOpen}
          onOpenChange={setIsCustomerSearchOpen}
          onSelect={(customer) => setSelectedCustomer(customer)}
          itemsPerPage="50"
          onItemsPerPageChange={() => {}}
        />

        <ProductSearchDialog
          open={isProductSearchOpen}
          onOpenChange={setIsProductSearchOpen}
          onSelect={(product) => setSelectedProduct({ code: product.code, name: product.name })}
          itemsPerPage="50"
          onItemsPerPageChange={() => {}}
        />
      </div>
    )
  },
)

OrderSearchForm.displayName = "OrderSearchForm"

export default OrderSearchForm
