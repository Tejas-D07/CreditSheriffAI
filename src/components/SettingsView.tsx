import { Settings, ShieldAlert, Cpu, HardDrive, Bell, Pocket, ExternalLink, HelpCircle } from 'lucide-react';
import React, { useState } from 'react';

export default function SettingsView() {
  const [budgetLimit, setBudgetLimit] = useState(10000);
  const [enableSlack, setEnableSlack] = useState(true);
  const [enableAutoAudit, setEnableAutoAudit] = useState(true);
  const [activeFrequency, setActiveFrequency] = useState("hour");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6" id="settings-view-container">
      {/* View Header */}
      <div>
        <h2 className="text-xl font-bold font-heading text-white tracking-tight">System Configuration & Policies</h2>
        <p className="text-slate-400 text-xs mt-1">
          Adjust CreditSheriff active heuristics, automated notification triggers, and provider API limits securely.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="settings-split-grids">
        {/* Left Column: Adjust parameters */}
        <div className="lg:col-span-8 bg-brand-panel border border-white/5 rounded-xl p-5 shadow-lg space-y-6">
          <div className="border-b border-white/5 pb-2">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-widest leading-none">ACTIVE WORKSPACE HEURISTICS RULES</h3>
          </div>

          {/* Setting item 1: Budget limit */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <label className="text-xs font-bold text-slate-200 block">Workspace Monthly Spend Threshold</label>
                <span className="text-[10.5px] text-slate-400">Trigger warnings if overall spend aggregates near ceiling limit.</span>
              </div>
              <span className="text-sm font-mono font-bold text-brand-primary bg-brand-bg border border-white/10 px-3 py-1.5 rounded-lg shrink-0 self-start sm:self-center">${budgetLimit.toLocaleString()} / mo</span>
            </div>
            <input
              type="range"
              min={1000}
              max={50000}
              step={1000}
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
            />
          </div>

          {/* Setting item 2: Scan Frequency */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-white/5 pt-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-200 block">Telemetry Log Scan Frequency</label>
              <span className="text-[10.5px] text-slate-400">How frequently Credit Sheriff checks container egress records.</span>
            </div>

            <div className="flex border border-white/10 rounded-lg overflow-hidden text-xs font-mono">
              <button 
                onClick={() => setActiveFrequency('realtime')}
                className={`px-3 py-1.5 ${activeFrequency === 'realtime' ? 'bg-brand-primary text-white font-bold' : 'bg-brand-bg text-slate-400'}`}
              >
                REALTIME
              </button>
              <button 
                onClick={() => setActiveFrequency('hour')}
                className={`px-3 py-1.5 ${activeFrequency === 'hour' ? 'bg-brand-primary text-white font-bold' : 'bg-brand-bg text-slate-400'}`}
              >
                HOURLY
              </button>
              <button 
                onClick={() => setActiveFrequency('day')}
                className={`px-3 py-1.5 ${activeFrequency === 'day' ? 'bg-brand-primary text-white font-bold' : 'bg-brand-bg text-slate-400'}`}
              >
                DAILY
              </button>
            </div>
          </div>

          {/* Setting togglers */}
          <div className="space-y-4 border-t border-white/5 pt-5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200 block">Continuous Dual-Agent Verification</span>
                <p className="text-[10px] text-slate-400">Always crosscheck suggested model moves with the Pricing Auditor node before prompting.</p>
              </div>
              <button 
                onClick={() => setEnableAutoAudit(!enableAutoAudit)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${enableAutoAudit ? 'bg-brand-success' : 'bg-slate-700'}`}
              >
                <div className={`h-4.5 w-4.5 rounded-full bg-white absolute top-0.5 transition-all ${enableAutoAudit ? 'left-5.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200 block">Slack Integration Webhooks</span>
                <p className="text-[10px] text-slate-400">Allow approved execution templates to draft messages to cloud alert chats.</p>
              </div>
              <button 
                onClick={() => setEnableSlack(!enableSlack)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${enableSlack ? 'bg-brand-success' : 'bg-slate-700'}`}
              >
                <div className={`h-4.5 w-4.5 rounded-full bg-white absolute top-0.5 transition-all ${enableSlack ? 'left-5.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end border-t border-white/5 gap-3.5">
            {isSaved && <span className="text-xs font-bold font-mono text-brand-success">Configurations committed successfully!</span>}
            <button
              onClick={handleSave}
              className="bg-brand-primary hover:bg-brand-primary/80 text-white font-bold text-xs py-2 px-6 rounded-lg uppercase tracking-wider transition-all cursor-pointer"
            >
              Commit Settings policies
            </button>
          </div>
        </div>

        {/* Right Column: Key guidelines */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-brand-panel border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">KEYS & SECRET SECURE ACCESS</h3>
            <p className="text-[10.5px] text-slate-400 leading-normal">
              CreditSheriff AI coordinates secure cloud API tokens using environment variables. Access keys must never be hardcoded or written into local files directly.
            </p>
            <div className="p-3 bg-brand-bg rounded-lg border border-white/5 font-mono text-[9px] text-slate-500 space-y-1">
              <p># Settings Guidelines</p>
              <p>Configure credentials inside:</p>
              <p className="text-white">Settings &rsaquo; Secrets Panel</p>
            </div>
          </div>

          <div className="bg-[#121A2A]/40 border border-white/5 rounded-xl p-5 shadow-lg space-y-3 font-sans text-xs">
            <div className="flex items-center space-x-2 text-slate-200 font-semibold border-b border-white/5 pb-2">
              <HardDrive className="h-4 w-4 text-brand-primary" />
              <span>CONTAINER INFRASTRUCTURE</span>
            </div>
            <div className="space-y-2 text-[10.5px] text-slate-400">
              <p>Status: <strong className="text-brand-success font-semibold">SECURE SANDBOX ALIGNED</strong></p>
              <p>External Target port: <span className="font-mono text-slate-300 font-bold">3000</span></p>
              <p>Authentication Node Level: <span className="font-mono text-slate-300 font-bold">Standard operator role</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
