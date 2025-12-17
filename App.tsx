import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MarkdownRenderer from './components/MarkdownRenderer';
import FinancialDashboard from './components/FinancialDashboard';
import { PromptDef, StructuredAnalysisData, AnalysisCategory } from './types';
import { PROMPTS } from './constants';
import { analyzeStock } from './services/geminiService';

const App: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<PromptDef | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [tempApiKey, setTempApiKey] = useState<string>(''); // Temporary state for modal input
  const [stockName, setStockName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [markdownResult, setMarkdownResult] = useState<string | null>(null);
  const [structuredData, setStructuredData] = useState<StructuredAnalysisData | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(true);

  // Load API key from local storage if available
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
        setApiKey(storedKey);
        setShowKeyModal(false);
    }
  }, []);

  const handleSaveKey = () => {
    if (!tempApiKey.trim()) return;
    setApiKey(tempApiKey);
    localStorage.setItem('gemini_api_key', tempApiKey);
    setShowKeyModal(false);
  };

  const handleAnalyze = async () => {
    if (!selectedPrompt) return;
    if (!stockName) {
        setError("Please enter a name.");
        return;
    }
    
    setLoading(true);
    setError(null);
    setMarkdownResult(null);
    setStructuredData(undefined);

    try {
        const result = await analyzeStock(apiKey, selectedPrompt.id, stockName);
        setMarkdownResult(result.markdown);
        setStructuredData(result.structuredData);
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleGoHome = () => {
    setSelectedPrompt(null);
    setStockName('');
    setMarkdownResult(null);
    setStructuredData(undefined);
    setError(null);
  };

  const isSectorAnalysis = selectedPrompt?.category === AnalysisCategory.SECTOR;

  // Helper to get icon for categories
  const getCategoryIcon = (category: AnalysisCategory) => {
    switch (category) {
        case AnalysisCategory.FINANCIAL: return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>;
        case AnalysisCategory.ANNUAL_REPORT: return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>;
        case AnalysisCategory.CONCALL: return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>;
        case AnalysisCategory.FORENSIC: return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
        case AnalysisCategory.IPO: return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>;
        case AnalysisCategory.THESIS: return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>;
        case AnalysisCategory.TECHNICAL: return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>;
        case AnalysisCategory.SECTOR: return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
        default: return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>;
    }
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-300 font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* Sidebar */}
      <Sidebar 
        onSelectPrompt={(p) => {
            setSelectedPrompt(p);
            setMarkdownResult(null);
            setStructuredData(undefined);
            setError(null);
            setStockName(''); // Clear input on prompt switch
        }} 
        selectedPromptId={selectedPrompt?.id || null} 
        onHome={handleGoHome}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-gradient-to-br from-gray-950 to-gray-900">
        
        {/* API Key Modal/Overlay */}
        {showKeyModal && (
            <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md transform transition-all scale-100">
                    <h2 className="text-2xl font-bold text-white mb-2">Unlock AnalystGPT</h2>
                    <p className="text-gray-400 text-sm mb-6">Enter your Gemini API key to access professional-grade AI analysis.</p>
                    <input 
                        type="password" 
                        placeholder="sk-..."
                        value={tempApiKey}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-6 transition-all"
                        onChange={(e) => setTempApiKey(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
                    />
                    <div className="flex justify-end">
                       <button onClick={handleSaveKey} className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-lg shadow-lg shadow-blue-900/20 transition-all hover:scale-105">
                         Start Analyzing
                       </button>
                    </div>
                    <p className="text-xs text-center mt-6 text-gray-600">
                      Keys are stored locally in your browser for security.
                    </p>
                </div>
            </div>
        )}

        {/* Top Bar */}
        <div className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 p-4 flex justify-between items-center flex-shrink-0 z-10 sticky top-0">
             <div className="flex items-center gap-4">
                 {/* Back Button */}
                 {selectedPrompt && (
                    <button 
                        onClick={handleGoHome}
                        className="p-2 -ml-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all hover:scale-105 group"
                        title="Back to Dashboard"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </button>
                 )}

                 <h2 className="font-semibold text-lg text-white tracking-tight">
                    {selectedPrompt ? selectedPrompt.title : "Dashboard"}
                 </h2>
                 {selectedPrompt && (
                     <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-800 text-blue-400 px-2 py-1 rounded border border-gray-700/50">
                         {selectedPrompt.category}
                     </span>
                 )}
             </div>
             <button 
                onClick={() => {
                    setTempApiKey(apiKey); // Pre-fill with existing key
                    setShowKeyModal(true);
                }} 
                className="text-xs text-gray-500 hover:text-white transition-colors"
             >
                Settings
             </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
            
            {/* Input Config Section */}
            {selectedPrompt ? (
                <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Configuration Card */}
                    <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 mb-8 max-w-5xl mx-auto shadow-sm backdrop-blur-sm">
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed">{selectedPrompt.description}</p>
                        
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                                    {isSectorAnalysis ? "Target Sector / Industry" : "Stock Ticker / Name"}
                                </label>
                                <div className="flex gap-3">
                                    <input 
                                        type="text" 
                                        value={stockName}
                                        onChange={(e) => setStockName(e.target.value)}
                                        placeholder={isSectorAnalysis ? "e.g. Green Hydrogen, PSU Banks, EV Batteries" : "e.g. RELIANCE, TSLA, HDFCBANK"}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                                        className="flex-1 bg-gray-900/80 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all placeholder-gray-600"
                                    />
                                    <button 
                                        onClick={handleAnalyze}
                                        disabled={loading}
                                        className={`px-8 py-3 rounded-lg font-medium text-white transition-all transform active:scale-95 whitespace-nowrap shadow-lg ${
                                            loading 
                                            ? 'bg-blue-900/50 cursor-not-allowed opacity-70' 
                                            : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20 hover:shadow-blue-900/40'
                                        }`}
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : (isSectorAnalysis ? "Analyze Sector" : "Analyze Stock")}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span>AI will analyze live data from the web.</span>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-6 p-4 bg-red-900/20 border border-red-800/50 text-red-200 text-sm rounded-lg flex items-center gap-3">
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Dashboard & Result Area */}
                    {(markdownResult || structuredData) && (
                        <div className="max-w-5xl mx-auto animate-fade-in pb-20">
                            
                            {/* Visual Dashboard - Only show if data exists (likely hidden for sectors unless AI is very smart) */}
                            {structuredData && (
                                <FinancialDashboard data={structuredData} />
                            )}

                            {/* Text Analysis */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
                                <h3 className="text-xl font-bold text-white">Detailed Analysis</h3>
                            </div>
                            
                            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-8 shadow-xl backdrop-blur-sm">
                                <MarkdownRenderer content={markdownResult || ''} />
                            </div>
                        </div>
                    )}

                </div>
            ) : (
                <div className="h-full overflow-y-auto custom-scrollbar relative bg-gray-950">
                    {/* Modern Abstract Background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-900/10 blur-[100px]"></div>
                        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[100px]"></div>
                        <div className="absolute bottom-[0%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-950/20 blur-[120px]"></div>
                        {/* Grid overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
                    </div>

                    <div className="max-w-7xl mx-auto p-8 relative z-10">
                        {/* Hero Section */}
                        <div className="text-center py-16">
                            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 tracking-tight mb-6 drop-shadow-sm">
                                Institutional Grade <br/> AI Equity Research
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                                AnalystGPT aggregates data from Annual Reports, Concalls, and Financials to build professional investment thesis in seconds.
                            </p>
                        </div>

                        {/* Quick Action Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                            {PROMPTS.map((prompt) => (
                                <button
                                    key={prompt.id}
                                    onClick={() => {
                                        setSelectedPrompt(prompt);
                                        setStockName('');
                                        setMarkdownResult(null);
                                        setStructuredData(undefined);
                                        setError(null);
                                    }}
                                    className="group relative bg-gray-900/40 hover:bg-gray-800/60 border border-gray-800 hover:border-blue-500/50 p-6 rounded-2xl text-left transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 backdrop-blur-sm overflow-hidden"
                                >
                                    {/* Hover Gradient Blob */}
                                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500"></div>

                                    <div className="flex items-start justify-between mb-4 relative z-10">
                                        <div className="p-3 rounded-lg bg-gray-900 border border-gray-700 group-hover:border-blue-500/30 group-hover:bg-blue-900/20 transition-colors text-blue-400">
                                            {getCategoryIcon(prompt.category)}
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-950 px-2 py-1 rounded border border-gray-800 group-hover:border-gray-700">
                                            {prompt.category.split(' ')[0]}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-gray-100 mb-2 group-hover:text-blue-200 transition-colors relative z-10">
                                        {prompt.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors relative z-10 line-clamp-2">
                                        {prompt.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default App;