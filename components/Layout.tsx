import React from 'react';
import { LayoutDashboard, Network, GitPullRequest, Settings, CheckCircle } from 'lucide-react';

interface LayoutProps {
  currentView: string;
  onNavigate: (view: string) => void;
  children: React.ReactNode;
}

const NavItem = ({ icon: Icon, label, id, active, onClick }: any) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active 
        ? 'bg-brand-200 text-brand-900' 
        : 'text-brand-500 hover:bg-brand-100 hover:text-brand-900'
    }`}
  >
    <Icon size={18} />
    {label}
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children }) => {
  return (
    <div className="flex h-screen bg-brand-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-brand-200 bg-white flex flex-col">
        <div className="p-6 border-b border-brand-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-600"></div>
            <span className="text-lg font-bold text-brand-900 tracking-tight">Afterglow</span>
          </div>
          <p className="text-xs text-brand-400 mt-1 font-medium">Event ROI & Analytics</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavItem icon={LayoutDashboard} label="Overview" id="overview" active={currentView === 'overview'} onClick={onNavigate} />
          <NavItem icon={GitPullRequest} label="Pipeline" id="pipeline" active={currentView === 'pipeline'} onClick={onNavigate} />
          <NavItem icon={Network} label="Network Graph" id="graph" active={currentView === 'graph'} onClick={onNavigate} />
          <NavItem icon={CheckCircle} label="Outcomes" id="outcomes" active={currentView === 'outcomes'} onClick={onNavigate} />
        </nav>

        <div className="p-4 border-t border-brand-100">
           <NavItem icon={Settings} label="Settings" id="settings" active={currentView === 'settings'} onClick={onNavigate} />
           <div className="mt-4 px-3">
             <div className="text-xs font-mono text-brand-300">v1.2.0 • Pro</div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
