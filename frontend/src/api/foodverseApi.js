// FoodVerse AI - API Integration and Sample Mock Fallbacks

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Retrieve saved Gemini API key from localStorage
 */
export function getSavedApiKey() {
  return localStorage.getItem('foodverse_gemini_key') || '';
}

/**
 * Save Gemini API key to localStorage
 */
export function saveApiKey(key) {
  if (key) {
    localStorage.setItem('foodverse_gemini_key', key.trim());
  } else {
    localStorage.removeItem('foodverse_gemini_key');
  }
}

/**
 * Helper to build headers with optional X-Gemini-Key
 */
function buildHeaders(customApiKey = null, isJson = false) {
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  const key = customApiKey || getSavedApiKey();
  if (key) {
    headers['X-Gemini-Key'] = key;
  }
  return headers;
}

/**
 * Backend health check
 */
export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, { method: 'GET' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}

/**
 * MODULE 1: Nutrition Analysis
 */
export async function analyzeNutritionApi(file, modelName = 'gemini-2.5-flash', customKey = null) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('model_name', modelName);

  const res = await fetch(`${API_BASE_URL}/api/nutrition`, {
    method: 'POST',
    headers: buildHeaders(customKey),
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Analysis failed' }));
    throw new Error(errorData.detail || `Server error: ${res.status}`);
  }

  return await res.json();
}

/**
 * MODULE 2: Freshness Inspection
 */
export async function analyzeFreshnessApi(file, modelName = 'gemini-2.5-flash', customKey = null) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('model_name', modelName);

  const res = await fetch(`${API_BASE_URL}/api/freshness`, {
    method: 'POST',
    headers: buildHeaders(customKey),
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Freshness analysis failed' }));
    throw new Error(errorData.detail || `Server error: ${res.status}`);
  }

  return await res.json();
}

/**
 * MODULE 3: Kitchen Hygiene Audit
 */
export async function analyzeHygieneApi(file, modelName = 'gemini-2.5-flash', customKey = null) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('model_name', modelName);

  const res = await fetch(`${API_BASE_URL}/api/hygiene`, {
    method: 'POST',
    headers: buildHeaders(customKey),
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Hygiene audit failed' }));
    throw new Error(errorData.detail || `Server error: ${res.status}`);
  }

  return await res.json();
}

/**
 * MODULE 4: Cooking Assistant & Recipe Creator
 */
