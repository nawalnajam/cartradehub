import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";

export async function POST(req) {
  try {
    const { message, history } = await req.json();

   
    if (isPaymentIntent(message)) {
      return NextResponse.json({
        reply: "💳 I'll take you to the Payment Options page where you can manage your saved payment methods!",
        redirectUrl: "/payment-options",
        showCars: false,
      });
    }

   
    if (isFavouritesIntent(message)) {
      return NextResponse.json({
        reply: "❤️ I'll take you to your Favourites page where all your saved cars are stored!",
        redirectUrl: "/favourites",
        showCars: false,
      });
    }

   
    if (isOrdersIntent(message)) {
      return NextResponse.json({
        reply: "📦 I'll take you to your Orders page where you can view all your bookings!",
        redirectUrl: "/my-orders",
        showCars: false,
      });
    }

  
    if (isMessagesIntent(message)) {
      return NextResponse.json({
        reply: "💬 I'll take you to your Messages inbox where you can chat with sellers!",
        redirectUrl: "/messages",
        showCars: false,
      });
    }

    
    if (isProfileIntent(message)) {
      return NextResponse.json({
        reply: "👤 I'll take you to your Profile page where you can manage your account!",
        redirectUrl: "/profile",
        showCars: false,
      });
    }

    
    if (isSettingsIntent(message)) {
      return NextResponse.json({
        reply: "⚙️ I'll take you to your Settings page where you can customize your preferences!",
        redirectUrl: "/settings",
        showCars: false,
      });
    }

    
    if (isHelpIntent(message)) {
      return NextResponse.json({
        reply: "❓ I'll take you to the Help page where you can find answers to common questions!",
        redirectUrl: "/help",
        showCars: false,
      });
    }

    if (isBlogIntent(message)) {
      return NextResponse.json({
        reply: "📝 I'll take you to the car post ad page where you can post the car ad",
        redirectUrl: "/sell/add-car",
        showCars: false,
      });
    }

    
    if (isAboutIntent(message)) {
      return NextResponse.json({
        reply: "ℹ️ I'll take you to the About page to learn more about CarTradeHub!",
        redirectUrl: "/about",
        showCars: false,
      });
    }

    
    if (isContactIntent(message)) {
      return NextResponse.json({
        reply: "📞 I'll take you to the Contact Us page. Our team will get back to you within 24 hours!",
        redirectUrl: "/contact",
        showCars: false,
      });
    }

    if (isEMIIntent(message)) {
      return NextResponse.json({
        reply: "💰 I'll take you to the EMI Calculator page where you can calculate your car loan installments!",
        redirectUrl: "/cars?showEMI=true",
        showCars: false,
      });
    }

   
    if (isTestDriveIntent(message)) {
      return NextResponse.json({
        reply: "🚗 I'll take you to the car listing page. Select a car and click 'Book Test Drive' to schedule your test drive!",
        redirectUrl: "/cars",
        showCars: false,
      });
    }

    if (isSellIntent(message)) {
      return NextResponse.json({
        reply: "📢 I'll take you to the 'Post Ad' page where you can list your car for sale with AI auto-fill!",
        redirectUrl: "/sell/add-car",
        showCars: false,
      });
    }

    
    const searchIntent = detectSearchIntent(message);
    if (searchIntent) {
      const cars = await searchCars(searchIntent);
      const redirectUrl = buildRedirectUrl(message);
      
      if (cars.length === 0) {
        return NextResponse.json({
          reply: "🔍 No cars found matching your criteria. Try adjusting your search!",
          redirectUrl: null,
          showCars: false,
        });
      }
      
      const count = cars.length;
      const brand = extractBrand(message);
      const price = extractPrice(message);
      
      let reply = "";
      if (brand && price) {
        reply = `🚗 Found **${count}** ${brand.toUpperCase()} cars under **${price}**! Click below to view all.`;
      } else if (brand) {
        reply = `🚗 Found **${count}** ${brand.toUpperCase()} cars! Click below to view all.`;
      } else if (price) {
        reply = `🚗 Found **${count}** cars under **${price}**! Click below to view all.`;
      } else {
        reply = `🚗 Found **${count}** cars matching your search! Click below to view all.`;
      }
      
      return NextResponse.json({
        reply: reply,
        redirectUrl: redirectUrl,
        showCars: false,
      });
    }

    
    const messages = [
      {
        role: "system",
        content: `You are the **CarTradeHub AI Assistant** - an expert on the CarTradeHub car marketplace website.

**ABOUT CARTTRADEHUB:**
CarTradeHub is a Pakistani car marketplace where users can:
- Browse thousands of cars for sale
- Search cars by brand, model, price, fuel type, location
- Post ads to sell cars (with AI auto-fill)
- Book test drives
- Calculate EMI for car loans
- Message sellers directly
- Save favourite cars
- Track test drive bookings

**YOUR ROLE:**
ONLY answer questions related to CarTradeHub website features.
If asked about anything else, say: "I'm the CarTradeHub assistant. I can only help with car-related queries on our platform."

Be friendly, professional, and concise. Keep responses under 3-4 sentences.

**IMPORTANT:** For any feature-related query (payment, favourites, orders, messages, profile, settings, help, blog, about, contact, EMI, test drive, sell, or car search), I will redirect you to the appropriate page.`
      },
      ...(history || []).slice(-5).map(msg => ({
        role: msg.from === "user" ? "user" : "assistant",
        content: msg.text
      })),
      { role: "user", content: message }
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-OpenRouter-Title": "CarTradeHub Chatbot",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: messages,
        max_tokens: 350,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { reply: "⚠️ Service error. Please try again." },
        { status: response.status }
      );
    }

    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";

    return NextResponse.json({
      reply: reply,
      redirectUrl: null,
      showCars: false,
    });

  } catch (error) {
    console.error("❌ Chat Error:", error);
    return NextResponse.json(
      { reply: "⚠️ Service error. Please try again." },
      { status: 500 }
    );
  }
}

