export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { DBConnect } from "@/lib/db";
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

    const userObjectId = new mongoose.Types.ObjectId(decoded.userId);

    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get("months")) || 6;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const records = await MonthlyRecord.find({
      userId: decoded.userId,
    }).sort({ year: 1, month: 1 });

    const savedCategories = await Category.find({ userId: decoded.userId });
    const totalBudget = savedCategories.reduce((sum, c) => sum + c.budget, 0);

    const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const spendingTrend = records.slice(-months).map((r) => ({
      month: MONTH_NAMES[r.month - 1],
      amount: r.expenses,
      income: r.income,
      budget: totalBudget,
    }));

    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const thisMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const thisMonthEnd = new Date(currentYear, currentMonth, 1);

    const lastMonthStart = new Date(lastMonthYear, lastMonth - 1, 1);
    const lastMonthEnd = new Date(lastMonthYear, lastMonth, 1);

    const thisMonthData = await Transaction.aggregate([
      {
        $match: {
          userId: userObjectId,
          type: "expense",
          date: { $gte: thisMonthStart, $lt: thisMonthEnd },
        },
      },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    const lastMonthData = await Transaction.aggregate([
      {
        $match: {
          userId: userObjectId,
          type: "expense",
          date: { $gte: lastMonthStart, $lt: lastMonthEnd },
        },
      },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    const thisMonthMap = {};
    thisMonthData.forEach((d) => { thisMonthMap[d._id] = +d.total.toFixed(2); });

    const lastMonthMap = {};
    lastMonthData.forEach((d) => { lastMonthMap[d._id] = +d.total.toFixed(2); });

    const allCategories = [
      ...new Set([
        ...Object.keys(thisMonthMap),
        ...Object.keys(lastMonthMap),
      ]),
    ];

    const categoryComparison = allCategories.map((name) => ({
      name,
      thisMonth: thisMonthMap[name] || 0,
      lastMonth: lastMonthMap[name] || 0,
    }));

    const insights = [];

    allCategories.forEach((name) => {
      const thisAmt = thisMonthMap[name] || 0;
      const lastAmt = lastMonthMap[name] || 0;
      const diff = +(thisAmt - lastAmt).toFixed(2);

      if (diff === 0 || (!thisAmt && !lastAmt)) return;

      if (diff > 0) {
        insights.push({
          title: `Higher spending on ${name}`,
          description: `You spent $${diff.toLocaleString()} more on ${name} compared to last month`,
          trend: "up",
        });
      } else {
        insights.push({
          title: `${name} costs decreased`,
          description: `Great job! You saved $${Math.abs(diff)} on ${name} this month`,
          trend: "down",
        });
      }
    });

    const currentRecord = await MonthlyRecord.findOne({
      userId: decoded.userId,
      year: currentYear,
      month: currentMonth,
    });

    const totalSpent = currentRecord?.expenses || 0;

    const today = now.getDate();
    const avgDaily = today > 0 ? +(totalSpent / today).toFixed(2) : 0;

    const categoriesUsed = thisMonthData.length;

    const largestCategory = thisMonthData.sort((a, b) => b.total - a.total)[0];

    const totalBudgetAmount = savedCategories.reduce((sum, c) => sum + c.budget, 0);

    const stats = {
      totalSpent,
      totalBudget: totalBudgetAmount,
      totalIncome: currentRecord?.income || 0,
      currentBalance: currentRecord?.closingBalance || 0,
      avgDaily,
      categoriesUsed,
      largestExpense: {
        amount: largestCategory ? +largestCategory.total.toFixed(2) : 0,
        category: largestCategory?._id || "N/A",
      },
    };

    return NextResponse.json({
      success: true,
      data: {
        spendingTrend,
        categoryComparison,
        insights,
        stats,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}