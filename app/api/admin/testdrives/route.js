// /app/api/admin/testdrives/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TestDrive from "@/models/TestDrive";
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

// GET - All test drives
export async function GET(req) {
  try {
    await connectDB();
    const admin = verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // ✅ FIX: Proper populate with correct field names
    const testDrives = await TestDrive.find({})
      .populate({
        path: "car",
        select: "brand model year price images location fuelType transmission status seller"
      })
      .populate({
        path: "buyer",
        select: "name email phone"
      })
      .sort({ createdAt: -1 });

    // ✅ Transform data to ensure consistent format
    const formattedDrives = testDrives.map(drive => ({
      _id: drive._id,
      car: drive.car ? {
        _id: drive.car._id,
        brand: drive.car.brand,
        model: drive.car.model,
        year: drive.car.year,
        price: drive.car.price,
        images: drive.car.images || [],
        location: drive.car.location,
        fuelType: drive.car.fuelType,
        transmission: drive.car.transmission,
        status: drive.car.status
      } : null,
      buyer: drive.buyer ? {
        _id: drive.buyer._id,
        name: drive.buyer.name,
        email: drive.buyer.email,
        phone: drive.buyer.phone
      } : null,
      date: drive.date,
      timeSlot: drive.timeSlot,
      status: drive.status,
      notes: drive.notes,
      adminNotes: drive.adminNotes,
      sellerNotes: drive.sellerNotes,
      createdAt: drive.createdAt,
      updatedAt: drive.updatedAt
    }));

    console.log(`📋 Test drives: ${formattedDrives.length} found`);
    console.log("First drive:", formattedDrives[0]);

    return NextResponse.json({ 
      success: true, 
      drives: formattedDrives 
    });

  } catch (error) {
    console.error("❌ Error fetching test drives:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update test drive status
export async function PATCH(req) {
  try {
    await connectDB();
    const admin = verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { requestId, status, adminNotes } = await req.json();

    if (!requestId) {
      return NextResponse.json({ success: false, message: "Request ID required" }, { status: 400 });
    }

    const updatedDrive = await TestDrive.findByIdAndUpdate(
      requestId,
      { 
        status, 
        adminNotes: adminNotes || null,
        updatedAt: new Date()
      },
      { new: true }
    ).populate("car", "brand model year price images")
     .populate("buyer", "name email phone");

    if (!updatedDrive) {
      return NextResponse.json({ success: false, message: "Test drive not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      drive: updatedDrive,
      message: `Test drive ${status} successfully`
    });

  } catch (error) {
    console.error("❌ Error updating test drive:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}