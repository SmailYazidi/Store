"use client"

import { Search, X } from "lucide-react"
import { useState } from "react"

const SearchBar = () => {
  const [query, setQuery] = useState("")
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop search */}
      <div className="hidden md:flex flex-1 mx-6 max-w-md">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-md border text-black focus:outline-none"
          />
          <Search className="absolute right-3 top-2.5 text-gray-500" size={18} />
        </div>
      </div>

      {/* Mobile search icon */}
      <div className="md:hidden">
        <button onClick={() => setIsMobileOpen(prev => !prev)} aria-label="Toggle search">
          {isMobileOpen ? <X size={22} /> : <Search size={22} />}
        </button>
      </div>

      {/* Full-header mobile search mode */}
      {isMobileOpen && (
        <div className="absolute top-0 left-0 w-full h-16 bg-white z-50 flex items-center px-4 shadow">
          <input
            autoFocus
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-md border text-black focus:outline-none"
          />
          <button onClick={() => setIsMobileOpen(false)} className="ml-2 text-black">
            <X size={24} />
          </button>
        </div>
      )}
    </>
  )
}

export default SearchBar
