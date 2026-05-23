import { APILog, RAGItem, OptimizationRecommendation, TraceEvent, ExecutableTask } from '../types';

export const RAW_CSV_GEMINI_TEMPLATE = `timestamp,provider,model,tokensPrompt,tokensCompletion,workloadType,latencyMs,temperature,promptSample,responseSample
2026-05-23T06:00:00Z,Gemini,gemini-1.5-pro,84500,240,Classification,4200,0.2,"Parse email for tech issue classification: [Huge customer message detailing simple password reset]","ID: 4832, Category: AccountAccess"
2026-05-23T06:15:00Z,OpenAI,gpt-4-turbo,120000,1050,RAG Retrieval,8500,0.5,"Summarize customer chat with history: [Entire 120,000 token chat transcript, redundantly re-sent]","The user wants to renew the standard cloud license..."
2026-05-23T06:20:00Z,Gemini,gemini-1.5-pro,95000,180,Classification,4100,0.1,"Categorize the following text: [Huge long-form legal brief]","Decision: Approved"
2026-05-23T06:22:00Z,Claude,claude-3-opus,5000,80,Summarize,6200,0.7,"Generate key bullets of standard release notes...","These notes introduce v4.2.1 including hotfixes."
2026-05-23T06:30:00Z,OpenAI,gpt-4,15000,120,Classification,5200,0.0,"Identify if sentiment of string is positive. Content: [User feedback]","Sentiment: Positive"
2026-05-23T06:40:00Z,Gemini,gemini-1.5-pro,12000,50,Classification,2200,0.1,"Extract billing amount from PDF dump: [Invoice 4429]","Billing Amount: $1,424.00"`;

export const RAW_JSON_OPENAI_TEMPLATE = `[
  {
    "timestamp": "2026-05-23T05:10:00Z",
    "provider": "OpenAI",
    "model": "gpt-4-turbo",
    "tokensPrompt": 45000,
    "tokensCompletion": 250,
    "workloadType": "Structured Extraction",
    "latencyMs": 3100,
    "temperature": 0.1,
    "promptSample": "Extract contact phone numbers: [Text length 45000]",
    "responseSample": "{ \"phone\": \"+1-800-555-0199\" }"
  },
  {
    "timestamp": "2026-05-23T05:12:00Z",
    "provider": "OpenAI",
    "model": "gpt-4",
    "tokensPrompt": 8000,
    "tokensCompletion": 12,
    "workloadType": "Classification",
    "latencyMs": 2800,
    "temperature": 0.0,
    "promptSample": "Detect language of: 'Bonjour, comment allez-vous today?'",
    "responseSample": "French-English Hybrid"
  },
  {
    "timestamp": "2026-05-23T05:30:00Z",
    "provider": "Claude",
    "model": "claude-3-opus",
    "tokensPrompt": 65000,
    "tokensCompletion": 4200,
    "workloadType": "RAG Retrieval",
    "latencyMs": 14000,
    "temperature": 0.5,
    "promptSample": "Answer system query based on docs... [Doc dump 65k tokens]",
    "responseSample": "The cloud-native auto-scaler responds with policy Code-9..."
  }
]`;

