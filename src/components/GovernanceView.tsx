import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Cpu, 
  Plus, 
  Sparkles, 
  Trash2, 
  Sliders, 
  Lock,
  GitPullRequestDraft,
  XCircle,
  TrendingDown,
  Activity,
  ShieldCheck,
  CheckSquare,
  ClipboardList,
  Flame,
  X
} from 'lucide-react';

interface Policy {
  id: string;
  name: string;
  category: 'LLM Selection' | 'Token Ceiling' | 'Billing Rule' | 'Caching Mandate';
  scope: string; 
  allowableModels: string[];
  maxTokens: number;
  status: 'active' | 'evaluating';
}

const INITIAL_POLICIES: Policy[] = [
  {
    id: "GP-101",
    name: "Model Downgrade Mandate on Text extraction",
    category: "LLM Selection",
    scope: "Simple Classifier / Priorities routing",
    allowableModels: ["gemini-3.5-flash", "gpt-4o-mini"],
    maxTokens: 5000,
    status: "active"
  },
  {
    id: "GP-102",
    name: "Context Caching for Repeating Manuals",
    category: "Caching Mandate",
    scope: "QA / Documentation Retrieval",
    allowableModels: ["gemini-1.5-pro", "gemini-1.5-flash"],
    maxTokens: 500000,
    status: "active"
  },
  {
    id: "GP-103",
    name: "Token Compressing Threshold on Chatboards",
    category: "Token Ceiling",
    scope: "Multiturn Customer Chatbots",
    allowableModels: ["gpt-4o-mini", "claude-3.5-sonnet"],
    maxTokens: 12000,
    status: "active"
  },
  {
    id: "GP-104",
    name: "Batch Endpoint Restriction for overnight tasks",
    category: "Billing Rule",
    scope: "Nightly Analytics / Indexing Runs",
    allowableModels: ["claude-3.5-sonnet", "gpt-4o"],
    maxTokens: 250000,
    status: "evaluating"
  }
];

interface Violation {
  id: string;
  policyId: string;
  useCase: string;
  modelInUse: string;
  tokenLeakGauge: number; 
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  remedyAction: string;
}

const INITIAL_VIOLATIONS: Violation[] = [
  {
    id: "V-401",
    policyId: "GP-101",
    useCase: "Support Ticket Router - Simple Priority Selection",
    modelInUse: "gpt-4",
    tokenLeakGauge: 2450.00,
    riskLevel: "CRITICAL",
    remedyAction: "Transition endpoint configuration target to gemini-3.5-flash"
  },
  {
    id: "V-402",
    policyId: "GP-103",
    useCase: "Chatbot History Buffer Re-injection",
    modelInUse: "gpt-4-turbo",
    tokenLeakGauge: 1820.00,
    riskLevel: "HIGH",
    remedyAction: "Implement localized sliding summaries and historical truncation limits"
  },
  {
    id: "V-403",
    policyId: "GP-102",
    useCase: "Compliance PDF Repeating Search",
    modelInUse: "gemini-1.5-pro (uncached)",
    tokenLeakGauge: 1420.00,
    riskLevel: "MEDIUM",
    remedyAction: "Configure prompt cached token identifier loops"
  }
];

