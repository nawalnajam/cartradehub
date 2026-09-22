import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PaymentMethod from "@/models/PaymentMethod";
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

// ✅ DELETE - Remove a payment method
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    const paymentMethod = await PaymentMethod.findOne({ _id: id, user: userId });
    if (!paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Payment method not found" },
        { status: 404 }
      );
    }

    const wasDefault = paymentMethod.isDefault;

    await PaymentMethod.findByIdAndDelete(id);

    // If deleted was default, make another one default
    if (wasDefault) {
      const nextDefault = await PaymentMethod.findOne({ user: userId }).sort({
        createdAt: 1,
      });
      if (nextDefault) {
        nextDefault.isDefault = true;
        await nextDefault.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment method deleted",
    });
  } catch (error) {
    console.error("❌ DELETE Payment Method Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ PATCH - Set as default
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    const paymentMethod = await PaymentMethod.findOne({ _id: id, user: userId });
    if (!paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Payment method not found" },
        { status: 404 }
      );
    }

    // Unset all defaults for this user
    await PaymentMethod.updateMany(
      { user: userId },
      { $set: { isDefault: false } }
    );

    // Set this one as default
    paymentMethod.isDefault = true;
    await paymentMethod.save();

    return NextResponse.json({
      success: true,
      message: "Default payment method updated",
      paymentMethod,
    });
  } catch (error) {
    console.error("❌ PATCH Payment Method Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}