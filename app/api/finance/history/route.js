
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { DBConnect } from "@/lib/db";
import MonthlyRecord from "@/models/MonthlyRecord";

export async function GET(request) {
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

    const records = await MonthlyRecord.find({ userId: decoded.userId }).sort({
      year: 1,
      month: 1,
    });

    return NextResponse.json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    console.error("Get history error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}