export default function GovernanceView() {
  const [policies, setPolicies] = useState<Policy[]>(INITIAL_POLICIES);
  const [violations, setViolations] = useState<Violation[]>(INITIAL_VIOLATIONS);

  // Policy creation Wizard form fields
  const [newPolicyName, setNewPolicyName] = useState("");
  const [policyCategory, setPolicyCategory] = useState<'LLM Selection' | 'Token Ceiling' | 'Billing Rule' | 'Caching Mandate'>('LLM Selection');
  const [targetScope, setTargetScope] = useState("");
  const [maxTokens, setMaxTokens] = useState(10000);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [creationNotification, setCreationNotification] = useState<string | null>(null);

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicyName || !targetScope) return;

    const newIdx = `GP-${Math.floor(100 + Math.random() * 900)}`;
    const freshPolicy: Policy = {
      id: newIdx,
      name: newPolicyName,
      category: policyCategory,
      scope: targetScope,
      allowableModels: ["gemini-3.5-flash", "gpt-4o-mini", "claude-3.5-sonnet"],
      maxTokens,
      status: "active"
    };

    setPolicies((prev) => [...prev, freshPolicy]);
    setNewPolicyName("");
    setTargetScope("");
    setIsWizardOpen(false);

    setCreationNotification(`Successfully created standard governance policy ${newIdx}! Active enforcement triggered.`);
    setTimeout(() => setCreationNotification(null), 4000);
  };

  const handleBypassViolation = (id: string) => {
    setViolations((prev) => prev.filter(v => v.id !== id));
  };

  // Compute compliance score based on breaches
  const critCount = violations.filter(v => v.riskLevel === 'CRITICAL').length;
  const highCount = violations.filter(v => v.riskLevel === 'HIGH').length;
  const medCount = violations.filter(v => v.riskLevel === 'MEDIUM').length;
  const lowCount = violations.filter(v => v.riskLevel === 'LOW').length;
  const score = Math.max(10, 100 - (critCount * 15) - (highCount * 10) - (medCount * 5) - (lowCount * 2));

  let grader = "A+";
  let gradeColor = "text-[#00E676] glow-success";
  if (score < 95) { grader = "A"; gradeColor = "text-[#00E676]"; }
  if (score < 90) { grader = "B+"; gradeColor = "text-slate-200"; }
  if (score < 80) { grader = "B"; gradeColor = "text-brand-warning"; }
  if (score < 70) { grader = "C"; gradeColor = "text-brand-danger animate-pulse"; }

  const sumTokenLeaks = violations.reduce((sum, v) => sum + v.tokenLeakGauge, 0);

  // Compliance checklist items
  const [checklist, setChecklist] = useState([
    { id: 'c1', rule: 'Bypass expensive legacy models (GPT-4) on triage tasks', verified: true },
    { id: 'c2', rule: 'Ensure active context cashing in simple classifiers', verified: true },
    { id: 'c3', rule: 'Limit prompt sequences on multi-turn user dialogues', verified: false },
    { id: 'c4', rule: 'Restrict nocturnal reports to batch discounts schedules', verified: false }
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, verified: !item.verified } : item));
  };

  return (
    <div className="space-y-6 select-none relative" id="governance-container">
      {/* Background neon orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header element */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-heading tracking-tight flex items-center gap-2">
            <Scale className="h-5 w-5 text-brand-primary animate-pulse" />
            <span className="uppercase tracking-wide">CSOC compliance and governance</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Detect policy breaches, audit unapproved endpoints, and enforce automated model allocation rules across active enterprise workspaces.
          </p>
        </div>

        {/* Wizard trigger */}
        <button
          onClick={() => setIsWizardOpen(true)}
          className="bg-brand-primary/15 border border-brand-primary/25 hover:bg-brand-primary/20 hover:text-white text-brand-primary text-xs font-bold font-mono tracking-widest px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center space-x-2 shadow-md shadow-brand-primary/10"
        >
          <Plus className="h-4 w-4" />
          <span>INJECT COST POLICY</span>
        </button>
      </div>

      {/* Creation Notification */}
      <AnimatePresence>
        {creationNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-brand-success/15 border border-brand-success/20 rounded-xl text-xs text-brand-success flex items-center space-x-2 relative z-20"
          >
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{creationNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. CENTRAL COMPLIANCE SCORE & SURROUNDINGS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch" id="gov-scoreboard">
        
        {/* COMPLIANCE CHECKLIST PANEL */}
        <div className="md:col-span-4 bg-[#0D132D]/85 backdrop-blur-xl border border-white/5 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
              <ClipboardList className="h-4 w-4 text-[#8A9FB4]" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8A9FB4] font-mono">COMPLIANCE PROTOCOLS</h3>
            </div>
            
            <p className="text-[11px] text-slate-450 leading-relaxed">
              Required optimization steps of the system. Check to toggle policy validation targets.
            </p>

            <div className="space-y-2.5">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className="w-full flex items-start space-x-3 p-2.5 rounded-xl bg-[#050816]/60 border border-white/5 hover:border-brand-primary/20 transition-all text-left cursor-pointer"
                >
                  <input 
                    type="checkbox"
                    checked={item.verified}
                    readOnly
                    className="h-3.5 w-3.5 rounded bg-slate-900 border-white/20 text-brand-primary focus:ring-0 mt-0.5"
                  />
                  <span className={`text-[11px] leading-tight ${item.verified ? 'text-slate-200 line-through opacity-80' : 'text-slate-300'}`}>
                    {item.rule}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-[9.5px] font-mono text-slate-500">
            COMPLIANCE: {checklist.filter(c => c.verified).length} / {checklist.length} IN ORDER
          </div>
        </div>

        {/* FEATURE COMPLIANCE GRADE PROMINENTLY IN CENTER */}
        <div className="md:col-span-4 bg-[#101535] border border-brand-primary/30 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden glow-blue">
          {/* Animated concentric decorative cyber rings */}
          <div className="absolute inset-0 bg-[#050816]/20" />
          <div className="absolute h-48 w-48 rounded-full border border-brand-primary/10 animate-pulse scale-110 pointer-events-none" />
          <div className="absolute h-40 w-40 rounded-full border border-dashed border-brand-primary/25 animate-spin-slow pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-brand-primary uppercase">SECURITY COMPLIANCE AUDIT INDEX</span>
            
            {/* Extremely Prominent Circle Node */}
            <div className="h-32 w-32 rounded-full border-4 border-brand-primary bg-[#050816] flex flex-col items-center justify-center mx-auto shadow-[0_0_30px_rgba(79,140,255,0.3)] select-none">
              <span className={`text-5xl font-extrabold font-mono tracking-tighter ${gradeColor}`}>
                {grader}
              </span>
              <span className="text-[10px] text-slate-400 font-mono font-bold mt-1 uppercase">GRID GRADE</span>
            </div>

            <div className="space-y-1">
              <h4 className="text-[14px] font-bold text-white uppercase font-mono">{score}% COMPLIANCE SCORE</h4>
              <p className="text-[10px] text-slate-400 leading-normal max-w-xs mx-auto">
                Automatic rating drop triggered based on active uncompliant workspace breaches.
              </p>
            </div>
          </div>
        </div>

        {/* POTENTIAL LEAKS & METERS SUMMARY */}
        <div className="md:col-span-4 bg-[#0D132D]/85 backdrop-blur-xl border border-white/5 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
              <ShieldAlert className="h-4 w-4 text-brand-danger" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-danger font-mono">BREACH LEAK QUANTIFIER</h3>
            </div>
            
            <p className="text-[11px] text-slate-450 leading-relaxed">
              Estimated active token expenditure lost directly through uncompressed prompts and legacy LLM routing.
            </p>

            <div className="p-4 bg-brand-danger/5 border border-brand-danger/15 rounded-2xl text-center space-y-1">
              <span className="text-3xl font-extrabold font-mono text-brand-danger block leading-none filter drop-shadow-[0_0_10px_rgba(255,82,82,0.3)]">
                ${sumTokenLeaks.toLocaleString()}
              </span>
              <span className="text-[9px] text-slate-450 font-mono uppercase tracking-wider block">MONTHLY SAVINGS LIABILITIES AT RISK</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 font-mono leading-relaxed text-left">
            Active bypasses allowed: 0. Policy audit rule limits enforced at provider boundaries.
          </p>
        </div>

      </div>

      {/* 2. ACTIVE POLICY VIOLATIONS ALERT & POLICIES DICTIONARY COLUMN SPANS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="gov-listings-split">
        
        {/* Left Column: ACTIVE POLICY VIOLATIONS ALERT (RISK ALERTS) */}
        <div className="lg:col-span-7 bg-[#0D132D]/85 border border-white/5 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8A9FB4] flex items-center space-x-2 font-mono">
              <ShieldAlert className="h-4.5 w-4.5 text-brand-danger animate-pulse" />
              <span>Breach Alerts & Severity Streams</span>
            </span>
            <span className="text-[9.5px] font-mono text-slate-400 bg-brand-danger/10 px-2.5 py-0.5 rounded border border-brand-danger/10 font-bold">REALTIME SECURE</span>
          </div>

          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
            {violations.length === 0 ? (
              <div className="bg-[#050816]/50 border border-white/5 rounded-2xl p-8 text-center text-slate-400 space-y-2">
                <CheckCircle className="h-8 w-8 text-[#00E676] mx-auto animate-bounce" />
                <h4 className="text-xs font-bold uppercase tracking-widest">WORKSPACE COMPLIANT FORWARD</h4>
                <p className="text-[10.5px] text-slate-500 max-w-sm mx-auto font-mono">
                  All active downstream models align perfectly with cost constraints. Zero policy violations detected bounds.
                </p>
              </div>
            ) : (
              violations.map((v) => {
                // Determine severity badge coloring with animated pulses
                const isCritical = v.riskLevel === 'CRITICAL';
                const isHigh = v.riskLevel === 'HIGH';
                
                let severityBadge = '';
                if (isCritical) {
                  severityBadge = 'bg-brand-danger/20 text-brand-danger border-brand-danger/30 animate-pulse';
                } else if (isHigh) {
                  severityBadge = 'bg-brand-danger/10 text-brand-danger border-brand-danger/20';
                } else {
                  severityBadge = 'bg-brand-warning/15 text-brand-warning border-brand-warning/15';
                }

                return (
                  <div 
                    key={v.id}
                    className="p-4 bg-[#050816]/70 border border-white/5 hover:border-brand-primary/20 rounded-2xl transition-all shadow-md flex items-start justify-between gap-4 text-left"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-white uppercase">{v.useCase}</span>
                        <span className={`text-[8px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full border ${severityBadge}`}>
                          {v.riskLevel} IMPACT
                        </span>
                      </div>
                      
                      <p className="text-[11px] text-slate-400 leading-normal font-mono">
                        Violation: Model <code className="bg-[#101535] border border-white/10 px-1.5 py-0.5 rounded text-[10px] text-slate-200 font-mono">{v.modelInUse}</code> breached active constraint <span className="text-brand-primary font-bold">{v.policyId}</span>.
                      </p>
                      
                      <div className="bg-[#0D132D] p-2.5 rounded-xl border border-white/5 text-[10.5px] font-mono flex items-start space-x-1">
                        <span className="text-[#8A9FB4] uppercase block shrink-0">Remedy protocol:</span>
                        <span className="text-brand-success font-semibold leading-normal">{v.remedyAction}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono space-y-1.5">
                      <span className="text-xs font-bold text-brand-danger block filter drop-shadow-[0_0_5px_rgba(255,82,82,0.2)]">
                        -${v.tokenLeakGauge.toLocaleString()}/mo
                      </span>
                      <button
                        onClick={() => handleBypassViolation(v.id)}
                        className="text-[8.5px] font-bold text-slate-500 hover:text-white uppercase font-mono tracking-widest block border border-white/5 hover:border-white/10 px-2 py-1 rounded-lg transition-colors bg-[#0D132D] cursor-pointer"
                      >
                        Mute
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: POLICIES DICTIONARY (AUDIT CHECKLIST COGNITIVE) */}
        <div className="lg:col-span-5 bg-[#0D132D]/85 border border-white/5 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="border-b border-white/5 pb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8A9FB4] flex items-center space-x-2 font-mono">
              <Sliders className="h-4.5 w-4.5 text-brand-primary" />
              <span>ACTIVE COST POLICY DEFINITIONS</span>
            </span>
          </div>

          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
            {policies.map((p) => (
              <div 
                key={p.id}
                className="p-4 bg-[#050816]/70 border border-white/5 rounded-2xl hover:border-brand-primary/15 transition-colors text-xs space-y-2.5 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-brand-primary uppercase">SECURITY RULE_ID: {p.id}</span>
                  <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border ${
                    p.status === 'active' 
                      ? 'bg-brand-success/10 text-brand-success border-brand-success/20' 
                      : 'bg-brand-warning/10 text-brand-warning border-brand-warning/20 animate-pulse'
                  }`}>
                    {p.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-white leading-normal uppercase">{p.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Scope domain: {p.scope}</p>
                </div>

                <div className="pt-2 text-[9px] font-mono text-slate-450 flex flex-col justify-start border-t border-white/5 gap-1 pt-2">
                  <span>Class limit: {p.maxTokens.toLocaleString()} Input Tokens Ceiling</span>
                  <span className="text-[#8A9FB4] uppercase">Allowable fleet: {p.allowableModels.join(", ")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* POLICY CREATOR WIZARD SYSTEM */}
      <AnimatePresence>
        {isWizardOpen && (
          <div className="fixed inset-0 bg-[#050816]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0D132D] border border-brand-primary/20 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsWizardOpen(false)}
                className="absolute right-5 top-5 hover:text-white text-slate-500 text-xs font-semibold uppercase cursor-pointer"
                id="close-policy-wizard-modal-btn"
              >
                ✕ Cancel
              </button>

              <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-3 mb-5 flex items-center gap-1.5 font-mono">
                <Plus className="h-4.5 w-4.5 text-brand-primary animate-pulse" />
                <span>INJECT STANDARDIZED SECURITY VALUE</span>
              </h3>

              <form onSubmit={handleCreatePolicy} className="space-y-4 text-xs font-mono">
                {/* Policy Title */}
                <div className="space-y-1.5 text-left">
                  <label className="text-slate-400 font-bold uppercase text-[9.5px]">Policy Description / Rule:</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Max limit variables on PDF extraction routes"
                    value={newPolicyName}
                    onChange={(e) => setNewPolicyName(e.target.value)}
                    className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-slate-200 placeholder:text-slate-750 focus:outline-none focus:border-brand-primary"
                    id="policy-creator-name-input"
                  />
                </div>

                {/* Category selectors */}
                <div className="space-y-1.5 text-left">
                  <label className="text-slate-400 font-bold uppercase text-[9.5px]">Policy Category Class:</label>
                  <select
                    value={policyCategory}
                    onChange={(e) => setPolicyCategory(e.target.value as any)}
                    className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="LLM Selection">LLM Selection (Restrict expensive APIs)</option>
                    <option value="Token Ceiling">Token Ceiling (Restrict oversized inputs)</option>
                    <option value="Caching Mandate">Caching Mandate (Force Native caches)</option>
                    <option value="Billing Rule">Billing Rule (Force batch scheduling)</option>
                  </select>
                </div>

                {/* Scope */}
                <div className="space-y-1.5 text-left">
                  <label className="text-slate-400 font-bold uppercase text-[9.5px]">Target Scope Context:</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Nightly release reports / multi-turn dialogues"
                    value={targetScope}
                    onChange={(e) => setTargetScope(e.target.value)}
                    className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-slate-200 placeholder:text-slate-755 focus:outline-none focus:border-brand-primary"
                    id="policy-creator-scope-input"
                  />
                </div>

                {/* Token Limit */}
                <div className="space-y-1.5 text-left">
                  <label className="text-slate-400 font-bold uppercase text-[9.5px]">Max input tokens ceiling:</label>
                  <input 
                    type="number"
                    required
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(Number(e.target.value))}
                    className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-brand-primary"
                    id="policy-creator-tokens-input"
                  />
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-end">
                  <button
                    type="submit"
                    className="bg-brand-primary hover:opacity-95 text-white font-semibold font-mono p-2.5 px-6 rounded-xl text-xs cursor-pointer shadow-lg shadow-brand-primary/10 tracking-widest uppercase"
                    id="submit-policy-creator-action-btn"
                  >
                    CREATE CSOC RULE
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
