export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { DBConnect } from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import MonthlyRecord from "@/models/MonthlyRecord";
import Category from "@/models/Category";

export async function DELETE(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await DBConnect();

    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    await Promise.all([
      Transaction.deleteMany({ userId: decoded.userId }),
      MonthlyRecord.deleteMany({ userId: decoded.userId }),
      Category.deleteMany({ userId: decoded.userId }),
      User.findByIdAndDelete(decoded.userId),
    ]);

    const response = NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
    response.cookies.delete("token");

    return response;
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}