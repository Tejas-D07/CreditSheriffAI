import { 
  BarChart3, 
  PlaySquare, 
  Settings as SettingsIcon,
  ShieldAlert,
  MessagesSquare,
  FlaskConical,
  Scale
} from 'lucide-react';
import React from 'react';

export type ViewType = 
  | 'command-center' 
  | 'agent-arena' 
  | 'simulation'
  | 'mission-control'
  | 'governance'
  | 'settings';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  savingsCount: number;
  unapprovedCount: number;
}

export default function Sidebar({ activeView, onViewChange, savingsCount, unapprovedCount }: SidebarProps) {
  
  const menuItems = [
    { id: 'command-center', label: 'Command Center', icon: BarChart3, badge: unapprovedCount },
    { id: 'agent-arena', label: 'Agent Arena', icon: MessagesSquare },
    { id: 'simulation', label: 'Simulation Lab', icon: FlaskConical },
    { id: 'mission-control', label: 'Mission Control', icon: PlaySquare },
    { id: 'governance', label: 'Governance', icon: Scale },
  ];

  return (
    <aside className="w-64 bg-[#080B1E]/95 flex flex-col border-r border-white/5 h-full z-10 select-none backdrop-blur-xl relative" id="main-sidebar">
      {/* Decorative cyber line overlay on top edge */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent" />
      
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center px-6 border-b border-white/5 space-x-3 bg-brand-bg/10">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-primary via-[#8B5CF6] to-pink-500 flex items-center justify-center shadow-lg shadow-brand-primary/20 animate-pulse-subtle">
          <ShieldAlert className="h-4.5 w-4.5 text-white" />
        </div>
        <div>
          <h1 className="font-heading font-bold text-sm leading-none tracking-wider text-white">
            CREDIT<span className="text-brand-primary text-glow">SHERIFF AI</span>
          </h1>
          <span className="text-[8.5px] font-mono tracking-widest text-slate-400 uppercase block mt-0.5 font-bold">
            THE AI CFO COMMAND CENTER
          </span>
        </div>
      </div>

      {/* Menu Options Group with Capsule highlight and Glow */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto cyber-dots">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              id={`sidebar-item-${item.id}`}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer relative group ${
                isActive
                  ? 'bg-gradient-to-r from-brand-primary/15 to-brand-purple/10 text-white border border-brand-primary/30 shadow-[0_0_15px_rgba(79,140,255,0.15)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
              }`}
            >
              {/* Active glow dot left side */}
              {isActive && (
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_#4F8CFF]" />
              )}
              
              <div className={`flex items-center space-x-3 duration-200 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-brand-primary' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className={isActive ? 'text-white font-semibold' : 'text-slate-400'}>{item.label}</span>
              </div>
              
              {/* Underlined highlight hover tracker */}
              <div className="absolute bottom-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

              {/* Conditional Badges */}
              {item.badge && item.badge > 0 ? (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                  item.id === 'command-center' 
                    ? 'bg-brand-danger/20 text-brand-danger animate-pulse border border-brand-danger/20'
                    : 'bg-brand-primary/20 text-brand-primary'
                }`}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Sidebar bottom indicator with futuristic telemetry metrics and settings gear */}
      <div className="p-4 border-t border-white/5 bg-[#070918] space-y-4">
        {/* Savings co-pilot card */}
        <div className="bg-gradient-to-tr from-[#101535] to-[#151E4E] border border-brand-primary/10 p-4 rounded-2xl flex flex-col space-y-2 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-success/5 rounded-full blur-xl pointer-events-none" />
          <p className="text-[9.5px] text-slate-400 uppercase tracking-widest font-mono font-bold">SAVINGS CO-PILOT</p>
          
          <div className="flex items-baseline justify-between">
            <span className="text-lg text-brand-success font-bold font-mono tracking-tight text-shadow">
              ${savingsCount.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">/ Month</span>
          </div>

          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-1 relative">
            <div className="absolute inset-0 bg-brand-success/15 w-full animate-pulse" />
            <div className="h-full bg-gradient-to-r from-brand-primary to-brand-success rounded-full duration-500 ease-out" style={{ width: '68%' }} />
          </div>
          
          <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 pt-1">
            <span>COMPLIANCE RATING:</span>
            <span className="text-brand-success font-bold">94%</span>
          </div>
        </div>

        {/* System status & settings gear row */}
        <div className="flex items-center justify-between px-2">
          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-success"></span>
            </span>
            <span className="text-[10px] text-slate-400 bg-brand-success/5 border border-brand-success/10 px-2 py-0.5 rounded font-mono font-bold uppercase">
              ONLINE
            </span>
          </div>

          {/* Settings gear trigger button */}
          <button
            onClick={() => onViewChange('settings')}
            id="sidebar-item-settings"
            title="System Settings"
            className={`p-2 rounded-xl border transition-all duration-300 cursor-pointer group relative ${
              activeView === 'settings'
                ? 'bg-brand-primary/20 border-brand-primary/40 text-brand-primary shadow-[0_0_12px_rgba(79,140,255,0.25)]'
                : 'bg-[#121A2A]/20 border-white/5 hover:border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            <SettingsIcon className={`h-4 w-4 transition-transform group-hover:rotate-45 duration-300`} />
          </button>
        </div>
      </div>
    </aside>
  );
}
