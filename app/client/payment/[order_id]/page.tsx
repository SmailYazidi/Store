'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from '@/components/Loading';
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

const handlepay = async () => {
  if (!order) return;

  const response = await fetch("/api/client/stripe/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderId: order._id }),
  });

  const data = await response.json();

  if (data.url) {
    window.location.href = data.url; // توجه المستخدم إلى Stripe Checkout
  } else {
    alert("حدث خطأ أثناء إنشاء جلسة الدفع");
  }
};



  if (isLoading)
    return (
  <Loading/>
    );

  if (error)
    return (
      <div className="bg-white text-gray-900 w-full min-h-screen px-4 py-8 flex items-center justify-center text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
 <div className="bg-white text-gray-900 min-h-screen w-full flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-xl">
    <h1 className="text-2xl font-bold mb-6">Complete Payment</h1>
<br />
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-300">
      <h2 className="font-semibold mb-2">Order Details</h2>
          <img
           src={`${process.env.NEXT_PUBLIC_BLOB_BASE_URL}${order.productImage}`}
        alt={order.productName.fr || order.productName.fr || "Product"}
        className="w-24 h-24 object-cover rounded"
      />
      <p>Order ID: {order._id}</p>
      <p>Product: {order.productName?.fr || "N/A"}</p>
      <p className="text-xl font-bold mt-2">
        Amount: {order.productPrice} {order.currency}
      </p>
    </div>

    <button
      onClick={handlepay}
      className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded font-medium transition-colors"
    >
      Pay Now
    </button>
  </div>
</div>


  );
}
