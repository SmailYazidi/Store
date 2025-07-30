"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/app/providers"
import { AlertTriangle } from "lucide-react"

interface DeleteConfirmDialogProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmDialog({ title, message, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  const { t } = useLanguage()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-red-600">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">{message}</p>

          <div className="flex gap-2">
            <Button variant="destructive" onClick={onConfirm} className="flex-1">
              {t("confirm")}
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              {t("cancel")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
