export default {
  name: 'ai',
  aliases: ['gemini', 'gpt', 'ask', 'ia'],
  category: 'ai',
  description: 'Interroge l\'assistant IA avec contrôle de délai et gestion des pannes',

  async execute({ m, args }) {
    if (!args.length) {
      return m.reply(
        "💡 *Utilisation de la commande IA :*\n" +
        "Écrivez votre question après la commande.\n\n" +
        "📌 *Exemple :* `.ai Donne-moi une recette rapide avec des œufs et des tomates.`"
      );
    }

    const promptText = args.join(' ');
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return m.reply("❌ La clé d'API IA (GEMINI_API_KEY) n'est pas renseignée dans les variables d'environnement.");
    }

    await m.reply("💭 _L'assistant réfléchit..._");

    try {
      // Configuration d'un timeout strict à 20 secondes
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: promptText }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`Statut HTTP IA : ${response.status}`);
      }

      const json = await response.json();
      const generatedText = json.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        return m.reply("⚠️ L'IA n'a pas pu formuler de réponse pour cette demande.");
      }

      const formattedOutput =
        `🤖 *RÉPONSE DE L'ASSISTANT IA*\n\n` +
        `${generatedText.trim()}\n\n` +
        `_Posez une autre question avec .ai <votre question>_`;

      await m.reply(formattedOutput);

    } catch (err) {
      if (err.name === 'AbortError') {
        return m.reply("⏱️ Délai d'attente dépassé : l'IA a mis trop de temps à répondre. Veuillez réessayer.");
      }
      console.error("[AI Error]:", err);
      await m.reply("❌ Une erreur est survenue lors de la communication avec le service d'intelligence artificielle.");
    }
  }
};
