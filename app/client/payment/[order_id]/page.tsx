'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage({ params }: { params: { order_id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/client/orders/${params.order_id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch order");
        }

        if (!data.isVerified) {
          router.push(`/client/verify/${params.order_id}`);
          return;
        }

        setOrder(data);
      } catch (err: any) {
        setError(err.message || "Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [params.order_id, router]);

  const handleCashOnDelivery = async () => {
    if (!order) return;

    try {
      const response = await fetch(`/api/client/orders/${order._id}/change-payment-method`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod: "cash_on_delivery",
          paymentStatus: "pending",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update payment method");
      }

      router.push(`/client/order-success/${order._id}`);
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Error processing payment");
    }
  };

  if (isLoading)
    return (
      <div className="bg-white text-gray-900 w-full min-h-screen px-4 py-8 flex items-center justify-center text-center">
        <p>جاري التحميل...</p>
      </div>
    );

  if (error)
    return (
      <div className="bg-white text-gray-900 w-full min-h-screen px-4 py-8 flex items-center justify-center text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="bg-white text-gray-900 w-full min-h-screen px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">إتمام الدفع</h1>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-2">تفاصيل الطلب</h2>
          <p>رقم الطلب: {order._id}</p>
          <p>المنتج: {order.productName?.ar || "N/A"}</p>
          <p className="text-xl font-bold mt-2">
            المبلغ: {order.productPrice} {order.currency}
          </p>
        </div>

        <button
          onClick={handleCashOnDelivery}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium"
        >
          الدفع عند الاستلام (Cash on Delivery)
        </button>
      </div>
    </div>
  );
}