// Complete mock datasets for initial preview
export const INITIAL_LOGS: APILog[] = [
  // Token Waste: Using expensive models for trivial Classification
  {
    id: "log-1",
    timestamp: "2026-05-23T01:10:00Z",
    provider: "OpenAI",
    model: "gpt-4",
    tokensPrompt: 45000,
    tokensCompletion: 15,
    cost: 1.352,
    workloadType: "Classification",
    latencyMs: 3800,
    temperature: 0.1,
    promptSample: "Analyze whether the user's inquiry requires an elevated ticket priority levels from the customer tier mapping table: [Large Table Content and email contents...]",
    responseSample: "PRIORITY: LOW"
  },
  // Inefficient model selection: GPT-4 for high volume, simple summarization of static blogs
  {
    id: "log-2",
    timestamp: "2026-05-23T01:15:00Z",
    provider: "OpenAI",
    model: "gpt-4-turbo",
    tokensPrompt: 85200,
    tokensCompletion: 850,
    cost: 0.942,
    workloadType: "Summarization",
    latencyMs: 6400,
    temperature: 0.3,
    promptSample: "Synthesize a 2-paragraph summary highlighting key operational milestones from the attached annual review transcripts: [Huge transcript detailing minor team updates]",
    responseSample: "Key milestones include successful migrating regional DNS records, onboarding 12 new coordinators..."
  },
  // Gemini 1.5 Pro list of redundant queries with no Context Caching
  {
    id: "log-3",
    timestamp: "2026-05-23T01:20:00Z",
    provider: "Gemini",
    model: "gemini-1.5-pro",
    tokensPrompt: 195000,
    tokensCompletion: 45,
    cost: 0.2450,
    workloadType: "RAG Retrieval",
    latencyMs: 5100,
    temperature: 0.2,
    promptSample: "User: Find reference to Cloud VPN configuration block. Knowledge Context: [Re-submitting the exact same 195K token PDF document as preceding six queries]",
    responseSample: "The Cloud VPN configurations reside on page 14 of the compliance handbook..."
  },
  // Claude 3 Opus on trivial structural extraction
  {
    id: "log-4",
    timestamp: "2026-05-23T01:25:00Z",
    provider: "Claude",
    model: "claude-3-opus",
    tokensPrompt: 14500,
    tokensCompletion: 90,
    cost: 0.224,
    workloadType: "Structured Extraction",
    latencyMs: 5800,
    temperature: 0.1,
    promptSample: "Extract all dates of transaction into valid JSON array: [Simple financial memo page]",
    responseSample: "[{\"date\": \"2026-01-12\"}, {\"date\": \"2026-03-05\"}]"
  },
  // Inefficient classification: GPT-4-turbo
  {
    id: "log-5",
    timestamp: "2026-05-23T01:30:00Z",
    provider: "OpenAI",
    model: "gpt-4-turbo",
    tokensPrompt: 32000,
    tokensCompletion: 12,
    cost: 0.3204,
    workloadType: "Classification",
    latencyMs: 2400,
    temperature: 0.0,
    promptSample: "Given this support ticket, classify as: Technical, Billing, or General Inquiry: [32k token diagnostic log]",
    responseSample: "Technical"
  },
  // Gemini 1.5 Pro: Huge context classified
  {
    id: "log-6",
    timestamp: "2026-05-23T01:45:00Z",
    provider: "Gemini",
    model: "gemini-1.5-pro",
    tokensPrompt: 210000,
    tokensCompletion: 30,
    cost: 0.2628,
    workloadType: "Classification",
    latencyMs: 5800,
    temperature: 0.1,
    promptSample: "Analyze audit checklist in Appendix G of this contract: [210k tokens contract draft]",
    responseSample: "Appendix G compliance status: VALIDATED with 0 exceptions"
  },
  // Chatbot redundant query
  {
    id: "log-7",
    timestamp: "2026-05-23T02:00:00Z",
    provider: "Claude",
    model: "claude-3-opus",
    tokensPrompt: 45000,
    tokensCompletion: 1100,
    cost: 0.758,
    workloadType: "Chatbot",
    latencyMs: 12000,
    temperature: 0.8,
    promptSample: "Explain the entire system blueprint, matching custom user definitions: [Re-submitting 45k docs]",
    responseSample: "Let us review section by section of the active cloud schema..."
  },
  // Standard healthy logs (to keep analysis balanced)
  {
    id: "log-8",
    timestamp: "2026-05-23T02:10:00Z",
    provider: "Gemini",
    model: "gemini-2.5-flash",
    tokensPrompt: 1400,
    tokensCompletion: 310,
    cost: 0.0003,
    workloadType: "Summarization",
    latencyMs: 950,
    temperature: 0.5,
    promptSample: "Shorten this technical update",
    responseSample: "Database schema has been patched to handle dynamic attributes index models."
  }
];

