import { readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const playersPath = new URL("../../../data/correction/players.json", import.meta.url);

export async function loadPlayers() {
  const raw = await readFile(playersPath, "utf8");
  return JSON.parse(raw);
}

export async function savePlayers(players) {
  await writeFile(playersPath, JSON.stringify(players, null, 2) + "\n", "utf8");
}

// Exo 6.2 - Exemple d'utilisation dans des routes Express
export function registerExo62Routes(app) {
  app.post("/players", async (req, res, next) => {
    try {
      const name = String(req.body?.name ?? "").trim();
      if (!name) return res.status(400).json({ error: "name is required" });

      const players = await loadPlayers();
      const player = { id: randomUUID(), name, xp: 0, solvedEnigmes: [] };
      players.push(player);
      await savePlayers(players);

      return res.status(201).json(player);
    } catch (error) {
      return next(error);
    }
  });

  app.get("/leaderboard", async (_req, res, next) => {
    try {
      const players = await loadPlayers();
      const ranking = [...players].sort((a, b) => Number(b.xp || 0) - Number(a.xp || 0));
      return res.status(200).json(ranking);
    } catch (error) {
      return next(error);
    }
  });
}
