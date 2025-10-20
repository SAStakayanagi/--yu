"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface CustomerSearchDialogProps {
  isOpen?: boolean
  open?: boolean
  onClose?: () => void
  onOpenChange?: (open: boolean) => void
  onSelect: (customer: any) => void
  itemsPerPage?: "50" | "100"
  onItemsPerPageChange?: (value: "50" | "100") => void
}

export default function CustomerSearchDialog({
  isOpen,
  open,
  onClose,
  onOpenChange,
  onSelect,
  itemsPerPage = "50",
  onItemsPerPageChange = () => {},
}: CustomerSearchDialogProps) {
  const isDialogOpen = isOpen ?? open ?? false
  const handleOpenChange = (openState: boolean) => {
    if (onOpenChange) onOpenChange(openState)
    if (onClose && !openState) onClose()
  }

  const [searchConditions, setSearchConditions] = useState({
    customerCode: "",
    customerName: "",
    personInCharge: "",
    assistantName: "",
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)

  const mockCustomers = [
    {
      code: "0001",
      name: "●●大学",
      personInCharge: "田中太郎",
      assistantName: "佐藤花子",
      phone: "03-1234-5678",
      address: "東京都千代田区",
    },
    {
      code: "0002",
      name: "△△研究所",
      personInCharge: "鈴木一郎",
      assistantName: "高橋美咲",
      phone: "03-2345-6789",
      address: "東京都港区",
    },
    {
      code: "0003",
      name: "□□病院",
      personInCharge: "山田次郎",
      assistantName: "伊藤愛",
      phone: "03-3456-7890",
      address: "東京都新宿区",
    },
    {
      code: "0004",
      name: "☆☆製薬",
      personInCharge: "渡辺三郎",
      assistantName: "中村優子",
      phone: "03-4567-8901",
      address: "東京都渋谷区",
    },
    // Add more mock data to test pagination
    ...Array.from({ length: 100 }, (_, i) => ({
      code: String(i + 5).padStart(4, "0"),
      name: `テスト得意先${i + 5}`,
      personInCharge: `担当者${i + 5}`,
      assistantName: `アシスタント${i + 5}`,
      phone: `03-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      address: `東京都${["千代田区", "港区", "新宿区", "渋谷区"][Math.floor(Math.random() * 4)]}`,
    })),
  ]

  const handleSearch = () => {
    const filtered = mockCustomers.filter((customer) => {
      const codeMatch =
        !searchConditions.customerCode ||
        customer.code.toLowerCase().includes(searchConditions.customerCode.toLowerCase())
      const nameMatch =
        !searchConditions.customerName ||
        customer.name.toLowerCase().includes(searchConditions.customerName.toLowerCase())
      const personInChargeMatch =
        !searchConditions.personInCharge ||
        customer.personInCharge.toLowerCase().includes(searchConditions.personInCharge.toLowerCase())
      const assistantMatch =
        !searchConditions.assistantName ||
        customer.assistantName.toLowerCase().includes(searchConditions.assistantName.toLowerCase())

      return codeMatch && nameMatch && personInChargeMatch && assistantMatch
    })

    setSearchResults(filtered)
    setShowResults(true)
    setCurrentPage(1)
  }

  const handleClear = () => {
    setSearchConditions({
      customerCode: "",
      customerName: "",
      personInCharge: "",
      assistantName: "",
    })
    setSearchResults([])
    setShowResults(false)
    setCurrentPage(1)
  }

  const handleSelect = (customer: any) => {
    onSelect({ code: customer.code, name: customer.name })
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
          <DialogTitle className="text-lg font-medium">得意先検索</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Conditions */}
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">得意先コード</label>
              <Input
                value={searchConditions.customerCode}
                onChange={(e) => setSearchConditions((prev) => ({ ...prev, customerCode: e.target.value }))}
                className="h-8 text-sm bg-white"
                placeholder="部分一致"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">得意先名</label>
              <Input
                value={searchConditions.customerName}
                onChange={(e) => setSearchConditions((prev) => ({ ...prev, customerName: e.target.value }))}
                className="h-8 text-sm bg-white"
                placeholder="部分一致"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">担当者名</label>
              <Input
                value={searchConditions.personInCharge}
                onChange={(e) => setSearchConditions((prev) => ({ ...prev, personInCharge: e.target.value }))}
                className="h-8 text-sm bg-white"
                placeholder="部分一致"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">アシスタント名</label>
              <Input
                value={searchConditions.assistantName}
                onChange={(e) => setSearchConditions((prev) => ({ ...prev, assistantName: e.target.value }))}
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
                <RadioGroupItem value="50" id="customer-50" />
                <Label htmlFor="customer-50" className="text-sm">
                  50件
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="100" id="customer-100" />
                <Label htmlFor="customer-100" className="text-sm">
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
                  className="grid grid-cols-6 gap-2 p-2 border-b font-medium text-sm"
                  style={{ backgroundColor: "#FAF5E9" }}
                >
                  <div>得意先コード</div>
                  <div>得意先名</div>
                  <div>担当者名</div>
                  <div>アシスタント名</div>
                  <div>電話番号</div>
                  <div>住所</div>
                </div>
                {currentItems.map((customer, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-6 gap-2 p-2 border-b hover:bg-blue-50 cursor-pointer text-sm"
                    style={{ backgroundColor: "#FAF5E9" }}
                    onClick={() => handleSelect(customer)}
                  >
                    <div>{customer.code}</div>
                    <div>{customer.name}</div>
                    <div>{customer.personInCharge}</div>
                    <div>{customer.assistantName}</div>
                    <div>{customer.phone}</div>
                    <div>{customer.address}</div>
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
