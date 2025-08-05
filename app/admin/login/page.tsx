
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from "@/components/admin/sidebar"
import AdminHeader from "@/components/admin/header"
export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      console.log("login sucses")
      router.push('/admin');
    } else {
      const text = await res.text();
      setError(text || 'Login failed');
    }
  }

  return (   <div className="relative min-h-screen flex flex-col">

      {isSidebarOpen && (
        <div className="fixed inset-0 z-90">
          {isSidebarOpen && <AdminSidebar onClose={() => setIsSidebarOpen(false)} />}

   <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      )}


      <div className="flex-1 flex flex-col">
        <AdminHeader onMenuClick={() => setIsSidebarOpen(prev => !prev)} />



          <main className="p-4 pt-25 bg-white text-black min-h-screen">
<div className="mb-10 max-w-7xl mx-auto">
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>تسجيل دخول المسؤول</h1>
      <form onSubmit={handleSubmit}>
        <label>
          كلمة المرور:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">تسجيل دخول</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div></div>
    </main>
      </div>
    </div>
  );
}

