
import React, { useState, useEffect, useMemo } from 'react';
import { QuitPhase, CigaretteLog, Language, UserSettings } from './types';
import { Dashboard } from './components/Dashboard';
import { LogModal } from './components/LogModal';
import { BreathingModal } from './components/BreathingModal';
import { Insights } from './components/Insights';
import { ChatCoach } from './components/ChatCoach';
import { TRANSLATIONS, CURRENCIES } from './constants';
import { Home, BarChart3, MessageCircle, Settings, Globe, Info, DollarSign, ChevronRight, ChevronLeft, Check } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'insights' | 'coach' | 'settings'>('home');
  const [logs, setLogs] = useState<CigaretteLog[]>([]);
  const [language, setLanguage] = useState<Language | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isCraveModalOpen, setIsCraveModalOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [resetStep, setResetStep] = useState(0); 
  
  const [userSettings, setUserSettings] = useState<UserSettings>({
    language: 'en',
    currency: 'USD',
    costPerPack: 10,
    packSize: 20,
    baselinePerDay: 0 
  });

  const { currentPhase, progress, calculatedBaseline } = useMemo(() => {
    if (logs.length === 0) return { currentPhase: QuitPhase.BASELINE, progress: 0, calculatedBaseline: 0 };
    
    const startDate = Math.min(...logs.map(l => l.timestamp));
    const now = Date.now();
    const daysSinceStart = (now - startDate) / (1000 * 60 * 60 * 24);
    
    const baselineLogs = logs.filter(l => l.timestamp <= startDate + (3 * 24 * 60 * 60 * 1000));
    const avgBaseline = daysSinceStart >= 3 ? baselineLogs.length / 3 : 0;

    const logsWithTriggers = logs.filter(l => l.trigger).length;
    const threeDaysAgo = now - (3 * 24 * 60 * 60 * 1000);
    const recentLogs = logs.filter(l => l.timestamp >= threeDaysAgo);
    const avgRecent = recentLogs.length / 3;

    if (daysSinceStart < 3) return { 
      currentPhase: QuitPhase.BASELINE, 
      progress: (daysSinceStart / 3) * 100,
      calculatedBaseline: 0 
    };

    if (logsWithTriggers < 10) return { 
      currentPhase: QuitPhase.TRIGGER_ID, 
      progress: (logsWithTriggers / 10) * 100,
      calculatedBaseline: avgBaseline
    };

    if (avgRecent > 4) {
      const base = avgBaseline || 15;
      const reductionProgress = Math.max(0, Math.min(100, ((base - avgRecent) / (base - 4)) * 100));
      return { 
        currentPhase: QuitPhase.REDUCTION, 
        progress: reductionProgress,
        calculatedBaseline: avgBaseline
      };
    }

    const lastLogTime = Math.max(...logs.map(l => l.timestamp));
    const hoursSinceLast = (now - lastLogTime) / (1000 * 60 * 60);
    
    if (hoursSinceLast < 24) return { 
      currentPhase: QuitPhase.STABILIZE_4, 
      progress: (hoursSinceLast / 24) * 100,
      calculatedBaseline: avgBaseline
    };

    return { 
      currentPhase: QuitPhase.FREEDOM, 
      progress: 100,
      calculatedBaseline: avgBaseline
    };
  }, [logs]);

  useEffect(() => {
    const savedLogs = localStorage.getItem('freedom_logs');
    const savedSettings = localStorage.getItem('freedom_settings');
    const onboardingComplete = localStorage.getItem('freedom_onboarding_v2');

    if (savedLogs) setLogs(JSON.parse(savedLogs));
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setUserSettings(settings);
      setLanguage(settings.language);
    }
    
    if (onboardingComplete) {
      setIsOnboarding(false);
    }
  }, []);

  useEffect(() => {
    if (language) {
      localStorage.setItem('freedom_logs', JSON.stringify(logs));
      localStorage.setItem('freedom_settings', JSON.stringify({
        ...userSettings,
        language,
        baselinePerDay: calculatedBaseline || userSettings.baselinePerDay
      }));
    }
  }, [logs, language, userSettings, calculatedBaseline]);

  const handleLogCigarette = (trigger: string, context: string) => {
    if (navigator.vibrate) navigator.vibrate(100);
    const now = Date.now();
    const lastLog = logs.length > 0 ? logs[logs.length - 1] : null;
    const isDouble = lastLog ? (now - lastLog.timestamp < 30 * 60 * 1000) : false;
    const newLog: CigaretteLog = { id: Math.random().toString(36).substr(2, 9), timestamp: now, trigger, context, isDouble };
    setLogs(prev => [...prev, newLog]);
    setIsLogModalOpen(false);
  };

  const handleReset = () => {
    if (resetStep < 2) {
      setResetStep(prev => prev + 1);
    } else {
      setLogs([]);
      setResetStep(0);
      setActiveTab('home');
      localStorage.removeItem('freedom_onboarding_v2');
      setIsOnboarding(true);
      setOnboardingStep(0);
    }
  };

  if (isOnboarding || !language) {
    const t = TRANSLATIONS[language || 'en'];
    const guideSteps = t?.guideSteps || [];

    return (
      <div className="fixed inset-0 bg-white z-[300] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
        <div className="max-w-md w-full h-full flex flex-col justify-between py-12">
          
          {onboardingStep === 0 && (
            <div className="space-y-12 animate-in slide-in-from-bottom-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-200 mx-auto mb-8">
                  <Globe className="text-white w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-center text-gray-900 leading-tight tracking-tighter">CHOOSE YOUR LANGUAGE</h2>
              </div>
              <div className="space-y-3">
                {(['en', 'ru', 'es'] as Language[]).map(l => (
                  <button 
                    key={l} 
                    onClick={() => { setLanguage(l); setOnboardingStep(1); }}
                    className="w-full py-5 bg-purple-600 text-white rounded-3xl font-black text-xl transition-all shadow-lg active:scale-95 flex items-center justify-center"
                  >
                    {l === 'en' ? 'ENGLISH' : l === 'ru' ? 'РУССКИЙ' : 'ESPAÑOL'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {onboardingStep === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-gray-900 leading-tight">{t.guideTitle}</h2>
                <p className="text-gray-500 leading-relaxed text-lg font-medium">{t.guideIntro}</p>
              </div>
              <div className="p-8 bg-purple-50 rounded-3xl">
                 <p className="text-purple-800 font-bold italic">"FreedomPath is about data, not guilt. We guide you to stop wanting to smoke."</p>
              </div>
              <button onClick={() => setOnboardingStep(2)} className="w-full py-5 bg-purple-600 text-white rounded-3xl font-black text-xl shadow-xl shadow-purple-200 flex items-center justify-center gap-2 active:scale-95 transition-all">
                NEXT <ChevronRight />
              </button>
            </div>
          )}

          {onboardingStep >= 2 && onboardingStep <= 6 && (
            <div className="space-y-12 animate-in slide-in-from-right-8">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-xl">{onboardingStep - 1}</div>
                 <h3 className="text-2xl font-black text-gray-900 uppercase">{guideSteps[onboardingStep - 2]?.title}</h3>
               </div>
               <div className="space-y-6">
                 <p className="text-xl text-gray-500 leading-relaxed font-medium">{guideSteps[onboardingStep - 2]?.text}</p>
                 <div className="h-48 bg-gray-50 rounded-3xl flex items-center justify-center">
                    <div className="p-8 bg-white rounded-full shadow-inner">
                      <Check className="w-12 h-12 text-purple-600" />
                    </div>
                 </div>
               </div>
               <div className="flex gap-4">
                 <button onClick={() => setOnboardingStep(prev => prev - 1)} className="flex-1 py-5 bg-gray-100 text-gray-700 rounded-3xl font-bold flex items-center justify-center gap-2">
                   <ChevronLeft />
                 </button>
                 <button onClick={() => setOnboardingStep(prev => prev + 1)} className="flex-[2] py-5 bg-purple-600 text-white rounded-3xl font-black text-xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                   CONTINUE <ChevronRight />
                 </button>
               </div>
            </div>
          )}

          {onboardingStep === 7 && (
            <div className="space-y-12 animate-in slide-in-from-right-8 overflow-y-auto">
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-gray-900 leading-tight">ONE LAST THING</h2>
                <p className="text-gray-500 font-medium">We'll help you track your savings. Set your local costs below.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.currency}</label>
                  <div className="grid grid-cols-4 gap-2">
                    {CURRENCIES.slice(0, 8).map(c => (
                      <button 
                        key={c.code} 
                        onClick={() => setUserSettings({...userSettings, currency: c.code})} 
                        className={`py-3 rounded-2xl text-xs font-black transition-all border ${userSettings.currency === c.code ? 'bg-purple-600 border-purple-600 text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-700'}`}
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                   <div className="flex justify-between items-center bg-gray-50 p-6 rounded-3xl">
                     <span className="font-bold text-gray-700">Cost per pack</span>
                     <input type="number" value={userSettings.costPerPack} onChange={e => setUserSettings({...userSettings, costPerPack: +e.target.value})} className="w-24 text-right bg-transparent border-b-2 border-purple-200 p-1 text-xl font-black focus:outline-none focus:border-purple-600" />
                   </div>
                   <div className="flex justify-between items-center bg-gray-50 p-6 rounded-3xl">
                     <span className="font-bold text-gray-700">Cigs per pack</span>
                     <input type="number" value={userSettings.packSize} onChange={e => setUserSettings({...userSettings, packSize: +e.target.value})} className="w-24 text-right bg-transparent border-b-2 border-purple-200 p-1 text-xl font-black focus:outline-none focus:border-purple-600" />
                   </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  localStorage.setItem('freedom_onboarding_v2', 'true');
                  setIsOnboarding(false);
                }} 
                className="w-full py-6 bg-purple-600 text-white rounded-3xl font-black text-xl shadow-2xl shadow-purple-200 active:scale-95 transition-all"
              >
                START YOUR JOURNEY
              </button>
            </div>
          )}

        </div>
      </div>
    );
  }

  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-purple-100 pb-24">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
            <div className="w-3 h-3 border-2 border-white rounded-full" />
          </div>
          <h1 className="text-lg font-black tracking-tight text-gray-900 italic uppercase">{t.appTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => { setIsOnboarding(true); setOnboardingStep(1); }} className="p-2 bg-purple-100 rounded-full">
              <Info className="w-4 h-4 text-purple-600" />
           </button>
           <button onClick={() => setActiveTab('settings')} className="p-2 bg-gray-100 rounded-full">
              <Settings className="w-4 h-4 text-gray-400" />
           </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-4">
        {activeTab === 'home' && (
          <Dashboard logs={logs} phase={currentPhase} language={language} settings={{...userSettings, baselinePerDay: calculatedBaseline || userSettings.baselinePerDay}} phaseProgress={progress} onLogClick={() => setIsLogModalOpen(true)} onCraveClick={() => setIsCraveModalOpen(true)} />
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
                  <button key={l} onClick={() => setLanguage(l)} className={`py-3 rounded-2xl text-xs font-bold transition-all border ${language === l ? 'bg-purple-600 border-purple-600 text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <DollarSign className="w-3 h-3" /> {t.currency}
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {CURRENCIES.slice(0, 8).map(c => (
                  <button key={c.code} onClick={() => setUserSettings({...userSettings, currency: c.code})} className={`py-2 rounded-xl text-xs font-bold transition-all border ${userSettings.currency === c.code ? 'bg-purple-600 border-purple-600 text-white shadow-md' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                    {c.code}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Calculations</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Price per pack</span>
                  <input type="number" value={userSettings.costPerPack} onChange={e => setUserSettings({...userSettings, costPerPack: +e.target.value})} className="w-20 text-right bg-gray-50 border border-gray-100 p-2 rounded-xl text-sm font-bold focus:outline-none focus:ring-1 focus:ring-purple-500" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Cigs per pack</span>
                  <input type="number" value={userSettings.packSize} onChange={e => setUserSettings({...userSettings, packSize: +e.target.value})} className="w-20 text-right bg-gray-50 border border-gray-100 p-2 rounded-xl text-sm font-bold focus:outline-none focus:ring-1 focus:ring-purple-500" />
                </div>
                {calculatedBaseline > 0 && (
                  <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                    <span className="text-sm font-bold text-purple-600">Calculated Baseline</span>
                    <span className="text-sm font-black">{Math.round(calculatedBaseline)} cigs/day</span>
                  </div>
                )}
              </div>
            </section>

            <div className="space-y-2">
              <button 
                onClick={handleReset}
                className={`w-full py-4 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md ${
                  resetStep === 0 ? 'bg-purple-600 text-white' : 
                  resetStep === 1 ? 'bg-red-500 text-white animate-pulse' : 
                  'bg-black text-white'
                }`}
              >
                {resetStep === 0 ? t.resetProgress : resetStep === 1 ? t.resetConfirm1 : t.resetConfirm2}
              </button>
              {resetStep > 0 && (
                <button onClick={() => setResetStep(0)} className="w-full py-2 text-xs font-bold text-gray-500 uppercase">Cancel</button>
              )}
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-gray-50 px-8 py-3 flex items-center justify-between z-50">
        <NavButton active={activeTab === 'home'} icon={<Home />} label="Track" onClick={() => setActiveTab('home')} />
        <NavButton active={activeTab === 'insights'} icon={<BarChart3 />} label="Analysis" onClick={() => setActiveTab('insights')} />
        <NavButton active={activeTab === 'coach'} icon={<MessageCircle />} label="Coach" onClick={() => setActiveTab('coach')} />
      </nav>

      {isLogModalOpen && <LogModal onClose={() => setIsLogModalOpen(false)} onSave={handleLogCigarette} language={language} />}
      {isCraveModalOpen && <BreathingModal onClose={() => setIsCraveModalOpen(false)} translations={t} />}
    </div>
  );
};

// Fixed NavButton by casting React.ReactNode icon to React.ReactElement<any> to allow dynamic className injection
const NavButton: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-purple-600 scale-110' : 'text-gray-400'}`}>
    {React.cloneElement(icon as React.ReactElement<any>, { className: `w-6 h-6 ${active ? 'fill-purple-100' : ''}` })}
    <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
  </button>
);

export default App;
