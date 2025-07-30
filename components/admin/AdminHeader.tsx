"use client"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useLanguage } from "@/app/providers"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function AdminHeader() {
  const { t } = useLanguage()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">
            {t("admin")} - {t("dashboard")}
          </h1>
        </div>

        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          تسجيل الخروج
        </Button>
      </div>
    </header>
  )
}
