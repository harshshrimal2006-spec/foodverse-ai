# 🌌 FoodVerse AI – Multimodal Food Intelligence Agent

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Multimodal-8E75C4.svg?logo=google&logoColor=white)](https://aistudio.google.com)

**FoodVerse AI** is an advanced, production-grade Multimodal AI Food and Kitchen Intelligence platform powered by Google Gemini. Designed with a Silicon Valley AI SaaS aesthetic, it merges computer vision with precision clinical nutrition, microbial freshness audits, commercial HACCP hygiene monitoring, zero-waste chef recipe creation, and biometric macro meal planning.

---

## ✨ Features & Multimodal Modules

1. **🥗 Nutrition & Macro Matrix (`/api/nutrition`)**
   - Instant visual identification of composite dishes and individual ingredients.
   - Gram portion estimation, calorie counts, complete macro split (Protein, Carbs, Healthy Fats, Fiber).
   - SVG circular Health Score ring (0-100), dietary tags, and clinical nutritional optimization swaps.

2. **🥑 Freshness & Spoilage AI (`/api/freshness`)**
   - High-resolution visual inspection of cellular turgor, surface bruising, and chlorophyll degradation.
   - Spoilage and microbial mycelia detection.
   - Color-coded safety alerts (*Safe to Consume*, *Consume Soon*, *Discard Immediately*) and temperature storage guidance.

3. **🧼 Commercial Kitchen Hygiene Audit (`/api/hygiene`)**
   - Automated HACCP compliance check for commercial kitchens and food prep lines.
   - Evaluation of glove usage, hair nets/caps, stainless surface cleanliness, and cross-contamination vectors.
   - Actionable Corrective Actions (SOP) with severity scoring.

4. **🍳 AI Chef & Zero-Waste Recipe Creator (`/api/cooking-assistant`)**
   - Multimodal pantry & fridge scanning: upload a photo or type available ingredients.
   - Dietary styling (High Protein, Keto, Mediterranean, Vegan, Gluten-Free).
   - Structured recipes with prep times, skill level, ingredient measurements, step-by-step instructions, and Michelin chef secrets.

5. **📅 Biometric Meal Planner (`/api/meal-planner`)**
   - Precision 24-hour nutritional protocols calculated from user age, weight, target calories, and fitness goals.
   - Dynamic macro distribution bar and hydration objectives with electrolytes.
   - Structured meal cards for Breakfast, Lunch, Afternoon Snack, and Dinner Recovery.

---

## 🎨 Silicon Valley SaaS UI/UX Design

- **Deep Obsidian Dark Mode:** `#090D16` primary background with `#111827/80` glassmorphism panels, backdrop blur (`backdrop-blur-xl`), and subtle `border-white/10` borders.
- **Accents:** Emerald Green (`#10B981`) for health/freshness, Electric Violet (`#8B5CF6`) for AI intelligence, Amber (`#F59E0B`) for warnings, Rose Red (`#F43F5E`) for hazards.
- **Laser Scan Animation:** Real-time sweeping neon emerald laser beam and pulsing status indicator over uploaded images during inference.
- **SVG Circular Score Rings:** Dynamic mathematical stroke offsets for 0-100 scores.
- **Model Selector:** Switch on the fly between `gemini-2.5-flash` (Default Multimodal), `gemini-2.5-flash-lite` (Fast Mode), and `gemini-2.5-pro` (Deep Reasoning).
- **Flexible API Key Management:** Enter your Gemini API key in the top navigation bar modal (sent via `X-Gemini-Key` header) or configure it in `backend/.env`.
- **One-Click Demo Samples:** Every module includes a **Load Sample Analysis** button next to the analyze button for instantaneous previewing.

---

## 📁 Repository Structure

```text
foodverse-ai/
  ├── backend/
  │   ├── main.py              # FastAPI application, CORS middleware, 5 API routes
  │   ├── ai_service.py        # Gemini API integration, image PIL decoding, strict JSON schema
  │   ├── requirements.txt     # Python dependencies
  │   ├── .env.example         # Gemini API key template
  │   └── .env                 # Local environment file
  ├── frontend/
  │   ├── package.json         # React 18, Vite, Lucide-React, Tailwind CSS
  │   ├── vite.config.js       # Vite build config with /api reverse proxy to port 8000
  │   ├── tailwind.config.js   # Custom obsidian theme, keyframes & laser-sweep animation
  │   ├── postcss.config.js    # PostCSS plugins
  │   ├── index.html           # HTML5 shell with Google Plus Jakarta Sans fonts
  │   └── src/
  │       ├── main.jsx         # Application entry point
  │       ├── App.jsx          # Root layout, model selector, sidebar navigation
  │       ├── index.css        # Tailwind directives, glassmorphism styles, scrollbars
  │       ├── api/
  │       │   └── foodverseApi.js # Fetch/Axios client, header injection, sample fallbacks
  │       └── components/
  │           ├── Header.jsx           # Obsidian header, model picker, API key modal
  │           ├── Sidebar.jsx          # Module switcher & real-time engine telemetry
  │           ├── ImageDropzone.jsx    # Drag-and-drop, sample presets, laser scan animation
  │           ├── NutritionModule.jsx  # Module 1 dashboard & macro breakdown
  │           ├── FreshnessModule.jsx  # Module 2 freshness & safety audit
  │           ├── HygieneModule.jsx    # Module 3 HACCP kitchen compliance
  │           ├── CookingModule.jsx    # Module 4 AI chef & culinary recipe creator
  │           └── MealPlannerModule.jsx# Module 5 biometric macro & meal planner
  └── README.md
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js** (v18 or higher) and `npm`
- **Python** (v3.10 or higher) and `pip`
- Google Gemini API Key ([Get one for free at Google AI Studio](https://aistudio.google.com/app/apikey))

---

### 2. Backend Setup (FastAPI)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd foodverse-ai/backend
   ```

2. (Recommended) Create and activate a virtual environment:
   - **Windows (PowerShell):**
     ```powershell
     python -m venv .venv
     .venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure your Gemini API Key:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and set your key:
     ```env
     GEMINI_API_KEY=AIzaSyYourActualKeyHere
     PORT=8000
     HOST=0.0.0.0
     ```
   *(Note: You can also leave this blank and supply the API key directly in the web UI header modal)*

5. Start the FastAPI development server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
   Backend will be running at: **`http://localhost:8000`**  
   Interactive Swagger API docs available at: **`http://localhost:8000/docs`**

---

### 3. Frontend Setup (React + Vite)

1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd foodverse-ai/frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Frontend will be running at: **`http://localhost:5173`**

---

## 📡 API Reference

### 1. Nutrition Analysis
- **Route:** `POST /api/nutrition`
- **Headers:** `X-Gemini-Key: <optional_api_key>`
- **Body:** `multipart/form-data` with:
  - `file`: Image file (JPEG, PNG, WEBP)
  - `model_name`: `"gemini-2.5-flash"`
- **Response Format:**
  ```json
  {
    "dish_name": "Grilled Atlantic Salmon Quinoa Power Bowl",
    "detected_items": [
      { "name": "Atlantic Salmon Fillet", "portion": "180g", "calories": 340 }
    ],
    "total_calories": 872,
    "macros": { "protein_g": 52.4, "carbs_g": 58.2, "fats_g": 34.6, "fiber_g": 13.8 },
    "health_score": 96,
    "dietary_tags": ["High Protein", "Rich in Omega-3", "Gluten-Free"],
    "ai_summary": "High nutrient density with exceptional bioavailability...",
    "healthier_alternatives": ["Swap quinoa for riced cauliflower for keto profile."]
  }
  ```

### 2. Freshness & Spoilage
- **Route:** `POST /api/freshness`
- **Body:** `multipart/form-data` with `file` and `model_name`
- **Response Format:**
  ```json
  {
    "food_item": "Hass Avocado",
    "status": "Fresh",
    "freshness_score": 91,
    "visual_indicators": {
      "color_analysis": "Uniform dark emerald-pebbled skin without necrotic spots.",
      "texture_analysis": "Firm cellular turgor.",
      "spoilage_signs": "Stem cavity is bright pale green with zero fungal mycelia."
    },
    "estimated_shelf_life": "3 to 4 days at room temperature",
    "storage_recommendation": "Store at 12°C away from ethylene emitters.",
    "safety_alert": "Safe to Consume"
  }
  ```

### 3. Kitchen Hygiene Audit
- **Route:** `POST /api/hygiene`
- **Body:** `multipart/form-data` with `file` and `model_name`
- **Response Format:**
  ```json
  {
    "overall_hygiene_score": 88,
    "compliance_status": "Compliant",
    "checklist": {
      "glove_usage": { "status": "Pass", "note": "Clean nitrile gloves observed." },
      "hair_cap_compliance": { "status": "Pass", "note": "Head nets deployed." },
      "surface_cleanliness": { "status": "Pass", "note": "Stainless steel sanitized." },
      "food_handling_safety": { "status": "Warning", "note": "Raw poultry board within 0.5m of salad line." }
    },
    "hazards_detected": ["Cross-contact proximity risk."],
    "corrective_actions": ["Deploy color-coded cutting boards."]
  }
  ```

### 4. Cooking Assistant
- **Route:** `POST /api/cooking-assistant`
- **Body:** `multipart/form-data` with `file` (optional), `ingredients_text`, `dietary_pref`, `model_name`
- **Response Format:**
  ```json
  {
    "recipe_name": "Tuscan Garlic Herb Pan-Seared Chicken",
    "prep_time": "20 mins",
    "difficulty": "Easy",
    "calories_per_serving": 420,
    "ingredients_used": [{ "item": "Chicken Breast", "amount": "2 fillets (450g)" }],
    "missing_essentials": ["White wine for deglazing"],
    "step_by_step_instructions": ["Pat chicken dry...", "Sear in hot skillet..."],
    "chef_pro_tips": ["Rest 5 mins before slicing to retain moisture."]
  }
  ```

### 5. Biometric Meal Planner
- **Route:** `POST /api/meal-planner`
- **Body:** `application/json`
  ```json
  {
    "age": 28,
    "weight": 74,
    "goal": "Muscle Gain & Hypertrophy",
    "diet_type": "High Protein",
    "allergies": "None",
    "calories_target": 2350,
    "model_name": "gemini-2.5-flash"
  }
  ```
- **Response Format:**
  ```json
  {
    "daily_calorie_target": 2350,
    "macro_split": { "protein_pct": 35, "carbs_pct": 40, "fats_pct": 25 },
    "meals": {
      "breakfast": { "dish": "Egg White Scramble", "calories": 520, "protein": "42g", "benefit": "High leucine" },
      "lunch": { "dish": "Citrus Chicken & Rice", "calories": 680, "protein": "58g", "benefit": "Glycogen replenishment" },
      "snack": { "dish": "Whey Shake & Almonds", "calories": 340, "protein": "32g", "benefit": "Antioxidant recovery" },
      "dinner": { "dish": "Sockeye Salmon & Greens", "calories": 810, "protein": "54g", "benefit": "Omega-3 restorative" }
    },
    "hydration_goal": "3.4 Liters with electrolytes",
    "personalized_advice": "Focus carb intake around your training window."
  }
  ```

---

## 🔒 Security & Privacy

- Images uploaded for analysis are processed directly in-memory via Python `BytesIO` streams and are never stored to persistent disk.
- API keys provided in the frontend UI are held in client-side `localStorage` and sent over HTTPS/HTTP directly to the backend with zero external logging.
