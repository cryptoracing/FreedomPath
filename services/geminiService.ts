
import { GoogleGenAI, Type } from "@google/genai";
import { CigaretteLog, TriggerAnalysis, QuitPhase } from "../types";

// Initialize Gemini API client using the environment variable directly as required by guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSmokingPatterns = async (
  logs: CigaretteLog[],
  phase: QuitPhase
): Promise<TriggerAnalysis> => {
  const logSummary = logs.map(l => ({
    time: new Date(l.timestamp).toLocaleTimeString(),
    trigger: l.trigger,
    context: l.context,
    isDouble: l.isDouble
  }));

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these smoking logs for a user in the ${phase} phase of quitting. 
    Find the most common triggers and count instances of "double" cigarettes (smoked within 30 mins of each other).
    Logs: ${JSON.stringify(logSummary.slice(-30))}`,
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

  // Accessing text property directly as it is a getter, not a method
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
      systemInstruction: `You are FreedomPath Coach, an empathetic expert in smoking cessation. 
      The user is currently in the ${userContext.phase} phase.
      Current stats: ${userContext.logs.length} total logs.
      Focus on gradual reduction, harm reduction, and identifying psychological triggers.
      Encourage the user to reach the goal of 4 cigarettes/day before quitting entirely.
      Be supportive, never judgmental.`
    }
  });

  const lastMsg = history[history.length - 1];
  // sendMessage takes a message parameter as per the updated SDK
  const response = await chat.sendMessage({ message: lastMsg.text });
  // Accessing text property directly as it is a getter
  return response.text;
};
