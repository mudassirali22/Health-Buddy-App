import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY?.trim());

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

// Helper for retrying AI calls on 503/429 errors
const callAIWithRetry = async (fn, maxRetries = 5) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      const isRetryable = err.message.includes("503") || err.message.includes("429") || err.message.includes("high demand");
      if (isRetryable && i < maxRetries - 1) {
        // More patient delay for free tier quota: 2s, 4s, 8s, 16s
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
    console.log(`Using cached model: ${cachedModel}`);
    return cachedModel;
  }

  console.log("--- Refreshing Gemini Availability ---");
  console.log("Key Prefix:", process.env.GEMINI_API_KEY?.trim().substring(0, 8));
  
  for (const modelName of MODEL_FALLBACKS) {
    try {
      console.log(`Trying model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await Promise.race([
        model.generateContent({ contents: [{ role: 'user', parts: [{ text: 'ping' }] }] }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout (4s)")), 4000))
      ]);
      
      if (result) {
        console.log(`SUCCESS: Model ${modelName} is available.`);
        cachedModel = modelName;
        lastCheckTime = Date.now();
        return modelName;
      }
    } catch (err) {
      console.warn(`FAILURE: Model ${modelName} failed. Reason: ${err.message}`);
    }
  }
  
  console.error("CRITICAL: All Gemini models failed check. Using fallback.");
  return cachedModel || "gemini-2.0-flash";
};

// vital signs analysis
export const analyzeVitalSigns = async (vitalData, previousData = null) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("API key not configured");
    }

    const modelName = await getAvailableModel();
    const model = genAI.getGenerativeModel({ model: modelName });
    const prompt = createVitalAnalysisPrompt(vitalData, previousData);

    const result = await callAIWithRetry(() => model.generateContent(prompt));
    const response = await result.response;
    const text = response.text();

    return parseAIResponse(text);

  } catch (error) {
    console.error("Gemini AI analysis failed:", error);
    
    // Sanitize sensitive system/SSL errors
    let userMessage = "AI Service is temporarily unavailable. Please try again in a moment.";
    
    if (error.message.includes("SSL") || error.message.includes("alert number 80")) {
      userMessage = "Secure connection to health engine failed. Please check your network.";
    } else if (error.message.includes("429") || error.message.includes("quota")) {
      userMessage = "Health Engine is currently at capacity. Please try again shortly.";
    } else if (error.message.includes("503") || error.message.includes("busy")) {
      userMessage = "AI Diagnostic Engine is currently busy. Retrying...";
    } else if (error.message.includes("API key")) {
      userMessage = "AI Service Configuration Error. Please contact support.";
    }

    throw new Error(userMessage);
  }
};

// analysis prompt
const createVitalAnalysisPrompt = (vitalData, previousData) => {
  const currentVitals = formatVitalsForAI(vitalData);
  const previousVitals = previousData ? formatVitalsForAI(previousData) : "No previous data available";

  const metricTemplates = {
    bloodPressure: vitalData.bloodPressure ? `
    "bloodPressure": {
      "assessment": "Detailed analysis of ${vitalData.bloodPressure.systolic}/${vitalData.bloodPressure.diastolic} mmHg",
      "risk": "low/medium/high",
      "suggestion": "Specific medical recommendation",
      "normalRange": "Optimal: <120/80 mmHg"
    },` : '',

    bloodSugar: vitalData.bloodSugar ? `
    "bloodSugar": {
      "assessment": "Detailed analysis of ${vitalData.bloodSugar} mg/dL",
      "risk": "low/medium/high",
      "suggestion": "Specific dietary recommendation", 
      "normalRange": "Normal fasting: 70-99 mg/dL"
    },` : '',

    heartRate: vitalData.heartRate ? `
    "heartRate": {
      "assessment": "Detailed analysis of ${vitalData.heartRate} bpm",
      "risk": "low/medium/high",
      "suggestion": "Specific activity recommendation",
      "normalRange": "Normal resting: 60-100 bpm"
    },` : '',

    temperature: vitalData.temperature ? `
    "temperature": {
      "assessment": "Detailed analysis of ${vitalData.temperature}°F",
      "risk": "low/medium/high",
      "suggestion": "Specific health recommendation",
      "normalRange": "Normal: 97.8-99.1°F"
    },` : '',

    weight: vitalData.weight ? `
    "weight": {
      "assessment": "Detailed analysis of ${vitalData.weight} kg",
      "risk": "low/medium/high",
      "suggestion": "Specific weight management recommendation",
      "normalRange": "Healthy BMI: 18.5-24.9"
    }` : ''
  };

  const metricAnalysis = Object.values(metricTemplates)
    .filter(Boolean)
    .join('');

  return `
As an expert medical AI assistant with clinical experience, provide a comprehensive analysis of these vital signs.

**CURRENT VITAL SIGNS:**
${currentVitals}

**PREVIOUS VITAL SIGNS:**
${previousVitals}

**CLINICAL GUIDELINES:**
- Blood Pressure: Optimal <120/80, Elevated 120-129/<80, Stage 1 Hypertension: 130-139/80-89, Stage 2: ≥140/≥90
- Blood Sugar (Fasting): Normal <100 mg/dL, Prediabetes 100-125 mg/dL, Diabetes ≥126 mg/dL  
- Heart Rate (Resting): Normal 60-100 bpm, Bradycardia <60 bpm, Tachycardia >100 bpm
- Body Temperature: Normal 97.8-99.1°F, Fever ≥100.4°F, Hypothermia <95°F
- Weight: Calculate BMI and assess health risks

**ANALYSIS REQUIREMENTS:**
1. Provide evidence-based medical insights
2. Identify potential health risks
3. Suggest appropriate lifestyle modifications
4. Indicate when medical consultation is advised
5. Consider trends from previous data

**RESPONSE FORMAT (JSON ONLY):**
{
  "overallAssessment": {
    "score": 0-100,
    "status": "Excellent/Good/Fair/Needs Attention/Critical",
    "riskLevel": "Very Low/Low/Moderate/High/Very High",
    "summary": "Comprehensive 2-3 sentence health summary",
    "keyFindings": ["3-5 specific clinical observations"],
    "urgency": "Routine/Monitor/Consult/Urgent/Emergency",
    "stability": "low/high/mid-level/normal"
    "confidence": "1-90%"
  },
  "metricAnalysis": {${metricAnalysis}},
  "aiRecommendations": {
    "immediateActions": ["2-3 priority actions"],
    "lifestyleChanges": ["3-4 evidence-based modifications"],
    "medicalConsultation": ["Specific scenarios for doctor visit"],
    "monitoringSuggestions": ["Practical monitoring advice"],
    "dietaryRecommendations": ["3-4 personalized nutrition suggestions"],
    "exerciseRecommendations": ["3-4 tailored physical activity recommendations"],
    "sleepRecommendations": ["2-3 sleep optimization strategies"],
    "stressManagement": ["2-3 stress reduction techniques"]
  },
  "trendInsights": "Detailed trend analysis with clinical context",
  "redFlags": ["Clinically significant warning signs"],
  "positiveIndicators": ["Favorable health markers"],
  "nextSteps": ["2-3 actionable next steps"]
}

**CRITICAL:**
- Base analysis ONLY on provided data
- Provide medically accurate information
- Do not diagnose - suggest when to consult professionals
- Return ONLY valid JSON, no additional text
- Use clinical terminology appropriately
`;
};

//  vital data formatting
const formatVitalsForAI = (vitalData) => {
  const vitals = [];

  if (vitalData.bloodPressure) {
    vitals.push(`Blood Pressure: ${vitalData.bloodPressure.systolic}/${vitalData.bloodPressure.diastolic} mmHg`);
  }
  if (vitalData.bloodSugar) {
    vitals.push(`Blood Sugar: ${vitalData.bloodSugar} mg/dL (Fasting)`);
  }
  if (vitalData.heartRate) {
    vitals.push(`Heart Rate: ${vitalData.heartRate} bpm (Resting)`);
  }
  if (vitalData.temperature) {
    vitals.push(`Temperature: ${vitalData.temperature}°F`);
  }
  if (vitalData.weight) {
    const bmi = (vitalData.weight / (1.7 * 1.7)).toFixed(1);
    vitals.push(`Weight: ${vitalData.weight} kg (Estimated BMI: ${bmi})`);
  }
  if (vitalData.notes) {
    vitals.push(`Clinical Notes: ${vitalData.notes}`);
  }

  vitals.push(`Recorded: ${new Date(vitalData.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`);

  return vitals.join('\n');
};

//  AI response parsing
const parseAIResponse = (text) => {
  try {
    const cleanText = text
      .replace(/```json\s*|\s*```/g, '')
      .replace(/^[^{]*/, '')
      .replace(/[^}]*$/, '')
      .trim();

    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No valid JSON structure found in AI response");
    }

    const data = JSON.parse(jsonMatch[0]);

    // Validate response structure
    if (!data.overallAssessment || typeof data.overallAssessment.score !== 'number') {
      throw new Error("Invalid AI response structure");
    }

    // Ensure all recommendation categories exist
    if (!data.aiRecommendations) {
      data.aiRecommendations = {};
    }

    const requiredRecommendations = [
      'immediateActions',
      'lifestyleChanges',
      'medicalConsultation',
      'monitoringSuggestions',
      'dietaryRecommendations',
      'exerciseRecommendations',
      'sleepRecommendations',
      'stressManagement'
    ];

    requiredRecommendations.forEach(category => {
      if (!data.aiRecommendations[category]) {
        data.aiRecommendations[category] = [];
      }
    });

    // Add metadata
    data.aiMetadata = {
      analyzedAt: new Date().toISOString(),
      model: "Gemini AI",
      disclaimer: "This AI analysis is for informational purposes only. Always consult healthcare professionals for medical advice and diagnosis.",
      version: "2.0"
    };

    return data;

  } catch (error) {
    console.error("Error parsing AI response:", error);
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
};

// fallback analysis
const getFallbackAnalysis = (vitalData) => {
  console.warn("Using fallback/Manual Analysis analysis");

  const manualAnalysis = generateManualAnalysis(vitalData);

  return {
    overallAssessment: {
      score: manualAnalysis.score,
      status: manualAnalysis.status,
      riskLevel: manualAnalysis.riskLevel,
      summary: manualAnalysis.summary,
      keyFindings: manualAnalysis.keyFindings,
      urgency: manualAnalysis.urgency,
      confidence: "Low"
    },
    metricAnalysis: manualAnalysis.metrics,
    aiRecommendations: {
      immediateActions: [
        "Consult healthcare provider for accurate assessment",
        "Monitor vital signs regularly",
        "Maintain health journal"
      ],
      lifestyleChanges: [
        "Follow balanced nutrition plan",
        "Engage in regular physical activity",
        "Ensure adequate sleep and stress management",
        "Stay hydrated and limit processed foods"
      ],
      medicalConsultation: [
        "Schedule comprehensive health check-up",
        "Consult for persistent abnormal values",
        "Discuss preventive health strategies"
      ],
      monitoringSuggestions: [
        "Track vital signs consistently",
        "Note any symptoms or changes",
        "Regular follow-ups with healthcare provider"
      ],
      dietaryRecommendations: [
        "Increase fruit and vegetable intake to 5+ servings daily",
        "Choose whole grains over refined carbohydrates",
        "Include lean protein sources in each meal",
        "Limit added sugars and saturated fats",
        "Stay hydrated with 8-10 glasses of water daily"
      ],
      exerciseRecommendations: [
        "Aim for 150 minutes of moderate aerobic activity weekly",
        "Include strength training 2-3 times per week",
        "Incorporate flexibility exercises daily",
        "Take walking breaks every hour if sedentary",
        "Gradually increase activity intensity over time"
      ],
      sleepRecommendations: [
        "Maintain consistent sleep schedule (7-9 hours nightly)",
        "Create relaxing bedtime routine",
        "Keep bedroom dark, quiet, and cool",
        "Avoid screens 1 hour before bedtime",
        "Limit caffeine intake in the evening"
      ],
      stressManagement: [
        "Practice deep breathing exercises daily",
        "Schedule regular breaks during work",
        "Engage in mindfulness or meditation",
        "Maintain social connections and support",
        "Set realistic goals and priorities"
      ]
    },
    trendInsights: "Comprehensive trend analysis requires AI processing",
    redFlags: manualAnalysis.redFlags,
    positiveIndicators: manualAnalysis.positiveIndicators,
    nextSteps: [
      "Consult medical professional for detailed assessment",
      "Implement suggested lifestyle modifications",
      "Schedule regular health monitoring"
    ],
    aiMetadata: {
      analyzedAt: new Date().toISOString(),
      model: " Manual Analysis",
      disclaimer: "This is an  manual analysis. AI service is currently unavailable. Always consult healthcare professionals for medical advice.",
      version: "2.0"
    }
  };
};

//  manual analysis
const generateManualAnalysis = (vitalData) => {
  let score = 75;
  const keyFindings = [];
  const redFlags = [];
  const positiveIndicators = [];
  const metrics = {};

  // Blood Pressure Analysis
  if (vitalData.bloodPressure) {
    const { systolic, diastolic } = vitalData.bloodPressure;

    if (systolic < 90 || diastolic < 60) {
      metrics.bloodPressure = {
        assessment: `Hypotension detected (${systolic}/${diastolic} mmHg). May indicate underlying conditions.`,
        risk: "medium",
        suggestion: "Increase fluid intake and consult if symptomatic",
        normalRange: "Normal: 90-120/60-80 mmHg"
      };
      keyFindings.push("Low blood pressure (Hypotension)");
      redFlags.push("Blood pressure below normal range");
      score -= 15;
    } else if (systolic <= 120 && diastolic <= 80) {
      metrics.bloodPressure = {
        assessment: `Optimal blood pressure (${systolic}/${diastolic} mmHg). Excellent cardiovascular indicator.`,
        risk: "low",
        suggestion: "Maintain current lifestyle and regular monitoring",
        normalRange: "Normal: 90-120/60-80 mmHg"
      };
      positiveIndicators.push("Ideal blood pressure range");
      score += 10;
    } else if (systolic <= 139 && diastolic <= 89) {
      metrics.bloodPressure = {
        assessment: `Elevated blood pressure (${systolic}/${diastolic} mmHg). Lifestyle modifications recommended.`,
        risk: "medium",
        suggestion: "Reduce sodium, increase activity, manage stress",
        normalRange: "Normal: 90-120/60-80 mmHg"
      };
      keyFindings.push("Elevated blood pressure");
      score -= 5;
    } else {
      metrics.bloodPressure = {
        assessment: `Hypertension range (${systolic}/${diastolic} mmHg). Medical evaluation advised.`,
        risk: "high",
        suggestion: "Consult healthcare provider for management plan",
        normalRange: "Normal: 90-120/60-80 mmHg"
      };
      keyFindings.push("High blood pressure (Hypertension)");
      redFlags.push("Blood pressure in hypertensive range");
      score -= 20;
    }
  }

  // Determine overall status
  let status, riskLevel, urgency;
  if (score >= 85) {
    status = "Excellent";
    riskLevel = "Very Low";
    urgency = "Routine";
  } else if (score >= 75) {
    status = "Good";
    riskLevel = "Low";
    urgency = "Routine";
  } else if (score >= 65) {
    status = "Fair";
    riskLevel = "Moderate";
    urgency = "Monitor";
  } else if (score >= 55) {
    status = "Needs Attention";
    riskLevel = "High";
    urgency = "Consult";
  } else {
    status = "Critical";
    riskLevel = "Very High";
    urgency = "Urgent";
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    status,
    riskLevel,
    urgency,
    summary: `manual analysis indicates ${status.toLowerCase()} health status. ${redFlags.length > 0 ? 'Some parameters require medical attention.' : 'Most parameters are within acceptable ranges.'}`,
    keyFindings: keyFindings.length > 0 ? keyFindings : ["All available parameters within normal ranges"],
    redFlags,
    positiveIndicators: positiveIndicators.length > 0 ? positiveIndicators : ["Stable vital signs observed"],
    metrics
  };
};

// Symptom Checker / Health Assistant
export const analyzeSymptoms = async (query, history = []) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("API key not configured");
    }

    const modelName = await getAvailableModel();
    const model = genAI.getGenerativeModel({ model: modelName });

    // Filter history to ensure it starts with 'user', alternates roles, and ends with 'model'
    const validHistory = [];
    let nextRole = 'user';

    for (const msg of history) {
      const role = msg.role === 'user' ? 'user' : 'model';
      if (role === nextRole) {
        validHistory.push({
          role: role,
          parts: [{ text: msg.content }],
        });
        nextRole = role === 'user' ? 'model' : 'user';
      }
    }

    // If history ends with 'user', pop it because the current query will be sent as the next 'user' message
    if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === 'user') {
      validHistory.pop();
    }

    const chat = model.startChat({
      history: validHistory,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    });

    const prompt = `
You are **HealthBuddy AI**, an advanced, empathetic medical health assistant with expertise in general medicine, nutrition, fitness, mental health, and preventive care.

**YOUR PERSONALITY:**
- Warm, professional, and supportive
- Use clear, patient-friendly language (avoid heavy medical jargon unless explaining)
- Be thorough but concise — use bullet points and structured formatting
- Use bold (**text**) for important terms and numbered lists for steps

**RESPONSE STRUCTURE (follow this for symptom queries):**
1. **Understanding** — Acknowledge the user's concern empathetically
2. **Possible Causes** — List 2-4 potential causes with brief explanations
3. **What You Can Do** — Provide 3-5 actionable home remedies or lifestyle tips
4. **When to See a Doctor** — Clear red flags that need professional attention
5. **Prevention Tips** — 2-3 tips to prevent recurrence

**CRITICAL RULES:**
- NEVER diagnose. Say "this could indicate" instead of "you have"
- For ANY emergency symptoms (chest pain, breathing difficulty, stroke signs, severe bleeding, suicidal thoughts), IMMEDIATELY advise calling emergency services (911/1122/local emergency)
- Always end with: "⚠️ This is general health information. Please consult a healthcare professional for personalized medical advice."
- If the query is about diet, exercise, sleep, or wellness — provide detailed, actionable plans
- If patient profile info is provided, tailor your response to their age, gender, and health context
- Be culturally sensitive and inclusive
- Reference current medical guidelines where appropriate

USER QUERY: ${query}
    `;

    const result = await callAIWithRetry(() => chat.sendMessage(prompt));
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Gemini AI chat failed:", error);
    throw new Error(`AI response failed: ${error.message}`);
  }
};

// API Routes
router.post('/chat-ai', async (req, res) => {
  try {
    const { query, history } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    const response = await analyzeSymptoms(query, history || []);

    res.json({
      success: true,
      response,
      modelUsed: "Gemini AI",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/analyze-vitals', async (req, res) => {
  // ... existing code ...
  try {
    const { vitalData, previousData } = req.body;

    if (!vitalData) {
      return res.status(400).json({
        success: false,
        error: 'Vital data is required'
      });
    }

    // Check API key availability
    if (!process.env.GEMINI_API_KEY) {
      console.warn(' API key not configured, using Manual Analysis analysis');
      const fallbackAnalysis = getFallbackAnalysis(vitalData);
      return res.json({
        success: false,
        analysis: fallbackAnalysis,
        modelUsed: "Fallback",
        timestamp: new Date().toISOString()
      });
    }

    const analysis = await analyzeVitalSigns(vitalData, previousData);

    res.json({
      success: true,
      analysis,
      modelUsed: analysis.aiMetadata?.model || "Gemini AI",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI analysis error:', error);

    const fallbackAnalysis = getFallbackAnalysis(req.body.vitalData);

    res.status(500).json({
      success: false,
      error: error.message,
      analysis: fallbackAnalysis,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'operational',
    service: 'Gemini AI Analysis',
    timestamp: new Date().toISOString(),
    version: '2.0'
  });
});

export default router;