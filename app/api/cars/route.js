import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// POST - User post a new car ad
export async function POST(req) {
  try {
    await connectDB();

    // Get token from header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Please login to post an ad" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid session. Please login again." },
        { status: 401 }
      );
    }

    const userId = decoded.userId || decoded.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

  
    const body = await req.json();
    
    // Validate required fields
    if (!body.price || !body.location) {
      return NextResponse.json(
        { success: false, message: "Price and location are required" },
        { status: 400 }
      );
    }

    // Create new car
    const carData = {
      brand: body.brand || "",
      model: body.model || "",
      year: body.year || "",
      bodyType: body.bodyType || "",
      color: body.color || "",
      fuelType: body.fuelType || "",
      transmission: body.transmission || "",
      seats: body.seats || "",
      driveType: body.driveType || "",
      headlights: body.headlights || "",
      condition: body.condition || "",
      additionalInfo: body.additionalInfo || "",
      price: body.price,
      location: body.location,
      images: body.images || [],
      seller: user._id,
      status: "pending",  
    };

    const car = await Car.create(carData);

    return NextResponse.json({
      success: true,
      message: "Ad posted successfully! It will be reviewed by admin.",
      car: car,
    });

  } catch (error) {
    console.error("POST /api/cars error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}

// GET - Get user's own cars (for dashboard)
export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    const cars = await Car.find({ seller: userId })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, cars });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}