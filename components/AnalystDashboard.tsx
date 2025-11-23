import React, { useState } from 'react';
import { EnrichedTweet, Sentiment, Urgency } from '../types';
import { askGeminiAboutData } from '../services/gemini';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Search, Bot, Send, FileText, Filter } from 'lucide-react';

interface AnalystDashboardProps {
  data: EnrichedTweet[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#EF4444'];

export const AnalystDashboard: React.FC<AnalystDashboardProps> = ({ data }) => {
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [filterText, setFilterText] = useState('');

  const totalTweets = data.length;
  const negativeTweets = data.filter(t => t.analysis?.sentiment === Sentiment.TRES_NEGATIF || t.analysis?.sentiment === Sentiment.NEGATIF).length;
  const criticalTweets = data.filter(t => t.analysis?.urgency === Urgency.CRITIQUE).length;
  const avgUrgency = (data.reduce((acc, curr) => acc + (curr.analysis?.urgency || 0), 0) / totalTweets).toFixed(1);

  const sentimentData = [
    { name: 'Très Négatif', value: data.filter(t => t.analysis?.sentiment === Sentiment.TRES_NEGATIF).length },
    { name: 'Négatif', value: data.filter(t => t.analysis?.sentiment === Sentiment.NEGATIF).length },
    { name: 'Neutre', value: data.filter(t => t.analysis?.sentiment === Sentiment.NEUTRE).length },
    { name: 'Positif', value: data.filter(t => t.analysis?.sentiment === Sentiment.POSITIF).length },
  ];

  const categoryCount: Record<string, number> = {};
  data.forEach(t => {
    const cat = t.analysis?.category || 'Autre';
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCount).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);

  const handleAskAi = async () => {
    if (!question.trim()) return;
    setIsAiLoading(true);
    setAiResponse(null);
    const answer = await askGeminiAboutData(data, question);
    setAiResponse(answer);
    setIsAiLoading(false);
  };

  const filteredData = data.filter(t =>
    t.content.toLowerCase().includes(filterText.toLowerCase()) ||
    t.handle.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="p-6 bg-dark-bg min-h-[calc(100vh-64px)] overflow-y-auto flex flex-col gap-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Dashboard Analyste</h1>
        <span className="text-slate-400 text-sm">{totalTweets} enregistrements chargés</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card-bg p-4 rounded-xl border border-slate-700">
          <div className="text-slate-400 text-sm">Volume Total</div>
          <div className="text-2xl font-bold text-white">{totalTweets}</div>
        </div>
        <div className="bg-card-bg p-4 rounded-xl border border-slate-700">
          <div className="text-slate-400 text-sm">Insatisfaction</div>
          <div className="text-2xl font-bold text-red-400">{Math.round((negativeTweets / totalTweets) * 100)}%</div>
        </div>
        <div className="bg-card-bg p-4 rounded-xl border border-slate-700">
          <div className="text-slate-400 text-sm">Tickets Critiques</div>
          <div className="text-2xl font-bold text-orange-400">{criticalTweets}</div>
        </div>
        <div className="bg-card-bg p-4 rounded-xl border border-slate-700">
          <div className="text-slate-400 text-sm">Urgence Moyenne</div>
          <div className="text-2xl font-bold text-blue-400">{avgUrgency}/5</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Charts */}
        <div className="bg-card-bg p-6 rounded-xl border border-slate-700 lg:col-span-2">
          <h3 className="text-white font-bold mb-4">Analyse de Sentiment & Catégories</h3>
          <div className="grid grid-cols-2 gap-4 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#334155', opacity: 0.2 }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#fff' }} />
                <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Chat */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-600 lg:col-span-1 flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-purple-300">
            <Bot size={24} />
            <h3 className="font-bold">Assistant IA (Data)</h3>
          </div>
          <div className="flex-1 bg-slate-950/50 rounded-lg p-4 mb-4 overflow-y-auto border border-slate-700 text-sm text-slate-300 min-h-[200px]">
            {isAiLoading ? (
              <div className="flex items-center gap-2 text-slate-500 animate-pulse">
                <Bot size={16} /> Analyse en cours...
              </div>
            ) : aiResponse ? (
              <div className="whitespace-pre-wrap">{aiResponse}</div>
            ) : (
              <p className="text-slate-500 italic">Posez une question sur le fichier CSV importé. <br />Ex: "Quels sont les 3 principaux motifs de résiliation ?"</p>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
              placeholder="Posez votre question..."
              className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleAskAi}
              disabled={isAiLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card-bg rounded-xl border border-slate-700 overflow-hidden flex-1">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="font-bold text-white flex items-center gap-2">
            <FileText size={18} /> Données Brutes
          </h3>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Filtrer les tweets..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-full pl-10 pr-4 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-400">
            <thead className="text-xs text-slate-300 uppercase bg-slate-800">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Auteur</th>
                <th className="px-6 py-3">Contenu</th>
                <th className="px-6 py-3">Catégorie</th>
                <th className="px-6 py-3">Sentiment</th>
                <th className="px-6 py-3">Urgence</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 20).map((tweet) => (
                <tr key={tweet.id} className="border-b border-slate-700 hover:bg-slate-800/50">
                  <td className="px-6 py-3 whitespace-nowrap">{tweet.timestamp}</td>
                  <td className="px-6 py-3 text-white font-medium">{tweet.handle}</td>
                  <td className="px-6 py-3 max-w-xs truncate" title={tweet.content}>{tweet.content}</td>
                  <td className="px-6 py-3">{tweet.analysis?.category || '-'}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${tweet.analysis?.sentiment === Sentiment.TRES_NEGATIF ? 'bg-red-900 text-red-200' : 'bg-slate-700'}`}>
                      {tweet.analysis?.sentiment || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">{tweet.analysis?.urgency || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length > 20 && (
            <div className="p-3 text-center text-xs text-slate-500 border-t border-slate-700">
              Affichage des 20 premiers résultats sur {filteredData.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
