import React, { useState } from 'react';
import { Header } from './components/Header';
import { CommandsExplorer } from './components/CommandsExplorer';
import { CommandSimulator } from './components/CommandSimulator';
import { AllCommandsCatalog } from './components/AllCommandsCatalog';
import { CommandDetailModal } from './components/CommandDetailModal';
import { CommandItem, COMMANDS_DATA } from './data/commandsData';
import { ShieldCheck, Zap, AlertTriangle, Code2, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explorer' | 'simulator' | 'all'>('explorer');
  const [selectedCommand, setSelectedCommand] = useState<CommandItem | null>(null);
  const [simulatorCmd, setSimulatorCmd] = useState<string>('calc 25 * 4 + 15');

  const handleTestInSimulator = (cmdName: string) => {
    setSimulatorCmd(cmdName);
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* En-tête principal avec bouton export ZIP */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSimulator={() => setActiveTab('simulator')}
      />

      {/* Bannière de statistiques et santé du bot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 dark:text-white">80+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Commandes Totales</div>
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 dark:text-white">100%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bugs Critiques Corrigés</div>
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 dark:text-white">Anti-RCE</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sécurité Math & Eval</div>
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 dark:text-white">LID & MD</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Support Baileys v6/v7</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {activeTab === 'explorer' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Commandes Corrigées et Optimisées
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Consultez le diagnostic de panne, les améliorations appliquées et le code source prêt à l'emploi.
                </p>
              </div>
            </div>

            <CommandsExplorer
              onSelectCommand={(cmd) => setSelectedCommand(cmd)}
              onTestInSimulator={handleTestInSimulator}
            />
          </section>
        )}

        {activeTab === 'simulator' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Simulateur Interactif de Commandes WhatsApp
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Testez en conditions réelles les commandes corrigées avec gestion des rôles administrateurs, citations et médias.
              </p>
            </div>

            <CommandSimulator initialCommand={simulatorCmd} />
          </section>
        )}

        {activeTab === 'all' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Catalogue Intégral du Projet WhatsApp Bot
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inventaire complet de l'ensemble des modules, commandes et fonctionnalités indexées.
              </p>
            </div>

            <AllCommandsCatalog />
          </section>
        )}
      </main>

      {/* Modal d'inspection du code */}
      <CommandDetailModal
        command={selectedCommand}
        onClose={() => setSelectedCommand(null)}
        onTestInSimulator={handleTestInSimulator}
      />

      {/* Footer sobre */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 bg-white/50 dark:bg-slate-950 text-center text-xs text-slate-400">
        WhatsApp Bot Command Center • Code corrigé et prêt au déploiement pour Baileys
      </footer>
    </div>
  );
}
