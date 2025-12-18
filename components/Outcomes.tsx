import React, { useState } from 'react';
import { summarizeOutcome } from '../services/geminiService';
import { Sparkles, Save, Clock } from 'lucide-react';

export const Outcomes: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [structuredData, setStructuredData] = useState<{ type: string; sentiment: string; nextStep: string } | null>(null);

  const handleAnalyze = async () => {
    if (!notes) return;
    setAnalyzing(true);
    const result = await summarizeOutcome(notes);
    setStructuredData(result);
    setAnalyzing(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border border-brand-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-brand-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-brand-900">Log Outcome</h2>
          <p className="text-sm text-brand-500 mt-1">Manually track success metrics from meetings held.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-700">Meeting Notes (Raw)</label>
            <textarea
              className="w-full h-32 p-3 border border-brand-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
              placeholder="Paste notes from your call here... e.g. 'Met with Sarah, she is interested in investing $50k. Follow up next Tuesday with pitch deck.'"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="flex justify-end">
              <button 
                onClick={handleAnalyze}
                disabled={!notes || analyzing}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
              >
                {analyzing ? (
                   <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : <Sparkles size={16} />}
                Auto-Analyze with AI
              </button>
            </div>
          </div>

          {structuredData && (
            <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-sm font-bold text-indigo-900 mb-4 uppercase tracking-wide">Extracted Data</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs text-indigo-500 font-semibold">Outcome Type</label>
                   <div className="mt-1 px-3 py-2 bg-white rounded border border-indigo-200 text-brand-800 text-sm font-medium shadow-sm">
                      {structuredData.type}
                   </div>
                </div>
                <div>
                   <label className="text-xs text-indigo-500 font-semibold">Sentiment</label>
                   <div className="mt-1 px-3 py-2 bg-white rounded border border-indigo-200 text-brand-800 text-sm font-medium shadow-sm flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${structuredData.sentiment === 'Positive' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                      {structuredData.sentiment}
                   </div>
                </div>
                <div className="col-span-2">
                   <label className="text-xs text-indigo-500 font-semibold">Suggested Next Step</label>
                   <div className="mt-1 px-3 py-2 bg-white rounded border border-indigo-200 text-brand-800 text-sm font-medium shadow-sm flex items-start gap-2">
                      <Clock size={16} className="text-indigo-400 mt-0.5" />
                      {structuredData.nextStep}
                   </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                 <button className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex justify-center items-center gap-2">
                    <Save size={16}/> Save Outcome
                 </button>
                 <button 
                   onClick={() => setStructuredData(null)}
                   className="px-4 py-2 bg-white text-brand-600 border border-brand-200 rounded-lg text-sm font-medium hover:bg-brand-50"
                 >
                    Discard
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
