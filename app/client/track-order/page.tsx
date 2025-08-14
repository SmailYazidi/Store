"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link"
export default function TrackOrderPage() {
  const [orderCode, setOrderCode] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);

    if (!orderCode) {
      setError("Please enter your order code");
      return;
    }

    try {
      const res = await fetch("/api/client/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderCode }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Order not found");
      }

      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message || "Error fetching order");
    }
  };

  return (
     <div className="bg-white text-gray-900 min-h-screen w-full flex flex-col items-center px-4 py-8">
  <div className="w-full max-w-xl">
    <div className="flex items-center gap-4 mb-6">
      <Link
        href={`/`}
        className="p-2 rounded-full hover:bg-gray-200"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>
      <h1 className="text-2xl font-bold">Track Your Order</h1>
    </div>

    

      <form onSubmit={handleTrack} className="w-full max-w-md flex flex-col gap-4 mb-6">
        <input
          type="text"
          value={orderCode}
          onChange={(e) => setOrderCode(e.target.value)}
          placeholder="Enter Order Code "
          className="border border-gray-700 rounded-md p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"
        />
        <button
          type="submit"
          className="bg-gray-900 text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition"
        >
          Track Order
        </button>
      </form>

      {error && <p className="text-red-600 font-medium">{error}</p>}

      {order && (
        <div className="w-full max-w-md bg-gray-100 p-6 rounded-md shadow-md text-gray-900">
          <h2 className="text-2xl font-semibold mb-4">Order Details:</h2>
          <p><strong>Order Code:</strong> {order.orderCode}</p>
          <p><strong>Customer Name:</strong> {order.customerName}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod || "Not specified"}</p>
          <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
        </div>
      )}
    </div>   </div>
  );
}
