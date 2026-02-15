
import React from 'react';
import { CigaretteLog, QuitPhase, Language, UserSettings } from '../types';
import { PHASE_METADATA, TRANSLATIONS } from '../constants';
import { Plus, Flame, TrendingDown, DollarSign, Wind, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  logs: CigaretteLog[];
  phase: QuitPhase;
  language: Language;
  settings: UserSettings;
  onLogClick: () => void;
  onCraveClick: () => void;
  phaseProgress: number; // 0 to 100
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  logs, phase, language, settings, onLogClick, onCraveClick, phaseProgress 
}) => {
  const t = TRANSLATIONS[language];
  const today = new Date().setHours(0, 0, 0, 0);
  const todayLogs = logs.filter(l => l.timestamp >= today);
  
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStart = new Date(d).setHours(0, 0, 0, 0);
    const dayEnd = new Date(d).setHours(23, 59, 59, 999);
    return {
      name: d.toLocaleDateString(language, { weekday: 'short' }),
      count: logs.filter(l => l.timestamp >= dayStart && l.timestamp <= dayEnd).length
    };
  });

  const startDate = logs.length > 0 ? Math.min(...logs.map(l => l.timestamp)) : Date.now();
  const daysActive = Math.ceil((Date.now() - startDate) / (1000 * 60 * 60 * 24)) || 1;
  const expectedCigs = daysActive * settings.baselinePerDay;
  const savedCigs = Math.max(0, expectedCigs - logs.length);
  const savedMoney = savedCigs * (settings.costPerPack / settings.packSize);

  const metadata = PHASE_METADATA[phase];

  return (
    <div className="space-y-6 pb-32">
      {/* Active Phase Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl bg-${metadata.color}-50 text-${metadata.color}-600`}>
              {metadata.icon}
            </div>
            <div>
              <h2 className="font-bold text-gray-900 leading-tight">{metadata.title[language]}</h2>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{t.quitPhase}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-gray-300">#{(Object.values(QuitPhase).indexOf(phase) + 1)}</div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 leading-relaxed">{metadata.description[language]}</p>

        {/* Phase Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{t.nextPhase}</span>
            <span className="text-xs font-bold text-gray-900">{Math.round(phaseProgress)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out" 
              style={{ width: `${phaseProgress}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 italic">
            {t.phaseConditions[phase]}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-3xl font-black text-gray-900">{todayLogs.length}</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{t.todayCount}</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4">
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-black text-gray-900">{t.currency}{savedMoney.toFixed(0)}</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{t.moneySaved}</div>
        </div>
      </div>

      {/* Graph */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">{t.weeklyTrend}</h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#6366f1" 
                strokeWidth={4} 
                dot={{ r: 0 }} 
                activeDot={{ r: 6, fill: '#6366f1' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 left-0 right-0 px-6 flex gap-4">
        <button 
          onClick={onCraveClick}
          className="flex-1 bg-white border border-gray-100 text-indigo-600 h-16 rounded-2xl shadow-xl flex items-center justify-center font-bold gap-2 active:scale-95 transition-all"
        >
          <Wind className="w-5 h-5" /> {t.craveButton}
        </button>
        <button 
          onClick={onLogClick}
          className="flex-[1.2] bg-indigo-600 text-white h-16 rounded-2xl shadow-xl flex items-center justify-center font-bold gap-2 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" /> {t.logCigarette}
        </button>
      </div>
    </div>
  );
};
