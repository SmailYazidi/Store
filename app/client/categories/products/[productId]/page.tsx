import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

async function fetchCategory(productId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/client/categories/${productId}`,
    { cache: "no-store" }
  )
  if (!res.ok) throw new Error("فشل جلب بيانات التصنيف")
  const response = await res.json()
  if (!response.success || !response.data) {
    throw new Error("بيانات التصنيف غير صالحة")
  }
  return response.data
}

async function fetchProducts(productId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/client/categories/products/${productId}`,
    {
      cache: "no-store",
      next: { tags: ["products"] },
    }
  )
  if (!res.ok) throw new Error("فشل جلب المنتجات")
  return res.json()
}

export default async function ProductsPage({
  params,
}: {
  params: { productId: string }
}) {
  try {
    const [category, products] = await Promise.all([
      fetchCategory(params.productId),
      fetchProducts(params.productId),
    ])

    if (!Array.isArray(products)) {
      throw new Error("المنتجات غير متوفرة أو غير صالحة")
    }

    return (
      <div className="bg-white text-gray-900 w-full min-h-screen px-4 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="العودة إلى التصنيفات"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">{category.name.fr}</h1>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <p className="text-gray-500">لا توجد منتجات في هذا التصنيف.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/client/product/${product._id}`}
                className="hover:scale-105 transition-transform"
              >
                <div className="bg-white rounded shadow p-3 text-center">
                  <div className="w-full h-32 relative mb-2">
                    <Image
                      src={product.mainImage} // Use directly if it’s a full URL
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
        )}
      </div>
    )
  } catch (error) {
    console.error("Error in ProductsPage:", error)
    return notFound()
  }
}
