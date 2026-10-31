# FoodVerse AI

![React](https://img.shields.io/badge/Frontend-React_18_%7C_Vite_%7C_Tailwind-06B6D4?style=flat-square)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI_%7C_Python_3.10+-009688?style=flat-square)
![Gemini](https://img.shields.io/badge/AI-Google_Gemini_API-8E75B2?style=flat-square)

FoodVerse AI is a full-stack multimodal web application that uses computer vision and LLMs to analyze food nutrition, inspect produce freshness, audit kitchen hygiene, generate recipes from leftover ingredients, and create personalized meal plans.

### 🔗 Quick Links
- **Live Application:** [Add Vercel Link Here]
- **Backend Swagger Docs:** [Add Render Link Here]/docs

> **💡 Instant Demo Mode (Zero Setup Required):** Every module features a **"Load Sample Analysis"** button, allowing reviewers to test the UI, data visualizations, and response structure immediately without uploading photos or entering an API key.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React
- **Backend:** Python, FastAPI, Uvicorn, Pillow (PIL), Pydantic, python-dotenv
- **AI Models:** Google Gemini (`gemini-3.5-flash-lite` for fast inference, `gemini-3.8-flash` for detailed multimodal analysis)

---

## 🚀 Core Modules & API Endpoints

| Module | Endpoint | Input | What It Does |
| :--- | :--- | :--- | :--- |
| **Nutrition & Macro Matrix** | `POST /api/nutrition` | Food Image | Identifies dishes, estimates portion weights (g), total calories, macros (P/C/F/Fiber), and health score (0–100). |
| **Freshness Inspector** | `POST /api/freshness` | Produce Image | Detects visual spoilage signs, assigns a freshness score, estimates shelf life, and suggests storage temps. |
| **Kitchen Hygiene Audit** | `POST /api/hygiene` | Kitchen Image | Audits prep surfaces, glove usage, hairnet compliance, and cross-contamination risks with corrective actions. |
| **Zero-Waste AI Chef** | `POST /api/cooking-assistant` | Fridge Photo / Text | Generates step-by-step recipes with prep time and calories based on available items and dietary filters. |
| **Biometric Meal Planner** | `POST /api/meal-planner` | User Metrics (JSON) | Calculates a 24-hour meal schedule (Breakfast to Dinner), macro split, and hydration goal from body metrics. |

---

## ⚡ Key Engineering Highlights

- **In-Memory Image Pipeline:** Uploaded images are decoded directly in RAM via `io.BytesIO` and `PIL.Image` without saving files to disk, ensuring fast processing and user privacy.
- **Strict JSON Schema Enforcement:** Backend prompts enforce structured JSON outputs with fallback handling so frontend dashboard components render reliably.
- **Dynamic Model & Key Routing:** Users can switch Gemini models on the fly and optionally pass a custom API key via the `X-Gemini-Key` request header without modifying `.env`.

---

## 🗺️ Project Roadmap

- **Stage 1 — Core Multimodal Engine (Completed):** Built the 5 AI inspection modules, FastAPI backend (`gemini-3.5-flash-lite` & `gemini-3.8-flash`), dark-mode React dashboard, and 1-click sample fallbacks.
- **Stage 2 — Cloud Deployment & Polish (In Progress):** Deploying backend on Render and frontend on Vercel, configuring CORS policies, and optimizing mobile responsiveness.
- **Stage 3 — Persistence & Export (Future Scope):** Adding user authentication, PostgreSQL database integration to track historical calorie intake, and PDF export for meal plans.

---

## 📁 Folder Structure

```text
foodverse-ai/
├── backend/
│   ├── main.py              # FastAPI app, CORS & route handlers
│   ├── ai_service.py        # Gemini API logic & JSON validation
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variable template
├── frontend/
│   ├── src/
│   │   ├── api/             # API client & sample preset data
│   │   ├── components/      # Module views & shared UI components
│   │   ├── App.jsx          # Main layout & navigation state
│   │   └── main.jsx         # React entry point
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## ⚙️ Local Setup (Quickstart)

**1. Clone the repository**
```bash
git clone [https://github.com/harshshrimal2006-spec/foodverse-ai.git](https://github.com/harshshrimal2006-spec/foodverse-ai.git)
cd foodverse-ai
```

**2. Run the Backend (`http://localhost:8000`)**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # Add your GEMINI_API_KEY inside .env
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**3. Run the Frontend (`http://localhost:5173`)**
```bash
cd frontend
npm install
npm run dev
```

---

## 👤 Author

**Harsh Shrimal**  
- GitHub: [@harshshrimal2006-spec](https://github.com/harshshrimal2006-spec)
