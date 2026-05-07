import { createParticipants, getClassement } from "../services/participantService.js";
//chef d'orchestre de la section participant
export const createParticipantsController = async (req, res) => {
//récupérer le nom dans le body en JSON
    try {
        const { name } = req.body;
//Obligation de mettre le nom 
        if (!name) {
            return res.status(400).json({ error: "Le nom est obligatoire" });
        }
//affichage de l'utilisateur crée
        const participant = await createParticipants(name);
        res.status(201).json(participant);
//affichage d'un mesage d'erreur en cas d'erreur 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
//chef d'orchestre de la section de classement 
export const getClassementController = async (req, res) => {
//affichage des utilisateurs classées
    try {
        const ranking = await getClassement(); 
        res.status(200).json(ranking);
//affichage d'un mesage d'erreur en cas d'erreur 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};