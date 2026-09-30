import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ArrowRight, Activity, Users, Zap, Building } from 'lucide-react';
import { ThreeBackground } from './ThreeBackground';

export const LandingView: React.FC = () => {
  const { setActiveView, theme } = useApp();

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col relative overflow-hidden">
      {/* Interactive Three.js Background */}
      <ThreeBackground />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center py-20 pointer-events-none">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--brand-600)]/30 bg-[var(--brand-600)]/10 text-[var(--brand-600)] text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in pointer-events-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>LokDrishti Civic Intelligence Network</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-6 leading-tight animate-slide-up">
          Civic Intelligence. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[var(--brand-500)]">
            Powered by the People.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
          Report infrastructure issues, verify signals, and hold authorities accountable through a privacy-first, AI-driven public transparency engine.
        </p>

        {/* Dual CTA Entry points */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-2xl animate-slide-up pointer-events-auto" style={{ animationDelay: '200ms' }}>
          
          <button
            onClick={() => setActiveView('home')}
            className="w-full sm:w-1/2 p-1 rounded-2xl bg-gradient-to-br from-[var(--brand-600)] to-[var(--brand-500)] hover:scale-[1.02] active:scale-[0.98] transition-transform group shadow-lg shadow-[var(--brand-600)]/20"
          >
            <div className="bg-neutral-950/20 backdrop-blur-sm rounded-xl p-6 h-full flex flex-col items-center justify-center gap-3">
              <Users className="w-8 h-8 text-white" />
              <div className="text-center">
                <div className="text-lg font-bold text-white mb-1">Citizen Portal</div>
                <div className="text-xs text-emerald-100/70 font-medium">Report issues & track local clusters</div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors group-hover:translate-x-1" />
            </div>
          </button>

          <button
            onClick={() => setActiveView('gov-console')}
            className="w-full sm:w-1/2 p-1 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 hover:scale-[1.02] active:scale-[0.98] transition-transform group border border-neutral-800 hover:border-neutral-700"
          >
            <div className="bg-neutral-950 rounded-xl p-6 h-full flex flex-col items-center justify-center gap-3">
              <Building className="w-8 h-8 text-neutral-400 group-hover:text-white transition-colors" />
              <div className="text-center">
                <div className="text-lg font-bold text-neutral-200 mb-1 group-hover:text-white transition-colors">Gov Node Login</div>
                <div className="text-xs text-neutral-500 font-medium">Authorized SLA & operations center</div>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors group-hover:translate-x-1" />
            </div>
          </button>
        </div>

        {/* Live Metrics Row */}
        <div className="mt-20 pt-10 border-t border-neutral-800/50 w-full grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div>
            <div className="text-3xl font-black text-white tabular-nums">42.8k</div>
            <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mt-1">Signals Processed</div>
          </div>
          <div>
            <div className="text-3xl font-black text-white tabular-nums">1.2k</div>
            <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mt-1">Active Clusters</div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-400 tabular-nums">94%</div>
            <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mt-1">AI Accuracy</div>
          </div>
          <div>
            <div className="text-3xl font-black text-white tabular-nums flex items-center justify-center gap-2">
              <Activity className="w-5 h-5 text-rose-500 animate-pulse" />
              <span>LIVE</span>
            </div>
            <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mt-1">System Status</div>
          </div>
        </div>

      </div>
    </div>
  );
};
