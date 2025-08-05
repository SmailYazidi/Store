"use client"

import React, { useState,useEffect } from "react"
import AdminSidebar from "@/components/admin/sidebar"
import AdminHeader from "@/components/admin/header"
import { useRouter, usePathname } from "next/navigation"
import AdminDashboard from "@/components/admin/main/page"
import Loading from '@/components/Loading';
export default function Admin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
 const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)




  useEffect(() => {
 
    if (pathname === "/admin/login") {
      setLoading(false)
      return
    }

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


  if (loading) {
    return (
  <Loading />
    )
  }

  return (
    <div className="relative min-h-screen flex flex-col">

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

        <AdminDashboard/>
      </main>
      </div>
    </div>
  )
}





