import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface LocalizedString {
  ar: string;
  fr: string;
  en?: string;
}

interface Product {
  _id: string;
  name: LocalizedString;
  description?: LocalizedString;
  price: number;
  currency: string;
  images: string[];
  mainImage: string;
  categoryId: string;
  isVisible: boolean;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: LocalizedString;
  description?: LocalizedString;
  createdAt: string;
  updatedAt: string;
}

async function fetchCategory(productId: string): Promise<Category> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/client/categories/${productId}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("فشل جلب بيانات التصنيف");
  const response = await res.json();
  if (!response.success || !response.data) {
    throw new Error("بيانات التصنيف غير صالحة");
  }
  return response.data;
}

async function fetchProducts(productId: string): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/client/categories/products/${productId}`,
    {
      cache: "no-store",
      next: { tags: ["products"] },
    }
  );
  if (!res.ok) throw new Error("فشل جلب المنتجات");
  return res.json();
}

export default async function ProductsPage({
  params,
}: {
  params: { productId: string };
}) {
  try {
    const [category, products] = await Promise.all([
      fetchCategory(params.productId),
      fetchProducts(params.productId),
    ]);

    return (
      <div className="bg-white text-gray-900 w-full min-h-screen px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="العودة إلى التصنيفات"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">{category.name.ar}</h1>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <p className="text-gray-500">لا توجد منتجات في هذا التصنيف.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/client/product/${product._id}`}
                className="border rounded-xl shadow p-4 hover:shadow-md transition-shadow block hover:border-primary"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg mb-2 bg-gray-100">
                  {/* <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL || ''}/images/${product.mainImage}`}
                    alt={product.name.ar}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                    }}
                  /> */}
                </div>
                <h2 className="text-lg font-semibold">{product.name.ar}</h2>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {product.description?.ar ?? "لا يوجد وصف"}
                </p>
                <p className="mt-2 font-bold">
                  {product.price.toLocaleString()} {product.currency}
                </p>
                {product.quantity <= 0 && (
                  <p className="text-red-500 text-sm mt-1">نفذت الكمية</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in ProductsPage:", error);
    return notFound();
  }
}
