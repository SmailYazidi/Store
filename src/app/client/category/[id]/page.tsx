import { useEffect, useState } from "react"

interface CategoryPageProps {
  params: {
    id: string
  }
}

interface Product {
  _id: string
  name: string
  price: number
  isVisible: boolean
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`/api/client/products?categoryId=${params.id}`)
        if (!res.ok) throw new Error("Failed to fetch products.")
        const data = await res.json()
        setProducts(data.products || [])
      } catch (err: any) {
        setError(err.message || "Error fetching products.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [params.id])

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>
  if (products.length === 0) return <p>No products found in this category.</p>

  return (
    <div style={{ padding: 16 }}>
      <h1>Products in Category</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {products.map(product => (
          <li key={product._id} style={{ marginBottom: 12 }}>
            <h2>{product.name}</h2>
            <p>Price: {product.price}</p>
            <p>Status: {product.isVisible ? "Available" : "Hidden"}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
