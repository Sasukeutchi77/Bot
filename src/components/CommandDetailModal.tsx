import React, { useState } from 'react';
import { X, Copy, Check, FileCode, AlertOctagon, CheckCircle2, Play } from 'lucide-react';
import { CommandItem } from '../data/commandsData';

interface CommandDetailModalProps {
  command: CommandItem | null;
  onClose: () => void;
  onTestInSimulator: (cmdName: string) => void;
}

export const CommandDetailModal: React.FC<CommandDetailModalProps> = ({
  command,
  onClose,
  onTestInSimulator
}) => {
  const [copied, setCopied] = useState(false);

  if (!command) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(command.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-mono font-bold text-lg">
              .{command.name}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {command.fileLocation}
                </h3>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                  command.status === 'critical_fixed'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                    : command.status === 'secured'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                }`}>
                  {command.statusLabel}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Alias : {command.aliases.map(a => `.${a}`).join(', ')} • {command.description}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onTestInSimulator(command.name);
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors shadow-sm shadow-emerald-600/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Tester en Direct</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corps du modal */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Comparatif Problème vs Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
              <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-400 font-semibold text-xs uppercase tracking-wider mb-2">
                <AlertOctagon className="w-4 h-4" />
                <span>Diagnostic de Panne / Faille</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {command.originalProblem}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
              <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Correction & Amélioration</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {command.solutionApplied}
              </p>
            </div>
          </div>

          {/* Code Viewer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">
                <FileCode className="w-4 h-4 text-indigo-500" />
                <span>Code Source Corrigé ({command.fileLocation})</span>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-300 dark:border-slate-700"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier le Code</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
              <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-96 selection:bg-emerald-800/40 selection:text-white">
                <code>{command.code}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Prêt pour Baileys Multi-Device (MD) v6 / v7</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 font-medium transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
