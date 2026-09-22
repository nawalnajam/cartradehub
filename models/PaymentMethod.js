import mongoose from "mongoose";

const PaymentMethodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["card", "jazzcash", "easypaisa", "bank"],
      required: true,
    },
    // Card Fields
    last4: {
      type: String,
      default: "",
    },
    brand: {
      type: String,
      default: "",
    },
    expMonth: {
      type: Number,
      default: null,
    },
    expYear: {
      type: Number,
      default: null,
    },
    // Manual Method Fields
    accountNo: {
      type: String,
      default: "",
    },
    nameOnAccount: {
      type: String,
      default: "",
    },
    // Common
    isDefault: {
      type: Boolean,
      default: false,
    },
    stripePaymentMethodId: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ✅ CORRECT: Pre-save hook - async function WITHOUT next parameter
PaymentMethodSchema.pre("save", async function () {
  // If this payment method is being set as default, unset all others for this user
  if (this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
});

// Optional: Update timestamps manually (if not using timestamps: true)
// PaymentMethodSchema.pre("save", function (next) {
//   this.updatedAt = new Date();
//   next();
// });

export default mongoose.models.PaymentMethod ||
  mongoose.model("PaymentMethod", PaymentMethodSchema);