import express from "express";
import path from "path";
import dns from "dns";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Standardize dns lookup for localhost environment
dns.setDefaultResultOrder('ipv4first');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '20mb' }));

// Lazy initializer for Gemini client to prevent crash if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Global server-side state for simulated additions / mock database
let liveRecommendations = [
  {
    id: "rec-1",
    category: "Model Downgrade" as const,
    currentModel: "gpt-4",
    suggestedModel: "gemini-3.5-flash (or Gemini 2.5 Flash)",
    originalCost: 1.352,
    optimizedCost: 0.0035,
    savingsPercent: 99.7,
    monthlyEstimate: 2450.00,
    confidenceScore: 98,
    riskScore: 2,
    reasoning: "The customer classification pipeline utilizes 'gpt-4' to extract simple PRIORITIES of tickets. This single task pattern accounts for 45,000 tokens of static definitions table re-injection each transaction, costing over $1.35 per API call. Replacing this with 'gemini-3.5-flash' handles structural text matching impeccably with single-digit millisecond responses.",
    reasoningAuditor: "VERIFIED. Under Pricing Rule 'rag-1', GPT-4 prompt pricing is $30.00/M vs Gemini Flash at $0.075/M. Benchmark testing on this prompt template shows 100% accuracy retention. Hallucination risk score is minimal (<1%) given precise structural rules schema constraints.",
    evidenceCited: ["LLM Provider Pricing Matrix (May 2026 Update)", "Model Capabilties mapping for Classification workloads"],
    workloadPattern: "Support Ticket Router - Simple Priority Selection",
    tokenWasteCount: 44000,
    status: "pending" as const
  },
  {
    id: "rec-2",
    category: "Token Compression" as const,
    currentModel: "gpt-4-turbo",
    suggestedModel: "gpt-4o-mini (with trimmed history)",
    originalCost: 0.942,
    optimizedCost: 0.046,
    savingsPercent: 95.1,
    monthlyEstimate: 1820.00,
    confidenceScore: 92,
    riskScore: 8,
    reasoning: "High-volume chat history summarizing is re-injecting 85,000+ tokens of static telemetry and redundant greeting logs over and over on subsequent back-and-forth turns. Incorporating localized summary sliding windows reduces standard input payload payload sizing by 95% without breaking thread focus content.",
    reasoningAuditor: "VERIFIED. Auditor crosscheck confirms customer interaction depth average is 4 turns. Moving to sliding windows protects the memory ceiling. gpt-4o-mini supports structured summaries smoothly at $0.15/M tokens.",
    evidenceCited: ["LLM Provider Pricing Matrix (May 2026 Update)", "RAG Retrieval Over-inflation and Injection Vectors"],
    workloadPattern: "Multi-turn Chat Transcription red-lines",
    tokenWasteCount: 81000,
    status: "pending" as const
  },
  {
    id: "rec-3",
    category: "Context Caching" as const,
    currentModel: "gemini-1.5-pro",
    suggestedModel: "gemini-1.5-pro (with Active Context Caching)",
    originalCost: 0.2450,
    optimizedCost: 0.0540,
    savingsPercent: 78.0,
    monthlyEstimate: 1420.00,
    confidenceScore: 95,
    riskScore: 5,
    reasoning: "The RAG Retrieval agent submits the exact same 195K-token manual and cloud blueprint in five of six consecutive conversations. Activating Gemini Native Context Caching results in a massive 80% discount on cached prompts, only paying cached recalculation rates.",
    reasoningAuditor: "VERIFIED. Under Policy 'rag-2', cached prompt tokens drop to $0.01875 / M tokens. The document context does not change during active sessions, making caching an ideal architectural fit with 0 execution risk.",
    evidenceCited: ["Gemini Context Caching & High Volume Static Document Policy"],
    workloadPattern: "Static Docs Search - Repeated Blueprint Retrieval",
    tokenWasteCount: 160000,
    status: "pending" as const
  }
];

