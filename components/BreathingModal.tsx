
import React, { useState, useEffect } from 'react';
import { X, Wind } from 'lucide-react';

interface BreathingModalProps {
  onClose: () => void;
  translations: any;
}

export const BreathingModal: React.FC<BreathingModalProps> = ({ onClose, translations }) => {
  const [seconds, setSeconds] = useState(60);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsFinished(true);
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
  }, [seconds]);

  return (
    <div className="fixed inset-0 bg-indigo-900/90 backdrop-blur-md z-[110] flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-sm text-center space-y-12">
        <div className="flex justify-between items-center">
          <Wind className="w-8 h-8 text-indigo-300 animate-pulse" />
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold">{isFinished ? translations.breathingFinished : translations.breathingTitle}</h2>
          <p className="text-indigo-200">{translations.breathingSub}</p>
        </div>

        <div className="relative flex items-center justify-center">
          <div className={`w-48 h-48 rounded-full border-4 border-indigo-400/30 flex items-center justify-center transition-all duration-1000 ${seconds % 8 < 4 ? 'scale-125 bg-indigo-500/20' : 'scale-100 bg-transparent'}`}>
            <span className="text-5xl font-mono font-bold">{seconds}s</span>
          </div>
        </div>

        {isFinished ? (
          <button
            onClick={onClose}
            className="w-full py-4 bg-white text-indigo-900 rounded-2xl font-bold text-lg"
          >
            {translations.finish}
          </button>
        ) : (
          <p className="text-sm opacity-60">Try to follow the expanding circle...</p>
        )}
      </div>
    </div>
  );
};