export const INITIAL_RAG: RAGItem[] = [
  {
    id: "rag-1",
    title: "LLM Provider Pricing Matrix (May 2026 Update)",
    content: "OpenAI GPT-4 Pricing: $30.00 / M prompt tokens, $60.00 / M completion tokens. GPT-4-turbo: $10.00 / M prompt tokens, $30.00 / M completion. GPT-4o: $5.00 / M prompt tokens, $15.00 / M completion. Gemini 1.5 Pro: $1.25 / M prompt (<128k) and $2.50 (>128k), $5.00 / M completion (<128k) and $10.00 (>128k). Gemini 2.5 Flash / gemini-3.5-flash: $0.075 / M prompt tokens, $0.30 / M completion. Claude 3 Opus: $15.00 / M prompt, $75.00 / M completion. Claude 3.5 Sonnet: $3.00 / M prompt, $15.00 / M completion.",
    section: "Pricing Rules",
    tags: ["pricing", "cost-rules", "reference"],
    lastUpdated: "2026-05-15"
  },
  {
    id: "rag-2",
    title: "Gemini Context Caching & High Volume Static Document Policy",
    content: "Gemini 1.5 Pro and Flash support prompt context caching for inputs exceeding 32,768 tokens. In cached mode, pricing drops significantly: cached prompt tokens cost only $0.01875 / M tokens (89% discount compared to full recalculation on every request). For high-frequency query pipelines querying a static training file/rules dump, executing caching avoids redundant parsing completely.",
    section: "Optimization Strategies",
    tags: ["caching", "gemini-features", "discount"],
    lastUpdated: "2026-04-20"
  },
  {
    id: "rag-3",
    title: "Model Capabilties mapping for Classification workloads",
    content: "Classification tasks (e.g., Sentiment routing, categorization, phone/ID extraction) do not require broad world knowledge reasoning. Analysis shows gemini-3.5-flash or Gemini 2.5 Flash models achieve 99.2% accuracy alignment compared to GPT-4 while running 14x faster and reducing cost overheads by 98.4%. Running gpt-4 for priority categorization is verified in audits as token waste.",
    section: "Model Capabilities",
    tags: ["workload-fit", "best-practice", "classification"],
    lastUpdated: "2026-05-01"
  },
  {
    id: "rag-4",
    title: "Batch Request Endpoints and Non-Interactive Task Scheduling",
    content: "OpenAI, Claude, and Gemini support batch operations endpoints allowing offline non-interactive jobs to have up to a 50% discount flat. Standard summarizations generated overnight or bulk indexing checks must route through Batch APIs to avoid paying standard premium instant-response prices.",
    section: "Optimization Strategies",
    tags: ["batch-api", "scheduler", "discount"],
    lastUpdated: "2026-03-28"
  },
  {
    id: "rag-5",
    title: "RAG Retrieval Over-inflation and Injection Vectors",
    content: "Many developers pack entire document histories into prompt context windows instead of implementing semantic index vectors or metadata-filtered queries. Standard limits must enforce single-chunk max 4,000 tokens per injection, using re-ranking classifiers (e.g., Cohere Rerank) to trim input payloads.",
    section: "Context Limits",
    tags: ["rag-tuning", "efficiency", "prompt-size"],
    lastUpdated: "2026-05-10"
  }
];

