import { createParticipants, getClassement } from "../services/participantService.js";

export const createParticipantsController = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Le nom est obligatoire" });
        }

        const participant = await createParticipants(name);
        res.status(201).json(participant);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getClassementController = async (req, res) => {
    try {
        const ranking = await getClassement(); 
        res.status(200).json(ranking);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};