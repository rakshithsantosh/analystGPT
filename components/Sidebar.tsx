import React from 'react';
import { AnalysisCategory, PromptDef } from '../types';
import { PROMPTS } from '../constants';

interface SidebarProps {
  onSelectPrompt: (prompt: PromptDef) => void;
  selectedPromptId: string | null;
  onHome: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectPrompt, selectedPromptId, onHome }) => {
  // Group prompts by category
  const groupedPrompts = PROMPTS.reduce((acc, prompt) => {
    if (!acc[prompt.category]) acc[prompt.category] = [];
    acc[prompt.category].push(prompt);
    return acc;
  }, {} as Record<AnalysisCategory, PromptDef[]>);

  return (
    <div className="w-64 bg-gray-950 text-gray-300 flex flex-col h-full border-r border-gray-800 flex-shrink-0">
      <div 
        className="p-4 border-b border-gray-800 bg-gray-900 cursor-pointer hover:bg-gray-800/80 transition-colors group"
        onClick={onHome}
        title="Go to Dashboard"
      >
        <h1 className="text-xl font-bold text-white tracking-wider flex items-center gap-3 group-hover:text-blue-100 transition-colors">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:shadow-blue-500/30 transition-all duration-300">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <span>AnalystGPT</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1 ml-11 group-hover:text-gray-400 transition-colors">AI Equity Research</p>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2 space-y-4 custom-scrollbar">
        {Object.entries(groupedPrompts).map(([category, prompts]) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2 mt-2">
              {category}
            </h3>
            <div className="space-y-1">
              {prompts.map(prompt => (
                <button
                  key={prompt.id}
                  onClick={() => onSelectPrompt(prompt)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                    selectedPromptId === prompt.id
                      ? 'bg-blue-900/40 text-blue-200 border-l-2 border-blue-500'
                      : 'hover:bg-gray-800 hover:text-white border-l-2 border-transparent text-gray-400'
                  }`}
                >
                  {prompt.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-800 text-xs text-gray-600">
        v1.0.0 • Powered by Gemini 2.5
      </div>
    </div>
  );
};

export default Sidebar;