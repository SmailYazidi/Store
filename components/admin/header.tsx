"use client"
import { Button } from "@/components/ui/button"
import { Menu, LogOut } from "lucide-react"

interface AdminHeaderProps {
  onMenuClick: () => void
  onLogout: () => void
}

export default function AdminHeader({ onMenuClick, onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Desktop title */}
      <div className="hidden lg:block">
        <h2 className="text-lg font-semibold text-gray-900">Store Management</h2>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onLogout} className="flex items-center space-x-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  )
}
