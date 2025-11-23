import { GoogleGenAI } from "@google/genai";
import https from "https";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

const MODEL_FALLBACKS = ["gemini-2.5-flash", "gemini-2.0-flash-001"];

const getAvailableModel = async () => {
  for (const modelName of MODEL_FALLBACKS) {
    try {
      // Test model availability 
      const response = await genAI.models.generateContent({
        model: modelName,
        contents: [{ role: "user", parts: [{ text: "ping" }] }]
      });

      return modelName;

    } catch (err) {
      console.error('AI not available:', err.message);
    }
  }
  throw new Error("No working AI model found .");
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
    
    //  API call
    const response = await genAI.models.generateContent({
      model: modelName,
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
    });

    const text = response.text;
    
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
      errorMessage: err.message
    };
  }
};



export default { analyzeReport };