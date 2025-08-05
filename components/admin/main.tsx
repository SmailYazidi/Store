"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import  AdminSidebar  from "./sidebar"
import  AdminHeader  from "./header"
import { Loader2 } from "lucide-react"
import AdminDashboard from "./main/dashboard"
interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminMain({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setLoading(false)
      return
    }

    // Check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/account")
        if (!response.ok) {
          router.push("/admin/login")
          return
        }
        setLoading(false)
      } catch (error) {
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [pathname, router])

  // Show login page without layout
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
      <main className="p-4 pt-25 bg-white text-black min-h-screen">

        <AdminDashboard/>
      </main>
      
  )
}

export default AdminMain