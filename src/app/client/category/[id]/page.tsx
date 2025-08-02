"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const res = await fetch(`/api/client/products?categoryId=${params.id}`)
        const data = await res.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [params.id])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Products in Category {params.id}</h1>
      <ul>
        {products.map((product) => (
          <li key={product._id}>{product.name?.ar || product.name?.fr || "Unnamed"}</li>
        ))}
      </ul>
    </div>
  )
}
