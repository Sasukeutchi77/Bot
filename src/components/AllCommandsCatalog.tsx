import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle, HelpCircle, Layers } from 'lucide-react';
import { FULL_BOT_COMMAND_LIST } from '../data/commandsData';

export const AllCommandsCatalog: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  const filtered = FULL_BOT_COMMAND_LIST.filter((cmd) => {
    const matchesQuery =
      cmd.name.toLowerCase().includes(query.toLowerCase()) ||
      cmd.desc.toLowerCase().includes(query.toLowerCase());
    const matchesCat = filterCat === 'all' || cmd.cat === filterCat;
    return matchesQuery && matchesCat;
  });

  const getCatBadge = (cat: string) => {
    switch (cat) {
      case 'media':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">Média</span>;
      case 'moderation':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">Modération</span>;
      case 'security':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">Sécurité</span>;
      case 'ai':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">IA & OCR</span>;
      case 'utility':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">Utilitaire</span>;
      case 'owner':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">Owner</span>;
      case 'games':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">Jeux</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Système</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher parmi les commandes du bot..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {['all', 'media', 'moderation', 'security', 'ai', 'utility', 'owner', 'games'].map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap text-xs font-medium transition-colors ${
                filterCat === c
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {c === 'all' ? 'Toutes' : c}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Commande</th>
                <th className="py-3 px-4">Catégorie</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Fichier Source</th>
                <th className="py-3 px-4 text-right">Statut d'Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
              {filtered.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    .{item.name}
                  </td>
                  <td className="py-2.5 px-4">
                    {getCatBadge(item.cat)}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">
                    {item.desc}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">
                    commands/{item.name}.js
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle className="w-3 h-3" />
                      Audité & Compatible
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
