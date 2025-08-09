'use client';

import { useState, useEffect } from 'react';
import Loading from '@/components/Loading';
import {ArrowLeft} from "lucide-react";
import Link from "next/link"
interface LocalizedString {
  ar: string;
  fr: string;
}

interface Product {
  _id: string;
  name: LocalizedString;
  price: number;
  currency: string;
  quantity: number;
}

export default function OrderForm({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/client/products/${productId}`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchProduct();
  }, [productId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const customerData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
    };

    try {
      const res = await fetch("/api/client/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          ...customerData,
        }),
      });

      if (!res.ok) throw new Error("Order creation failed");

      const responseData = await res.json();
      console.log("Verification code:", responseData.order.verificationCode);

      window.location.href = `/client/verify/${responseData.order._id}`;
    } catch (error) {
      console.error("Order submission failed:", error);
    }
  }

  if (!product) return <Loading />;

  return (
    <div className="bg-white text-gray-900 min-h-screen w-full flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-xl">
            <div className="flex items-center gap-4 mb-6">
          <Link
            href={`/client/product/${product._id}`}
            className="p-2 rounded-full hover:bg-gray-100"

          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Complete Order</h1>
        </div>
        <div className="mb-6 p-4 bg-white rounded-md">
          <h2 className="font-semibold mb-2">Product</h2>
          <p className="text-lg">{product.name.fr}</p>
          <p className="font-bold">
            {product.price.toLocaleString()} {product.currency}
          </p>
          <p className="text-sm">
            Available: {product.quantity}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              required
              className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium" htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              required
              className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium" htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              required
              rows={3}
              className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={product.quantity <= 0}
            className={`w-full py-3 rounded font-medium text-white ${
              product.quantity > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            } transition-colors`}
          >
            {product.quantity > 0 ? "Continue" : "Out of Stock"}
          </button>
        </form>
      </div>
    </div>
  );
}
