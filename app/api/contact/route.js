// /app/api/contact/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Message from "@/models/Message";
import jwt from "jsonwebtoken";

function getUserId(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Name, email and message are required" },
        { status: 400 }
      );
    }

    // ✅ Get user if logged in
    const userId = getUserId(req);
    let user = null;
    let buyerId = null;
    let sellerId = null;

    // ✅ Find admin
    const admin = await User.findOne({ role: "admin" });

    if (userId) {
      user = await User.findById(userId);
      buyerId = user._id;
      sellerId = admin?._id || null;
    }

    // ✅ Create message - car is NOT required
    const newMessage = await Message.create({
      car: null, // ✅ Explicitly set null
      buyer: buyerId,
      seller: sellerId,
      subject: subject || `Contact Form: ${name}`,
      message: message,
      status: "unread",
      buyerName: name,
      buyerEmail: email,
      carDetails: `Contact Form Message from ${name} ${phone ? `(Phone: ${phone})` : ''}`,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
      data: newMessage,
    });

  } catch (error) {
    console.error("❌ Contact API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}