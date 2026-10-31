import io
import json
import os
import re
import warnings
from typing import Optional, Dict, Any
from PIL import Image
from dotenv import load_dotenv

# Suppress transitional warning for google.generativeai
warnings.filterwarnings("ignore", category=FutureWarning)

import google.generativeai as genai
from fastapi import HTTPException

load_dotenv()

# Fallback model mapping in case requested model has aliases
MODEL_MAPPING = {
    "gemini-2.5-flash": "gemini-3.8-flash",
    "gemini-2.5-flash-lite": "gemini-3.5-flash-lite",
    # "gemini-2.5-pro": "gemini-3.1-pro-preview",
    "gemini-2.0-flash": "gemini-3.8-flash",
    "gemini-1.5-flash": "gemini-3.8-flash",
    # "gemini-1.5-pro": "gemini-3.1-pro-preview",

    "gemini-3.5-flash-lite": "gemini-3.5-flash-lite",
    "gemini-3.8-flash": "gemini-3.8-flash",
    # "gemini-3.1-pro-preview": "gemini-3.1-pro-preview",
}

def resolve_api_key(custom_key: Optional[str] = None) -> str:
    """Resolve API key from request header or environment variable."""
    key = (custom_key or "").strip()
    if not key:
        key = (os.getenv("GEMINI_API_KEY") or "").strip()
    
    if not key or key == "your_gemini_api_key_here":
        raise HTTPException(
            status_code=401,
            detail=(
                "Gemini API key is required. Please set GEMINI_API_KEY in backend/.env "
                "or enter it directly via the API Key button in the dashboard top navigation bar."
            )
        )
    return key

def clean_and_parse_json(raw_text: str) -> Dict[str, Any]:
    """Extract and parse valid JSON from Gemini output, handling code fences or stray text."""
    if not raw_text:
        raise ValueError("Empty response received from AI model.")

    cleaned = raw_text.strip()
    # Remove markdown code fence if present
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
    cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Attempt to locate the first '{' and last '}'
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1 and end > start:
            substring = cleaned[start:end+1]
            try:
                return json.loads(substring)
            except json.JSONDecodeError:
                pass
        raise HTTPException(
            status_code=502,
            detail=f"Failed to parse valid JSON from AI response: {raw_text[:200]}..."
        )

def get_configured_model(model_name: str, api_key: str):
    """Configure genai with API key and return GenerativeModel instance (Default to Flash-Lite for speed)."""
    genai.configure(api_key=api_key)
    # Default fallback ko fast 'gemini-3.5-flash-lite' par set kiya hai taaki speed 3-4s rahe
    target_model = MODEL_MAPPING.get(model_name, model_name or "gemini-3.5-flash-lite")
    
    generation_config = {
        "response_mime_type": "application/json",
        "temperature": 0.3,
    }
    
    try:
        return genai.GenerativeModel(
            model_name=target_model,
            generation_config=generation_config
        )
    except Exception as e:
        # Fallback agar error aaye toh super fast Flash-Lite use karega
        return genai.GenerativeModel(
            model_name="gemini-3.5-flash-lite",
            generation_config=generation_config
        )

