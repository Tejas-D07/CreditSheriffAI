import { Play, Eye, Cpu, ShieldCheck, Terminal, AlertTriangle, Layers, CircleDot, Database, CheckSquare, Sparkles, TrendingUp, UploadCloud, ChevronRight, Activity, Info } from 'lucide-react';
import { TraceEvent } from '../types';
import React, { useState } from 'react';

interface ObservabilityViewProps {
  traces: TraceEvent[];
}

export default function ObservabilityView({ traces }: ObservabilityViewProps) {
  const [activeStepFilter, setActiveStepFilter] = useState<string>('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('optimizer');

  const filteredTraces = activeStepFilter === 'all' 
    ? traces 
    : traces.filter(t => t.step === activeStepFilter);

  const steps = [
    'all',
    'Data Ingestion',
    'Pattern Detection',
    'Waste Analysis',
    'RAG Validation',
    'Optimization Planning',
    'Confidence Scoring',
    'Human Approval'
  ];

  // Symmetrical Workflow nodes as requested:
  // Upload -> Parser -> Optimizer -> Knowledge Retrieval -> Auditor -> Risk -> Forecast -> Approval -> Execution
  const workflowNodes = [
    {
      id: 'upload',
      name: 'Upload',
      stepNumber: 1,
      icon: UploadCloud,
      status: 'success', // 'success' | 'active' | 'pending' | 'idle'
      confidence: '100%',
      latency: '15ms',
      tokens: '0',
      description: 'Ingest raw application API interaction logs and transaction datasets.',
      details: 'Secure JSON payload parses logs into multi-tenant streams.'
    },
    {
      id: 'parser',
      name: 'Parser',
      stepNumber: 2,
      icon: Layers,
      status: 'success',
      confidence: '99.8%',
      latency: '24ms',
      tokens: '14,200',
      description: 'Structured parsing of systemic payloads & schema models.',
      details: 'Converts unstructured strings into clean mathematical representations.'
    },
    {
      id: 'optimizer',
      name: 'Optimizer',
      stepNumber: 3,
      icon: Sparkles,
      status: 'success',
      confidence: '96.5%',
      latency: '185ms',
      tokens: '4,500',
      description: 'Identify model downgrades, context slashes and pattern rules.',
      details: 'Scans redundant variables using heuristic optimization networks.'
    },
    {
      id: 'knowledge',
      name: 'Knowledge Retrieval',
      stepNumber: 4,
      icon: Database,
      status: 'active', // Glows while active!
      confidence: '99.1%',
      latency: '142ms',
      tokens: '12,000',
      description: 'Semantic vector similarity searches & SLA guidelines checking.',
      details: 'Retrieves active customer pricing agreements from context store.'
    },
    {
      id: 'auditor',
      name: 'Auditor',
      stepNumber: 5,
      icon: ShieldCheck,
      status: 'pending',
      confidence: '99.2%',
      latency: 'Pending',
      tokens: 'Pending',
      description: 'Verification of potential pricing boost metrics.',
      details: 'Double-checks mathematical models to protect SLA guidelines.'
    },
    {
      id: 'risk',
      name: 'Risk',
      stepNumber: 6,
      icon: AlertTriangle,
      status: 'pending',
      confidence: '94.0%',
      latency: 'Queued',
      tokens: 'Queued',
      description: 'Evaluate temperature and formatting template regression profiles.',
      details: 'Strict validation against low-bound risk tolerances.'
    },
    {
      id: 'forecast',
      name: 'Forecast',
      stepNumber: 7,
      icon: TrendingUp,
      status: 'pending',
      confidence: '98.2%',
      latency: 'Queued',
      tokens: 'Queued',
      description: 'CFO simulation rules running for forward multi-year models.',
      details: 'Calculates run-rate liabilities drops across standard templates.'
    },
    {
      id: 'approval',
      name: 'Approval',
      stepNumber: 8,
      icon: CheckSquare,
      status: 'idle',
      confidence: 'Requires Human Override',
      latency: 'Waiting',
      tokens: 'Waiting',
      description: 'Interactive checklist delivery waiting for executive clearance.',
      details: 'Pushes notification payload to Slack and Jira dashboards.'
    },
    {
      id: 'execution',
      name: 'Execution',
      stepNumber: 9,
      icon: Play,
      status: 'idle',
      confidence: 'Blocked',
      latency: 'Idle',
      tokens: 'Idle',
      description: 'Trigger autonomous Terraform patches & pull-request commits.',
      details: 'Commits production configurations to active clusters.'
    }
  ];

  const selectedNode = workflowNodes.find(n => n.id === selectedNodeId) || workflowNodes[2];

  return (
    <div className="space-y-6 select-none relative animate-pulse-subtle" id="observability-container">
      {/* Background glow overlay */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* View Header */}
      <div>
        <h2 className="text-xl font-bold font-heading text-white tracking-tight flex items-center space-x-2">
          <Activity className="h-5 w-5 text-brand-primary animate-pulse" />
          <span className="uppercase tracking-wide">AI Observability Mission Control</span>
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          Observe live neural data flow graphs, audit step metrics, trace execution latencies, and confirm absolute prompt compliance.
        </p>
      </div>

      {/* 1. OBSERVABILITY COMMAND NEURAL EXECUTION GRAPH */}
      <div className="bg-[#0D132D]/75 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
          <h3 className="text-xs font-bold tracking-widest text-[#8A9FB4] uppercase font-mono">NEURAL PIPELINE RUNTIME ENVIRONMENT</h3>
          <span className="text-[10px] font-mono text-slate-400">Step Ingest Tracker: v2.4</span>
        </div>
        
        {/* Horizontal linear workflow scroller */}
        <div className="relative py-8 px-4 flex items-center justify-between overflow-x-auto gap-4 scrollbar-thin scrollbar-thumb-brand-primary scrollbar-track-transparent rounded-2xl bg-[#050816]/75 border border-white/5 shadow-inner">
          
          {/* Symmetrical workflow nodes */}
          {workflowNodes.map((node, index) => {
            const IconComponent = node.icon;
            const isSelected = selectedNodeId === node.id;
            
            // Status styling parameters
            let statusColorClass = '';
            let ringColorClass = '';
            let dotGlow = '';
            
            if (node.status === 'success') {
              statusColorClass = 'text-brand-success bg-brand-success/10 border-brand-success/25';
              ringColorClass = 'group-hover:border-brand-success/60';
              dotGlow = 'bg-brand-success shadow-[0_0_8px_#00E676]';
            } else if (node.status === 'active') {
              statusColorClass = 'text-brand-primary bg-brand-primary/20 border-brand-primary/40 animate-pulse-subtle';
              ringColorClass = 'border-brand-primary shadow-[0_0_15px_rgba(79,140,255,0.2)]';
              dotGlow = 'bg-brand-primary shadow-[0_0_12px_#4F8CFF]';
            } else if (node.status === 'pending') {
              statusColorClass = 'text-brand-warning bg-brand-warning/10 border-brand-warning/20';
              ringColorClass = 'group-hover:border-brand-warning/45';
              dotGlow = 'bg-brand-warning';
            } else {
              statusColorClass = 'text-slate-500 bg-slate-900 border-white/5';
              ringColorClass = 'border-transparent';
              dotGlow = 'bg-slate-600';
            }

            return (
              <React.Fragment key={node.id}>
                {/* Node Interactive Capsule */}
                <button
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`flex flex-col items-center space-y-3 shrink-0 p-3 rounded-2xl border transition-all duration-300 relative group cursor-pointer ${
                    isSelected 
                      ? 'bg-[#141C3F] border-brand-primary/60 shadow-[0_0_20px_rgba(79,140,255,0.22)] scale-105 z-10' 
                      : 'bg-transparent border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className={`h-12 w-12 rounded-full border flex items-center justify-center transition-all ${statusColorClass} ${ringColorClass}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-[11px] font-bold text-white block leading-none">{node.name}</p>
                    <span className="text-[8px] font-mono text-slate-500 block mt-1">STEP 0{node.stepNumber}</span>
                  </div>

                  {/* Little state neon dot */}
                  <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${dotGlow}`} />
                </button>

                {/* Arrow connecting next nodes except the last */}
                {index < workflowNodes.length - 1 && (
                  <div className="text-slate-650 shrink-0 font-mono text-[11px] select-none flex items-center">
                    <ChevronRight className="h-3.5 w-3.5 text-slate-700 animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Selected Node Telemetry parameters card */}
        <div className="mt-6 bg-[#050816]/70 border border-brand-primary/10 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#8A9FB4] uppercase bg-brand-primary/10 px-2 py-0.5 rounded border border-brand-primary/20">
                Active Telemetry: Step 0{selectedNode.stepNumber}
              </span>
              <span className="text-white text-xs font-bold font-heading">{selectedNode.name} Node Details</span>
            </div>
            <p className="text-slate-300 text-xs">{selectedNode.description}</p>
            <p className="text-slate-500 text-[10.5px] font-mono leading-none pt-0.5">{selectedNode.details}</p>
          </div>

          <div className="flex items-center space-x-4 font-mono text-xs shrink-0 self-stretch md:self-auto bg-[#0D132D] p-3 rounded-2xl border border-white/5">
            <div className="text-center px-4 border-r border-white/5">
              <span className="text-[9px] text-slate-500 uppercase block font-bold">Latency</span>
              <span className="font-bold text-white text-[12px] block mt-0.5">{selectedNode.latency}</span>
            </div>
            <div className="text-center px-4 border-r border-white/5">
              <span className="text-[9px] text-slate-500 uppercase block font-bold">Confidence</span>
              <span className="font-bold text-[#00E676] text-[12px] block mt-0.5">{selectedNode.confidence}</span>
            </div>
            <div className="text-center px-2">
              <span className="text-[9px] text-slate-500 uppercase block font-bold">Token Cost Index</span>
              <span className="font-bold text-brand-primary text-[12px] block mt-0.5">{selectedNode.tokens}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TELEMETRY TRACES REAL-TIME HISTORICAL LOG DUMP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="observability-bottom-grid">
        {/* Real-time traces filtering list */}
        <div className="lg:col-span-8 bg-[#0D132D]/75 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-3">
            <span className="text-xs font-bold tracking-widest text-[#8A9FB4] uppercase flex items-center space-x-2 font-mono">
              <Terminal className="h-4.5 w-4.5 text-brand-primary animate-pulse" />
              <span>Observability Log Telemetry</span>
            </span>

            {/* Inbound Log Filters */}
            <div className="flex items-center space-x-2">
              <span className="text-[9.5px] font-mono text-slate-400 font-semibold">FILTER STEP:</span>
              <select 
                value={activeStepFilter}
                onChange={(e) => setActiveStepFilter(e.target.value)}
                className="bg-[#050816] border border-white/10 text-xs rounded-lg p-1 px-2.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer font-mono"
              >
                {steps.map(s => (
                  <option key={s} value={s}>{s.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Trace event loop */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {filteredTraces.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-10 font-mono">No raw trace logs matches standard selector rules.</p>
            ) : (
              filteredTraces.map((trace) => {
                const isErr = trace.category === 'error';
                const isWarn = trace.category === 'warning';
                const isSuccess = trace.category === 'success';

                return (
                  <div 
                    key={trace.id} 
                    className="p-4 bg-[#050816]/75 border border-white/5 rounded-2xl flex items-start justify-between hover:border-brand-primary/20 transition-all gap-4 shadow-md"
                  >
                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[8px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full uppercase ${
                          isErr ? 'bg-brand-danger/20 text-brand-danger border border-brand-danger/10' : isWarn ? 'bg-brand-warning/20 text-brand-warning border border-brand-warning/10' : 'bg-brand-success/15 text-brand-success border border-brand-success/10'
                        }`}>
                          {trace.step}
                        </span>
                        
                        <span className="text-[9px] text-[#8A9FB4] font-bold uppercase tracking-widest font-mono">
                          ({trace.agent.toUpperCase()} NODE)
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-mono">{trace.message}</p>
                    </div>

                    <div className="text-right shrink-0 font-mono">
                      <span className="text-[10px] text-slate-300 block font-bold">{trace.timestamp}</span>
                      <span className="text-[9px] text-slate-500">{trace.latencyMs}ms latency</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Telemetry charts stats bench */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0D132D]/75 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#8A9FB4] font-mono border-b border-white/5 pb-2">Auditor Benchmarks</h3>
            
            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="text-slate-400">Avg Decision Latency</span>
                <span className="text-slate-200 font-bold">420ms</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="text-slate-400">Tokenizer Capacity</span>
                <span className="text-slate-200 font-bold">14,200 t/s</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="text-slate-400">Pricing Oracle hits</span>
                <span className="text-[#00E676] font-bold uppercase">100% SLA</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Telemetry size Verified</span>
                <span className="text-[#4F8CFF] font-bold">14.5M Tokens</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#101535] to-brand-purple/5 border border-brand-purple/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center space-x-1.5 mb-2">
              <Info className="h-4 w-4 text-brand-primary shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-white font-mono">Embedding State</h3>
            </div>
            <p className="text-[10.5px] text-slate-450 leading-relaxed font-sans">
              Active vector database stores semantic validation rules to safeguard LLM agents against pricing regressions in real-time.
            </p>
            <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden relative">
              <div className="absolute inset-0 bg-brand-primary/10 w-full animate-pulse" />
              <div className="h-full bg-gradient-to-r from-brand-primary to-brand-purple rounded-full" style={{ width: '92%' }} />
            </div>
            <span className="text-[9.5px] font-mono text-slate-500 block mt-2 font-bold uppercase">ACCURACY RATING: 99.2%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
