"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/app/providers"

export function Header() {
  const { language, setLanguage, t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="border-b bg-background px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setLanguage(language === "ar" ? "fr" : "ar")}>
            {language === "ar" ? "FR" : "AR"}
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <h1 className="text-xl font-bold">{t("store")}</h1>
        </div>
      </div>
    </header>
  )
}
