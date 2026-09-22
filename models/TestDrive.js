// /models/TestDrive.js

import mongoose from "mongoose";
// ✅ AGGREGATION: TestDrive references Car
const TestDriveSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
     // ✅ AGGREGATION: TestDrive references Buyer
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    notes: {
      type: String,
      default: "",
    },
    adminNotes: {
      type: String,
      default: "",
    },
    sellerNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.TestDrive || mongoose.model("TestDrive", TestDriveSchema);
// If car is deleted, test drive records can still exist (for history)
// If user is deleted, test drive records can still exist (for analytics)