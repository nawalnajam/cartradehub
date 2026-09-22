import { NextResponse } from "next/server";

export async function POST(req) {
  try {
   
    let audioBase64 = null;
    try {
      const body = await req.json();
      audioBase64 = body.audioBase64;
    } catch (parseError) {
      console.error("❌ Invalid JSON body:", parseError);
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    if (!audioBase64) {
      console.error("❌ No audio data provided");
      return NextResponse.json(
        { success: false, error: "No audio data provided" },
        { status: 400 }
      );
    }

    // 2. Check API key
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) {
      console.error("❌ ASSEMBLYAI_API_KEY missing in .env.local");
      return NextResponse.json(
        { success: false, error: "AssemblyAI API key not configured" },
        { status: 500 }
      );
    }

    // 3. Decode base64 to buffer
    let audioBuffer;
    try {
      audioBuffer = Buffer.from(audioBase64, "base64");
    } catch (bufferError) {
      console.error("❌ Invalid base64 audio:", bufferError);
      return NextResponse.json(
        { success: false, error: "Invalid audio data" },
        { status: 400 }
      );
    }

    if (audioBuffer.length < 100) {
      console.warn("⚠️ Audio buffer too small:", audioBuffer.length);
      return NextResponse.json(
        { success: false, error: "Audio too short, please speak longer" },
        { status: 400 }
      );
    }

    console.log(`📤 Audio size: ${audioBuffer.length} bytes`);

    
    let uploadUrl = null;
    try {
      const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/octet-stream",
        },
        body: audioBuffer,
      });

      console.log(`📤 Upload response status: ${uploadRes.status}`);

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        console.error(`❌ Upload failed (${uploadRes.status}):`, errorText);
        return NextResponse.json(
          { success: false, error: `Upload failed (${uploadRes.status})` },
          { status: uploadRes.status }
        );
      }

      const uploadData = await uploadRes.json();
      uploadUrl = uploadData.upload_url;

      if (!uploadUrl) {
        console.error("❌ No upload URL returned:", uploadData);
        return NextResponse.json(
          { success: false, error: "Upload succeeded but no URL returned" },
          { status: 500 }
        );
      }

      console.log(`✅ Upload successful, URL: ${uploadUrl.substring(0, 50)}...`);
    } catch (uploadError) {
      console.error("❌ Upload error:", uploadError);
      return NextResponse.json(
        { success: false, error: "Failed to upload audio: " + uploadError.message },
        { status: 500 }
      );
    }

    // 5. Request transcription
    let transcriptId = null;
    try {
      const transcriptRes = await fetch("https://api.assemblyai.com/v2/transcript", {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio_url: uploadUrl,
          language_code: "en",
          punctuate: true,
          format_text: true,
          filter_profanity: true,
        }),
      });

      console.log(`📥 Transcription request status: ${transcriptRes.status}`);

      if (!transcriptRes.ok) {
        const errorText = await transcriptRes.text();
        console.error(`❌ Transcription request failed (${transcriptRes.status}):`, errorText);
        return NextResponse.json(
          { success: false, error: `Transcription request failed (${transcriptRes.status})` },
          { status: transcriptRes.status }
        );
      }

      const transcriptData = await transcriptRes.json();
      transcriptId = transcriptData.id;

      if (!transcriptId) {
        console.error("❌ No transcript ID returned:", transcriptData);
        return NextResponse.json(
          { success: false, error: "No transcript ID received" },
          { status: 500 }
        );
      }

      console.log(`✅ Transcription requested, ID: ${transcriptId}`);
    } catch (transcriptError) {
      console.error("❌ Transcription request error:", transcriptError);
      return NextResponse.json(
        { success: false, error: "Failed to request transcription: " + transcriptError.message },
        { status: 500 }
      );
    }

    // 6. Poll for results
    let transcriptText = null;
    let confidence = 0;
    let attempts = 0;
    const maxAttempts = 30;

    while (!transcriptText && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      try {
        const statusRes = await fetch(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          {
            headers: { Authorization: apiKey },
          }
        );

        if (!statusRes.ok) {
          console.warn(`⚠️ Poll attempt ${attempts + 1} failed: ${statusRes.status}`);
          attempts++;
          continue;
        }

        const statusData = await statusRes.json();

        if (statusData.status === "completed") {
          transcriptText = statusData.text;
          confidence = statusData.confidence || 0;
          console.log(`✅ Transcription completed: "${transcriptText}" (confidence: ${confidence})`);
          break;
        } else if (statusData.status === "error") {
          console.error("❌ Transcription error:", statusData.error);
          return NextResponse.json(
            { success: false, error: statusData.error || "Transcription failed" },
            { status: 500 }
          );
        } else {
          console.log(`⏳ Polling attempt ${attempts + 1}: ${statusData.status}`);
        }
      } catch (pollError) {
        console.error("❌ Polling error:", pollError);
       
      }
      attempts++;
    }

    if (!transcriptText) {
      console.error("❌ Transcription timeout after", maxAttempts, "attempts");
      return NextResponse.json(
        { success: false, error: "Transcription timed out" },
        { status: 408 }
      );
    }

   
    return NextResponse.json({
      success: true,
      text: transcriptText,
      confidence: confidence,
    });
  } catch (error) {
    console.error("❌ Unhandled error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}