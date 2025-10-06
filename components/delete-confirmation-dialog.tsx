"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export default function DeleteConfirmationDialog({ open, onOpenChange, onConfirm }: DeleteConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-center">確認</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-center">
            対象発注を削除します。よろしいでしょうか？
            <br />
            ※一度削除するとデータを復元することができません
          </p>
        </div>

        <DialogFooter className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6 py-2 text-sm">
            キャンセル
          </Button>
          <Button onClick={handleConfirm} className="px-6 py-2 text-sm bg-red-500 text-white hover:bg-red-600">
            削除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
