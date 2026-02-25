
import { NextResponse } from "next/server";

export default async function proxy(request) {
  const url = new URL(request.url);

  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map(c => {
      const [key, ...value] = c.trim().split("=");
      return [key, value.join("=")];
    })
  );

  const token = cookies["token"];

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/dashboard/:path*"], 
};
