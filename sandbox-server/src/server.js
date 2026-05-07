import express from "express";
import { createParticipantsController, getClassementController } from "./controllers/participantController.js";

const app = express();
app.use(express.json());

app.post("/participants", createParticipantsController);
app.get("/participants/ranking", getClassementController); 
app.listen(3001, () => {
    console.log(`Server listening on 3001`);
});