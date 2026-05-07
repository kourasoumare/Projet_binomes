import { getDefis, createDefi, validerDefi } from "../services/defisService.js";

// récupère tous les défis sans la réponse
export const defisController = async (_req, res) => {
  try {
    const result = await getDefis();
    return res.status(result.status).json(result.body);
  } catch (_error) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

// crée un nouveau défi
export const createDefiController = async (req, res) => {
  try {
    const result = await createDefi(req.body ?? {});
    return res.status(result.status).json(result.body);
  } catch (_error) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

// valide la réponse d'un participant
export const validerDefiController = async (req, res) => {
  try {
    const result = await validerDefi(req.params.id, req.body ?? {});
    return res.status(result.status).json(result.body);
  } catch (_error) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
};