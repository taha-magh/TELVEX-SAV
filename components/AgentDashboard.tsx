import React, { useState, useEffect } from 'react';
import { EnrichedTweet, Sentiment, Urgency } from '../types';
import { analyzeTweetWithGemini } from '../services/gemini';
import {
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Send,
  History,
  User,
  MapPin,
  Briefcase,
  Sparkles
} from 'lucide-react';

interface AgentDashboardProps {
  data: EnrichedTweet[];
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({ data }) => {
  const [tweets, setTweets] = useState<EnrichedTweet[]>(data);
  const [selectedTweetId, setSelectedTweetId] = useState<string | null>(data.length > 0 ? data[0].id : null);
  const [responseDraft, setResponseDraft] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const selectedTweet = tweets.find(t => t.id === selectedTweetId);

  useEffect(() => {
    if (data.length > 0 && tweets.length === 0) {
      setTweets(data);
      setSelectedTweetId(data[0].id);
    }
  }, [data]);

  useEffect(() => {
    if (selectedTweet?.analysis) {
      setResponseDraft(selectedTweet.analysis.suggestedResponse);
    } else {
      setResponseDraft('');
    }
  }, [selectedTweetId, tweets]);

  const handleEscalate = () => {
    if (!selectedTweet) return;
    alert(`Ticket ${selectedTweet.id} escaladé au N2.`);
    // In real app, update status
  };

  const handleSend = () => {
    if (!selectedTweet) return;
    setTweets(prev => prev.map(t => t.id === selectedTweet.id ? { ...t, status: 'processed' } : t));
    alert("Réponse envoyée !");
    // Select next pending
    const next = tweets.find(t => t.id !== selectedTweet.id && t.status === 'pending');
    if (next) setSelectedTweetId(next.id);
  };

  const handleLiveAnalysis = async () => {
    if (!selectedTweet) return;
    setIsAnalyzing(true);
    const newAnalysis = await analyzeTweetWithGemini(selectedTweet.content);
    if (newAnalysis) {
      setTweets(prev => prev.map(t => t.id === selectedTweet.id ? { ...t, analysis: newAnalysis } : t));
    }
    setIsAnalyzing(false);
  }

  const getUrgencyColor = (u: Urgency) => {
    if (u >= 5) return 'bg-free-red text-white border-free-red';
    if (u === 4) return 'bg-orange-600 text-white border-orange-600';
    if (u === 3) return 'bg-yellow-500 text-black border-yellow-500';
    return 'bg-slate-600 text-white border-slate-600';
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-dark-bg overflow-hidden">
      {/* LEFT: Queue List */}
      <div className="w-1/3 border-r border-slate-700 flex flex-col">
        <div className="p-4 bg-card-bg border-b border-slate-700 flex justify-between items-center">
          <h2 className="font-bold text-xl text-white">File d'attente</h2>
          <span className="bg-free-red text-white px-2 py-1 rounded-full text-xs font-bold">
            {tweets.filter(t => t.status === 'pending').length}
          </span>
        </div>
        <div className="overflow-y-auto flex-1">
          {tweets.filter(t => t.status === 'pending').sort((a, b) => (b.analysis?.urgency || 0) - (a.analysis?.urgency || 0)).map((tweet) => (
            <div
              key={tweet.id}
              onClick={() => setSelectedTweetId(tweet.id)}
              className={`p-4 border-b border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors ${selectedTweetId === tweet.id ? 'bg-slate-800 border-l-4 border-l-free-red' : ''}`}
            >
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center font-bold text-white">
                    {tweet.author[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-200">{tweet.handle}</p>
                    <p className="text-xs text-slate-400">{tweet.timestamp}</p>
                  </div>
                </div>
                {tweet.analysis && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold h-fit ${getUrgencyColor(tweet.analysis.urgency)}`}>
                    Score {Math.round((tweet.analysis.urgency / 5) * 100)}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-300 line-clamp-2 mb-2">{tweet.content}</p>
              <div className="flex gap-2">
                {tweet.isPro && <span className="text-[10px] bg-purple-900 text-purple-200 px-1.5 py-0.5 rounded border border-purple-700">PRO</span>}
                {tweet.analysis?.sentiment === Sentiment.TRES_NEGATIF && (
                  <span className="text-[10px] bg-red-900/50 text-red-200 px-1.5 py-0.5 rounded border border-red-900 flex items-center gap-1">
                    <AlertTriangle size={10} /> Colère
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Workspace */}
      {selectedTweet ? (
        <div className="w-2/3 flex flex-col bg-dark-bg">
          {/* Header Context */}
          <div className="p-6 border-b border-slate-700 bg-card-bg shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-free-red to-orange-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                  {selectedTweet.author[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {selectedTweet.handle}
                    {selectedTweet.isPro && <Briefcase size={16} className="text-purple-400" />}
                  </h2>
                  <div className="flex gap-4 text-sm text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><User size={12} /> Client {selectedTweet.clientSince || 'N/A'}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {selectedTweet.location || 'France'}</span>
                    <span className="flex items-center gap-1"><History size={12} /> {selectedTweet.historyIncidentCount || 0} incidents passés</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-3 py-1 rounded-full text-sm font-bold mb-1 flex items-center gap-2 ${getUrgencyColor(selectedTweet.analysis?.urgency || 1)}`}>
                  {selectedTweet.analysis?.urgency === Urgency.CRITIQUE ? <AlertTriangle size={16} /> : null}
                  URGENCE {selectedTweet.analysis?.urgency || 1}/5
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">{selectedTweet.analysis?.category}</span>
              </div>
            </div>

            <div className="mt-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700 relative">
              <p className="text-lg text-white italic">"{selectedTweet.content}"</p>
              {selectedTweet.analysis?.emojis && (
                <div className="absolute -bottom-3 -right-3 bg-card-bg px-2 py-1 rounded-full shadow border border-slate-700 text-lg">
                  {selectedTweet.analysis.emojis.join(' ')}
                </div>
              )}
            </div>
          </div>

          {/* AI Analysis & Response */}
          <div className="flex-1 p-6 overflow-y-auto">

            {/* Analysis Box */}
            <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-blue-300 font-bold flex items-center gap-2">
                  <Sparkles size={18} /> Analyse IA (Gemini)
                </h3>
                {/* Button to re-trigger actual Gemini API call */}
                <button
                  onClick={handleLiveAnalysis}
                  disabled={isAnalyzing}
                  className="text-xs bg-blue-900 hover:bg-blue-800 px-2 py-1 rounded text-blue-200 transition-colors"
                >
                  {isAnalyzing ? "Analyse en cours..." : "Rafraîchir l'analyse"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400 block text-xs uppercase">Sentiment</span>
                  <span className={`font-medium ${selectedTweet.analysis?.sentiment === Sentiment.TRES_NEGATIF ? 'text-red-400' : 'text-slate-200'}`}>
                    {selectedTweet.analysis?.sentiment}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs uppercase">Intention</span>
                  <span className="font-medium text-slate-200">{selectedTweet.analysis?.intent}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-xs uppercase">Synthèse</span>
                  <p className="text-slate-200">{selectedTweet.analysis?.summary}</p>
                </div>
              </div>
            </div>

            {/* Response Draft */}
            <div className="flex flex-col gap-2 h-full">
              <label className="text-sm font-bold text-slate-300 flex justify-between">
                <span>Proposition de réponse</span>
                <span className="text-xs font-normal text-slate-500">Modifiable avant envoi</span>
              </label>
              <textarea
                className="w-full h-40 bg-slate-800 border border-slate-600 rounded-lg p-4 text-slate-200 focus:ring-2 focus:ring-free-red focus:border-transparent resize-none"
                value={responseDraft}
                onChange={(e) => setResponseDraft(e.target.value)}
              />

              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleSend}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-900/20"
                >
                  <CheckCircle2 size={20} />
                  Valider & Envoyer
                </button>
                <button
                  onClick={handleEscalate}
                  className="px-6 bg-free-red hover:bg-free-red-dark text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <AlertTriangle size={20} />
                  Escalader N2
                </button>
                <button className="px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 py-3 rounded-lg font-bold transition-all">
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="w-2/3 flex items-center justify-center flex-col text-slate-500">
          <MessageCircle size={64} className="mb-4 opacity-20" />
          <p>Sélectionnez un tweet pour commencer le traitement</p>
        </div>
      )}
    </div>
  );
};
