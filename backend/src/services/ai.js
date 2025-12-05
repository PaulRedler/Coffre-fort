const fetch = require("node-fetch");

async function analyzeWithAI(text) {
  const res = await fetch("http://localai:8080/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama2",
      messages: [
        { role: "system", content: "Tu es un assistant qui résume des documents et extrait les mots-clés." },
        { role: "user", content: `Analyse ce texte : ${text}` }
      ]
    })
  });

  const data = await res.json();

  return {
    summary: data.choices[0].message.content,
    keywords: ["keyword1", "keyword2"] // tu peux améliorer plus tard
  };
}

module.exports = { analyzeWithAI };
