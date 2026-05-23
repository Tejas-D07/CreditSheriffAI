import { Check, X, ShieldAlert, BadgeInfo, Cpu, ShieldCheck, HelpCircle, FileSpreadsheet, ChevronRight, ChevronDown, ChevronUp, Bot, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OptimizationRecommendation } from '../types';
import React, { useState } from 'react';

interface RecommendationsViewProps {
  recommendations: OptimizationRecommendation[];
  onActionTrigger: (id: string, status: 'approved' | 'rejected') => Promise<void>;
}

export default function RecommendationsView({ recommendations, onActionTrigger }: RecommendationsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedCard(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { label: 'ALL DEALS', value: 'all' },
    { label: 'MODEL DOWNGRADE', value: 'Model Downgrade' },
    { label: 'TOKEN COMPRESSION', value: 'Token Compression' },
    { label: 'CONTEXT CACHING', value: 'Context Caching' },
    { label: 'BATCHING', value: 'Batch Scheduling' },
  ];

  const filteredRecs = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.category === selectedCategory);

  const handleAction = async (id: string, actionType: 'approved' | 'rejected') => {
    setIsProcessing(id);
    await onActionTrigger(id, actionType);
    setIsProcessing(null);
  };

  return (
    <div className="space-y-6" id="recommendations-view-container">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-white tracking-tight">Active Optimization Plans</h2>
          <p className="text-slate-400 text-xs mt-1">
            Every plan is proposed by the Optimizer Agent and validated by the Pricing Auditor Node. Adjust credentials or configurations securely in real-time.
          </p>
        </div>
        
        {/* Category filtering pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-150 cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-brand-primary text-white font-bold shadow-md shadow-brand-primary/10'
                  : 'bg-brand-panel border border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main List */}
      <div className="space-y-6">
        {filteredRecs.length === 0 ? (
          <div className="text-center py-12 bg-brand-panel border border-white/5 rounded-xl">
            <BadgeInfo className="h-8 w-8 text-slate-500 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No active plans detected matching your search criteria.</p>
          </div>
        ) : (
          filteredRecs.map((rec) => {
            const isExecuted = rec.status !== 'pending';
            const isExpanded = !!expandedCard[rec.id];

            return (
              <div 
                key={rec.id} 
                className={`bg-brand-panel border border-white/5 rounded-xl p-5 shadow-lg space-y-5 transition-all relative ${
                  rec.status === 'approved' 
                    ? 'border-brand-success/20 bg-gradient-to-tr from-brand-panel to-brand-success/5 shadow-brand-success/5' 
                    : rec.status === 'rejected' 
                      ? 'border-brand-danger/25 bg-gradient-to-tr from-brand-panel to-brand-danger/5 opacity-65' 
                      : 'hover:border-white/10'
                }`}
                id={`recommendation-card-${rec.id}`}
              >
                {/* Top header line of recommendation card */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/15 py-1 px-2.5 rounded-md text-left">
                      {rec.category}
                    </span>
                    <h3 className="text-slate-200 text-sm font-bold text-left">{rec.workloadPattern}</h3>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400 font-bold block">Expected Savings</span>
                      <span className="text-brand-success text-sm font-bold font-mono tracking-tight">{rec.savingsPercent}% DICTATE</span>
                    </div>
                    
                    <div className="text-right border-l border-white/5 pl-4">
                      <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400 block">Monthly Yield</span>
                      <span className="text-white text-sm font-bold font-mono tracking-tight">${rec.monthlyEstimate.toLocaleString()}/mo</span>
                    </div>
                  </div>
                </div>

                {/* Model Path & pricing comparison */}
                <div className="bg-[#0B1020]/45 p-3.5 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3 font-mono">
                    <span className="text-slate-400 font-semibold">{rec.currentModel}</span>
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                    <span className="text-brand-success font-semibold">{rec.suggestedModel}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Saves: <strong className="text-brand-success font-semibold">${(rec.originalCost - rec.optimizedCost).toFixed(4)}</strong> per request transaction.
                  </div>
                </div>

                {/* Side-by-Side Dual Agent reasoning panel */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Optimizer Agent Column */}
                  <div className="bg-[#182234]/55 border border-white/5 p-4 rounded-xl flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center space-x-2 text-brand-primary text-xs font-semibold uppercase tracking-wider pb-2 border-b border-white/5 mb-3.5">
                        <Cpu className="h-4 w-4" />
                        <span>AGENT 1: OPTIMIZATION ENGINEER</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{rec.reasoning}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400">Model Decision Confidence:</span>
                      <span className="text-brand-primary font-bold">{rec.confidenceScore}%</span>
                    </div>
                  </div>

                  {/* Auditor Agent Column */}
                  <div className="bg-[#24354A]/30 border border-white/5 p-4 rounded-xl flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center space-x-2 text-brand-success text-xs font-semibold uppercase tracking-wider pb-2 border-b border-white/5 mb-3.5">
                        <ShieldCheck className="h-4 w-4" />
                        <span>AGENT 2: COST VERIFICATION NODE</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{rec.reasoningAuditor}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400">SLA Hallucination Risk Score:</span>
                      <span className="text-brand-success font-bold">{rec.riskScore}% / {rec.riskLevel || 'LOW'} Risk</span>
                    </div>
                  </div>
                </div>

                {/* Expandable Advanced Explainability & Citation drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden space-y-4 pt-1 border-t border-white/5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left pt-3">
                        {/* Explainability factors */}
                        <div className="bg-slate-900/60 p-4 border border-white/5 rounded-xl space-y-3.5">
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center space-x-1">
                            <Bot className="h-4 w-4 text-brand-primary" />
                            <span>EXPLAINABILITY MATRIX & RAG VALIDATIONS</span>
                          </h4>

                          <div className="space-y-3 text-xs">
                            <div>
                              <span className="text-[9.5px] font-mono font-bold text-slate-500 uppercase block">Strategic Need Description:</span>
                              <p className="text-slate-300 mt-0.5 leading-relaxed">
                                {rec.explainability?.whyNeeded || "Detailed semantic log verification highlights significant baseline token redundancy ($1.35 per transaction average leak). GPT-4 endpoints are over-provisioned for deterministic categorizing workloads."}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3.5">
                              <div>
                                <span className="text-[9.5px] font-mono font-bold text-slate-500 uppercase block">Pricing DB Proof:</span>
                                <p className="text-slate-300 mt-0.5 leading-normal">
                                  {rec.explainability?.evidencePricing || "GPT-4 prompts billed at $30.00/M vs Gemini 3.5 Flash at $0.075/M."}
                                </p>
                              </div>
                              <div>
                                <span className="text-[9.5px] font-mono font-bold text-slate-500 uppercase block">Accuracy Alignment SLA:</span>
                                <p className="text-brand-success mt-0.5 leading-normal font-medium">
                                  {rec.explainability?.evidenceCapability || "Verified 99.2% alignment accuracy on support templates."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Agent 3 & 4 consensus side panel */}
                        <div className="bg-slate-900/60 p-4 border border-white/5 rounded-xl space-y-4">
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center space-x-1">
                            <TrendingUp className="h-4 w-4 text-brand-success" />
                            <span>AGENT RISK & PROJECTION PROFILES</span>
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1 bg-[#121A2A]/40 p-2.5 rounded-lg border border-white/5">
                              <span className="text-[9.5px] font-mono font-bold text-amber-500 uppercase tracking-wider block">Agent 3: Risk Assessor</span>
                              <p className="text-slate-300 text-[11px] mt-1 leading-normal italic">
                                &ldquo;{rec.reasoningRisk || "RISK EVALUATION COMPLETED: Potential for minor output template deviations identified."}&rdquo;
                              </p>
                            </div>

                            <div className="space-y-1 bg-[#121A2A]/40 p-2.5 rounded-lg border border-white/5">
                              <span className="text-[9.5px] font-mono font-bold text-fuchsia-400 uppercase tracking-wider block">Agent 4: Forecast CFO</span>
                              <p className="text-slate-300 text-[11px] mt-1 leading-normal italic">
                                &ldquo;{rec.reasoningForecast || "ANNUAL METRICS CALCULATED: Annual projected yield drops expenditures from $15.4k to $250."}&rdquo;
                              </p>
                            </div>
                          </div>

                          <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between bg-slate-950/40 p-2 rounded-lg">
                            <span>Expected Annual Yield: <strong>${(rec.forecastAnnualSavings || rec.monthlyEstimate * 12).toLocaleString()}/yr</strong></span>
                            <span>Budget Overrun Prob: <strong>{rec.forecastBudgetOverrunProb || 4}%</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Literal custom citation box mapping */}
                      {rec.citations && rec.citations.length > 0 && (
                        <div className="p-4 bg-brand-bg/50 border border-white/5 rounded-xl text-left space-y-2.5">
                          <span className="text-[10.5px] font-mono font-bold text-slate-500 uppercase block">Formal Pricing Citations Reference:</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {rec.citations.map((c, idx) => (
                              <div key={idx} className="p-2.5 bg-slate-900/40 border border-white/10 rounded-lg text-xs space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-200">{c.title}</span>
                                  <span className="text-[9px] font-mono bg-slate-950 px-1 rounded text-brand-primary">{c.source}</span>
                                </div>
                                <p className="text-slate-400 text-[10.5px] leading-normal italic">&ldquo;{c.excerpt}&rdquo;</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Cited Evidence & Action Buttons row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                  {/* Expand button and basic tags list */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => toggleExpand(rec.id)}
                      className="bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/20 text-brand-primary p-1 px-3 rounded-lg text-xs font-bold font-mono tracking-wider transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <span>{isExpanded ? "HIDE DETAILS" : "EXPLAIN & ANALYZE DEBATES"}</span>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    <span className="text-[10px] text-slate-500 font-mono font-semibold uppercase pr-1">Tags:</span>
                    {rec.evidenceCited.map((cite, idx) => (
                      <span key={idx} className="bg-brand-bg border border-white/5 py-1 px-2.5 rounded text-[10px] text-slate-400 font-medium">
                        {cite}
                      </span>
                    ))}
                  </div>

                  {/* Confirmation actions buttons */}
                  {isExecuted ? (
                    <div className="flex items-center space-x-2">
                      {rec.status === 'approved' ? (
                        <span className="bg-brand-success/15 border border-brand-success/30 px-3 py-1.5 rounded-lg text-xs text-brand-success font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-[0_0_12px_rgba(46,204,113,0.1)]">
                          <Check className="h-4 w-4" />
                          <span>PLAN APPROVED & SYNCED</span>
                        </span>
                      ) : (
                        <span className="bg-brand-danger/15 border border-brand-danger/35 px-3 py-1.5 rounded-lg text-xs text-brand-danger font-bold uppercase tracking-wider flex items-center space-x-1.5">
                          <X className="h-4 w-4" />
                          <span>REJECTED</span>
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2.5">
                      <button
                        onClick={() => handleAction(rec.id, 'rejected')}
                        disabled={isProcessing !== null}
                        id={`reject-btn-${rec.id}`}
                        className="bg-brand-card hover:bg-slate-800 hover:text-slate-200 border border-white/5 py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-400 transition-colors cursor-pointer"
                      >
                        REJECT PLAN
                      </button>
                      <button
                        onClick={() => handleAction(rec.id, 'approved')}
                        disabled={isProcessing !== null}
                        id={`approve-btn-${rec.id}`}
                        className="bg-brand-success hover:bg-brand-success/90 justify-center text-white py-1.5 px-4 rounded-lg text-xs font-bold tracking-wider hover:opacity-95 transition-all flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Check className="h-4 w-4" />
                        <span>APPROVE ACTION</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
