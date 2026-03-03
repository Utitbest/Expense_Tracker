// import React, {useEffect} from "react";
// import { Sidebar } from "@/components/dashboard/Sidebar";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useAuthStore } from "@/hooks/useAuthStore";
// import { toast } from "sonner";
// import { Header } from "@/components/dashboard/Header";
// export default function DashboardLayout({ children }) {
//   return (
//     <div className="flex h-screen bg-background">
//         <Sidebar />
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <Header />
//           <main className="flex-1 overflow-auto">{children}</main>
//         </div>
//     </div>
//   );
// }
// "use client";
// import React, { useEffect } from "react";
// import { useRouter, useSearchParams, usePathname } from "next/navigation";
// import { useAuthStore } from "@/hooks/useAuthStore";
// import { toast } from "sonner";
// import { Sidebar } from "@/components/dashboard/Sidebar";
// import { Header } from "@/components/dashboard/Header";

// export default function DashboardLayout({ children }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const { user, isAuthenticated, isLoading, fetchUser } = useAuthStore();

//   useEffect(() => {
//     const welcome = searchParams.get("welcome");
//     const authSuccess = searchParams.get("auth");

//     // Show welcome message for new Google users
//     if (welcome === "true") {
//       toast.success("🎉 Welcome! Your account has been created successfully!");
      
//       // Clean URL
//       const newUrl = window.location.pathname;
//       window.history.replaceState({}, '', newUrl);
//     }

//     // Show success message for returning Google users
//     if (authSuccess === "success" && welcome !== "true") {
//       toast.success("👋 Welcome back!");
      
//       // Clean URL
//       const newUrl = window.location.pathname;
//       window.history.replaceState({}, '', newUrl);
//     }

//     // Fetch user if not already authenticated
//     if (!isAuthenticated && !isLoading && pathname !== "/login") {
//       fetchUser().then((result) => {
//         if (!result.success) {
//           console.log(result.data)
//           toast.error("Please sign in to continue");
//           router.push("/login");
//         }
//       });
//     }

//   }, [searchParams, isAuthenticated, isLoading, fetchUser, router]);

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-background">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-muted-foreground">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   // Not authenticated
//   if (!user) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-background">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-muted-foreground">Redirecting to login...</p>
//         </div>
//       </div>
//     );
//   }

//   // Authenticated - show dashboard
//   return (
//       <div className="flex h-screen bg-background">
//         <Sidebar />
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <Header />
//           <main className="flex-1 overflow-auto">{children}</main>
//         </div>
//       </div>
//   );
// }


"use client";

import React, { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { toast } from "sonner";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading, fetchUser, setUser } = useAuthStore();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const welcome = searchParams.get("welcome");
    const authSuccess = searchParams.get("auth");
    const userDataParam = searchParams.get("user");

    // Handle Google OAuth user data
    if (userDataParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataParam));
        setUser(userData);

        if (welcome === "true") {
          toast.success("🎉 Welcome! Your account has been created successfully!");
        } else if (authSuccess === "success") {
          toast.success("👋 Welcome back!");
        }

        window.history.replaceState({}, '', window.location.pathname);
        return;
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }

    // Show welcome toast
    if (welcome === "true") {
      toast.success("🎉 Account created successfully!");
      window.history.replaceState({}, '', window.location.pathname);
    }

    // ✅ Fetch user ONCE if not authenticated
    if (!user && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      
      fetchUser().then((result) => {
        if (!result.success) {
          router.push('/login');
        }
      });
    }
  }, [searchParams, user, fetchUser, setUser, router]);

  // Loading state
  if (isLoading || (!user && !hasFetchedRef.current)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirecting
  if (!user) {
    return null;
  }

  // Authenticated - show dashboard
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}