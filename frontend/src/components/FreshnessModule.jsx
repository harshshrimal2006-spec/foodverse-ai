import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Thermometer, 
  Eye, 
  Activity, 
  Microscope,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
  Leaf
} from 'lucide-react';
import ImageDropzone from './ImageDropzone';
import { analyzeFreshnessApi, SAMPLE_FRESHNESS } from '../api/foodverseApi';

const FRESHNESS_PRESETS = [
  {
    label: "Prime Hass Avocado",
    tag: "Fresh State",
    url: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80"
  },
  {
    label: "Fresh Strawberries",
    tag: "High Turgor",
    url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80"
  },
  {
    label: "Spotted Ripe Bananas",
    tag: "Stage 6 Ripening",
    url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80"
  }
];

export default function FreshnessModule({ selectedModel, apiKey }) {
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
    setResult(SAMPLE_FRESHNESS);
    if (!imagePreview) {
      setImagePreview(FRESHNESS_PRESETS[0].url);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError("Please select or upload a produce/food image to assess freshness.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const data = await analyzeFreshnessApi(imageFile, selectedModel, apiKey);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to inspect freshness. Check server or load sample data.");
    } finally {
      setLoading(false);
    }
  };

  // Score styling
  const score = result?.freshness_score ?? 88;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (score / 100) * circumference;

  const getStatusColor = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('fresh') && !s.includes('mod')) return 'emerald';
    if (s.includes('mod') || s.includes('soon')) return 'amber';
    return 'rose';
  };

  const statusColor = getStatusColor(result?.status);

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Freshness & Spoilage AI Detection
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Detect cellular decay, fungal sporulation, chlorophyll breakdown, and estimate remaining shelf life.
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
                <Activity className="w-4 h-4 animate-spin" /> Inspecting Produce...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-black" /> Inspect Freshness
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Freshness Audit Warning</p>
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
        {/* Left Column: Image Dropzone */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Microscope className="w-4 h-4 text-amber-400" /> Target Produce Sample
              </span>
              <span className="text-[10px] font-mono text-slate-400">{selectedModel}</span>
            </div>

            <ImageDropzone
              imageFile={imageFile}
              imagePreview={imagePreview}
              onImageSelected={handleImageSelected}
              onClearImage={handleClearImage}
              loading={loading}
              title="Upload fruit, vegetable, or protein image"
              subtitle="High-res macro shots yield highest accuracy"
              presets={FRESHNESS_PRESETS}
            />

            <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/5 space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center justify-between text-slate-300 font-medium">
                <span>Spectral Analysis</span>
                <span className="text-emerald-400 font-mono text-[11px]">Active</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Visual inspection scans epidermal wrinkling, necrotic spotting, mycelial hyphae, and pigment oxidation.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Dashboard */}
        <div className="lg:col-span-7 space-y-5">
          {result ? (
            <div className="space-y-5 animate-fadeIn">
              {/* Header Status & Score Card */}
              <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
                <div
                  className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
                    statusColor === 'emerald'
                      ? 'bg-emerald-500/15'
                      : statusColor === 'amber'
                      ? 'bg-amber-500/15'
                      : 'bg-rose-500/15'
                  }`}
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Analyzed Specimen
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                          statusColor === 'emerald'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : statusColor === 'amber'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {result.status}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {result.food_item}
                    </h2>
                    <p className="text-xs text-slate-300 mt-2 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Estimated Shelf Life:{' '}
                      <strong className="text-white font-semibold">
                        {result.estimated_shelf_life}
                      </strong>
                    </p>
                  </div>

                  {/* Circular Freshness Score */}
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
                            score >= 80
                              ? 'text-emerald-500'
                              : score >= 50
                              ? 'text-amber-500'
                              : 'text-rose-500'
                          }
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-white">{score}</span>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                          Freshness
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold mt-1 ${
                        score >= 80
                          ? 'text-emerald-400'
                          : score >= 50
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {score >= 80 ? 'Optimal Condition' : score >= 50 ? 'Maturing Fast' : 'Degraded'}
                    </span>
                  </div>
                </div>

                {/* Safety Alert Banner */}
                <div
                  className={`mt-4 p-3.5 rounded-2xl border flex items-center gap-3 text-xs sm:text-sm font-semibold ${
                    result.safety_alert?.includes('Safe')
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : result.safety_alert?.includes('Soon')
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                  }`}
                >
                  {result.safety_alert?.includes('Safe') ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : result.safety_alert?.includes('Soon') ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                  <div className="flex-1">
                    <span className="font-extrabold uppercase tracking-wide mr-2 text-[11px] px-2 py-0.5 rounded bg-black/40">
                      Safety Verdict
                    </span>
                    <span>{result.safety_alert}</span>
                  </div>
                </div>
              </div>

              {/* 3 Visual Indicators Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="glass-panel p-4 rounded-2xl space-y-2 border-t-2 border-t-emerald-500">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" /> Color Pigmentation
                  </span>
                  <p className="text-xs text-slate-300/90 leading-relaxed">
                    {result.visual_indicators?.color_analysis || 'No noticeable pigment discoloration detected.'}
                  </p>
                </div>

                <div className="glass-panel p-4 rounded-2xl space-y-2 border-t-2 border-t-amber-500">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-400" /> Texture & Turgor
                  </span>
                  <p className="text-xs text-slate-300/90 leading-relaxed">
                    {result.visual_indicators?.texture_analysis || 'Epidermal firmness intact.'}
                  </p>
                </div>

                <div className="glass-panel p-4 rounded-2xl space-y-2 border-t-2 border-t-rose-500">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Microscope className="w-3.5 h-3.5 text-rose-400" /> Spoilage Indicators
                  </span>
                  <p className="text-xs text-slate-300/90 leading-relaxed">
                    {result.visual_indicators?.spoilage_signs || 'Zero fungal mycelia or rot observed.'}
                  </p>
                </div>
              </div>

              {/* Storage Recommendation */}
              <div className="glass-panel p-5 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 via-slate-900/60 to-transparent">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Thermometer className="w-4 h-4" /> Preservation Protocol
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {result.storage_recommendation}
                </p>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="glass-panel p-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-bold text-white">Produce Freshness Scanner Ready</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Upload an image of fruits, vegetables, dairy, or meats to audit ripeness, bacterial safety, and remaining shelf life.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLoadSample}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                Try Sample Avocado Inspection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
