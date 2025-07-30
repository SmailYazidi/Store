"use client"

import { useState } from "react"
import { Search, ShoppingCart, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useLanguage } from "@/app/providers"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar")
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">{t("store")}</h1>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder={t("searchProducts")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleLanguage} className="h-9 w-9">
            <Globe className="h-4 w-4" />
            <span className="sr-only">Toggle language</span>
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only">{t("cart")}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
