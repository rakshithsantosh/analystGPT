import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  
  const processText = (text: string) => {
    return text.split('\n').map((line, i) => {
        // Headers
        if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-semibold text-blue-100 mt-8 mb-3 tracking-tight">{parseInline(line.replace('### ', ''))}</h3>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-semibold text-white mt-10 mb-4 pb-2 border-b border-gray-700 tracking-tight">{parseInline(line.replace('## ', ''))}</h2>;
        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-white mt-12 mb-6 tracking-tight">{parseInline(line.replace('# ', ''))}</h1>;
        
        // Lists
        if (line.trim().startsWith('- ') || line.trim().startsWith('● ')) {
            return (
                <li key={i} className="ml-6 list-disc text-gray-300 mb-2 pl-1 leading-relaxed">
                    {parseInline(line.replace(/^[-●] /, ''))}
                </li>
            );
        }
        if (line.match(/^\d+\./)) {
            return (
                <li key={i} className="ml-6 list-decimal text-gray-300 mb-2 pl-1 leading-relaxed">
                    {parseInline(line)}
                </li>
            );
        }
        
        // Horizontal Rule / Sources Separator
        if (line.trim() === '---') {
            return <hr key={i} className="my-8 border-gray-700" />;
        }
        
        // Empty lines
        if (!line.trim()) return <div key={i} className="h-4"></div>;
        
        // Table row approximation (lines with |)
        if (line.includes('|')) return <div key={i} className="font-mono text-xs text-gray-400 bg-gray-900/50 p-2 rounded my-1 whitespace-pre-wrap overflow-x-auto">{line}</div>

        // Default paragraph
        return <p key={i} className="mb-4 text-gray-300 leading-8 text-[1.05rem] font-light">{parseInline(line)}</p>;
    });
  };

  const parseInline = (text: string) => {
    // Regex matches: **bold** OR [link text](url)
    const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
        // Handle Bold
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
        }
        // Handle Links
        if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
            const match = part.match(/\[(.*?)\]\((.*?)\)/);
            if (match) {
                return (
                    <a 
                        key={index} 
                        href={match[2]} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-400 hover:text-blue-300 underline underline-offset-2 break-all decoration-blue-500/30 hover:decoration-blue-300"
                    >
                        {match[1]}
                    </a>
                );
            }
        }
        // Regular Text
        return part;
    });
  };

  return <div className="markdown-body font-sans break-words">{processText(content)}</div>;
};

export default MarkdownRenderer;