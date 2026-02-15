
import React, { useState, useEffect, useMemo } from 'react';
import { QuitPhase, CigaretteLog, Language, UserSettings } from './types';
import { Dashboard } from './components/Dashboard';
import { LogModal } from './components/LogModal';
import { BreathingModal } from './components/BreathingModal';
import { Insights } from './components/Insights';
import { ChatCoach } from './components/ChatCoach';
import { TRANSLATIONS } from './constants';
import { Home, BarChart3, MessageCircle, Settings, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'insights' | 'coach' | 'settings'>('home');
  const [logs, setLogs] = useState<CigaretteLog[]>([]);
  const [language, setLanguage] = useState<Language>('en');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isCraveModalOpen, setIsCraveModalOpen] = useState(false);
  
  const [userSettings, setUserSettings] = useState<UserSettings>({
    language: 'en',
    costPerPack: 10,
    packSize: 20,
    baselinePerDay: 15
  });

  // Calculate phase and progress automatically based on logs
  const { currentPhase, progress } = useMemo(() => {
    if (logs.length === 0) return { currentPhase: QuitPhase.BASELINE, progress: 0 };

    const startDate = Math.min(...logs.map(l => l.timestamp));
    const daysActive = Math.ceil((Date.now() - startDate) / (1000 * 60 * 60 * 24));
    const logsWithTriggers = logs.filter(l => l.trigger).length;

    // Last 3 days average
    const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
    const recentLogs = logs.filter(l => l.timestamp >= threeDaysAgo);
    const avgRecent = recentLogs.length / 3;

    // 1. BASELINE -> TRIGGER_ID
    if (daysActive < 3) {
      return { 
        currentPhase: QuitPhase.BASELINE, 
        progress: (daysActive / 3) * 100 
      };
    }

    // 2. TRIGGER_ID -> REDUCTION
    if (logsWithTriggers < 10) {
      return { 
        currentPhase: QuitPhase.TRIGGER_ID, 
        progress: (logsWithTriggers / 10) * 100 
      };
    }

    // 3. REDUCTION -> STABILIZE_4
    if (avgRecent > 4) {
      // Progress is how much we've reduced from baseline toward 4
      const reductionProgress = Math.max(0, Math.min(100, 
        ((userSettings.baselinePerDay - avgRecent) / (userSettings.baselinePerDay - 4)) * 100
      ));
      return { 
        currentPhase: QuitPhase.REDUCTION, 
        progress: reductionProgress 
      };
    }

    // 4. STABILIZE_4 -> FREEDOM
    const lastLogTime = Math.max(...logs.map(l => l.timestamp));
    const hoursSinceLast = (Date.now() - lastLogTime) / (1000 * 60 * 60);
    
    if (hoursSinceLast < 24) {
      return { 
        currentPhase: QuitPhase.STABILIZE_4, 
        progress: (hoursSinceLast / 24) * 100 
      };
    }

    return { currentPhase: QuitPhase.FREEDOM, progress: 100 };
  }, [logs, userSettings.baselinePerDay]);

  useEffect(() => {
    const savedLogs = localStorage.getItem('freedom_logs');
    const savedLang = localStorage.getItem('freedom_lang');
    const savedSettings = localStorage.getItem('freedom_settings');
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    if (savedLang) setLanguage(savedLang as Language);
    if (savedSettings) setUserSettings(JSON.parse(savedSettings));
  }, []);

  useEffect(() => {
    localStorage.setItem('freedom_logs', JSON.stringify(logs));
    localStorage.setItem('freedom_lang', language);
    localStorage.setItem('freedom_settings', JSON.stringify(userSettings));
  }, [logs, language, userSettings]);

  const handleLogCigarette = (trigger: string, context: string) => {
    if (navigator.vibrate) navigator.vibrate(100);
    const now = Date.now();
    const lastLog = logs.length > 0 ? logs[logs.length - 1] : null;
    const isDouble = lastLog ? (now - lastLog.timestamp < 30 * 60 * 1000) : false;

    const newLog: CigaretteLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: now,
      trigger,
      context,
      isDouble
    };

    setLogs(prev => [...prev, newLog]);
    setIsLogModalOpen(false);
  };

  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-indigo-100 pb-24">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <div className="w-3 h-3 border-2 border-white rounded-full" />
          </div>
          <h1 className="text-lg font-black tracking-tight text-gray-900 italic uppercase">{t.appTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => setActiveTab('settings')} className="p-2 bg-gray-50 rounded-full">
              <Settings className="w-4 h-4 text-gray-400" />
           </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-4">
        {activeTab === 'home' && (
          <Dashboard 
            logs={logs} 
            phase={currentPhase} 
            language={language}
            settings={userSettings}
            phaseProgress={progress}
            onLogClick={() => setIsLogModalOpen(true)}
            onCraveClick={() => setIsCraveModalOpen(true)}
          />
        )}
        {activeTab === 'insights' && <Insights logs={logs} phase={currentPhase} />}
        {activeTab === 'coach' && <ChatCoach logs={logs} phase={currentPhase} />}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold">{t.settings}</h2>
            
            <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-3 h-3" /> {t.language}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {(['en', 'ru', 'es'] as Language[]).map(l => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`py-3 rounded-2xl text-xs font-bold transition-all border ${
                      language === l ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-gray-50 border-gray-100 text-gray-500'
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Calculations</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Price per pack ({t.currency})</span>
                  <input 
                    type="number" 
                    value={userSettings.costPerPack} 
                    onChange={e => setUserSettings({...userSettings, costPerPack: +e.target.value})}
                    className="w-20 text-right bg-gray-50 border border-gray-100 p-2 rounded-xl text-sm font-bold"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Cigs per day (Start)</span>
                  <input 
                    type="number" 
                    value={userSettings.baselinePerDay} 
                    onChange={e => setUserSettings({...userSettings, baselinePerDay: +e.target.value})}
                    className="w-20 text-right bg-gray-50 border border-gray-100 p-2 rounded-xl text-sm font-bold"
                  />
                </div>
              </div>
            </section>

            <button 
              onClick={() => { if(confirm('Reset all?')) { setLogs([]); setActiveTab('home'); } }}
              className="w-full py-4 text-red-500 font-bold text-xs uppercase tracking-widest bg-red-50 rounded-2xl"
            >
              Reset Progress
            </button>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-gray-50 px-8 py-3 flex items-center justify-between z-50">
        <NavButton active={activeTab === 'home'} icon={<Home />} label="Track" onClick={() => setActiveTab('home')} />
        <NavButton active={activeTab === 'insights'} icon={<BarChart3 />} label="Analysis" onClick={() => setActiveTab('insights')} />
        <NavButton active={activeTab === 'coach'} icon={<MessageCircle />} label="Coach" onClick={() => setActiveTab('coach')} />
      </nav>

      {isLogModalOpen && (
        <LogModal 
          onClose={() => setIsLogModalOpen(false)} 
          onSave={handleLogCigarette}
          language={language}
        />
      )}
      {isCraveModalOpen && (
        <BreathingModal 
          onClose={() => setIsCraveModalOpen(false)} 
          translations={t}
        />
      )}
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-indigo-600 scale-110' : 'text-gray-300'}`}>
    {React.cloneElement(icon as React.ReactElement, { className: `w-6 h-6 ${active ? 'fill-indigo-50' : ''}` })}
    <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
  </button>
);

export default App;
