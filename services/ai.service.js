// backend/services/ai.service.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.4,
  },
  systemInstruction: `
You are an expert MERN developer...

IMPORTANT RULES:
1. ALWAYS return **valid JSON**.
2. NEVER return comments, markdown, code-blocks, backticks, or explanations.
3. ALWAYS return a JSON containing at least:
   {
     "text": "...",
     "fileTree": { ... }  // optional but SHOULD be present when user asks coding tasks
   }
4. fileTree must follow this format ONLY:
   {
     "filename.ext": {
       "file": { "contents": "..." }
     }
   }
5. text must be short, like a summary.
6. If user asks normal questions, return:
   { "text": "answer here" }
7. If user asks coding / building / express app:
   return:
   {
     "text": "Here is your app",
     "fileTree": { ... },
     "buildCommand": {...},
     "startCommand": {...}
   }
`
});

// ------------------------
//  CLEAN JSON PARSER
// ------------------------
function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    console.log("❌ AI returned invalid JSON, wrapping into fallback", text);

    return {
      text: text,
      fileTree: {}
    };
  }
}

// ------------------------
//     MAIN FUNCTION
// ------------------------
export const generateResult = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);

    let raw = result.response.text().trim();

    // Remove accidental ```json ... ```
    if (raw.startsWith("```")) {
      raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    }

    // Parse JSON safely
    const finalResponse = safeJson(raw);

    // Guarantee final format
    return JSON.stringify({
      text: finalResponse.text || "",
      fileTree: finalResponse.fileTree || {},
      buildCommand: finalResponse.buildCommand || null,
      startCommand: finalResponse.startCommand || null
    });

  } catch (err) {
    console.log("AI ERROR:", err);
    return JSON.stringify({
      text: "AI failed to generate a response.",
      fileTree: {}
    });
  }
};
