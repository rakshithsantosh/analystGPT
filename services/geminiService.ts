import { GoogleGenAI } from "@google/genai";
import { PROMPTS } from "../constants";
import { AnalysisResult, StructuredAnalysisData, AnalysisCategory } from "../types";

export const analyzeStock = async (
  apiKey: string,
  promptId: string,
  stockName: string
): Promise<AnalysisResult> => {
  if (!apiKey) throw new Error("API Key is missing.");

  const promptDef = PROMPTS.find(p => p.id === promptId);
  if (!promptDef) throw new Error("Invalid Prompt ID");

  const ai = new GoogleGenAI({ apiKey });
  
  // JSON Extraction Instruction
  let jsonInstruction = "";

  if (promptDef.category === AnalysisCategory.SECTOR) {
    // For Sectors, we prioritize general metrics and avoid specific stock financials to prevent chart errors
    jsonInstruction = `
  
    IMPORTANT: After your text analysis, provide a JSON block enclosed in \`\`\`json tags containing key sector metrics.
    The JSON structure must be:
    {
      "summary_metrics": [
         { "label": "Market Size", "value": "e.g. $50B" },
         { "label": "CAGR", "value": "e.g. 12%" },
         { "label": "Top Leader", "value": "e.g. Company A" }
      ],
      "annual_financials": [],
      "price_history": []
    }
    `;
  } else {
    // Default for Stocks
    jsonInstruction = `
  
    IMPORTANT: After your text analysis, you MUST provide a JSON block enclosed in \`\`\`json tags containing structured data extracted from your findings. 
    The JSON structure must be:
    {
      "summary_metrics": [
         { "label": "Market Cap", "value": "e.g. 500Cr" },
         { "label": "P/E Ratio", "value": "e.g. 25.4" },
         { "label": "ROE", "value": "e.g. 15%" },
         { "label": "Current Price", "value": "e.g. 1200" }
         // Add other relevant metrics found
      ],
      "annual_financials": [
         { "year": "2021", "revenue": 100, "profit": 10 },
         { "year": "2022", "revenue": 120, "profit": 12 },
         { "year": "2023", "revenue": 150, "profit": 18 }
         // Use available data for last 3-5 years. Revenue/Profit in local currency (Cr/Mn).
      ],
      "price_history": [
         { "month": "Jan", "price": 100 },
         { "month": "Feb", "price": 110 }
         // Provide approximate monthly closing prices for the last 12 months if found in search.
      ]
    }
    RULES:
    1. "revenue", "profit", and "price" MUST be raw numbers (e.g. 150.5), NOT strings with currency symbols.
    2. If exact data is not found, provide best estimates or leave arrays empty.
    3. Do not add comments inside the JSON block.
    `;
  }

  // Replace placeholder in user prompt
  const userPrompt = promptDef.userPromptTemplate.replace(/{{STOCK}}/g, stockName) + jsonInstruction;

  // Use Gemini 2.5 Flash for speed and search capabilities
  const modelId = "gemini-2.5-flash";

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        role: "user",
        parts: [{ text: userPrompt }]
      },
      config: {
        systemInstruction: promptDef.systemPrompt,
        // Enable Google Search Grounding
        tools: [{ googleSearch: {} }],
        generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 8192,
        }
      }
    });

    let fullText = response.text || "No response generated.";
    
    // Extract JSON block
    let structuredData: StructuredAnalysisData | undefined;
    // Regex matches ```json ... ``` OR just ``` ... ``` to be more forgiving
    const jsonMatch = fullText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    
    if (jsonMatch && jsonMatch[1]) {
        try {
            structuredData = JSON.parse(jsonMatch[1]);
            
            // Sanitize numerical data to ensure charts don't break
            if (structuredData) {
                if (structuredData.price_history) {
                    structuredData.price_history = structuredData.price_history.map((item: any) => ({
                        ...item,
                        price: typeof item.price === 'string' ? parseFloat(item.price.replace(/,/g, '')) : item.price
                    })).filter((item: any) => !isNaN(item.price));
                }
                
                if (structuredData.annual_financials) {
                    structuredData.annual_financials = structuredData.annual_financials.map((item: any) => ({
                        ...item,
                        revenue: typeof item.revenue === 'string' ? parseFloat(item.revenue.replace(/,/g, '')) : item.revenue,
                        profit: typeof item.profit === 'string' ? parseFloat(item.profit.replace(/,/g, '')) : item.profit
                    })).filter((item: any) => !isNaN(item.revenue) || !isNaN(item.profit));
                }
            }

            // Remove the JSON block from the display text to keep it clean
            fullText = fullText.replace(/```(?:json)?\s*[\s\S]*?\s*```/, '').trim();
        } catch (e) {
            console.error("Failed to parse extracted JSON", e);
        }
    }

    // Extract grounding sources if available and append to text
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .map((c: any) => c.web)
      .filter((w: any) => w)
      .map((w: any) => `- [${w?.title || 'Source'}](${w?.uri})`)
      .filter((v, i, a) => a.indexOf(v) === i); // Deduplicate

    if (sources.length > 0) {
        fullText += "\n\n---\n### Sources\n" + sources.join('\n');
    }

    return {
        markdown: fullText,
        structuredData
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to analyze data.");
  }
};