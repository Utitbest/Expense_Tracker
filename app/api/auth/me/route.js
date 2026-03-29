export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { DBConnect } from "@/lib/db";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
      console.log("No token provided");
      return NextResponse.json(
        { success: false, message: "Not authenticated" }, 
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.log("Invalid token:", error.message);
      return NextResponse.json(
        { success: false, message: "Invalid token" }, 
        { status: 401 }
      );
    }

    try {
      await DBConnect();
      console.log("Database connected");
    } catch (dbError) {
      console.error("Database connection failed:", dbError.message);
      return NextResponse.json(
        { success: false, message: "Database unavailable" }, 
        { status: 503 } 
      );
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log("User not found in database");
      return NextResponse.json(
        { success: false, message: "User not found" }, 
        { status: 401 }
      );
    }


    return NextResponse.json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        image: user.image,
        emailVerified: user.emailVerified,
      }
    });

  } catch (err) {
    console.error("Unexpected error in /api/auth/me:", err);
    
    return NextResponse.json(
      { success: false, message: "Internal server error" }, 
      { status: 500 }
    );
  }
}