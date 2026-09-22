import connectDB from "@/lib/db";
import Car from "@/models/Car";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // Next.js 15+ mein params async hai
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Car ID required" },
        { status: 400 }
      );
    }
    
    const car = await Car.findById(id).populate("seller", "name email");
    
    if (!car) {
      return NextResponse.json(
        { success: false, message: "Car not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, car });
    
  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}