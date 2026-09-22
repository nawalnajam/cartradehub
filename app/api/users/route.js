import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find().select("-password"); 
    // password hide kiya for security

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
