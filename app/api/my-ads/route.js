import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");

    // 🔹 Validate sellerId
    if (!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)) {
      return NextResponse.json({ cars: [] });
    }

    const cars = await Car.find({
      seller: new mongoose.Types.ObjectId(sellerId),
    }).sort({ createdAt: -1 });

    // Add testDriveCount for each car if you want to show on dashboard
    const carsWithTestDrive = cars.map((car) => ({
      ...car.toObject(),
      testDriveCount: car.testDriveCount || 0,
    }));

    return NextResponse.json({ cars: carsWithTestDrive });
  } catch (error) {
    console.error("MY ADS ERROR:", error);
    return NextResponse.json({ cars: [] });
  }
}