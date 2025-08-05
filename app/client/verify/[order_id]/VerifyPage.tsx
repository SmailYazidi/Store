'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyPage({ orderId }: { orderId: string }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/client/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, code }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/client/payment/${orderId}`);
      } else {
        setError(data.message || 'فشل التحقق');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء التحقق');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white text-gray-900 w-full min-h-screen px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">تأكيد الطلب</h1>
        <p className="mb-6 text-center text-gray-600">
          لقد أرسلنا رمز التحقق إلى بريدك الإلكتروني. يرجى إدخاله أدناه:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="أدخل رمز التحقق"
            className="w-full px-4 py-2 border rounded-lg text-center text-lg"
            maxLength={6}
            required
          />

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-lg font-medium text-white ${
              isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'جاري التحقق...' : 'تأكيد الطلب'}
          </button>
        </form>
      </div>
    </div>
  );
}
