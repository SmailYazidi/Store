"use client"

import SearchBar from "./header/Search"
import LanguageDropdown from "./header/LanguageDropdown"
import Logo from "./header/Logo"
import LeftMenu from "./header/LeftMenu"

interface ClientHeaderProps {
  onMenuClick: () => void
}

const ClientHeader = ({ onMenuClick }: ClientHeaderProps) => {
  return (
    <header className="flex items-center justify-between px-4 py-4 bg-white text-black border-b border-black w-full">
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
    </header>
  )
}

export default ClientHeader
