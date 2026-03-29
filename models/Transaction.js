import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    name: {
      type: String,
      required: [true, "Transaction name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },

    type: {
      type: String,
      enum: {
        values: ["income", "expense"],
        message: "Type must be either income or expense",
      },
      required: [true, "Transaction type is required"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Food",
          "Transport",
          "Entertainment",
          "Utilities",
          "Healthcare",
          "Education",
          "Shopping",
          "Income",
          "Other",
        ],
        message: "Invalid category",
      },
    },

    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },

    // Derived from date — used for fast aggregate queries in syncMonthlyRecord
    year: {
      type: Number,
      required: [true, "Year is required"],
    },

    month: {
      type: Number,
      required: [true, "Month is required"],
      min: [1, "Month must be between 1 and 12"],
      max: [12, "Month must be between 1 and 12"],
    },

    status: {
      type: String,
      enum: ["completed", "pending", "failed"],
      default: "completed",
    },

    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "transactions",
  }
);

// Indexes for fast queries
TransactionSchema.index({ userId: 1, year: 1, month: 1 });
TransactionSchema.index({ userId: 1, type: 1 });
TransactionSchema.index({ userId: 1, date: -1 });

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);