// ============================================================
// INTENT DETECTION FUNCTIONS
// ============================================================

function isPaymentIntent(message) {
  const lower = message.toLowerCase();
  return lower.includes("payment") || 
         lower.includes("pay") ||
         lower.includes("payment options") ||
         lower.includes("payment method") ||
         lower.includes("credit card") ||
         lower.includes("debit card") ||
         lower.includes("jazzcash") ||
         lower.includes("easypaisa");
}

function isFavouritesIntent(message) {
  const lower = message.toLowerCase();
  return lower.includes("favourite") || 
         lower.includes("favorites") ||
         lower.includes("saved cars") ||
         lower.includes("wishlist") ||
         lower.includes("bookmark");
}

function isOrdersIntent(message) {
  const lower = message.toLowerCase();
  return lower.includes("order") || 
         lower.includes("my orders") ||
         lower.includes("bookings") ||
         lower.includes("booking history") ||
         lower.includes("test drive booking");
}

function isMessagesIntent(message) {
  const lower = message.toLowerCase();
  return lower.includes("message") || 
         lower.includes("inbox") ||
         lower.includes("chat") ||
         lower.includes("conversation") ||
         lower.includes("mail");
}

function isProfileIntent(message) {
  const lower = message.toLowerCase();
  return lower.includes("profile") || 
         lower.includes("my profile") ||
         lower.includes("account") ||
         lower.includes("my account");
}

function isSettingsIntent(message) {
  const lower = message.toLowerCase();
  return lower.includes("settings") || 
         lower.includes("preferences") ||
         lower.includes("configuration");
}

function isHelpIntent(message) {
  const lower = message.toLowerCase();
  return lower.includes("help") || 
         lower.includes("support") ||
         lower.includes("faq") ||
         lower.includes("trouble") ||
         lower.includes("issue") ||
         lower.includes("problem");
}

function isBlogIntent(message) {
  const lower = message.toLowerCase();
  return lower.includes("blog") || 
         lower.includes("article") ||
         lower.includes("news") ||
         lower.includes("post");
}

function isAboutIntent(message) {
  const lower = message.toLowerCase();
  return lower.includes("about") || 
         lower.includes("what is cartradehub") ||
         lower.includes("tell me about") ||
         lower.includes("who are you");
}

function isContactIntent(message) {
  const lower = message.toLowerCase();
  return lower.includes("contact") || 
         lower.includes("support") ||
         lower.includes("reach") && lower.includes("you");
}

function isEMIIntent(message) {
  const lower = message.toLowerCase();
  return lower.includes("emi") || 
         lower.includes("calculate loan") ||
         lower.includes("monthly payment") ||
         lower.includes("financing") ||
         lower.includes("installment");
}

function isTestDriveIntent(message) {
  const lower = message.toLowerCase();
  return lower.includes("test drive") || 
         lower.includes("book drive") ||
         lower.includes("schedule drive") ||
         lower.includes("want to drive");
}

