import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Overview } from './components/Overview';
import { Pipeline } from './components/Pipeline';
import { NetworkGraph } from './components/NetworkGraph';
import { Outcomes } from './components/Outcomes';
import { WelcomeModal } from './components/WelcomeModal';
import { generateData } from './data/mockData';
import { AppState } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [showWelcome, setShowWelcome] = useState(true);
  const [data, setData] = useState<AppState>({
    attendees: [],
    matches: [],
    outcomes: [],
    selectedMatchId: null,
  });

  useEffect(() => {
    // Initialize with synthetic data
    const { attendees, matches, outcomes } = generateData(80);
    setData(prev => ({ ...prev, attendees, matches, outcomes }));
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <Overview matches={data.matches} outcomes={data.outcomes} attendeeCount={data.attendees.length} />;
      case 'pipeline':
        return <Pipeline matches={data.matches} attendees={data.attendees} />;
      case 'graph':
        return <NetworkGraph attendees={data.attendees} matches={data.matches} />;
      case 'outcomes':
        return <Outcomes />;
      case 'settings':
        return (
          <div className="p-8 text-center text-brand-400">
            <h2 className="text-xl font-medium text-brand-900 mb-2">Settings & Integrations</h2>
            <p>Mock configuration panel. Integration settings for Calendly and CRMs would appear here.</p>
          </div>
        );
      default:
        return <Overview matches={data.matches} outcomes={data.outcomes} attendeeCount={data.attendees.length} />;
    }
  };

  return (
    <>
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      <Layout currentView={currentView} onNavigate={setCurrentView}>
        {!process.env.API_KEY && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
            <AlertCircle size={18} />
            <span>Running in Demo Mode without API Key. AI features (Nudges, Analysis) will return deterministic mock responses.</span>
          </div>
        )}
        {renderContent()}
      </Layout>
    </>
  );
};

export default App;