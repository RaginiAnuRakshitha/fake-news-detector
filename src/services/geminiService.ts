/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, NewsStatus } from "../types";

const API_KEY = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

export const getGemini = () => {
  if (!ai && API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
};

export const analyzeNews = async (text: string): Promise<AnalysisResult> => {
  const genAI = getGemini();
  if (!genAI) {
    throw new Error("Gemini API key is not configured.");
  }

  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze the following news text for its authenticity. 
  Determine if it is "real", "fake", or "satire".
  Provide a confidence score (0-100), a brief explanation of why, and a list of any suspicious, inflammatory, or sensationalist words used, along with a brief reason why each word was flagged.
  
  News Text: "${text}"`;

  try {
    const response = await genAI.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              enum: ["real", "fake", "satire"],
              description: "The classification of the news content.",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence score from 0 to 100.",
            },
            explanation: {
              type: Type.STRING,
              description: "Brief reasoning for the classification.",
            },
            suspiciousWords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["word", "reason"]
              },
              description: "List of words that triggered red flags and the reasons why.",
            },
          },
          required: ["status", "confidence", "explanation", "suspiciousWords"],
        },
      },
    });

    const result = JSON.parse(response.text);
    return {
      ...result,
      checkedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze news content.");
  }
};
