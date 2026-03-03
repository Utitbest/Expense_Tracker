
// import { NextResponse } from "next/server";

// export default async function proxy(request) {
//   const url = new URL(request.url);

//   const cookieHeader = request.headers.get("cookie") || "";
//   const cookies = Object.fromEntries(
//     cookieHeader.split(";").map(c => {
//       const [key, ...value] = c.trim().split("=");
//       return [key, value.join("=")];
//     })
//   );

//   const token = cookies["token"];

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return NextResponse.next();
// }
// export const config = {
//   matcher: ["/dashboard/:path*"], 
// };
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  const token = request.cookies.get("token")?.value;

  // Protected routes that require authentication
  const isProtectedRoute = pathname.startsWith("/dashboard");
  
  // Auth routes (login, signup)
  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  // ✅ Allow access to dashboard if token exists
  if (isProtectedRoute) {
    if (!token) {
      // No token - redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Optional: Verify token is valid
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      // Token is valid - allow access
      return NextResponse.next();
    } catch (error) {
      // Invalid token - clear it and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // ✅ Redirect authenticated users away from login/signup
  if (isAuthRoute && token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      // Valid token - redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
      // Invalid token - clear it and stay on auth page
      const response = NextResponse.next();
      response.cookies.delete("token");
      return response;
    }
  }

  // Allow request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
  ],
};