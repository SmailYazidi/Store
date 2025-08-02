"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Mail, Calendar, Lock } from "lucide-react"

interface AdminAccount {
  id: string
  username: string
  email: string
  createdAt: string
}

export default function AccountPage() {
  const [account, setAccount] = useState<AdminAccount | null>(null)
  const [loading, setLoading] = useState(true)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    fetchAccount()
  }, [])

  const fetchAccount = async () => {
    try {
      const response = await fetch("/api/admin/account")
      if (!response.ok) throw new Error("فشل في جلب بيانات الحساب")

      const data = await response.json()
      setAccount(data.admin)
    } catch (error) {
      console.error("Error fetching account:", error)
      setMessage({ type: "error", text: "فشل في جلب بيانات الحساب" })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ type: "", text: "" })

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "كلمة المرور الجديدة وتأكيدها غير متطابقين" })
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: "error", text: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" })
      return
    }

    setUpdating(true)

    try {
      const response = await fetch("/api/admin/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "فشل في تحديث كلمة المرور")
      }

      setMessage({ type: "success", text: "تم تحديث كلمة المرور بنجاح" })
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">إعدادات الحساب</h1>
        <p className="text-gray-600">إدارة معلومات حسابك وكلمة المرور</p>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات الحساب</CardTitle>
          <CardDescription>معلومات حسابك الأساسية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {account && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">اسم المستخدم</p>
                  <p className="text-sm text-gray-600">{account.username}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">البريد الإلكتروني</p>
                  <p className="text-sm text-gray-600">{account.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">تاريخ إنشاء الحساب</p>
                  <p className="text-sm text-gray-600">{formatDate(account.createdAt)}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 ml-2" />
            تغيير كلمة المرور
          </CardTitle>
          <CardDescription>قم بتحديث كلمة المرور الخاصة بك</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {message.text && (
              <Alert variant={message.type === "error" ? "destructive" : "default"}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                required
                disabled={updating}
              />
            </div>

            <div>
              <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                required
                minLength={6}
                disabled={updating}
              />
              <p className="text-sm text-gray-500 mt-1">يجب أن تكون كلمة المرور 6 أحرف على الأقل</p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                required
                disabled={updating}
              />
            </div>

            <Button type="submit" disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جارٍ التحديث...
                </>
              ) : (
                "تحديث كلمة المرور"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
