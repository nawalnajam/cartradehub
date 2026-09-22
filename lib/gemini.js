import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function extractCarDetailsFromImages(base64Images) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const imageParts = base64Images.map((img) => ({
      inlineData: {
        data: img,
        mimeType: "image/jpeg",
      },
    }));
    
    const prompt = `
You are an expert car inspector. Analyze this car image and extract ALL visible details.

CRITICAL - Look for these specific details:
1. **YEAR**: Look on registration plate, number plate, model badge, VIN plate - any number between 1990-2026
2. **ENGINE**: Look for engine displacement badge (1.3L, 1.8L, 2.0L) or engine type (V6, V8, Turbo)
3. **DRIVE TYPE**: Look for AWD, 4x4, FWD, RWD badges
4. **ASSEMBLY**: Look for "Local", "Imported", "CKD", "CBU" on plates

Return ONLY valid JSON with these EXACT field names:
{
  "brand": "",
  "model": "",
  "variant": "",
  "year": "EXACT year number like 2022 or Unknown",
  "bodyType": "",
  "color": "",
  "fuelType": "",
  "transmission": "",
  "engine": "EXACT engine like 1.8L or V6 or Unknown",
  "assembly": "Local or Imported or Unknown",
  "driveType": "Front-Wheel Drive or All-Wheel Drive or Unknown",
  "doors": "",
  "wheelType": "",
  "headlights": "",
  "condition": "",
  "seats": "",
  "mileage": "",
  "description": ""
}

RULES:
- If YEAR not visible → check number plates for numbers
- If ENGINE not visible → look for any engine badge
- Return "Unknown" only if absolutely nothing visible
- Return ONLY valid JSON, NO explanation
`;

    const result = await model.generateContent([
      { text: prompt },
      ...imageParts,
    ]);

    const responseText = result.response.text();
    console.log("📝 Gemini Raw Response:", responseText);

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response");

    const parsedData = JSON.parse(jsonMatch[0]);

    if (!parsedData.year || parsedData.year === "Unknown") {
     
      const allText = JSON.stringify(parsedData);
      const yearMatch = allText.match(/\b(19[8-9][0-9]|20[0-2][0-9]|202[0-6])\b/);
      if (yearMatch) {
        parsedData.year = yearMatch[1];
        console.log("✅ Smart Year Detection:", parsedData.year);
      }
    }

    if (!parsedData.engine || parsedData.engine === "Unknown") {
      const allText = JSON.stringify(parsedData);
      // Look for engine patterns like 1.3L, 1.8L, 2.0L, V6, V8, Turbo
      const engineMatch = allText.match(/\b(\d\.\d[Ll]|\d\.\d\s*[Ll]|V[6-8]|Turbo|Hybrid)\b/);
      if (engineMatch) {
        parsedData.engine = engineMatch[1];
        console.log("✅ Smart Engine Detection:", parsedData.engine);
      }
    }

    const defaultFields = {
      brand: "Unknown",
      model: "Unknown",
      variant: "Unknown",
      year: "Unknown",
      bodyType: "Unknown",
      color: "Unknown",
      fuelType: "Unknown",
      transmission: "Unknown",
      engine: "Unknown",
      assembly: "Unknown",
      driveType: "Unknown",
      doors: "Unknown",
      wheelType: "Unknown",
      headlights: "Unknown",
      condition: "Unknown",
      seats: "Unknown",
      mileage: "Unknown",
      description: "No description available"
    };

    const finalData = { ...defaultFields, ...parsedData };
    console.log("✅ Final AI Data:", finalData);

    return finalData;

  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Gemini failed");
  }
}