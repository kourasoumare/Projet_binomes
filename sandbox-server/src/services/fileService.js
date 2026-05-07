import { readFile, writeFile } from "node:fs/promises";

import { playersPath, defisPath } from "../config/app.js";

export const readPlayers = async (encode = "utf-8") => {
    const data = await readFile(playersPath, encode);
    return JSON.parse(data);
};

// single responsability 
export const writePlayers = async (players, encode = "utf-8") => {
    await writeFile(playersPath, JSON.stringify(players, null, 2), encode);
};


//export const writeAttempts = async (attempts, encode = "utf-8") => {
   // await writeFile(attemptsPath, JSON.stringify(attempts, null, 2), encode);
//};

// Lit le fichier defis.json et retourne les données sous forme de tableau
export const readDefis = async (encode = "utf-8") => {
  const data = await readFile(defisPath, encode);
  return JSON.parse(data);
};
// Ecrit les données dans defis.json
export const writeDefis = async (defis, encode = "utf-8") => {
  await writeFile(defisPath, JSON.stringify(defis, null, 2), encode);
};