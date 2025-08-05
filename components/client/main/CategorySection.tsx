"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Category, Product } from "@/lib/models"
import AnimatedText from "./AnimatedText" // Make sure this component is imported

const CategorySection = ({
 
  category,
  products,
}: {
  category: Category
  products: Product[]
}) => {
  return (
    <section className="mb-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-0">
        <h2 className="text-xl font-bold">{category.name.fr}</h2>
        <Link
          href={`/client/categories/products/${category._id}`}
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          Voir tout <ArrowRight size={18} />
        </Link>
      </div>

      {/* Product List */}
      <div className="relative px-0">
        <div
          className="flex overflow-x-auto lg:overflow-x-visible space-x-4 pb-3 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {products.slice(0, 6).map((product) => (
            <Link
              key={product._id}
              href={`/client/product/${product._id}`}
              className="min-w-[40%] sm:min-w-[30%] md:min-w-[25%] lg:min-w-[unset] lg:w-[200px] flex-shrink-0 snap-start hover:scale-105 transition-transform"
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
                <AnimatedText text={product.name.fr} />
                <p className="text-xs text-gray-500">{product.price} €</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection
