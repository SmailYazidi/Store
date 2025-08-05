"use client";

import { useEffect, useRef, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Loading from '@/components/Loading';
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

export default function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [error, setError] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/client/products/${productId}`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();
        setProduct(data);
        setMainImage(data.mainImage);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (error) return notFound();
  if (!product) return <Loading />;

  const whatsappMessage = `Hello, I am interested in purchasing ${product.name.en || product.name.fr || product.name.ar} (${product.price} ${product.currency})`;
  const whatsappLink = `https://wa.me/212719270155?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const scrollThumbnails = (direction: "left" | "right") => {
    const container = thumbnailsRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -150 : 150;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const allImages = [product.mainImage, ...product.images.filter(img => img !== product.mainImage)];

  return (
    <div className="bg-white text-gray-900 w-full min-h-screen px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-dark hover:text-dark">
          <ArrowLeft className="w-5 h-5 mr-2" />
          {product.name.fr}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
            <Image
              src={`/images/${mainImage}`}
              alt={product.name.en || product.name.fr || "Product image"}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Thumbnails with horizontal scroll and arrows */}
          <div className="relative">
            <button
              onClick={() => scrollThumbnails("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white shadow rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div
              ref={thumbnailsRef}
              className="flex overflow-x-auto gap-2 px-6 scrollbar-hide"
            >
              {allImages.map((image, index) => (
                <div
                  key={index}
                  className={`relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 cursor-pointer border ${
                    mainImage === image ? "border-blue-500" : "border-transparent"
                  }`}
                  onClick={() => setMainImage(image)}
                >
                  <Image
                    src={`/images/${image}`}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollThumbnails("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white shadow rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
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
                <p>
                  {new Date(product.createdAt).toLocaleDateString("en-US")}
                </p>
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
}
