import path from "node:path";
const ROOT = process.cwd(); // la racine du projet /app

const cleanEnv = (value, fallback) => {
  const text = String(value ?? "").trim();
  if (!text) return fallback;
  return text.replace(/^['"]|['"]$/g, "");
};

const dataDir = cleanEnv(process.env.NAME_DATA, "data");

export const participantsPath = path.join(ROOT, dataDir, "participants.json");
export const enigmesPath = path.join(ROOT, dataDir, "enigmes.json");
export const attemptsPath = path.join(ROOT, dataDir, "attempts.json");
