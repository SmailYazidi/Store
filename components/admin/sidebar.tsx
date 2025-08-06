
"use client"

import { sidebarAdminItems } from "@/constant/constants"
import Link from "next/link"
import Logo from "./header/Logo"
import { X } from "lucide-react"
import React from "react"
import {
  Home,
  Package,
  Phone,
  LayoutDashboard,
  Box,
  Tag,
  ShoppingCart,
  Settings,
} from "lucide-react"

interface AdminSidebarProps {
  onClose: () => void
}

const iconMap: Record<string, React.ReactNode> = {
  home: <Home size={18} />,
  package: <Package size={18} />,
  phone: <Phone size={18} />,
  dashboard: <LayoutDashboard size={18} />,
  box: <Box size={18} />,
  tag: <Tag size={18} />,
  "shopping-cart": <ShoppingCart size={18} />,
  settings: <Settings size={18} />,
}

const AdminSidebar = ({ onClose }: AdminSidebarProps) => {
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white z-50">
      {/* Logo section with close button */}
      <div className="flex items-center justify-between p-4">
        {/* Left section with Home icon and Logo */}
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Home size={18} className="text-black" /> </Link>
          <Logo />
          <Link href="/admin">
          </Link>
        </div>

        {/* Close button on the right */}
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="text-black"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation items */}
      <nav className="p-4 space-y-2">
        {sidebarAdminItems.map((item) =>
          item.visible ? (
            <Link
              key={item.route}
              href={item.route}
              className="flex items-center gap-2 px-4 py-2 text-black hover:bg-black hover:text-white rounded"
            >
              {iconMap[item.icon]}
              <span>{item.label}</span>
            </Link>
          ) : null
        )}
      </nav>
    </aside>
  ) // ✅ ← This was missing
}

export default AdminSidebar





