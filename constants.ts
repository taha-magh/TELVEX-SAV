import { EnrichedTweet, Sentiment, Urgency } from "./types";

export const MOCK_DATA: EnrichedTweet[] = [
  {
    id: "1",
    author: "client_furieux",
    handle: "@client_furieux",
    content: "Plus d'Internet depuis 8 JOURS !!! INACCEPTABLE. 4 techniciens annulés, je télétravail c'est un SCANDALE @free 🤬🤬",
    timestamp: "il y a 3 min",
    clientSince: "6 ans",
    location: "Lyon 69003",
    isPro: true,
    status: 'pending',
    analysis: {
      sentiment: Sentiment.TRES_NEGATIF,
      urgency: Urgency.CRITIQUE,
      category: "Panne Technique",
      subCategory: "Fibre",
      summary: "Panne internet 8 jours, impact pro, techniciens annulés.",
      suggestedResponse: "Bonjour M. Alaoui, je comprends totalement votre exaspération après 8 jours sans Internet. En tant que client fidèle, vous méritez une intervention d'urgence. Je planifie un technicien prioritaire demain matin 8h-10h.",
      emojis: ["🤬", "🔴", "💼"],
      intent: "Réclamation"
    }
  },
  {
    id: "2",
    author: "mme_lili",
    handle: "@mme_lili",
    content: "Fibre HS depuis 5 jours, cabinet comptable à l'arrêt. Deadline fiscale jeudi. @free intervention URGENTE requise + compensation préjudice.",
    timestamp: "il y a 12 min",
    clientSince: "1 an",
    isPro: true,
    status: 'pending',
    analysis: {
      sentiment: Sentiment.TRES_NEGATIF,
      urgency: Urgency.CRITIQUE,
      category: "Panne Technique",
      subCategory: "Fibre Pro",
      summary: "Panne fibre Pro 5j, urgence comptable.",
      suggestedResponse: "Bonjour Madame, votre situation nécessite une intervention d'urgence absolue. J'alerte notre équipe technique PRO. Intervention garantie sous 4h.",
      emojis: ["📉", "💰", "⏳"],
      intent: "Urgence Technique"
    }
  },
  {
    id: "3",
    author: "thomas_martinli",
    handle: "@thomas_m",
    content: "Ma facture affiche 189€ au lieu de 39€ habituel. Dépassement hors-forfait 150€ sans alerte. @free Merci d'expliquer + geste commercial svp",
    timestamp: "il y a 28 min",
    clientSince: "2 ans",
    location: "Paris",
    status: 'pending',
    analysis: {
      sentiment: Sentiment.NEGATIF,
      urgency: Urgency.URGENT,
      category: "Facturation",
      subCategory: "Hors-forfait",
      summary: "Surfacturation 150€ inexpliquée.",
      suggestedResponse: "Bonjour Thomas, j'ai analysé votre facture. Le dépassement provient de data hors-forfait à l'étranger. Je peux vous proposer un avoir exceptionnel de 50€.",
      emojis: ["💶", "❓"],
      intent: "Contestation Facture"
    }
  },
  {
    id: "4",
    author: "lucas_gamer",
    handle: "@lucas_g",
    content: "La nouvelle Freebox Ultra est incroyable, débit de malade ! Merci @free 🚀",
    timestamp: "il y a 2h",
    status: 'processed',
    analysis: {
      sentiment: Sentiment.POSITIF,
      urgency: Urgency.INFORMATIF,
      category: "Commercial",
      subCategory: "Avis Produit",
      summary: "Client satisfait débit Freebox Ultra.",
      suggestedResponse: "Merci Lucas ! Ravi que la puissance de la Freebox Ultra vous plaise. Bon gaming ! 🚀",
      emojis: ["🚀", "😍"],
      intent: "Compliment"
    }
  },
  {
    id: "5",
    author: "sophie_t",
    handle: "@sophie_t",
    content: "Impossible de joindre le 3244, ça raccroche tout de suite...",
    timestamp: "il y a 45 min",
    status: 'pending',
    analysis: {
      sentiment: Sentiment.NEGATIF,
      urgency: Urgency.MOYEN,
      category: "SAV / Contact",
      subCategory: "Téléphone",
      summary: "Echec appel 3244.",
      suggestedResponse: "Bonjour Sophie, désolé pour la gêne. Vous pouvez me décrire votre souci ici en DM, je m'en occupe tout de suite.",
      emojis: ["📞", "❌"],
      intent: "Contact"
    }
  }
];