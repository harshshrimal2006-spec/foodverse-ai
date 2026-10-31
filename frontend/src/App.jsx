import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NutritionModule from './components/NutritionModule';
import FreshnessModule from './components/FreshnessModule';
import HygieneModule from './components/HygieneModule';
import CookingModule from './components/CookingModule';
import MealPlannerModule from './components/MealPlannerModule';
import { getSavedApiKey } from './api/foodverseApi';
import { Sparkles, Heart, ShieldCheck, Cpu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('nutrition');
  const [selectedModel, setSelectedModel] = useState("gemini-3.5-flash-lite");
  const [apiKey, setApiKey] = useState(getSavedApiKey());

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Header */}
      <Header
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />

      {/* Main Body */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1700px] mx-auto">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'nutrition' && (
            <NutritionModule selectedModel={selectedModel} apiKey={apiKey} />
          )}
          {activeTab === 'freshness' && (
            <FreshnessModule selectedModel={selectedModel} apiKey={apiKey} />
          )}
          {activeTab === 'hygiene' && (
            <HygieneModule selectedModel={selectedModel} apiKey={apiKey} />
          )}
          {activeTab === 'cooking' && (
            <CookingModule selectedModel={selectedModel} apiKey={apiKey} />
          )}
          {activeTab === 'meal-planner' && (
            <MealPlannerModule selectedModel={selectedModel} apiKey={apiKey} />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#06090F] px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>FoodVerse AI Engine &bull; Powered by Google Gemini 2.5 Multimodal Architecture</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> HACCP Certified Model
          </span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-violet-400" /> Sub-second Latency
          </span>
        </div>
      </footer>
    </div>
  );
}
