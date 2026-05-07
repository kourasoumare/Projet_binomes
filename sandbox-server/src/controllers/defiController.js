import { answerEnigme, getEnigmes } from "../services/defiService.js";

// son role au controleur, c'est d'etre un chef d'orchreste == un role unique 
export const enigmesController = async (_req, res) => {
  try {
    
    const result =  await getEnigmes() // lever une exception 
    return res.status(result.status).json(result.body); 
  } catch (_error) {
    // erreur de type serveur qui peut être levée par la lecture du fichier (persistance )
    return res.status(500).json({ response: "Erreur serveur" });
  }
};

export const answerEnigmeController = async (req, res) => {
  try {
    const result = await answerEnigme(req.params.id, req.body ?? {});
    return res.status(result.status).json(result.body);
  } catch (_error) {
    return res.status(500).json({ response: "Erreur serveur" });
  }
};
