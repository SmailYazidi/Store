"use client"

import { Menu } from "lucide-react"

interface LeftMenuProps {
  onMenuClick: () => void
}

const LeftMenu = ({ onMenuClick }: LeftMenuProps) => {
  return (
    <button onClick={onMenuClick}  aria-label="Toggle menu">
      <Menu className="w-6 h-6" />
    </button>
  )
}

export default LeftMenu
