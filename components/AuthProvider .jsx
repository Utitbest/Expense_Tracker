// "use client";

// import { useEffect } from 'react';
// import { usePathname, useRouter } from 'next/navigation';
// import { useAuthStore } from '@/hooks/useAuthStore';

// export function AuthProvider({ children }) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { fetchUser, isAuthenticated, user } = useAuthStore();

//   useEffect(() => {
//     // Protected routes
//     const protectedRoutes = ['/dashboard', '/dashboard/transactions', '/dashboard/categories', "/dashboard/budgets", "/dashboard/analytics", "/budgets"];
//     const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

//     // If on protected route and no user data, fetch it
//     if (isProtectedRoute && !user) {
//       fetchUser().then((result) => {
//         if (!result.success) {
//           router.push('/login');
//         }
//       });
//     }
//   }, [pathname, user, fetchUser, router]);

//   return <>{children}</>;
// }

"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';

export function AuthProvider({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { fetchUser, user } = useAuthStore();

  useEffect(() => {
    const protectedRoutes = [
      '/dashboard',
      '/dashboard/transactions',
      '/dashboard/categories',
      '/dashboard/budgets',
      '/dashboard/analytics',
    ];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !user && pathname !== "/login") {
      fetchUser().then((result) => {
        if (!result.success) {
          router.push('/login');
        }
      });
    }
  }, [pathname, user, router]);

  return <>{children}</>;
}




// This component is not in use right now 