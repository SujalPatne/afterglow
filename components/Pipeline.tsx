import React, { useState } from 'react';
import { Match, Attendee, MatchStatus } from '../types';
import { generateNudge } from '../services/geminiService';
import { MessageSquare, Calendar, ChevronRight, Wand2, MoreHorizontal } from 'lucide-react';

interface PipelineProps {
  matches: Match[];
  attendees: Attendee[];
}

const StatusBadge = ({ status }: { status: MatchStatus }) => {
  const colors = {
    [MatchStatus.SUGGESTED]: 'bg-gray-100 text-gray-600 border-gray-200',
    [MatchStatus.ACCEPTED]: 'bg-blue-50 text-blue-700 border-blue-200',
    [MatchStatus.SCHEDULED]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    [MatchStatus.HELD]: 'bg-purple-50 text-purple-700 border-purple-200',
    [MatchStatus.OUTCOME_LOGGED]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status]}`}>
      {status}
    </span>
  );
};

export const Pipeline: React.FC<PipelineProps> = ({ matches, attendees }) => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [nudgeDraft, setNudgeDraft] = useState<string>('');
  const [loadingNudge, setLoadingNudge] = useState(false);

  const getAttendee = (id: string) => attendees.find(a => a.id === id);

  const handleGenerateNudge = async () => {
    if (!selectedMatch) return;
    setLoadingNudge(true);
    const source = getAttendee(selectedMatch.sourceId)!;
    const target = getAttendee(selectedMatch.targetId)!;
    const draft = await generateNudge(selectedMatch, source, target);
    setNudgeDraft(draft);
    setLoadingNudge(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-6">
      {/* Table Section */}
      <div className="flex-1 bg-white rounded-xl border border-brand-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-brand-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-semibold text-brand-900">Relationship Pipeline</h2>
          <div className="flex gap-2 text-sm text-brand-500">
            <span className="px-2 py-1 bg-white border border-brand-200 rounded text-xs font-mono">{matches.length} Matches</span>
          </div>
        </div>
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-50/50 sticky top-0 z-10">
              <tr className="text-brand-500 font-medium border-b border-brand-200">
                <th className="px-6 py-3 w-1/3">Pair</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Last Activity</th>
                <th className="px-6 py-3">Confidence</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {matches.slice(0, 50).map(match => {
                const source = getAttendee(match.sourceId);
                const target = getAttendee(match.targetId);
                if (!source || !target) return null;

                return (
                  <tr 
                    key={match.id} 
                    onClick={() => setSelectedMatch(match)}
                    className="hover:bg-brand-50 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          <img src={source.avatar} className="w-8 h-8 rounded-full border-2 border-white" alt="" />
                          <img src={target.avatar} className="w-8 h-8 rounded-full border-2 border-white" alt="" />
                        </div>
                        <div>
                          <div className="font-medium text-brand-900">{source.name} & {target.name}</div>
                          <div className="text-xs text-brand-500">{source.company} • {target.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={match.status} />
                    </td>
                    <td className="px-6 py-3 text-brand-600 font-mono text-xs">
                      {new Date(match.lastActivity).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                       <div className="w-full bg-brand-100 rounded-full h-1.5 w-24">
                          <div 
                            className={`h-1.5 rounded-full ${match.confidenceScore > 80 ? 'bg-emerald-500' : 'bg-amber-400'}`} 
                            style={{ width: `${match.confidenceScore}%` }}
                          />
                       </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                       <ChevronRight className="w-4 h-4 text-brand-300 ml-auto group-hover:text-brand-600" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer Section */}
      {selectedMatch && (
        <div className="w-96 bg-white border-l border-brand-200 shadow-xl flex flex-col animate-in slide-in-from-right duration-300 absolute right-0 top-0 h-full z-20">
          <div className="p-6 border-b border-brand-100 flex justify-between items-start bg-brand-50/30">
            <div>
              <h3 className="font-semibold text-lg text-brand-900">Match Details</h3>
              <p className="text-sm text-brand-500 font-mono mt-1">{selectedMatch.id}</p>
            </div>
            <button onClick={() => setSelectedMatch(null)} className="text-brand-400 hover:text-brand-900">×</button>
          </div>
          
          <div className="flex-1 overflow-auto p-6 space-y-6">
            {/* Timeline */}
            <section>
              <h4 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-3">Timeline</h4>
              <div className="space-y-4 relative pl-4 border-l border-brand-200">
                {selectedMatch.timeline.map((event, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-brand-300 border-2 border-white"></div>
                    <p className="text-sm text-brand-800">{event.description}</p>
                    <p className="text-xs text-brand-400 mt-0.5">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </section>

             {/* AI Nudge */}
             <section className="bg-indigo-50/50 rounded-lg p-4 border border-indigo-100">
               <div className="flex items-center justify-between mb-3">
                 <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                   <Wand2 size={12} /> AI Nudge
                 </h4>
               </div>
               
               {!nudgeDraft ? (
                 <button 
                  onClick={handleGenerateNudge}
                  disabled={loadingNudge}
                  className="w-full py-2 bg-white border border-indigo-200 text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-50 transition-all shadow-sm"
                 >
                   {loadingNudge ? 'Genering...' : 'Generate Follow-up Draft'}
                 </button>
               ) : (
                 <div className="space-y-2">
                   <textarea 
                    className="w-full text-sm p-3 bg-white border border-indigo-200 rounded-md text-brand-700 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                    rows={4}
                    value={nudgeDraft}
                    readOnly
                   />
                   <div className="flex gap-2">
                      <button 
                        onClick={() => { navigator.clipboard.writeText(nudgeDraft); setNudgeDraft('') }}
                        className="flex-1 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700"
                      >
                        Copy
                      </button>
                      <button 
                        onClick={() => setNudgeDraft('')}
                        className="px-3 py-1.5 text-brand-500 text-xs hover:text-brand-900"
                      >
                        Discard
                      </button>
                   </div>
                 </div>
               )}
             </section>
          </div>
        </div>
      )}
    </div>
  );
};
