#  HealthBuddy: AI-Powered Clinical Command Center

**HealthBuddy** is a premium, VIP-grade health monitoring platform designed to transform how individuals and families manage their medical data. By leveraging **Gemini AI**, HealthBuddy provides real-time diagnostic interpretation, vitals tracking, and a secure health archive within a stunning "Emerald" design system.

---

##  Key Features

### AI Diagnostic Engine 
- **Medical Report Analysis:** Upload PDFs or images of lab reports and get instant, easy-to-understand explanations of your findings.
- **Symptom Checker:** Chat with an empathetic AI assistant for immediate health guidance and wellness tips.
- **Smart Priority Logic:** Automatically detects "Critical," "Abnormal," or "Stable" results using clinical-grade analysis.

### Real-Time Vitals Monitoring
- **Track Core Metrics:** Log and visualize Pulse (BPM), Blood Pressure, Blood Sugar, Temperature, and Weight.
- **Health Scoring:** Get a mathematical health score (0-100) based on real-time vital trends.
- **Progress Tracking:** Dynamic "Needs Data" indicators ensure your health tracking pillars are always up to date.

###  Family Health Management
- **Multi-Member Support:** Create and manage separate profiles for your children, spouse, or elderly parents.
- **Data Isolation:** Securely switch between family members while maintaining strict privacy for each profile.

###  My Health Archive (Timeline)
- **Unified History:** A beautiful, chronologically organized timeline of every medical event, scan, and vital check.
- **Search & Filter:** Instantly find historical reports or vitals logs with advanced clinical filtering.

---

##  Tech Stack

**Frontend:**
- **React.js** (Vite)
- **Tailwind CSS** (Custom Emerald/VIP Theme)
- **Framer Motion** (Premium animations)
- **Lucide React** (Clinical Iconography)

**Backend:**
- **Node.js & Express** (Modular MVC Architecture)
- **MongoDB** (Secure Data Storage)
- **Cloudinary** (Encrypted Medical Document Storage)
- **Gemini AI SDK** (Medical Interpretation)

---

##  Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Google AI (Gemini) API Key
- Cloudinary Account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/HealthBuddy-App.git
   cd HealthBuddy-App
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file with:
   # MONGO_URI, GEMINI_API_KEY, CLOUDINARY_URL, JWT_SECRET
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

##  Design Philosophy
HealthBuddy follows a **"VIP Emerald"** design language, emphasizing:
- **Glassmorphism:** Elegant transparency and blur effects.
- **High-Contrast Data:** Important clinical alerts use bold, unambiguous status colors.
- **Responsive Fluidity:** A seamless experience across desktop, tablet, and mobile clinical command centers.

---

##  Disclaimer
*This application is for informational purposes only. The AI analysis provided is not a medical diagnosis. Always consult a qualified healthcare professional before making medical decisions.*

---

**Developed with ❤️ by Mudasir**
