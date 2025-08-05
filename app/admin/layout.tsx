
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Allow login page without checks
      if (pathname === "/admin/login") {
        setAuthenticated(true);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/admin/account", {
          method: "GET",
          credentials: "include", // Important: sends cookies
        });

        if (res.ok) {
          setAuthenticated(true);
        } else {
          router.replace("/admin/login");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
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

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}

