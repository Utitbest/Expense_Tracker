export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { DBConnect } from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import MonthlyRecord from "@/models/MonthlyRecord";
import Category from "@/models/Category";

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

    const [user, transactions, monthlyRecords, categories] = await Promise.all([
      User.findById(decoded.userId).select("-password"),
      Transaction.find({ userId: decoded.userId }).sort({ date: -1 }),
      MonthlyRecord.find({ userId: decoded.userId }).sort({ year: 1, month: 1 }),
      Category.find({ userId: decoded.userId }),
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      profile: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      summary: {
        totalTransactions: transactions.length,
        totalMonthlyRecords: monthlyRecords.length,
        totalCategories: categories.length,
      },
      transactions,
      monthlyRecords,
      categories,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="budgetpilot-data-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("Download data error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}