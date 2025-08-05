import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, MessageCircle } from "lucide-react";

interface LocalizedString {
  ar: string;
  fr: string;
  en?: string;
}

interface Product {
  _id: string;
  name: LocalizedString;
  description: LocalizedString;
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

async function fetchProduct(productId: string): Promise<Product> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/client/products/${productId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch product data");
  }

  return res.json();
}

export default async function ProductPage({
  params,
}: {
  params: { productId: string };
}) {
  try {
    const product = await fetchProduct(params.productId);

    const whatsappMessage = `Hello, I am interested in purchasing ${product.name.en || product.name.fr || product.name.ar} (${product.price} ${product.currency})`;
    const whatsappLink = `https://wa.me/212719270155?text=${encodeURIComponent(whatsappMessage)}`;

    return (
   <div className="bg-white text-gray-900 w-full min-h-screen px-4 py-8">

        <div className="mb-6">
          <Link
            href="/"
            className="flex items-center text-blue-700 hover:text-blue-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Store
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
              <Image
                src={`/images/${product.mainImage}`}
                alt={product.name.en || product.name.fr || "Product image"}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-md overflow-hidden bg-gray-100"
                >
                  <Image
                    src={`/images/${image}`}
                    alt={`${product.name.en || "Product"} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {product.name.en || product.name.fr || "Product Name"}
            </h1>
            <p className="text-gray-700 mb-4">
              {product.description.en || product.description.fr || "Product description"}
            </p>

            <div className="mb-6">
              <span className="text-2xl font-bold text-gray-900">
                {product.price.toLocaleString()} {product.currency}
              </span>
              {product.quantity > 0 ? (
                <span className="ml-2 text-sm text-green-700">In Stock</span>
              ) : (
                <span className="ml-2 text-sm text-red-700">Out of Stock</span>
              )}
            </div>

            <div className="flex flex-col space-y-4 mb-8">
              <Link
                href={whatsappLink}
                target="_blank"
                className="bg-green-700 hover:bg-green-800 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Buy via WhatsApp
              </Link>

              <Link
                href={`/client/order-form/${product._id}`}
                className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                Buy on Website
              </Link>
            </div>

            <div className="border-t pt-4">
              <h2 className="font-semibold mb-2">Additional Information</h2>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p className="font-medium">Product ID</p>
                  <p>{product._id}</p>
                </div>
                <div>
                  <p className="font-medium">Date Added</p>
                  <p>{new Date(product.createdAt).toLocaleDateString("en-US")}</p>
                </div>
                <div>
                  <p className="font-medium">Available Quantity</p>
                  <p>{product.quantity}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    return notFound();
  }
}
