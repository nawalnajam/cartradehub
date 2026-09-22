// /app/api/admin/cars/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import User from "@/models/User";
import jwt from "jsonwebtoken";

function verifyAdmin(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET - All cars (admin view)
export async function GET(req) {
  try {
    await connectDB();
    const admin = verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const cars = await Car.find({})
      .populate("seller", "name email phone")
      .sort({ createdAt: -1 });

    console.log(`🚗 Cars: ${cars.length} found`);

    return NextResponse.json({ success: true, cars });
  } catch (error) {
    console.error("❌ Error fetching cars:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Add new car (admin)
export async function POST(req) {
  try {
    await connectDB();
    const admin = verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.price || !body.location) {
      return NextResponse.json(
        { success: false, message: "Price and location are required" },
        { status: 400 }
      );
    }

    const car = await Car.create({
      ...body,
      seller: null, // Admin added car, no seller
      status: "approved",
      availabilityStatus: "available"
    });

    return NextResponse.json({ 
      success: true, 
      car,
      message: "Car added successfully"
    });

  } catch (error) {
    console.error("❌ Error adding car:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}