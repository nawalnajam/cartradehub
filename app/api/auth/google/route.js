// /app/api/auth/google/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { credential, userInfo } = await req.json();
    
    if (!credential || !userInfo) {
      return NextResponse.json(
        { success: false, message: "Missing credentials" },
        { status: 400 }
      );
    }

    await connectDB();

    const { email, name, picture, sub: googleId } = userInfo;

    // ✅ Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // ✅ Create new user
      user = await User.create({
        name: name || email.split('@')[0],
        email: email,
        password: googleId, // Store Google ID as password (not used for login)
        role: "buyer",
        avatar: picture || "",
        googleId: googleId,
        isGoogleUser: true,
      });
    } else {
      // ✅ Update existing user with Google info
      user.googleId = googleId;
      user.isGoogleUser = true;
      user.avatar = picture || user.avatar;
      await user.save();
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}