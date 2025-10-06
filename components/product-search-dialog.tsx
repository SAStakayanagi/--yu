"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ProductSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (product: any) => void
  itemsPerPage: "50" | "100"
  onItemsPerPageChange: (value: "50" | "100") => void
}

export default function ProductSearchDialog({
  open,
  onOpenChange,
  onSelect,
  itemsPerPage,
  onItemsPerPageChange,
}: ProductSearchDialogProps) {
  const [searchConditions, setSearchConditions] = useState({
    productCode: "",
    makerCode: "",
    productName: "",
    specification: "",
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)

  const mockProducts = [
    {
      code: "P001",
      name: "分析天びん 320g",
      makerCode: "63-6334-36-30",
      specification: "ML304T/00",
      capacity: "1台",
      janCode: "4901234567890",
      temperatureCategory: "常温",
      unitPrice: 800000,
      taxRate: 10,
    },
    {
      code: "P002",
      name: "pHメーター",
      makerCode: "12-3456-78-90",
      specification: "PH-200",
      capacity: "1個",
      janCode: "4901234567891",
      temperatureCategory: "常温",
      unitPrice: 50000,
      taxRate: 10,
    },
    {
      code: "P003",
      name: "遠心分離機",
      makerCode: "98-7654-32-10",
      specification: "CEN-1000",
      capacity: "1台",
      janCode: "4901234567892",
      temperatureCategory: "常温",
      unitPrice: 1200000,
      taxRate: 10,
    },
    {
      code: "P004",
      name: "試薬A",
      makerCode: "45-6789-01-23",
      specification: "GR-100",
      capacity: "500g/瓶",
      janCode: "4901234567893",
      temperatureCategory: "冷蔵",
      unitPrice: 10000,
      taxRate: 10,
    },
    // Add more mock data to test pagination
    ...Array.from({ length: 100 }, (_, i) => ({
      code: `P${String(i + 5).padStart(3, "0")}`,
      name: `テスト商品${i + 5}`,
      makerCode: `${String(Math.floor(Math.random() * 99) + 10)}-${String(Math.floor(Math.random() * 9999) + 1000)}-${String(Math.floor(Math.random() * 99) + 10)}-${String(Math.floor(Math.random() * 99) + 10)}`,
      specification: `SPEC-${i + 5}`,
      capacity: `${Math.floor(Math.random() * 10) + 1}個`,
      janCode: `490123456789${String(i + 4).padStart(1, "0")}`,
      temperatureCategory: i % 3 === 0 ? "冷凍" : i % 2 === 0 ? "冷蔵" : "常温",
      unitPrice: Math.floor(Math.random() * 100000) + 1000,
      taxRate: 10,
    })),
  ]

  const handleSearch = () => {
    const filtered = mockProducts.filter((product) => {
      const codeMatch =
        !searchConditions.productCode || product.code.toLowerCase().includes(searchConditions.productCode.toLowerCase())
      const makerCodeMatch =
        !searchConditions.makerCode ||
        product.makerCode.toLowerCase().includes(searchConditions.makerCode.toLowerCase())
      const nameMatch =
        !searchConditions.productName || product.name.toLowerCase().includes(searchConditions.productName.toLowerCase())
      const specMatch =
        !searchConditions.specification ||
        product.specification.toLowerCase().includes(searchConditions.specification.toLowerCase())
      return codeMatch && makerCodeMatch && nameMatch && specMatch
    })

    setSearchResults(filtered)
    setShowResults(true)
    setCurrentPage(1)
  }

  const handleClear = () => {
    setSearchConditions({
      productCode: "",
      makerCode: "",
      productName: "",
      specification: "",
    })
    setSearchResults([])
    setShowResults(false)
    setCurrentPage(1)
  }

  const handleSelect = (product: any) => {
    onSelect(product)
    onOpenChange(false)
  }

  const itemsPerPageNum = Number.parseInt(itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPageNum
  const indexOfFirstItem = (currentPage - 1) * itemsPerPageNum
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(searchResults.length / itemsPerPageNum)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto" style={{ backgroundColor: "#FAF5E9" }}>
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">商品検索</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Conditions */}
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">商品コード</label>
              <Input
                value={searchConditions.productCode}
                onChange={(e) => setSearchConditions((prev) => ({ ...prev, productCode: e.target.value }))}
                className="h-8 text-sm bg-white"
                placeholder="部分一致"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">メーカー商品コード</label>
              <Input
                value={searchConditions.makerCode}
                onChange={(e) => setSearchConditions((prev) => ({ ...prev, makerCode: e.target.value }))}
                className="h-8 text-sm bg-white"
                placeholder="部分一致"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">商品名</label>
              <Input
                value={searchConditions.productName}
                onChange={(e) => setSearchConditions((prev) => ({ ...prev, productName: e.target.value }))}
                className="h-8 text-sm bg-white"
                placeholder="部分一致"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">規格</label>
              <Input
                value={searchConditions.specification}
                onChange={(e) => setSearchConditions((prev) => ({ ...prev, specification: e.target.value }))}
                className="h-8 text-sm bg-white"
                placeholder="部分一致"
              />
            </div>
          </div>

          {/* Items per page selection */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">表示件数:</span>
            <RadioGroup
              value={itemsPerPage}
              onValueChange={(value: "50" | "100") => onItemsPerPageChange(value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="50" id="50" />
                <Label htmlFor="50" className="text-sm">
                  50件
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="100" id="100" />
                <Label htmlFor="100" className="text-sm">
                  100件
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-center">
            <div className="flex gap-2">
              <Button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 h-8 text-sm">
                検索
              </Button>
              <Button onClick={handleClear} variant="outline" className="bg-white px-4 py-1 h-8 text-sm">
                クリア
              </Button>
            </div>
          </div>

          {/* Search Results */}
          {showResults && (
            <div className="mt-4">
              <div className="border border-gray-300 rounded" style={{ backgroundColor: "#FAF5E9" }}>
                <div
                  className="grid grid-cols-4 gap-2 p-2 border-b font-medium text-sm"
                  style={{ backgroundColor: "#FAF5E9" }}
                >
                  <div>商品コード</div>
                  <div>メーカー商品コード</div>
                  <div>商品名</div>
                  <div>規格</div>
                </div>
                {currentItems.map((product, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-2 p-2 border-b hover:bg-blue-50 cursor-pointer text-sm"
                    style={{ backgroundColor: "#FAF5E9" }}
                    onClick={() => handleSelect(product)}
                  >
                    <div>{product.code}</div>
                    <div>{product.makerCode}</div>
                    <div>{product.name}</div>
                    <div>{product.specification}</div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center gap-2 mt-4">
                  <div className="text-sm text-gray-600">
                    {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, searchResults.length)} / {searchResults.length}件
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="h-7 text-xs bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      前へ
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                      if (pageNum > totalPages) return null
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          className={cn(
                            "h-7 w-7 text-xs",
                            currentPage === pageNum
                              ? "bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                              : "bg-gray-800 hover:bg-gray-700 text-white border-gray-600",
                          )}
                          onClick={() => paginate(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                    <Button
                      variant="outline"
                      className="h-7 text-xs bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      次へ
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
