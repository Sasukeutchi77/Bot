export default {
  name: 'transcribe',
  category: 'tools',
  description: "Transcrit un message vocal audio en texte",
  async execute({ m, quoted }) {
    if (!quoted) return m.reply("❌ Répondez à une note vocale avec *.transcribe*.");
    await m.reply("🎙️ Transcription de l'audio en cours...");
  }
};
