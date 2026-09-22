import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TestDrive from "@/models/TestDrive";
import Car from "@/models/Car";
import jwt from "jsonwebtoken";

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
    const sellerId = decoded.userId || decoded.id;

    // Get all cars owned by this seller
    const sellerCars = await Car.find({ seller: sellerId });
    const carIds = sellerCars.map(car => car._id);

    if (carIds.length === 0) {
      return NextResponse.json({
        success: true,
        requests: [],
        pending: [],
        approved: [],
        rejected: [],
        completed: [],
        total: 0,
        pendingCount: 0
      });
    }

    const requests = await TestDrive.find({ car: { $in: carIds } })
      .sort({ createdAt: -1 })
      .populate("car", "brand model year price images location")
      .populate("buyer", "name email phone");

    const pending = requests.filter(r => r.status === "pending");
    const approved = requests.filter(r => r.status === "approved");
    const rejected = requests.filter(r => r.status === "rejected");
    const completed = requests.filter(r => r.status === "completed");

    return NextResponse.json({
      success: true,
      requests,
      pending,
      approved,
      rejected,
      completed,
      total: requests.length,
      pendingCount: pending.length
    });

  } catch (error) {
    console.error("Seller GET error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Seller approves/rejects test drive request
export async function PATCH(req) {
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
    const sellerId = decoded.userId || decoded.id;

    const body = await req.json();
    const { requestId, status, sellerNotes } = body;

    if (!requestId || !status) {
      return NextResponse.json(
        { success: false, message: "Request ID and status required" },
        { status: 400 }
      );
    }

    if (!["approved", "rejected", "completed"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const request = await TestDrive.findById(requestId)
      .populate("car")
      .populate("buyer", "name email");

    if (!request) {
      return NextResponse.json(
        { success: false, message: "Request not found" },
        { status: 404 }
      );
    }

    // Verify seller owns this car
    if (request.car.seller?.toString() !== sellerId) {
      return NextResponse.json(
        { success: false, message: "You can only manage requests for your own cars" },
        { status: 403 }
      );
    }

    // Update status
    request.status = status;
    if (sellerNotes) {
      request.sellerNotes = sellerNotes;
    }
    await request.save();

    // Notification message for buyer
    let notificationMessage = "";
    if (status === "approved") {
      notificationMessage = `✅ Your test drive request for ${request.car.brand} ${request.car.model} on ${new Date(request.date).toLocaleDateString()} at ${request.timeSlot} has been APPROVED by seller!`;
    } else if (status === "rejected") {
      notificationMessage = `❌ Your test drive request for ${request.car.brand} ${request.car.model} has been REJECTED by seller. ${sellerNotes || "Please try another car or time slot."}`;
    } else if (status === "completed") {
      notificationMessage = `🎉 Test drive for ${request.car.brand} ${request.car.model} has been marked as COMPLETED. Thank you for choosing Car Trade Hub!`;
    }

    console.log("📧 Notification for buyer:", request.buyer.email);
    console.log("📝 Message:", notificationMessage);

    return NextResponse.json({
      success: true,
      message: `Test drive request ${status}`,
      request: request,
      notification: notificationMessage
    });

  } catch (error) {
    console.error("Seller PATCH error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}