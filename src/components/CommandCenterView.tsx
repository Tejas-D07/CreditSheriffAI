import React from 'react';
import { LayoutDashboard, BarChart3, Sparkles } from 'lucide-react';
import DashboardView from './DashboardView';
import AnalysisView from './AnalysisView';
import RecommendationsView from './RecommendationsView';
import { APILog, OptimizationRecommendation, TraceEvent } from '../types';

interface CommandCenterViewProps {
  logs: APILog[];
  recommendations: OptimizationRecommendation[];
  onNavigateToView: (view: any) => void;
  onAnalysisSuccess: (newRecs: any[], newTraces: TraceEvent[], notice?: string) => void;
  onActionTrigger: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  activeSubTab: 'overview' | 'analysis' | 'recommendations';
  setActiveSubTab: (tab: 'overview' | 'analysis' | 'recommendations') => void;
}

export default function CommandCenterView({
  logs,
  recommendations,
  onNavigateToView,
  onAnalysisSuccess,
  onActionTrigger,
  activeSubTab,
  setActiveSubTab,
}: CommandCenterViewProps) {
  return (
    <div className="space-y-6" id="command-center-container">
      {/* Prime Subnav Tabs bar */}
      <div className="flex border-b border-slate-100 pb-4 items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 uppercase font-heading">
            CFO COMMAND CENTER
          </h2>
          <p className="text-slate-600 font-medium text-xs mt-1">
            Analyze logs, explore optimizations, and model enterprise run-rates.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex border border-slate-800 rounded-2xl overflow-hidden p-1 bg-slate-900 min-w-[450px]">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center space-x-2 ${
              activeSubTab === 'overview'
                ? 'bg-brand-primary text-white font-bold shadow-md shadow-brand-primary/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Executive Overview</span>
          </button>

          <button
            onClick={() => setActiveSubTab('analysis')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center space-x-2 ${
              activeSubTab === 'analysis'
                ? 'bg-brand-primary text-white font-bold shadow-md shadow-brand-primary/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Log Ingestion</span>
          </button>

          <button
            onClick={() => setActiveSubTab('recommendations')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center space-x-2 ${
              activeSubTab === 'recommendations'
                ? 'bg-brand-primary text-white font-bold shadow-md shadow-brand-primary/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Active Plans</span>
          </button>
        </div>
      </div>

      {/* Renders Active Subview */}
      <div>
        {activeSubTab === 'overview' && (
          <DashboardView
            logs={logs}
            recommendations={recommendations}
            onNavigateToView={onNavigateToView}
          />
        )}
        {activeSubTab === 'analysis' && (
          <AnalysisView onAnalysisSuccess={onAnalysisSuccess} />
        )}
        {activeSubTab === 'recommendations' && (
          <RecommendationsView
            recommendations={recommendations}
            onActionTrigger={onActionTrigger}
          />
        )}
      </div>
    </div>
  );
}