# ==========================================
# MODULE 1: NUTRITION ANALYSIS
# ==========================================
async def analyze_nutrition(
    image_bytes: bytes,
    model_name: str = "gemini-3.5-flash-lite",
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    key = resolve_api_key(api_key)
    model = get_configured_model(model_name, key)

    try:
        pil_image = Image.open(io.BytesIO(image_bytes))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")

    prompt = """
You are an expert Clinical Dietitian and Multimodal AI Food Analyst.
Carefully examine the provided food image. Identify all visible ingredients, estimate portions, calculate calories and macronutrients, and produce an evidence-based dietary summary.

You MUST respond strictly with a valid JSON object matching this exact schema:
{
  "dish_name": "string (name of the identified dish)",
  "detected_items": [
    {
      "name": "string (name of specific food item)",
      "portion": "string (e.g. 150g, 1 cup, 2 slices)",
      "calories": number (estimated kcal)
    }
  ],
  "total_calories": number (sum of estimated calories),
  "macros": {
    "protein_g": number (grams of protein),
    "carbs_g": number (grams of carbohydrates),
    "fats_g": number (grams of fats),
    "fiber_g": number (grams of dietary fiber)
  },
  "health_score": number (integer between 0 and 100 representing nutritional quality),
  "dietary_tags": ["string", "string"], (e.g. ["High Protein", "Rich in Fiber", "Low Glycemic", "Heart Healthy"]),
  "ai_summary": "string (2-3 concise sentences detailing overall nutritional density, macronutrient balance, and metabolic impact)",
  "healthier_alternatives": [
    "string (specific actionable tweak to boost nutrition or lower empty calories)",
    "string (another actionable swap)"
  ]
}

Ensure all numerical values are realistic and reasonable. Output ONLY raw JSON.
"""

    try:
        response = model.generate_content([prompt, pil_image])
        return clean_and_parse_json(response.text)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Nutrition Analysis failed: {str(e)}")

# ==========================================
# MODULE 2: FRESHNESS & SPOILAGE DETECTION
# ==========================================
async def analyze_freshness(
    image_bytes: bytes,
    model_name: str = "gemini-3.5-flash-lite",
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    key = resolve_api_key(api_key)
    model = get_configured_model(model_name, key)

    try:
        pil_image = Image.open(io.BytesIO(image_bytes))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")

    prompt = """
You are a Senior Post-Harvest Food Scientist and Spoilage Inspector.
Analyze the visual textures, discoloration, bruising, cellular turgor, mold mycelia, and oxidation signs in the provided food image.

You MUST respond strictly with a valid JSON object matching this exact schema:
{
  "food_item": "string (name and variety of the food/produce)",
  "status": "string (EXACTLY one of: 'Fresh', 'Moderately Fresh', 'Spoiled')",
  "freshness_score": number (integer between 0 and 100),
  "visual_indicators": {
    "color_analysis": "string (detailed observation of pigment degradation, browning, or natural coloration)",
    "texture_analysis": "string (assessment of surface firmness, shriveling, wilting, or moisture loss)",
    "spoilage_signs": "string (specific evidence or absence of molds, rot, weeping, or microbial colonies)"
  },
  "estimated_shelf_life": "string (e.g., '3 - 5 days refrigerated', '24 - 48 hours at room temp')",
  "storage_recommendation": "string (optimal temperature, humidity, and airflow guidelines)",
  "safety_alert": "string (EXACTLY one of: 'Safe to Consume', 'Consume Soon', 'Discard Immediately')"
}

Ensure critical food safety evaluation. Output ONLY raw JSON.
"""

    try:
        response = model.generate_content([prompt, pil_image])
        return clean_and_parse_json(response.text)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Freshness Detection failed: {str(e)}")

# ==========================================
# MODULE 3: KITCHEN HYGIENE AUDIT
# ==========================================
async def analyze_hygiene(
    image_bytes: bytes,
    model_name: str = "gemini-3.5-flash-lite",
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    key = resolve_api_key(api_key)
    model = get_configured_model(model_name, key)

    try:
        pil_image = Image.open(io.BytesIO(image_bytes))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")

    prompt = """
You are a Certified HACCP Food Safety Inspector and Commercial Kitchen Auditor.
Audit the provided kitchen, prep station, or food handler image for sanitary compliance, contamination hazards, personal protective gear (PPE), and hygiene protocols.

You MUST respond strictly with a valid JSON object matching this exact schema:
{
  "overall_hygiene_score": number (integer between 0 and 100),
  "compliance_status": "string (EXACTLY one of: 'Compliant', 'Needs Improvement', 'Critical Alert')",
  "checklist": {
    "glove_usage": {
      "status": "string (Pass, Warning, or Fail)",
      "note": "string (specific evidence observed regarding food handler glove wear or lack thereof)"
    },
    "hair_cap_compliance": {
      "status": "string (Pass, Warning, or Fail)",
      "note": "string (assessment of hair restraints/caps/beard nets)"
    },
    "surface_cleanliness": {
      "status": "string (Pass, Warning, or Fail)",
      "note": "string (evaluation of countertops, cutting boards, grime, sanitize status)"
    },
    "food_handling_safety": {
      "status": "string (Pass, Warning, or Fail)",
      "note": "string (evaluation of cross-contamination risks, temperature control, storage separation)"
    }
  },
  "hazards_detected": [
    "string (hazard 1)",
    "string (hazard 2)"
  ],
  "corrective_actions": [
    "string (immediate standard operating procedure recommendation 1)",
    "string (corrective action 2)"
  ]
}

Output ONLY raw JSON.
"""

    try:
        response = model.generate_content([prompt, pil_image])
        return clean_and_parse_json(response.text)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Kitchen Hygiene Audit failed: {str(e)}")

# ==========================================
# MODULE 4: COOKING ASSISTANT
# ==========================================
async def generate_cooking_recipe(
    image_bytes: Optional[bytes] = None,
    ingredients_text: Optional[str] = None,
    dietary_pref: Optional[str] = None,
    model_name: str = "gemini-3.5-flash-lite",
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    key = resolve_api_key(api_key)
    model = get_configured_model(model_name, key)

    content_parts = []
    
    prompt = f"""
You are a Michelin-star Executive Chef and Culinary AI Assistant.
Create an inventive, restaurant-quality recipe based on the provided ingredients (from image and/or text) and dietary preference.

Dietary Preference requested: {dietary_pref or 'None specified'}
Provided text ingredients: {ingredients_text or 'None specified, check visual input if available'}

You MUST respond strictly with a valid JSON object matching this exact schema:
{{
  "recipe_name": "string (inspiring culinary title)",
  "prep_time": "string (e.g. '25 mins')",
  "difficulty": "string (Easy, Intermediate, or Advanced)",
  "calories_per_serving": number (integer kcal per portion),
  "ingredients_used": [
    {{
      "item": "string (name of ingredient)",
      "amount": "string (exact culinary measurement, e.g. '200g', '2 cloves')"
    }}
  ],
  "missing_essentials": [
    "string (pantry staples or flavor elevators recommended, e.g. 'Fresh coarse sea salt', 'Dry white wine')"
  ],
  "step_by_step_instructions": [
    "string (Step 1 detailed instructions)",
    "string (Step 2 detailed instructions)",
    "string (Step 3 detailed instructions)",
    "string (Step 4 detailed instructions)"
  ],
  "chef_pro_tips": [
    "string (pro secret tip on searing/seasoning/temperature)",
    "string (presentation or flavor pairing tip)"
  ]
}}

Output ONLY raw JSON.
"""
    content_parts.append(prompt)

    if image_bytes:
        try:
            pil_image = Image.open(io.BytesIO(image_bytes))
            content_parts.append(pil_image)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")

    if not image_bytes and not (ingredients_text or "").strip():
        raise HTTPException(
            status_code=400,
            detail="Please provide either an image of your ingredients or specify them in text format."
        )

    try:
        response = model.generate_content(content_parts)
        return clean_and_parse_json(response.text)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Cooking Assistant failed: {str(e)}")

# ==========================================
# MODULE 5: MULTI-MODAL MEAL PLANNER
# ==========================================
async def generate_meal_plan(
    user_data: Dict[str, Any],
    model_name: str = "gemini-3.5-flash-lite",
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    key = resolve_api_key(api_key)
    model = get_configured_model(model_name, key)

    age = user_data.get("age", 28)
    weight = user_data.get("weight", 70.0)
    goal = user_data.get("goal", "Muscle Gain")
    diet_type = user_data.get("diet_type", "High Protein")
    allergies = user_data.get("allergies", "None")
    calories_target = user_data.get("calories_target", 2200)

    prompt = f"""
You are an Elite Sports Nutritionist and Precision Diet Planner.
Design an optimal 1-day personalized nutritional protocol based on this biometric profile:
- Age: {age} years
- Weight: {weight} kg
- Fitness Goal: {goal}
- Diet Preference: {diet_type}
- Allergies / Intolerances: {allergies}
- Target Daily Calories: {calories_target} kcal

You MUST respond strictly with a valid JSON object matching this exact schema:
{{
  "daily_calorie_target": number (integer around {calories_target}),
  "macro_split": {{
    "protein_pct": number (percentage of total calories, e.g. 35),
    "carbs_pct": number (percentage of total calories, e.g. 40),
    "fats_pct": number (percentage of total calories, e.g. 25)
  }},
  "meals": {{
    "breakfast": {{
      "dish": "string (dish title)",
      "calories": number (approx kcal),
      "protein": "string (e.g. '35g')",
      "benefit": "string (physiological mechanism/benefit)"
    }},
    "lunch": {{
      "dish": "string (dish title)",
      "calories": number (approx kcal),
      "protein": "string (e.g. '48g')",
      "benefit": "string (physiological mechanism/benefit)"
    }},
    "snack": {{
      "dish": "string (dish title)",
      "calories": number (approx kcal),
      "protein": "string (e.g. '22g')",
      "benefit": "string (physiological mechanism/benefit)"
    }},
    "dinner": {{
      "dish": "string (dish title)",
      "calories": number (approx kcal),
      "protein": "string (e.g. '45g')",
      "benefit": "string (physiological mechanism/benefit)"
    }}
  }},
  "hydration_goal": "string (e.g. '3.2 Liters (14 glasses) with key electrolytes')",
  "personalized_advice": "string (2-3 sentences of tailored coaching advice to maximize results)"
}}

Ensure protein_pct + carbs_pct + fats_pct sum to 100. Output ONLY raw JSON.
"""

    try:
        response = model.generate_content([prompt])
        return clean_and_parse_json(response.text)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Meal Planner failed: {str(e)}")
