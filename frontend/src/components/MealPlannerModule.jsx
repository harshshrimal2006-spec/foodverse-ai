import React, { useState } from 'react';
import { 
  CalendarRange, 
  Sparkles, 
  Dna, 
  Target, 
  Droplets, 
  Scale, 
  User, 
  Flame, 
  Coffee, 
  Sun, 
  Cookie, 
  Moon, 
  Activity, 
  Zap,
  AlertCircle,
  HelpCircle,
  Award
} from 'lucide-react';
import { generateMealPlanApi, SAMPLE_MEAL_PLAN } from '../api/foodverseApi';

const GOALS = [
  "Muscle Gain & Hypertrophy",
  "Fat Loss & Definition",
  "Athletic Endurance",
  "Longevity & Cellular Health",
  "Metabolic Maintenance"
];

const DIET_TYPES = [
  "High Protein",
  "Mediterranean",
  "Keto / Low Carb",
  "Clean Vegan",
  "Paleo",
  "Balanced Macro"
];

export default function MealPlannerModule({ selectedModel, apiKey }) {
  const [age, setAge] = useState(28);
  const [weight, setWeight] = useState(74);
  const [goal, setGoal] = useState("Muscle Gain & Hypertrophy");
  const [dietType, setDietType] = useState("High Protein");
  const [allergies, setAllergies] = useState("None");
  const [caloriesTarget, setCaloriesTarget] = useState(2400);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleLoadSample = () => {
    setError(null);
    setResult(SAMPLE_MEAL_PLAN);
    setAge(28);
    setWeight(75);
    setCaloriesTarget(2350);
    setGoal("Muscle Gain & Hypertrophy");
    setDietType("High Protein");
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      age: Number(age),
      weight: Number(weight),
      goal,
      diet_type: dietType,
      allergies: allergies.trim() || "None",
      calories_target: Number(caloriesTarget),
      model_name: selectedModel,
    };

    try {
      const data = await generateMealPlanApi(payload, apiKey);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to generate biometric meal plan. Check backend or load sample data.");
    } finally {
      setLoading(false);
    }
  };

  const macroSplit = result?.macro_split || { protein_pct: 35, carbs_pct: 40, fats_pct: 25 };

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <CalendarRange className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Biometric Meal Planner & Macro Protocol
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Engineered 24-hour nutrition plan tailored to your metabolic rate, fitness objectives, and dietary preferences.
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
                <Activity className="w-4 h-4 animate-spin" /> Synthesizing Plan...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-black" /> Generate Protocol
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
              <p className="font-semibold text-rose-200">Protocol Generation Notice</p>
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
        {/* Left Column: Biometric Inputs */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Dna className="w-4 h-4 text-emerald-400" /> Biometric Metrics
              </span>
              <span className="text-[10px] font-mono text-slate-400">{selectedModel}</span>
            </div>

            {/* Age & Weight */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Age
                </label>
                <input
                  type="number"
                  min="12"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white font-mono focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-slate-400" /> Weight (kg)
                </label>
                <input
                  type="number"
                  min="30"
                  max="250"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white font-mono focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Target Calories Slider */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Daily Calorie Goal
                </span>
                <span className="font-mono font-bold text-emerald-300 text-sm">
                  {caloriesTarget} kcal
                </span>
              </div>
              <input
                type="range"
                min="1400"
                max="4000"
                step="50"
                value={caloriesTarget}
                onChange={(e) => setCaloriesTarget(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1,400</span>
                <span>2,700</span>
                <span>4,000</span>
              </div>
            </div>

            {/* Goal Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-violet-400" /> Primary Fitness Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-200 outline-none focus:border-emerald-500 cursor-pointer"
              >
                {GOALS.map((g) => (
                  <option key={g} value={g} className="bg-[#090D16]">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Diet Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Dietary Strategy
              </label>
              <select
                value={dietType}
                onChange={(e) => setDietType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-200 outline-none focus:border-emerald-500 cursor-pointer"
              >
                {DIET_TYPES.map((d) => (
                  <option key={d} value={d} className="bg-[#090D16]">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Allergies */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Allergies / Dislikes
              </label>
              <input
                type="text"
                placeholder="e.g. Shellfish, Peanuts, Lactose..."
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Meal Protocol Results */}
        <div className="lg:col-span-8 space-y-5">
          {result ? (
            <div className="space-y-5 animate-fadeIn">
              {/* Daily Calorie & Macro Distribution Hero */}
              <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                      Personalized Nutrition Blueprint
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                      {result.daily_calorie_target}{' '}
                      <span className="text-sm font-semibold text-slate-400">kcal / day</span>
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      Calibrated for {goal} with a {dietType} distribution.
                    </p>
                  </div>

                  {/* Hydration Goal Pill */}
                  <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 flex items-center gap-2.5 shrink-0">
                    <Droplets className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-cyan-400">Daily Hydration</p>
                      <p className="text-xs font-bold text-white">{result.hydration_goal}</p>
                    </div>
                  </div>
                </div>

                {/* Macro Split Bar */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400">Target Macronutrient Ratio</span>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span className="text-emerald-400">Protein: {macroSplit.protein_pct}%</span>
                      <span className="text-violet-400">Carbs: {macroSplit.carbs_pct}%</span>
                      <span className="text-amber-400">Fats: {macroSplit.fats_pct}%</span>
                    </div>
                  </div>

                  <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-700"
                      style={{ width: `${macroSplit.protein_pct}%` }}
                      title={`Protein: ${macroSplit.protein_pct}%`}
                    />
                    <div
                      className="bg-violet-500 h-full transition-all duration-700"
                      style={{ width: `${macroSplit.carbs_pct}%` }}
                      title={`Carbs: ${macroSplit.carbs_pct}%`}
                    />
                    <div
                      className="bg-amber-500 h-full transition-all duration-700"
                      style={{ width: `${macroSplit.fats_pct}%` }}
                      title={`Fats: ${macroSplit.fats_pct}%`}
                    />
                  </div>
                </div>
              </div>

              {/* 4 Meal Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Breakfast */}
                <div className="glass-panel p-5 rounded-3xl space-y-3 border-t-2 border-t-amber-500">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Coffee className="w-4 h-4" /> Breakfast
                    </span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {result.meals?.breakfast?.calories} kcal
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{result.meals?.breakfast?.dish}</h4>
                    <p className="text-[11px] text-emerald-400 font-mono mt-0.5 font-semibold">
                      Protein: {result.meals?.breakfast?.protein}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1 border-t border-white/5">
                    {result.meals?.breakfast?.benefit}
                  </p>
                </div>

                {/* Lunch */}
                <div className="glass-panel p-5 rounded-3xl space-y-3 border-t-2 border-t-emerald-500">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sun className="w-4 h-4" /> Lunch
                    </span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {result.meals?.lunch?.calories} kcal
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{result.meals?.lunch?.dish}</h4>
                    <p className="text-[11px] text-emerald-400 font-mono mt-0.5 font-semibold">
                      Protein: {result.meals?.lunch?.protein}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1 border-t border-white/5">
                    {result.meals?.lunch?.benefit}
                  </p>
                </div>

                {/* Snack */}
                <div className="glass-panel p-5 rounded-3xl space-y-3 border-t-2 border-t-violet-500">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Cookie className="w-4 h-4" /> Afternoon Snack
                    </span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-300 border border-violet-500/20">
                      {result.meals?.snack?.calories} kcal
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{result.meals?.snack?.dish}</h4>
                    <p className="text-[11px] text-emerald-400 font-mono mt-0.5 font-semibold">
                      Protein: {result.meals?.snack?.protein}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1 border-t border-white/5">
                    {result.meals?.snack?.benefit}
                  </p>
                </div>

                {/* Dinner */}
                <div className="glass-panel p-5 rounded-3xl space-y-3 border-t-2 border-t-rose-500">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Moon className="w-4 h-4" /> Dinner & Recovery
                    </span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      {result.meals?.dinner?.calories} kcal
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{result.meals?.dinner?.dish}</h4>
                    <p className="text-[11px] text-emerald-400 font-mono mt-0.5 font-semibold">
                      Protein: {result.meals?.dinner?.protein}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1 border-t border-white/5">
                    {result.meals?.dinner?.benefit}
                  </p>
                </div>
              </div>

              {/* Personalized Advice */}
              <div className="glass-panel p-5 rounded-3xl border border-violet-500/30 bg-gradient-to-r from-violet-950/20 via-slate-900/60 to-transparent">
                <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5 mb-2">
                  <Award className="w-4 h-4" /> Sports Nutritionist Recommendations
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {result.personalized_advice}
                </p>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="glass-panel p-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-emerald-400">
                <CalendarRange className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-bold text-white">Biometric Protocol Generator Ready</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Adjust your age, weight, target calories, and dietary goals on the left, then click <strong className="text-emerald-400">Generate Protocol</strong> or test with sample data.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLoadSample}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                Try Sample Hypertrophy 2350 kcal Protocol
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
