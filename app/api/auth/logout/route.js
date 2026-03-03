export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Check if user has a token
    const token = request.cookies.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No active session found" },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );

    // Clear the token cookie
    response.cookies.delete("token");

    // Alternative way to clear cookie (more explicit)
    // response.cookies.set("token", "", {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 0, // Expires immediately
    //   path: "/",
    // });

    return response;

  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}