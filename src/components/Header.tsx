import React from 'react';
import { ShieldCheck, Download, AlertTriangle, Sparkles, Terminal } from 'lucide-react';
import { generateImprovedCommandsZip } from '../utils/zipExporter';

interface HeaderProps {
  onOpenSimulator: () => void;
  activeTab: 'explorer' | 'simulator' | 'all';
  setActiveTab: (tab: 'explorer' | 'simulator' | 'all') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSimulator,
  activeTab,
  setActiveTab
}) => {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      const blob = await generateImprovedCommandsZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'whatsapp-bot-md-complet.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur téléchargement ZIP:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          
          {/* Logo & Titre */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  WhatsApp Bot Command Center
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  v2.4 Fixes
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Studio d'analyse, correction et amélioration des commandes Baileys
              </p>
            </div>
          </div>

          {/* Onglets & Actions */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex space-x-1 border border-slate-200 dark:border-slate-700 text-sm">
              <button
                onClick={() => setActiveTab('explorer')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'explorer'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Commandes Corrigées
                </span>
              </button>

              <button
                onClick={() => setActiveTab('simulator')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'simulator'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  Simulateur WhatsApp
                </span>
              </button>

              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  Toutes les Commandes (126)
                </span>
              </button>
            </div>

            {/* Téléchargement ZIP */}
            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Génération du ZIP...' : 'Télécharger Projet ZIP Complet'}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
