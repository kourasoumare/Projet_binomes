import crypto from "node:crypto";
import { readDefis, writeDefis, readParticipants, writeParticipants } from "./fileService.js";

// Recupere tous les défis sans la reponse en retournant une erreur s'il n'existe pas 
export const getDefis = async () => {
  const defis = await readDefis();

  if (!Array.isArray(defis) || defis.length === 0) {
    return { status: 404, body: { error: "Aucun défi trouvé" } };
  }

  // On cache la réponse avant d'envoyer
  const defisPublics = defis.map(({ reponse, ...defi }) => defi);
  return { status: 200, body: defisPublics };
};

// Crée un nouveau défi
export const createDefi = async ({ titre, question, reponse, difficulte, points }) => {
  const defis = await readDefis();

  // champs obligatoires 
  if (!titre || !question || !reponse || !difficulte || !points) {
    return { status: 400, body: { error: "titre, question, reponse, difficulte et points sont obligatoires" } };
  }

  // Création du nouveau défi
  const newDefi = {
    id: crypto.randomUUID(),
    titre,
    question,
    reponse,
    difficulte,
    points: Number(points),
    createdAt: new Date().toISOString()
  };

  defis.push(newDefi);
  await writeDefis(defis);

  return { status: 201, body: newDefi };
};

// Valide la réponse d'un participant à un défi
export const validerDefi = async (defiId, { participantId, reponse }) => {
  // Vérification des champs obligatoires
  const cleanParticipantId = String(participantId ?? "").trim();
  const cleanReponse = String(reponse ?? "").trim();

  if (!cleanParticipantId || !cleanReponse) {
    return { status: 400, body: { error: "l'id et la reponse sont obligatoires" } };
  }

  // On récupère les données en parallele
  const [defis, participants] = await Promise.all([
    readDefis(),
    readParticipants()
  ]);

  // On vérifie que le défi existe
  const defi = defis.find(d => String(d.id) === String(defiId));
  if (!defi) {
    return { status: 404, body: { error: "Défi introuvable" } };
  }

  // On vérifie que le participant existe
  const participant = participants.find(p => String(p.id) === cleanParticipantId);
  if (!participant) {
    return { status: 404, body: { error: "Participant introuvable" } };
  }

  // On compare les réponses en minuscules pour être flexible
  const correct = cleanReponse.toLowerCase() === String(defi.reponse).toLowerCase();

  let pointsGagnes = 0;

  // Si bonne réponse on ajoute les points
  if (correct) {
    pointsGagnes = Number(defi.points) || 0;
    participant.points = Number(participant.points || 0) + pointsGagnes;
    await writeParticipants(participants);
  }

  return {
    status: 200,
    body: {
      correct,
      pointsGagnés: pointsGagnes,
      totalPoints: Number(participant.points || 0)
    }
  };
};