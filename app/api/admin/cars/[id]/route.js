import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import jwt from "jsonwebtoken";

function isAdmin(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.role === "admin";
  } catch { return false; }
}

// PATCH — status / availabilityStatus / featured update
export async function PATCH(req, context) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    await connectDB();
    const { id } = await context.params;
    const body   = await req.json();

    const updateFields = {};
    if (body.status             !== undefined) updateFields.status             = body.status;
    if (body.availabilityStatus !== undefined) updateFields.availabilityStatus = body.availabilityStatus;
    if (body.featured           !== undefined) updateFields.featured           = body.featured;

    const car = await Car.findByIdAndUpdate(id, updateFields, { new: true });
    if (!car) return NextResponse.json({ success: false, message: "Car not found" }, { status: 404 });
    return NextResponse.json({ success: true, car });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req, context) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    await connectDB();
    const { id } = await context.params;
    await Car.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}