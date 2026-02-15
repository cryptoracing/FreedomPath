
import React, { useState } from 'react';
import { TRIGGERS_TRANS, TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { X, Check } from 'lucide-react';

interface LogModalProps {
  onClose: () => void;
  onSave: (trigger: string, context: string) => void;
  language: Language;
}

export const LogModal: React.FC<LogModalProps> = ({ onClose, onSave, language }) => {
  const [trigger, setTrigger] = useState('');
  const [context, setContext] = useState('');
  const t = TRANSLATIONS[language];
  const triggers = TRIGGERS_TRANS[language];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">{t.logCigarette}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">{t.triggerQuestion}</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {triggers.map(tr => (
                <button
                  key={tr}
                  onClick={() => setTrigger(tr)}
                  className={`py-3 px-4 rounded-xl text-xs font-medium transition-all border ${
                    trigger === tr 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-200'
                  }`}
                >
                  {tr}
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder={t.contextPlaceholder}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none h-20"
            />
          </div>

          <button
            onClick={() => onSave(trigger, context)}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" /> {t.confirmLog}
          </button>
        </div>
      </div>
    </div>
  );
};
