import express from "express";

// Import des controllers participants (Mahamane)
import { createParticipantsController, getClassementController } from "./controllers/participantController.js";

// Import des controllers défis (Koura)
import { defisController, createDefiController, validerDefiController } from "./controllers/defisControllers.js";

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Routes participants (Mahamane)
app.post("/participants", createParticipantsController);
app.get("/participants/ranking", getClassementController);

// Routes défis (Koura)
app.get("/defis", defisController);
app.post("/defis", createDefiController);
app.post("/defis/:id/valider", validerDefiController);

// Démarrage du serveur
app.listen(3000, () => {
  console.log(`Server listening on 3000`);
});