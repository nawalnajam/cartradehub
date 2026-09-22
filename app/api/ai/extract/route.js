
import { NextResponse } from "next/server";
import { extractCarDetailsFromImages } from "@/lib/gemini";

export async function POST(req) {
  try {
    const { images } = await req.json();
    
    if (!images || images.length === 0) {
      return NextResponse.json(
        { success: false, message: "No images provided" },
        { status: 400 }
      );
    }

    const carData = await extractCarDetailsFromImages(images);

    //  Ensure ALL fields exist
    const finalData = {
      brand: carData.brand || "Unknown",
      model: carData.model || "Unknown",
      variant: carData.variant || "Unknown",
      year: carData.year || "Unknown",
      bodyType: carData.bodyType || "Unknown",
      color: carData.color || "Unknown",
      fuelType: carData.fuelType || "Unknown",
      transmission: carData.transmission || "Unknown",
      engine: carData.engine || "Unknown",
      assembly: carData.assembly || "Unknown",
      driveType: carData.driveType || "Unknown",
      doors: carData.doors || "Unknown",
      wheelType: carData.wheelType || "Unknown",
      headlights: carData.headlights || "Unknown",
      condition: carData.condition || "Unknown",
      seats: carData.seats || "Unknown",
      mileage: carData.mileage || "Unknown",
      description: carData.description || "No description available"
    };

    console.log("✅ API Returning:", finalData);

    return NextResponse.json({
      success: true,
      data: finalData
    });

  } catch (error) {
    console.error("Extract API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}