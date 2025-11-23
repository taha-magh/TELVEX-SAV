import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { EnrichedTweet, Urgency, Sentiment } from '../types';
import { AlertTriangle, Users, Clock, TrendingUp, Activity } from 'lucide-react';

interface SupervisorDashboardProps {
  data: EnrichedTweet[];
}

const DATA_HOURLY = [
  { hour: '8h', volume: 120, negative: 10 },
  { hour: '10h', volume: 250, negative: 40 },
  { hour: '12h', volume: 180, negative: 20 },
  { hour: '14h', volume: 300, negative: 80 }, // Spike
  { hour: '16h', volume: 280, negative: 60 },
  { hour: '18h', volume: 200, negative: 30 },
];

const DATA_TOPICS = [
  { name: 'Panne Fibre', value: 45, color: '#EF4444' },
  { name: 'Facturation', value: 18, color: '#F59E0B' },
  { name: 'Mobile 4G/5G', value: 12, color: '#3B82F6' },
  { name: 'SAV Attente', value: 10, color: '#8B5CF6' },
  { name: 'Autres', value: 15, color: '#64748B' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({ data }) => {

  const totalTweets = data.length;
  const criticalTweets = data.filter(t => t.analysis?.urgency === Urgency.CRITIQUE).length;
  const negativeSentimentCount = data.filter(t => t.analysis?.sentiment === Sentiment.TRES_NEGATIF || t.analysis?.sentiment === Sentiment.NEGATIF).length;
  const negativeSentimentRate = totalTweets > 0 ? Math.round((negativeSentimentCount / totalTweets) * 100) : 0;

  return (
    <div className="p-6 bg-dark-bg min-h-[calc(100vh-64px)] overflow-y-auto">

      {/* Header & Crisis Alert */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Dashboard Superviseur SAV</h1>
          <p className="text-slate-400 text-sm">Vue d'ensemble de votre activité support • Temps réel</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-green-400 bg-green-900/30 px-3 py-1 rounded-full text-sm border border-green-800">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            En ligne
          </span>
          <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-2">
            <Users size={18} className="text-slate-400" />
            <span className="text-white font-bold">12</span>
            <span className="text-slate-500 text-sm">Agents actifs</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card-bg p-5 rounded-xl border border-slate-700 shadow-lg">
          <div className="text-slate-400 text-sm font-medium mb-2">Volume Total (24h)</div>
          <div className="text-3xl font-bold text-white">{totalTweets.toLocaleString()}</div>
          <div className="text-green-400 text-xs mt-1 flex items-center gap-1">
            <TrendingUp size={12} /> +12% vs J-7
          </div>
        </div>

        <div className={`bg-card-bg p-5 rounded-xl border ${criticalTweets > 10 ? 'border-red-500/50 bg-red-900/10' : 'border-slate-700'} shadow-lg relative overflow-hidden`}>
          {criticalTweets > 10 && <div className="absolute top-0 right-0 p-2"><div className="animate-ping w-3 h-3 bg-red-500 rounded-full"></div></div>}
          <div className="text-slate-400 text-sm font-medium mb-2">Tweets Priorité 5 (Attente)</div>
          <div className="text-3xl font-bold text-red-500">{criticalTweets}</div>
          <div className="text-red-400 text-xs mt-1 font-bold">
            {criticalTweets > 10 ? "Seuil de 10 dépassé !" : "Sous contrôle"}
          </div>
        </div>

        <div className="bg-card-bg p-5 rounded-xl border border-slate-700 shadow-lg">
          <div className="text-slate-400 text-sm font-medium mb-2">Temps Moyen Traitement</div>
          <div className="text-3xl font-bold text-blue-400">4.2 min</div>
          <div className="text-green-400 text-xs mt-1">
            -0.3 min vs Objectif
          </div>
        </div>

        <div className="bg-card-bg p-5 rounded-xl border border-slate-700 shadow-lg">
          <div className="text-slate-400 text-sm font-medium mb-2">Sentiment Négatif (Taux)</div>
          <div className="text-3xl font-bold text-orange-400">{negativeSentimentRate}%</div>
          <div className="text-orange-400 text-xs mt-1 flex items-center gap-1">
            <Activity size={12} /> Tendance à la hausse
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Chart: Topics */}
        <div className="bg-card-bg p-6 rounded-xl border border-slate-700 col-span-1">
          <h3 className="text-white font-bold mb-6">Top 5 Sujets Classifiés</h3>
          <div className="space-y-6">
            {DATA_TOPICS.map((topic, index) => (
              <div key={topic.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-200">{index + 1}. {topic.name}</span>
                  <span className="text-slate-400 font-mono">{topic.value}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full"
                    style={{ width: `${topic.value}%`, backgroundColor: topic.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-3 bg-slate-800 rounded border border-slate-600 text-xs text-green-400">
            <span className="font-bold">Thème Émergent :</span> "Problème Compatibilité Freebox Ultra" (2.5%)
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="bg-card-bg p-6 rounded-xl border border-slate-700 col-span-2">
          <h3 className="text-white font-bold mb-4">Volume & Sentiment (Dernières 12h)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA_HOURLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="hour" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#fff' }}
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                />
                <Bar dataKey="volume" name="Volume Total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="negative" name="Plaintes" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Team Performance Table */}
      <div className="mt-8 bg-card-bg rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-white font-bold">Performance Agents (Temps Réel)</h3>
          <button className="text-sm text-blue-400 hover:text-blue-300">Voir tout</button>
        </div>
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs text-slate-300 uppercase bg-slate-800">
            <tr>
              <th className="px-6 py-3">Agent</th>
              <th className="px-6 py-3">Tweets Traités</th>
              <th className="px-6 py-3">TMT (min)</th>
              <th className="px-6 py-3">Prio 5 Escaladés</th>
              <th className="px-6 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-700 hover:bg-slate-800/50">
              <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div> Sarah
              </td>
              <td className="px-6 py-4">132</td>
              <td className="px-6 py-4 text-green-400">3.1</td>
              <td className="px-6 py-4">1</td>
              <td className="px-6 py-4"><span className="bg-green-900/50 text-green-300 px-2 py-1 rounded text-xs">Actif</span></td>
            </tr>
            <tr className="border-b border-slate-700 hover:bg-slate-800/50">
              <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div> Lucas
              </td>
              <td className="px-6 py-4">110</td>
              <td className="px-6 py-4 text-yellow-400">4.0</td>
              <td className="px-6 py-4">3</td>
              <td className="px-6 py-4"><span className="bg-green-900/50 text-green-300 px-2 py-1 rounded text-xs">Actif</span></td>
            </tr>
            <tr className="border-b border-slate-700 hover:bg-slate-800/50">
              <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Yanis
              </td>
              <td className="px-6 py-4">98</td>
              <td className="px-6 py-4 text-red-400">4.9</td>
              <td className="px-6 py-4 text-red-400 font-bold">5</td>
              <td className="px-6 py-4"><span className="bg-yellow-900/50 text-yellow-300 px-2 py-1 rounded text-xs">Pause</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
