"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DetailDeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export default function DetailDeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
}: DetailDeleteConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">確認</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-700">
            対象発注明細を削除します。よろしいでしょうか？
            <br />
            ※一度削除するとデータを復元することができません
          </p>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 text-sm bg-white hover:bg-gray-100 text-gray-900 border-gray-300"
          >
            いいえ
          </Button>
          <Button onClick={handleConfirm} className="h-9 text-sm bg-red-500 text-white hover:bg-red-600">
            はい
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
