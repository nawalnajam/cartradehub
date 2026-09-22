import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { images } = await req.json(); // base64 images

    const uploadedImages = [];

    for (const img of images) {
      const result = await cloudinary.v2.uploader.upload(
        `data:image/jpeg;base64,${img}`,
        { folder: "car-trade-hub" }
      );

      uploadedImages.push(result.secure_url);
    }

    return NextResponse.json({
      success: true,
      images: uploadedImages,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}