import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req) {
  try {
    const { imageBase64, mimeType } = await req.json();
    
    if (!imageBase64) {
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      console.warn("⚠️ GEMINI_API_KEY not found, using fallback");
      return NextResponse.json({
        success: true,
        car: { 
          brand: "BMW", 
          model: "4 Series", 
          year: "2022", 
          bodyType: "Coupe", 
          color: "Blue", 
          fuelType: "Petrol", 
          transmission: "Automatic" 
        },
        fallback: true,
        message: "Using fallback data"
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      
      const prompt = `
You are an expert car inspector. Analyze this car image carefully and return ONLY valid JSON.

Return EXACTLY this format:
{
  "brand": "car brand (e.g., Toyota, BMW, Honda)",
  "model": "car model (e.g., Corolla, 4 Series, Civic)",
  "year": "year (e.g., 2022)",
  "bodyType": "Sedan or SUV or Hatchback or Coupe or Truck",
  "color": "exterior color (e.g., White, Black, Blue, Red)",
  "fuelType": "Petrol or Diesel or Hybrid or Electric or CNG",
  "transmission": "Manual or Automatic or CVT",
  "condition": "Excellent or Good or Fair or Poor"
}

RULES:
- If something is not clearly visible, use "Unknown"
- Do NOT add "X", "i", "M" or any extra letters to model name
- For BMW: model should be "3 Series", "4 Series", "X5", etc.
- For Toyota: model should be "Corolla", "Camry", "SUV", etc.
- Return ONLY valid JSON, no extra text.
`;

      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType || "image/jpeg",
        },
      };

      console.log("📤 Sending image to Gemini...");
      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result.response.text();

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return NextResponse.json(
          { success: false, error: "Invalid AI response" },
          { status: 500 }
        );
      }

      const carData = JSON.parse(jsonMatch[0]);
      console.log("✅ Gemini identified:", carData);

      if (carData.model) {
        carData.model = carData.model.replace(/[^\w\s]/g, '').trim();
      }

      return NextResponse.json({ success: true, car: carData });

    } catch (geminiError) {
      console.error("❌ Gemini Error:", geminiError.message);
      return NextResponse.json({
        success: true,
        car: { 
          brand: "BMW", 
          model: "4 Series", 
          year: "2022", 
          bodyType: "Coupe", 
          color: "Blue", 
          fuelType: "Petrol", 
          transmission: "Automatic" 
        },
        fallback: true,
        message: "AI service error. Using fallback data."
      });
    }

  } catch (error) {
    console.error("❌ Image Search Error:", error);
    return NextResponse.json({
      success: true,
      car: { 
        brand: "BMW", 
        model: "4 Series", 
        year: "2022", 
        bodyType: "Coupe", 
        color: "Blue", 
        fuelType: "Petrol", 
        transmission: "Automatic" 
      },
      fallback: true,
      message: "Service error. Using fallback data."
    });
  }
}