/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Detector } from './components/Detector';
import { Newspaper, ShieldCheck, Github, RotateCcw } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              VeriTruth <span className="text-indigo-600 font-medium tracking-normal text-xl ml-1">Detector</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-sm text-slate-400 font-medium hidden md:block">Model: Gemini v3-stable</div>
            <div className="h-4 w-px bg-slate-200 hidden md:block" />
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-20 pb-12 text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm mb-6 animate-fade-in badge bg-slate-50 text-slate-500">
          <RotateCcw className="w-3 h-3 text-indigo-500 animate-pulse" />
          <span>Real-time Neural Analysis</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 max-w-3xl mx-auto leading-tight">
          Verify headlines with <br/>
          <span className="text-indigo-600">algorithmic precision.</span>
        </h2>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">
          Deploy industrial-grade AI to detect misinformation, satire, and deep-fake headlines in seconds.
        </p>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <Detector />
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-20 border-t border-slate-200 py-10 px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-400">
        <p>© 2024 VeriTruth AI. Built for Truth in Journalism.</p>
        <div className="flex gap-8">
           <a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a>
           <a href="#" className="hover:text-indigo-600 transition-colors">API Status</a>
           <a href="#" className="hover:text-indigo-600 transition-colors">Safety Guidelines</a>
        </div>
      </footer>
    </div>
  );
}
