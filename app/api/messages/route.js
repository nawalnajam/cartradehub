// /app/api/messages/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Car from "@/models/Car";
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

// ✅ POST - Send message
export async function POST(req) {
  try {
    await connectDB();

    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { carId, sellerId, message, subject } = body;

    if (!carId || !sellerId || !message || !message.trim()) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const car = await Car.findById(carId);
    if (!car) {
      return NextResponse.json(
        { success: false, message: "Car not found" },
        { status: 404 }
      );
    }

    const seller = await User.findById(sellerId);
    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller not found" },
        { status: 404 }
      );
    }

    const buyer = await User.findById(userId);

    const newMessage = await Message.create({
      car: carId,
      buyer: userId,
      seller: sellerId,
      subject: subject || `Inquiry about ${car.brand} ${car.model}`,
      message: message.trim(),
      status: "unread",
      buyerName: buyer?.name || "User",
      buyerEmail: buyer?.email || "",
      carDetails: `${car.brand} ${car.model} (${car.year})`,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
      data: newMessage,
    });

  } catch (error) {
    console.error("❌ Message POST Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}

// ✅ GET - Get messages - FIXED with proper method
export async function GET(req) {
  try {
    await connectDB();

    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Unauthorized", 
          messages: [], 
          unreadCount: 0 
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "all";
    const limit = parseInt(searchParams.get("limit")) || 50;
    const page = parseInt(searchParams.get("page")) || 1;
    const skip = (page - 1) * limit;

    let query = {};

    if (type === "received") {
      query.$or = [
        { seller: userId },
        { buyerEmail: { $exists: true, $ne: "" } }
      ];
    } else if (type === "sent") {
      query.$or = [
        { buyer: userId },
        { buyerEmail: { $exists: true, $ne: "" } }
      ];
    } else {
      query.$or = [
        { seller: userId },
        { buyer: userId },
        { buyerEmail: { $exists: true, $ne: "" } }
      ];
    }

    const messages = await Message.find(query)
      .populate({
        path: "car",
        select: "brand model year price images location",
      })
      .populate("buyer", "name email phone")
      .populate("seller", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments(query);
    const unreadCount = await Message.countDocuments({
      seller: userId,
      status: "unread"
    });

    return NextResponse.json({
      success: true,
      messages: messages || [],
      unreadCount: unreadCount || 0,
      pagination: {
        total: total || 0,
        page,
        limit,
        totalPages: Math.ceil((total || 0) / limit),
      },
    });

  } catch (error) {
    console.error("❌ Get Messages Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to fetch messages",
        messages: [],
        unreadCount: 0 
      },
      { status: 500 }
    );
  }
}

// ✅ PATCH - Mark as read
export async function PATCH(req) {
  try {
    await connectDB();

    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { messageId, status } = body;

    if (!messageId) {
      return NextResponse.json(
        { success: false, message: "Message ID required" },
        { status: 400 }
      );
    }

    const message = await Message.findOne({
      _id: messageId,
      seller: userId,
    });

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message not found or unauthorized" },
        { status: 404 }
      );
    }

    message.status = status || "read";
    await message.save();

    const unreadCount = await Message.countDocuments({
      seller: userId,
      status: "unread"
    });

    return NextResponse.json({
      success: true,
      message: "Message updated",
      data: message,
      unreadCount,
    });

  } catch (error) {
    console.error("❌ Update Message Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE - Delete message
export async function DELETE(req) {
  try {
    await connectDB();

    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("id");

    if (!messageId) {
      return NextResponse.json(
        { success: false, message: "Message ID required" },
        { status: 400 }
      );
    }

    const message = await Message.findOne({
      _id: messageId,
      $or: [{ seller: userId }, { buyer: userId }],
    });

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message not found or unauthorized" },
        { status: 404 }
      );
    }

    await Message.findByIdAndDelete(messageId);

    return NextResponse.json({
      success: true,
      message: "Message deleted",
    });

  } catch (error) {
    console.error("❌ Delete Message Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}