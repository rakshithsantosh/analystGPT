import { AnalysisCategory, PromptDef } from './types';

export const PROMPTS: PromptDef[] = [
  {
    id: 'financial-2min',
    title: '2-Min Financial Analysis',
    category: AnalysisCategory.FINANCIAL,
    description: 'Quick check of balance sheet strength, leverage, and cash flows using latest web data.',
    systemPrompt: `You are a world class Equity analyst who specialises in understanding and doing Financial statement analysis of a Business well. You have access to Google Search to find the latest financial data.`,
    userPromptTemplate: `Search for the latest financial statements, balance sheet, and cash flow data for {{STOCK}} covering 2021 to the present.
Analyse the following points well based on the data found:
1. Does the company have a weak or a strong balance sheet?
2. How are the key Leverage ratios (Debt/equity, Cash flow/Ebitda, Debt/Ebitda) like of the business over the years? Does it show improvement or is it weakening?
3. Are the cash flows strong or weak over the time period?
4. Can the company fund its growth using internal accruals?
5. How are the growth rates of the company in terms of Sales/Profits over the time period?
6. How is the Cash flow from operations compared to Net profits. Is the company converting its profits into cash flows?
7. How are the Profitability ratios of the business over the time period? (ROE, ROCE)
8. Has the company been able to maintain its margins during the time period?
9. Do a Pitrioski score on the basis of available data.
Give me the answer in a crisp & easy to understand form.
I will reward you if you do it well.`
  },
  {
    id: 'annual-report-deep',
    title: 'Annual Report Deep Dive',
    category: AnalysisCategory.ANNUAL_REPORT,
    description: 'Detailed analysis of MD&A, related party transactions, and risks from the latest Annual Report found online.',
    systemPrompt: `You are a world class Equity analyst who specialises in understanding and doing Annual report analysis of a Business well. Use Google Search to find the latest Annual Report details.`,
    userPromptTemplate: `Search for the latest Annual Report for {{STOCK}} and its key highlights. Analyse the findings based on the following pointers:
● Summary of MD, Chairman, CEO, CFO letters covering key business highlights, potential opportunities, weaknesses and overall business strategy
● Key highlights mentioned regarding industry growth and key industry triggers and trends
● Related Party transactions of the company
● Contingent liability of the company
● Miscellaneous expenses as a % of revenue
● Any future capex plans or commercialisation of the capex done in the past
● Is there any concerning Auditor note or any qualified opinion on the company
● Any aggressive accounting policies used by the company
● Management remuneration summary - Also give it as % of revenue. Also find if the remuneration is linked to the PAT and how it moves down a year.
● Any KMP resignations
● Is the business walking the talk in terms of execution
● Also do a detailed governance check on management and company
● Give me the answer in a crisp & easy to understand form
● Summarise your key findings in a conclusion in the end`
  },
  {
    id: 'concall-detailed',
    title: 'Concall Analysis (Depth)',
    category: AnalysisCategory.CONCALL,
    description: 'Comprehensive analysis of tone, guidance, and strategic shifts from the latest transcripts found online.',
    systemPrompt: `You are a senior analyst. I am a fund manager, and this is one of our portfolio companies. Search for the latest conference call transcript or summary and provide a detailed analysis.`,
    userPromptTemplate: `Search for the latest earnings conference call transcript or summary for {{STOCK}}.
Structure your response as follows:
1. Executive Summary: Overall performance, Key topics, Management tone.
2. Detailed Analysis: Business Model Evolution, Industry Operating Environment, Key Business Insights, Quantitative Guidance, KPIs, Capital Allocation.
3. Industry & Company Specific Details: Industry Insights, Competitive landscape, Company-specific strategic priorities.
4. Forward-Looking Statements: Revenue/Margin expectations, Growth Drivers, PAT guidance.
5. Risk Assessment: Competitive threats, Regulatory, Technology, Execution risks.
6. Comparison to Peers.
7. Long-Term Strategy alignment.
8. Analyst Q&A: Key questions, dodged answers, recurring themes.
9. Quantitative Data Table (if available).
10. Key Insights Table.`
  },
  {
    id: 'forensic-check',
    title: 'Forensic Accounting Check',
    category: AnalysisCategory.FORENSIC,
    description: 'Detects potential red flags, accounting fraud, and earnings manipulation using web data.',
    systemPrompt: `You are a forensic accounting expert who specialises in detecting accounting fraud, and earnings manipulation. Use Google Search to find financial discrepancies.`,
    userPromptTemplate: `Search for recent financial data, auditor reports, and news regarding accounting practices for {{STOCK}}. Conduct a forensic check:
1. Brief Summary: Checklist based on green/yellow/red indicating accounting quality.
2. Revenue Recognition Analysis: Aggressive practices, channel stuffing signs.
3. Cash Flow Discrepancies: Compare CF with PAT/EBITDA. Triangulate with debt.
4. Related Party Transactions: Suspicious RTPs, loans to related parties.
5. Balance Sheet Check: Write offs, inventory concerns, receivables aging.
6. Contingent Liabilities: Compare with Net-worth (flag if >10%).
7. Miscellaneous Expenses: Flag if >3% of sales.
8. Management Discussion Analysis: Inconsistencies in guidance vs metrics.
9. Auditor Report: Check for Qualified opinions or CARO remarks.

For each red flag, quote the specific source and quantify impact. Assign a final score: Good, Average, Bad.`
  },
  {
    id: 'ipo-drhp',
    title: 'IPO / DRHP Analysis',
    category: AnalysisCategory.IPO,
    description: 'Extracts actionable insights, risks, and valuation from DRHP or IPO documents found online.',
    systemPrompt: `You're a financial analyst with expertise in IPO and equity research. Use Google Search to find the DRHP or IPO prospectus details.`,
    userPromptTemplate: `Search for the DRHP or IPO prospectus details for {{STOCK}}. Extract and summarize relevant insights:
1. Business Overview: Core activities, revenue streams.
2. Industry & Market Overview: Trends, competition, market share.
3. Objects of the Issue: Debt repayment, expansion, OFS details.
4. Financial Highlights (Last 3 years): Rev, EBITDA, PAT, EPS, ROE/ROCE.
5. Cash Flow Analysis: Operating vs Investing trends.
6. Risk Factors: Critical risks to investor interest.
7. Promoter & Management: Background, holdings, legal controversies.
8. Related Party Transactions: Abnormal dealings.
9. Peer Comparison & Valuation: P/E, P/B vs Peers.
10. Red Flags: Negative cash flows, profit spikes pre-IPO, large OFS.`
  },
  {
    id: 'thesis-one-pager',
    title: 'Thesis Building (One Pager)',
    category: AnalysisCategory.THESIS,
    description: 'Structured investment thesis focusing on business model, unit economics, and catalysts.',
    systemPrompt: `You are a fundamental equity research analyst preparing a professional-grade, forward-looking investment report. Use Google Search to gather data.`,
    userPromptTemplate: `Search for the latest business reports, financial data, and news for {{STOCK}} to prepare a thesis.
1. Company Snapshot: Revenue breakdown, B2B/B2C, customers.
2. Business Model & Unit Economics: How they earn money, industry KPIs (e.g. Realisation/tonne, ARPOB).
3. Growth Drivers & Catalysts: Near-term triggers, order book, macro drivers.
4. Industry Positioning: Moats, market share, competition.
5. Valuation: Industry-relevant metrics (EV/EBITDA, P/B, etc.), vs 5yr average.
6. Financial Summary: CAGR, Margins, ROCE vs WACC, Balance sheet health.
7. Risk Assessment: Sectoral and company risks.
8. Investment Checklist: Factor Yes/No.
9. Bull/Base/Bear Scenarios.
10. Conclusion: Secular compounder vs Turnaround vs Cyclical vs Value Trap.`
  },
  {
    id: 'technical-dow',
    title: 'Technical Analysis (Dow/Stage)',
    category: AnalysisCategory.TECHNICAL,
    description: 'Analysis of trends and stages using latest technical data found online.',
    systemPrompt: `You are an expert technical analyst who works at a world class investing firm. Use Google Search to find the latest price action, moving averages, and technical indicators.`,
    userPromptTemplate: `Search for the latest technical analysis, charts, and price data for {{STOCK}}.
1. Dow Theory: Primary/Secondary trend.
2. Stage Analysis (Stan Weinstein): Is it entering Stage 2? Is 30 WEMA rising?
3. Volume Analysis: Price volume signal.
4. Relative Strength: vs Nifty 50 / Sector.
5. Support/Resistance Levels.
6. Entry Pointers: Chart patterns, low-volume pullbacks.
7. Stop-loss suggestions.`
  },
  {
    id: 'sector-deep-dive',
    title: 'Sector Deep Dive',
    category: AnalysisCategory.SECTOR,
    description: 'Comprehensive industry analysis covering market size, growth drivers, and competitive landscape.',
    systemPrompt: `You are a Lead Strategy Consultant at a top-tier firm. You specialise in Macro-economic and Industry Analysis.`,
    userPromptTemplate: `Conduct a comprehensive Deep Dive into the {{STOCK}} Sector/Industry. Use Google Search to find the latest industry reports, whitepapers, and market data.
Cover the following:
1. Industry Overview: Market Size (TAM, SAM), CAGR projections, and Key Segments.
2. Structural Drivers: Government policies (e.g., PLI), Consumption shifts, Technological advancements.
3. Competitive Landscape: Who are the market leaders? Who are the challengers? Market share distribution.
4. Value Chain Analysis: Key suppliers, manufacturers, distributors, and customers.
5. Key Trends & Disruptions: What is changing? (e.g., Green energy transition, AI adoption).
6. Regulatory Environment: Import duties, taxes, environmental norms.
7. Risks & Challenges: Raw material volatility, geopolitical risks.
8. Investment Thesis: Is this a sunrise or sunset sector?
9. Key Players to Watch: List top 3-5 listed companies in this space.`
  }
];

export const INITIAL_GREETING = "Select an analysis type from the sidebar to begin. I will search the web for Annual Reports, Concalls, and Financial Data to analyze stocks for you.";