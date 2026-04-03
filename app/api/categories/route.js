// app/api/categories/route.js
// GET  /api/categories → fetch all categories with spent + transaction count
// POST /api/categories → create or update a category budget

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { DBConnect } from "@/lib/db";
import Category from "@/models/Category";
import Transaction from "@/models/Transaction";
import { CATEGORIES } from "@/lib/utils";



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

    const userObjectId = new mongoose.Types.ObjectId(decoded.userId);

    const savedCategories = await Category.find({ userId: decoded.userId });

    const spentData = await Transaction.aggregate([
      { $match: { userId: userObjectId, type: "expense" } },
      {
        $group: {
          _id: "$category",
          spent: { $sum: "$amount" },
          transactions: { $sum: 1 },
        },
      },
    ]);

    const spentMap = {};
    spentData.forEach((item) => {
      spentMap[item._id] = {
        spent: +item.spent.toFixed(2),
        transactions: item.transactions,
      };
    });

    const categories = CATEGORIES.map((name) => {
      const saved = savedCategories.find((c) => c.name === name);
      const spent = spentMap[name] || { spent: 0, transactions: 0 };      
      return {
        id: saved?._id || null,
        name,
        budget: saved?.budget || 0,
        spent: spent.spent,
        period: saved?.period,
        transactions: spent.transactions,
      };
    });

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
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

    const { name, budget, period } = await request.json();

    if (!name || budget == null, !period) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (budget < 0) {
      return NextResponse.json(
        { success: false, message: "Budget cannot be negative" },
        { status: 400 }
      );
    }

    const category = await Category.findOneAndUpdate(
      { userId: decoded.userId, name },
      { budget, period},
      { upsert: true, returnDocument: "after", runValidators: true }
    );

    return NextResponse.json(
      { success: true, message: "Category budget saved successfully", category },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save category error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}