"use client";

import type React from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // حسب استخدامك للـ Loader

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // إذا في صفحة تسجيل الدخول، لا نتحقق، نعرض المحتوى مباشرة
    if (pathname === "/admin/login") {
      setAuthenticated(true);
      setLoading(false);
      return;
    }

    // تحقق من وجود الكوكي 'sessionId' على الجانب العميل
    const cookies = document.cookie.split("; ").reduce<Record<string, string>>((acc, current) => {
      const [key, value] = current.split("=");
      acc[key] = value;
      return acc;
    }, {});

    const sessionId = cookies.sessionId;

    if (!sessionId) {
      // إذا ما في جلسة، ارسل المستخدم لصفحة تسجيل الدخول
      router.replace("/admin/login");
      return;
    }

    // إذا أردت، يمكنك هنا إرسال طلب صغير لـ API للتحقق من صلاحية الجلسة
    // لكن للبساطة هنا فقط نعتبر وجود الكوكي كدليل على تسجيل الدخول
    setAuthenticated(true);
    setLoading(false);
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (authenticated) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  return null;
}
