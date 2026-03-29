// app/api/finance/record/route.js
// POST   /api/finance/record  → Create or update a monthly record
// DELETE /api/finance/record  → Delete a monthly record

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { DBConnect } from "@/lib/db";
import MonthlyRecord from "@/models/MonthlyRecord";

export async function POST(request) {
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

    const { year, month, income, expenses } = await request.json();

    if (!year || !month || income == null || expenses == null) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (income < 0 || expenses < 0) {
      return NextResponse.json(
        { success: false, message: "Income and expenses cannot be negative" },
        { status: 400 }
      );
    }

    const previousRecord = await MonthlyRecord.findOne({
      userId: decoded.userId,
      $or: [{ year: { $lt: year } }, { year, month: { $lt: month } }],
    }).sort({ year: -1, month: -1 });

    const openingBalance = previousRecord ? previousRecord.closingBalance : 0;

    const closingBalance = +(openingBalance + income - expenses).toFixed(2);

    const record = await MonthlyRecord.findOneAndUpdate(
      { userId: decoded.userId, year, month },
      { openingBalance, income, expenses, closingBalance },
      { upsert: true, returnDocument: "after", runValidators: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Record saved successfully",
        record,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save record error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    const { year, month } = await request.json();

    if (!year || !month) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const deleted = await MonthlyRecord.findOneAndDelete({
      userId: decoded.userId,
      year,
      month,
    });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    console.error("Delete record error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}