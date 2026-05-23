import { Play, Check, AlertTriangle, FileCode, MessageSquare, ShieldAlert, GitCommit, RefreshCw, Terminal, Copy, Loader2, CheckCircle2, ChevronRight, ShieldCheck, Cpu, Activity } from 'lucide-react';
import { ExecutableTask } from '../types';
import React, { useState } from 'react';

interface ExecutionCenterViewProps {
  tasks: ExecutableTask[];
  onExecuteTask: (id: string) => Promise<void>;
}

export default function ExecutionCenterView({ tasks, onExecuteTask }: ExecutionCenterViewProps) {
  const [activeTaskSnippet, setActiveTaskSnippet] = useState<string | null>(tasks[0]?.id || null);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [deploymentStage, setDeploymentStage] = useState<'idle' | 'staging' | 'compliance' | 'patching' | 'verifying' | 'completed'>('idle');

  const getIcon = (type: string) => {
    switch (type) {
      case 'config': return <FileCode className="h-5 w-5 text-brand-primary" />;
      case 'pr': return <GitCommit className="h-5 w-5 text-brand-purple" />;
      case 'slack': return <MessageSquare className="h-5 w-5 text-[#36C5F0]" />;
      default: return <ShieldAlert className="h-5 w-5 text-brand-warning" />;
    }
  };

  const handleExecute = async (id: string) => {
    setExecutingId(id);
    setActiveTaskSnippet(id);
    
    // Step through the beautiful DevOps pipeline stages!
    setDeploymentStage('staging');
    await new Promise(res => setTimeout(res, 600));
    
    setDeploymentStage('compliance');
    await new Promise(res => setTimeout(res, 600));
    
    setDeploymentStage('patching');
    await new Promise(res => setTimeout(res, 800));
    
    setDeploymentStage('verifying');
    await new Promise(res => setTimeout(res, 500));

    await onExecuteTask(id);
    setDeploymentStage('completed');
    setExecutingId(null);
  };

  return (
    <div className="space-y-6 select-none relative animate-pulse-subtle" id="execution-center-container">
      {/* Absolute background visual highlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-purple/5 rounded-full blur-[90px] pointer-events-none" />

      {/* View Header */}
      <div>
        <h2 className="text-xl font-bold text-white font-heading tracking-tight flex items-center space-x-2">
          <Terminal className="h-5 w-5 text-brand-primary" />
          <span className="uppercase tracking-wide">DevOps Deployment Deck</span>
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          Review secure Terraform patches, automated GitHub pull requests, and Slack alerts. Run deployment routines to trigger live configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="execution-split-grids">
        
        {/* Left column: Checklist of approved items */}
        <div className="lg:col-span-5 bg-[#0D132D]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#8A9FB4] uppercase">APPROVED STAGED COMMITS</span>
              <span className="text-[9px] font-mono text-slate-500">QUEUE SIZE: 0{tasks.length}</span>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-10 bg-[#050816]/50 border border-white/5 rounded-2xl">
                <AlertTriangle className="h-6 w-6 text-brand-warning mx-auto mb-2 animate-bounce" />
                <p className="text-xs text-slate-400 leading-normal font-mono">
                  Queue vacant. Approve optimization tasks inside recommendations to generate deployment scripts.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => {
                  const isSelected = activeTaskSnippet === task.id;
                  
                  return (
                    <div 
                      key={task.id}
                      onClick={() => {
                        setActiveTaskSnippet(task.id);
                        if (task.status !== 'executed') {
                          setDeploymentStage('idle');
                        } else {
                          setDeploymentStage('completed');
                        }
                      }}
                      id={`task-row-${task.id}`}
                      className={`border p-4 rounded-2xl flex items-center justify-between transition-all duration-300 cursor-pointer ${
                        task.status === 'executed' 
                          ? 'border-brand-success/20 bg-brand-success/[0.02]' 
                          : isSelected 
                            ? 'border-brand-primary/50 bg-[#141C3F]' 
                            : 'border-white/5 bg-[#050816]/40 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-start space-x-3 text-left">
                        <div className="p-2 bg-slate-900 rounded-xl border border-white/5 shrink-0">
                          {getIcon(task.type)}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-200">{task.title}</p>
                          <p className="text-[10px] text-slate-400 max-w-xs line-clamp-1">{task.description}</p>
                          <div className="flex items-center space-x-2 text-[8px] font-mono text-slate-500 uppercase tracking-wider">
                            <span>CREATED: {new Date(task.timestamp).toLocaleTimeString()}</span>
                            <span>&bull;</span>
                            <span className="text-brand-primary font-bold">{task.type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end space-y-2 shrink-0 ml-3">
                        {task.status === 'executed' ? (
                          <span className="bg-brand-success/15 border border-brand-success/30 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold text-[#00E676] flex items-center space-x-1">
                            <Check className="h-3 w-3" />
                            <span>EXECUTED</span>
                          </span>
                        ) : task.status === 'executing' || (executingId === task.id) ? (
                          <span className="bg-brand-primary/15 border border-brand-primary/30 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold text-brand-primary flex items-center space-x-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>ROLLOUT</span>
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExecute(task.id);
                            }}
                            id={`execute-btn-${task.id}`}
                            disabled={executingId !== null}
                            className="bg-brand-primary hover:opacity-95 text-white font-bold font-mono py-1 px-2.5 rounded-lg text-[9.5px] tracking-widest uppercase transition-all duration-200 cursor-pointer flex items-center space-x-1 shadow-md shadow-brand-primary/10"
                          >
                            <Play className="h-3 w-3" />
                            <span>DEPLOY</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <p className="text-[10px] text-slate-500 font-mono mt-4 leading-relaxed text-left border-t border-white/5 pt-3">
            Operator authorization required. CreditSheriff logs actions strictly to persistent journals automatically.
          </p>
        </div>

        {/* Right column: Interactive snippet inspector, syntax glowing code block with copy button */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-[#0D132D]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 shadow-2xl flex-1 flex flex-col justify-between">
            
            {activeTaskSnippet ? (
              (() => {
                const selectedTask = tasks.find(t => t.id === activeTaskSnippet);
                if (!selectedTask) return null;

                return (
                  <div className="flex-1 flex flex-col justify-between h-full space-y-4 relative">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                        <span className="text-[10.5px] font-mono font-bold text-[#8A9FB4] uppercase">CONFIGURATION COMMIT SUITE</span>
                        <div className="text-[9.5px] font-mono text-slate-400 font-bold uppercase">COMMIT_ID: {selectedTask.id}</div>
                      </div>
                      <h4 className="text-xs font-bold text-white text-left">{selectedTask.title} Integration Plan</h4>
                    </div>

                    {/* Integrated Syntax Highlighting styled code console view with Copy button */}
                    <ActiveTaskViewer selectedTask={selectedTask} />

                    {/* Integrated real-time stage transitions below code block as requested */}
                    <div className="bg-[#050816]/70 border border-white/5 p-4 rounded-2xl space-y-3 mt-4 text-left">
                      <span className="text-[8.5px] font-mono font-bold tracking-widest text-[#8A9FB4] uppercase">ROLLOUT DEPLOYMENT PIPELINE STAGES</span>
                      
                      {/* Flex progress indicators */}
                      <div className="grid grid-cols-4 gap-2 text-center text-[9.5px] font-mono relative mt-1 select-none">
                        
                        {/* Stage 1: Staging */}
                        <div className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                          deploymentStage === 'staging' ? 'bg-[#141C3F] border-brand-primary text-brand-primary shadow-[0_0_8px_rgba(79,140,255,0.15)] animate-pulse-subtle' :
                          ['compliance', 'patching', 'verifying', 'completed'].includes(deploymentStage) ? 'bg-[#0D132D] border-[#00E676]/30 text-[#00E676]' :
                          'bg-[#050816] border-white/5 text-slate-500'
                        }`}>
                          <CheckCircle2 className="h-3.5 w-3.5 mb-1" />
                          <span>STAGING</span>
                        </div>

                        {/* Stage 2: Compliance */}
                        <div className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                          deploymentStage === 'compliance' ? 'bg-[#141C3F] border-brand-primary text-brand-primary shadow-[0_0_8px_rgba(79,140,255,0.15)] animate-pulse-subtle' :
                          ['patching', 'verifying', 'completed'].includes(deploymentStage) ? 'bg-[#0D132D] border-[#00E676]/30 text-[#00E676]' :
                          'bg-[#050816] border-white/5 text-slate-500'
                        }`}>
                          <ShieldCheck className="h-3.5 w-3.5 mb-1" />
                          <span>AUDIT</span>
                        </div>

                        {/* Stage 3: Patching */}
                        <div className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                          deploymentStage === 'patching' ? 'bg-[#141C3F] border-brand-primary text-brand-primary shadow-[0_0_8px_rgba(79,140,255,0.15)] animate-pulse-subtle' :
                          ['verifying', 'completed'].includes(deploymentStage) ? 'bg-[#0D132D] border-[#00E676]/30 text-[#00E676]' :
                          'bg-[#050816] border-white/5 text-slate-500'
                        }`}>
                          <Cpu className="h-3.5 w-3.5 mb-1" />
                          <span>PATCHING</span>
                        </div>

                        {/* Stage 4: Verifying */}
                        <div className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                          deploymentStage === 'verifying' ? 'bg-[#141C3F] border-brand-primary text-brand-primary shadow-[0_0_8px_rgba(79,140,255,0.15)] animate-pulse-subtle' :
                          deploymentStage === 'completed' ? 'bg-[#0D132D] border-[#00E676]/30 text-[#00E676]' :
                          'bg-[#050816] border-white/5 text-slate-500'
                        }`}>
                          <Activity className="h-3.5 w-3.5 mb-1" />
                          <span>HEALTH</span>
                        </div>
                        
                      </div>
                    </div>

                  </div>
                );
              })()
            ) : (
              <div className="bg-[#050816]/40 border border-white/5 border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center my-auto h-full">
                <FileCode className="h-8 w-8 text-slate-500 mb-2.5" />
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-mono">
                  Select an approved patch commit on the left pane to view inline syntax codes, trigger dry runs, and deploy container rules.
                </p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

interface ActiveTaskViewerProps {
  selectedTask: ExecutableTask;
}

function ActiveTaskViewer({ selectedTask }: ActiveTaskViewerProps) {
  const artifacts = selectedTask.executionArtifacts;
  const [copied, setCopied] = useState(false);

  const tabsList = [
    { key: 'plan', label: '📄 Migration Plan', content: artifacts?.migrationPlan || selectedTask.codeOrSnippet },
    { key: 'pr', label: '🛠 GitHub Patch', content: artifacts?.githubPR },
    { key: 'terraform', label: '⚙️ Terraform IaC', content: artifacts?.terraform },
    { key: 'kubernetes', label: '🐋 Kubernetes', content: artifacts?.kubernetes },
    { key: 'slack', label: '💬 Slack Hook', content: artifacts?.slackDraft },
    { key: 'jira', label: '🎟 Jira Issue', content: artifacts?.jiraDraft },
    { key: 'policy', label: '⚖ Cost Policy', content: artifacts?.costPolicyRule },
    { key: 'alert', label: '🔔 Budget Alert', content: artifacts?.budgetAlertRule },
  ].filter(t => t.content); // Filter out empty tabs

  const [activeTab, setActiveTab] = useState<string>(tabsList[0]?.key || 'plan');
  const currentTab = tabsList.find(t => t.key === activeTab) || tabsList[0];

  const handleCopyCode = () => {
    if (!currentTab) return;
    navigator.clipboard.writeText(currentTab.content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="border border-white/5 rounded-2xl flex flex-col h-full space-y-3">
      {/* Tab Switcher Headers */}
      {tabsList.length > 1 && (
        <div className="flex items-center space-x-1 overflow-x-auto pb-1.5 pt-0.5 border-b border-white/5 text-[9.5px]" id="devops-tab-scroller">
          {tabsList.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1.5 rounded-lg font-mono font-bold whitespace-nowrap cursor-pointer transition-all ${
                activeTab === t.key 
                  ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/25 shadow-md shadow-brand-primary/5' 
                  : 'text-slate-400 hover:text-slate-200 border border-transparent hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Code Area with COPY Action overlay */}
      <div className="relative group/terminal">
        
        {/* Copy button (Requested: Copy Button) */}
        <button
          onClick={handleCopyCode}
          className="absolute right-3 top-3 bg-slate-900 border border-white/10 hover:border-brand-primary/30 p-1.5 rounded-lg text-slate-400 hover:text-white transition-all duration-200 z-10 cursor-pointer flex items-center space-x-1"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-[#00E676]" />
              <span className="text-[9px] font-mono text-[#00E676] font-bold">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 text-[#8A9FB4]" />
              <span className="text-[9px] font-mono font-bold">COPY</span>
            </>
          )}
        </button>

        <pre className="p-4 bg-[#050816]/95 border border-white/10 rounded-2xl font-mono text-[10px] text-[#4F8CFF] overflow-x-auto leading-relaxed max-h-64 text-left shadow-inner">
          <code className="block select-text">
            {/* Simple simulated premium highlighting layout */}
            {currentTab?.content ? (
              currentTab.content.split('\n').map((line, idx) => {
                let colorClass = 'text-slate-350';
                if (line.includes('resource') || line.includes('provider') || line.includes('variable') || line.includes('import')) {
                  colorClass = 'text-brand-purple font-bold';
                } else if (line.trim().startsWith('#') || line.trim().startsWith('//')) {
                  colorClass = 'text-[#00E676]/70 italic';
                } else if (line.includes('{') || line.includes('}')) {
                  colorClass = 'text-slate-200 font-bold';
                } else if (line.includes('"') || line.includes("'")) {
                  colorClass = 'text-brand-primary';
                }
                
                return (
                  <div key={idx} className="flex select-text">
                    <span className="text-slate-600 inline-block w-8 text-right pr-3 select-none text-[8.5px] border-r border-white/5 mr-3 font-mono">{idx + 1}</span>
                    <span className={`${colorClass}`}>{line}</span>
                  </div>
                );
              })
            ) : (
              selectedTask.codeOrSnippet
            )}
          </code>
        </pre>
      </div>

      {/* Terminal Execution logs summary output */}
      {selectedTask.actionOutput && (
        <div className="bg-[#050816]/75 border border-white/5 p-4 rounded-2xl font-mono text-[9.5px] text-slate-400 space-y-2 text-left">
          <div className="flex items-center space-x-2 text-[#00E676] border-b border-white/5 pb-2 mb-1">
            <CheckCircle2 className="h-4 w-4 shrink-0 animate-pulse" />
            <span className="font-bold uppercase tracking-widest text-[#00E676]">STAGING DISPATCH SUCCESS</span>
          </div>
          <p className="whitespace-pre-line text-slate-300 leading-normal">{selectedTask.actionOutput}</p>
        </div>
      )}
    </div>
  );
}
