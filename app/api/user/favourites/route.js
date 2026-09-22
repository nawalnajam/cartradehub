// /app/api/user/favourites/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Car from "@/models/Car";
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

// GET - Get user's favourite cars
export async function GET(req) {
  try {
    await connectDB();
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId).populate("favorites");
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, favourites: user.favorites || [] });
  } catch (error) {
    console.error("GET favourites error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Add car to favourites
export async function POST(req) {
  try {
    await connectDB();
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { carId } = await req.json();
    if (!carId) {
      return NextResponse.json({ success: false, message: "Car ID required" }, { status: 400 });
    }

    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) {
      return NextResponse.json({ success: false, message: "Car not found" }, { status: 404 });
    }

    // Add to user's favourites array (avoid duplicates)
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: carId } },
      { new: true }
    ).populate("favorites");

    return NextResponse.json({ 
      success: true, 
      message: "Added to favourites",
      favourites: user.favorites 
    });
  } catch (error) {
    console.error("POST favourite error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Remove car from favourites
export async function DELETE(req) {
  try {
    await connectDB();
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const carId = url.searchParams.get("carId");
    
    if (!carId) {
      return NextResponse.json({ success: false, message: "Car ID required" }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: carId } },
      { new: true }
    ).populate("favorites");

    return NextResponse.json({ 
      success: true, 
      message: "Removed from favourites",
      favourites: user.favorites 
    });
  } catch (error) {
    console.error("DELETE favourite error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}