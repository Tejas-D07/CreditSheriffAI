import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Sidebar, { ViewType } from './components/Sidebar';
import CommandCenterView from './components/CommandCenterView';
import DebateCenterView from './components/DebateCenterView';
import SimulationLabView from './components/SimulationLabView';
import MissionControlView from './components/MissionControlView';
import GovernanceCompositeView from './components/GovernanceCompositeView';
import SettingsView from './components/SettingsView';

import { 
  APILog, 
  OptimizationRecommendation, 
  RAGItem, 
  TraceEvent, 
  ExecutableTask 
} from './types';

import { 
  INITIAL_LOGS, 
  INITIAL_RECOMMENDATIONS, 
  INITIAL_TASKS, 
  INITIAL_TRACES, 
  INITIAL_RAG 
} from './data/mockUsage';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('command-center');
  
  // Composite view sub-tabs states to navigate within merged views cleanly
  const [commandCenterTab, setCommandCenterTab] = useState<'overview' | 'analysis' | 'recommendations'>('overview');
  const [missionControlTab, setMissionControlTab] = useState<'deployer' | 'telemetry'>('deployer');
  const [governanceTab, setGovernanceTab] = useState<'policies' | 'knowledge'>('policies');

  const [logs] = useState<APILog[]>(INITIAL_LOGS);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>(INITIAL_RECOMMENDATIONS);
  const [tasks, setTasks] = useState<ExecutableTask[]>(INITIAL_TASKS);
  const [traces, setTraces] = useState<TraceEvent[]>(INITIAL_TRACES);
  const [knowledgeDb, setKnowledgeDb] = useState<RAGItem[]>(INITIAL_RAG);
  const [apiKeyActive, setApiKeyActive] = useState(false);

  // Sync health parameters on mount
  useEffect(() => {
    async function syncHealth() {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          setApiKeyActive(data.hasApiKey);
        }
      } catch (err) {
        console.warn("Unable to establish connect health: ", err);
      }
    }
    
    // Initial fetch of live servers variables state
    async function fetchServerState() {
      try {
        const [recsRes, tasksRes] = await Promise.all([
          fetch('/api/recommendations'),
          fetch('/api/tasks')
        ]);
        if (recsRes.ok) {
          const recsData = await recsRes.json();
          setRecommendations(recsData);
        }
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData);
        }
      } catch (err) {
        console.warn("State synchronizer offline. Reverting to sandbox state mapping.", err);
      }
    }

    syncHealth();
    fetchServerState();
  }, []);

  // Action callback: Approve / Reject plans
  const handleActionTrigger = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/recommendations/${id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        // Sync states locally on success
        await res.json();
        setRecommendations((prev) => 
          prev.map((r) => r.id === id ? { ...r, status } : r)
        );

        // Fetch tasks if plan is approved to keep execution centre up-to-date
        if (status === 'approved') {
          const tasksRes = await fetch('/api/tasks');
          if (tasksRes.ok) {
            const updatedTasks = await tasksRes.json();
            setTasks(updatedTasks);
          }
        }

        // Add trace tracking
        const newTrace: TraceEvent = {
          id: `trace-action-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          epochTime: Date.now(),
          step: "Human Approval",
          agent: "system",
          category: "success",
          message: `User completed audit action. Set optimization rule ${id} status to ${status.toUpperCase()}.`,
          latencyMs: 15,
        };
        setTraces((prev) => [newTrace, ...prev]);
      }
    } catch {
      // Offline fallback state update
      setRecommendations((prev) => 
        prev.map((r) => r.id === id ? { ...r, status } : r)
      );
    }
  };

  // Action callback: Trigger executor tools
  const handleExecuteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}/execute`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        
        // Sync tasks locally
        setTasks((prev) => 
          prev.map((t) => t.id === id ? { ...t, status: 'executed', actionOutput: data.task?.actionOutput } : t)
        );

        // Create completion trace log
        const updatedTask = tasks.find(t => t.id === id);
        const newTrace: TraceEvent = {
          id: `trace-exec-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          epochTime: Date.now(),
          step: "Tool Execution",
          agent: "system",
          category: "success",
          message: `Commit tool action executed successfully for: "${updatedTask?.title}". Dispatcher returned 200 OK.`,
          latencyMs: 1450,
        };
        setTraces((prev) => [newTrace, ...prev]);
      }
    } catch {
      // Direct offline fallback updates
      setTasks((prev) => 
        prev.map((t) => t.id === id ? { ...t, status: 'executed', actionOutput: "Offline simulation success output log." } : t)
      );
    }
  };

  // Action callback: Add custom knowledge item
  const handleAddKnowledge = async (title: string, content: string, section: string, tags: string[]) => {
    try {
      const res = await fetch('/api/knowledge/add', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, section, tags })
      });
      if (res.ok) {
        const data = await res.json();
        setKnowledgeDb((prev) => [data.item, ...prev]);

        // Trace ingestion
        const newTrace: TraceEvent = {
          id: `trace-custom-rule-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          epochTime: Date.now(),
          step: "RAG Validation",
          agent: "auditor",
          category: "info",
          message: `Injected custom optimization reference rule: "${title}" into direct metadata registry.`,
          latencyMs: 40,
        };
        setTraces((prev) => [newTrace, ...prev]);
      }
    } catch {
      const fallbackItem: RAGItem = {
        id: `rag-fallback-${Date.now()}`,
        title,
        content,
        section,
        tags,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setKnowledgeDb((prev) => [fallbackItem, ...prev]);
    }
  };

  // Inbound analytical logs processor callback
  const handleAnalysisSuccess = (newRecs: any[], newTraces: TraceEvent[], notice?: string) => {
    if (newRecs && newRecs.length > 0) {
      setRecommendations((prev) => [...newRecs, ...prev]);
    }
    if (newTraces && newTraces.length > 0) {
      setTraces((prev) => [...newTraces, ...prev]);
    }
    // Set active page view to recommendations tab inside command center
    setActiveView('command-center');
    setCommandCenterTab('recommendations');
  };

  // Global redirection/navigation intercepter so existing dashboard subviews clicks route correctly!
  const handleNavigateToView = (view: any) => {
    if (view === 'analysis') {
      setActiveView('command-center');
      setCommandCenterTab('analysis');
    } else if (view === 'recommendations') {
      setActiveView('command-center');
      setCommandCenterTab('recommendations');
    } else if (view === 'debates') {
      setActiveView('agent-arena');
    } else if (view === 'execution') {
      setActiveView('mission-control');
      setMissionControlTab('deployer');
    } else if (view === 'observability') {
      setActiveView('mission-control');
      setMissionControlTab('telemetry');
    } else if (view === 'governance') {
      setActiveView('governance');
      setGovernanceTab('policies');
    } else if (view === 'knowledge') {
      setActiveView('governance');
      setGovernanceTab('knowledge');
    } else {
      setActiveView(view as ViewType);
    }
  };

  // Secondary Global search handler
  const handleSearchChange = (query: string) => {
    // Standard catalog queries route if needed
  };

  const pendingRecsCount = recommendations.filter(r => r.status === 'pending').length;
  const potentialSavingsMonthly = recommendations
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.monthlyEstimate, 0);

  return (
    <div className="flex h-screen w-screen bg-white text-slate-800 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeView={activeView} 
        onViewChange={(view) => {
          setActiveView(view);
          if (view === 'command-center') setCommandCenterTab('overview');
          if (view === 'mission-control') setMissionControlTab('deployer');
          if (view === 'governance') setGovernanceTab('policies');
        }} 
        savingsCount={potentialSavingsMonthly} 
        unapprovedCount={pendingRecsCount}
      />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header bar */}
        <Header apiKeyActive={apiKeyActive} onSearch={handleSearchChange} />

        {/* Dynamic Route View Content with Slide animations */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-7xl mx-auto"
            >
              {activeView === 'command-center' && (
                <CommandCenterView
                  logs={logs}
                  recommendations={recommendations}
                  onNavigateToView={handleNavigateToView}
                  onAnalysisSuccess={handleAnalysisSuccess}
                  onActionTrigger={handleActionTrigger}
                  activeSubTab={commandCenterTab}
                  setActiveSubTab={setCommandCenterTab}
                />
              )}
              {activeView === 'agent-arena' && (
                <DebateCenterView recommendations={recommendations} />
              )}
              {activeView === 'simulation' && (
                <SimulationLabView 
                  onAddRecommendationDirectly={(recom) => {
                    setRecommendations((prev) => [recom, ...prev]);
                    setActiveView('command-center');
                    setCommandCenterTab('recommendations');
                  }} 
                />
              )}
              {activeView === 'mission-control' && (
                <MissionControlView
                  tasks={tasks}
                  onExecuteTask={handleExecuteTask}
                  traces={traces}
                  activeSubTab={missionControlTab}
                  setActiveSubTab={setMissionControlTab}
                />
              )}
              {activeView === 'governance' && (
                <GovernanceCompositeView
                  knowledgeDb={knowledgeDb}
                  onAddKnowledge={handleAddKnowledge}
                  activeSubTab={governanceTab}
                  setActiveSubTab={setGovernanceTab}
                />
              )}
              {activeView === 'settings' && (
                <SettingsView />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
