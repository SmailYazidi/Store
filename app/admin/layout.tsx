"use client"

import type React from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [pathname])

  const checkAuth = async () => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/account")
      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        router.push("/admin/login")
        return
      }
    } catch (error) {
      router.push("/admin/login")
      return
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Show login page without layout
  if (pathname === "/admin/login") {
    return children
  }

  // Show admin layout for authenticated users
  if (isAuthenticated) {
    return <AdminLayout>{children}</AdminLayout>
  }

  return null
}
