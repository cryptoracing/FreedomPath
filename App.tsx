
import React, { useState, useEffect, useMemo } from 'react';
import { QuitPhase, CigaretteLog, Language, UserSettings } from './types';
import { Dashboard } from './components/Dashboard';
import { LogModal } from './components/LogModal';
import { BreathingModal } from './components/BreathingModal';
import { Insights } from './components/Insights';
import { ChatCoach } from './components/ChatCoach';
import { GuideView } from './components/GuideView';
import { TRANSLATIONS, CURRENCIES } from './constants';
// Added Brain to the imports from lucide-react to fix line 343 error
import { Home, BarChart3, MessageCircle, Settings, Globe, DollarSign, ChevronRight, ChevronLeft, Check, BookOpen, Star, Trash2, Brain } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'insights' | 'coach' | 'guide' | 'settings'>('home');
  const [logs, setLogs] = useState<CigaretteLog[]>([]);
  const [language, setLanguage] = useState<Language | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isCraveModalOpen, setIsCraveModalOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [resetStep, setResetStep] = useState(0); 
  
  const [userSettings, setUserSettings] = useState<UserSettings>({
    language: 'ru',
    currency: 'RUB',
    costPerPack: 200,
    packSize: 20,
    baselinePerDay: 0,
    customTriggers: []
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
    const onboardingComplete = localStorage.getItem('freedom_onboarding_v4');

    if (savedLogs) setLogs(JSON.parse(savedLogs));
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setUserSettings(prev => ({ ...prev, ...settings }));
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
      localStorage.removeItem('freedom_onboarding_v4');
      setIsOnboarding(true);
      setOnboardingStep(0);
    }
  };

  const handleAddCustomTrigger = (triggerName: string) => {
    if (!triggerName.trim()) return;
    setUserSettings(prev => ({
      ...prev,
      customTriggers: [...new Set([...prev.customTriggers, triggerName.trim()])]
    }));
  };

  const handleRemoveCustomTrigger = (triggerName: string) => {
    setUserSettings(prev => ({
      ...prev,
      customTriggers: prev.customTriggers.filter(t => t !== triggerName)
    }));
  };

  if (isOnboarding || !language) {
    const t = TRANSLATIONS['ru'];
    const guideSteps = t?.guideSteps || [];

    return (
      <div className="fixed inset-0 bg-white z-[300] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500 overflow-y-auto">
        <div className="max-w-md w-full min-h-full flex flex-col justify-between py-12">
          
          {/* Step 0: Language selection (MUST be first) */}
          {onboardingStep === 0 && (
            <div className="space-y-12 animate-in slide-in-from-bottom-8">
              <div className="space-y-4 text-center">
                <Globe className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-3xl font-black text-gray-900 leading-tight tracking-tighter uppercase">Выберите язык</h2>
              </div>
              <div className="space-y-4">
                <button 
                  onClick={() => { setLanguage('ru'); setOnboardingStep(1); }}
                  className="w-full py-6 bg-purple-600 text-white rounded-[2rem] font-black text-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center uppercase"
                >
                  Русский
                </button>
              </div>
            </div>
          )}

          {/* Step 1: New Intro Screen (Revolutionary Way) */}
          {onboardingStep === 1 && (
            <div className="space-y-12 animate-in slide-in-from-right-8">
              <div className="space-y-6">
                <div className="w-20 h-20 bg-purple-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-purple-200 mx-auto mb-8">
                  <Star className="text-white w-10 h-10 fill-white" />
                </div>
                <h1 className="text-4xl font-black text-center text-gray-900 leading-tight uppercase tracking-tighter">
                  {t.welcomeTitle}
                </h1>
                <p className="text-xl font-bold text-gray-400 text-center leading-snug">
                  {t.welcomeSubtitle}
                </p>
              </div>

              <div className="space-y-8">
                <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                  <p className="text-gray-700 font-semibold leading-relaxed text-lg italic">
                    {t.welcomeDescription}
                  </p>
                </div>
                
                <div className="text-center p-6 bg-purple-50 rounded-3xl">
                   <p className="text-purple-900 font-black text-lg italic leading-tight">
                    {t.welcomeQuote}
                   </p>
                </div>
              </div>

              <button 
                onClick={() => setOnboardingStep(2)}
                className="w-full py-6 bg-purple-600 text-white rounded-[2.5rem] font-black text-2xl transition-all shadow-xl shadow-purple-100 active:scale-95 flex items-center justify-center gap-2 uppercase"
              >
                ПРОДОЛЖИТЬ <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          )}

          {/* Step 2: Guide Intro */}
          {onboardingStep === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-gray-900 leading-tight uppercase tracking-tight">{t.guideTitle}</h2>
                <p className="text-gray-500 leading-relaxed text-xl font-bold">{t.guideIntro}</p>
              </div>
              <div className="h-48 bg-purple-50 rounded-[2.5rem] flex items-center justify-center p-8">
                 <p className="text-purple-800 font-black text-center text-xl italic leading-tight">
                   "FreedomPath — это не про запреты, а про контроль над собой."
                 </p>
              </div>
              <button onClick={() => setOnboardingStep(3)} className="w-full py-5 bg-purple-600 text-white rounded-[2rem] font-black text-2xl shadow-xl shadow-purple-200 flex items-center justify-center gap-2 active:scale-95 transition-all uppercase">
                ПОНЯТНО <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          )}

          {/* Steps 3-7: Phases */}
          {onboardingStep >= 3 && onboardingStep <= 7 && (
            <div className="space-y-12 animate-in slide-in-from-right-8">
               <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-lg">{onboardingStep - 2}</div>
                 <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-tight">{guideSteps[onboardingStep - 3]?.title}</h3>
               </div>
               <div className="space-y-8">
                 <p className="text-2xl text-gray-500 leading-relaxed font-bold">{guideSteps[onboardingStep - 3]?.text}</p>
                 <div className="h-56 bg-gray-50 rounded-[3rem] flex items-center justify-center border border-gray-100">
                    <div className="p-10 bg-white rounded-full shadow-2xl">
                      <Check className="w-16 h-16 text-purple-600" />
                    </div>
                 </div>
               </div>
               <div className="flex gap-4">
                 <button onClick={() => setOnboardingStep(prev => prev - 1)} className="flex-1 py-6 bg-gray-100 text-gray-700 rounded-[2rem] font-black text-xl flex items-center justify-center gap-2">
                   <ChevronLeft />
                 </button>
                 <button onClick={() => setOnboardingStep(prev => prev + 1)} className="flex-[2] py-6 bg-purple-600 text-white rounded-[2rem] font-black text-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all uppercase">
                   ДАЛЕЕ <ChevronRight />
                 </button>
               </div>
            </div>
          )}

          {/* Step 8: Final Setup (Fixing input colors) */}
          {onboardingStep === 8 && (
            <div className="space-y-12 animate-in slide-in-from-right-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-gray-900 leading-tight uppercase tracking-tight">Последний штрих</h2>
                <p className="text-gray-500 font-bold text-xl">Настройте параметры вашей привычки для точных расчетов.</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.currency}</label>
                  <div className="grid grid-cols-4 gap-3">
                    {CURRENCIES.slice(0, 8).map(c => (
                      <button 
                        key={c.code} 
                        onClick={() => setUserSettings({...userSettings, currency: c.code})} 
                        className={`py-4 rounded-2xl text-sm font-black transition-all border ${userSettings.currency === c.code ? 'bg-purple-600 border-purple-600 text-white shadow-xl scale-105' : 'bg-gray-50 border-gray-100 text-gray-700'}`}
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                   <div className="flex justify-between items-center bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                     <span className="font-black text-gray-700 text-lg">ЦЕНА ЗА ПАЧКУ</span>
                     <input type="number" value={userSettings.costPerPack} onChange={e => setUserSettings({...userSettings, costPerPack: +e.target.value})} className="w-32 text-right bg-transparent border-b-4 border-purple-200 p-1 text-2xl font-black focus:outline-none focus:border-purple-600 text-gray-900" />
                   </div>
                   <div className="flex justify-between items-center bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                     <span className="font-black text-gray-700 text-lg">ШТ. В ПАЧКЕ</span>
                     <input type="number" value={userSettings.packSize} onChange={e => setUserSettings({...userSettings, packSize: +e.target.value})} className="w-32 text-right bg-transparent border-b-4 border-purple-200 p-1 text-2xl font-black focus:outline-none focus:border-purple-600 text-gray-900" />
                   </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  localStorage.setItem('freedom_onboarding_v4', 'true');
                  setIsOnboarding(false);
                }} 
                className="w-full py-8 bg-purple-600 text-white rounded-[2.5rem] font-black text-3xl shadow-2xl shadow-purple-100 active:scale-95 transition-all uppercase"
              >
                НАЧАТЬ ПУТЬ
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
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
            <div className="w-3 h-3 border-2 border-white rounded-full" />
          </div>
          <h1 className="text-lg font-black tracking-tight text-gray-900 italic uppercase leading-none">{t.appTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => setActiveTab('settings')} className={`p-2 rounded-full transition-all ${activeTab === 'settings' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              <Settings className="w-5 h-5" />
           </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-6">
        {activeTab === 'home' && (
          <Dashboard logs={logs} phase={currentPhase} language={language} settings={{...userSettings, baselinePerDay: calculatedBaseline || userSettings.baselinePerDay}} phaseProgress={progress} onLogClick={() => setIsLogModalOpen(true)} onCraveClick={() => setIsCraveModalOpen(true)} />
        )}
        {activeTab === 'insights' && <Insights logs={logs} phase={currentPhase} />}
        {activeTab === 'coach' && <ChatCoach logs={logs} phase={currentPhase} />}
        {activeTab === 'guide' && <GuideView language={language} />}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-black uppercase tracking-tight">{t.settings}</h2>
            
            <section className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Brain className="w-3 h-3" /> Мои Триггеры
              </h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {userSettings.customTriggers.map(tr => (
                    <div key={tr} className="bg-purple-50 text-purple-700 px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-purple-100">
                      {tr}
                      <button onClick={() => handleRemoveCustomTrigger(tr)} className="hover:text-red-500">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    id="new-trigger-input"
                    placeholder="Напр.: Скука..." 
                    className="flex-1 bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById('new-trigger-input') as HTMLInputElement;
                      handleAddCustomTrigger(input.value);
                      input.value = '';
                    }}
                    className="bg-purple-600 text-white px-4 py-2 rounded-xl font-black text-sm uppercase shadow-md active:scale-95"
                  >
                    Добавить
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <DollarSign className="w-3 h-3" /> {t.currency}
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {CURRENCIES.slice(0, 8).map(c => (
                  <button key={c.code} onClick={() => setUserSettings({...userSettings, currency: c.code})} className={`py-3 rounded-xl text-xs font-black transition-all border ${userSettings.currency === c.code ? 'bg-purple-600 border-purple-600 text-white shadow-md' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                    {c.code}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Параметры</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-600">Цена за пачку</span>
                  <input type="number" value={userSettings.costPerPack} onChange={e => setUserSettings({...userSettings, costPerPack: +e.target.value})} className="w-24 text-right bg-gray-50 border border-gray-100 p-3 rounded-xl text-base font-black focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-600">Сигарет в пачке</span>
                  <input type="number" value={userSettings.packSize} onChange={e => setUserSettings({...userSettings, packSize: +e.target.value})} className="w-24 text-right bg-gray-50 border border-gray-100 p-3 rounded-xl text-base font-black focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
                </div>
                {calculatedBaseline > 0 && (
                  <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                    <span className="text-sm font-black text-purple-600 uppercase">Базовая норма</span>
                    <span className="text-lg font-black">{Math.round(calculatedBaseline)} сиг/день</span>
                  </div>
                )}
              </div>
            </section>

            <div className="space-y-3 pt-4">
              <button 
                onClick={handleReset}
                className={`w-full py-5 font-black text-sm uppercase tracking-widest rounded-[1.5rem] transition-all shadow-lg ${
                  resetStep === 0 ? 'bg-purple-600 text-white' : 
                  resetStep === 1 ? 'bg-red-500 text-white animate-pulse' : 
                  'bg-black text-white'
                }`}
              >
                {resetStep === 0 ? t.resetProgress : resetStep === 1 ? t.resetConfirm1 : t.resetConfirm2}
              </button>
              {resetStep > 0 && (
                <button onClick={() => setResetStep(0)} className="w-full py-3 text-xs font-black text-gray-500 uppercase">Отмена</button>
              )}
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-4 flex items-center justify-around z-50 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
        <NavButton active={activeTab === 'home'} icon={<Home />} label={t.nav.track} onClick={() => setActiveTab('home')} />
        <NavButton active={activeTab === 'insights'} icon={<BarChart3 />} label={t.nav.insights} onClick={() => setActiveTab('insights')} />
        <NavButton active={activeTab === 'coach'} icon={<MessageCircle />} label={t.nav.coach} onClick={() => setActiveTab('coach')} />
        <NavButton active={activeTab === 'guide'} icon={<BookOpen />} label={t.nav.guide} onClick={() => setActiveTab('guide')} />
      </nav>

      {isLogModalOpen && <LogModal onClose={() => setIsLogModalOpen(false)} onSave={handleLogCigarette} language={language} customTriggers={userSettings.customTriggers} onAddCustomTrigger={handleAddCustomTrigger} />}
      {isCraveModalOpen && <BreathingModal onClose={() => setIsCraveModalOpen(false)} translations={t} />}
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${active ? 'text-purple-600 scale-110' : 'text-gray-400'}`}>
    {React.cloneElement(icon as React.ReactElement<any>, { className: `w-6 h-6 ${active ? 'fill-purple-100' : ''}` })}
    <span className="text-[10px] font-black uppercase tracking-tight">{label}</span>
  </button>
);

export default App;
