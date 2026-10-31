import React from 'react';
import { 
  Flame, 
  ShieldAlert, 
  CheckCircle, 
  ChefHat, 
  CalendarRange, 
  Layers, 
  Sparkles,
  Info,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

const MODULES = [
  {
    id: 'nutrition',
    label: 'Nutrition Scanner',
    subtitle: 'Calorie & Macro Matrix',
    icon: Flame,
    color: 'emerald',
    badge: 'Vision 2.5',
  },
  {
    id: 'freshness',
    label: 'Freshness & Spoilage',
    subtitle: 'Microbial & Shelf-Life AI',
    icon: ShieldAlert,
    color: 'amber',
    badge: 'Biometric',
  },
  {
    id: 'hygiene',
    label: 'Kitchen Hygiene Audit',
    subtitle: 'HACCP Sanitary Compliance',
    icon: CheckCircle,
    color: 'violet',
    badge: 'Commercial',
  },
  {
    id: 'cooking',
    label: 'AI Chef & Recipe Creator',
    subtitle: 'Zero-Waste Culinary Vision',
    icon: ChefHat,
    color: 'amber',
    badge: 'Generative',
  },
  {
    id: 'meal-planner',
    label: 'Biometric Meal Planner',
    subtitle: 'Personalized Macro Protocol',
    icon: CalendarRange,
    color: 'emerald',
    badge: 'Clinical',
  },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-full lg:w-72 shrink-0 border-r border-white/10 bg-[#090D16]/60 backdrop-blur-xl flex flex-col justify-between p-4 lg:min-h-[calc(100vh-65px)]">
      {/* Top Module Nav List */}
      <div>
        <div className="flex items-center justify-between px-3 py-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Multimodal Modules</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            5 Active
          </span>
        </div>

        {/* Tab Buttons */}
        <nav className="space-y-1.5">
          {MODULES.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full group text-left px-3.5 py-3 rounded-2xl flex items-center justify-between transition-all duration-200 border ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/15 via-violet-500/10 to-transparent border-emerald-500/40 text-white shadow-lg shadow-emerald-950/20'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 hover:border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-900/80 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold tracking-tight leading-tight flex items-center gap-1.5">
                      <span>{item.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-mono font-medium px-1.5 py-0.5 rounded-md border transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-900/80 text-slate-500 border-slate-800'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Capabilities / Engine card */}
      <div className="mt-8 pt-4 border-t border-white/10 hidden lg:block">
        <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/10 p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold text-slate-200">Gemini Multimodal</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">Active</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            High-speed computer vision pipeline with strict JSON schema inference, texture spectral analysis, and culinary intelligence.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] font-mono text-slate-400">
            <div className="px-2 py-1 rounded-lg bg-slate-800/80 border border-white/5">
              Lat: <span className="text-emerald-400">~850ms</span>
            </div>
            <div className="px-2 py-1 rounded-lg bg-slate-800/80 border border-white/5">
              JSON: <span className="text-violet-400">Strict</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
