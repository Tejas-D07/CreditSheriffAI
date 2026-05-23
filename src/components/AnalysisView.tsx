import { Upload, FileCode, CheckCircle2, AlertCircle, Play, Sparkles, Terminal, Copy, ArrowDownCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RAW_CSV_GEMINI_TEMPLATE, RAW_JSON_OPENAI_TEMPLATE } from '../data/mockUsage';
import { TraceEvent } from '../types';
import React, { useState } from 'react';

interface AnalysisViewProps {
  onAnalysisSuccess: (newRecs: any[], newTraces: TraceEvent[], notice?: string) => void;
}

export default function AnalysisView({ onAnalysisSuccess }: AnalysisViewProps) {
  const [logsInput, setLogsInput] = useState("");
  const [dataFormat, setDataFormat] = useState<'csv' | 'json'>('csv');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentPipelineStep, setCurrentPipelineStep] = useState<number>(-1);
  const [logNotification, setLogNotification] = useState<string | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const pipelineSteps = [
    { title: "Data Ingestion", desc: "Parsing columns & structures" },
    { title: "Pattern Detection", desc: "Clustering prompt similarity" },
    { title: "Waste Analysis", desc: "Evaluating redundant inputs" },
    { title: "RAG Validation", desc: "Querying model specifications" },
    { title: "Optimization Planning", desc: "Drafting savings mappings" },
    { title: "Confidence Scoring", desc: "Running double auditor risk logs" },
    { title: "Human Approval", desc: "Pertaining trace to board dashboard" }
  ];

  const handleCopyTemplate = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(type);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  const loadPresetTemplate = (type: 'gemini_csv' | 'openai_json') => {
    if (type === 'gemini_csv') {
      setLogsInput(RAW_CSV_GEMINI_TEMPLATE);
      setDataFormat('csv');
    } else {
      setLogsInput(RAW_JSON_OPENAI_TEMPLATE);
      setDataFormat('json');
    }
  };

  // Run full enterprise client-server analysis pipeline
  const handleAnalyzeLogs = async () => {
    if (!logsInput.trim()) return;
    
    setIsAnalyzing(true);
    setCurrentPipelineStep(0);

    // Beautiful step-by-step pipeline state animation before displaying parsed results
    for (let i = 0; i < pipelineSteps.length; i++) {
      setCurrentPipelineStep(i);
      const sleepTime = i === 3 ? 900 : i === 5 ? 1200 : 500; // Simulated computation focus times
      await new Promise(resolve => setTimeout(resolve, sleepTime));
    }

    try {
      const res = await fetch("/api/analyze-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logsText: logsInput,
          format: dataFormat
        })
      });

      if (!res.ok) {
        throw new Error("Analysis failed. Server returned non-200 state.");
      }

      const data = await res.json();
      if (data.success) {
        onAnalysisSuccess(data.recommendations, data.traces, data.isFallbacked ? data.notice : undefined);
        setLogNotification(data.isFallbacked ? data.notice : "Gemini analyzed standard telemetry inputs perfectly!");
        setTimeout(() => setLogNotification(null), 5000);
      }
    } catch (err: any) {
      console.error(err);
      setLogNotification("Critical: An unexpected analysis error occurred: " + err?.message);
    } finally {
      setIsAnalyzing(false);
      setCurrentPipelineStep(-1);
    }
  };

  return (
    <div className="space-y-6" id="analysis-view-container">
      {/* Header section with instructions */}
      <div>
        <h2 className="text-xl font-bold text-white font-heading tracking-tight">Agent Ingestion & Pattern Core</h2>
        <p className="text-slate-400 text-xs mt-1">
          Paste raw usage exports or load preset configurations. CreditSheriff will stream the records through Gemini 3.5 Flash models side-by-side with Auditor verification nodes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="analysis-grid-layout">
        {/* Left Hand: Paste Space */}
        <div className="lg:col-span-7 bg-[#121A2A]/50 backdrop-blur-md border border-white/5 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <FileCode className="h-4 w-4 text-brand-primary" />
              <span>LOG DATA DECK</span>
            </span>
            <div className="flex items-center space-x-2 text-[10px]">
              <button 
                onClick={() => setDataFormat('csv')} 
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${dataFormat === 'csv' ? 'bg-brand-primary/25 text-brand-primary font-bold border border-brand-primary/20' : 'text-slate-400'}`}
              >
                CSV FORMAT
              </button>
              <button 
                onClick={() => setDataFormat('json')} 
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${dataFormat === 'json' ? 'bg-brand-primary/25 text-brand-primary font-bold border border-brand-primary/20' : 'text-slate-400'}`}
              >
                JSON FORMAT
              </button>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
            <button 
              onClick={() => loadPresetTemplate('gemini_csv')}
              id="preset-load-gemini-csv"
              className="bg-brand-card/70 hover:bg-slate-100 border border-white/5 p-2.5 rounded-lg text-[11px] font-mono hover:text-slate-800 text-slate-700 text-left transition-colors cursor-pointer flex items-center justify-between gap-2.5"
            >
              <span className="leading-tight">Load Inefficient Gemini CSV</span>
              <ArrowDownCircle className="h-3.5 w-3.5 text-brand-primary shrink-0" />
            </button>
            <button 
              onClick={() => loadPresetTemplate('openai_json')}
              id="preset-load-openai-json"
              className="bg-brand-card/70 hover:bg-slate-100 border border-white/5 p-2.5 rounded-lg text-[11px] font-mono hover:text-slate-800 text-slate-700 text-left transition-colors cursor-pointer flex items-center justify-between gap-2.5"
            >
              <span className="leading-tight">Load Inefficient OpenAI JSON</span>
              <ArrowDownCircle className="h-3.5 w-3.5 text-brand-primary shrink-0" />
            </button>
          </div>

          {/* Text Area */}
          <div className="flex-1 relative">
            <textarea
              className="w-full h-80 bg-brand-bg/85 border border-white/10 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-primary tracking-wide leading-relaxed resize-none"
              placeholder="Paste raw cloud billing telemetry logs, or select a preset template above..."
              value={logsInput}
              onChange={(e) => setLogsInput(e.target.value)}
              id="analysis-logs-textarea"
            />
            {logsInput.length > 0 && (
              <button 
                onClick={() => setLogsInput("")}
                className="absolute right-3.5 bottom-3.5 text-[9px] font-bold text-slate-500 hover:text-brand-danger uppercase tracking-widest bg-brand-card px-2 py-1 rounded transition-colors border border-white/5 cursor-pointer"
              >
                Clear Area
              </button>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <div className="text-[10px] text-slate-500 max-w-[280px]">
              Note: Submitted transaction records are tokenized and processed server-side under full secure sandbox guardrails.
            </div>
            <button
              onClick={handleAnalyzeLogs}
              disabled={isAnalyzing || !logsInput.trim()}
              id="execute-analytical-pipeline-btn"
              className={`py-2 px-5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center space-x-2 ${
                !logsInput.trim() 
                  ? 'bg-brand-card text-slate-600 border border-white/5'
                  : 'bg-gradient-to-r from-brand-primary to-purple-600 text-white shadow-lg shadow-brand-primary/20 hover:opacity-90'
              }`}
            >
              <Play className="h-4 w-4" />
              <span>RUN CREDITSHERIFF ANALYTICS</span>
            </button>
          </div>
        </div>

        {/* Right Hand: Dual-Agent Visual pipeline */}
        <div className="lg:col-span-5 bg-brand-panel border border-white/5 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="border-b border-white/5 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-brand-success" />
              <span>CORE ANALYSIS PIPELINE</span>
            </span>
          </div>

          {/* Notification Overlay Alerts */}
          <AnimatePresence>
            {logNotification && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-brand-success/10 border border-brand-success/20 rounded-lg p-3 text-[11px] text-brand-success flex items-start space-x-2.5 my-3"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{logNotification}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pipeline Tree */}
          <div className="space-y-3.5 my-4">
            {pipelineSteps.map((step, idx) => {
              const isActive = currentPipelineStep === idx;
              const isPassed = currentPipelineStep > idx;
              const isPending = currentPipelineStep < idx || currentPipelineStep === -1;

              return (
                <div 
                  key={idx} 
                  className={`flex items-center space-x-3.5 p-2 rounded-lg transition-all border ${
                    isActive 
                      ? 'bg-brand-primary/10 border-brand-primary/25 shadow-md shadow-brand-primary/5' 
                      : isPassed 
                        ? 'bg-slate-800/25 border-transparent' 
                        : 'border-transparent'
                  }`}
                >
                  {/* Status Indicator circle */}
                  <div className="relative flex items-center justify-center">
                    {isActive ? (
                      <div className="h-6 w-6 rounded-full border border-brand-primary flex items-center justify-center animate-spin-slow">
                        <div className="h-2 w-2 rounded-full bg-brand-primary" />
                      </div>
                    ) : isPassed ? (
                      <CheckCircle2 className="h-5 w-5 text-brand-success" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-slate-700 bg-brand-bg flex items-center justify-center text-[10px] font-mono text-slate-500 font-bold">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="text-xs">
                    <p className={`font-semibold ${isActive ? 'text-brand-primary' : isPassed ? 'text-slate-300' : 'text-slate-500'}`}>
                      {step.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty/Static display */}
          <div className="bg-[#0B1020]/80 p-3.5 rounded-lg border border-white/5 font-mono text-[10px] text-slate-400 space-y-1 mt-auto">
            <div className="flex items-center space-x-2 text-slate-500 border-b border-white/5 pb-1.5 mb-1.5">
              <Terminal className="h-3.5 w-3.5" />
              <span>LIVE LOG CONSOLE</span>
            </div>
            {isAnalyzing ? (
              <p className="text-brand-primary animate-pulse font-semibold">Running multi-agent spend intelligence models...</p>
            ) : (
              <>
                <p>&rsaquo; status: <span className="text-brand-success">SHERIFF CORE ONLINE</span></p>
                <p>&rsaquo; ready for CSV log stream analysis</p>
                <p>&rsaquo; dual verification compliance score activated</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
