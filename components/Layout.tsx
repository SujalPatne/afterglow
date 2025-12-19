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
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${active
      ? 'bg-brand-200 text-brand-900'
      : 'text-brand-500 hover:bg-brand-100 hover:text-brand-900'
      }`}
  >
    <Icon size={18} className="shrink-0" />
    <span className="truncate">{label}</span>
  </button>
);

const MobileNavItem = ({ icon: Icon, label, id, active, onClick }: any) => (
  <button
    onClick={() => onClick(id)}
    className={`flex flex-col items-center justify-center flex-1 py-2 gap-1 transition-colors ${active
      ? 'text-indigo-600'
      : 'text-brand-400'
      }`}
  >
    <Icon size={20} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children }) => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-brand-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-brand-200 bg-white flex-col transition-all duration-300">
        <div className="p-6 border-b border-brand-100 flex flex-col items-start">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-600 shrink-0"></div>
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

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-brand-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-600"></div>
          <span className="text-lg font-bold text-brand-900 tracking-tight">Afterglow</span>
        </div>
        <button
          onClick={() => onNavigate('settings')}
          className={`p-2 rounded-full ${currentView === 'settings' ? 'bg-brand-100 text-brand-900' : 'text-brand-400'}`}
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-brand-200 flex items-center justify-around px-2 py-1 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <MobileNavItem icon={LayoutDashboard} label="Overview" id="overview" active={currentView === 'overview'} onClick={onNavigate} />
        <MobileNavItem icon={GitPullRequest} label="Pipeline" id="pipeline" active={currentView === 'pipeline'} onClick={onNavigate} />
        <MobileNavItem icon={Network} label="Network Graph" id="graph" active={currentView === 'graph'} onClick={onNavigate} />
        <MobileNavItem icon={CheckCircle} label="Outcomes" id="outcomes" active={currentView === 'outcomes'} onClick={onNavigate} />
      </nav>
    </div>
  );
};
