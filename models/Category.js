// models/Category.js

import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    name: {
      type: String,
      required: [true, "Category name is required"],
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
        message: "Invalid category name",
      },
    },

    // Budget the user sets for this category
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: [0, "Budget cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "categories",
  }
);

// One budget per user per category — no duplicates
CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

delete mongoose.models.Category;
export default mongoose.model("Category", CategorySchema);