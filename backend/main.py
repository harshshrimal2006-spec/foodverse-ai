import os
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn
from dotenv import load_dotenv

import ai_service

load_dotenv()

app = FastAPI(
    title="FoodVerse AI – Multimodal Food Intelligence Backend",
    description="Production-grade AI backend powered by Google Gemini for food nutrition, freshness inspection, kitchen hygiene, culinary recipe creation, and meal planning.",
    version="1.0.0"
)

# Enable CORS for all origins so frontend on port 5173 can communicate seamlessly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic schema for Meal Planner request
class MealPlannerRequest(BaseModel):
    age: int = Field(default=28, ge=10, le=120, description="Age in years")
    weight: float = Field(default=70.0, ge=20.0, le=300.0, description="Weight in kg")
    goal: str = Field(default="Muscle Gain", description="Fitness goal")
    diet_type: str = Field(default="High Protein", description="Dietary strategy")
    allergies: str = Field(default="None", description="Allergies or dietary restrictions")
    calories_target: int = Field(default=2200, ge=800, le=6000, description="Target daily calories")
    model_name: Optional[str] = Field(default="gemini-3.5-flash-lite", description="Gemini model to use")


@app.get("/")
def root():
    return {
        "service": "FoodVerse AI Multimodal Backend",
        "status": "Online",
        "version": "1.0.0",
        "docs_url": "/docs",
        "supported_models": [
            "gemini-3.5-flash-lite",
            "gemini-3.8-flash",
        ]
    }


@app.get("/api/health")
def health_check():
    has_env_key = bool(os.getenv("GEMINI_API_KEY") and os.getenv("GEMINI_API_KEY") != "your_gemini_api_key_here")
    return {
        "status": "healthy",
        "engine": "Multimodal Gemini Online",
        "has_server_api_key": has_env_key
    }


# ==========================================
# MODULE 1: NUTRITION ANALYSIS
# ==========================================
@app.post("/api/nutrition")
async def analyze_nutrition_endpoint(
    file: UploadFile = File(..., description="Food image file"),
    model_name: str = Form("gemini-3.5-flash-lite"),
    x_gemini_key: Optional[str] = Header(None, alias="X-Gemini-Key")
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be a valid image (JPEG, PNG, WEBP, etc.)."
        )
    image_bytes = await file.read()
    return await ai_service.analyze_nutrition(
        image_bytes=image_bytes,
        model_name=model_name,
        api_key=x_gemini_key
    )


# ==========================================
# MODULE 2: FRESHNESS & SPOILAGE DETECTION
# ==========================================
@app.post("/api/freshness")
async def analyze_freshness_endpoint(
    file: UploadFile = File(..., description="Food/produce image file"),
    model_name: str = Form("gemini-3.5-flash-lite"),
    x_gemini_key: Optional[str] = Header(None, alias="X-Gemini-Key")
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be a valid image."
        )
    image_bytes = await file.read()
    return await ai_service.analyze_freshness(
        image_bytes=image_bytes,
        model_name=model_name,
        api_key=x_gemini_key
    )


# ==========================================
# MODULE 3: KITCHEN HYGIENE AUDIT
# ==========================================
@app.post("/api/hygiene")
async def analyze_hygiene_endpoint(
    file: UploadFile = File(..., description="Kitchen or food prep area image file"),
    model_name: str = Form("gemini-3.5-flash-lite"),
    x_gemini_key: Optional[str] = Header(None, alias="X-Gemini-Key")
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be a valid image."
        )
    image_bytes = await file.read()
    return await ai_service.analyze_hygiene(
        image_bytes=image_bytes,
        model_name=model_name,
        api_key=x_gemini_key
    )


# ==========================================
# MODULE 4: COOKING ASSISTANT
# ==========================================
@app.post("/api/cooking-assistant")
async def cooking_assistant_endpoint(
    file: Optional[UploadFile] = File(None, description="Optional image of pantry / fridge ingredients"),
    ingredients_text: Optional[str] = Form("", description="Text list of available ingredients"),
    dietary_pref: Optional[str] = Form("None", description="Dietary restrictions or preferences"),
    model_name: str = Form("gemini-3.5-flash-lite"),
    x_gemini_key: Optional[str] = Header(None, alias="X-Gemini-Key")
):
    image_bytes = None
    if file:
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded ingredient file must be an image."
            )
        image_bytes = await file.read()

    return await ai_service.generate_cooking_recipe(
        image_bytes=image_bytes,
        ingredients_text=ingredients_text,
        dietary_pref=dietary_pref,
        model_name=model_name,
        api_key=x_gemini_key
    )


# ==========================================
# MODULE 5: MEAL PLANNER
# ==========================================
@app.post("/api/meal-planner")
async def meal_planner_endpoint(
    payload: MealPlannerRequest,
    x_gemini_key: Optional[str] = Header(None, alias="X-Gemini-Key")
):
    return await ai_service.generate_meal_plan(
        user_data=payload.model_dump(),
        model_name=payload.model_name or "gemini-3.5-flash-lite",
        api_key=x_gemini_key
    )


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    print(f"Starting FoodVerse AI Backend on http://{host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=True)
