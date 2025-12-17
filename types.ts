export enum AnalysisCategory {
  FINANCIAL = 'Financial Statements',
  ANNUAL_REPORT = 'Annual Report',
  CONCALL = 'Concall Analysis',
  FORENSIC = 'Forensic Accounting',
  IPO = 'IPO / DRHP',
  THESIS = 'Thesis Building',
  TECHNICAL = 'Technical Analysis',
  SECTOR = 'Sector Deep Dive'
}

export interface PromptDef {
  id: string;
  title: string;
  category: AnalysisCategory;
  systemPrompt: string;
  userPromptTemplate: string; // Template with placeholders like {{STOCK}}
  description: string;
}

export interface AnalysisResult {
  markdown: string;
  structuredData?: StructuredAnalysisData;
}

export interface StructuredAnalysisData {
  summary_metrics: { label: string; value: string | number; trend?: 'up' | 'down' | 'neutral' }[];
  annual_financials: { year: string; revenue: number; profit: number; margin?: number }[];
  price_history: { month: string; price: number }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AnalysisSession {
  id: string;
  stockName: string;
  promptId: string;
  messages: ChatMessage[];
  timestamp: number;
}