function isSellIntent(message) {
  const lower = message.toLowerCase();
  return lower.includes("sell") || 
         lower.includes("post ad") ||
         lower.includes("list car") ||
         lower.includes("sell my car") ||
         lower.includes("add car");
}

function detectSearchIntent(message) {
  const lower = message.toLowerCase();
  const keywords = ["show me", "find", "search", "looking for", "want to see", "under", "below", "less than", "cars", "vehicles"];
  const hasKeyword = keywords.some(kw => lower.includes(kw));
  const hasCar = lower.includes("car") || lower.includes("vehicle") || lower.includes("auto");
  
  const brands = ["toyota", "honda", "suzuki", "kia", "hyundai", "bmw", "audi", "mercedes", "nissan", "ford", "chevrolet", "volkswagen", "mg", "haval", "changan"];
  const isBrand = brands.some(b => lower.includes(b));
  
  if (hasKeyword || isBrand || hasCar) {
    return message;
  }
  return null;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function extractBrand(message) {
  const lower = message.toLowerCase();
  const brands = ["toyota", "honda", "suzuki", "kia", "hyundai", "bmw", "audi", "mercedes", "nissan", "ford", "chevrolet", "volkswagen", "mg", "haval", "changan"];
  const found = brands.find(b => lower.includes(b));
  return found || null;
}

function extractPrice(message) {
  const match = message.match(/(\d+)\s*(lacs|lakh|million|k|crore)/i);
  if (match) {
    return match[0];
  }
  return null;
}

function buildRedirectUrl(message) {
  const params = new URLSearchParams();
  
  const brand = extractBrand(message);
  if (brand) params.set("brand", brand);
  
  const priceMatch = message.match(/(\d+)\s*(lacs|lakh|million|k|crore)/i);
  if (priceMatch) {
    let amount = parseInt(priceMatch[1]);
    const unit = priceMatch[2].toLowerCase();
    let maxPrice = null;
    if (unit === "lacs" || unit === "lakh") maxPrice = amount * 100000;
    else if (unit === "million") maxPrice = amount * 1000000;
    else if (unit === "k") maxPrice = amount * 1000;
    else if (unit === "crore") maxPrice = amount * 10000000;
    if (maxPrice) params.set("maxPrice", maxPrice);
  }
  
  const fuels = ["petrol", "diesel", "hybrid", "electric", "cng"];
  const foundFuel = fuels.find(f => message.toLowerCase().includes(f));
  if (foundFuel) params.set("fuelType", foundFuel);
  
  const cities = ["lahore", "karachi", "islamabad", "rawalpindi", "faisalabad", "multan", "peshawar", "quetta"];
  const foundCity = cities.find(c => message.toLowerCase().includes(c));
  if (foundCity) params.set("location", foundCity);
  
  return `/cars?${params.toString()}`;
}

async function searchCars(intent) {
  await connectDB();
  
  let maxPrice = null;
  const priceMatch = intent.match(/(\d+)\s*(lacs|lakh|million|k|crore)/i);
  if (priceMatch) {
    let amount = parseInt(priceMatch[1]);
    const unit = priceMatch[2].toLowerCase();
    if (unit === "lacs" || unit === "lakh") maxPrice = amount * 100000;
    else if (unit === "million") maxPrice = amount * 1000000;
    else if (unit === "k") maxPrice = amount * 1000;
    else if (unit === "crore") maxPrice = amount * 10000000;
  }
  
  let query = { status: "approved", availabilityStatus: "available" };
  if (maxPrice) query.price = { $lte: maxPrice };
  
  const brands = ["toyota", "honda", "suzuki", "kia", "hyundai", "bmw", "audi", "mercedes", "nissan", "ford", "chevrolet", "volkswagen", "mg", "haval", "changan"];
  const foundBrand = brands.find(b => intent.toLowerCase().includes(b));
  if (foundBrand) query.brand = { $regex: foundBrand, $options: "i" };
  
  const cities = ["lahore", "karachi", "islamabad", "rawalpindi", "faisalabad", "multan", "peshawar", "quetta"];
  const foundCity = cities.find(c => intent.toLowerCase().includes(c));
  if (foundCity) query.location = { $regex: foundCity, $options: "i" };
  
  const fuels = ["petrol", "diesel", "hybrid", "electric", "cng"];
  const foundFuel = fuels.find(f => intent.toLowerCase().includes(f));
  if (foundFuel) query.fuelType = { $regex: foundFuel, $options: "i" };
  
  return await Car.find(query).limit(20).populate("seller", "name email");
}