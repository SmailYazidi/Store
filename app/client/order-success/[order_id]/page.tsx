"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LocalizedString {
  ar: string;
  fr: string;
}

interface Order {
  _id: string;
  orderCode: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  productId: string;
  productName: LocalizedString;
  productPrice: number;
  productImage: string;
  currency: string;
  status: string;
  paymentMethod: string | null;
  paymentStatus: string;
  verificationCode: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function OrderSuccessPage({ params }: { params: { order_id: string } }) {
  const { order_id } = params;
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/client/orders/${order_id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    }
    fetchOrder();
  }, [order_id]);

  useEffect(() => {
    if (order && order.isVerified && !order.paymentMethod) {
      router.push(`/client/payment/${order._id}`);
    }
  }, [order, router]);

  if (loading) return <p>Loading order info...</p>;
  if (error) return <p>Error loading order: {error}</p>;
  if (!order) return <p>No order found.</p>;

  return (
    <div className="bg-white text-gray-900 w-full min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Order Success</h1>

        <div className="bg-white shadow rounded p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Order Details</h2>
          <p><strong>Order Code:</strong> {order.orderCode}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Verified:</strong> {order.isVerified ? "Yes" : "No"}</p>
          <p><strong>Verification Code:</strong> {order.verificationCode}</p>
          <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        <div className="bg-white shadow rounded p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Customer Information</h2>
          <p><strong>Name:</strong> {order.customerName}</p>
          {order.customerEmail && <p><strong>Email:</strong> {order.customerEmail}</p>}
          {order.customerPhone && <p><strong>Phone:</strong> {order.customerPhone}</p>}
          {order.customerAddress && <p><strong>Address:</strong> {order.customerAddress}</p>}
        </div>

        <div className="bg-white shadow rounded p-6 mb-6 flex items-center space-x-4">
          <img
            src={`/images/products/${order.productImage}`}
            alt={order.productName.ar}
            className="w-24 h-24 object-cover rounded"
          />
          <div>
            <h2 className="text-xl font-semibold">{order.productName.ar} / {order.productName.fr}</h2>
            <p className="text-lg font-bold">
              {order.productPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })} {order.currency}
            </p>
          </div>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-2">Payment Information</h2>
          <p><strong>Method:</strong> {order.paymentMethod ?? "Not selected"}</p>
          <p><strong>Status:</strong> {order.paymentStatus}</p>
        </div>

        {!order.isVerified && (
          <button
            onClick={() => router.push(`/client/verify/${order._id}`)}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            Verify Order
          </button>
        )}
      </div>
    </div>
  );
}
