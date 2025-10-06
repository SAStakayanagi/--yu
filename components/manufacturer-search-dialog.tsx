"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ManufacturerSearchDialogProps {
  isOpen?: boolean
  open?: boolean
  onClose?: () => void
  onOpenChange?: (open: boolean) => void
  onSelect: (manufacturer: { code: string; name: string }) => void
  itemsPerPage?: string
  onItemsPerPageChange?: (value: string) => void
}

export default function ManufacturerSearchDialog({
  isOpen,
  open,
  onClose,
  onOpenChange,
  onSelect,
  itemsPerPage,
  onItemsPerPageChange,
}: ManufacturerSearchDialogProps) {
  const dialogOpen = isOpen ?? open ?? false
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose?.()
      onOpenChange?.(false)
    }
  }

  const [searchConditions, setSearchConditions] = useState({
    manufacturerCode: "",
    manufacturerName: "",
    furigana: "",
    phoneNumber: "",
  })
  const [searchResults, setSearchResults] = useState<
    Array<{
      code: string
      name: string
      furigana: string
      phone: string
    }>
  >([])
  const [showResults, setShowResults] = useState(false)

  const handleSearch = () => {
    // Mock search results
    const mockResults = [
      {
        code: "M001",
        name: "サンプルメーカー株式会社",
        furigana: "サンプルメーカーカブシキガイシャ",
        phone: "03-1111-2222",
      },
      { code: "M002", name: "テストメーカー工業", furigana: "テストメーカーコウギョウ", phone: "03-2222-3333" },
      { code: "M003", name: "デモ製造株式会社", furigana: "デモセイゾウカブシキガイシャ", phone: "03-3333-4444" },
    ]

    setSearchResults(mockResults)
    setShowResults(true)
  }

  const handleClear = () => {
    setSearchConditions({
      manufacturerCode: "",
      manufacturerName: "",
      furigana: "",
      phoneNumber: "",
    })
    setSearchResults([])
    setShowResults(false)
  }

  const handleSelect = (manufacturer: { code: string; name: string }) => {
    onSelect(manufacturer)
    handleOpenChange(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" style={{ backgroundColor: "#FAF5E9" }}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-medium">メーカーコード検索</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Conditions */}
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">メーカーコード</label>
              <Input
                value={searchConditions.manufacturerCode}
                onChange={(e) => setSearchConditions((prev) => ({ ...prev, manufacturerCode: e.target.value }))}
                className="h-8 text-sm bg-white"
                placeholder="部分一致"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">メーカー名</label>
              <Input
                value={searchConditions.manufacturerName}
                onChange={(e) => setSearchConditions((prev) => ({ ...prev, manufacturerName: e.target.value }))}
                className="h-8 text-sm bg-white"
                placeholder="部分一致"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">フリガナ</label>
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
              <div className="border border-gray-300 rounded bg-white">
                <div className="grid grid-cols-4 gap-2 p-2 bg-gray-100 border-b font-medium text-sm">
                  <div>メーカーコード</div>
                  <div>メーカー名</div>
                  <div>フリガナ</div>
                  <div>電話番号</div>
                </div>
                {searchResults.map((manufacturer, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-2 p-2 border-b hover:bg-blue-50 cursor-pointer text-sm"
                    onClick={() => handleSelect({ code: manufacturer.code, name: manufacturer.name })}
                  >
                    <div>{manufacturer.code}</div>
                    <div>{manufacturer.name}</div>
                    <div>{manufacturer.furigana}</div>
                    <div>{manufacturer.phone}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
