"use client"

import { Search, X } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import Loading from "@/components/Loading"

const SearchBar = () => {
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setProducts([])
      return
    }

    const delayDebounce = setTimeout(() => {
      setLoading(true)
      fetch(`/api/client/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [query])

  return (
    <>
      {/* Desktop search */}
      <div className="hidden md:flex flex-1 mx-6 max-w-md">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsSearchOpen(true)
            }}
            className="w-full px-4 py-2 rounded-md border text-black focus:outline-none"
          />
          <Search className="absolute right-3 top-2.5 text-gray-500" size={18} />
        </div>
      </div>

      {/* Mobile search icon */}
      <div className="md:hidden">
        <button onClick={() => setIsSearchOpen(true)} aria-label="Open search">
          <Search size={18} />
        </button>
      </div>

      {/* Full-screen search overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Desktop container */}
          <div className="md:mb-10 md:max-w-7xl md:mx-auto w-full">
            
            {/* Search bar at top */}
            <div className="flex items-center px-4 py-3 ">
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-4 py-2 rounded-md border text-black focus:outline-none"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false)
                  setQuery("")
                }}
                className="ml-2 text-black"
              >
                <X size={24} />
              </button>
            </div>

            {/* Results or tips */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex justify-center mt-6">
                  <Loading />
                </div>
              ) : !query.trim() ? (
                <p className="text-gray-500 text-center mt-6">
                  Start typing to find products
                </p>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {products.map((product) => (
                    <Link
                      key={product._id}
                      href={`/client/product/${product._id}`}
                      className="hover:scale-105 transition-transform"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <div className="bg-white rounded shadow p-3 text-center">
                        <div className="w-full h-32 relative mb-2">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_BLOB_BASE_URL}${product.mainImage}`}
                            alt={product.name.fr}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <p className="text-sm font-medium truncate">
                          {product.name.fr}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.price} {product.currency}
                        </p>
                        {product.quantity <= 0 && (
                          <p className="text-red-500 text-sm mt-1">نفذت الكمية</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center mt-6">No results found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SearchBar
