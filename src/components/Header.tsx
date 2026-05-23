import { Search, Bell, ShieldAlert, Cpu, CheckCircle2, UserCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';

interface HeaderProps {
  apiKeyActive: boolean;
  onSearch: (query: string) => void;
}

export default function Header({ apiKeyActive, onSearch }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    onSearch(e.target.value);
  };

  const notifications = [
    { id: 1, title: 'Token Leak Prevented', desc: 'Classification prompt downgraded saving $42.50 today.', type: 'alert' },
    { id: 2, title: 'Prune Opportunity Detected', desc: 'Claude 3.5 Sonnet context sliding recommendations active.', type: 'info' },
    { id: 3, title: 'Security Audit Approved', desc: 'Auditor Node cleared GPT-4o conversion plan.', type: 'success' },
  ];

  return (
    <header className="sticky top-0 z-20 w-full h-16 bg-brand-panel/90 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between">
      {/* Search Input */}
      <div className="relative w-96">
        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search observations, plans, models, or configurations..."
          className="w-full bg-brand-bg/60 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-primary transition-colors"
          id="global-search-input"
        />
      </div>

      {/* Utilities Container */}
      <div className="flex items-center space-x-6">
        {/* API Connection Badge */}
        <div className="flex items-center space-x-2 bg-brand-bg/65 border border-white/5 py-1.5 px-3 rounded-full text-[10px] font-mono tracking-wider">
          <div className={`h-2 w-2 rounded-full ${apiKeyActive ? 'bg-brand-success shadow-[0_0_8px_#2ECC71]' : 'bg-brand-warning animate-pulse'}`} />
          <span className="text-slate-400">GEMINI NODE:</span>
          <span className={apiKeyActive ? 'text-brand-success font-medium' : 'text-brand-warning'}>
            {apiKeyActive ? 'CONNECTED/ACTIVE' : 'HYBRID WORKSPACE'}
          </span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 relative bg-brand-card hover:bg-slate-800 rounded-lg text-slate-300 hover:text-slate-100 transition-colors cursor-pointer"
            id="notification-bell-btn"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-brand-danger rounded-full" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-brand-card border border-white/10 rounded-xl shadow-2xl p-4 z-30 divide-y divide-white/5"
                  id="notifications-overlay"
                >
                  <div className="pb-2 font-semibold text-xs tracking-wider uppercase text-slate-400 flex items-center space-x-1.5">
                    <ShieldAlert className="h-3.5 w-3.5 text-brand-primary" />
                    <span>Active Security Alerts</span>
                  </div>
                  <div className="pt-2 space-y-3 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="text-xs space-y-1 p-1 hover:bg-white/5 rounded transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-200">{n.title}</span>
                          {n.type === 'alert' && <Cpu className="h-3 w-3 text-brand-danger" />}
                          {n.type === 'success' && <CheckCircle2 className="h-3 w-3 text-brand-success" />}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Card */}
        <div className="flex items-center space-x-3 bg-brand-card/50 border border-white/5 py-1 px-3 rounded-lg">
          <div className="text-right">
            <p className="text-[10px] hover:text-white font-mono text-slate-400 select-all font-semibold">tejasd662@gmail.com</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Sheriff Operator</p>
          </div>
          <UserCircle2 className="h-7 w-7 text-brand-primary" />
        </div>
      </div>
    </header>
  );
}
