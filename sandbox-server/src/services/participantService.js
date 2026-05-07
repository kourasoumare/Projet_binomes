import { readParticipants, writeParticipants } from "./fileService.js";
//logique métier de la création d'un participant
export const createParticipants = async (name) => {
//chargement de la lecture du fichier
    const participants = await readParticipants();
//vérification de l'existance d'un participant
    const already = participants.find(p => p.name === name);
    if (already) throw new Error("Ce participant existe déjà");
//création du nouveau participant
    const newParticipant = {
        id: participants.length + 1,
        name: name,
        score: 0
    };
//pousser le nouveau participant dans la base de donnée
    participants.push(newParticipant);
//chargement de l'écriture du fichier
    await writeParticipants(participants);
//retour du nouveau participant
    return newParticipant;
};
//logique métier de la formation du classement
export const getClassement = async () => {
//chargement de la lecture des participants
    const participants = await readParticipants();
//retour du classement dans l'odre décroissant avec .sort() qui permet de trier le tableau
    return participants.sort((a, b) => b.score - a.score);
};