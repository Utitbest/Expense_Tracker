
import mongoose from "mongoose";

const MonthlyRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [2000, "Year must be 2000 or later"],
    },

    month: {
      type: Number,
      required: [true, "Month is required"],
      min: [1, "Month must be between 1 and 12"],
      max: [12, "Month must be between 1 and 12"],
    },

    openingBalance: {
      type: Number,
      required: true,
      default: 0,
    },

    income: {
      type: Number,
      required: [true, "Income is required"],
      min: [0, "Income cannot be negative"],
      default: 0,
    },

    expenses: {
      type: Number,
      required: [true, "Expenses is required"],
      min: [0, "Expenses cannot be negative"],
      default: 0,
    },

    closingBalance: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "monthly_records",
  }
);

MonthlyRecordSchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

MonthlyRecordSchema.pre("save", function (next) {
  this.closingBalance = +(
    this.openingBalance +
    this.income -
    this.expenses
  ).toFixed(2);
  next();
});

export default mongoose.models.MonthlyRecord ||
  mongoose.model("MonthlyRecord", MonthlyRecordSchema);