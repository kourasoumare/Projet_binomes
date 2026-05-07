import crypto from "node:crypto";
import {
  readAttempts,
  readEnigmes,
  readPlayers,
  writeAttempts,
  writePlayers
} from "./fileService.js";

// single responsability récupération des enigmes
export const getEnigmes = async () => {
  const enigmes = await readEnigmes();

  if (!Array.isArray(enigmes) || enigmes.length === 0) {
    return { status: 404, body: { error: "enigmes not found" } };
  }

  const enigmesWithoutAnswer = enigmes.map(({ answer, ...enigme }) => enigme);
  return { status: 200, body: enigmesWithoutAnswer };
};

const normalize = (value) => String(value ?? "").trim().toLowerCase();

export const answerEnigme = async (enigmeId, { playerId, answer }) => {
  const cleanPlayerId = String(playerId ?? "").trim();
  const cleanAnswer = String(answer ?? "").trim();

  if (!cleanPlayerId || !cleanAnswer) {
    return { status: 400, body: { error: "playerId and answer are required" } };
  }

  // plus performants que await dans le cas où l'on doit récupérer des données non dépendantes les unes des autres, sinon faire un await classique déjà vu 
  const [players, enigmes, attempts] = await Promise.all([
    readPlayers(),
    readEnigmes(),
    readAttempts()
  ]);

  const player = players.find((item) => String(item.id) === cleanPlayerId);
  if (!player) {
    return { status: 404, body: { error: "player not found" } };
  }

  const enigme = enigmes.find((item) => String(item.id) === String(enigmeId));
  if (!enigme) {
    return { status: 404, body: { error: "enigme not found" } };
  }

  const correct = normalize(cleanAnswer) === normalize(enigme.answer);
  const solvedEnigmes = Array.isArray(player.solvedEnigmes) ? player.solvedEnigmes : [];
  const alreadySolved = solvedEnigmes.includes(enigme.id);

  let gainedXp = 0;

  if (correct && !alreadySolved) {
    gainedXp = Number(enigme.xp) || 0;
    player.xp = Number(player.xp || 0) + gainedXp;
    solvedEnigmes.push(enigme.id);
    player.solvedEnigmes = solvedEnigmes;
    await writePlayers(players);
  }

  attempts.push({
    id: crypto.randomUUID(),
    playerId: cleanPlayerId,
    enigmeId: enigme.id,
    answer: cleanAnswer,
    correct,
    createdAt: new Date().toISOString()
  });
  await writeAttempts(attempts);

  return {
    status: 200,
    body: {
      correct,
      alreadySolved,
      gainedXp,
      totalXp: Number(player.xp || 0)
    }
  };
};

