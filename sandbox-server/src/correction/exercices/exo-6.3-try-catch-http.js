import { readFile, writeFile } from "node:fs/promises";

const playersPath = new URL("../../../data/correction/players.json", import.meta.url);
const enigmesPath = new URL("../../../data/correction/enigmes.json", import.meta.url);
const attemptsPath = new URL("../../../data/correction/attempts.json", import.meta.url);

function normalize(text) {
  return String(text ?? "").trim().toLowerCase();
}

async function loadJson(pathUrl) {
  const raw = await readFile(pathUrl, "utf8");
  return JSON.parse(raw);
}

async function saveJson(pathUrl, value) {
  await writeFile(pathUrl, JSON.stringify(value, null, 2) + "\n", "utf8");
}

// Exo 6.3 - Route /enigmes/:id/answer avec gestion d'erreurs HTTP claire
export function registerExo63Routes(app) {
  app.post("/enigmes/:id/answer", async (req, res) => {
    try {
      const enigmeId = String(req.params.id || "").trim();
      const playerId = String(req.body?.playerId ?? "").trim();
      const answer = String(req.body?.answer ?? "");

      if (!playerId || !answer.trim()) {
        return res.status(400).json({ error: "playerId and answer are required" });
      }

      const [players, enigmes, attempts] = await Promise.all([
        loadJson(playersPath),
        loadJson(enigmesPath),
        loadJson(attemptsPath)
      ]);

      const player = players.find((p) => p.id === playerId);
      if (!player) {
        return res.status(404).json({ error: "player not found" });
      }

      const enigme = enigmes.find((e) => e.id === enigmeId);
      if (!enigme) {
        return res.status(404).json({ error: "enigme not found" });
      }

      const correct = normalize(answer) === normalize(enigme.answer);
      const solved = Array.isArray(player.solvedEnigmes) ? player.solvedEnigmes : [];
      const alreadySolved = solved.includes(enigmeId);

      let gainedXp = 0;
      if (correct && !alreadySolved) {
        gainedXp = Number(enigme.xp) || 0;
        player.xp = Number(player.xp || 0) + gainedXp;
        solved.push(enigmeId);
        player.solvedEnigmes = solved;
        await saveJson(playersPath, players);
      }

      attempts.push({
        playerId,
        enigmeId,
        answer,
        correct,
        at: new Date().toISOString()
      });
      await saveJson(attemptsPath, attempts);

      return res.status(200).json({
        correct,
        alreadySolved,
        gainedXp,
        totalXp: Number(player.xp || 0)
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "internal server error" });
    }
  });
}
