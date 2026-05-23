import React from 'react';
import { PlaySquare, Eye } from 'lucide-react';
import ExecutionCenterView from './ExecutionCenterView';
import ObservabilityView from './ObservabilityView';
import { ExecutableTask, TraceEvent } from '../types';

interface MissionControlViewProps {
  tasks: ExecutableTask[];
  onExecuteTask: (id: string) => Promise<void>;
  traces: TraceEvent[];
  activeSubTab: 'deployer' | 'telemetry';
  setActiveSubTab: (tab: 'deployer' | 'telemetry') => void;
}

export default function MissionControlView({
  tasks,
  onExecuteTask,
  traces,
  activeSubTab,
  setActiveSubTab,
}: MissionControlViewProps) {
  return (
    <div className="space-y-6" id="mission-control-container">
      {/* Prime Subnav Tabs bar */}
      <div className="flex border-b border-slate-100 pb-4 items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 uppercase font-heading">
            MISSION CONTROL
          </h2>
          <p className="text-slate-600 font-medium text-xs mt-1">
            Dispatch DevOps actions, execute approved pull-requests, and review runtime trace logs.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex border border-slate-800 rounded-2xl overflow-hidden p-1 bg-slate-900 min-w-[320px]">
          <button
            onClick={() => setActiveSubTab('deployer')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center space-x-2 ${
              activeSubTab === 'deployer'
                ? 'bg-brand-primary text-white font-bold shadow-md shadow-brand-primary/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlaySquare className="h-3.5 w-3.5" />
            <span>DevOps Deployer</span>
          </button>

          <button
            onClick={() => setActiveSubTab('telemetry')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center space-x-2 ${
              activeSubTab === 'telemetry'
                ? 'bg-brand-primary text-white font-bold shadow-md shadow-brand-primary/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Runtime Telemetry</span>
          </button>
        </div>
      </div>

      {/* Renders Selected Subview */}
      <div>
        {activeSubTab === 'deployer' && (
          <ExecutionCenterView tasks={tasks} onExecuteTask={onExecuteTask} />
        )}
        {activeSubTab === 'telemetry' && (
          <ObservabilityView traces={traces} />
        )}
      </div>
    </div>
  );
}
