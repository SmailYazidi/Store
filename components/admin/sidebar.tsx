"use client"

import { sidebarAdminItems } from "@/constant/constants"
import Link from "next/link"
import Logo from "./header/Logo"
import { X } from "lucide-react"

interface ClientSidebarProps {
  onClose: () => void
}

const AdminSidebar = ({ onClose }: ClientSidebarProps) => {
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-black z-50">
      {/* Logo section with close button */}
      <div className="flex items-center justify-between p-4 border-b border-black">
        <Logo />
        <button onClick={onClose} aria-label="Close sidebar" className="text-black">
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
              className="block px-4 py-2 text-black hover:bg-black hover:text-white rounded"
            >
              {item.label}
            </Link>
          ) : null
        )}
      </nav>
    </aside>
  )
}

export default AdminSidebar
