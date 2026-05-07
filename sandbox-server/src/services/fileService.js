import { readFile, writeFile } from "node:fs/promises";
import { participantsPath } from "../config/app.js";
//Lecture du fichier participants.json
export const readParticipants = async (encode = "utf-8") => {
    const data = await readFile(participantsPath, encode);
    return JSON.parse(data);
};
//Ecriture du fichier participants.json
export const writeParticipants = async (players, encode = "utf-8") => {
    await writeFile(participantsPath, JSON.stringify(players, null, 2), encode);
};

export const readEnigmes = async (encode = "utf-8") => {
    const data = await readFile(enigmesPath, encode);
    return JSON.parse(data);
};

export const readAttempts = async (encode = "utf-8") => {
    try {
        const data = await readFile(attemptsPath, encode);
        return JSON.parse(data);
    } catch (error) {
        if (error.code === "ENOENT") {
            return [];
        }
        throw error;
    }
};

export const writeAttempts = async (attempts, encode = "utf-8") => {
    await writeFile(attemptsPath, JSON.stringify(attempts, null, 2), encode);
};
