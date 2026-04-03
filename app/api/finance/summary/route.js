
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

    const { searchParams } = new URL(request.url);
    const now = new Date();
    const year = parseInt(searchParams.get("year")) || now.getFullYear();
    const month = parseInt(searchParams.get("month")) || now.getMonth() + 1;

    const record = await MonthlyRecord.findOne({
      userId: decoded.userId,
      year,
      month,
    });

    if (!record) {
      return NextResponse.json({
        success: true,
        data: {
          period: { year, month },
          currentBalance: 0,
          balanceChange: {
            amount: 0,
            percent: null,
            direction: "up",
            label: "No transactions yet",
          },
          totalIncome: 0,
          totalExpenses: 0,
          openingBalance: 0,
        },
      });
    }

    const previousRecord = await MonthlyRecord.findOne({
      userId: decoded.userId,
      $or: [{ year: { $lt: year } }, { year, month: { $lt: month } }],
    }).sort({ year: -1, month: -1 });

    const previousBalance = previousRecord ? previousRecord.closingBalance : 0;
    const changeAmount = +(record.closingBalance - previousBalance).toFixed(2);
    const changePercent =
      previousBalance > 0
        ? parseFloat(
            (((record.closingBalance - previousBalance) / previousBalance) * 100).toFixed(1)
          )
        : null;

    return NextResponse.json({
      success: true,
      data: {
        period: { year, month },
        currentBalance: record.closingBalance,
        balanceChange: {
          amount: changeAmount,
          percent: changePercent,
          direction: changeAmount >= 0 ? "up" : "down",
          label:
            changePercent !== null
              ? `${changePercent > 0 ? "+" : ""}${changePercent}% from last month`
              : "First record",
        },
        totalIncome: record.income,
        totalExpenses: record.expenses,
        openingBalance: record.openingBalance,
      },
    });
  } catch (error) {
    console.error("Get summary error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}