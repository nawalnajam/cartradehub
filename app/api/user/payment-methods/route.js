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

// ✅ GET all payment methods for logged-in user
export async function GET(req) {
  try {
    await connectDB();
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const paymentMethods = await PaymentMethod.find({ user: userId }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      paymentMethods,
    });
  } catch (error) {
    console.error("❌ GET Payment Methods Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ POST - Add new payment method
export async function POST(req) {
  try {
    await connectDB();
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { type, accountNo, nameOnAccount, last4, brand, expMonth, expYear, isDefault } = body;

    if (!type || !["card", "jazzcash", "easypaisa", "bank"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Valid payment type required" },
        { status: 400 }
      );
    }

    // Validate based on type
    if (type === "card") {
      if (!last4 || !brand || !expMonth || !expYear) {
        return NextResponse.json(
          { success: false, message: "Card details incomplete" },
          { status: 400 }
        );
      }
    } else {
      if (!accountNo || !nameOnAccount) {
        return NextResponse.json(
          { success: false, message: "Account number and name required" },
          { status: 400 }
        );
      }
    }

    // If this is the first payment method, make it default
    const count = await PaymentMethod.countDocuments({ user: userId });
    const shouldBeDefault = isDefault || count === 0;

    const paymentMethod = await PaymentMethod.create({
      user: userId,
      type,
      accountNo: accountNo || "",
      nameOnAccount: nameOnAccount || "",
      last4: last4 || "",
      brand: brand || "",
      expMonth: expMonth || null,
      expYear: expYear || null,
      isDefault: shouldBeDefault,
    });

    // Update User model if you have reference array
    // await User.findByIdAndUpdate(userId, { $push: { paymentMethods: paymentMethod._id } });

    return NextResponse.json({
      success: true,
      message: "Payment method added successfully",
      paymentMethod,
    });
  } catch (error) {
    console.error("❌ POST Payment Method Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}