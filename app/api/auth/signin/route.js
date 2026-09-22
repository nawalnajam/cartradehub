import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || "admin@cartradehub.pk";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "CarTradeHub@2026!";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "All fields required" }, { status: 400 });
    }

   
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { userId: "admin", role: "admin", email: ADMIN_EMAIL },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      return NextResponse.json({
        success: true,
        token,
        user: { id: "admin", name: "Admin", email: ADMIN_EMAIL, role: "admin" },
      });
    }

    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, role: "user", email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: "user" },
    });

  } catch (err) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}