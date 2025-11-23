import { EnrichedTweet, Sentiment, Urgency } from "../types";

// Simple CSV parser that handles basic CSV structures
export const parseCSV = (text: string): EnrichedTweet[] => {
  const lines = text.split('\n').filter(l => l.trim() !== '');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  const tweets: EnrichedTweet[] = [];

  // Find indices of interesting columns (adapt to the real CSV structure)
  // Assuming columns roughly match: id, created_at, full_text, user_screen_name, etc.
  const idxId = headers.findIndex(h => h.includes('id'));
  const idxText = headers.findIndex(h => h.includes('text'));
  const idxDate = headers.findIndex(h => h.includes('created') || h.includes('date'));
  const idxUser = headers.findIndex(h => h.includes('user') || h.includes('name') || h.includes('screen_name'));

  for (let i = 1; i < lines.length; i++) {
    // Basic split by comma, ideally use a robust library for production to handle commas in quotes
    // Quick hack for demo: split by "," if no quotes, else regex
    const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    
    if (row.length < headers.length) continue;

    const content = row[idxText]?.replace(/^"|"$/g, '') || "Contenu indisponible";
    
    // Simple mock logic to pre-fill analysis if LLM hasn't run yet
    // In a real app, we would run a batch job or leave analysis undefined
    const mockUrgency = Math.random() > 0.8 ? Urgency.CRITIQUE : Math.random() > 0.5 ? Urgency.MOYEN : Urgency.FAIBLE;
    const mockSentiment = mockUrgency >= 4 ? Sentiment.TRES_NEGATIF : Sentiment.NEUTRE;

    tweets.push({
      id: row[idxId]?.replace(/^"|"$/g, '') || `csv-${i}`,
      author: row[idxUser]?.replace(/^"|"$/g, '') || "Client",
      handle: `@${row[idxUser]?.replace(/^"|"$/g, '') || "client"}`,
      content: content,
      timestamp: row[idxDate]?.replace(/^"|"$/g, '') || "Récemment",
      isPro: Math.random() > 0.9,
      status: 'pending',
      // Pre-fill some analysis for visualization purposes immediately after upload
      analysis: {
        sentiment: mockSentiment,
        urgency: mockUrgency,
        category: content.toLowerCase().includes('box') ? 'Panne Technique' : 'Commercial',
        summary: content.substring(0, 30) + '...',
        suggestedResponse: "Bonjour, je prends en charge votre demande...",
        emojis: [],
        intent: "Information"
      }
    });
  }

  return tweets;
};
