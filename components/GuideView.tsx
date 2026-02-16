
import React from 'react';
import { TRANSLATIONS, PHASE_METADATA } from '../constants';
import { QuitPhase } from '../types';

interface GuideViewProps {
  language: string;
}

export const GuideView: React.FC<GuideViewProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const phases = Object.values(QuitPhase);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-12">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-gray-900 uppercase">{t.guideTitle}</h2>
        <p className="text-gray-500 font-medium">{t.guideIntro}</p>
      </div>

      <div className="space-y-6">
        {phases.map((phase, idx) => {
          const meta = PHASE_METADATA[phase];
          return (
            <div key={phase} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl bg-${meta.color}-50 text-${meta.color}-600`}>
                  {meta.icon}
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Этап {idx + 1}</div>
                  <h3 className="text-xl font-bold text-gray-900">{meta.title[language]}</h3>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {meta.description[language]}
                </p>
                {t.guideSteps[idx] && (
                  <div className="p-4 bg-gray-50 rounded-2xl text-xs text-gray-500 leading-relaxed italic border-l-4 border-purple-200">
                    {t.guideSteps[idx].text}
                  </div>
                )}
                <div className="pt-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                  Условие перехода: {t.phaseConditions[phase]}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-purple-100">
        <h4 className="text-xl font-black mb-4 uppercase">Почему это работает?</h4>
        <p className="text-sm text-purple-100 leading-relaxed mb-6 font-medium">
          Большинство людей срываются, когда пытаются бросить "одним днем". Наш мозг сопротивляется резким переменам. 
          FreedomPath обманывает привычку, медленно снижая дозу и повышая вашу осознанность.
        </p>
        <div className="text-xs font-black uppercase tracking-widest opacity-80">
          Будьте честны с собой — это единственное правило.
        </div>
      </div>
    </div>
  );
};
