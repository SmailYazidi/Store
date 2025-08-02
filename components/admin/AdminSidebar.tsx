"use client"

import { Package, ShoppingCart, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useLanguage } from "@/app/providers"

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const { t } = useLanguage()

  const menuItems = [
    {
      id: "products",
      title: t("products"),
      icon: Package,
    },
    {
      id: "categories",
      title: t("categories"),
      icon: Folder,
    },
    {
      id: "orders",
      title: t("orders"),
      icon: ShoppingCart,
    },
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("admin")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild isActive={activeTab === item.id}>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab(item.id)}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
