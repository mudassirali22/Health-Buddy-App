import { GoogleGenerativeAI } from '@google/generative-ai';
import https from "https";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY?.trim());

// download file to buffer
const downloadFile = (url) =>
  new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });

const MODEL_FALLBACKS = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-2.5-pro",
];

let cachedModel = null;
let lastCheckTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper for retrying AI calls
const callAIWithRetry = async (fn, maxRetries = 5) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      const isRetryable = err.message.includes("503") || err.message.includes("429") || err.message.includes("high demand");
      if (isRetryable && i < maxRetries - 1) {
        // More patient delay for free tier: 2s, 4s, 8s, 16s
        const delay = Math.pow(2, i + 1) * 1000;
        console.warn(`AI busy or quota hit. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
};

const getAvailableModel = async () => {
  const now = Date.now();
  if (cachedModel && (now - lastCheckTime < CACHE_DURATION)) {
    return cachedModel;
  }

  for (const modelName of MODEL_FALLBACKS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      // Simple ping for availability
      await Promise.race([
        model.generateContent({ contents: [{ role: 'user', parts: [{ text: 'ping' }] }] }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 4000))
      ]);
      
      cachedModel = modelName;
      lastCheckTime = Date.now();
      return modelName;
    } catch (err) {
      console.warn(`Model ${modelName} availability check failed:`, err.message);
    }
  }
  return cachedModel || "gemini-2.0-flash";
};

export const analyzeReport = async (fileUrl, reportType) => {
  try {
    if (!process.env.GEMINI_API_KEY)
      throw new Error("AI key is  not configured");

    const fileBuffer = await downloadFile(fileUrl);
    const base64Data = fileBuffer.toString("base64");

    const mimeTypes = {
      ".pdf": "application/pdf",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
    };
    const ext = fileUrl.toLowerCase().match(/\.\w+$/)?.[0] || "";
    const mimeType = mimeTypes[ext] || "application/pdf";

    const prompt = `
You are a highly skilled and empathetic AI medical assistant. 
Your task is to carefully analyze the attached ${reportType} medical report and generate a helpful, easy-to-understand explanation for the patient.

Please follow these steps strictly:

1. Interpret the medical data and identify any abnormal or concerning values.
2. Summarize the overall health situation in clear, patient-friendly language.
3. Provide advice that is informative, safe, and respectful — do not make a diagnosis or prescribe medicines.
4. All information should be factual, calm, and supportive in tone.

Now, provide the final structured output exactly in **valid JSON format** below. 
No markdown, no extra text — only valid JSON.

{
  "english": "Write a 1-5 sentence summary in plain English explaining what this report indicates and any key findings in simple words.",
  "abnormalValues": ["List all abnormal or concerning values with short explanations, e.g. 'High glucose - may indicate diabetes risk'"],
  "questionsForDoctor": ["Write 3-5 meaningful questions the patient should ask their doctor"],
  "foodsToAvoid": ["List 3-5 foods that could worsen the reported condition or values"],
  "foodsToEat": ["List 3-5 foods that may help improve or support better health"],
  "homeRemedies": ["List 2-3 safe, general home remedies or habits (e.g., hydration, rest, exercise) relevant to this report"]
}

Important Notes:
- Always return valid JSON only — no markdown, no explanations outside the JSON.
- Keep all text short, friendly, and medically accurate.
- If the report seems unclear or incomplete, politely mention that in the English summary.
`;

    const modelName = await getAvailableModel();
    const model = genAI.getGenerativeModel({ model: modelName });
    
    //  API call with retry
    const result = await callAIWithRetry(() => model.generateContent({
      contents: [{
        role: "user",
        parts: [
          { 
            inlineData: { 
              data: base64Data, 
              mimeType: mimeType 
            } 
          },
          { text: prompt }
        ]
      }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
      }
    }));

    const response = await result.response;
    const text = response.text();
    
    // JSON parsing
    let jsonMatch;
    try {
      jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      
      const data = JSON.parse(jsonMatch[0]);
      
      // Validate and ensure all required fields exist
      const fields = [
        "english",
        "abnormalValues",
        "questionsForDoctor",
        "foodsToAvoid",
        "foodsToEat",
        "homeRemedies",
      ];
      
      for (const field of fields) {
        if (!data[field]) {
          data[field] = [];
          console.warn(`Missing field in response: ${field}`);
        }

        if (Array.isArray(data[field]) && data[field].length === 0) {
          data[field] = ["Information not available from analysis"];
        }
      }

      data.disclaimer = "This AI analysis is for informational purposes only. Always consult your doctor before making any medical decisions.";
      data.modelUsed = modelName;
      data.timestamp = new Date().toISOString();

      return data;
      
    } catch (parseError) {
      console.error("JSON parsing error:", parseError.message);
      throw new Error(`Failed to parse AI response: ${parseError.message}`);
    }
    
  } catch (err) {
    console.error("AI analysis failed:", err.message);
    
    //  fallback response 
    return {
      english: "Unable to analyze the report automatically. Please consult your doctor for accurate interpretation.",
      abnormalValues: ["Analysis unavailable - consult your doctor"],
      questionsForDoctor: [
        "What do these results mean for my health?",
        "Do I need any follow-up tests or treatments?",
        "Are there any lifestyle changes I should make?",
        "When should I get tested again?"
      ],
      foodsToAvoid: ["Processed foods", "Sugary drinks", "High-sodium foods"],
      foodsToEat: ["Fresh vegetables", "Whole grains", "Lean proteins"],
      homeRemedies: ["Stay hydrated", "Get adequate rest", "Maintain regular physical activity"],
      disclaimer: "This AI analysis is for informational purposes only. Always consult your doctor before making any medical decisions.",
      error: true,
      errorMessage: err.message.includes("SSL") || err.message.includes("alert number 80") 
        ? "Secure connection failed. Please check your network." 
        : "AI Service is temporarily busy. Using standard diagnostic template."
    };
  }
};



export default { analyzeReport };