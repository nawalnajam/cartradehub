"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Camera, X, Loader2, Sparkles, Mic, MicOff, Car } from "lucide-react";

export default function HeroSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [similarCars, setSimilarCars] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const fileInputRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setVoiceSupported(false);
    }
  }, []);

  const detectSearchIntent = (text) => {
    const lower = text.toLowerCase();
    const brands = ["toyota", "honda", "suzuki", "kia", "hyundai", "bmw", "audi", "mercedes", "nissan", "ford", "chevrolet", "volkswagen", "mg", "haval", "changan"];
    const isBrand = brands.some(b => lower.includes(b));
    const priceMatch = text.match(/(\d+)\s*(lacs|lakh|million|k|crore)/i);
    const fuelMatch = lower.match(/\b(petrol|diesel|hybrid|electric|cng)\b/);
    return isBrand || priceMatch || fuelMatch;
  };

  const buildRedirectUrl = (text) => {
    const lower = text.toLowerCase();
    const params = new URLSearchParams();

    const brands = ["toyota", "honda", "suzuki", "kia", "hyundai", "bmw", "audi", "mercedes", "nissan", "ford", "chevrolet", "volkswagen", "mg", "haval", "changan"];
    const foundBrand = brands.find(b => lower.includes(b));
    if (foundBrand) params.set("brand", foundBrand);

    const priceMatch = text.match(/(\d+)\s*(lacs|lakh|million|k|crore)/i);
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
    const foundFuel = fuels.find(f => lower.includes(f));
    if (foundFuel) params.set("fuelType", foundFuel);

    const cities = ["lahore", "karachi", "islamabad", "rawalpindi", "faisalabad", "multan", "peshawar", "quetta"];
    const foundCity = cities.find(c => lower.includes(c));
    if (foundCity) params.set("location", foundCity);

    return params.toString() ? `/cars?${params.toString()}` : null;
  };

  // ---------- Voice Recording ----------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000,
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendToAssemblyAI(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000);
      setIsListening(true);
      setTranscript("🎤 Recording...");
      setSearchQuery("");
    } catch (error) {
      console.error("❌ Microphone error:", error);
      alert("Please allow microphone access.");
      setIsListening(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setIsProcessing(true);
      setTranscript("⏳ Processing...");
    }
  };

  // ---------- Send to AssemblyAI (English only, with confidence) ----------
  const sendToAssemblyAI = async (audioBlob) => {
    try {
      setIsProcessing(true);
      setTranscript("⏳ Processing...");

      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);

      reader.onloadend = async () => {
        try {
          const base64Audio = reader.result.split(",")[1];

          if (!base64Audio || base64Audio.length < 100) {
            throw new Error("Audio too short. Please speak louder.");
          }

          const res = await fetch("/api/assemblyai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audioBase64: base64Audio }),
          });

          if (!res.ok) {
            let errorMsg = "Voice search failed. Please try again.";
            try {
              const data = await res.json();
              if (data.error) errorMsg = data.error;
            } catch (_) { /* ignore */ }
            throw new Error(errorMsg);
          }

          const data = await res.json();

          if (data.success && data.text) {
            const recognizedText = data.text.trim();
            const confidence = data.confidence || 0;

            console.log(`✅ Recognized: "${recognizedText}" (confidence: ${Math.round(confidence * 100)}%)`);

            // If confidence is too low, ask to repeat
            if (confidence < 0.5) {
              alert(`I heard "${recognizedText}" but I'm not confident (${Math.round(confidence * 100)}%). Please speak clearly and try again.`);
              setIsProcessing(false);
              return;
            }

            setTranscript(recognizedText);
            setSearchQuery(recognizedText);

            if (!recognizedText || recognizedText.length < 2) {
              alert("Could not hear clearly. Please speak in English and try again.");
              setIsProcessing(false);
              return;
            }

            // Redirect with search
            const searchIntent = detectSearchIntent(recognizedText);
            if (searchIntent) {
              const redirectUrl = buildRedirectUrl(recognizedText);
              if (redirectUrl) {
                router.push(redirectUrl);
              } else {
                router.push(`/cars?search=${encodeURIComponent(recognizedText)}`);
              }
            } else {
              router.push(`/cars?search=${encodeURIComponent(recognizedText)}`);
            }
          } else {
            alert(data.error || "Could not understand voice. Please try again.");
            setIsProcessing(false);
          }
        } catch (error) {
          console.error("❌ Error:", error);
          alert(error.message || "Error processing voice. Please try again.");
          setIsProcessing(false);
        }
      };

      reader.onerror = () => {
        alert("Failed to read audio file. Please try again.");
        setIsProcessing(false);
      };
    } catch (error) {
      console.error("❌ AssemblyAI Error:", error);
      alert("Error processing voice. Please try again.");
      setIsProcessing(false);
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // ---------- Text Search ----------
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const intent = detectSearchIntent(searchQuery);
      if (intent) {
        const redirectUrl = buildRedirectUrl(searchQuery);
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push(`/cars?search=${encodeURIComponent(searchQuery.trim())}`);
        }
      } else {
        router.push(`/cars?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  // ---------- Image Upload & AI Search ----------
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeAndSearch = async () => {
    if (!selectedImage) return;
    setAnalyzing(true);

    try {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(selectedImage);
      });

      const res = await fetch("/api/ai/image-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: selectedImage.type,
        }),
      });

      const data = await res.json();

      if (data.success && data.car) {
        const car = data.car;
        const searchParams = new URLSearchParams();

        let searchText = "";
        if (car.brand && car.brand !== "Unknown") searchText += car.brand;
        if (car.model && car.model !== "Unknown") searchText += searchText ? ` ${car.model}` : car.model;

        if (searchText) searchParams.append("search", searchText);
        if (car.brand && car.brand !== "Unknown") searchParams.append("brand", car.brand);
        if (car.model && car.model !== "Unknown") searchParams.append("model", car.model);
        if (car.bodyType && car.bodyType !== "Unknown") searchParams.append("bodyType", car.bodyType);
        if (car.fuelType && car.fuelType !== "Unknown") searchParams.append("fuelType", car.fuelType);
        if (car.year && car.year !== "Unknown") searchParams.append("year", car.year);
        if (car.color && car.color !== "Unknown") searchParams.append("color", car.color);
        if (car.transmission && car.transmission !== "Unknown") searchParams.append("transmission", car.transmission);

        searchParams.append("aiSearch", "true");

        const queryString = searchParams.toString();
        console.log("🔍 Redirecting with:", queryString);
        router.push(`/cars?${queryString}`);

        setShowImageUpload(false);
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        alert("Could not identify car. Please try again.");
        setShowImageUpload(false);
        setSelectedImage(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Something went wrong. Please try again.");
      setShowImageUpload(false);
      setSelectedImage(null);
      setImagePreview(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const cancelUpload = () => {
    setShowImageUpload(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const closeResults = () => {
    setShowResults(false);
    setSimilarCars([]);
    setAiResult(null);
    setNoResults(false);
  };

  const viewCarDetail = (carId) => {
    router.push(`/cars/${carId}`);
  };

 
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 px-4">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isListening ? "🎤 Recording..." : isProcessing ? "⏳ Processing..." : "Search by brand, model, city, price... e.g., Toyota Corolla"}
          className={`w-full px-6 py-4 pr-44 rounded-2xl bg-white shadow-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base transition-all ${
            isListening ? "ring-4 ring-red-400/50 border-red-400 bg-red-50/90" : ""
          }`}
        />

     
        {(isListening || isProcessing) && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isListening ? (
              <>
                <div className="flex gap-1">
                  <span className="w-1.5 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1.5 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
                <span className="text-red-500 text-xs font-medium hidden sm:inline">🎤 Recording</span>
              </>
            ) : (
              <>
                <Loader2 size={18} className="animate-spin text-blue-500" />
                <span className="text-blue-500 text-xs font-medium hidden sm:inline">⏳ Processing</span>
              </>
            )}
          </div>
        )}

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          {/* Voice Button */}
          <button
            type="button"
            onClick={toggleVoice}
            disabled={isProcessing}
            className={`px-4 py-2 rounded-xl font-semibold transition flex items-center gap-2 ${
              isListening
                ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                : isProcessing
                ? "bg-blue-500 text-white cursor-not-allowed opacity-70"
                : voiceSupported
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                : "bg-gray-100 text-gray-300 cursor-not-allowed opacity-50"
            }`}
            title="Search by voice (English only)"
            disabled={!voiceSupported || isProcessing}
          >
            {isListening ? (
              <MicOff size={18} />
            ) : isProcessing ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Mic size={18} />
            )}
            <span className="text-xs hidden sm:inline">
              {isListening ? "Stop" : isProcessing ? "Processing" : "Voice"}
            </span>
          </button>

        
          <button
            type="button"
            onClick={() => setShowImageUpload(true)}
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl font-semibold hover:bg-gray-200 transition flex items-center gap-2"
            title="Search by image"
          >
            <Camera size={18} />
          </button>

          
          <button
            type="submit"
            className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2"
          >
            <Search size={18} />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </form>

      
      {transcript && !isListening && !isProcessing && searchQuery && searchQuery !== transcript && (
        <div className="mt-2 text-center">
          <p className="text-white/70 text-sm bg-black/30 backdrop-blur-sm px-4 py-1.5 rounded-full inline-flex items-center gap-2">
            <span className="text-sky-400">🎤</span>
            You said: <span className="text-white font-semibold">"{transcript}"</span>
          </p>
        </div>
      )}

      {isListening && (
        <div className="mt-3 text-center animate-pulse">
          <p className="text-white font-medium text-sm flex items-center justify-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span>🎤 Recording... Speak clearly (English only)</span>
            <button onClick={stopRecording} className="text-red-400 text-xs hover:text-red-300 underline">Stop</button>
          </p>
          <p className="text-white/50 text-xs mt-1 flex flex-wrap gap-2 justify-center">
            <span>💡 Examples:</span>
            <span className="bg-white/20 px-2 py-0.5 rounded">"Toyota Corolla"</span>
            <span className="bg-white/20 px-2 py-0.5 rounded">"under 50 lacs"</span>
            <span className="bg-white/20 px-2 py-0.5 rounded">"petrol cars in Lahore"</span>
          </p>
        </div>
      )}

      {isProcessing && !isListening && (
        <div className="mt-3 text-center">
          <p className="text-blue-400 font-medium text-sm flex items-center justify-center gap-3">
            <Loader2 size={18} className="animate-spin" />
            <span>⏳ Processing your voice...</span>
          </p>
        </div>
      )}

      <p className="text-white/50 text-xs text-center mt-3 flex items-center justify-center gap-2 flex-wrap">
        <span>Try: "Toyota Corolla", "under 10 lacs", "Karachi"</span>
        <span className="text-gray-400">•</span>
        <span className="text-sky-400">🎤 Voice (English only)</span>
        <span className="text-gray-400">•</span>
        <span className="text-emerald-400">📷 Image</span>
        <span className="text-gray-400">•</span>
        <span className="text-yellow-400">⏳ Processing: 2-3 sec</span>
      </p>

     
      {showImageUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg text-gray-800">Search by Image</h3>
              <button onClick={() => setShowImageUpload(false)} className="p-1 hover:bg-gray-100 rounded-full transition">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-sky-300 rounded-2xl p-8 text-center cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition-all"
                >
                  <Camera size={48} className="mx-auto text-sky-400 mb-3" />
                  <p className="text-gray-600 font-medium">Click to upload car photo</p>
                  <p className="text-gray-400 text-sm mt-1">JPG, PNG, WEBP up to 5MB</p>
                  <p className="text-gray-400 text-xs mt-1">AI will identify and show similar cars</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div>
                  <div className="flex gap-4 items-start">
                    <div className="relative w-28 h-28 flex-shrink-0">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl shadow-md" />
                      <button
                        onClick={cancelUpload}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="flex-1">
                      {analyzing ? (
                        <div className="flex items-center gap-3">
                          <Loader2 size={24} className="animate-spin text-sky-600" />
                          <div>
                            <p className="font-semibold text-gray-800">AI is analyzing your car...</p>
                            <p className="text-xs text-gray-500">Identifying brand, model, and specs</p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-700 mb-3">Photo uploaded successfully!</p>
                          <button
                            onClick={analyzeAndSearch}
                            className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-5 py-2 rounded-xl font-semibold text-sm hover:shadow-lg transition w-full"
                          >
                            <Sparkles size={14} className="inline mr-1" />
                            Find Similar Cars
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {showResults && (
        <div className="mt-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={18} className="text-sky-500" />
                <h3 className="font-bold text-gray-800 text-lg">
                  {noResults ? "No Cars Found" : "Similar Cars Found"}
                </h3>
              </div>
              {aiResult && !noResults && (
                <p className="text-gray-500 text-sm">
                  Based on your {aiResult.brand} {aiResult.model} photo
                </p>
              )}
            </div>
            <button onClick={closeResults} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          {noResults ? (
            <div className="text-center py-8">
              <Car size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No similar cars available.</p>
              <button
                onClick={() => {
                  const searchTerms = [];
                  if (aiResult?.brand && aiResult.brand !== "unknown") searchTerms.push(aiResult.brand);
                  if (searchTerms.length) {
                    router.push(`/cars?search=${encodeURIComponent(searchTerms.join(" "))}`);
                  } else {
                    router.push("/cars");
                  }
                  closeResults();
                }}
                className="mt-4 text-sky-600 text-sm font-semibold hover:underline"
              >
                Browse all {aiResult?.brand || "cars"} →
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {similarCars.map((car) => (
                  <div
                    key={car._id}
                    onClick={() => viewCarDetail(car._id)}
                    className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition hover:-translate-y-1"
                  >
                    <div className="h-32 overflow-hidden">
                      <img src={car.images?.[0] || "/placeholder.png"} alt={car.model} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-gray-800 text-sm">{car.brand} {car.model}</h3>
                      <p className="text-sky-600 font-bold text-sm">PKR {Number(car.price).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    const searchTerms = [];
                    if (aiResult?.brand && aiResult.brand !== "unknown") searchTerms.push(aiResult.brand);
                    if (aiResult?.model && aiResult.model !== "unknown") searchTerms.push(aiResult.model);
                    if (searchTerms.length) {
                      router.push(`/cars?search=${encodeURIComponent(searchTerms.join(" "))}`);
                    } else {
                      router.push("/cars");
                    }
                    closeResults();
                  }}
                  className="text-sky-600 text-sm font-semibold hover:underline"
                >
                  View all results on Cars page →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}