import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Activity, 
  Zap, 
  Layers, 
  TrendingUp, 
  Leaf, 
  ArrowRight, 
  AlertCircle,
  HelpCircle,
  Dna,
  PieChart
} from 'lucide-react';
import ImageDropzone from './ImageDropzone';
import { analyzeNutritionApi, SAMPLE_NUTRITION } from '../api/foodverseApi';

const NUTRITION_PRESETS = [
  {
    label: "Salmon Quinoa Bowl",
    tag: "High Protein",
    url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
  },
  {
    label: "Avocado Egg Sourdough",
    tag: "Balanced Fats",
    url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80"
  },
  {
    label: "Grilled Chicken Salad",
    tag: "Low Carb",
    url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"
  }
];

export default function NutritionModule({ selectedModel, apiKey }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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
    setResult(SAMPLE_NUTRITION);
    if (!imagePreview) {
      setImagePreview(NUTRITION_PRESETS[0].url);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError("Please upload a food image or choose a sample image above.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const data = await analyzeNutritionApi(imageFile, selectedModel, apiKey);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to analyze nutrition. Ensure backend is running or load sample data.");
    } finally {
      setLoading(false);
    }
  };

  // Macro calculations
  const macros = result?.macros || { protein_g: 0, carbs_g: 0, fats_g: 0, fiber_g: 0 };
  const proteinCalories = (macros.protein_g || 0) * 4;
  const carbsCalories = (macros.carbs_g || 0) * 4;
  const fatsCalories = (macros.fats_g || 0) * 9;
  const totalMacroCal = (proteinCalories + carbsCalories + fatsCalories) || 1;

  const proteinPct = Math.round((proteinCalories / totalMacroCal) * 100);
  const carbsPct = Math.round((carbsCalories / totalMacroCal) * 100);
  const fatsPct = Math.max(0, 100 - proteinPct - carbsPct);

  // Health score circle calculation
  const healthScore = result?.health_score ?? 85;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Flame className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Multimodal Nutrition & Macro Matrix
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Detect ingredients, estimate gram portions, calculate complete macros, and quantify clinical health metrics using Gemini Vision.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-violet-600/15 hover:bg-violet-600/25 text-violet-300 border border-violet-500/30 transition-all flex items-center gap-1.5"
            title="Load realistic sample data immediately"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Load Sample Analysis</span>
          </button>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 ${
              loading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/25 hover:shadow-emerald-500/40'
            }`}
          >
            {loading ? (
              <>
                <Activity className="w-4 h-4 animate-spin" /> Scanning Image...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-black" /> Analyze Nutrition
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert with Sample Option */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Analysis Error</p>
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

      {/* Grid: Left Upload & Controls, Right Visual Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Dropzone */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Dna className="w-4 h-4 text-emerald-400" /> Input Food Specimen
              </span>
              <span className="text-[10px] font-mono text-slate-400">Model: {selectedModel}</span>
            </div>

            <ImageDropzone
              imageFile={imageFile}
              imagePreview={imagePreview}
              onImageSelected={handleImageSelected}
              onClearImage={handleClearImage}
              loading={loading}
              title="Upload meal photo for nutrient scan"
              subtitle="Capture complete plate for portion estimation"
              presets={NUTRITION_PRESETS}
            />

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Ready for multimodal extraction</span>
              <span className="text-emerald-400 font-mono text-[11px]">JSON Strict Schema</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Dashboard Results */}
        <div className="lg:col-span-7 space-y-5">
          {result ? (
            <div className="space-y-5 animate-fadeIn">
              {/* Top Summary Card */}
              <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                      Identified Plate
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                      {result.dish_name}
                    </h2>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-xl">
                      {result.ai_summary}
                    </p>
                  </div>

                  {/* Circular Health Score Ring */}
                  <div className="flex flex-col items-center shrink-0 self-center sm:self-auto">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r={radius}
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-slate-800"
                          fill="transparent"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r={radius}
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeOffset}
                          strokeLinecap="round"
                          className={
                            healthScore >= 80
                              ? 'text-emerald-500'
                              : healthScore >= 60
                              ? 'text-amber-500'
                              : 'text-rose-500'
                          }
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-white">{healthScore}</span>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                          Health
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400 mt-1">
                      {healthScore >= 85 ? 'Nutrient Dense' : 'Standard Balance'}
                    </span>
                  </div>
                </div>

                {/* Dietary Tags */}
                {result.dietary_tags && result.dietary_tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                    {result.dietary_tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium flex items-center gap-1.5"
                      >
                        <Leaf className="w-3 h-3 text-emerald-400" /> {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Macro & Calorie Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-amber-500">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Total Energy</span>
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">
                    {result.total_calories}{' '}
                    <span className="text-xs font-semibold text-slate-400">kcal</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Calculated net portion</p>
                </div>

                <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-emerald-500">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Protein</span>
                    <span className="text-[10px] font-bold text-emerald-400 font-mono">{proteinPct}%</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">
                    {macros.protein_g}
                    <span className="text-xs font-semibold text-slate-400">g</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${proteinPct}%` }} />
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-violet-500">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Carbs</span>
                    <span className="text-[10px] font-bold text-violet-400 font-mono">{carbsPct}%</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">
                    {macros.carbs_g}
                    <span className="text-xs font-semibold text-slate-400">g</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-violet-400 h-full rounded-full" style={{ width: `${carbsPct}%` }} />
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-rose-500">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Healthy Fats</span>
                    <span className="text-[10px] font-bold text-rose-400 font-mono">{fatsPct}%</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">
                    {macros.fats_g}
                    <span className="text-xs font-semibold text-slate-400">g</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-rose-400 h-full rounded-full" style={{ width: `${fatsPct}%` }} />
                  </div>
                </div>
              </div>

              {/* Detected Items Breakdown Table */}
              <div className="glass-panel p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" /> Detected Plate Components
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Fiber: <strong className="text-slate-200">{macros.fiber_g}g</strong>
                  </span>
                </div>

                <div className="divide-y divide-white/5 overflow-hidden">
                  {result.detected_items && result.detected_items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 text-[10px] font-mono flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-200">{item.name}</p>
                          <p className="text-[11px] text-slate-400">Estimated portion: {item.portion}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-300">
                          {item.calories} <span className="text-[10px] text-slate-500">kcal</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Healthier Alternatives Recommendations */}
              {result.healthier_alternatives && result.healthier_alternatives.length > 0 && (
                <div className="glass-panel p-5 rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/20 via-slate-900/60 to-transparent">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5 mb-2.5">
                    <TrendingUp className="w-4 h-4" /> AI Nutritional Optimizations
                  </h3>
                  <div className="space-y-2">
                    {result.healthier_alternatives.map((alt, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                        <ArrowRight className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                        <span>{alt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="glass-panel p-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-emerald-400">
                <Activity className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-bold text-white">No Analysis Loaded Yet</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Upload an image of your breakfast, lunch, or snack, or click the <strong className="text-violet-300">Load Sample Analysis</strong> button above to immediately preview the multimodal report.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLoadSample}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                Try Sample Salmon Bowl
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
