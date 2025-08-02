"use client";

import type React from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// This is the component that handles admin authentication
function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setAuthenticated(true);
      setLoading(false);
      return;
    }

    const cookies = document.cookie.split("; ").reduce<Record<string, string>>((acc, current) => {
      const [key, value] = current.split("=");
      acc[key] = value;
      return acc;
    }, {});

    const sessionId = cookies.sessionId;

    if (!sessionId) {
      router.replace("/admin/login");
      return;
    }

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

// This is the default export that Next.js expects for layout files
export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}