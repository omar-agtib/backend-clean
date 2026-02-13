"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authStore } from "@/store/auth-store";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = authStore();

  useEffect(() => {
    if (!isHydrated) return; // wait for hydration

    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
