// point d'entrée de l'application 

import express from "express";
import { createPlayerController, playersController } from "./controllers/playerController.js";

import { defisController, createDefiController, validerDefiController } from "./controllers/defisControllers.js";

const app = express();
app.use(express.json());

// endpoint connecter à son controleur
app.get("/players", playersController);

// POST /players
app.post("/players", createPlayerController);


// GET pour lister tous les défis
app.get("/defis", defisController);
// POST pour créer un défi
app.post("/defis", createDefiController);
// POST pour valider la réponse d'un participant
app.post("/defis/:id/valider", validerDefiController);

app.listen(3000, () => {
  console.log(`Server listening on 3000`);
});
