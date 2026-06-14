import React, { useState, useEffect } from 'react';
import { Sparkles, Users, LayoutDashboard, BarChart3, LogOut, LogIn } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Shoppers from './components/Shoppers';
import CampaignStudio from './components/CampaignStudio';
import CampaignReports from './components/CampaignReports';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';

type Tab = 'dashboard' | 'shoppers' | 'studio' | 'reports';
type ViewMode = 'landing' | 'app';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [theme, setTheme] = useState<'midnight' | 'emerald' | 'crimson' | 'light'>('midnight');

  // Restore session on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('xeno_user_email');
    if (savedEmail) {
      setUserEmail(savedEmail);
      setViewMode('app');
    }
  }, []);

  const changeTheme = (newTheme: 'midnight' | 'emerald' | 'crimson' | 'light') => {
    setTheme(newTheme);
    document.body.classList.remove('theme-emerald', 'theme-crimson', 'theme-light');
    if (newTheme !== 'midnight') {
      document.body.classList.add(`theme-${newTheme}`);
    }
  };

  const handleLoginSuccess = (email: string) => {
    localStorage.setItem('xeno_user_email', email);
    setUserEmail(email);
    setShowAuthModal(false);
    setViewMode('app');
  };

  const handleLogout = () => {
    localStorage.removeItem('xeno_user_email');
    setUserEmail(null);
    setViewMode('landing');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'shoppers', label: 'Shoppers', icon: <Users size={16} /> },
    { id: 'studio', label: 'Campaign Studio', icon: <Sparkles size={16} /> },
    { id: 'reports', label: 'Analytics Reports', icon: <BarChart3 size={16} /> },
  ] as const;

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] selection:bg-primary/30 selection:text-white transition-colors duration-300">
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-50 border-b border-dark-800 bg-[var(--bg-color)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo (Left) */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setViewMode('landing')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-primary/20">
              X
            </div>
            <div>
              <span className="text-white font-extrabold text-lg tracking-tight">XENO</span>
              <span className="text-[10px] text-primary block -mt-1 font-mono uppercase font-bold tracking-wider">AI CRM Platform</span>
            </div>
          </div>

          {/* Navigation Items (Middle - only visible in application console) */}
          {viewMode === 'app' ? (
            <nav className="hidden lg:flex space-x-1 bg-dark-850 p-1 rounded-xl border border-dark-750">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-sm' : 'text-dark-500 hover:text-white hover:bg-dark-800/50'}`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          ) : (
            <div className="text-xs text-dark-500 font-semibold tracking-wide hidden md:block">
              AI-Native Campaign Dispatcher & Receipt Loop
            </div>
          )}

          {/* Controls Panel (Right) */}
          <div className="flex items-center space-x-4">
            {/* Theme Selector */}
            <div className="bg-dark-850 px-2.5 py-1.5 rounded-xl border border-dark-750 flex items-center space-x-1 text-xs">
              <span className="text-dark-500 font-semibold select-none mr-1">Theme:</span>
              <select
                value={theme}
                onChange={(e) => changeTheme(e.target.value as any)}
                className="bg-transparent border-0 text-white font-bold focus:outline-none cursor-pointer pr-1"
              >
                <option value="midnight" className="bg-[#0F172A] text-indigo-400">Midnight Neon</option>
                <option value="emerald" className="bg-[#062319] text-emerald-400">Emerald Forest</option>
                <option value="crimson" className="bg-[#240E14] text-rose-400">Cyberpunk Rose</option>
                <option value="light" className="bg-[#F8FAFC] text-gray-800">Clean Light</option>
              </select>
            </div>

            {/* User Session Auth controls */}
            {viewMode === 'app' ? (
              <div className="flex items-center space-x-3.5">
                <span className="text-xs text-dark-500 hidden md:inline-block font-mono bg-dark-800 px-2.5 py-1 rounded-lg border border-dark-700">
                  {userEmail}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
                  title="Sign out of CRM session"
                >
                  <LogOut size={13} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-md shadow-primary/10"
              >
                <LogIn size={13} />
                <span>Sandbox Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === 'landing' ? (
          <LandingPage 
            onStartApp={() => {
              if (userEmail) {
                setViewMode('app');
              } else {
                setShowAuthModal(true);
              }
            }} 
            onOpenAuth={() => setShowAuthModal(true)} 
          />
        ) : (
          <div className="transition-all duration-300 space-y-6">
            {/* Mobile Tab navigation (only shown on smaller screens in app mode) */}
            <nav className="flex lg:hidden overflow-x-auto space-x-1 bg-dark-850 p-1 rounded-xl border border-dark-750 text-xs scrollbar-none mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg font-semibold flex items-center space-x-1.5 transition-all flex-shrink-0 ${activeTab === tab.id ? 'bg-primary text-white shadow-sm' : 'text-dark-500 hover:text-white'}`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            {activeTab === 'dashboard' && (
              <Dashboard 
                onNavigateToStudio={() => setActiveTab('studio')} 
                onNavigateToReports={() => setActiveTab('reports')} 
                onNavigateToShoppers={() => setActiveTab('shoppers')} 
              />
            )}
            {activeTab === 'shoppers' && <Shoppers />}
            {activeTab === 'studio' && (
              <CampaignStudio onCampaignLaunched={() => setActiveTab('reports')} />
            )}
            {activeTab === 'reports' && <CampaignReports />}
          </div>
        )}
      </main>

      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <AuthPage 
          onLoginSuccess={handleLoginSuccess} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}
    </div>
  );
};

export default App;
