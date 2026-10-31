import React, { useState } from 'react';
import { 
  ChefHat, 
  Sparkles, 
  Clock, 
  Gauge, 
  Flame, 
  Check, 
  AlertCircle, 
  Utensils, 
  Lightbulb, 
  ShoppingBag, 
  Activity, 
  Zap,
  Tag
} from 'lucide-react';
import ImageDropzone from './ImageDropzone';
import { generateRecipeApi, SAMPLE_COOKING } from '../api/foodverseApi';

const COOKING_PRESETS = [
  {
    label: "Chicken & Fresh Greens",
    tag: "High Protein",
    url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80"
  },
  {
    label: "Pantry Vegetables & Pasta",
    tag: "Mediterranean",
    url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
  },
  {
    label: "Eggs, Avocado & Herbs",
    tag: "Keto Friendly",
    url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80"
  }
];

const DIETARY_OPTIONS = [
  "None",
  "High Protein",
  "Keto / Low Carb",
  "Mediterranean",
  "Vegan / Plant-Based",
  "Gluten-Free",
  "Paleo"
];

export default function CookingModule({ selectedModel, apiKey }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [ingredientsText, setIngredientsText] = useState("");
  const [dietaryPref, setDietaryPref] = useState("None");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageSelected = (file, previewUrl) => {
    setImageFile(file);
    setImagePreview(previewUrl);
    setError(null);
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleLoadSample = () => {
    setError(null);
    setResult(SAMPLE_COOKING);
    setIngredientsText("Chicken breast, baby spinach, fresh garlic, olive oil, cracked pepper");
    setDietaryPref("High Protein");
    if (!imagePreview) {
      setImagePreview(COOKING_PRESETS[0].url);
    }
  };

  const handleGenerate = async () => {
    if (!imageFile && !ingredientsText.trim()) {
      setError("Please provide either a photo of your ingredients or type them into the text box.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const data = await generateRecipeApi(
        {
          file: imageFile,
          ingredientsText: ingredientsText.trim(),
          dietaryPref,
          modelName: selectedModel,
        },
        apiKey
      );
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to generate recipe. Check server or load sample data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <ChefHat className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              AI Chef & Zero-Waste Recipe Creator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Turn mystery pantry items or fridge leftovers into gourmet recipes with exact cooking steps and culinary tips.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-violet-600/15 hover:bg-violet-600/25 text-violet-300 border border-violet-500/30 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Load Sample Analysis</span>
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 ${
              loading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/25 hover:shadow-emerald-500/40'
            }`}
          >
            {loading ? (
              <>
                <Activity className="w-4 h-4 animate-spin" /> Cooking Up Ideas...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-black" /> Create Recipe
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Culinary Creation Notice</p>
              <p className="mt-0.5 text-rose-300/90">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold shrink-0"
          >
            Preview Sample Data
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-amber-400" /> Available Ingredients
              </span>
              <span className="text-[10px] font-mono text-slate-400">{selectedModel}</span>
            </div>

            {/* Visual Dropzone */}
            <ImageDropzone
              imageFile={imageFile}
              imagePreview={imagePreview}
              onImageSelected={handleImageSelected}
              onClearImage={handleClearImage}
              loading={loading}
              title="Snap your fridge, pantry, or countertop"
              subtitle="Multimodal vision detects ingredients automatically"
              presets={COOKING_PRESETS}
            />

            {/* Additional Text Ingredients */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Or List Ingredients / Leftovers</span>
                <span className="text-[10px] text-slate-500 font-normal">Optional</span>
              </label>
              <textarea
                rows={2}
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                placeholder="e.g. 2 chicken breasts, half a bag of spinach, garlic, parmesan..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
              />
            </div>

            {/* Dietary Preference Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-400" /> Dietary Style
              </label>
              <select
                value={dietaryPref}
                onChange={(e) => setDietaryPref(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-200 outline-none focus:border-emerald-500 cursor-pointer"
              >
                {DIETARY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#090D16]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Recipe Result Dashboard */}
        <div className="lg:col-span-7 space-y-5">
          {result ? (
            <div className="space-y-5 animate-fadeIn">
              {/* Recipe Hero Card */}
              <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Michelin AI Recipe
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {dietaryPref !== "None" ? dietaryPref : "Universal"}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                    {result.recipe_name}
                  </h2>
                </div>

                {/* Quick Spec Pills */}
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10">
                  <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/5 flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Prep Time</p>
                      <p className="text-xs sm:text-sm font-bold text-white">{result.prep_time}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/5 flex items-center gap-2.5">
                    <Gauge className="w-4 h-4 text-violet-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Skill Level</p>
                      <p className="text-xs sm:text-sm font-bold text-white">{result.difficulty}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/5 flex items-center gap-2.5">
                    <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Calories</p>
                      <p className="text-xs sm:text-sm font-bold text-white">
                        {result.calories_per_serving} <span className="text-[10px] font-normal">kcal/serv</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingredients Used & Missing Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ingredients Used */}
                <div className="glass-panel p-5 rounded-3xl space-y-3">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Ingredients Included
                  </h3>
                  <div className="divide-y divide-white/5">
                    {result.ingredients_used?.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs">
                        <span className="text-slate-200 font-medium">{item.item}</span>
                        <span className="font-mono text-emerald-300 font-semibold">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Essentials */}
                <div className="glass-panel p-5 rounded-3xl space-y-3">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4" /> Pantry Elevators
                  </h3>
                  <div className="space-y-2">
                    {result.missing_essentials?.map((item, idx) => (
                      <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step by Step Instructions */}
              <div className="glass-panel p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-violet-400" /> Step-by-Step Culinary Instructions
                </h3>

                <div className="space-y-3">
                  {result.step_by_step_instructions?.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
                      <div className="w-6 h-6 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chef Pro Tips */}
              {result.chef_pro_tips && result.chef_pro_tips.length > 0 && (
                <div className="glass-panel p-5 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-slate-900/60 to-transparent">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2.5">
                    <Lightbulb className="w-4 h-4" /> Executive Chef Secrets
                  </h3>
                  <div className="space-y-2">
                    {result.chef_pro_tips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-200 leading-relaxed">
                        <span className="text-emerald-400 font-bold">★</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="glass-panel p-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-amber-400">
                <ChefHat className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-bold text-white">AI Culinary Engine Ready</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Upload an image of what you have in the fridge or type your ingredients to receive a customized chef-crafted recipe.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLoadSample}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                Try Sample Tuscan Chicken Recipe
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
