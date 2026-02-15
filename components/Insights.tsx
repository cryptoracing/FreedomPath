
import React, { useEffect, useState } from 'react';
import { analyzeSmokingPatterns } from '../services/geminiService';
import { CigaretteLog, QuitPhase, TriggerAnalysis } from '../types';
import { Sparkles, AlertCircle, Lightbulb, RefreshCw } from 'lucide-react';

interface InsightsProps {
  logs: CigaretteLog[];
  phase: QuitPhase;
}

export const Insights: React.FC<InsightsProps> = ({ logs, phase }) => {
  const [analysis, setAnalysis] = useState<TriggerAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalysis = async () => {
    if (logs.length < 3) return;
    setLoading(true);
    try {
      const result = await analyzeSmokingPatterns(logs, phase);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (logs.length < 3) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
        <div className="bg-gray-100 p-6 rounded-full">
          <AlertCircle className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Not enough data yet</h3>
        <p className="text-gray-500 max-w-xs">Log at least 3 cigarettes to unlock AI-powered habit analysis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Habit Insights</h2>
        <button 
          onClick={fetchAnalysis}
          disabled={loading}
          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {loading && !analysis ? (
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-gray-200 rounded-2xl"></div>
          <div className="h-40 bg-gray-200 rounded-2xl"></div>
        </div>
      ) : analysis && (
        <>
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-purple-700 font-bold mb-4">
              <Sparkles className="w-5 h-5" /> Smart Summary
            </div>
            <p className="text-gray-700 leading-relaxed italic font-medium">"{analysis.advice}"</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" /> Top Triggers
              </h4>
              <div className="space-y-3">
                {analysis.topTriggers.map(t => (
                  <div key={t.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">{t.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-purple-500 h-full" 
                          style={{ width: `${Math.min(100, (t.count / logs.length) * 100)}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-900">{t.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" /> Suggested Action
              </h4>
              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm font-bold border border-yellow-100">
                {analysis.suggestedAction}
              </div>
            </div>
          </div>

          {analysis.doublesCount > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
              <h4 className="font-black text-red-700 mb-2">Watch out for 'Doubles'</h4>
              <p className="text-sm text-red-600 font-medium">
                You smoked {analysis.doublesCount} times within 30 minutes of a previous cigarette. 
                Our first goal in the Reduction phase will be breaking this chain.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
