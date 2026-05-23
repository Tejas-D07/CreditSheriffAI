import { 
  BookOpen, Search, PlusCircle, Check, Tag, ShieldCheck, HelpCircle, 
  Cpu, FileCode, Terminal, Network, Info, Server, Layers, Settings, 
  ChevronRight, Code, Database, Globe, Cloud, Zap, ArrowDown, SquareCode, Flame
} from 'lucide-react';
import { RAGItem } from '../types';
import React, { useState } from 'react';

interface KnowledgeBaseViewProps {
  knowledgeDb: RAGItem[];
  onAddKnowledge: (title: string, content: string, section: string, tags: string[]) => Promise<void>;
}

export default function KnowledgeBaseView({ knowledgeDb, onAddKnowledge }: KnowledgeBaseViewProps) {
  const [activeTab, setActiveTab] = useState<'rag' | 'architecture'>('rag');
  const [activeSubTab, setActiveSubTab] = useState<string>('blueprint');
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("all");
  const [isAdding, setIsAdding] = useState(false);
  
  // Custom dialog parameters
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [section, setSection] = useState("Pricing Rules");
  const [tagsText, setTagsText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sections = ['all', 'Pricing Rules', 'Optimization Strategies', 'Model Capabilities', 'Context Limits'];

  const filteredItems = knowledgeDb.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection = activeSection === 'all' || item.section === activeSection;
    return matchesSearch && matchesSection;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsSubmitting(true);
    const splitTags = tagsText.split(',').map((t) => t.trim()).filter((t) => t.length > 0);
    await onAddKnowledge(title, content, section, splitTags);
    
    // Clear state
    setTitle("");
    setContent("");
    setSection("Pricing Rules");
    setTagsText("");
    setIsAdding(false);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6" id="knowledgebase-container">
      {/* Top Selector Panel */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-heading">Sheriff Resource & Blueprint Center</h2>
          <p className="text-slate-400 text-xs mt-1">
            Toggle between semantic guidelines referenced by agent modules or the full system production blueprint.
          </p>
        </div>

        {/* Prime View Tabs */}
        <div className="flex border border-white/10 rounded-xl overflow-hidden p-1 bg-[#121A2A]/40 min-w-[320px] shrink-0">
          <button
            onClick={() => setActiveTab('rag')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'rag' 
                ? 'bg-brand-primary text-white font-bold shadow-md shadow-brand-primary/15' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>Semantic RAG</span>
          </button>
          
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'architecture' 
                ? 'bg-brand-primary text-white font-bold shadow-md shadow-brand-primary/15' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            <span>Architecture Manual</span>
          </button>
        </div>
      </div>

      {activeTab === 'rag' ? (
        // ==================== TAB 1: SEMANTIC RAG VIEW ====================
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest leading-none">RAG Semantic Guidelines</h3>
              <p className="text-slate-400 text-xs mt-1.5">
                These factual indices guide the double-auditing cycles, matching context limits and pricing thresholds securely.
              </p>
            </div>

            <button
              onClick={() => setIsAdding(!isAdding)}
              id="add-custom-knowledge-rule-btn"
              className="bg-brand-primary hover:bg-brand-primary/80 text-white font-bold text-xs py-2 px-4 rounded-lg tracking-wider uppercase transition-all duration-150 flex items-center space-x-1.5 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{isAdding ? "Close New Rule" : "Add Custom Rule"}</span>
            </button>
          </div>

          {/* Form to submit Custom Knowledge Rules */}
          {isAdding && (
            <form onSubmit={handleSubmit} className="bg-brand-panel border border-white/10 rounded-xl p-5 space-y-4 shadow-xl" id="add-knowledge-form">
              <div className="border-b border-white/5 pb-2">
                <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-widest leading-none">Declare Custom Pricing Rule or Capability</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-mono uppercase text-slate-400">Rule/Guide Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Claude 3.5 Sonnet Patch Matrix"
                    required
                    className="w-full bg-brand-bg border border-white/10 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-primary"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-mono uppercase text-slate-400">Classification Section</label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full bg-brand-bg border border-white/10 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-primary"
                  >
                    <option value="Pricing Rules">Pricing Rules</option>
                    <option value="Optimization Strategies">Optimization Strategies</option>
                    <option value="Model Capabilities">Model Capabilities</option>
                    <option value="Context Limits">Context Limits</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10.5px] font-mono uppercase text-slate-400">Knowledge Content (Factual guidelines cited by nodes)</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Provide exact values, specifications, context discounts, pricing limits..."
                  required
                  rows={3}
                  className="w-full bg-brand-bg border border-white/10 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-primary leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-mono uppercase text-slate-400">Searchable Tags (Comma grouped)</label>
                  <input
                    type="text"
                    value={tagsText}
                    onChange={(e) => setTagsText(e.target.value)}
                    placeholder="claude, pricing, discount"
                    className="w-full bg-brand-bg border border-white/10 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="flex items-end justify-end md:pb-1 shrink-0">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-brand-success text-white font-bold py-2 px-6 rounded-lg text-xs hover:opacity-90 transition-all uppercase tracking-wider cursor-pointer"
                  >
                    Commit Rule to Vector Store
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Search rule box */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search verified pricing indices..."
                className="w-full bg-brand-panel border border-white/5 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-200 focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Classification category toggles */}
            <div className="flex flex-wrap gap-2">
              {sections.map((sect) => (
                <button
                  key={sect}
                  onClick={() => setActiveSection(sect)}
                  className={`px-3 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer uppercase ${
                    activeSection === sect 
                      ? 'bg-purple-600/35 text-white font-bold border border-purple-500/30' 
                      : 'bg-brand-panel border border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sect}
                </button>
              ))}
            </div>
          </div>

          {/* Grids display cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="knowledge-cards-layout">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-brand-panel border border-white/5 rounded-xl p-4.5 hover:border-white/10 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 font-bold uppercase">
                    <span>{item.section}</span>
                    <span>ACTIVE EMBEDDING</span>
                  </div>
                  
                  <h4 className="text-xs font-bold text-slate-200 leading-snug">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm line-clamp-4">{item.content}</p>
                </div>

                {/* Bottom tags */}
                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-[8.5px] font-mono bg-brand-bg border border-white/5 text-slate-400 py-0.5 px-1.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 font-bold">{item.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // ==================== TAB 2: SYSTEM ARCHITECTURE MANUAL ====================
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start animate-fadeIn">
          {/* Sub Navigation Sidebar */}
          <div className="space-y-2.5 lg:col-span-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold block mb-1">Architecture Outline</span>
            {[
              { id: 'blueprint', label: '1. Pipeline Blueprint & Flow', icon: Network },
              { id: 'folders', label: '2. System Folder Layout', icon: FileCode },
              { id: 'backends', label: '3. FastAPI & Agent Setup', icon: Cpu },
              { id: 'contracts', label: '4. API Design Contracts', icon: Terminal },
              { id: 'production', label: '5. GCP Cloud Deployment', icon: Cloud },
            ].map((sub) => {
              const Icon = sub.icon;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubTab(sub.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase flex items-center space-x-3 cursor-pointer border ${
                    activeSubTab === sub.id 
                      ? 'bg-brand-primary/10 border-brand-primary/30 text-white' 
                      : 'bg-brand-panel border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4 text-brand-primary" />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-3 bg-brand-panel border border-white/5 rounded-2xl p-6 space-y-6">
            
            {/* SUB-TAB: PIPELINE BLUEPRINT & FLOW */}
            {activeSubTab === 'blueprint' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                    <Network className="h-4 w-4 text-brand-primary" />
                    <span>Multi-Agent Platform System & Data Pipeline</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    An architectural flow mapping ingest transactions, agent loops, RAG context lookups, verification checks, and final approved push executions cleanly.
                  </p>
                </div>

                {/* ASCII Art flow mapping */}
                <div className="bg-[#0B1020]/90 border border-white/10 rounded-xl p-4.5 font-mono text-[10.5px] leading-relaxed text-slate-300 overflow-x-auto space-y-1">
                  <p className="text-brand-primary font-bold">RAW TELEMETRY INGESTION (CSV/JSON)</p>
                  <p className="text-slate-500">  │ </p>
                  <p className="text-slate-400">  ▼ </p>
                  <p className="text-brand-primary font-bold">TOKENIZER PARSING ENGINE</p>
                  <p className="text-slate-500">  ├─&rsaquo; Validates payload layout schema specs</p>
                  <p className="text-slate-500">  │ </p>
                  <p className="text-slate-400">  ▼ </p>
                  <p className="text-purple-400 font-bold">CHROMADB VECTOR STORAGE (Semantic Embeddings Lookup)</p>
                  <p className="text-slate-500">  ├─&rsaquo; Queries model pricing structures & suitability heuristics</p>
                  <p className="text-slate-500">  │ </p>
                  <p className="text-slate-400">  ▼ </p>
                  <p className="text-brand-primary font-bold">AGENT 1: OPTIMIZER ENGINE (Gemini 2.5 Flash)</p>
                  <p className="text-slate-500">  ├─&rsaquo; Identifies misclassified prompt workloads & token bloat patterns</p>
                  <p className="text-slate-500">  ├─&rsaquo; Calculates monthly project savings & models migrations</p>
                  <p className="text-slate-500">  │ </p>
                  <p className="text-slate-400">  ▼ </p>
                  <p className="text-brand-success font-bold">AGENT 2: PRICING AUDITOR NODE (Dual Verification Auditor)</p>
                  <p className="text-slate-500">  ├─&rsaquo; Validates latency impact index, pricing math correctness</p>
                  <p className="text-slate-500">  ├─&rsaquo; scores model capabilities, context windows, and hallucination risks</p>
                  <p className="text-slate-500">  │ </p>
                  <p className="text-slate-400">  ▼ </p>
                  <p className="text-white font-bold">HUMAN OPERATOR APPROVAL CARDS (Safety Audit Gates)</p>
                  <p className="text-slate-500">  ├─&rsaquo; User clicks Approve Plan or Reject Plan</p>
                  <p className="text-slate-500">  │ </p>
                  <p className="text-slate-400">  ▼ </p>
                  <p className="text-brand-success font-bold">ACTION DISPATCHER ENGINE (Step-by-Step Commit & Notify Tools)</p>
                  <p className="text-slate-500">  ├─&rsaquo; Pull Request Commits, Jira Tasks, Slack webhooks, Cloud Alert Policies</p>
                </div>

                <div className="bg-[#121A2A]/40 p-4 rounded-xl border border-white/5 space-y-4">
                  <h4 className="text-xs font-bold text-slate-200 uppercase">Core Architectural Pillars</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-brand-primary font-bold uppercase block text-[10.5px]">Dual Agent Verification:</span>
                      <p className="text-slate-400 leading-normal">
                        To prevent low-confidence advice, the Pricing Auditor executes a programmatic scoring checklist. No prompt reaches the board dashboard without a confidence rate &gt; 80%.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-brand-success font-bold uppercase block text-[10.5px]">RAG Pricing Context:</span>
                      <p className="text-slate-400 leading-normal">
                        Using embedding models, the pricing knowledge matrix is searched using the nearest cosine similarity matching, allowing the optimizer to verify live, exact token prices.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB: SYSTEM FOLDER LAYOUT */}
            {activeSubTab === 'folders' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                    <FileCode className="h-4 w-4 text-brand-primary" />
                    <span>Complete System Directory Structure Map</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    An overview of file groupings inside the React + FastAPI + ChromaDB multi-agent production environment.
                  </p>
                </div>

                <div className="bg-[#0B1020]/90 border border-white/10 rounded-xl p-4.5 font-mono text-xs leading-relaxed text-slate-300 overflow-x-auto">
                  <pre>{`creditsheriff-platform/
├── README.md                  # Quickstart configurations
├── docker-compose.yml         # Container clustering configuration
├── requirements.txt           # Python dependency locks
├── package.json               # Vite client build configurations
├── .env.example               # Environmental secrets skeleton
├── backend/                   # FastAPI Server Layer
│   ├── main.py                # Primary Web Gateway routes
│   ├── config.py              # GCP, API keys & environment parsing
│   ├── database/              # Firestore state adapters
│   │   └── models.py          # Relational metadata structures
│   ├── vectordb/              # ChromaDB client connector
│   │   └── client.py          # Embedding search & ingestion logic
│   └── agents/                # Dual Agent Orchestration
│       ├── __init__.py
│       ├── optimizer.py       # Optimization Agent using Gemini Flash
│       └── auditor.py         # Verification Agent & capability audits
├── src/                       # React Frontend Ecosystem
│   ├── main.tsx               # Client entrypoint bootstraps
│   ├── App.tsx                # Context router & view state controller
│   ├── index.css              # Font definitions and glassmorphic styles
│   ├── types.ts               # Shared TypeScript data models
│   ├── data/
│   │   └── mockUsage.ts       # Preset log files & initial structures
│   └── components/            # UI components and analytical tabs
│       ├── Header.tsx         # Unified profile & telemetry triggers
│       ├── Sidebar.tsx        # Command view switcher with badges
│       ├── DashboardView.tsx  # Dynamic Recharts spend projections charts
│       ├── AnalysisView.tsx   # Interactive log pasted and animation pipelines
│       ├── RecommendationsView.tsx # Plan approval and side-by-side agent logs
│       ├── ExecutionCenterView.tsx # Action dispatcher, code viewer & interactive logs
│       ├── ObservabilityView.tsx   # Step-by-step flowchart visualization graphs
│       └── KnowledgeBaseView.tsx   # Semantic search panel & architectural documentation
└── firestore.rules            # Database structural protection rules`}</pre>
                </div>
              </div>
            )}

            {/* SUB-TAB: FASTAPI & AGENT SETUP */}
            {activeSubTab === 'backends' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                    <Cpu className="h-4 w-4 text-brand-primary" />
                    <span>FastAPI Endpoint & Agent Codes Setup</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    A comprehensive Python template incorporating FastAPI gateway routing, the Optimization Agent (using Gemini Flash via Google GenAI SDK), the Auditor Agent program, and ChromaDB vector lookups.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] font-mono tracking-widest text-[#FFB86C] uppercase font-bold">backend/agents/optimizer.py (Python Spec)</span>
                  </div>
                  <pre className="p-4 bg-[#0B1020]/95 border border-white/10 rounded-xl font-mono text-[10.5px] text-slate-300 overflow-x-auto leading-relaxed max-h-[420px]">
{`import os
from google import genai
from google.genai import types
from chromadb import HttpClient

class CreditSheriffOrchestrator:
    def __init__(self):
        # Instantiate modern Gemini SDK client 
        self.ai = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        # Instantiate ChromaDB Client for retrieved pricing metrics
        self.vector_db = HttpClient(host="localhost", port=8000)
        self.collection = self.vector_db.get_or_create_collection("pricing_indices")

    async def retrieve_rag_context(self, model_name: str, workload: str) -> str:
        """Query ChromaDB for model suitability credentials and prices"""
        query_text = f"pricing and capacity metrics for {model_name} in {workload}"
        results = self.collection.query(
            query_texts=[query_text],
            n_results=2
        )
        documents = results.get("documents", [])
        return "\\n".join([doc for sublist in documents for doc in sublist])

    async def run_optimization_analysis(self, raw_logs: str) -> dict:
        """Agent 1: Optimization Architect evaluates inefficiencies"""
        # Search global model capability standards using ChromaDB
        rag_context = await self.retrieve_rag_context("GPT-4", "FAQ and Classification")
        
        prompt = f"""
        You are CreditSheriff Optimization Agent. Analyze these usage transaction logs:
        {raw_logs}
        
        Synthesize RAG Pricing Context:
        {rag_context}
        
        Identify inefficiencies like:
        1. Simple classification run on expensive GPT-4
        2. Bloated context sizes that could use token compression
        3. Identical twin requests that can be cached
        
        Output a detailed optimization JSON recommendation structure.
        """
        
        response = self.ai.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1
            )
        )
        return response.text`}
                  </pre>
                </div>

                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] font-mono tracking-widest text-brand-success uppercase font-bold">backend/agents/auditor.py (Python Spec)</span>
                  </div>
                  <pre className="p-4 bg-[#0B1020]/95 border border-white/10 rounded-xl font-mono text-[10.5px] text-slate-300 overflow-x-auto leading-relaxed max-h-[380px]">
{`from google import genai
from google.genai import types

class EnterpriseAuditorAgent:
    def __init__(self):
        self.ai = genai.Client()

    async def verify_recommendation(self, rec_data: dict, rag_rules: str) -> dict:
        """Agent 2: Dual Verification Pricing Auditor checks cost accuracy & capabilities"""
        prompt = f"""
        Validate this proposed model replacement migration plan:
        Proposed Replacement: {rec_data.get("currentModel")} -> {rec_data.get("suggestedModel")}
        Current Cost: {rec_data.get("originalCost")} | Optimized Cost: {rec_data.get("optimizedCost")}
        
        retrieved RAG pricing constraint policies:
        {rag_rules}
        
        Task:
        1. Check pricing math correctness.
        2. Verify suggested replacement model has required capability matching and context sizes.
        3. Calculate a confidence level (0-100) and hallucination risk rate (low, med, high).
        
        Return a JSON response matching:
        {{
           "verified": bool,
           "confidence": int,
           "riskScore": int,
           "reason": str
        }}
        """
        response = self.ai.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.0
            )
        )
        return response.text`}
                  </pre>
                </div>
              </div>
            )}

            {/* SUB-TAB: API DESIGN CONTRACTS */}
            {activeSubTab === 'contracts' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                    <Terminal className="h-4 w-4 text-brand-primary" />
                    <span>REST API & Integration Contracts Specifications</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Formal interface definitions for dual-agent logs mapping, plan status transition, and automated hook delivery.
                  </p>
                </div>

                <div className="space-y-5 text-xs text-slate-300">
                  
                  {/* Endpoint 1 */}
                  <div className="bg-[#0B1020]/60 p-4 rounded-xl border border-white/5 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2 flex-row">
                      <span className="font-mono text-brand-primary font-bold">1. POST /api/analyze-logs</span>
                      <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">Pipeline Trigger</span>
                    </div>
                    <p className="text-slate-400">Pastes raw telemetry text. Launches ingestion pipelines, checks RAG pricing context models, matches patterns, runs auditor validation, and indexes recommendations.</p>
                    <div className="space-y-1">
                      <p className="font-mono text-[10px] text-slate-500">Request Body Payload:</p>
                      <pre className="p-2.5 bg-black/40 rounded font-mono text-[9.5px] text-slate-400">
{`{
  "logsText": "timestamp,provider,model,endpoint,tokens,cost\\n2026-05-23,OpenAI,gpt-4,faq,240000,45.0",
  "format": "csv"
}`}
                      </pre>
                    </div>
                  </div>

                  {/* Endpoint 2 */}
                  <div className="bg-[#0B1020]/60 p-4 rounded-xl border border-white/5 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2 flex-row">
                      <span className="font-mono text-brand-success font-bold">2. POST /api/recommendations/:id/action</span>
                      <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">Human Gatekeeper Gate</span>
                    </div>
                    <p className="text-slate-400">Human operators click Approve or Reject. Approved plans generate Git actions, Slack notification blocks, and Jira tasks in the task queue.</p>
                    <div className="space-y-1">
                      <p className="font-mono text-[10px] text-slate-500">Request Body Payload:</p>
                      <pre className="p-2.5 bg-black/40 rounded font-mono text-[9.5px] text-slate-400">
{`{
  "status": "approved" // or "rejected"
}`}
                      </pre>
                    </div>
                  </div>

                  {/* Endpoint 3 */}
                  <div className="bg-[#0B1020]/60 p-4 rounded-xl border border-white/5 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2 flex-row">
                      <span className="font-mono text-purple-400 font-bold">3. POST /api/tasks/:id/execute</span>
                      <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">Execution Center Command</span>
                    </div>
                    <p className="text-slate-400">Executes the task using background automation scripts (pushing commits, sending webhook alerts, writing monitoring thresholds).</p>
                    <div className="space-y-1">
                      <p className="font-mono text-[10px] text-slate-500">Response Payload:</p>
                      <pre className="p-2.5 bg-black/40 rounded font-mono text-[9.5px] text-slate-400">
{`{
  "success": true,
  "task": {
    "id": "task-1",
    "status": "executed",
    "actionOutput": "[INFRA DISPATCH] Committed pull request #203 to production repo.\\n- model: gpt-4\\n+ model: gemini-2.5-flash"
  }
}`}
                      </pre>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* SUB-TAB: GCP CLOUD DEPLOYMENT */}
            {activeSubTab === 'production' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                    <Cloud className="h-4 w-4 text-brand-primary" />
                    <span>GCP Cloud Build & Cloud Run Containerization specs</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Deploying CreditSheriff securely to serverless container hosting (Google Cloud Run), incorporating Artifact Registry and secret vaults.
                  </p>
                </div>

                {/* Step 1 Dockerfile */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1">
                    <span className="text-xs font-bold text-slate-200">1. Production Dockerfile Specifications</span>
                  </div>
                  <pre className="p-4 bg-[#0B1020]/95 border border-white/10 rounded-xl font-mono text-[10px] text-slate-300 overflow-x-auto leading-relaxed">
{`# Multi-stage production docker build for premium security
FROM node:20-bookworm-slim AS client-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM python:3.11-slim-bookworm
WORKDIR /app

# Install system utilities and copy dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy assets and server scripts
COPY --from=client-builder /app/dist ./dist
COPY backend ./backend

# Inject required environment properties
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Run FastAPI server binding with container ingress specifications
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "3000"]`}
                  </pre>
                </div>

                {/* Step 2 Command commands */}
                <div className="space-y-3.5 mt-6 border-t border-white/5 pt-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1">
                    <span className="text-xs font-bold text-slate-200">2. Active GCP Cloud Shell Commands</span>
                  </div>
                  <p className="text-xs text-slate-400">Follow these command protocols to provision and deploy CreditSheriff in your Google Cloud organization environment.</p>

                  <div className="bg-[#0B1020]/80 p-4 rounded-xl border border-white/5 font-mono text-[10.5px] text-slate-300 space-y-3">
                    <div>
                      <p className="text-slate-500"># Enable standard Google Cloud APIs</p>
                      <p className="text-white">gcloud services enable run.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com</p>
                    </div>
                    <div>
                      <p className="text-slate-500"># Provision Docker Artifact Registry repository in asia-east1 region</p>
                      <p className="text-white">gcloud artifacts repositories create creditsheriff-repo --repository-format=docker --location=asia-east1</p>
                    </div>
                    <div>
                      <p className="text-slate-500"># Authenticate local configuration with standard API keys from Secret Manager</p>
                      <p className="text-white">gcloud secrets create GEMINI_API_KEY --data-file=".env"</p>
                    </div>
                    <div>
                      <p className="text-slate-500"># Build container image and deploy seamlessly in your Cloud Run instance with target ingress port 3000</p>
                      <p className="text-white">gcloud run deploy creditsheriff-service \</p>
                      <p className="text-white">  --source . \</p>
                      <p className="text-white">  --region=asia-east1 \</p>
                      <p className="text-white">  --port=3000 \</p>
                      <p className="text-white">  --set-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest \</p>
                      <p className="text-white">  --allow-unauthenticated</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
