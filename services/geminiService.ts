
import { GoogleGenAI, Type } from "@google/genai";
import { CigaretteLog, TriggerAnalysis, QuitPhase } from "../types";

// Initialize Gemini API client using the environment variable directly as required by guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSmokingPatterns = async (
  logs: CigaretteLog[],
  phase: QuitPhase
): Promise<TriggerAnalysis> => {
  const logSummary = logs.map(l => ({
    time: new Date(l.timestamp).toLocaleTimeString('ru-RU'),
    trigger: l.trigger,
    context: l.context,
    isDouble: l.isDouble
  }));

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Проанализируй эти записи курения для пользователя на стадии "${phase}". 
    Найди самые частые триггеры и посчитай "двойные" сигареты (выкуренные в течение 30 минут).
    Записи: ${JSON.stringify(logSummary.slice(-30))}.
    ОТВЕЧАЙ СТРОГО НА РУССКОМ ЯЗЫКЕ.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topTriggers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                count: { type: Type.NUMBER }
              },
              required: ['name', 'count']
            }
          },
          doublesCount: { type: Type.NUMBER },
          advice: { type: Type.STRING },
          suggestedAction: { type: Type.STRING }
        },
        required: ['topTriggers', 'doublesCount', 'advice', 'suggestedAction']
      }
    }
  });

  const text = response.text || '{}';
  return JSON.parse(text);
};

export const getCoachResponse = async (
  history: { role: 'user' | 'model'; text: string }[],
  userContext: { logs: CigaretteLog[]; phase: QuitPhase }
) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `Ты — FreedomPath Coach, эмпатичный эксперт по отказу от курения. 
      Пользователь сейчас на стадии ${userContext.phase}.
      Всего записей: ${userContext.logs.length}.
      Фокусируйся на постепенном снижении вреда и выявлении психологических триггеров.
      Твоя цель — помочь пользователю дойти до 4 сигарет в день, а потом бросить совсем.
      ОТВЕЧАЙ СТРОГО НА РУССКОМ ЯЗЫКЕ. Будь поддерживающим, не осуждай.`
    }
  });

  const lastMsg = history[history.length - 1];
  const response = await chat.sendMessage({ message: lastMsg.text });
  return response.text;
};
