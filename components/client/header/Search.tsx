
"use client"

import { Search, X } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

const SearchBar = () => {
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setProducts([])
      return
    }

    const delayDebounce = setTimeout(() => {
      fetch(`/api/client/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          setProducts(data)
          setIsModalOpen(true) // open modal automatically when results come
        })
        .catch(err => console.error(err))
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [query])

  return (
    <>
      {/* Desktop search */}
      <div className="hidden md:flex flex-1 mx-6 max-w-md relative">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-md border text-black focus:outline-none"
        />
        <Search className="absolute right-3 top-2.5 text-gray-500" size={18} />
      </div>

      {/* Mobile search icon */}
      <div className="md:hidden">
        <button onClick={() => setIsModalOpen(true)} aria-label="Open search">
          <Search size={18} />
        </button>
      </div>

      {/* Floating Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col">
          {/* Modal content */}
          <div className="bg-white w-full max-w-5xl mx-auto my-auto rounded-lg shadow-lg p-4 relative flex flex-col h-[90%]">
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => {
                setIsModalOpen(false)
                setQuery("")
              }}
            >
              <X size={24} />
            </button>

            {/* Search input */}
            <div className="flex mb-4">
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-4 py-2 rounded-md border text-black focus:outline-none"
              />
            </div>

            {/* Results grid */}
            <div className="overflow-y-auto">
              {products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {products.map((product) => (
                    <Link
                      key={product._id}
                      href={`/client/product/${product._id}`}
                      className="hover:scale-105 transition-transform"
                      onClick={() => setIsModalOpen(false)}
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
                query && <p className="text-gray-500 text-center mt-6">No results found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SearchBar

