"use client"

import SearchBar from "./header/Search"
import LanguageDropdown from "./header/LanguageDropdown"
import Logo from "./header/Logo"
import LeftMenu from "./header/LeftMenu"

interface ClientHeaderProps {
  onMenuClick: () => void
}

const AdminHeader = ({ onMenuClick }: ClientHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white text-black w-full py-4 ">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
        {/* Left section */}
        <div className="w-1/4 flex items-center gap-4">
          <LeftMenu onMenuClick={onMenuClick} />
          <Logo />
        </div>

        {/* Right section */}
        <div className="w-3/4 flex items-center justify-end gap-4">
          <SearchBar />
          <LanguageDropdown />
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
