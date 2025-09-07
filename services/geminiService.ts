
import { GoogleGenAI } from "@google/genai";
import type { Message } from '../types';
import { Sender } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `Jesteś przyjaznym i cierpliwym doradcą kariery o imieniu Asystent CV. Twoim zadaniem jest pomóc użytkownikowi – osobie bez dużego doświadczenia (np. uczeń, student, początkujący) – stworzyć krok po kroku pierwsze profesjonalne CV. Zawsze pisz po polsku, prostym i wspierającym językiem. Pytaj o jedną rzecz na raz. Bądź zwięzły i przyjazny. Jeśli użytkownik o coś pyta lub czegoś nie wie, podaj mu proste przykłady lub sugestie. Prowadź rozmowę krok po kroku zgodnie z instrukcjami, które otrzymasz.`;

const formatHistoryForPrompt = (history: Message[]) => {
  return history.map(msg => ({
    role: msg.sender === Sender.USER ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));
};

export const getNextStepResponse = async (history: Message[], nextStepInstruction: string): Promise<string> => {
  try {
    const formattedHistory = formatHistoryForPrompt(history);
    const fullPrompt = `Twoje następne zadanie: ${nextStepInstruction}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: fullPrompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Przepraszam, mam chwilowy problem z połączeniem. Spróbuj ponownie za chwilę.";
  }
};

export const generateFinalCV = async (history: Message[], finalInstruction: string): Promise<string> => {
  try {
    const formattedHistory = formatHistoryForPrompt(history);
    const fullPrompt = `Na podstawie całej naszej rozmowy, wykonaj to zadanie: ${finalInstruction}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: fullPrompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating final CV:", error);
    return "Wystąpił błąd podczas generowania CV. Proszę spróbować ponownie.";
  }
};
