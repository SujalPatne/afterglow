import React from 'react';
import { Match, MatchStatus, Outcome } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Handshake, DollarSign } from 'lucide-react';

interface OverviewProps {
  matches: Match[];
  outcomes: Outcome[];
  attendeeCount: number;
}

const KpiCard = ({ label, value, sub, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-brand-200 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-brand-500">{label}</p>
      <h3 className="text-2xl font-bold text-brand-900 mt-1">{value}</h3>
      {sub && <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1"><TrendingUp size={12}/> {sub}</p>}
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={20} className="text-brand-900 opacity-70" />
    </div>
  </div>
);

export const Overview: React.FC<OverviewProps> = ({ matches, outcomes, attendeeCount }) => {
  const counts = {
    suggested: matches.filter(m => m.status === MatchStatus.SUGGESTED).length,
    accepted: matches.filter(m => m.status === MatchStatus.ACCEPTED).length,
    scheduled: matches.filter(m => m.status === MatchStatus.SCHEDULED).length,
    held: matches.filter(m => m.status === MatchStatus.HELD).length,
    outcome: matches.filter(m => m.status === MatchStatus.OUTCOME_LOGGED).length,
  };

  const funnelData = [
    { name: 'Suggested', value: counts.suggested + counts.accepted + counts.scheduled + counts.held + counts.outcome },
    { name: 'Accepted', value: counts.accepted + counts.scheduled + counts.held + counts.outcome },
    { name: 'Scheduled', value: counts.scheduled + counts.held + counts.outcome },
    { name: 'Meetings', value: counts.held + counts.outcome },
    { name: 'Outcomes', value: counts.outcome },
  ];

  const conversionData = [
    { name: 'Connect Rate', value: Math.round((funnelData[1].value / funnelData[0].value) * 100) },
    { name: 'Meeting Rate', value: Math.round((funnelData[3].value / funnelData[1].value) * 100) },
    { name: 'Success Rate', value: Math.round((funnelData[4].value / funnelData[3].value) * 100) },
  ];

  // Identify bottleneck
  let bottleneck = "None";
  let drop = 0;
  if (100 - conversionData[0].value > drop) { drop = 100 - conversionData[0].value; bottleneck = "Acceptance"; }
  if (100 - conversionData[1].value > drop) { drop = 100 - conversionData[1].value; bottleneck = "Scheduling"; }
  if (100 - conversionData[2].value > drop) { drop = 100 - conversionData[2].value; bottleneck = "Conversion"; }

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard label="Total Attendees" value={attendeeCount} sub="+12% YoY" icon={Users} color="bg-blue-100" />
        <KpiCard label="Intros Made" value={matches.length} sub="3.5 avg/person" icon={Handshake} color="bg-indigo-100" />
        <KpiCard label="Meetings Held" value={counts.held + counts.outcome} sub="High engagement" icon={Calendar} color="bg-purple-100" />
        <KpiCard label="Pipeline Value" value={`$${(outcomes.length * 50)}k+`} sub="Est. generated" icon={DollarSign} color="bg-emerald-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-brand-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-semibold text-brand-900">Conversion Funnel</h3>
             <span className="text-xs font-medium text-brand-500 bg-brand-50 px-2 py-1 rounded">Real-time</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={funnelData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
                  cursor={{stroke: '#cbd5e1', strokeWidth: 1}}
                />
                <Area type="monotone" dataKey="value" stroke="#4f46e5" fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottleneck Detector */}
        <div className="bg-white p-6 rounded-xl border border-brand-200 shadow-sm flex flex-col">
          <h3 className="font-semibold text-brand-900 mb-4">Bottleneck Detector</h3>
          
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="text-center">
               <p className="text-sm text-brand-500 mb-1">Primary Drop-off Point</p>
               <h4 className="text-2xl font-bold text-red-500">{bottleneck}</h4>
               <p className="text-xs text-brand-400 mt-2">
                 {bottleneck === "Acceptance" && "Users are seeing intros but not accepting."}
                 {bottleneck === "Scheduling" && "Intros accepted but meetings not booked."}
                 {bottleneck === "Conversion" && "Meetings happening but outcomes not tracked."}
               </p>
            </div>

            <div className="space-y-3">
              {conversionData.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-brand-600 font-medium">{item.name}</span>
                    <span className="text-brand-900 font-bold">{item.value}%</span>
                  </div>
                  <div className="w-full bg-brand-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.value < 50 ? 'bg-red-400' : 'bg-emerald-500'}`} 
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full py-2 border border-brand-200 text-brand-600 text-sm font-medium rounded hover:bg-brand-50 transition-colors mt-auto">
              View Recommended Actions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Calendar(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