export const INITIAL_RECOMMENDATIONS: OptimizationRecommendation[] = [
  {
    id: "rec-1",
    category: "Model Downgrade",
    currentModel: "gpt-4",
    suggestedModel: "gemini-3.5-flash (or Gemini 2.5 Flash)",
    originalCost: 1.352,
    optimizedCost: 0.0035,
    savingsPercent: 99.7,
    monthlyEstimate: 2450.00,
    confidenceScore: 98,
    riskScore: 2,
    riskLevel: "LOW",
    forecastAnnualSavings: 29400,
    forecastBudgetOverrunProb: 4,
    workloadPattern: "Support Ticket Router - Simple Priority Selection",
    tokenWasteCount: 44000,
    status: "pending",
    reasoning: "The customer classification pipeline utilizes 'gpt-4' to extract simple PRIORITIES of tickets. This single task pattern accounts for 45,000 tokens of static definitions table re-injection each transaction, costing over $1.35 per API call. Replacing this with 'gemini-3.5-flash' handles structural text matching impeccably with single-digit millisecond responses.",
    reasoningAuditor: "VERIFIED. Under Pricing Rule 'rag-1', GPT-4 prompt pricing is $30.00/M vs Gemini Flash at $0.075/M. Benchmark testing on this prompt template shows 100% accuracy retention. Hallucination risk score is minimal (<1%) given precise structural rules schema constraints.",
    reasoningRisk: "RISK PROFILE STABLE: Latency impact indicates an expected drop of 40ms on average. Output formatting alignment matches GPT-4 standard prompts with 99.4% precision. Zero dependency deprecations identified.",
    reasoningForecast: "PREDICTION CLEAR: Transitioning this path of workloads scales down the monthly department ceiling significantly, projecting cumulative 5-year project savings of $147,000.",
    evidenceCited: ["LLM Provider Pricing Matrix (May 2026 Update)", "Model Capabilties mapping for Classification workloads"],
    citations: [
      { title: "LLM Provider Pricing Matrix (May 2026 Update)", excerpt: "gemini-3.5-flash represents a cost structure of $0.075 / M prompt tokens.", source: "rag-1" },
      { title: "Model Capabilities mapping for Classification workloads", excerpt: "Classification tasks do not require broad world knowledge reasoning.", source: "rag-3" }
    ],
    explainability: {
      whyNeeded: "Categorizing support tickets using high-tier models consumes massive tokens ($1.35 per call) for a trivial text matching and categorization task.",
      evidencePricing: "GPT-4 prompts are flat $30.00/M. Gemini 3.5 Flash is $0.075/M. Savings is 99.7%.",
      evidenceUsage: "Support-intent routing logs verify prompt size of 44,000 re-sent tokens of system instruction definitions.",
      evidenceCapability: "Tested across 2,500 active billing classification transcripts with zero performance regression.",
      descriptionConfidence: "98% confidence rate backed by complete API endpoint latency reports & accurate vector database pricing lookups.",
      descriptionRisk: "LOW risk (2%). Classification queries have strict format outputs (JSON schemas), leaving minimal margins for LLM hallucinations."
    },
    executionArtifacts: {
      migrationPlan: "# CreditSheriff Deployment & Migration Plan: MD-001\n\n## Action Plan\n1. Modify LLM router settings inside `routing_policies` API key mappings.\n2. Discard GPT-4 payload bindings, swap credentials with Gemini Client.\n3. Validate classification response values in canary systems.",
      githubPR: "```diff\n// PR: Migrate classification router to Gemini Flash\n- const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });\n- const response = await client.chat.completions.create({ model: 'gpt-4', messages });\n+ const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });\n+ const response = await ai.models.generateContent({ model: 'gemini-3.5-flash', contents });\n```",
      terraform: "```hcl\n# Terraform GCP invoker provisioning\nresource \"google_project_iam_member\" \"creditsheriff_ai_invoker\" {\n  project = var.gcp_project_id\n  role    = \"roles/aiplatform.user\"\n  member  = \"serviceAccount:creditsheriff-sa@${var.gcp_project_id}.iam.gserviceaccount.com\"\n}\n```",
      kubernetes: "```yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: creditsheriff-classification-router\nspec:\n  template:\n    spec:\n      containers:\n      - name: llm-gateway\n        env:\n        - name: DEFAULT_LLM_MODEL\n          value: \"gemini-3.5-flash\"\n```",
      slackDraft: "```json\n{\n  \"text\": \"🚀 *CreditSheriff APPLIED OPTIMIZATION* \\nCompleted model cutover supporting Classifications.\\n*Savings:* $2,450.00/mo\\n*Verified model:* gemini-3.5-flash\"\n}\n```",
      jiraDraft: "```text\nJira Issue:\nPROJ-1048: Replace GPT-4 Classification router with Gemini 3.5 Flash\n---\nReported By: CreditSheriff 4-Agent Autonomous System\nMonthly Savings: $2,450.00 / Annual savings: $29,400.00\n```",
      costPolicyRule: "# CreditSheriff Policy: CPU-102\n- Goal: Prevent overprovisioning of Classification tasks.\n- Directive: All simple extraction, keyword matching, and routing endpoints MUST bind to High-Efficiency Flash models.",
      budgetAlertRule: "```yaml\n- alert: BudgetOverrunThresholdReached\n  expr: increase(ai_spend_total[1h]) > 100\n  for: 15m\n  annotations:\n    summary: \"AI API daily classification cluster cost speed warning\"\n```"
    }
  },
  {
    id: "rec-2",
    category: "Token Compression",
    currentModel: "gpt-4-turbo",
    suggestedModel: "gpt-4o-mini (with trimmed history)",
    originalCost: 0.942,
    optimizedCost: 0.046,
    savingsPercent: 95.1,
    monthlyEstimate: 1820.00,
    confidenceScore: 92,
    riskScore: 8,
    riskLevel: "MEDIUM",
    forecastAnnualSavings: 21840,
    forecastBudgetOverrunProb: 15,
    workloadPattern: "Multi-turn Chat Transcription red-lines",
    tokenWasteCount: 81000,
    status: "pending",
    reasoning: "High-volume chat history summarizing is re-injecting 85,000+ tokens of static telemetry and redundant greeting logs over and over on subsequent back-and-forth turns. Incorporating localized summary sliding windows reduces standard input payload payload sizing by 95% without breaking thread focus content.",
    reasoningAuditor: "VERIFIED. Auditor crosscheck confirms customer interaction depth average is 4 turns. Moving to sliding windows protects the memory ceiling. gpt-4o-mini supports structured summaries smoothly at $0.15/M tokens.",
    reasoningRisk: "RISK PROFILE ACCESSIBLE: Shorter thread memories are prone to missing references older than 12 turns. Moderate risk offset can be bypassed using active context caching loops.",
    reasoningForecast: "CASH FLOW IMPACT: Shrinks the cumulative token growth curve. Reduces expected budget exhaustion date by 45 business days.",
    evidenceCited: ["LLM Provider Pricing Matrix (May 2026 Update)", "RAG Retrieval Over-inflation and Injection Vectors"],
    citations: [
      { title: "RAG Retrieval Over-inflation and Injection Vectors", excerpt: "Standard limits must enforce single-chunk max 4,000 tokens per injection.", source: "rag-5" }
    ],
    explainability: {
      whyNeeded: "Repeating large user conversation logs consecutively exhausts context token margins quickly and forces extreme billing speed-ups.",
      evidencePricing: "GPT-4-turbo prompts are $10.00/M. gpt-4o-mini is $0.15/M. Sliding summary scales inputs down by 95%.",
      evidenceUsage: "Audit identifies 81,000 redundant duplicate historical tokens re-sent across conversational turns.",
      evidenceCapability: "gpt-4o-mini represents exact quality preservation on conversation chat summary workloads.",
      descriptionConfidence: "92% confidence index validated through previous sliding memory deployments.",
      descriptionRisk: "MEDIUM Risk (8%). Redundant history extraction may sometimes clip early contextual tokens."
    },
    executionArtifacts: {
      migrationPlan: "# Token Compression Rollout Plan\n\n1. Modify chat logic to compute summaries on earlier turns.\n2. Store summarizing contexts locally\n3. Truncate inputs to 4,000 max tokens per prompt turn.",
      githubPR: "```diff\n// PR: Implement sliding chat context buffer\n- const chatPayload = history;\n+ const chatPayload = sanitizeAndSummarizeHistory(history);\n```",
      terraform: "```hcl\n# Cloud environment variables configurations\nresource \"google_cloud_run_service_env\" \"chat_limit\" {\n  name  = \"MAX_HISTORY_TURNS\"\n  value = \"4\"\n}\n```",
      kubernetes: "```yaml\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: chat-optimizer-config\ndata:\n  MAX_TOKENS_CEILING: \"4000\"\n```",
      slackDraft: "```json\n{\n  \"text\": \"🔄 *CreditSheriff Auto-Compression Alert*\\nApplied sliding summaries on multi-turn chatbot workflows.\\n*Projected Savings:* $1,820.00/mo\"\n}\n```",
      jiraDraft: "```text\nJira Issue:\nENG-2480: Wrap conversation history with summarizing transformer window\nEstimate Monthly Savings: $1,820.00\n```",
      costPolicyRule: "# Policy: BU-350\n- Strict limit: Multiturn chatbots are forbidden from re-injecting static documents exceeding 10k tokens without active summarization.",
      budgetAlertRule: "```yaml\n- alert: ChatHistoryTokenOverrun\n  expr: rate(chatbot_chat_spent_dollars[5m]) > 2\n  annotations:\n    description: \"Multiturn chat history consumption is exceeding safety parameters.\"\n```"
    }
  },
  {
    id: "rec-3",
    category: "Context Caching",
    currentModel: "gemini-1.5-pro",
    suggestedModel: "gemini-1.5-pro (with Active Context Caching)",
    originalCost: 0.2450,
    optimizedCost: 0.0540,
    savingsPercent: 78.0,
    monthlyEstimate: 1420.00,
    confidenceScore: 95,
    riskScore: 5,
    riskLevel: "LOW",
    forecastAnnualSavings: 17040,
    forecastBudgetOverrunProb: 1,
    workloadPattern: "Static Docs Search - Repeated Blueprint Retrieval",
    tokenWasteCount: 160000,
    status: "pending",
    reasoning: "The RAG Retrieval agent submits the exact same 195K-token manual and cloud blueprint in five of six consecutive conversations. Activating Gemini Native Context Caching results in a massive 80% discount on cached prompts, only paying cached recalculation rates.",
    reasoningAuditor: "VERIFIED. Under Policy 'rag-2', cached prompt tokens drop to $0.01875 / M tokens. The document context does not change during active sessions, making caching an ideal architectural fit with 0 execution risk.",
    reasoningRisk: "RISK PROFILE STABLE: Context caching is fully managed in the Gemini SDK. Output tokens are visually identical since prompt definitions remain 100% same.",
    reasoningForecast: "EXPECTED GROWTH DAMPENED: Active context caching levels off high query bursts. Decreases the monthly billing volatility rate by 65%.",
    evidenceCited: ["Gemini Context Caching & High Volume Static Document Policy"],
    citations: [
      { title: "Gemini Context Caching Policy", excerpt: "Prompt context caching is supported for inputs exceeding 32k. Discounts cost down to $0.01875/M cached.", source: "rag-2" }
    ],
    explainability: {
      whyNeeded: "Repeated QA prompts contain identical static blueprints, incurring $0.24 billing per query since the model parses 195k tokens anew each transaction.",
      evidencePricing: "Full retrieval: $0.245. Cached retrieval: $0.054. High discount applies specifically to files >32k tokens.",
      evidenceUsage: "Trace highlights standard user conversations querying Cloud compliance handbooks repeatedly in active sessions.",
      evidenceCapability: "Gemini 1.5 Pro native context caching manages active indices during session lengths perfectly.",
      descriptionConfidence: "95% confidence rate. API specifications fully endorse cached promtp token limits and active TTL durations.",
      descriptionRisk: "LOW risk (5%). Native API layer cache is bulletproof and doesn't change model logic."
    },
    executionArtifacts: {
      migrationPlan: "# Context Caching Deployment Spec\n\n1. Feed static blueprint context to cache manager on init.\n2. Pass the returned `cacheName` parameter in subsequent model calls.\n3. Keep TTL at 30 minutes for optimum caching retention.",
      githubPR: "```diff\n// PR: Setup Gemini prompt caching\n+ const cacheManager = ai.caches.create({\n+   model: 'gemini-1.5-pro',\n+   contents: staticComplianceDocs,\n+   ttl: '1800s'\n+ });\n```",
      terraform: "```hcl\n# Cache TTL and timeout specifications\nresource \"kubernetes_config_map\" \"caching_constants\" {\n  metadata {\n    name = \"caching-policy\"\n  }\n  data = {\n    CACHE_TTL_SECONDS = \"1800\"\n  }\n}\n```",
      kubernetes: "```yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: gemini-cached-retrieval\n```",
      slackDraft: "```json\n{\n  \"text\": \"❄️ *CreditSheriff Cache Activation Alert*\\nPrompt Context Caching configured on Gemini. Input costs dropped by 78%!\\n*Yield:* $1,420.00/mo\"\n}\n```",
      jiraDraft: "```text\nJira PROJ-3142: Enable Gemini prompt caches for QA static manuals\nStatus: Ready for rollout\n```",
      costPolicyRule: "# Policy: ACC-80\n- Instruction: Any document exceeding 32k tokens queried repeating within 30 minutes MUST leverage native vector prompt context caching.",
      budgetAlertRule: "```yaml\n- alert: ContextCacheMissRateHigh\n  expr: gemini_api_cache_hits / gemini_api_total_calls < 0.5\n  labels:\n    severity: warning\n```"
    }
  },
  {
    id: "rec-4",
    category: "Batch Scheduling",
    currentModel: "claude-3-opus",
    suggestedModel: "claude-3.5-sonnet (via Batch API)",
    originalCost: 0.224,
    optimizedCost: 0.024,
    savingsPercent: 89.3,
    monthlyEstimate: 980.00,
    confidenceScore: 88,
    riskScore: 12,
    riskLevel: "MEDIUM",
    forecastAnnualSavings: 11760,
    forecastBudgetOverrunProb: 10,
    workloadPattern: "Nightly Release Memo Structuring",
    tokenWasteCount: 11000,
    status: "pending",
    reasoning: "Trivial nightly release documentation structuring and parsing currently runs on instant-premium Claude 3 Opus. Transitioning to Clause 3.5 Sonnet under Batch API drops costs while delivering improved formatting consistency.",
    reasoningAuditor: "VALIDATED. Release notes parsing is not time-critical; 24-hour SLA is acceptable SLA. Batch API supports a direct 50% pricing drop on top of the generation model downgrade savings of 80+%.",
    reasoningRisk: "RISK PROFILE ACCESSIBLE: Batch endpoints have an execution SLA up to 24 hours. Workloads requiring instant delivery are blocked from batch pipelines.",
    reasoningForecast: "ANNUAL ESTIMATION: Delivers stable flat rate pricing structure, optimizing resource usage metrics by 89% and stabilizing core budgets.",
    evidenceCited: ["LLM Provider Pricing Matrix (May 2026 Update)", "Batch Request Endpoints and Non-Interactive Task Scheduling"],
    citations: [
      { title: "Batch Request Endpoints and Non-Interactive Task Scheduling", excerpt: "Batch operations endpoints allow non-interactive jobs up to 50% discount.", source: "rag-4" }
    ],
    explainability: {
      whyNeeded: "Structuring night-released text on real-time Claude 3 Opus endpoints pays peak interactive rates for an asynchronous background process.",
      evidencePricing: "Claude Opus is $15/M. Sonnet with Batch API discount drops prompt pricing to $1.50/M. Delivers 89% reduction.",
      evidenceUsage: "Support data traces identify nightly release structuring tasks starting at 2 AM UTC with no interactive user requirements.",
      evidenceCapability: "Claude 3.5 Sonnet handles code styling and Markdown formatting with superior precision than legacy Opus models.",
      descriptionConfidence: "88% confidence derived from verified batch pipeline templates and SLA requirements.",
      descriptionRisk: "MEDIUM Risk (12%). Batch queue delay can take up to 24 hours, though typical latency is less than 45 minutes."
    },
    executionArtifacts: {
      migrationPlan: "# Batch API Migration Spec\n\n1. Map nightly documentation workloads into batch format JSONL structures.\n2. Submit records to the Batch endpoint and process output on batch completion callback.\n3. Integrate status listener webhooks.",
      githubPR: "```diff\n// PR: Transition logs summaries to Batch api\n- const completion = await claude.messages.create({ model: 'claude-3-opus', messages });\n+ const batch = await anthropic.beta.messages.batches.create({ requests: batchRequestArray });\n```",
      terraform: "```hcl\n# Cron job state for Batch dispatcher scheduler\nresource \"google_cloud_scheduler_job\" \"batch_scheduler\" {\n  name        = \"nightly-ai-batch-launcher\"\n  schedule    = \"0 2 * * *\"\n  time_zone   = \"UTC\"\n}\n```",
      kubernetes: "```yaml\napiVersion: batch/v1\nkind: Job\nmetadata:\n  name: nightly-ai-batch-job\n```",
      slackDraft: "```json\n{\n  \"text\": \"🕒 *CreditSheriff Batch Deployment Complete*\\nRelease Structurer converted to Batch API format.\\n*Est Monthly Savings:* $980.00\"\n}\n```",
      jiraDraft: "```text\nJira PROJ-3180: Migrate release document indexing to Batch API scheduler\n```",
      costPolicyRule: "# Policy: COM-44\n- Mandate: Async summaries or report tasks scheduled overnight MUST route via provider Batch API pipelines.",
      budgetAlertRule: "```yaml\n- alert: BatchJobExecutionDelayExceeded\n  expr: batch_job_active_seconds > 86400\n  severity: warning\n```"
    }
  }
];

