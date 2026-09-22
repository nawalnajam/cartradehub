import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import TestDrive from "@/models/TestDrive";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    // 🔹 JWT Verification
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // 🔹 Fetch sellerId from query params
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");

    if (!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)) {
      return NextResponse.json(
        { message: "Invalid sellerId" },
        { status: 400 }
      );
    }

    // 🔹 Fetch seller's cars & test drives
    const cars = await Car.find({ seller: new mongoose.Types.ObjectId(sellerId) });
    const testDrives = await TestDrive.find({ seller: new mongoose.Types.ObjectId(sellerId) });

    // 🔹 Analytics calculation
    const totalAds = cars.length;
    const activeAds = cars.filter((c) => c.status === "approved").length;
    const soldAds = cars.filter((c) => c.status === "sold").length;
    const totalViews = cars.reduce((sum, c) => sum + (c.views || 0), 0);
    const totalTestDrives = testDrives.length;

    return NextResponse.json({
      analytics: {
        totalAds,
        activeAds,
        soldAds,
        totalViews,
        totalTestDrives,
      },
    });
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}