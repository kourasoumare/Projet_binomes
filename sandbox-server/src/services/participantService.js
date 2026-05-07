import { readParticipants, writeParticipants } from "./fileService.js";

export const createParticipants = async (name) => {
    const participants = await readParticipants();

    const already = participants.find(p => p.name === name);
    if (already) throw new Error("Ce participant existe déjà");

    const newParticipant = {
        id: participants.length + 1,
        name: name,
        score: 0
    };

    participants.push(newParticipant);
    await writeParticipants(participants);

    return newParticipant;
};

export const getClassement = async () => {
    const participants = await readParticipants();
    return participants.sort((a, b) => b.score - a.score);
};