export const INITIAL_TASKS: ExecutableTask[] = [
  {
    id: "task-1",
    recommendationId: "rec-1",
    type: "config",
    title: "Apply Configuration Downgrade",
    description: "Update billing LLM router endpoint variables inside `config/llm_router.yaml` and redirect Classification targets of 'support_routing' from `gpt-4` to `gemini-3.5-flash`.",
    status: "draft",
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
    type: "pr",
    title: "Publish GitHub Pull Request",
    description: "Create Pull Request to trunk setting up sliding history summarization limits on prompt generation buffers.",
    status: "draft",
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
  },
  {
    id: "task-3",
    recommendationId: "rec-3",
    type: "slack",
    title: "Send Slack Alert Draft",
    description: "Draft Slack announcement for high-priority cloud operations channel announcing active context caching activation and predicted monthly savings.",
    status: "draft",
    codeOrSnippet: `🤖 *CreditSheriff AI Alert*
Active context caching has been configured on Gemini API models for static cloud blueprint queries!
• *Current Waste Tracked:* 160,000 repetitively injected tokens/run
• *Savings Margin:* 78.0% ($1,420.00 / month)
• *Audit Clearance:* Approved by Optimizer & Auditor dual nodes.`,
    timestamp: "2026-05-23T06:38:00Z"
  }
];

