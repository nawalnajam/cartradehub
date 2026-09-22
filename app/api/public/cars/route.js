// /app/api/public/cars/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit")) || 20;
    const search = searchParams.get("search");

    let query = { status: "approved" }; // ✅ Only show approved cars
    
    if (type === "featured") {
      query.featured = true;
    }
    
    if (search) {
      query.$or = [
        { brand: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }

    const cars = await Car.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("brand model year price location images fuelType transmission condition featured views bodyType color status");

    return NextResponse.json({ success: true, cars });
  } catch (err) {
    console.error("Error fetching cars:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}