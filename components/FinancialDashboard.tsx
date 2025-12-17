import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { StructuredAnalysisData } from '../types';

interface FinancialDashboardProps {
  data: StructuredAnalysisData;
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ data }) => {
  const [chartMode, setChartMode] = useState<'price' | 'financials'>('price');
  const [timeRange, setTimeRange] = useState<'1Y' | '6M' | '3M'>('1Y');

  // Filter price data based on range
  const getFilteredPriceData = () => {
    if (!data.price_history || data.price_history.length === 0) return [];
    
    const totalPoints = data.price_history.length;
    let sliceCount = totalPoints;
    
    if (timeRange === '6M') sliceCount = Math.min(6, totalPoints);
    if (timeRange === '3M') sliceCount = Math.min(3, totalPoints);
    
    return data.price_history.slice(totalPoints - sliceCount);
  };

  const priceData = getFilteredPriceData();
  const financialData = data.annual_financials || [];

  return (
    <div className="mb-8 space-y-6">
      
      {/* Key Metrics Grid */}
      {data.summary_metrics && data.summary_metrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.summary_metrics.map((metric, idx) => (
            <div key={idx} className="relative group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-gray-700/40 p-5 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:border-blue-500/40 hover:shadow-blue-500/20 overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
              
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2 relative z-10">{metric.label}</p>
              <p className="text-2xl font-extrabold text-white tracking-tight relative z-10 drop-shadow-sm truncate">{metric.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Charts Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl overflow-hidden">
        
        {/* Decorational Gradient Blurs */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Chart Header & Controls */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
               <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
               </span>
               Performance Visualization
            </h3>
            <p className="text-sm text-gray-400 mt-1 pl-6">
              {chartMode === 'price' ? 'Historical Price Trend Analysis' : 'Annual Revenue & Profit Growth'}
            </p>
          </div>
          
          <div className="flex bg-black/40 rounded-xl p-1.5 border border-gray-700/50 backdrop-blur-sm shadow-inner">
            <button 
              onClick={() => setChartMode('price')}
              className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                chartMode === 'price' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              Price
            </button>
            <button 
              onClick={() => setChartMode('financials')}
              className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                chartMode === 'financials' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              Financials
            </button>
          </div>
        </div>

        {/* Chart Render */}
        <div className="relative z-10 h-[350px] w-full bg-black/20 rounded-xl border border-gray-700/30 p-2 shadow-inner backdrop-brightness-75">
          {chartMode === 'price' ? (
            priceData.length > 0 ? (
              <div className="h-full w-full relative">
                {/* Time Range Selector for Price Chart */}
                <div className="absolute right-2 -top-12 sm:top-2 z-20 flex space-x-1 bg-gray-900/80 rounded-lg p-1 border border-gray-700/50">
                    {['1Y', '6M', '3M'].map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range as any)}
                            className={`text-[10px] font-bold px-3 py-1 rounded transition-colors ${timeRange === range ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'text-gray-500 hover:text-gray-300 border border-transparent'}`}
                        >
                            {range}
                        </button>
                    ))}
                </div>

                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} strokeOpacity={0.5} />
                    <XAxis 
                        dataKey="month" 
                        stroke="#9ca3af" 
                        tick={{fontSize: 11, fontWeight: 500}} 
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                    />
                    <YAxis 
                        stroke="#9ca3af" 
                        tick={{fontSize: 11, fontWeight: 500}} 
                        axisLine={false}
                        tickLine={false}
                        domain={['auto', 'auto']}
                        dx={-10}
                    />
                    <Tooltip 
                        contentStyle={{backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: '#374151', borderRadius: '12px', fontSize: '12px', backdropFilter: 'blur(4px)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                        itemStyle={{color: '#fff', fontWeight: 600}}
                        cursor={{stroke: '#60a5fa', strokeWidth: 1, strokeDasharray: '4 4'}}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorPrice)" 
                        animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm">
                <div className="p-4 bg-gray-800/50 rounded-full mb-3">
                   <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </div>
                <p>Price data unavailable for this ticker.</p>
              </div>
            )
          ) : (
            financialData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="year" 
                    stroke="#9ca3af" 
                    tick={{fontSize: 11, fontWeight: 500}} 
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    tick={{fontSize: 11, fontWeight: 500}} 
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip 
                    cursor={{fill: '#3b82f6', opacity: 0.1}}
                    contentStyle={{backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: '#374151', borderRadius: '12px', fontSize: '12px', backdropFilter: 'blur(4px)'}}
                    itemStyle={{fontWeight: 600}}
                  />
                  <Legend wrapperStyle={{fontSize: '12px', paddingTop: '20px', fontWeight: 500}} iconType="circle" />
                  <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} animationDuration={1500} />
                  <Bar dataKey="profit" name="Net Profit" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm">
                 <div className="p-4 bg-gray-800/50 rounded-full mb-3">
                   <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                 </div>
                 <p>Financial data unavailable.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;