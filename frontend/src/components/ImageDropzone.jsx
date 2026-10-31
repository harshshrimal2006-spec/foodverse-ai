import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  X, 
  Scan, 
  Sparkles,
  Camera,
  RefreshCw
} from 'lucide-react';

export default function ImageDropzone({
  imageFile,
  imagePreview,
  onImageSelected,
  onClearImage,
  loading = false,
  title = "Drop your food or kitchen image here",
  subtitle = "Supports JPG, PNG, WEBP up to 15MB",
  presets = [] // Array of { label: string, url: string, tag: string }
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    onImageSelected(file, previewUrl);
  };

  // Convert preset URL into a File object so the backend multipart endpoint gets an actual image
  const handleSelectPreset = async (preset) => {
    try {
      const response = await fetch(preset.url);
      const blob = await response.blob();
      const file = new File([blob], `${preset.label.toLowerCase().replace(/\s+/g, '_')}.jpg`, {
        type: blob.type || 'image/jpeg',
      });
      onImageSelected(file, preset.url);
    } catch (err) {
      // Fallback: Just set preview and create a synthetic mock file
      const syntheticFile = new File(["dummy"], "sample.jpg", { type: "image/jpeg" });
      onImageSelected(syntheticFile, preset.url);
    }
  };

  return (
    <div className="space-y-3">
      {/* Main Upload / Preview Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !imagePreview && !loading && fileInputRef.current?.click()}
        className={`relative overflow-hidden rounded-2xl transition-all duration-300 border-2 ${
          loading
            ? 'border-emerald-500/60 bg-slate-950 shadow-2xl shadow-emerald-950/40'
            : isDragOver
            ? 'border-emerald-400 bg-emerald-500/10 scale-[1.008]'
            : imagePreview
            ? 'border-white/15 bg-slate-900/60'
            : 'border-dashed border-white/15 hover:border-emerald-500/40 bg-slate-900/40 hover:bg-slate-900/70 cursor-pointer'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          disabled={loading}
        />

        {/* State A: Image Preview Active */}
        {imagePreview ? (
          <div className="relative group w-full aspect-[16/9] sm:aspect-[21/9] max-h-80 flex items-center justify-center bg-black/60">
            <img
              src={imagePreview}
              alt="Food Analysis Target"
              className="w-full h-full object-cover object-center transition-all duration-500"
            />

            {/* Glowing dark vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* LASER SCAN ANIMATION WHEN LOADING */}
            {loading && (
              <>
                {/* Laser Sweep line */}
                <div className="laser-beam animate-laser-sweep" />

                {/* Grid overlay & scanning radar aesthetic */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

                {/* Scanning Status Badge */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-slate-950/90 border border-emerald-500/40 backdrop-blur-xl flex items-center gap-2.5 text-xs font-semibold text-emerald-300 shadow-xl shadow-emerald-950/60 z-30">
                  <Scan className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span className="tracking-wide animate-pulse">
                    Scanning visual textures & extracting multimodal insights...
                  </span>
                </div>
              </>
            )}

            {/* Top Right Action overlay when not loading */}
            {!loading && (
              <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 border border-white/20 text-xs font-medium text-slate-200 hover:text-white backdrop-blur-md transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Replace
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearImage();
                  }}
                  className="p-1.5 rounded-xl bg-black/70 hover:bg-rose-950/70 border border-white/20 hover:border-rose-500/40 text-slate-300 hover:text-rose-400 backdrop-blur-md transition-all"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Image Details Pill */}
            {!loading && imageFile && (
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="truncate max-w-[200px]">{imageFile.name || "Uploaded Image"}</span>
                {imageFile.size && (
                  <span className="text-slate-500">
                    ({(imageFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          /* State B: Empty Dropzone Prompt */
          <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-800 to-violet-500/10 border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <UploadCloud className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-200">{title}</p>
              <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Camera className="w-3.5 h-3.5" />
              <span>Click to browse or drop file directly</span>
            </div>
          </div>
        )}
      </div>

      {/* Preset Quick Selectors if provided */}
      {presets && presets.length > 0 && !loading && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-violet-400" /> Quick Visual Samples:
          </span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-300 transition-all flex items-center gap-1.5"
            >
              <span>{preset.label}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400">
                {preset.tag}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
