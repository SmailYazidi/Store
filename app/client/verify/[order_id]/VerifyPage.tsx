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
    if (!code.trim()) return; // Prevent empty submissions
    setIsLoading(true);
    setError('');

    try {
      const verifyResponse = await fetch('/api/client/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, code }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        const checkoutResponse = await fetch('/api/client/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });

        const checkoutData = await checkoutResponse.json();

        if (checkoutData.url) {
          window.location.href = checkoutData.url;
        } else {
          setError('An error occurred while creating the payment session.');
        }
      } else {
        setError(verifyData.message || 'Verification failed.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white text-gray-900 w-full min-h-screen px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 border border-gray-300">
        <h1 className="text-2xl font-bold mb-4 text-center">Confirm Order</h1>
        <p className="mb-6 text-center text-gray-600">
          We have sent a verification code to your email. Please enter it below:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter verification code"
            className="w-full px-4 py-2 border border-gray-800 rounded text-center text-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
            maxLength={6}
            required
          />

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded font-medium text-white transition-colors ${
              isLoading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            {isLoading ? 'Verifying...' : 'Confirm Order'}
          </button>
        </form>
      </div>
    </div>
  );
}
