import { GoogleGenAI, Type } from "@google/genai";
import { Match, Attendee } from '../types';

// Wrapper for safe execution
const runAI = async <T,>(
  fn: (ai: GoogleGenAI) => Promise<T>,
  fallback: T
): Promise<T> => {
  if (!process.env.API_KEY) {
    console.warn("No API_KEY found. Using deterministic fallback.");
    return fallback;
  }
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await fn(ai);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return fallback;
  }
};

export const summarizeOutcome = async (notes: string): Promise<{ type: string; sentiment: string; nextStep: string }> => {
  return runAI(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these meeting notes and extract structured data.
      Notes: "${notes}"
      
      Return JSON with:
      - type: one of [Partnership, Investment, Hire, Pilot, Advisory, Other]
      - sentiment: [Positive, Neutral, Negative]
      - nextStep: A short actionable next step description.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            sentiment: { type: Type.STRING },
            nextStep: { type: Type.STRING },
          }
        }
      }
    });
    
    return JSON.parse(response.text || "{}");
  }, {
    type: "Other",
    sentiment: "Neutral",
    nextStep: "Follow up in 2 weeks"
  });
};

export const generateNudge = async (match: Match, source: Attendee, target: Attendee): Promise<string> => {
  return runAI(async (ai) => {
    const prompt = `Write a short, professional, but friendly WhatsApp-style follow-up message (under 40 words).
    Context:
    - Sender: ${source.name} (${source.company})
    - Recipient: ${target.name}
    - Current Status: ${match.status}
    - Last Note: ${match.notes || "Met at the event, good vibe."}
    
    Tone: Confident, low pressure.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "";
  }, `Hi ${target.name.split(' ')[0]}, great meeting you at the event! Would love to pick up our chat about ${target.company}. let me know when you're free?`);
};

export const getGraphInsights = async (nodeCount: number, edgeCount: number, topConnectors: string[]): Promise<{ summary: string, suggestions: string[] }> => {
  return runAI(async (ai) => {
    const prompt = `Analyze this network graph data for a B2B event.
    Nodes: ${nodeCount}, Edges: ${edgeCount}.
    Top Connectors: ${topConnectors.join(', ')}.
    
    Provide:
    1. A 1-sentence summary of the network density.
    2. 3 strategic suggestions for the organizer to improve connectivity.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    
    return JSON.parse(response.text || "{}");
  }, {
    summary: `The network shows strong clustering around ${topConnectors[0] || 'investors'}, indicating high engagement but potential silos.`,
    suggestions: [
      "Host a 'Founders & Funders' mixer to bridge the gap.",
      "Encourage hiring managers to reach out to operator nodes.",
      "Facilitate warm intros for isolated attendees."
    ]
  });
};
