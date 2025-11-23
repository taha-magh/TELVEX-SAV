import { GoogleGenAI, Type } from "@google/genai";
import { LLMAnalysis, Sentiment, Urgency, EnrichedTweet } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeTweetWithGemini = async (tweetContent: string): Promise<LLMAnalysis | null> => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found. Returning mock analysis for demo.");
    return null;
  }

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Analyse le tweet suivant destiné au service client d'un opérateur télécom (Free).
      Tweet: "${tweetContent}"
      
      Retourne un JSON avec les champs suivants :
      - sentiment: "Tres Négatif", "Négatif", "Neutre", "Positif"
      - urgency: un entier de 1 (faible) à 5 (critique)
      - category: "Panne Technique", "Facturation", "Commercial", "Information", "Autre"
      - subCategory: Précision (ex: Fibre, Mobile, Box)
      - summary: Un résumé très court (max 10 mots) du problème.
      - suggestedResponse: Une réponse empathique et professionnelle prête à l'emploi.
      - intent: "Réclamation", "Information", "Résiliation", "Technique"
      - emojis: Une liste d'emojis pertinents détectés ou suggérés pour l'interface.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING },
            urgency: { type: Type.INTEGER },
            category: { type: Type.STRING },
            subCategory: { type: Type.STRING },
            summary: { type: Type.STRING },
            suggestedResponse: { type: Type.STRING },
            intent: { type: Type.STRING },
            emojis: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);

    return {
      sentiment: data.sentiment as Sentiment,
      urgency: data.urgency as Urgency,
      category: data.category,
      subCategory: data.subCategory,
      summary: data.summary,
      suggestedResponse: data.suggestedResponse,
      emojis: data.emojis || [],
      intent: data.intent
    };

  } catch (error) {
    console.error("AI Analysis Failed:", error);
    return null;
  }
};

export const askGeminiAboutData = async (data: EnrichedTweet[], question: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Mode démo : Veuillez configurer une clé API pour analyser le dataset complet.";
  }

  try {

    const dataContext = JSON.stringify(data.slice(0, 500).map(t => ({
      date: t.timestamp,
      content: t.content,
      category: t.analysis?.category,
      sentiment: t.analysis?.sentiment,
      urgency: t.analysis?.urgency
    })));

    const prompt = `
      Tu es un analyste de données expert pour un opérateur télécom.
      Voici un échantillon des données tweets SAV (format JSON) :
      ${dataContext}

      Question de l'analyste : "${question}"

      Réponds de manière synthétique, professionnelle et basée sur les données fournies. 
      Utilise du markdown pour la mise en forme (listes, gras).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Désolé, je n'ai pas pu analyser les données.";

  } catch (error) {
    console.error("AI Data Chat Failed:", error);
    return "Erreur lors de l'analyse des données. Veuillez vérifier votre clé API.";
  }
};
