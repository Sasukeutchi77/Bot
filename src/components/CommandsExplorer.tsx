import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, ShieldCheck, Sparkles, ChevronRight, Play, Eye } from 'lucide-react';
import { COMMANDS_DATA, CommandItem } from '../data/commandsData';

interface CommandsExplorerProps {
  onSelectCommand: (cmd: CommandItem) => void;
  onTestInSimulator: (cmdName: string) => void;
}

export const CommandsExplorer: React.FC<CommandsExplorerProps> = ({
  onSelectCommand,
  onTestInSimulator
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Toutes les Catégories' },
    { id: 'media', label: 'Multimédia & Download' },
    { id: 'moderation', label: 'Modération de Groupe' },
    { id: 'security', label: 'Sécurité & Anti-Abus' },
    { id: 'ai', label: 'Intelligence Artificielle' },
    { id: 'utility', label: 'Utilitaires & Système' },
    { id: 'owner', label: 'Propriétaire (Owner)' },
    { id: 'games', label: 'Jeux & Interactif' }
  ];

  const filteredCommands = COMMANDS_DATA.filter((cmd) => {
    const matchesSearch =
      cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.aliases.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase())) ||
      cmd.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || cmd.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        
        {/* Champ de recherche */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une commande (ex: vv, calc, tagall, kick, ai...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
          />
        </div>

        {/* Filtres de Statut */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedStatus === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Tous les états
          </button>
          <button
            onClick={() => setSelectedStatus('critical_fixed')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              selectedStatus === 'critical_fixed'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            Pannes Critiques Réparées
          </button>
          <button
            onClick={() => setSelectedStatus('secured')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              selectedStatus === 'secured'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-100'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            Sécurisé (Anti-Failles)
          </button>
          <button
            onClick={() => setSelectedStatus('improved')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              selectedStatus === 'improved'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-100'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            Amélioré Baileys MD
          </button>
        </div>
      </div>

      {/* Catégories tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grille des commandes corrigées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCommands.map((cmd) => (
          <div
            key={cmd.id}
            className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Entête de carte */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950 group-hover:text-emerald-600 transition-colors">
                    .{cmd.name}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm font-mono flex items-center gap-1.5">
                      {cmd.fileLocation}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Alias : {cmd.aliases.slice(0, 2).map((a) => `.${a}`).join(', ')}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-full whitespace-nowrap ${
                    cmd.status === 'critical_fixed'
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60'
                      : cmd.status === 'secured'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60'
                  }`}
                >
                  {cmd.statusLabel}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                {cmd.description}
              </p>

              {/* Diagnostic bref */}
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 mb-4">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                  Problème initial résolu :
                </span>
                <span className="line-clamp-2">{cmd.originalProblem}</span>
              </div>
            </div>

            {/* Actions de bas de carte */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                onClick={() => onSelectCommand(cmd)}
                className="inline-flex items-center space-x-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Voir le Code</span>
                <ChevronRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => onTestInSimulator(cmd.name)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 font-medium transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Tester</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCommands.length === 0 && (
        <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Aucune commande ne correspond à votre recherche.
          </p>
        </div>
      )}
    </div>
  );
};
