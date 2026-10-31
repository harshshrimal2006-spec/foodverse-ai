import React, { useState } from 'react';
import { 
  CheckCircle, 
  ShieldAlert, 
  AlertTriangle, 
  Sparkles, 
  ClipboardCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Wrench, 
  Activity, 
  Zap,
  Building2,
  ListChecks
} from 'lucide-react';
import ImageDropzone from './ImageDropzone';
import { analyzeHygieneApi, SAMPLE_HYGIENE } from '../api/foodverseApi';

const HYGIENE_PRESETS = [
  {
    label: "Commercial Line Prep Station",
    tag: "Stainless 304",
    url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
  },
  {
    label: "Restaurant Food Prep Counter",
    tag: "Active Service",
    url: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80"
  },
  {
    label: "Bakery Work Table",
    tag: "Flour Prep",
    url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
  }
];

export default function HygieneModule({ selectedModel, apiKey }) {
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
    setResult(SAMPLE_HYGIENE);
    if (!imagePreview) {
      setImagePreview(HYGIENE_PRESETS[0].url);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError("Please select or upload a kitchen/station image to audit.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const data = await analyzeHygieneApi(imageFile, selectedModel, apiKey);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to audit kitchen hygiene. Check server or load sample data.");
    } finally {
      setLoading(false);
    }
  };

  const score = result?.overall_hygiene_score ?? 85;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (score / 100) * circumference;

  const getComplianceColor = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('compliant') && !s.includes('needs')) return 'emerald';
    if (s.includes('improve') || s.includes('needs')) return 'amber';
    return 'rose';
  };

  const complianceColor = getComplianceColor(result?.compliance_status);

  // Helper for checklist items
  const renderChecklistCard = (title, data) => {
    if (!data) return null;
    const status = (data.status || 'Pass').toLowerCase();
    const isPass = status === 'pass';
    const isWarning = status === 'warning';

    return (
      <div className="glass-panel p-4 rounded-2xl space-y-2 border border-white/10 hover:border-white/20 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">{title}</span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 border ${
              isPass
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : isWarning
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
            }`}
          >
            {isPass ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            ) : isWarning ? (
              <AlertTriangle className="w-3 h-3 text-amber-400" />
            ) : (
              <XCircle className="w-3 h-3 text-rose-400" />
            )}
            {data.status || 'Checked'}
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{data.note}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400">
              <ClipboardCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Commercial Kitchen Hygiene Audit
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated HACCP inspection for PPE compliance, sanitation, cross-contamination, and station hazards.
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
                <Activity className="w-4 h-4 animate-spin" /> Auditing Station...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-black" /> Audit Hygiene
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
              <p className="font-semibold text-rose-200">Hygiene Audit Failed</p>
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
                <Building2 className="w-4 h-4 text-violet-400" /> Prep Area or Line Photo
              </span>
              <span className="text-[10px] font-mono text-slate-400">{selectedModel}</span>
            </div>

            <ImageDropzone
              imageFile={imageFile}
              imagePreview={imagePreview}
              onImageSelected={handleImageSelected}
              onClearImage={handleClearImage}
              loading={loading}
              title="Upload kitchen or food preparation photo"
              subtitle="Inspects surfaces, gloves, masks, hair nets, & tools"
              presets={HYGIENE_PRESETS}
            />

            <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/5 space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center justify-between text-slate-300 font-medium">
                <span>HACCP Compliance Engine</span>
                <span className="text-violet-400 font-mono text-[11px]">ISO 22000 Protocol</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Audits glove usage, head restraints, cross-contact vectors, and sanitization levels in real time.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Dashboard */}
        <div className="lg:col-span-7 space-y-5">
          {result ? (
            <div className="space-y-5 animate-fadeIn">
              {/* Overall Hygiene Score Card */}
              <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
                <div
                  className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
                    complianceColor === 'emerald'
                      ? 'bg-emerald-500/15'
                      : complianceColor === 'amber'
                      ? 'bg-amber-500/15'
                      : 'bg-rose-500/15'
                  }`}
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Inspection Verdict
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <h2 className="text-xl sm:text-2xl font-black text-white">
                        HACCP Sanitary Status:
                      </h2>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold border ${
                          complianceColor === 'emerald'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : complianceColor === 'amber'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {result.compliance_status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Audited against standard commercial food handling and cleanliness protocols.
                    </p>
                  </div>

                  {/* Circular Score Ring */}
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
                              : score >= 60
                              ? 'text-amber-500'
                              : 'text-rose-500'
                          }
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-white">{score}</span>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                          Hygiene
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold mt-1 ${
                        score >= 80
                          ? 'text-emerald-400'
                          : score >= 60
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {score >= 80 ? 'Grade A Sanitation' : score >= 60 ? 'Requires Cleanup' : 'Hazard Flagged'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checklist Breakdown Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ListChecks className="w-4 h-4 text-emerald-400" /> Sanitation Checklist
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderChecklistCard('Glove Usage Compliance', result.checklist?.glove_usage)}
                  {renderChecklistCard('Hair Cap & Net Protocol', result.checklist?.hair_cap_compliance)}
                  {renderChecklistCard('Work Surface Cleanliness', result.checklist?.surface_cleanliness)}
                  {renderChecklistCard('Cross-Contamination Safety', result.checklist?.food_handling_safety)}
                </div>
              </div>

              {/* Hazards Detected */}
              {result.hazards_detected && result.hazards_detected.length > 0 && (
                <div className="glass-panel p-5 rounded-3xl border border-rose-500/20 bg-rose-950/15">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-2.5">
                    <ShieldAlert className="w-4 h-4" /> Detected Sanitary Hazards
                  </h3>
                  <div className="space-y-2">
                    {result.hazards_detected.map((hazard, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-rose-200/90 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <span>{hazard}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Corrective Actions */}
              {result.corrective_actions && result.corrective_actions.length > 0 && (
                <div className="glass-panel p-5 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/15 via-slate-900/60 to-transparent">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2.5">
                    <Wrench className="w-4 h-4" /> Required Corrective Actions (SOP)
                  </h3>
                  <div className="space-y-2">
                    {result.corrective_actions.map((action, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                        <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="glass-panel p-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-violet-400">
                <ClipboardCheck className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-bold text-white">Commercial Hygiene Audit Ready</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Capture prep tables, cook lines, or food handlers to inspect for sanitary violations and receive HACCP remediation steps.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLoadSample}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                Try Sample Commercial Kitchen Audit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
