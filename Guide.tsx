
import React, { useState } from 'react';
import { searchModenaInfo } from '../services/geminiService';

const Guide: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string; sources: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setQuery(searchQuery); // Ensure the input reflects the quick query
    
    try {
      const data = await searchModenaInfo(searchQuery);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("The concierge is currently unavailable. Please check your API connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-[40px] font-['Pixelify_Sans']">
      {/* Search Sidebar - Fixed Pixel Width */}
      <aside className="w-full md:w-[350px] space-y-[24px]">
        <div className="bg-stone-900 text-white p-[32px] rounded-[24px] shadow-xl">
          <h2 className="text-[24px] font-bold mb-[8px]">Concierge</h2>
          <p className="text-stone-400 text-[13px] mb-[24px]">Ask real-time about parking, maps, or local news.</p>
          
          <div className="space-y-[16px]">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              placeholder="How do I get to..."
              className="w-full bg-stone-800 border-none px-[16px] py-[14px] rounded-[16px] text-[15px] text-white focus:ring-2 focus:ring-red-600 outline-none"
            />
            <button 
              onClick={() => handleSearch(query)}
              disabled={loading || !query.trim()}
              className={`w-full py-[14px] rounded-[16px] font-bold text-[15px] transition-all uppercase tracking-widest ${
                loading ? 'bg-stone-700 cursor-wait' : 'bg-red-600 hover:bg-red-700 active:scale-95'
              }`}
            >
              {loading ? 'Consulting Web...' : 'Ask Assistant'}
            </button>
          </div>
        </div>

        <div className="bg-white p-[32px] rounded-[24px] border border-stone-200 shadow-sm">
          <h4 className="text-[12px] font-bold text-stone-400 uppercase tracking-widest mb-6">Real-Time Queries</h4>
          <div className="flex flex-col gap-4">
            {[
              { label: "Best Gelato in Modena", icon: "🍦" },
              { label: "ZTL Parking Map Modena", icon: "🅿️" },
              { label: "Maranello Ferrari Shuttle", icon: "🏎️" },
              { label: "Today's Events in Piazza Grande", icon: "📅" }
            ].map(q => (
              <button 
                key={q.label} 
                onClick={() => handleSearch(q.label)}
                className="text-left group flex items-center gap-3 p-2 rounded-xl hover:bg-red-50 transition-all"
              >
                <span className="text-lg grayscale group-hover:grayscale-0 transition-all">{q.icon}</span>
                <span className="text-[14px] text-stone-600 group-hover:text-red-600 font-medium">
                  {q.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Results Area */}
      <div className="flex-grow min-h-[500px]">
        {loading ? (
          <div className="h-full bg-white rounded-[24px] border border-stone-200 flex flex-col items-center justify-center p-20 text-center space-y-6">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="text-xl font-bold text-stone-900">Consulting the Oracle...</p>
              <p className="text-stone-400">Searching live web sources for the most accurate info.</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-full bg-white rounded-[24px] border-2 border-red-100 flex flex-col items-center justify-center p-20 text-center">
            <span className="text-6xl mb-6">⚠️</span>
            <p className="text-red-600 font-bold text-lg">{error}</p>
            <button onClick={() => setError(null)} className="mt-4 text-stone-400 hover:text-stone-600 underline">Dismiss</button>
          </div>
        ) : result ? (
          <div className="bg-white p-[48px] rounded-[24px] shadow-sm border border-stone-200 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between mb-10 border-b border-stone-100 pb-6">
              <h3 className="text-2xl font-bold text-stone-900">Search Result</h3>
              <button onClick={() => setResult(null)} className="text-stone-300 hover:text-red-600">✕</button>
            </div>

            <div className="prose prose-stone max-w-none text-stone-700 leading-[1.8] space-y-6">
              {result.text.split('\n').filter(p => p.trim()).map((para, i) => (
                <p key={i} className="text-[17px]">{para.replace(/\*/g, '')}</p>
              ))}
            </div>
            
            {result.sources.length > 0 && (
              <div className="mt-12 pt-10 border-t border-stone-100">
                <h4 className="text-[12px] font-bold text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Verified Web Sources
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {result.sources.map((chunk: any, i: number) => (
                    chunk.web && (
                      <a 
                        key={i} 
                        href={chunk.web.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group bg-stone-50 hover:bg-red-600 p-4 rounded-xl flex items-center justify-between transition-all shadow-sm"
                      >
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-stone-900 group-hover:text-white truncate max-w-[200px]">
                            {chunk.web.title || "Source Reference"}
                          </span>
                          <span className="text-[10px] text-stone-400 group-hover:text-red-100">Click to open map/site</span>
                        </div>
                        <span className="text-stone-300 group-hover:text-white">↗</span>
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-stone-200 rounded-[24px] flex flex-col items-center justify-center text-stone-300 p-12 text-center">
            <span className="text-[64px] mb-6 opacity-20">🔎</span>
            <h3 className="text-[18px] font-bold text-stone-400 uppercase tracking-[3px]">Travel Assistant Ready</h3>
            <p className="max-w-[300px] mt-4 text-stone-300">Ask about real-time logistics or use the quick queries on the left.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guide;
