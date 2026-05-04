import { mkdir, readFile, writeFile } from "node:fs/promises";

export async function ensureJsonFile(pathUrl, fallbackValue) {
  try {
    await readFile(pathUrl, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await mkdir(new URL(".", pathUrl), { recursive: true });
    await writeJson(pathUrl, fallbackValue);
  }
}

export async function readJson(pathUrl, fallbackValue = []) {
  try {
    const raw = await readFile(pathUrl, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") return fallbackValue;
    throw error;
  }
}

export async function writeJson(pathUrl, value) {
  const payload = JSON.stringify(value, null, 2) + "\n";
  await writeFile(pathUrl, payload, "utf8");
}