export const INITIAL_TRACES: TraceEvent[] = [
  {
    id: "trace-1",
    timestamp: "06:51:10.020",
    epochTime: Date.now() - 140000,
    step: "Data Ingestion",
    agent: "system",
    category: "success",
    message: "Ingested active server logs with 8 token transactions. Validated CSV header mapping rules successfully.",
    latencyMs: 120,
  },
  {
    id: "trace-2",
    timestamp: "06:51:10.140",
    epochTime: Date.now() - 139000,
    step: "Pattern Detection",
    agent: "optimizer",
    category: "info",
    message: "Analyzing model distributions: Identified 4 high-cost GPT-4 queries performing simple support string matches.",
    latencyMs: 450,
  },
  {
    id: "trace-3",
    timestamp: "06:51:10.590",
    epochTime: Date.now() - 138000,
    step: "Waste Analysis",
    agent: "optimizer",
    category: "warning",
    message: "Detected massive token redundancy in 'RAG Retrieval' workloads. Prompts exceed 195k tokens of identical handbook contexts repeatedly.",
    latencyMs: 310,
    tokensUsed: 14500
  },
  {
    id: "trace-4",
    timestamp: "06:51:10.900",
    epochTime: Date.now() - 137000,
    step: "RAG Validation",
    agent: "auditor",
    category: "info",
    message: "Initiating RAG validation on pricing rules table. Retrieved citation 'rag-1' (May Matrix) and 'rag-2' (Gemini Caching guide).",
    latencyMs: 680,
  },
  {
    id: "trace-5",
    timestamp: "06:51:11.580",
    epochTime: Date.now() - 136000,
    step: "Optimization Planning",
    agent: "optimizer",
    category: "success",
    message: "Formulated 4 premium optimization plans focusing on Gemini caching and GPT-4 model downgrades.",
    latencyMs: 520,
  },
  {
    id: "trace-6",
    timestamp: "06:51:12.100",
    epochTime: Date.now() - 135000,
    step: "Confidence Scoring",
    agent: "auditor",
    category: "success",
    message: "Auditor node cross-checked rule compliance. Asserted 98% accuracy retention confidence for support tickets downgrade. Hallucination threat model checked.",
    latencyMs: 920,
  },
  {
    id: "trace-7",
    timestamp: "06:51:13.020",
    epochTime: Date.now() - 134000,
    step: "Human Approval",
    agent: "system",
    category: "info",
    message: "Published 4 recommendations and 3 automation tasks to human supervisor queue. Ready for approval.",
    latencyMs: 140,
  }
];
