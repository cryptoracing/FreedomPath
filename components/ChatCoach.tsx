
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { getCoachResponse } from '../services/geminiService';
import { CigaretteLog, QuitPhase, ChatMessage } from '../types';

interface ChatCoachProps {
  logs: CigaretteLog[];
  phase: QuitPhase;
}

export const ChatCoach: React.FC<ChatCoachProps> = ({ logs, phase }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Привет! Я твой персональный коуч FreedomPath. Я помогу тебе пройти этот путь к свободе от курения. Как твои успехи сегодня?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const aiResponse = await getCoachResponse([...messages, userMsg], { logs, phase });
      setMessages(prev => [...prev, { role: 'model', text: aiResponse, timestamp: Date.now() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Извини, возникли проблемы со связью. Давай попробуем еще раз через мгновение.", timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-210px)] bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100 shadow-inner">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[90%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${m.role === 'user' ? 'bg-purple-100' : 'bg-white'}`}>
                {m.role === 'user' ? <User className="w-5 h-5 text-purple-600" /> : <Bot className="w-5 h-5 text-purple-600" />}
              </div>
              <div className={`p-5 rounded-[1.5rem] text-base leading-relaxed font-bold shadow-sm ${
                m.role === 'user' 
                ? 'bg-purple-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2 items-center text-purple-600 text-xs font-black ml-12 uppercase tracking-widest">
              <Loader2 className="w-4 h-4 animate-spin" /> КОУЧ ПЕЧАТАЕТ...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Напишите сообщение..."
          className="flex-1 bg-gray-50 border-none rounded-2xl px-5 py-4 text-base font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="p-4 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 disabled:opacity-50 transition-all shadow-xl active:scale-95"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
