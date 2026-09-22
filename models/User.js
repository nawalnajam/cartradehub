import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
  
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: function () {
        return !this.isGoogleUser; // Password not required for Google users
      },
      minlength: [6, "Password must be at least 6 characters"],
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },

   
    role: {
      type: String,
      enum: ["admin", "seller", "buyer"],
      default: "buyer",
      required: true,
    },

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
      },
    ],

   
    paymentMethods: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentMethod",
      },
    ],

    stripeCustomerId: {
      type: String,
      default: "",
    },

    googleId: {
      type: String,
      default: "",
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },

    avatar: {
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
  {
    timestamps: true,
  }
);

UserSchema.virtual("defaultPaymentMethod", {
  ref: "PaymentMethod",
  localField: "_id",
  foreignField: "user",
  justOne: true,
  options: { match: { isDefault: true } },
});

UserSchema.virtual("allPaymentMethods", {
  ref: "PaymentMethod",
  localField: "_id",
  foreignField: "user",
});


UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });


UserSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});


UserSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

UserSchema.set("toObject", {
  virtuals: true,
});


export default mongoose.models.User || mongoose.model("User", UserSchema);