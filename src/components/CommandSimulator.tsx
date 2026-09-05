import React, { useState } from 'react';
import { Send, Check, CheckCheck, RefreshCw, Terminal, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { simulateCommandExecution, SimulationResult } from '../utils/commandSimulator';

interface CommandSimulatorProps {
  initialCommand?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  senderName: string;
  senderPhone: string;
  text: string;
  time: string;
  mediaType?: 'image' | 'video' | 'audio';
  status: 'sent' | 'received';
}

export const CommandSimulator: React.FC<CommandSimulatorProps> = ({ initialCommand = 'calc 25 * 4 + 15' }) => {
  const [inputText, setInputText] = useState(initialCommand ? `.${initialCommand}` : '.calc (100 - 15) / 5');
  const [isAdmin, setIsAdmin] = useState(true);
  const [isBotAdmin, setIsBotAdmin] = useState(true);
  const [isGroup, setIsGroup] = useState(true);
  const [quotedMode, setQuotedMode] = useState<'none' | 'view_once_image' | 'view_once_video' | 'text'>('none');
  const [lastResult, setLastResult] = useState<SimulationResult | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      senderName: 'Bot WhatsApp MD',
      senderPhone: '33712345678',
      text: '🤖 *Bot WhatsApp Connecté et Opérationnel* !\n\nPrêt à tester vos commandes corrigées. Essayez :\n• `.calc 25 * 4 + 10`\n• `.vv` (avec vue unique cochée)\n• `.tagall Annonce de groupe`\n• `.antilink on`\n• `.ai Qu\'est-ce que Baileys ?`\n• `.warn @33612345678 Spam`',
      time: '12:00',
      status: 'received'
    }
  ]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = Date.now().toString();

    // Ajout du message utilisateur
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      senderName: 'Moi (Testeur)',
      senderPhone: '33699887766',
      text: inputText,
      time: currentTime,
      status: 'sent'
    };

    setMessages((prev) => [...prev, newUserMsg]);

    // Analyse et exécution simulée
    const parts = inputText.trim().split(' ');
    const commandName = parts[0];
    const args = parts.slice(1);

    const result = simulateCommandExecution(commandName, args, {
      isAdmin,
      isBotAdmin,
      isGroup,
      hasQuoted: quotedMode !== 'none',
      quotedType: quotedMode !== 'none' ? quotedMode : undefined,
      senderNumber: '33699887766'
    });

    setLastResult(result);

    // Réponse du bot simulée
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        senderName: 'Bot WhatsApp MD',
        senderPhone: '33712345678',
        text: result.sentText || 'Commande exécutée.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mediaType: result.mediaType,
        status: 'received'
      };
      setMessages((prev) => [...prev, botMsg]);
    }, result.executionTimeMs || 100);

    setInputText('');
  };

  const quickPresets = [
    { label: '✨ .menu (Design Stylé)', cmd: '.menu', quoted: 'none' },
    { label: '📂 .menu media (Sous-menu)', cmd: '.menu media', quoted: 'none' },
    { label: '.calc (15 * 4) + 10', cmd: '.calc (15 * 4) + 10', quoted: 'none' },
    { label: '.vv (Vue Unique)', cmd: '.vv', quoted: 'view_once_image' },
    { label: '.tagall Réunion', cmd: '.tagall Réunion ce soir à 20h', quoted: 'none' },
    { label: '.kick @33612345678', cmd: '.kick @33612345678', quoted: 'none' },
    { label: '.antilink on', cmd: '.antilink on', quoted: 'none' },
    { label: '.warn @33700000000', cmd: '.warn @33700000000 Comportement incorrect', quoted: 'none' },
    { label: '.ai Que fait Baileys ?', cmd: '.ai Que fait la librairie Baileys ?', quoted: 'none' },
    { label: '.private (Self-mode)', cmd: '.private', quoted: 'none' },
    { label: '.public (Mode Libre)', cmd: '.public', quoted: 'none' },
    { label: '.ytmp4 <lien>', cmd: '.ytmp4 https://youtube.com/watch?v=dQw4w9WgXcQ', quoted: 'none' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Panneau de configuration du contexte (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
            <Terminal className="w-4 h-4 text-emerald-500" />
            Paramètres du Contexte WhatsApp
          </h3>

          <div className="space-y-3 text-xs">
            {/* Type de chat */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="font-medium text-slate-700 dark:text-slate-300">Contexte de discussion</span>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsGroup(true)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                    isGroup ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Groupe
                </button>
                <button
                  type="button"
                  onClick={() => setIsGroup(false)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                    !isGroup ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Privé (DM)
                </button>
              </div>
            </div>

            {/* Droits de l'utilisateur */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="font-medium text-slate-700 dark:text-slate-300">L'expéditeur est Admin</span>
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 dark:border-slate-700 focus:ring-emerald-500"
              />
            </div>

            {/* Droits du bot */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="font-medium text-slate-700 dark:text-slate-300">Le Bot est Admin du groupe</span>
              <input
                type="checkbox"
                checked={isBotAdmin}
                onChange={(e) => setIsBotAdmin(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 dark:border-slate-700 focus:ring-emerald-500"
              />
            </div>

            {/* Message cité (Quoted) */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
                Message cité en réponse (Quoted)
              </label>
              <select
                value={quotedMode}
                onChange={(e) => setQuotedMode(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
              >
                <option value="none">Aucun message cité</option>
                <option value="view_once_image">Photo à Vue Unique (View Once)</option>
                <option value="view_once_video">Vidéo à Vue Unique (View Once)</option>
                <option value="text">Message texte standard</option>
              </select>
            </div>
          </div>

          {/* Presets rapides */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Commandes d'essai rapides :
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputText(preset.cmd);
                    setQuotedMode(preset.quoted as any);
                  }}
                  className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 text-slate-700 dark:text-slate-300 text-[11px] font-mono transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Console de logs en temps réel */}
        {lastResult && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 font-mono text-[11px] shadow-sm">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 mb-2">
              <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                <Terminal className="w-3.5 h-3.5" />
                Journal d'Exécution
              </span>
              <span className="text-[10px] text-slate-500">{lastResult.executionTimeMs} ms</span>
            </div>
            <div className="space-y-1 text-slate-300">
              {lastResult.logs.map((log, i) => (
                <div key={i} className="leading-tight">
                  <span className="text-emerald-500 mr-1.5">›</span>
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interface Chat WhatsApp (8 cols) */}
      <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 shadow-lg overflow-hidden flex flex-col h-[650px]">
        
        {/* Barre supérieure WhatsApp */}
        <div className="bg-emerald-800 dark:bg-emerald-950 text-white p-3.5 flex items-center justify-between border-b border-emerald-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm text-white shadow-inner">
              🤖
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-sm tracking-tight leading-tight">
                  {isGroup ? 'Groupe WhatsApp Test' : 'Bot WhatsApp (Direct)'}
                </h4>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-700/60 text-emerald-200">
                  {isGroup ? 'Groupe' : 'Privé'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80">
                En ligne • Baileys MD Active
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMessages([])}
            className="p-1.5 rounded-lg hover:bg-emerald-700/50 text-emerald-200 transition-colors"
            title="Effacer le chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Zone des messages défilable */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
          {messages.map((msg) => {
            const isMe = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 shadow-sm text-sm ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-tl-none'
                  }`}
                >
                  {/* Nom de l'expéditeur */}
                  <div className="flex items-center justify-between gap-2 text-[11px] font-semibold mb-1 opacity-80">
                    <span>{msg.senderName}</span>
                    <span className="text-[10px] opacity-70">+{msg.senderPhone}</span>
                  </div>

                  {/* Média simulé */}
                  {msg.mediaType === 'image' && (
                    <div className="mb-2 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 aspect-video flex flex-col items-center justify-center text-slate-300">
                      <span className="text-3xl mb-1">🖼️</span>
                      <span className="text-xs font-medium">Image décryptée par .vv</span>
                    </div>
                  )}

                  {msg.mediaType === 'video' && (
                    <div className="mb-2 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 aspect-video flex flex-col items-center justify-center text-slate-300">
                      <span className="text-3xl mb-1">🎬</span>
                      <span className="text-xs font-medium">Vidéo MP4 décryptée</span>
                    </div>
                  )}

                  {/* Corps du message avec formatage WhatsApp basique */}
                  <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed">
                    {formatWhatsAppText(msg.text)}
                  </div>

                  {/* Heure et accusé de réception */}
                  <div className="flex items-center justify-end space-x-1 text-[10px] mt-1 opacity-70">
                    <span>{msg.time}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Indicateur Quoted actif */}
        {quotedMode !== 'none' && (
          <div className="px-4 py-1.5 bg-amber-50 dark:bg-amber-950/40 border-t border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Réponse simulée à : <strong>{quotedMode.replace(/_/g, ' ')}</strong>
            </span>
            <button
              onClick={() => setQuotedMode('none')}
              className="text-amber-700 dark:text-amber-400 font-bold hover:underline"
            >
              Retirer
            </button>
          </div>
        )}

        {/* Formulaire d'envoi */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Tapez une commande (ex: .calc 45 * 2, .tagall, .vv)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

// Formateur simple du balisage WhatsApp (*gras*, _italique_, `code`)
function formatWhatsAppText(text: string) {
  const parts = text.split('\n');
  return parts.map((line, lineIdx) => {
    // Remplacement basique pour affichage propre
    return (
      <span key={lineIdx}>
        {line}
        {lineIdx < parts.length - 1 && <br />}
      </span>
    );
  });
}
