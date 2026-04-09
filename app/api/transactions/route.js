
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { DBConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import MonthlyRecord from "@/models/MonthlyRecord";

async function syncMonthlyRecord(userId, year, month, amount, type) {
  const currentRecord = await MonthlyRecord.findOne({ userId, year, month });

  let income = currentRecord?.income || 0;
  let expenses = currentRecord?.expenses || 0;
  const openingBalance = currentRecord?.openingBalance || 0;

  if (type === "income") {
    income = +(income + amount).toFixed(2);
  } else if (type === "expense") {
    expenses = +(expenses + amount).toFixed(2);
  }

  const closingBalance = +(openingBalance + income - expenses).toFixed(2);

  await MonthlyRecord.findOneAndUpdate(
    { userId, year, month },
    { openingBalance, income, expenses, closingBalance },
    { upsert: true, returnDocument: "after", runValidators: true }
  );
}
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

    const { name, amount, type, category, date, status, description } = await request.json();
    if (!name || amount == null || !type || !category || !date) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    const transactionDate = new Date(date);
    const year = transactionDate.getFullYear();
    const month = transactionDate.getMonth() + 1;
    const transaction = await Transaction.create({
      userId: decoded.userId,
      name,
      amount: +Math.abs(amount).toFixed(2),
      type,
      category,
      date: transactionDate,
      year,
      month,
      status: status || "completed",
      description: description || "",
    });

    await syncMonthlyRecord(decoded.userId, year, month, transaction.amount, transaction.type);
    return NextResponse.json(
      {
        success: true,
        message: "Transaction added successfully",
        transaction,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add transaction error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const months = searchParams.get("months");


    const filter = { userId: decoded.userId };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (months) {
      const now = new Date();
      const numMonths = parseInt(months, 10);

      const orFilter = [];
      for (let i = 0; i < numMonths; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        orFilter.push({ month: d.getMonth() + 1, year: d.getFullYear() });
      }
      filter.$or = orFilter;
    }

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .limit(100);

    return NextResponse.json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}