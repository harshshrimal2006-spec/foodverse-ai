import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Cpu,
  Key,
  CheckCircle2,
  Eye,
  EyeOff,
  X,
  ShieldCheck,
  ExternalLink,
  Activity,
  Zap
} from 'lucide-react';
import { getSavedApiKey, saveApiKey, checkServerHealth } from '../api/foodverseApi';

export default function Header({ selectedModel, setSelectedModel, apiKey, setApiKey }) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [showKeyText, setShowKeyText] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Check backend health periodically
    const verifyHealth = async () => {
      const res = await checkServerHealth();
      if (res && res.status === 'healthy') {
        setServerStatus('online');
      } else {
        setServerStatus('offline');
      }
    };
    verifyHealth();
    const interval = setInterval(verifyHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveKey = () => {
    saveApiKey(keyInput);
    setApiKey(keyInput.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowKeyModal(false);
    }, 1200);
  };

  const handleRemoveKey = () => {
    saveApiKey('');
    setApiKey('');
    setKeyInput('');
  };

  const hasKeyConfigured = Boolean(apiKey && apiKey.trim().length > 10);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#090D16]/85 backdrop-blur-xl px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-violet-500/20 to-emerald-400/10 border border-emerald-500/30 shadow-lg shadow-emerald-950/40">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                FoodVerse <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline-flex">
                v2.5 Vision
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden md:block">
              Multimodal Food & Kitchen Intelligence Agent
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Status Badge: Multimodal Engine Online */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-white/10 text-xs font-medium text-slate-300 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${serverStatus === 'online' ? 'bg-emerald-400' : 'bg-amber-400'
                }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${serverStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}></span>
            </span>
            <span>Multimodal Engine Online</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
              {serverStatus === 'online' ? 'FastAPI 8000' : 'Standby'}
            </span>
          </div>

          {/* Model Selector Dropdown */}
          <div className="relative flex items-center">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-slate-200 hover:border-violet-500/40 transition-colors shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-200 outline-none cursor-pointer pr-1"
                title="Select Google Gemini Multimodal Model"
              >
                <option value="gemini-3.5-flash-lite" className="bg-[#090D16] text-slate-100">
                  gemini-3.5-flash-lite (Default Fast Mode)
                </option>
                <option value="gemini-3.8-flash" className="bg-[#090D16] text-slate-100">
                  gemini-3.8-flash (Standard Help)
                </option>

              </select>
            </div>
          </div>

          {/* API Key Modal / Button */}
          <button
            onClick={() => {
              setKeyInput(apiKey || '');
              setShowKeyModal(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${hasKeyConfigured
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20 shadow-sm shadow-emerald-950/20'
                : 'bg-violet-600/15 text-violet-300 border-violet-500/30 hover:bg-violet-600/25 hover:border-violet-500/50'
              }`}
            title="Configure Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">
              {hasKeyConfigured ? 'API Key Active' : 'Set Gemini Key'}
            </span>
            <span className="sm:hidden">Key</span>
            {hasKeyConfigured && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5"></span>
            )}
          </button>
        </div>
      </header>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0D1322] border border-white/15 p-6 shadow-2xl text-slate-100">
            {/* Close Button */}
            <button
              onClick={() => setShowKeyModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Gemini API Credentials</h3>
                <p className="text-xs text-slate-400">
                  Passed in headers (<code className="text-violet-300 font-mono">X-Gemini-Key</code>) or read from <code className="text-emerald-300 font-mono">.env</code>
                </p>
              </div>
            </div>

            {/* Input Form */}
            <div className="space-y-3 mb-5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Google AI Studio API Key
              </label>
              <div className="relative">
                <input
                  type={showKeyText ? 'text' : 'password'}
                  placeholder="AIzaSy..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-white/15 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKeyText(!showKeyText)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showKeyText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Stored securely in browser local memory.</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 underline"
                >
                  Get Free Key <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
              {apiKey ? (
                <button
                  onClick={handleRemoveKey}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
                >
                  Clear Key
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveKey}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/25 transition-all"
                >
                  {saveSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Saved!
                    </>
                  ) : (
                    'Save & Connect'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
