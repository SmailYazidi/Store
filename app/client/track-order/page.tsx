"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Copy, Check } from "lucide-react";
export default function TrackOrderPage() {
  const [orderCode, setOrderCode] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
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
          <Link href={`/`} className="p-2 rounded-full hover:bg-gray-200">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Track Your Order</h1>
        </div>
   {!order && (
        <form
          onSubmit={handleTrack}
          className="w-full max-w-md flex flex-col gap-4 mb-6"
        >
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
        </form>)}

        {error && <p className="text-red-600 font-medium">{error}</p>}

        {order && (
          <div className="w-full max-w-md bg-gray-100 p-6 rounded-md shadow-md text-gray-900">
            <h2 className="text-2xl font-semibold mb-4">Order Details:</h2>    <img
           src={`${process.env.NEXT_PUBLIC_BLOB_BASE_URL}${order.productImage}`}
        alt={order.productName.fr || order.productName.fr || "Product"}
        className="w-24 h-24 object-cover rounded"
      />
            <p>
<p className="flex items-center gap-2">
  <strong>Order Code:</strong> {order.orderCode}
  <button
    type="button"
    onClick={() => {
      navigator.clipboard.writeText(order.orderCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000); // 1 second
    }}
    className="p-1 hover:bg-gray-200 rounded transition"
    title="Copy Order Code"
  >
    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-700" />}
  </button>
</p>
            </p>
            <p>
              <strong>Customer Name:</strong> {order.customerName}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
           
            <p>
              <strong>Payment Status:</strong> {order.paymentStatus}
            </p>

{/* Conditional buttons */}
{!order.isVerified && (
  <Link
    href={`/client/verify/${order._id}`}
    className="block w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-lg text-center font-medium transition"
  >
    Verify Order
  </Link>
)}

{order.isVerified && order.paymentStatus.toLowerCase() !== "paid" && (
  <Link
    href={`/client/payment/${order._id}`}
    className="block w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-lg text-center font-medium transition"
  >
    Proceed to Payment
  </Link>
)}

{order.isVerified && order.paymentStatus.toLowerCase() === "paid" && (
  <button
    disabled
    className="block w-full mt-4 bg-green-500 text-white py-3 px-6 rounded-lg text-center font-medium cursor-not-allowed"
  >
    Payment Completed
  </button>
)}


          </div>
        )}
      </div>
    </div>
  );
}
