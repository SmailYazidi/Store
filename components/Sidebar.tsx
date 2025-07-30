"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, Truck } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useLanguage } from "@/app/providers"

export function AppSidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const items = [
    {
      title: t("store"),
      url: "/",
      icon: Home,
    },
    {
      title: t("products"),
      url: "/",
      icon: Package,
    },
    {
      title: t("trackOrder"),
      url: "/track-order",
      icon: Truck,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold">{t("store")}</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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

// Export as default for backward compatibility
export { AppSidebar as Sidebar }
