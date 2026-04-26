/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  History, 
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { analyzeNews } from '../services/geminiService';
import { AnalysisResult, NewsStatus, NewsHistoryItem } from '../types';

const EXAMPLES = [
  "New NASA study proves moon is actually made of Swiss cheese.",
  "Global markets rally as inflation drops to record lows in major economies.",
  "Local man saves puppy from burning building during storm.",
  "Shocking: Drinking lemon juice in the morning cures all known diseases instantly!",
];

export const Detector: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<NewsHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('news_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (text: string, analysis: AnalysisResult) => {
    const newItem: NewsHistoryItem = {
      ...analysis,
      id: Date.now().toString(),
      text,
    };
    const newHistory = [newItem, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('news_history', JSON.stringify(newHistory));
  };

  const handleAnalyze = async (textToAnalyze: string = inputText) => {
    if (!textToAnalyze.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeNews(textToAnalyze);
      setResult(data);
      saveToHistory(textToAnalyze, data);
    } catch (err) {
      setError("Analysis failed. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusConfig = (status: NewsStatus) => {
    switch (status) {
      case NewsStatus.REAL:
        return { 
          icon: <ShieldCheck className="w-4 h-4" />, 
          color: 'text-emerald-700', 
          bg: 'bg-emerald-100',
          label: 'Verified Real',
          barColor: 'bg-emerald-500'
        };
      case NewsStatus.FAKE:
        return { 
          icon: <ShieldAlert className="w-4 h-4" />, 
          color: 'text-rose-700', 
          bg: 'bg-rose-100',
          label: 'Potential Fake',
          barColor: 'bg-rose-500'
        };
      case NewsStatus.SATIRE:
        return { 
          icon: <AlertTriangle className="w-4 h-4" />, 
          color: 'text-amber-700', 
          bg: 'bg-amber-100',
          label: 'Satire Detection',
          barColor: 'bg-amber-500'
        };
      default:
        return { 
          icon: <Info className="w-4 h-4" />, 
          color: 'text-slate-700', 
          bg: 'bg-slate-100',
          label: 'Unknown',
          barColor: 'bg-slate-400'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-32">
      {/* Input Column */}
      <div className="lg:col-span-7 flex flex-col gap-8">
        <section className="flex flex-col gap-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Article Text or Headline</label>
          <div className="relative group">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste the news item you wish to verify..."
              className="w-full min-h-[300px] p-6 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all shadow-sm text-lg leading-relaxed placeholder-slate-300 resize-none"
            />
            <div className="absolute bottom-6 right-6 flex items-center gap-4">
              <span className="text-xs text-slate-400 font-medium tabular-nums">{inputText.length} characters</span>
              <button
                onClick={() => handleAnalyze()}
                disabled={isAnalyzing || !inputText.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-8 py-3.5 rounded-lg font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center gap-2 group-hover:shadow-indigo-200"
              >
                {isAnalyzing ? (
                  <RotateCcw className="w-4 h-4 animate-spin" />
                ) : (
                  "Analyze News"
                )}
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Quick Verification Examples</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => {
                  setInputText(ex);
                  handleAnalyze(ex);
                }}
                className="text-left p-4 text-sm bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-slate-600 flex items-start gap-3 group"
              >
                <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-indigo-400 transition-colors" />
                <span className="line-clamp-2">{ex}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Analysis Column */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.section
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="result-card p-12 flex flex-col items-center justify-center text-center min-h-[400px] bg-white relative overflow-hidden"
            >
              {/* Animated background pulses */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-indigo-50 rounded-full blur-3xl -z-10"
              />
              
              <div className="relative mb-8">
                {/* Outer rotating ring */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-indigo-500"
                />
                
                {/* Floating "scanning" element */}
                <motion.div 
                  animate={{ 
                    y: [-10, 10, -10],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Search className="w-10 h-10 text-indigo-600 drop-shadow-lg" />
                </motion.div>
                
                {/* Particle dots around the search icon */}
                {[0, 72, 144, 216, 288].map((angle, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: [0.5, 1, 0.5],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="absolute w-2 h-2 bg-indigo-300 rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${angle}deg) translate(36px) rotate(-${angle}deg)`
                    }}
                  />
                ))}
              </div>

              <div className="space-y-4">
                <motion.h3 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-xl font-bold text-slate-800 tracking-tight"
                >
                  Analyzing Authenticity...
                </motion.h3>
                <div className="flex flex-col gap-2 items-center">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-[0.2em]">Consulting Gemini AI</p>
                </div>
              </div>

              <div className="mt-12 w-full max-w-[200px]">
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ left: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-1/2 h-full bg-indigo-500 rounded-full"
                  />
                </div>
              </div>
            </motion.section>
          ) : result ? (
            <motion.section
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="result-card p-10 flex flex-col items-center text-center"
            >
              <div className="mb-6">
                <div className={`inline-flex items-center gap-2 badge ${getStatusConfig(result.status).bg} ${getStatusConfig(result.status).color} mb-6`}>
                  {getStatusConfig(result.status).icon}
                  {getStatusConfig(result.status).label}
                </div>
                <div className="text-6xl font-black text-slate-900 mb-2 tabular-nums">
                  {result.confidence}<span className="text-3xl font-bold text-slate-300">%</span>
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Confidence Index</div>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidence}%` }}
                  className={`${getStatusConfig(result.status).barColor} h-full transition-all duration-1000 ease-out`}
                />
              </div>

              <div className="w-full text-left bg-slate-50 border border-slate-100 rounded-xl p-6 italic text-slate-600 leading-relaxed relative">
                <div className="absolute -top-3 left-6 px-3 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 rounded-lg">Gemini Analysis</div>
                "{result.explanation}"
              </div>

              {result.suspiciousWords.length > 0 && (
                <div className="w-full mt-8 flex flex-col gap-3 items-start">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    Flagged Keywords
                    <Info className="w-3 h-3" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.suspiciousWords.map((item, i) => (
                      <div key={i} className="group relative">
                        <span className="px-2.5 py-1 bg-white border border-rose-100 text-rose-500 text-[11px] font-bold rounded-md uppercase tracking-tight cursor-help transition-all hover:bg-rose-50 hover:border-rose-200 block">
                          {item.word}
                        </span>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-20">
                          <div className="bg-slate-900 text-white text-[10px] p-2 rounded shadow-xl leading-snug">
                            {item.reason}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>
          ) : (
            <div className="result-card p-12 flex flex-col items-center justify-center text-center opacity-40 grayscale min-h-[400px]">
              <Search className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-400 font-medium">Ready for input... <br/> paste a headline to begin analysis.</p>
            </div>
          )}
        </AnimatePresence>

        {/* History Column/Section */}
        {history.length > 0 && (
          <section className="result-card p-8">
            <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-6">Recent Analysis History</h3>
            <div className="space-y-4">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0 group cursor-pointer"
                  onClick={() => {
                    setInputText(item.text);
                    setResult(item);
                  }}
                >
                  <div className="flex flex-col gap-1 min-w-0 pr-4">
                    <span className="text-sm font-semibold text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
                      {item.text}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{new Date(item.checkedAt).toLocaleDateString()}</span>
                  </div>
                  <span className={`badge shrink-0 ${getStatusConfig(item.status).bg} ${getStatusConfig(item.status).color}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
