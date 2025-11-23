
import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { AgentDashboard } from './components/AgentDashboard';
import { SupervisorDashboard } from './components/SupervisorDashboard';
import { AnalystDashboard } from './components/AnalystDashboard';
import { UserRole, EnrichedTweet } from './types';
import { MOCK_DATA } from './constants';
import { LogOut, Wifi, BarChart3 } from 'lucide-react';

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>(null);
  const [data, setData] = useState<EnrichedTweet[]>(MOCK_DATA);

  const handleLogin = (role: UserRole, uploadedData?: EnrichedTweet[]) => {
    setCurrentRole(role);
    if (uploadedData && uploadedData.length > 0) {
      setData(uploadedData);
    }
  };

  const handleLogout = () => {
    setCurrentRole(null);
    setData(MOCK_DATA); // Reset to mock or keep data? Resetting for safety.
  };

  if (!currentRole) {
    return <FileUpload onComplete={handleLogin} />;
  }

  const renderDashboard = () => {
    switch (currentRole) {
      case 'agent':
        return <AgentDashboard data={data} />;
      case 'supervisor':
        return <SupervisorDashboard data={data} />;
      case 'analyst':
        return <AnalystDashboard data={data} />;
      default:
        return <div>Erreur de rôle</div>;
    }
  };

  const getRoleLabel = () => {
    switch (currentRole) {
      case 'agent': return 'Agent';
      case 'supervisor': return 'Superviseur';
      case 'analyst': return 'Analyste';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 font-sans">
      {/* Top Navigation Bar */}
      <nav className="h-16 bg-card-bg border-b border-slate-700 flex items-center justify-between px-6 shadow-md z-50 relative">
        <div className="flex items-center gap-2">
          <div className="bg-free-red text-white font-bold px-2 py-1 rounded text-xl shadow-sm shadow-red-900/20">SAV</div>
          <h1 className="font-bold text-lg tracking-tight">
            Dashboard <span className="text-free-red">{getRoleLabel()}</span>
          </h1>
        </div>

        {/* Central Status (Simulated) */}
        {currentRole === 'supervisor' && (
           <div className="hidden md:flex items-center gap-6 text-xs font-medium bg-slate-800 px-4 py-1.5 rounded-full border border-slate-700">
              <span className="flex items-center gap-2 text-green-400">
                <Wifi size={14} /> Réseau National: OK
              </span>
              <span className="w-px h-4 bg-slate-600"></span>
              <span className="text-slate-300">
                Flux Tweets: <span className="text-white font-bold">Normal</span>
              </span>
           </div>
        )}

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white">
              {currentRole === 'agent' ? 'Julie D.' : currentRole === 'supervisor' ? 'Marc L.' : 'Camille A.'}
            </p>
            <p className="text-xs text-slate-400 uppercase">{currentRole}</p>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-slate-500 ${currentRole === 'analyst' ? 'bg-purple-900' : 'bg-slate-600'}`}>
            <span className="font-bold">
              {currentRole === 'agent' ? 'JD' : currentRole === 'supervisor' ? 'ML' : 'CA'}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
            title="Déconnexion"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main>
        {renderDashboard()}
      </main>
    </div>
  );
};

export default App;
