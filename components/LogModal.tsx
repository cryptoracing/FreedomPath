
import React, { useState } from 'react';
import { TRIGGERS_TRANS, TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { X, Check, Plus } from 'lucide-react';

interface LogModalProps {
  onClose: () => void;
  onSave: (trigger: string, context: string) => void;
  language: Language;
  customTriggers: string[];
  onAddCustomTrigger: (name: string) => void;
}

export const LogModal: React.FC<LogModalProps> = ({ onClose, onSave, language, customTriggers, onAddCustomTrigger }) => {
  const [trigger, setTrigger] = useState('');
  const [context, setContext] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newTrigger, setNewTrigger] = useState('');

  const t = TRANSLATIONS[language];
  const defaultTriggers = TRIGGERS_TRANS[language] || [];
  const allTriggers = [...defaultTriggers, ...customTriggers];

  const handleAdd = () => {
    if (newTrigger.trim()) {
      onAddCustomTrigger(newTrigger.trim());
      setTrigger(newTrigger.trim());
      setNewTrigger('');
      setShowAdd(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{t.logCigarette}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-black text-gray-500 uppercase tracking-widest">{t.triggerQuestion}</label>
              {!showAdd && (
                <button onClick={() => setShowAdd(true)} className="text-purple-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:bg-purple-50 px-2 py-1 rounded-lg transition-all">
                  <Plus className="w-3 h-3" /> {t.addTrigger}
                </button>
              )}
            </div>

            {showAdd && (
              <div className="flex gap-2 mb-4 animate-in fade-in slide-in-from-top-2">
                <input 
                  autoFocus
                  type="text" 
                  value={newTrigger} 
                  onChange={e => setNewTrigger(e.target.value)}
                  placeholder="Название триггера..."
                  className="flex-1 bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button 
                  onClick={handleAdd}
                  className="bg-purple-600 text-white px-4 py-2 rounded-xl font-black text-xs uppercase"
                >
                  {t.saveTrigger}
                </button>
                <button onClick={() => setShowAdd(false)} className="p-3 text-gray-400 hover:text-red-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {allTriggers.map(tr => (
                <button
                  key={tr}
                  onClick={() => setTrigger(tr)}
                  className={`py-4 px-4 rounded-2xl text-xs font-black transition-all border ${
                    trigger === tr 
                    ? 'bg-purple-600 border-purple-600 text-white shadow-lg scale-[1.02]' 
                    : 'bg-white border-gray-100 text-gray-600 hover:border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  {tr}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-3">Детали (Опционально)</label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder={t.contextPlaceholder}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 text-base font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none h-28 placeholder:text-gray-300"
            />
          </div>

          <button
            onClick={() => onSave(trigger, context)}
            className={`w-full py-5 rounded-[1.5rem] font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase active:scale-95 ${
              trigger ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!trigger}
          >
            <Check className="w-6 h-6" /> {t.confirmLog}
          </button>
        </div>
      </div>
    </div>
  );
};
