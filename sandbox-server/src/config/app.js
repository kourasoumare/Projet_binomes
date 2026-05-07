import path from "node:path";
const ROOT = process.cwd(); // la racine du projet /app

const cleanEnv = (value, fallback) => {
  const text = String(value ?? "").trim();
  if (!text) return fallback;
  return text.replace(/^['"]|['"]$/g, "");
};

const dataDir = cleanEnv(process.env.NAME_DATA, "data");

//chemins
export const playersPath = path.join(ROOT, dataDir, "players.json");
export const defisPath = path.join(ROOT, dataDir, "defis.json");
export const participantsPath = path.join(ROOT, dataDir, "participants.json");
