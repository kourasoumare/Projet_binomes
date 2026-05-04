import express from "express";
import { randomUUID } from "node:crypto";
import { ensureJsonFile, readJson, writeJson } from "./json-store.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const playersPath = new URL("../../data/correction/players.json", import.meta.url);
const enigmesPath = new URL("../../data/correction/enigmes.json", import.meta.url);
const attemptsPath = new URL("../../data/correction/attempts.json", import.meta.url);

const DEFAULT_ENIGMES = [
  {
    id: "e1",
    title: "Je parle sans bouche",
    statement: "Je parle sans bouche et j'entends sans oreilles. Qui suis-je ?",
    answer: "echo",
    xp: 20
  },
  {
    id: "e2",
    title: "Le secret",
    statement: "Plus j'ai de gardiens, moins je suis en sécurité. Qui suis-je ?",
    answer: "secret",
    xp: 40
  }
];

function normalize(text) {
  return String(text ?? "").trim().toLowerCase();
}

function toPublicEnigme(enigme) {
  const { answer, ...publicEnigme } = enigme;
  return publicEnigme;
}

async function initData() {
  await ensureJsonFile(playersPath, []);
  await ensureJsonFile(attemptsPath, []);
  await ensureJsonFile(enigmesPath, DEFAULT_ENIGMES);
}

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/players", async (req, res, next) => {
  try {
    const name = String(req.body?.name ?? "").trim();

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    const players = await readJson(playersPath, []);
    const player = {
      id: randomUUID(),
      name,
      xp: 0,
      solvedEnigmes: []
    };

    players.push(player);
    await writeJson(playersPath, players);

    return res.status(201).json(player);
  } catch (error) {
    return next(error);
  }
});

app.get("/enigmes", async (_req, res, next) => {
  try {
    const enigmes = await readJson(enigmesPath, DEFAULT_ENIGMES);
    return res.status(200).json(enigmes.map(toPublicEnigme));
  } catch (error) {
    return next(error);
  }
});

app.post("/enigmes/:id/answer", async (req, res, next) => {
  try {
    const enigmeId = req.params.id;
    const playerId = String(req.body?.playerId ?? "").trim();
    const proposedAnswer = String(req.body?.answer ?? "");

    if (!playerId || !proposedAnswer.trim()) {
      return res.status(400).json({ error: "playerId and answer are required" });
    }

    const [players, enigmes, attempts] = await Promise.all([
      readJson(playersPath, []),
      readJson(enigmesPath, DEFAULT_ENIGMES),
      readJson(attemptsPath, [])
    ]);

    const player = players.find((item) => item.id === playerId);
    if (!player) {
      return res.status(404).json({ error: "player not found" });
    }

    const enigme = enigmes.find((item) => item.id === enigmeId);
    if (!enigme) {
      return res.status(404).json({ error: "enigme not found" });
    }

    const correct = normalize(proposedAnswer) === normalize(enigme.answer);
    const alreadySolved = Array.isArray(player.solvedEnigmes)
      ? player.solvedEnigmes.includes(enigme.id)
      : false;

    let gainedXp = 0;

    if (correct && !alreadySolved) {
      gainedXp = Number(enigme.xp) || 0;
      player.xp = Number(player.xp || 0) + gainedXp;
      player.solvedEnigmes = Array.isArray(player.solvedEnigmes) ? player.solvedEnigmes : [];
      player.solvedEnigmes.push(enigme.id);
      await writeJson(playersPath, players);
    }

    attempts.push({
      id: randomUUID(),
      playerId,
      enigmeId,
      answer: proposedAnswer,
      correct,
      createdAt: new Date().toISOString()
    });
    await writeJson(attemptsPath, attempts);

    return res.status(200).json({
      correct,
      alreadySolved,
      gainedXp,
      totalXp: player.xp
    });
  } catch (error) {
    return next(error);
  }
});

app.get("/leaderboard", async (_req, res, next) => {
  try {
    const players = await readJson(playersPath, []);
    const leaderboard = [...players]
      .sort((a, b) => Number(b.xp || 0) - Number(a.xp || 0))
      .map((player, index) => ({
        rank: index + 1,
        id: player.id,
        name: player.name,
        xp: Number(player.xp || 0)
      }));

    return res.status(200).json(leaderboard);
  } catch (error) {
    return next(error);
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: "route not found" });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "internal server error" });
});

initData()
  .then(() => {
    app.listen(port, () => {
      console.log(`Campus Quest correction API listening on ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize data", error);
    process.exit(1);
  });
