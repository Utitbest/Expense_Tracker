export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { DBConnect } from "@/lib/db";
import Expense from "@/models/Expense";

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token){
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await DBConnect();

    const { title, amount, category, date, description, paymentMethod } = await request.json();

    if (!title || !amount || !category || !date) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const expense = await Expense.create({
      userId: decoded.userId,
      title,
      amount,
      category,
      date,
      description,
      paymentMethod: paymentMethod || "Cash",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Expense added successfully",
        expense,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add expense error:", error);
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

    const expenses = await Expense.find({ userId: decoded.userId })
      .sort({ date: -1 }) 
      .limit(100);

    return NextResponse.json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}