export async function generateRecipeApi({ file, ingredientsText, dietaryPref, modelName }, customKey = null) {
  const formData = new FormData();
  if (file) formData.append('file', file);
  if (ingredientsText) formData.append('ingredients_text', ingredientsText);
  if (dietaryPref) formData.append('dietary_pref', dietaryPref);
  formData.append('model_name', modelName || 'gemini-2.5-flash');

  const res = await fetch(`${API_BASE_URL}/api/cooking-assistant`, {
    method: 'POST',
    headers: buildHeaders(customKey),
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Recipe generation failed' }));
    throw new Error(errorData.detail || `Server error: ${res.status}`);
  }

  return await res.json();
}

/**
 * MODULE 5: Biometric Meal Planner
 */
export async function generateMealPlanApi(payload, customKey = null) {
  const res = await fetch(`${API_BASE_URL}/api/meal-planner`, {
    method: 'POST',
    headers: buildHeaders(customKey, true),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Meal planner failed' }));
    throw new Error(errorData.detail || `Server error: ${res.status}`);
  }

  return await res.json();
}

// ==========================================
// REALISTIC SAMPLE DEMO DATA FOR EACH MODULE
// ==========================================

export const SAMPLE_NUTRITION = {
  dish_name: "Grilled Atlantic Salmon Quinoa Power Bowl",
  detected_items: [
    { name: "Grilled Wild Atlantic Salmon Fillet", portion: "180g", calories: 340 },
    { name: "Tri-Color Organic Quinoa", portion: "1 cup (185g)", calories: 222 },
    { name: "Hass Avocado Slices", portion: "1/2 fruit (80g)", calories: 130 },
    { name: "Steamed Florets of Broccoli & Edamame", portion: "1.5 cups (150g)", calories: 85 },
    { name: "Lemon Tahini Herb Emulsion", portion: "1.5 tbsp", calories: 95 }
  ],
  total_calories: 872,
  macros: {
    protein_g: 52.4,
    carbs_g: 58.2,
    fats_g: 34.6,
    fiber_g: 13.8
  },
  health_score: 96,
  dietary_tags: ["High Protein", "Rich in Omega-3 EPA/DHA", "Prebiotic Fiber", "Gluten-Free", "Low Glycemic Index"],
  ai_summary: "Exemplary gold-standard nutrient profile. High concentration of long-chain omega-3 fatty acids for cardiovascular elasticity paired with 52g of complete branched-chain amino acids (BCAAs) and steady complex carbohydrates.",
  healthier_alternatives: [
    "Swap quinoa for riced cauliflower to lower total carbohydrate load by 45g for strict ketogenic protocols.",
    "Replace tahini dressing with fresh squeezed lemon juice and 1 tsp cold-pressed olive oil to trim 50 kcal of dense fats."
  ]
};

export const SAMPLE_FRESHNESS = {
  food_item: "Fresh Prime Hass Avocado (Persea americana)",
  status: "Fresh",
  freshness_score: 91,
  visual_indicators: {
    color_analysis: "Uniform dark emerald-pebbled skin without deep necrotic black circular depressions or premature skin wrinkling.",
    texture_analysis: "Epidermal firmness test reveals optimal cellular turgor; yielding subtly to calibrated pressure without squishing.",
    spoilage_signs: "Stem abscission zone presents pristine light lime green color with absolute absence of gray mold (Botrytis cinerea) or white mycelial strands."
  },
  estimated_shelf_life: "3 to 4 days at cool room temperature (up to 8 days in crisper at 4°C)",
  storage_recommendation: "Store uncovered at 12°C away from high-ethylene emitters like overripe bananas. Transfer immediately to cold refrigeration once flesh yields smoothly.",
  safety_alert: "Safe to Consume"
};

export const SAMPLE_HYGIENE = {
  overall_hygiene_score: 88,
  compliance_status: "Compliant",
  checklist: {
    glove_usage: {
      status: "Pass",
      note: "All active prep line cooks observed wearing food-grade blue nitrile gloves with no secondary touch contamination seen."
    },
    hair_cap_compliance: {
      status: "Pass",
      note: "Full head containment hair nets and sanitary beard guards deployed across the entire stainless workstation."
    },
    surface_cleanliness: {
      status: "Pass",
      note: "High-grade 304 stainless steel prep surface is sanitized, polished, and free of food debris or organic film."
    },
    food_handling_safety: {
      status: "Warning",
      note: "Raw protein prep board is within 0.5 meters of cold mise en place garnishes without a transparent sneeze guard barrier."
    }
  },
  hazards_detected: [
    "Minor cross-proximity risk between raw poultry slicing board and ready-to-eat salad assembly counter.",
    "Ambient counter surface temperature reads 18°C; perishables should not dwell beyond 20 minutes without ice wells."
  ],
  corrective_actions: [
    "Deploy color-coded cutting boards (Red: Raw Meat, Green: Produce) and maintain 1.5m spatial separation.",
    "Wipe down station with EPA-registered quaternary sanitizer spray before next service ticket.",
    "Verify cold station temp log displays sub-4°C holding conditions."
  ]
};

export const SAMPLE_COOKING = {
  recipe_name: "Tuscan Garlic Herb Pan-Seared Chicken with Wilted Baby Spinach",
  prep_time: "20 mins",
  difficulty: "Easy",
  calories_per_serving: 420,
  ingredients_used: [
    { item: "Organic Boneless Chicken Breast", amount: "2 large fillets (450g)" },
    { item: "Baby Spinach Leaves", amount: "4 packed cups" },
    { item: "Fresh Garlic Cloves", amount: "4 cloves, paper-thin sliced" },
    { item: "Extra Virgin Olive Oil", amount: "2 tablespoons" },
    { item: "Cracked Black Pepper & Sea Salt", amount: "To taste" }
  ],
  missing_essentials: [
    "Dry white wine or unsalted chicken bone broth (for pan fond deglazing)",
    "Fresh grated Parmigiano-Reggiano cheese (for rich umami finish)"
  ],
  step_by_step_instructions: [
    "Thoroughly pat chicken breasts dry with kitchen paper to ensure maximum Maillard reaction. Season both sides aggressively with sea salt and cracked pepper.",
    "Place a heavy cast-iron skillet over medium-high heat. Add 1.5 tbsp olive oil until gently shimmering and faint wisps of smoke appear.",
    "Lay chicken breast away from you into the hot skillet. Sear undisturbed for 6 minutes until a rich golden-amber crust forms. Flip and cook 5 more minutes until internal core reaches 74°C (165°F).",
    "Transfer chicken onto a warm cutting board to rest for 5 minutes, allowing muscle fibers to reabsorb internal juices.",
    "Lower skillet heat to medium-low, add remaining olive oil and sliced garlic. Sauté for 40 seconds until aromatic and pale golden (do not burn).",
    "Toss in fresh baby spinach with a pinch of salt. Flash-sauté for 90 seconds until vibrant wilted green. Spoon over sliced chicken and serve immediately."
  ],
  chef_pro_tips: [
    "Deglaze the skillet with 2 tbsp of white wine or lemon juice just after the garlic softens to lift caramelized brown bits (fond) into a restaurant-grade pan jus.",
    "Resting the poultry for at least 5 minutes before slicing preserves over 15% more moisture than carving immediately."
  ]
};

export const SAMPLE_MEAL_PLAN = {
  daily_calorie_target: 2350,
  macro_split: {
    protein_pct: 35,
    carbs_pct: 40,
    fats_pct: 25
  },
  meals: {
    breakfast: {
      dish: "Organic Egg White Scramble with Avocado, Spinach & Sprouted Sourdough",
      calories: 520,
      protein: "42g",
      benefit: "Rapidly bioavailable albumin paired with prebiotic resistant starches for sustained insulin sensitivity throughout morning."
    },
    lunch: {
      dish: "Sous-Vide Citrus Chicken Breast with Jasmine Rice & Charred Asparagus",
      calories: 680,
      protein: "58g",
      benefit: "High leucine concentration (>3.8g) activating mTOR muscle protein synthesis alongside rapid glycogen restoration."
    },
    snack: {
      dish: "Isolate Whey Protein Shake with Blueberries & Roasted Almonds",
      calories: 340,
      protein: "32g",
      benefit: "Polyphenol anthocyanin antioxidant surge to combat training-induced systemic cellular oxidative stress."
    },
    dinner: {
      dish: "Wild Sockeye Salmon with Herb Roasted Sweet Potatoes & Broccolini",
      calories: 810,
      protein: "54g",
      benefit: "Abundant bio-identical EPA/DHA fatty acids reducing nocturnal inflammatory markers and promoting deep sleep REM architecture."
    }
  },
  hydration_goal: "3.4 Liters (approx 14 glasses) with 500mg sodium and potassium electrolytes",
  personalized_advice: "Position 65% of your carbohydrate intake around your active training window. Ensure the evening meal is completed 3 hours prior to sleep to maximize nocturnal growth hormone secretion."
};
