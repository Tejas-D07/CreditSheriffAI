export interface APILog {
  id: string;
  timestamp: string;
  provider: 'OpenAI' | 'Gemini' | 'Claude' | 'Cohere';
  model: string;
  tokensPrompt: number;
  tokensCompletion: number;
  cost: number;
  workloadType: 'RAG Retrieval' | 'Summarization' | 'Classification' | 'Structured Extraction' | 'Chatbot';
  latencyMs: number;
  temperature: number;
  promptSample: string;
  responseSample: string;
}

export interface OptimizationRecommendation {
  id: string;
  category: 'Model Downgrade' | 'Token Compression' | 'Context Caching' | 'Batch Scheduling';
  currentModel: string;
  suggestedModel: string;
  originalCost: number;
  optimizedCost: number;
  savingsPercent: number;
  monthlyEstimate: number; // monthly projected savings
  confidenceScore: number; // 0-100
  riskScore: number; // 0-100
  reasoning: string; // From Optimization Agent
  reasoningAuditor: string; // From Auditor Agent (Dual agent verifier)
  reasoningRisk?: string; // From Risk Assessment Agent
  reasoningForecast?: string; // From Forecast Agent
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  forecastAnnualSavings?: number;
  forecastBudgetOverrunProb?: number;
  evidenceCited: string[]; // Cited pricing rules/rules
  citations?: Array<{ title: string; excerpt: string; source: string }>;
  workloadPattern: string;
  tokenWasteCount: number;
  status: 'pending' | 'approved' | 'rejected';
  explainability?: {
    whyNeeded: string;
    evidencePricing: string;
    evidenceUsage: string;
    evidenceCapability: string;
    descriptionConfidence: string;
    descriptionRisk: string;
  };
  executionArtifacts?: {
    migrationPlan: string;
    githubPR: string;
    terraform: string;
    kubernetes: string;
    slackDraft: string;
    jiraDraft: string;
    costPolicyRule: string;
    budgetAlertRule: string;
  };
}

export interface RAGItem {
  id: string;
  title: string;
  content: string;
  section: string;
  tags: string[];
  lastUpdated: string;
}

export interface TraceEvent {
  id: string;
  timestamp: string;
  epochTime: number;
  step: 'Data Ingestion' | 'Pattern Detection' | 'Waste Analysis' | 'RAG Validation' | 'Optimization Planning' | 'Confidence Scoring' | 'Human Approval' | 'Tool Execution';
  agent: 'system' | 'optimizer' | 'auditor';
  category: 'info' | 'success' | 'warning' | 'error';
  message: string;
  latencyMs: number;
  tokensUsed?: number;
}

export interface ExecutableTask {
  id: string;
  recommendationId: string;
  type: 'pr' | 'config' | 'slack' | 'budget' | 'checklist';
  title: string;
  description: string;
  status: 'draft' | 'executing' | 'executed' | 'failed';
  codeOrSnippet?: string;
  actionOutput?: string;
  executionArtifacts?: {
    migrationPlan: string;
    githubPR: string;
    terraform: string;
    kubernetes: string;
    slackDraft: string;
    jiraDraft: string;
    costPolicyRule: string;
    budgetAlertRule: string;
  };
  timestamp: string;
}

export interface SpendMetric {
  provider: string;
  spend: number;
  tokens: number;
  requests: number;
}
