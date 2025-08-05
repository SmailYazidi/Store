"use client"

import Link from "next/link"
import { Category, Product } from "@/lib/models"

import { ArrowRight } from "lucide-react"
import Image from "next/image"

const CategorySection = ({
  category,
  products,
}: {
  category: Category
  products: Product[]
}) => {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">{category.name.fr}</h2>
        <Link
             href={`/client/categories/products/${category._id}`}
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          Voir tout <ArrowRight size={18} />
        </Link>
      </div>

      <div className="relative">
        <div
          className="flex overflow-x-auto md:overflow-x-visible space-x-4 pb-2 md:pb-0"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/client/product/${product._id}`}
              className="min-w-[45%] sm:min-w-[40%] md:min-w-[unset] md:w-[160px] flex-shrink-0 scroll-snap-align-start hover:scale-105 transition-transform"
            >
              <div className="bg-white rounded shadow p-2 text-center">
                <div className="w-full h-32 relative mb-2">
                  <Image
                    src={product.mainImage}
                    alt={product.name.fr}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <p className="text-sm font-medium truncate">{product.name.fr}</p>
                <p className="text-xs text-gray-500">{product.price} €</p>
              </div>
            </Link>
          ))}

    
          <div className="flex items-center justify-center">
            <Link
              href={`/client/categories/products/${category._id}`}
              className="flex items-center justify-center w-10 h-32 rounded bg-gray-100 hover:bg-gray-200"
            >
              <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CategorySection
