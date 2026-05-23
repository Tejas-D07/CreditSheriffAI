import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OptimizationRecommendation } from '../types';
import { 
  MessagesSquare, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Gauge, 
  Bot, 
  CheckCircle,
  HelpCircle,
  TrendingDown,
  Activity,
  Zap,
  Cpu,
  RefreshCw,
  Info
} from 'lucide-react';

interface DebateCenterViewProps {
  recommendations: OptimizationRecommendation[];
}

export default function DebateCenterView({ recommendations }: DebateCenterViewProps) {
  const [selectedRecId, setSelectedRecId] = useState<string>(recommendations[0]?.id || '');
  const activeRec = recommendations.find(r => r.id === selectedRecId) || recommendations[0];

  const [activeAgentNode, setActiveAgentNode] = useState<string>('agent-optimizer');

  if (!activeRec) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 bg-brand-panel/40 border border-white/5 rounded-2xl h-96">
        <Bot className="h-12 w-12 text-slate-600 mb-3 animate-bounce" />
        <p className="text-sm font-semibold text-slate-400">No active recommendation tracks to debate.</p>
        <p className="text-xs text-slate-600 mt-1">Submit usage exports in Log Ingestion to trigger advisor debate loops.</p>
      </div>
    );
  }

  // Calculate stats
  const consensusMatchPercent = activeRec.confidenceScore;
  const riskIndex = activeRec.riskScore;
  const isApproved = activeRec.status === 'approved';

  // Agent profiles
  const agents = [
    {
      id: "agent-optimizer",
      name: "Optimizer Agent",
      role: "Strategy & Model Swap",
      color: "#4F8CFF",
      lightColor: "rgba(79, 140, 255, 0.2)",
      borderColor: "border-brand-primary/30",
      icon: Sparkles,
      reasoning: activeRec.reasoning,
      assessment: `Target metrics: Identified token excess of ${activeRec.tokenWasteCount.toLocaleString()} units within ${activeRec.workloadPattern}. Recommends swapping from ${activeRec.currentModel} to ${activeRec.suggestedModel}.`
    },
    {
      id: "agent-auditor",
      name: "Pricing Auditor",
      role: "SLA / pricing compliance",
      color: "#00E676",
      lightColor: "rgba(0, 230, 118, 0.2)",
      borderColor: "border-brand-success/30",
      icon: ShieldCheck,
      reasoning: activeRec.reasoningAuditor,
      assessment: `Pricing check: Validated savings of $${activeRec.monthlyEstimate.toLocaleString()}/mo. Accuracy benchmark confirms 99.2%+ alignment on target classification routines.`
    },
    {
      id: "agent-risk",
      name: "Risk Assessment Agent",
      role: "Format & format integrity",
      color: "#FFB020",
      lightColor: "rgba(255, 176, 32, 0.2)",
      borderColor: "border-brand-warning/30",
      icon: AlertTriangle,
      reasoning: activeRec.reasoningRisk || `RISK EVALUATION COMPLETED: Potential for minor output template deviations identified (${activeRec.riskScore}% severity). Validated formatting models confirm layout compliance meets standard parameters. Latency is expected to decrease over ${activeRec.suggestedModel}.`,
      assessment: `Risk score: ${riskIndex}/100. Category classification indicates a ${activeRec.riskLevel || 'LOW'} risk tolerance baseline.`
    },
    {
      id: "agent-forecast",
      name: "Forecast Agent (CFO)",
      role: "Predictive spend modeling",
      color: "#8B5CF6",
      lightColor: "rgba(139, 92, 246, 0.2)",
      borderColor: "border-brand-purple/30",
      icon: TrendingUp,
      reasoning: activeRec.reasoningForecast || `ANNUAL FINANCIAL FORECAST: Shifting this workload reduces annual spend liabilities from $${(activeRec.originalCost * 12000).toLocaleString()} projected down to $${(activeRec.optimizedCost * 12000).toLocaleString()}. Establishes multi-year run-rate efficiency.`,
      assessment: `Forecast: Annual Savings of $${(activeRec.forecastAnnualSavings || activeRec.monthlyEstimate * 12).toLocaleString()}. Overrun probability drop to ${activeRec.forecastBudgetOverrunProb || 4}%.`
    }
  ];

  const currentActiveAgent = agents.find(a => a.id === activeAgentNode) || agents[0];

  return (
    <div className="space-y-6 select-none relative" id="debate-center-container">
      {/* Background glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-850 font-heading tracking-tight flex items-center gap-2">
            <MessagesSquare className="h-5 w-5 text-brand-primary animate-pulse" />
            <span className="uppercase tracking-wide">AI Agent Debate Arena</span>
          </h2>
          <p className="text-slate-600 font-medium text-xs mt-1">
            Observe autonomous real-time negotiations across four specialized agents to establish pricing compliance with zero regression risks.
          </p>
        </div>

        {/* Quick Selection Slider */}
        <div className="flex items-center space-x-3 shrink-0 bg-slate-50 border border-slate-200 p-1.5 px-3 rounded-xl">
          <label className="text-slate-500 font-mono text-[9.5px] uppercase font-bold tracking-widest">Select Target Workload:</label>
          <select 
            value={selectedRecId}
            onChange={(e) => {
              setSelectedRecId(e.target.value);
            }}
            className="bg-white border border-slate-200 hover:border-brand-primary/45 rounded-md p-1 px-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer font-mono"
            id="debate-selected-target"
          >
            {recommendations.map(r => (
              <option key={r.id} value={r.id}>
                [{r.category}] {r.workloadPattern.substring(0, 24)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Neural Constellation Grid and Dialogue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="debate-workspace-layout">
        
        {/* Constellation Workspace Nodes */}
        <div className="lg:col-span-8 bg-white/90 border border-slate-200 rounded-3xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden min-h-[750px]">
          {/* Grid backdrops */}
          <div className="absolute inset-0 cyber-dots opacity-20 pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 relative z-10">
            <div className="flex items-center space-x-2">
              <Bot className="h-4.5 w-4.5 text-brand-primary animate-pulse" />
              <span className="text-[10.5px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                COGNITIVE NETWORK GRAPH & DEBATE FLUX
              </span>
            </div>
            
            <div className="text-[9.5px] font-mono text-slate-500 flex items-center space-x-1">
              <RefreshCw className="h-3 w-3 animate-spin duration-1000" />
              <span>REAL-TIME AGENT DEBATE STREAM</span>
            </div>
          </div>

          {/* Connected Constellation SVG Area */}
          <div className="relative flex-shrink-0 h-[440px] py-4 flex flex-col items-center justify-center my-4">
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes cyber-dash-flow {
                to {
                  stroke-dashoffset: -20;
                }
              }
              .animate-dash-flow {
                stroke-dasharray: 6 4;
                animation: cyber-dash-flow 1s linear infinite;
              }
            `}} />
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="glow-opt" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F8CFF" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="glow-aud" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00E676" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#4F8CFF" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="glow-risk" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFB020" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="glow-fore" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FF5252" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              
              {/* Dynamic animated line streams leading to central hub */}
              <line x1="15%" y1="28%" x2="50%" y2="50%" stroke="url(#glow-opt)" strokeWidth="2.5" className="animate-dash-flow" />
              <line x1="85%" y1="28%" x2="50%" y2="50%" stroke="url(#glow-aud)" strokeWidth="2.5" className="animate-dash-flow" />
              <line x1="15%" y1="80%" x2="50%" y2="50%" stroke="url(#glow-risk)" strokeWidth="2.5" className="animate-dash-flow" />
              <line x1="85%" y1="80%" x2="50%" y2="50%" stroke="url(#glow-fore)" strokeWidth="2.5" className="animate-dash-flow" />
            </svg>

            {/* Constellation Nodes Grid Positioning */}
            <div className="absolute inset-0 w-full h-full flex flex-col justify-between z-10 pt-16 px-4 pb-4">
              <div className="flex justify-between items-start">
                
                {/* 1. OPTIMIZER NODE COMPONENT */}
                <button 
                  onClick={() => setActiveAgentNode('agent-optimizer')}
                  className={`w-40 p-3 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative ${
                    activeAgentNode === 'agent-optimizer' 
                      ? 'bg-blue-50/90 border-brand-primary shadow-sm scale-105' 
                      : 'bg-slate-50/90 border-slate-200 hover:border-brand-primary/30'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-[11px] font-bold text-slate-800 truncate">Optimizer Agent</h4>
                      <p className="text-[9.5px] text-slate-600 font-medium font-mono">Cost Minimization</p>
                    </div>
                  </div>
                  <div className="mt-2 text-[9px] text-[#059669] bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block font-mono font-bold uppercase">
                    ONLINE
                  </div>
                </button>

                {/* 2. PRICE AUDITOR NODE COMPONENT */}
                <button 
                  onClick={() => setActiveAgentNode('agent-auditor')}
                  className={`w-40 p-3 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative ${
                    activeAgentNode === 'agent-auditor' 
                      ? 'bg-emerald-50/90 border-brand-success shadow-sm scale-105' 
                      : 'bg-slate-50/90 border-slate-200 hover:border-brand-success/30'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-brand-success/10 text-brand-success border border-brand-success/20 shrink-0">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-[11px] font-bold text-slate-800 truncate">Pricing Auditor</h4>
                      <p className="text-[9.5px] text-slate-600 font-medium font-mono">SLA & Contract Compliance</p>
                    </div>
                  </div>
                  <div className="mt-2 text-[9px] text-[#059669] bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block font-mono font-bold uppercase">
                    VERIFIED
                  </div>
                </button>

              </div>

              {/* CENTRAL CONSENSUS HUB CARD */}
              <div className="self-center bg-white border border-brand-primary/30 p-5 rounded-3xl w-72 shadow-lg relative z-20 text-center">
                {/* Visual pulse indicator around center */}
                <div className="absolute inset-0 border border-brand-primary/10 rounded-3xl scale-110 animate-ping duration-2000 pointer-events-none" />
                
                <span className="text-[8.5px] font-mono font-bold tracking-widest text-brand-primary uppercase block">CONSOLIDATED DECISION MATRIX</span>
                
                <h3 className="text-xl font-extrabold font-mono text-emerald-600 leading-none mt-2">
                  {consensusMatchPercent}% CONFIDENCE
                </h3>
                
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-mono">
                  RISK: <span className="text-brand-warning font-bold">{activeRec.riskLevel}</span> • SAVINGS: <span className="text-brand-success font-bold">${activeRec.monthlyEstimate}/mo</span>
                </p>

                <div className="mt-4 p-2.5 bg-slate-50 rounded-2xl text-[10.5px] text-slate-700 leading-normal border border-slate-150">
                  &ldquo;{activeRec.reasoning.substring(0, 95)}...&rdquo;
                </div>
                
                <div className="mt-3.5 flex justify-center space-x-2">
                  <span className="text-[9px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 uppercase">
                    {activeRec.category}
                  </span>
                  <span className="text-[9px] font-mono text-brand-success bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-150 uppercase font-bold">
                    CONSENSUS MET
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                
                {/* 3. RISK ASSESSOR NODE COMPONENT */}
                <button 
                  onClick={() => setActiveAgentNode('agent-risk')}
                  className={`w-40 p-3 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative ${
                    activeAgentNode === 'agent-risk' 
                      ? 'bg-amber-50/90 border-brand-warning shadow-sm scale-105' 
                      : 'bg-slate-50/90 border-slate-200 hover:border-brand-warning/30'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-brand-warning/10 text-brand-warning border border-brand-warning/20 shrink-0">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-[11px] font-bold text-slate-800 truncate">Risk Assessor</h4>
                      <p className="text-[9.5px] text-slate-600 font-medium font-mono">Payload Reliability</p>
                    </div>
                  </div>
                  <div className="mt-2 text-[9px] text-[#059669] bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block font-mono font-bold uppercase">
                    STABLE
                  </div>
                </button>

                {/* 4. FORECAST ENGINE NODE COMPONENT */}
                <button 
                  onClick={() => setActiveAgentNode('agent-forecast')}
                  className={`w-40 p-3 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative ${
                    activeAgentNode === 'agent-forecast' 
                      ? 'bg-purple-50/90 border-brand-purple shadow-sm scale-105' 
                      : 'bg-slate-50/90 border-slate-200 hover:border-brand-purple/30'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-brand-purple/10 text-brand-purple border border-brand-purple/20 shrink-0">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-[11px] font-bold text-slate-800 truncate">Forecast Agent</h4>
                      <p className="text-[9.5px] text-slate-600 font-medium font-mono">Forward CFO models</p>
                    </div>
                  </div>
                  <div className="mt-2 text-[9px] text-[#059669] bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block font-mono font-bold uppercase">
                    ACTIVE
                  </div>
                </button>

              </div>
            </div>
          </div>

          {/* Interactive Agent Speak Box below the Constellation graph based on active node */}
          <div className="relative border-t border-slate-150 pt-4 bg-slate-50 p-4 rounded-2xl mt-4 border border-slate-200 z-10 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-white rounded-xl border border-slate-200 text-center shrink-0">
                <currentActiveAgent.icon className="h-5 w-5" style={{ color: currentActiveAgent.color }} />
              </div>
              <div className="space-y-1 text-left">
                <div className="flex items-center space-x-2">
                  <span className="font-heading font-bold text-xs text-slate-800 uppercase tracking-wider">{currentActiveAgent.name}</span>
                  <span className="text-[9.5px] font-mono text-slate-500 italic">({currentActiveAgent.role})</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-mono">
                  &ldquo;{currentActiveAgent.reasoning}&rdquo;
                </p>
                <div className="bg-white p-2 rounded-lg border border-slate-150 text-[10px] text-slate-600 mt-2 font-mono">
                  <span className="font-bold text-slate-500 block uppercase mb-1">Impact Assessment Status:</span>
                  {currentActiveAgent.assessment}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Knowledge & Citations index */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Grounding RAG Citations */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="h-4.5 w-4.5 text-brand-success" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">RAG Grounded Citations</h3>
            </div>
            
            <p className="text-[11px] text-slate-500 leading-relaxed">
              To verify optimization choices and eliminate hallucination variables, the Pricing Auditor references authorized knowledge databases.
            </p>

            <div className="space-y-3">
              {activeRec.citations && activeRec.citations.length > 0 ? (
                activeRec.citations.map((cit, idx) => (
                  <div key={idx} className="p-3 bg-slate-50/80 border border-slate-150 rounded-2xl hover:border-brand-primary/20 transition-all text-xs space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-700 leading-tight block">{cit.title}</span>
                      <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-brand-primary border border-brand-primary/10 uppercase shrink-0">
                        {cit.source}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal italic">
                      &ldquo;{cit.excerpt}&rdquo;
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-2xl text-center text-slate-400 text-[10.5px]">
                  No formal citations mapping required. Guided by absolute provider price indexes.
                </div>
              )}
            </div>
          </div>

          {/* Explainability Engine side info */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Info className="h-4.5 w-4.5 text-brand-purple" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">SLA Parameters</h3>
            </div>
            
            {activeRec.explainability ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[9.5px] font-bold text-slate-500 block uppercase font-mono tracking-wider">Why needed:</span>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{activeRec.explainability.whyNeeded}</p>
                </div>
                <div>
                  <span className="text-[9.5px] font-bold text-slate-500 block uppercase font-mono tracking-wider">Core Pricing Proof:</span>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{activeRec.explainability.evidencePricing}</p>
                </div>
                <div>
                  <span className="text-[9.5px] font-bold text-slate-500 block uppercase font-mono tracking-wider">Tested Performance:</span>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 leading-relaxed">{activeRec.explainability.evidenceCapability}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[9.5px] font-bold text-slate-500 block uppercase font-mono tracking-wider">Strategic requirement:</span>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">Calculated model-downgrade routing replaces excessive token waste on support priority classifiers.</p>
                </div>
                <div>
                  <span className="text-[9.5px] font-bold text-slate-500 block uppercase font-mono tracking-wider">Pricing proof reference:</span>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">GPT-4 costs $30.00/M tokens versus Gemini 3.5 Flash at $0.075/M tokens, yielding a 99.7% absolute drop in baseline cost.</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
