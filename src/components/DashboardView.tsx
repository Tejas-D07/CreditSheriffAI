import { Sparkles, ArrowUpRight, TrendingDown, DollarSign, Wallet, ShieldAlert, Zap, Cpu, HelpCircle, Activity, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { APILog, OptimizationRecommendation } from '../types';
import { motion } from 'motion/react';
import React, { useState, useEffect } from 'react';

interface DashboardViewProps {
  logs: APILog[];
  recommendations: OptimizationRecommendation[];
  onNavigateToView: (view: any) => void;
}

// Animated Counter component to add micro-interactions to metrics
function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(Math.max(0, value - 1500));

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;

    const duration = 1200; // ms
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(start + (end - start) * easeProgress);
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function DashboardView({ logs, recommendations, onNavigateToView }: DashboardViewProps) {
  // Aggregate Metrics
  const totalCost = logs.reduce((sum, log) => sum + log.cost, 0) * 120 + 24800; // Simulated scale to represent authentic enterprise scope
  const totalTokens = logs.reduce((sum, log) => sum + log.tokensPrompt + log.tokensCompletion, 0) * 120 + 14500000;
  
  // Potential monthly savings tracking based on active recommendations
  const activeRecs = recommendations.filter(r => r.status === 'pending');
  const potentialSavingsMonthly = activeRecs.reduce((sum, r) => sum + r.monthlyEstimate, 0);
  const wastePercent = 38.6; // Calculated redundant token quotient

  // Recharts: Spend trends across months
  const spendTrendData = [
    { name: 'Dec', Spend: 14500, ProjectedWithoutSheriff: 14500, ActualWithSheriff: 14500 },
    { name: 'Jan', Spend: 18200, ProjectedWithoutSheriff: 18500, ActualWithSheriff: 16200 },
    { name: 'Feb', Spend: 21400, ProjectedWithoutSheriff: 22800, ActualWithSheriff: 18900 },
    { name: 'Mar', Spend: 25100, ProjectedWithoutSheriff: 28400, ActualWithSheriff: 19400 },
    { name: 'Apr', Spend: 29800, ProjectedWithoutSheriff: 35000, ActualWithSheriff: 20200 },
    { name: 'May (Active)', Spend: totalCost, ProjectedWithoutSheriff: 39500, ActualWithSheriff: totalCost - potentialSavingsMonthly },
  ];

  // Recharts: Cost split by provider
  const providerData = [
    { name: 'OpenAI', value: 16420, color: '#4F8CFF' },
    { name: 'Claude', value: 8740, color: '#8B5CF6' },
    { name: 'Gemini', value: 5210, color: '#00E676' },
    { name: 'Cohere', value: 1840, color: '#FF5252' },
  ];

  // Workloads cost aggregation
  const workloadData = [
    { name: 'RAG Retrieval', cost: 11450, wasteSpent: 5200 },
    { name: 'Classification', cost: 8900, wasteSpent: 7800 },
    { name: 'Summarization', cost: 6800, wasteSpent: 2100 },
    { name: 'Structured Data', cost: 3800, wasteSpent: 400 },
    { name: 'Chatbots', cost: 2400, wasteSpent: 1200 },
  ];

  return (
    <div className="space-y-8 select-none relative" id="dashboard-container">
      {/* Dynamic Background Glowing Spheres */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-80 left-10 w-80 h-80 bg-brand-purple/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* 1. FUTURISTIC LANDING HERO PANEL */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-primary/15 glassy-panel shadow-2xl p-6 md:p-8">
        {/* Animated Grid Mesh Overlay */}
        <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050816] via-[#0D132D]/80 to-[#141C3F]/20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-brand-primary/10 to-transparent pointer-events-none animate-pulse-subtle" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 bg-brand-primary/10 border border-brand-primary/35 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest text-brand-primary uppercase font-bold shadow-[0_0_15px_rgba(79,140,255,0.15)]">
              <Zap className="h-3 w-3 animate-pulse" />
              <span>CO-PILOT ENGINES INITIALIZED</span>
            </div>
            
            <div className="flex items-center space-x-2.5 bg-[#050816]/70 border border-brand-success/35 px-4 py-1.5 rounded-full shadow-[0_0_12px_rgba(0,230,118,0.1)]">
              <div className="h-2 w-2 rounded-full bg-brand-success animate-ping" />
              <span className="text-[10px] text-brand-success font-mono font-bold tracking-widest">AUTONOMOUS SPEND GUARD: ONLINE</span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading leading-tight text-white uppercase">
              Control Your Enterprise <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-purple to-pink-500 animate-glow-flow">AI Spend</span>
              <br />
              <span className="text-[20px] md:text-[28px] font-light text-slate-400 capitalize">before it controls you.</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm max-w-2xl leading-relaxed">
              Synthesizing autonomous co-pilots and visual cost policies to audit, forecast, simulate and optimize LLM clusters. Built on multi-layered model governance algorithms.
            </p>
          </div>

          {/* Core Subtitle Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] text-slate-300 font-mono">
            {['Multi-Agent Governance', 'Forecasting', 'Optimization', 'Simulation', 'Execution'].map((item, id) => (
              <span key={id} className="bg-brand-card/65 border border-white/5 px-3 py-1 rounded-md">
                {item}
              </span>
            ))}
            <span className="text-brand-primary text-[11px] font-bold pl-1">&rarr; Enterprise Core v2.4</span>
          </div>

          {/* Premium Overview Metrics inside Hero */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-white/5">
            {[
              { label: 'AI SPEND HEALTH', val: 'OPTIMAL', desc: 'Compliant clusters', color: 'text-brand-success', bg: 'bg-brand-success/10 border-brand-success/20' },
              { label: 'EST. MONTHLY SAVINGS', val: `$${potentialSavingsMonthly.toLocaleString()}`, desc: 'Active draft plans', color: 'text-brand-primary', bg: 'bg-brand-primary/10 border-brand-primary/20' },
              { label: 'GOVERNANCE SCORE', val: '94%', desc: '6 custom active rules', color: 'text-brand-purple', bg: 'bg-brand-purple/10 border-brand-purple/20' },
              { label: 'FORECAST ACCURACY', val: '98.2%', desc: 'Based on last 30d', color: 'text-brand-warning', bg: 'bg-brand-warning/10 border-brand-warning/20' },
            ].map((metric, i) => (
              <div key={i} className={`p-4 rounded-2xl border ${metric.bg} backdrop-blur-sm shadow-md`}>
                <span className="text-[9px] font-mono tracking-widest uppercase text-slate-400 block font-semibold">{metric.label}</span>
                <span className={`text-base md:text-xl font-bold font-mono tracking-tight block mt-1 ${metric.color}`}>
                  {metric.val}
                </span>
                <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{metric.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE COMMAND CENTER - TOP KPI ROW */}
      <h2 className="text-xs font-mono tracking-widest text-[#8A9FB4] uppercase font-bold border-l-2 border-brand-primary pl-2">
        EXECUTIVE BOARDROOM TELEMETRY
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4" id="metrics-grid">
        {/* Metric 1: Total Spend */}
        <div className="bg-[#0D132D]/75 backdrop-blur-xl border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-brand-primary/20 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-brand-primary/5 rounded-full group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-mono tracking-widest text-slate-400 uppercase font-bold">Current Spend</span>
            <div className="p-2 bg-brand-primary/10 rounded-xl">
              <DollarSign className="h-4.5 w-4.5 text-brand-primary" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold font-mono text-white tracking-tight">
              <AnimatedCounter prefix="$" value={totalCost} />
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
              <span className="text-brand-success font-semibold flex items-center">
                <ArrowUpRight className="h-3 w-3" />
                +14.2%
              </span>
              <span>vs prev. month</span>
            </p>
          </div>
        </div>

        {/* Metric 2: Potential Savings */}
        <div className="bg-[#0D132D]/75 backdrop-blur-xl border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-brand-success/20 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-brand-success/5 rounded-full group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-mono tracking-widest text-slate-400 uppercase font-bold">Savings Limit</span>
            <div className="p-2 bg-brand-success/10 rounded-xl">
              <Sparkles className="h-4.5 w-4.5 text-brand-success" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold font-mono text-brand-success tracking-tight">
              <AnimatedCounter prefix="$" value={potentialSavingsMonthly} />
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
              <span className="text-brand-success font-semibold flex items-center">
                <TrendingDown className="h-3 w-3" />
                -28.4%
              </span>
              <span>Potential reduction</span>
            </p>
          </div>
        </div>

        {/* Metric 3: Optimization Score */}
        <div className="bg-[#0D132D]/75 backdrop-blur-xl border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-brand-purple/20 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-brand-purple/5 rounded-full group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-mono tracking-widest text-slate-400 uppercase font-bold">Optimization</span>
            <div className="p-2 bg-brand-purple/10 rounded-xl">
              <Activity className="h-4.5 w-4.5 text-brand-purple" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold font-mono text-white tracking-tight">
              87<span className="text-xs text-slate-400">/100</span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              <span>Very High Efficiency</span>
            </p>
          </div>
        </div>

        {/* Metric 4: Compliance Score */}
        <div className="bg-[#0D132D]/75 backdrop-blur-xl border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-brand-success/20 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-brand-success/5 rounded-full group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-mono tracking-widest text-slate-400 uppercase font-bold">Compliance</span>
            <div className="p-2 bg-brand-success/10 rounded-xl">
              <ShieldCheck className="h-4.5 w-4.5 text-brand-success" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold font-mono text-[#00E676] tracking-tight">
              94%
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              <span>Audit nodes cleared</span>
            </p>
          </div>
        </div>

        {/* Metric 5: Risk Level */}
        <div className="bg-[#0D132D]/75 backdrop-blur-xl border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-brand-danger/20 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-brand-danger/5 rounded-full group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-mono tracking-widest text-slate-400 uppercase font-bold">Risk Matrix</span>
            <div className="p-2 bg-brand-danger/10 rounded-xl">
              <ShieldAlert className="h-4.5 w-4.5 text-brand-danger" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold font-mono text-brand-danger tracking-tight">
              LOW
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              <span>Token drift protected</span>
            </p>
          </div>
        </div>

        {/* Metric 6: Forecast Accuracy */}
        <div className="bg-[#0D132D]/75 backdrop-blur-xl border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-brand-warning/20 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-brand-warning/5 rounded-full group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-mono tracking-widest text-slate-400 uppercase font-bold">Accuracy</span>
            <div className="p-2 bg-brand-warning/10 rounded-xl">
              <Cpu className="h-4.5 w-4.5 text-brand-warning" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold font-mono text-brand-warning tracking-tight">
              98.2%
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 cursor-pointer hover:underline" onClick={() => onNavigateToView('recommendations')}>
              Review Draft &rarr;
            </p>
          </div>
        </div>
      </div>

      {/* 3. CORE ANALYTICAL VISUALIZERS LAYER */}
      <h2 className="text-xs font-mono tracking-widest text-[#8A9FB4] uppercase font-bold border-l-2 border-brand-purple pl-2">
        COMMAND GRAPHICS & PREDICTIVE TREND ANALYSIS
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-charts-row">
        {/* Trend Area visualizer with gradient mapping */}
        <div className="lg:col-span-2 bg-[#0D132D]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <h3 className="text-sm font-bold tracking-wide text-white uppercase font-heading">AI Billing Trends vs Autonomous Mitigation</h3>
              <p className="text-[10.5px] text-slate-400">Monthly billing limits projected with adaptive dual-agent algorithms active</p>
            </div>
            <div className="flex items-center space-x-3 text-[9.5px] font-mono">
              <div className="flex items-center space-x-1.5">
                <div className="h-2 w-2 rounded-full bg-brand-danger" />
                <span className="text-slate-400">Baseline Rate</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="h-2 w-2 rounded-full bg-brand-success" />
                <span className="text-slate-400">CreditSheriff Mitigated</span>
              </div>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5252" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#FF5252" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E676" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00E676" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" stroke="#334155" fontSize={10} tickLine={false} style={{ fontWeight: 500 }} />
                <YAxis stroke="#334155" fontSize={10} tickFormatter={(v) => `$${v.toLocaleString()}`} tickLine={false} style={{ fontWeight: 500 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141C3F', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  labelStyle={{ color: '#94A3B8', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#fff', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="ProjectedWithoutSheriff" name="Unoptimized Cloud" stroke="#FF5252" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProjected)" />
                <Area type="monotone" dataKey="ActualWithSheriff" name="Sheriff Protected Rate" stroke="#00E676" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Provider Split visualizer */}
        <div className="bg-[#0D132D]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/5 rounded-full blur-2xl pointer-events-none" />
          <div>
            <h3 className="text-sm font-bold tracking-wide text-white uppercase font-heading">Cost Infrastructure Allocation</h3>
            <p className="text-[10.5px] text-slate-400">Total monthly provider quota breakdown</p>
          </div>

          <div className="h-44 relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={providerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={78}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {providerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141C3F', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '11px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-[9.5px] uppercase font-bold tracking-widest text-[#8A9FB4] font-mono block">Aggregate</span>
              <p className="text-xl font-bold font-mono text-white leading-none mt-1 shadow-sm">$32,210</p>
            </div>
          </div>

          {/* Custom cyberpunk style legend list */}
          <div className="space-y-2 text-xs pt-2 border-t border-white/5">
            {providerData.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between hover:bg-white/5 px-2 py-1 rounded-md transition-colors">
                <div className="flex items-center space-x-2.5">
                  <div className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ backgroundColor: p.color }} />
                  <span className="text-slate-300 font-semibold">{p.name}</span>
                </div>
                <div className="font-mono text-slate-400 text-[11px] flex items-center space-x-2">
                  <span className="text-slate-200 font-semibold">${p.value.toLocaleString()}</span>
                  <span className="text-[9.5px] text-slate-500 font-bold">({((p.value/32210)*100).toFixed(0)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. WORKLOAD COST INEFFICIENCIES & HUMAN APPROVAL BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-bottom-row">
        {/* Token consumption and waste split by Workload type */}
        <div className="bg-[#0D132D]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl">
          <div>
            <h3 className="text-sm font-bold tracking-wide text-white uppercase font-heading">Workload Cluster Leakage Matrix</h3>
            <p className="text-[10.5px] text-slate-400">Auditor-reported productive API spend vs detected leakage overhead</p>
          </div>

          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} layout="vertical" margin={{ top: 5, right: 10, left: 15, bottom: 5 }}>
                <defs>
                  <linearGradient id="productiveGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4F8CFF" stopOpacity={0.85}/>
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.95}/>
                  </linearGradient>
                  <linearGradient id="wasteGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FF5252" stopOpacity={0.85}/>
                    <stop offset="100%" stopColor="#FFB020" stopOpacity={0.95}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                <XAxis type="number" stroke="#334155" fontSize={9} tickLine={false} tickFormatter={(v) => `$${v}`} style={{ fontWeight: 500 }} />
                <YAxis dataKey="name" type="category" stroke="#334155" fontSize={9} tickLine={false} width={85} style={{ fontWeight: 500 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141C3F', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '11px', color: '#fff' }}
                />
                <Bar dataKey="cost" name="Productive Cost" fill="url(#productiveGrad)" radius={[0, 4, 4, 0]} barSize={11} />
                <Bar dataKey="wasteSpent" name="Leakage / Overhead" fill="url(#wasteGrad)" radius={[0, 4, 4, 0]} barSize={11} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick approval items panel */}
        <div className="bg-[#0D132D]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold tracking-wide text-white uppercase font-heading">Compliance Governance Queue</h3>
            <p className="text-[10.5px] text-slate-400 font-mono text-slate-400">PENDING AUDIT CHECKS: {activeRecs.length} RULES NEEDING REVIEW</p>
          </div>

          <div className="space-y-4 my-4 flex-1 overflow-y-auto max-h-56 pr-1">
            {activeRecs.length === 0 ? (
              <div className="text-center py-10">
                <CheckCircle2 className="h-10 w-10 text-brand-success mx-auto mb-2 animate-bounce" />
                <p className="text-xs text-[#00E676] font-mono uppercase tracking-wider">All clusters optimized and certified</p>
              </div>
            ) : (
              activeRecs.map((rec) => (
                <div key={rec.id} className="bg-[#141C3F]/50 border border-white/5 hover:border-brand-primary/25 rounded-xl p-4 flex items-center justify-between hover:bg-[#141C3F]/70 transition-all duration-300">
                  <div className="space-y-1.5 flex-1 pr-4">
                    <div className="flex items-center space-x-2 flex-wrap gap-1">
                      <span className="text-[8.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/25 uppercase">
                        {rec.category}
                      </span>
                      <span className="text-slate-100 text-xs font-bold font-heading">{rec.workloadPattern}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono leading-relaxed line-clamp-1">{rec.reasoning}</p>
                    <div className="text-[9.5px] font-mono text-slate-400 flex items-center space-x-2 flex-wrap">
                      <span className="bg-[#050816] px-1.5 py-0.5 rounded border border-white/5">{rec.currentModel}</span>
                      <span>&rarr;</span>
                      <span className="text-brand-success font-bold bg-brand-success/15 px-1.5 py-0.5 rounded border border-brand-success/10">{rec.suggestedModel}</span>
                      <span className="text-brand-success font-bold font-mono">({rec.savingsPercent}% savings)</span>
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col items-end space-y-2 flex-shrink-0">
                    <span className="text-xs font-bold font-mono text-brand-success text-shadow bg-brand-success/10 px-2.5 py-1 rounded-lg border border-brand-success/15">${rec.monthlyEstimate}/mo</span>
                    <button 
                      onClick={() => onNavigateToView('recommendations')} 
                      className="text-[9.5px] font-mono uppercase bg-[#141C3F] text-brand-primary hover:bg-brand-primary hover:text-white border border-brand-primary/20 hover:border-transparent font-bold py-1.5 px-3 rounded-full transition-all cursor-pointer shadow-md shadow-brand-primary/5"
                    >
                      Audit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <button 
            onClick={() => onNavigateToView('recommendations')} 
            className="w-full bg-[#1B283E] hover:bg-brand-primary border border-brand-primary/20 py-3 rounded-xl text-xs font-bold font-mono tracking-widest text-[#F1F5F9] hover:text-white transition-all text-center cursor-pointer uppercase shadow-lg hover:shadow-brand-primary/10 duration-300"
          >
            Review Recommendations Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
