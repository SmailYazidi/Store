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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsSidebarOpen(false)} />
          <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} onLogout={handleLogout} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
