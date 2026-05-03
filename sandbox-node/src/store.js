import { readFile, writeFile } from "node:fs/promises";

export async function loadJson(path) {
  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

export async function saveJson(path, data) {
  const pretty = JSON.stringify(data, null, 2);
  await writeFile(path, `${pretty}\n`, "utf8");
}
