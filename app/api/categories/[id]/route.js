// app/api/categories/[id]/route.js
// PUT    /api/categories/:id → update category budget
// DELETE /api/categories/:id → reset category budget to 0

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { DBConnect } from "@/lib/db";
import Category from "@/models/Category";

export async function PUT(request, { params }) {
  const { id } = await params;
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

    const { budget } = await request.json();

    if (budget == null || budget < 0) {
      return NextResponse.json(
        { success: false, message: "Valid budget is required" },
        { status: 400 }
      );
    }

    const category = await Category.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      { budget },
      { returnDocument: "after", runValidators: true }
    );

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Budget updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
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

    const deleted = await Category.findOneAndDelete({
      _id: id,
      userId: decoded.userId,
    });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category budget reset successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}