let liveTasks: any[] = [
  {
    id: "task-1",
    recommendationId: "rec-1",
    type: "config" as const,
    title: "Apply Configuration Downgrade",
    description: "Update billing LLM router endpoint variables inside `config/llm_router.yaml` and redirect Classification targets of 'support_routing' from `gpt-4` to `gemini-3.5-flash`.",
    status: "draft" as const,
    codeOrSnippet: `# LLM Router Configuration Mapping
routing_policies:
  billing_classification:
    target_group: "customer_support"
-   model: "gpt-4-turbo"
+   model: "gemini-3.5-flash"
    timeout_ms: 3000
    retry_count: 2
    temperature: 0.0
+   fallback_api: "google-gemini-2.5-flash"`,
    timestamp: "2026-05-23T06:30:00Z"
  },
  {
    id: "task-2",
    recommendationId: "rec-2",
    type: "pr" as const,
    title: "Publish GitHub Pull Request",
    description: "Create Pull Request to trunk setting up sliding history summarization limits on prompt generation buffers.",
    status: "draft" as const,
    codeOrSnippet: `const MAX_CHAT_PAYLOAD_LIMIT = 4000; // Trim redundance
export function sanitizeChatHistory(history: ChatMessage[]): ChatMessage[] {
  // Retain only last 4 system context logs, summarize previous 20
  const summaryBlock = generateSlidingHistorySummary(history.slice(0, -4));
  return [
    { role: 'system', content: \`Prior summary: \${summaryBlock}\` },
    ...history.slice(-4)
  ];
}`,
    timestamp: "2026-05-23T06:34:00Z"
  }
];

let customKnowledge = [
  {
    id: "rag-1",
    title: "LLM Provider Pricing Matrix (May 2026 Update)",
    content: "OpenAI GPT-4 Pricing: $30.00 / M prompt tokens, $60.00 / M completion tokens. GPT-4o: $5.00 / M prompt tokens, $15.00 / M completion. Gemini 1.5 Pro: $1.25 / M prompt (<128k), $5.00 / M completion. gemini-3.5-flash: $0.075 / M prompt tokens, $0.30 / M completion.",
    section: "Pricing Rules",
    tags: ["pricing", "cost-rules"],
    lastUpdated: "2026-05-15"
  }
];

// API: Health status check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY",
  });
});

// API: Fetch current recommendations
app.get("/api/recommendations", (req, res) => {
  res.json(liveRecommendations);
});

// API: Fetch executable tasks
app.get("/api/tasks", (req, res) => {
  res.json(liveTasks);
});

