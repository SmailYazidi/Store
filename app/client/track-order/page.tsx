"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center p-6 w-full">
      {/* Arrow Left */}
      <div className="w-full max-w-md mb-4 flex items-center">
        <button
          onClick={() => router.back()}
          className="text-gray-800 hover:text-gray-600 flex items-center"
        >
          <ArrowLeft className="mr-2" />
          Back
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Track Your Order</h1>

      <form onSubmit={handleTrack} className="w-full max-w-md flex flex-col gap-4 mb-6">
        <input
          type="text"
          value={orderCode}
          onChange={(e) => setOrderCode(e.target.value)}
          placeholder="Enter Order Code (e.g. #ORD-7775)"
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
    </div>
  );
}
