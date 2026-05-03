import { loadJson, saveJson } from "./store.js";

const PLAYERS_PATH = new URL("../data/players.json", import.meta.url);
const QUESTS_PATH = new URL("../data/quests.json", import.meta.url);

function normalizePseudo(pseudo) {
  return pseudo.trim().toLowerCase();
}

function levelFromXp(xp) {
  if (xp >= 80) return 4;
  if (xp >= 45) return 3;
  if (xp >= 20) return 2;
  return 1;
}

export async function listQuests() {
  return loadJson(QUESTS_PATH);
}

export async function createPlayer(pseudoInput) {
  const pseudo = normalizePseudo(pseudoInput || "");
  if (!pseudo) {
    throw new Error("Pseudo invalide : valeur vide.");
  }

  const players = await loadJson(PLAYERS_PATH);
  const existing = players.find((p) => normalizePseudo(p.pseudo) === pseudo);
  if (existing) {
    throw new Error(`Pseudo déjà utilisé : ${pseudoInput}`);
  }

  const id = `p-${Date.now().toString(36)}`;
  const player = {
    id,
    pseudo: pseudoInput.trim(),
    xp: 0,
    level: 1,
    activeQuests: [],
    completedQuests: []
  };

  players.push(player);
  await saveJson(PLAYERS_PATH, players);
  return player;
}

export async function acceptQuest(pseudoInput, questId) {
  const pseudo = normalizePseudo(pseudoInput || "");
  if (!pseudo || !questId) {
    throw new Error("Usage: add-quest <pseudo> <questId>");
  }

  const [players, quests] = await Promise.all([
    loadJson(PLAYERS_PATH),
    loadJson(QUESTS_PATH)
  ]);

  const player = players.find((p) => normalizePseudo(p.pseudo) === pseudo);
  if (!player) throw new Error(`Joueur introuvable : ${pseudoInput}`);

  const quest = quests.find((q) => q.id === questId);
  if (!quest) throw new Error(`Quête introuvable : ${questId}`);

  if (player.completedQuests.includes(questId)) {
    throw new Error(`Quête déjà terminée : ${questId}`);
  }

  if (player.activeQuests.includes(questId)) {
    throw new Error(`Quête déjà acceptée : ${questId}`);
  }

  player.activeQuests.push(questId);
  await saveJson(PLAYERS_PATH, players);
  return { player, quest };
}

export async function completeQuest(pseudoInput, questId) {
  const pseudo = normalizePseudo(pseudoInput || "");
  if (!pseudo || !questId) {
    throw new Error("Usage: complete-quest <pseudo> <questId>");
  }

  const [players, quests] = await Promise.all([
    loadJson(PLAYERS_PATH),
    loadJson(QUESTS_PATH)
  ]);

  const player = players.find((p) => normalizePseudo(p.pseudo) === pseudo);
  if (!player) throw new Error(`Joueur introuvable : ${pseudoInput}`);

  const quest = quests.find((q) => q.id === questId);
  if (!quest) throw new Error(`Quête introuvable : ${questId}`);

  if (!player.activeQuests.includes(questId)) {
    throw new Error(`Quête non active pour ce joueur : ${questId}`);
  }

  player.activeQuests = player.activeQuests.filter((id) => id !== questId);
  if (player.completedQuests.includes(questId)) {
    throw new Error(`Quête déjà validée : ${questId}`);
  }

  player.completedQuests.push(questId);
  player.xp += Number(quest.xp) || 0;
  player.level = levelFromXp(player.xp);

  await saveJson(PLAYERS_PATH, players);
  return { player, quest };
}

export async function showStats(pseudoInput) {
  const pseudo = normalizePseudo(pseudoInput || "");
  if (!pseudo) throw new Error("Usage: stats <pseudo>");

  const players = await loadJson(PLAYERS_PATH);
  const player = players.find((p) => normalizePseudo(p.pseudo) === pseudo);
  if (!player) throw new Error(`Joueur introuvable : ${pseudoInput}`);

  return player;
}

export async function leaderboard() {
  const players = await loadJson(PLAYERS_PATH);
  return players
    .slice()
    .sort((a, b) => b.xp - a.xp || a.pseudo.localeCompare(b.pseudo));
}

export async function resetPlayers() {
  await saveJson(PLAYERS_PATH, []);
}
