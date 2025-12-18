import React from 'react';
import { X, Check, ArrowRight } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-brand-200 animate-in zoom-in-95 duration-300 slide-in-from-bottom-4">
        <div className="p-6 border-b border-brand-100 flex justify-between items-center bg-brand-50/50">
          <div>
            <h2 className="text-xl font-bold text-brand-900">Welcome to Afterglow</h2>
            <p className="text-sm text-brand-500 mt-0.5">Event ROI & Relationship Analytics</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-brand-100 rounded-full text-brand-400 hover:text-brand-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <ul className="space-y-4">
            <li className="flex gap-4 items-start group">
              <div className="mt-0.5 bg-indigo-50 p-1.5 rounded-full text-indigo-600 border border-indigo-100 shrink-0 group-hover:bg-indigo-100 transition-colors">
                <Check size={14} strokeWidth={3} />
              </div>
              <span className="text-brand-600 text-sm leading-relaxed">
                <strong className="text-brand-900 font-semibold block mb-0.5">Lifecycle Tracking</strong>
                Tracks the full journey: Introbot Intro → Accepted → Meeting Scheduled/Held → Outcome (hire/pilot/investment).
              </span>
            </li>
            
            <li className="flex gap-4 items-start group">
               <div className="mt-0.5 bg-indigo-50 p-1.5 rounded-full text-indigo-600 border border-indigo-100 shrink-0 group-hover:bg-indigo-100 transition-colors">
                <Check size={14} strokeWidth={3} />
              </div>
              <span className="text-brand-600 text-sm leading-relaxed">
                <strong className="text-brand-900 font-semibold block mb-0.5">Organizer ROI Dashboard</strong>
                 Visualizes the conversion funnel and identifies bottlenecks to prove event value and improve strategy.
              </span>
            </li>

            <li className="flex gap-4 items-start group">
               <div className="mt-0.5 bg-indigo-50 p-1.5 rounded-full text-indigo-600 border border-indigo-100 shrink-0 group-hover:bg-indigo-100 transition-colors">
                <Check size={14} strokeWidth={3} />
              </div>
              <span className="text-brand-600 text-sm leading-relaxed">
                <strong className="text-brand-900 font-semibold block mb-0.5">AI Nudges & Drafts</strong>
                Generates context-aware follow-up messages to increase conversion from passive intros to real meetings.
              </span>
            </li>

            <li className="flex gap-4 items-start group">
               <div className="mt-0.5 bg-indigo-50 p-1.5 rounded-full text-indigo-600 border border-indigo-100 shrink-0 group-hover:bg-indigo-100 transition-colors">
                <Check size={14} strokeWidth={3} />
              </div>
              <span className="text-brand-600 text-sm leading-relaxed">
                <strong className="text-brand-900 font-semibold block mb-0.5">Graph Intelligence</strong>
                Visualizes the attendee network to spot super-connectors and isolated nodes, suggesting bridging actions.
              </span>
            </li>
          </ul>
        </div>

        <div className="p-6 pt-2 bg-brand-50/30">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all text-sm flex items-center justify-center gap-2"
          >
            Explore Dashboard <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};