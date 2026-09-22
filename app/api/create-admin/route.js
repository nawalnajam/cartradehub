import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// POST method - Normal way
export async function POST() {
  try {
    await connectDB();
    
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: "admin@cartradehub.pk" },
        { role: "admin" }
      ]
    });
    
    if (existingAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin already exists!",
        admin: {
          email: existingAdmin.email,
          role: existingAdmin.role
        }
      });
    }
    
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const admin = await User.create({
      name: "System Administrator",
      email: "admin@cartradehub.pk",
      password: hashedPassword,
      role: "admin",
      phone: "03001234567"
    });
    
    return NextResponse.json({
      success: true,
      message: "Admin created successfully!",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
    
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}

// ✅ GET method bhi add kar do (browser se direct access ke liye)
export async function GET() {
  try {
    await connectDB();
    
    const existingAdmin = await User.findOne({ role: "admin" });
    
    if (existingAdmin) {
      return NextResponse.json({ 
        success: true, 
        message: "Admin already exists!",
        admin: {
          id: existingAdmin._id,
          name: existingAdmin.name,
          email: existingAdmin.email,
          role: existingAdmin.role
        }
      });
    }
    
    const hashedPassword = await bcrypt.hash("CarTradeHub@2026!", 10);
    
    const admin = await User.create({
      name: "System Administrator",
      email: "admin@cartradehub.pk",
      password: hashedPassword,
      role: "admin",
      phone: "03001234567"
    });
    
    return NextResponse.json({
      success: true,
      message: "Admin created successfully!",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
    
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}