"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import AdminSidebar from "./sidebar"
import AdminHeader from "./header"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      const response = await fetch("/api/admin/account")
      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        if (pathname !== "/admin/login") {
          router.push("/admin/login")
        }
      }
    } catch (error) {
      if (pathname !== "/admin/login") {
        router.push("/admin/login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    // Clear tokens
    document.cookie = "admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    localStorage.removeItem("admin-token")

    // Redirect to login
    router.push("/admin/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAuthenticated && pathname !== "/admin/login") {
    return null
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} onLogout={handleLogout} />

        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