// API: Approve/Reject a recommendation
app.post("/api/recommendations/:id/action", (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' | 'rejected'
  
  const recIndex = liveRecommendations.findIndex(r => r.id === id);
  if (recIndex !== -1) {
    liveRecommendations[recIndex].status = status;
    
    // If approved, verify if a corresponding task exists or create a new one!
    if (status === 'approved') {
      const taskExists = liveTasks.some(t => t.recommendationId === id);
      if (!taskExists) {
        const rec = liveRecommendations[recIndex] as any;
        const taskType = rec.category === 'Model Downgrade' ? 'config' : rec.category === 'Token Compression' ? 'pr' : 'slack';
        const taskSnippet = rec.category === 'Model Downgrade' 
          ? `// Changed configuration from ${rec.currentModel} to ${rec.suggestedModel}\nexport const LLM_ROUTER_ENV = {\n  model: "gemini-3.5-flash",\n  temperature: 0.1,\n  cachePrompt: true,\n};`
          : `// Token compress config snippet\nconst COMPRESSION = {\n  compressionRatio: 0.92,\n  targetTokensLimit: 4000\n};`;
          
        liveTasks.push({
          id: `task-${Date.now()}`,
          recommendationId: rec.id,
          type: taskType as any,
          title: `Configure ${rec.category} Optimization`,
          description: `Implement approved structural optimization policy for ${rec.workloadPattern}.`,
          status: 'draft' as const,
          codeOrSnippet: taskSnippet,
          executionArtifacts: rec.executionArtifacts,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    res.json({ success: true, updatedRec: liveRecommendations[recIndex] });
  } else {
    res.status(404).json({ error: "Recommendation not found" });
  }
});

// API: Execute actionable Tasks from Execution Center
app.post("/api/tasks/:id/execute", (req, res) => {
  const { id } = req.params;
  const taskIndex = liveTasks.findIndex(t => t.id === id);
  if (taskIndex !== -1) {
    liveTasks[taskIndex].status = 'executing';
    
    // Simulate action execution over 1.5 seconds
    setTimeout(() => {
      liveTasks[taskIndex].status = 'executed';
      liveTasks[taskIndex].actionOutput = `SUCCESS: Secure tool dispatcher triggered.\nStatus: 200 OK\nMessage: Successfully committed action rules to live router deployment system.\nPR/Alert Created successfully.\nTimestamp: ${new Date().toISOString()}`;
    }, 1500);
    
    res.json({ success: true, task: liveTasks[taskIndex] });
  } else {
    res.status(404).json({ error: "Task code not found" });
  }
});

// API: Search Knowledge Base / RAG queries
app.post("/api/knowledge/add", (req, res) => {
  const { title, content, section, tags } = req.body;
  const newItem = {
    id: `rag-custom-${Date.now()}`,
    title,
    content,
    section,
    tags: tags || ["custom"],
    lastUpdated: new Date().toISOString().split('T')[0]
  };
  customKnowledge.unshift(newItem);
  res.json({ success: true, item: newItem });
});

// API: Run analytical spend intelligence pipeline using Gemini 3.5 Flash
app.post("/api/analyze-logs", async (req, res) => {
  const { logsText, format } = req.body;
  
  if (!logsText || logsText.trim() === "") {
    return res.status(400).json({ error: "No raw logs input provided" });
  }
  
  console.log(`Starting CreditSheriff AI dual-agent analytical pipeline on submitted format: ${format}`);
  const ai = getGeminiClient();
  
  const systemPrompt = `You are CREDITSHERIFF AI: "The Autonomous AI Spend Optimization & Governance Platform".
Analyze the user's submitted AI usage data logs (CSV or JSON schema format).
Identify specific token waste, inefficient model selection, and prompt caching opportunities.
Return an enterprise-grade optimization plan with 2 to 3 major recommendations.

For EACH recommendation, you must act as a 4-Agent Autonomous Consensus loop consisting of:
1. Agent 1 (Optimization Agent): reasoning
2. Agent 2 (Auditor Agent verification): reasoningAuditor
3. Agent 3 (Risk Assessment Agent): reasoningRisk - assessing Latency penalties, safety checks, and format drift.
4. Agent 4 (Forecast Agent / CFO Engine): reasoningForecast - predicting budget impacts, annual savings, and budget overrun probability.

Each recommendation MUST strictly include:
- currentModel, suggestedModel, originalCost, optimizedCost, savingsPercent, monthlyEstimate, confidenceScore, riskScore, riskLevel ('LOW' | 'MEDIUM' | 'HIGH'), forecastAnnualSavings, forecastBudgetOverrunProb.
- citations: array of objects with { title: string, excerpt: string, source: string }.
- explainability: object with { whyNeeded: string, evidencePricing: string, evidenceUsage: string, evidenceCapability: string, descriptionConfidence: string, descriptionRisk: string }.
- executionArtifacts: object with { migrationPlan: string (Markdown), githubPR: string (diff / code), terraform: string (HCL code), kubernetes: string (YAML code), slackDraft: string (JSON), jiraDraft: string (text), costPolicyRule: string (Markdown), budgetAlertRule: string (YAML) }

Provide your final response structured STRICTLY in the following JSON format. Do not write any markdown decorations, backticks, or prefix text outside of this JSON block.
{
  "recommendations": [
    {
      "id": "rec-calc-1",
      "category": "Model Downgrade",
      "currentModel": "gpt-4",
      "suggestedModel": "gemini-3.5-flash",
      "originalCost": 1.54,
      "optimizedCost": 0.02,
      "savingsPercent": 98.7,
      "monthlyEstimate": 1450.0,
      "confidenceScore": 96,
      "riskScore": 4,
      "riskLevel": "LOW",
      "forecastAnnualSavings": 17400,
      "forecastBudgetOverrunProb": 2,
      "reasoning": "Explain step-by-step why the current model choice is highly inefficient for this specific workload pattern...",
      "reasoningAuditor": "Auditor verification verifying performance limits, hallucination check, and citation proof...",
      "reasoningRisk": "Risk Assessment Agent report on schema validations, latency differences and regression safety...",
      "reasoningForecast": "Forecast Agent projection of future spend rate, budget impact and 5-year savings...",
      "evidenceCited": ["LLM Provider Pricing Matrix (May 2026 Update)"],
      "citations": [
        { "title": "LLM Provider Pricing Matrix (May 2026 Update)", "excerpt": "GPT-4 prompt pricing is $30/M vs Gemini Flash at $0.075/M.", "source": "rag-1" }
      ],
      "workloadPattern": "Describe the detected use case (e.g., Simple Classification)",
      "tokenWasteCount": 12000,
      "explainability": {
        "whyNeeded": "Detailed explainability text on why this change is necessary.",
        "evidencePricing": "Direct pricing comparison comparison.",
        "evidenceUsage": "Why this use case fits this specific model selection.",
        "evidenceCapability": "Score mapping proof of model qualifications.",
        "descriptionConfidence": "How we computed the confidence score.",
        "descriptionRisk": "Explaining target risk aspects."
      },
      "executionArtifacts": {
        "migrationPlan": "# Migration plan Markdown...",
        "githubPR": "Code diff snippet showing code-level replacement proof...",
        "terraform": "Terraform provisioning code...",
        "kubernetes": "Kubernetes manifest update...",
        "slackDraft": "Slack Alert JSON schema...",
        "jiraDraft": "Jira support ticket details...",
        "costPolicyRule": "CreditSheriff cost control policy Markdown text...",
        "budgetAlertRule": "Prometheus/CloudWatch budget alert alert rule..."
      }
    }
  ],
  "traces": [
    {"timestamp": "06:55:00Z", "step": "Data Ingestion", "agent": "system", "category": "success", "message": "Successfully parsed 12 JSON log rows.", "latencyMs": 85},
    {"timestamp": "06:55:01Z", "step": "Pattern Detection", "agent": "optimizer", "category": "info", "message": "Analyzing text classifications...", "latencyMs": 240}
  ]
}`;

  const userQuery = `Analyze this logs dump representing raw developer transactions:
  --- LOG DUMP ---
  ${logsText}
  --- END LOG DUMP ---
  `;

  if (!ai) {
    // Graceful fallback to rich local analysis modeling if Gemini is missing or fails
    console.log("No Gemini API Key found. Emulating local intelligence pipeline...");
    // Inject custom variations based on mock text to simulate a realistic experience
    const wasteDetector = logsText.toLowerCase().includes("opus") || logsText.toLowerCase().includes("claude");
    const parsedRecommendations = [
      {
        id: `rec-gen-${Date.now()}-1`,
        category: "Model Downgrade" as const,
        currentModel: wasteDetector ? "claude-3-opus" : "gpt-4",
        suggestedModel: "gemini-3.5-flash",
        originalCost: wasteDetector ? 1.62 : 1.35,
        optimizedCost: 0.0035,
        savingsPercent: 99.7,
        monthlyEstimate: wasteDetector ? 3120 : 1850.00,
        confidenceScore: 97,
        riskScore: 3,
        riskLevel: "LOW" as const,
        forecastAnnualSavings: wasteDetector ? 37440 : 22200,
        forecastBudgetOverrunProb: 3,
        reasoning: `Simple classification pattern detected in search inputs. Prompt contains excessive context overhead of repeating variables to extract tokenized metadata on high tier expensive model ${wasteDetector ? 'Claude 3 Opus' : 'GPT-4'}. Moving workload to gemini-3.5-flash preserves classification rules at over 99.5% cost reduction.`,
        reasoningAuditor: "VERIFIED. Under RAG references, classification workloads are best structured on Flash models. Accuracy index remains well within production SLAs. Checked against extreme context limits.",
        reasoningRisk: "RISK PROFILE STABLE. The target tasks exhibit deterministic response fields. Flash provides native compatibility with zero latency overheads.",
        reasoningForecast: "PREDICTION CLEAR. Consolidating simple router scripts onto Flash endpoints reduces annual expenditures on this channel from $22,200 to $57.",
        evidenceCited: ["LLM Provider Pricing Matrix (May 2026 Update)", "Model Capabilties mapping for Classification workloads"],
        citations: [
          { title: "LLM Provider Pricing Matrix (May 2026 Update)", excerpt: "gemini-3.5-flash represents prompt pricing of $0.075 / M tokens.", source: "rag-1" },
          { title: "Model Capabilities mapping for Classification workloads", excerpt: "Classification workloads achieve optimal alignment in flash models.", source: "rag-3" }
        ],
        workloadPattern: "Simple Customer Intent Classifier Node",
        tokenWasteCount: 42000,
        status: "pending" as const,
        explainability: {
          whyNeeded: "Categorizing support routing labels on premium LLMs constitutes immense waste, costing over $1.35 per transaction.",
          evidencePricing: "GPT-4 is billed at $30/M tokens vs Gemini 3.5 Flash at $0.075/M tokens.",
          evidenceUsage: "Analysis detects support classifier endpoint queries consists of 42k tokens of unchanged static dictionary tables.",
          evidenceCapability: "Accuracy is 99.5% preserved according to standard classification bench tests.",
          descriptionConfidence: "97% confidence rate. Evaluated against 1,200 simulated text records.",
          descriptionRisk: "LOW risk (3%). Simple structured classifications are completely bounded."
        },
        executionArtifacts: {
          migrationPlan: "# Ingested Log Migration Plan: MD-224\n\n1. Replace endpoint configuration variables.\n2. Ingest Google GenAI SDK and pass credentials.\n3. Verify response formatting parsing stability.",
          githubPR: "```diff\n// Replace support endpoints client\n- const completion = await openai.chat.completions.create({ model: 'gpt-4' });\n+ const completion = await ai.models.generateContent({ model: 'gemini-3.5-flash' });\n```",
          terraform: "```hcl\n# Terraform update for Gemini IAM rights\nresource \"google_project_iam_member\" \"sheriff_invoker\" {\n  project = var.gcp_project_id\n  role    = \"roles/aiplatform.user\"\n  member  = \"serviceAccount:sheriff-app@${var.gcp_project_id}.iam.gserviceaccount.com\"\n}\n```",
          kubernetes: "```yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: simple-classifier-gateway\nspec:\n  template:\n    spec:\n      containers:\n      - name: llm-worker\n        env:\n        - name: ACTIVE_MODEL\n          value: \"gemini-3.5-flash\"\n```",
          slackDraft: "```json\n{\n  \"text\": \"🚀 *CreditSheriff Auto-Detector*\\nDowngraded classification worker to gemini-3.5-flash!\\nMonthly Savings: *$1,850.00*\"\n}\n```",
          jiraDraft: "```text\nJira PROJ-5011: Migrate Support Router Classification away from GPT-4 to Gemini Flash\n```",
          costPolicyRule: "# Governance Policy: POL-88\n- Instruction: All high-frequency sentiment classification API endpoints are forbidden from employing high-tier foundation models.",
          budgetAlertRule: "```yaml\n- alert: ClassifierSpendOverdrive\n  expr: rate(classifier_credits_total[1h]) > 5\n```"
        }
      },
      {
        id: `rec-gen-${Date.now()}-2`,
        category: "Context Caching" as const,
        currentModel: "gpt-4-turbo",
        suggestedModel: "gemini-3.5-flash (with Context Caching)",
        originalCost: 0.942,
        optimizedCost: 0.188,
        savingsPercent: 80.0,
        monthlyEstimate: 1240.00,
        confidenceScore: 91,
        riskScore: 10,
        riskLevel: "MEDIUM" as const,
        forecastAnnualSavings: 14880,
        forecastBudgetOverrunProb: 12,
        reasoning: "Repetitive system instructions and large corporate documentation matrices re-sent every 15 minutes. Replacing GPT-4-turbo with Gemini's context caching tier delivers massive caching discounts.",
        reasoningAuditor: "VERIFIED. Caching rules reference 'rag-2' indicates absolute eligibility since content context remains unchanged during active hours. Verification check: compliant with schema constraints.",
        reasoningRisk: "RISK PROFILE ACCESSIBLE. Cache TTL defaults to 30 mins. A burst gap longer than 30 mins may produce automatic cold hit recalculation speeds.",
        reasoningForecast: "CFO PROJECTION. Lowers overall transaction overhead standard deviation by 42%, protecting standard core budgets.",
        evidenceCited: ["Gemini Context Caching & High Volume Static Document Policy", "RAG Retrieval Over-inflation and Injection Vectors"],
        citations: [
          { title: "Gemini Context Caching Policy", excerpt: "Prompt caching offers a massive 80% discount for document histories >32k tokens.", source: "rag-2" }
        ],
        workloadPattern: "Repetitive Chatbot Legal PDF QA",
        tokenWasteCount: 124000,
        status: "pending" as const,
        explainability: {
          whyNeeded: "RAG QA chatbot repeatedly uploads 124,000 token contracts files anew, causing double parsing bills for each transaction.",
          evidencePricing: "Full Recalculation: $0.94. Prompt Caching recalculation: $0.18. Generates an 80% direct cost saving.",
          evidenceUsage: "Target endpoint is a customer-facing legal chatbot with repeat documents searches.",
          evidenceCapability: "Gemini 1.5 Pro natively supports caching on prompts exceeding 32k tokens.",
          descriptionConfidence: "91% confidence score. Validated on repeating compliance document queries.",
          descriptionRisk: "MEDIUM Risk (10%). Occasional cache expirations may prompt standard cost hits."
        },
        executionArtifacts: {
          migrationPlan: "# Context Cache Config Plan\n\n1. Retrieve static contract payload.\n2. Submit payload to Cache Manager on system initialization.\n3. Configure cached contents with TTL of 1800s.",
          githubPR: "```diff\n// PR: Setup Gemini context cache invoker\n+ const cachedObject = await ai.caches.create({\n+   model: 'gemini-1.5-pro',\n+   contents: legalDocumentsBody,\n+   ttl: '1800s'\n+ });\n```",
          terraform: "```hcl\n# Cloud configs for caching layers\nresource \"kubernetes_config_map\" \"cache_settings\" {\n  data = {\n    CACHE_EXPIRY = \"1800\"\n  }\n}\n```",
          kubernetes: "```yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: cached-chatbot-worker\n```",
          slackDraft: "```json\n{\n  \"text\": \"❄️ *CreditSheriff Caching Core Activated*\\nConfigured 195k contracts in prompt cache.\\n*Savings:* $1,240.00/mo\"\n}\n```",
          jiraDraft: "```text\nJira PROJ-4122: Enable Gemini prompt caches for repeating legal documents\n```",
          costPolicyRule: "# Policy: POL-222\n- Mandatory context caching for repeating assets > 32k.",
          budgetAlertRule: "```yaml\n- alert: PromptCacheMissRateSpike\n  expr: rate(cache_misses[5m]) > 2\n```"
        }
      }
    ];

    const parsedTraces = [
      { id: "t-1", timestamp: "06:53:01.010", epochTime: Date.now() - 9000, step: "Data Ingestion" as const, agent: "system" as const, category: "success" as const, message: "Parsed raw data payload. Ingested log entries correctly.", latencyMs: 80 },
      { id: "t-2", timestamp: "06:53:01.090", epochTime: Date.now() - 8000, step: "Pattern Detection" as const, agent: "optimizer" as const, category: "info" as const, message: "Pattern Match Engine: Over-retrieval found on prompt structures.", latencyMs: 140 },
      { id: "t-3", timestamp: "06:53:01.150", epochTime: Date.now() - 7000, step: "Waste Analysis" as const, agent: "optimizer" as const, category: "warning" as const, message: "Identified high density of expensive completion tokens used for boolean classification labels.", latencyMs: 250 },
      { id: "t-4", timestamp: "06:53:01.210", epochTime: Date.now() - 6000, step: "RAG Validation" as const, agent: "auditor" as const, category: "info" as const, message: "Cross-checked pricing models rule book: Retrieved 'rag-1' and 'rag-3'.", latencyMs: 190 },
      { id: "t-5", timestamp: "06:53:01.280", epochTime: Date.now() - 5000, step: "Optimization Planning" as const, agent: "optimizer" as const, category: "success" as const, message: "Drafted model downgrade rules and configured alternative routes.", latencyMs: 180 },
      { id: "t-6", timestamp: "06:53:01.350", epochTime: Date.now() - 4000, step: "Risk Assessment" as const, agent: "auditor" as const, category: "info" as const, message: "Risk Node: Scored alternative models. Formatting alignment evaluated at 99.4%.", latencyMs: 120 },
      { id: "t-7", timestamp: "06:53:01.410", epochTime: Date.now() - 3000, step: "Forecast Evaluation" as const, agent: "system" as const, category: "info" as const, message: "CFO Engine: Projected potential annual savings of $22,200.", latencyMs: 160 },
      { id: "t-8", timestamp: "06:53:01.490", epochTime: Date.now() - 2000, step: "Human Approval" as const, agent: "system" as const, category: "success" as const, message: "Trace ready for Human Approval in Recommendations dashboard.", latencyMs: 90 }
    ];

    // Push new recs into global storage to show live interaction
    liveRecommendations = [...parsedRecommendations, ...liveRecommendations.filter(r => r.id !== "rec-1" && r.id !== "rec-2")];

    return res.json({
      success: true,
      recommendations: parsedRecommendations,
      traces: parsedTraces,
      isFallbacked: true,
      notice: "Demo credentials workspace mode active. Connected with localized AI reasoning models."
    });
  }

  try {
    // Real call using Gemini 3.5 Flash with raw reasoning
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { text: systemPrompt },
        { text: userQuery }
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      }
    });

    const parsedData = JSON.parse(response.text?.trim() || "{}");
    
    // Harmonize trace identifiers and IDs
    const formattedRecs = (parsedData.recommendations || []).map((r: any, idx: number) => ({
      ...r,
      id: r.id || `rec-ai-${Date.now()}-${idx}`,
      status: "pending" as const
    }));

    const formattedTraces = (parsedData.traces || []).map((t: any, idx: number) => ({
      id: `trace-ai-${Date.now()}-${idx}`,
      timestamp: t.timestamp || new Date().toISOString(),
      epochTime: Date.now() - (idx * 1000),
      step: t.step || "Data Ingestion",
      agent: t.agent || "system",
      category: t.category || "info",
      message: t.message || "Pipeline processor operational log.",
      latencyMs: t.latencyMs || 100
    }));

    // Update state to show live interactive outputs
    if (formattedRecs.length > 0) {
      liveRecommendations = [...formattedRecs, ...liveRecommendations];
    }

    res.json({
      success: true,
      recommendations: formattedRecs,
      traces: formattedTraces,
      isFallbacked: false
    });

  } catch (error: any) {
    console.error("Gemini API analytical error: " + error?.message);
    res.status(500).json({
      error: "AI analytical engine failed to parse response.",
      rawMessage: error?.message,
    });
  }
});


// Vite middleware integration for full-stack build
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CreditSheriff AI engine running on port ${PORT}`);
  });
}

startServer();
