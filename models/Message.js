// /models/Message.js

import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: false, // ✅ Changed from true to false (for contact messages)
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // ✅ Changed from true to false (for contact messages)
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // ✅ Changed from true to false (for contact messages)
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
    },
    buyerName: {
      type: String,
      default: "",
    },
    buyerEmail: {
      type: String,
      default: "",
    },
    carDetails: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);