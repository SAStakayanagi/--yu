"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface SupplierSearchDialogProps {
  isOpen?: boolean
  open?: boolean
  onClose?: () => void
  onOpenChange?: (open: boolean) => void
  onSelect: (supplier: any) => void
  itemsPerPage?: "50" | "100"
  onItemsPerPageChange?: (value: "50" | "100") => void
}

export default function SupplierSearchDialog({
  isOpen,
  open,
  onClose,
  onOpenChange,
  onSelect,
  itemsPerPage = "50",
  onItemsPerPageChange = () => {},
}: SupplierSearchDialogProps) {
  const isDialogOpen = isOpen ?? open ?? false
  const handleOpenChange = (openState: boolean) => {
    if (onOpenChange) onOpenChange(openState)
    if (onClose && !openState) onClose()
  }

  const [searchConditions, setSearchConditions] = useState({
    supplierCode: "",
    supplierName: "",
    furigana: "",
    phoneNumber: "",
    faxNumber: "",
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)

  const mockSuppliers = [
    {
      code: "001",
      name: "アスワン株式会社",
      furigana: "アスワンカブシキガイシャ",
      phone: "03-1234-5678",
      fax: "03-1234-5679",
      orderMethod: "FAX",
      orderMemo: "平日9-17時対応",
    },
    {
      code: "002",
      name: "和光純薬工業株式会社",
      furigana: "ワコウジュンヤクコウギョウカブシキガイシャ",
      phone: "03-2345-6789",
      fax: "03-2345-6790",
      orderMethod: "JD(EDI)",
      orderMemo: "EDI対応可能",
    },
    {
      code: "003",
      name: "キシダ化学株式会社",
      furigana: "キシダカガクカブシキガイシャ",
      phone: "03-3456-7890",
      fax: "03-3456-7891",
      orderMethod: "WEB",
      orderMemo: "WEB注文システム利用",
    },
    {
      code: "004",
      name: "関東化学株式会社",
      furigana: "カントウカガクカブシキガイシャ",
      phone: "03-4567-8901",
      fax: "03-4567-8902",
      orderMethod: "メール",
      orderMemo: "メール注文対応",
    },
    // Add more mock data to test pagination
    ...Array.from({ length: 100 }, (_, i) => ({
      code: String(i + 5).padStart(3, "0"),
      name: `テスト仕入先${i + 5}株式会社`,
      furigana: `テストシイレサキ${i + 5}カブシキガイシャ`,
      phone: `03-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      fax: `03-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      orderMethod: ["FAX", "JD(EDI)", "WG(EDI)", "メール", "WEB"][Math.floor(Math.random() * 5)],
      orderMemo: `メモ${i + 5}`,
    })),
  ]

  const handleSearch = () => {
    const filtered = mockSuppliers.filter((supplier) => {
      const codeMatch =
        !searchConditions.supplierCode ||
        supplier.code.toLowerCase().includes(searchConditions.supplierCode.toLowerCase())
      const nameMatch =
        !searchConditions.supplierName ||
        supplier.name.toLowerCase().includes(searchConditions.supplierName.toLowerCase())
      const furiganaMatch =
        !searchConditions.furigana || supplier.furigana.toLowerCase().includes(searchConditions.furigana.toLowerCase())
      const phoneMatch = !searchConditions.phoneNumber || supplier.phone.includes(searchConditions.phoneNumber)
      const faxMatch = !searchConditions.faxNumber || supplier.fax.includes(searchConditions.faxNumber)

      return codeMatch && nameMatch && furiganaMatch && phoneMatch && faxMatch
    })

    setSearchResults(filtered)
    setShowResults(true)
    setCurrentPage(1)
  }

  const handleClear = () => {
    setSearchConditions({
      supplierCode: "",
      supplierName: "",
      furigana: "",
      phoneNumber: "",
      faxNumber: "",
    })
    setSearchResults([])
    setShowResults(false)
    setCurrentPage(1)
  }

  const handleSelect = (supplier: any) => {
    onSelect({ code: supplier.code, name: supplier.name })
    handleOpenChange(false)
  }

  const itemsPerPageNum = Number.parseInt(itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPageNum
  const indexOfFirstItem = (currentPage - 1) * itemsPerPageNum
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(searchResults.length / itemsPerPageNum)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto" style={{ backgroundColor: "#FAF5E9" }}>
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">仕入先検索</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Conditions */}
          <div className="grid grid-cols-5 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">仕入先コード</label>
              <Input
                value={searchConditions.supplierCode}
                onChange={(e) => setSearchConditions((prev) => ({ ...prev, supplierCode: e.target.value }))}
                className="h-8 text-sm bg-white"
                placeholder="部分一致"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">仕入先名</label>
              <Input
                value={searchConditions.supplierName}
                onChange={(e) => setSearchConditions((prev) => ({ ...prev, supplierName: e.target.value }))}
                className="h-8 text-sm bg-white"
                placeholder="部分一致"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">ふりがな</label>
              <Input
                value={searchConditions.furigana}
                onChange={(e) => setSearchConditions((prev) => ({ ...prev, furigana: e.target.value }))}
                className="h-8 text-sm bg-white"
                placeholder="部分一致"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">電話番号</label>
              <Input
                value={searchConditions.phoneNumber}
                onChange={(e) => setSearchConditions((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                className="h-8 text-sm bg-white"
                placeholder="部分一致"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">FAX番号</label>
              <Input
                value={searchConditions.faxNumber}
                onChange={(e) => setSearchConditions((prev) => ({ ...prev, faxNumber: e.target.value }))}
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
                  className="grid grid-cols-7 gap-2 p-2 border-b font-medium text-sm"
                  style={{ backgroundColor: "#FAF5E9" }}
                >
                  <div>仕入先コード</div>
                  <div>仕入先名</div>
                  <div>ふりがな</div>
                  <div>電話番号</div>
                  <div>FAX番号</div>
                  <div>発注方法</div>
                  <div>発注書表示用メモ</div>
                </div>
                {currentItems.map((supplier, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-7 gap-2 p-2 border-b hover:bg-blue-50 cursor-pointer text-sm"
                    style={{ backgroundColor: "#FAF5E9" }}
                    onClick={() => handleSelect(supplier)}
                  >
                    <div>{supplier.code}</div>
                    <div>{supplier.name}</div>
                    <div>{supplier.furigana}</div>
                    <div>{supplier.phone}</div>
                    <div>{supplier.fax}</div>
                    <div>{supplier.orderMethod}</div>
                    <div>{supplier.orderMemo}</div>
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
