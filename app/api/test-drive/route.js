import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TestDrive from "@/models/TestDrive";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();
    
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: true, bookings: [] });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    const bookings = await TestDrive.find({ buyer: userId })
      .populate("car", "brand model year price images")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, bookings: bookings || [] });

  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ success: true, bookings: [] });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const buyerId = decoded.userId || decoded.id;

    const { carId, date, timeSlot, notes } = await req.json();

    const booking = await TestDrive.create({
      car: carId,
      buyer: buyerId,
      date: new Date(date),
      timeSlot: timeSlot,
      notes: notes || "",
      status: "pending"
    });

    return NextResponse.json({ success: true, booking });

  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}