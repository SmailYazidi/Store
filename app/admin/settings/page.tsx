"use client"

import { useEffect, useState } from "react"
import { Loader2, User, Mail, Calendar, Lock } from "lucide-react"
import Loading from '@/components/Loading';
import AdminSidebar from "@/components/admin/sidebar"
import AdminHeader from "@/components/admin/header"
interface AdminAccount {
  id: string
  username: string
  email: string
  createdAt: string
}

export default function AccountPage() {
  const [account, setAccount] = useState<AdminAccount | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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
     <Loading/>
    )
  }

  return (   <div className="relative min-h-screen flex flex-col">

      {isSidebarOpen && (
        <div className="fixed inset-0 z-90">
          {isSidebarOpen && <AdminSidebar onClose={() => setIsSidebarOpen(false)} />}

   <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      )}


      <div className="flex-1 flex flex-col">
        <AdminHeader onMenuClick={() => setIsSidebarOpen(prev => !prev)} />



          <main className="p-4 pt-25 bg-white text-black min-h-screen">
<div className="mb-10 max-w-7xl mx-auto">
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">إعدادات الحساب</h1>
        <p className="text-gray-600">إدارة معلومات حسابك وكلمة المرور</p>
      </div>

      {/* Account Info */}
      <div className="border rounded-lg p-4 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold mb-1">معلومات الحساب</h2>
        <p className="text-sm text-gray-500 mb-2">معلومات حسابك الأساسية</p>

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
      </div>

      {/* Password Change */}
      <div className="border rounded-lg p-4 shadow-sm">
        <h2 className="text-xl font-semibold flex items-center mb-2">
          <Lock className="h-5 w-5 ml-2" />
          تغيير كلمة المرور
        </h2>
        <p className="text-sm text-gray-500 mb-4">قم بتحديث كلمة المرور الخاصة بك</p>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {message.text && (
            <div className={`p-3 rounded text-sm ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {message.text}
            </div>
          )}

          <div>
            <label htmlFor="currentPassword" className="block mb-1 text-sm font-medium">كلمة المرور الحالية</label>
            <input
              id="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
              disabled={updating}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block mb-1 text-sm font-medium">كلمة المرور الجديدة</label>
            <input
              id="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
              minLength={6}
              disabled={updating}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">يجب أن تكون كلمة المرور 6 أحرف على الأقل</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium">تأكيد كلمة المرور الجديدة</label>
            <input
              id="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
              disabled={updating}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center disabled:opacity-50"
          >
            {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {updating ? "جارٍ التحديث..." : "تحديث كلمة المرور"}
          </button>
        </form>
      </div>
    </div></div>
    </main>
      </div>
    </div>
  )
}
