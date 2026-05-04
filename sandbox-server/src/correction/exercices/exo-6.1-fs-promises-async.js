import { readFile } from "node:fs/promises";

// Exo 6.1 - Démontrer que fs/promises ne bloque pas le serveur HTTP
// A brancher dans une app Express existante.

export function registerExo61Routes(app) {
  app.get("/demo-async", async (_req, res, next) => {
    try {
      console.log("[demo-async] A - début route");

      const start = Date.now();
      const raw = await readFile(new URL("../../../data/correction/enigmes.json", import.meta.url), "utf8");
      const enigmes = JSON.parse(raw);
      const durationMs = Date.now() - start;

      console.log("[demo-async] B - après readFile");

      res.status(200).json({
        message: "Lecture terminée",
        count: enigmes.length,
        durationMs
      });
    } catch (error) {
      next(error);
    }
  });

  // Appeler cette route pendant /demo-async pour montrer que le serveur reste réactif.
  app.get("/ping", (_req, res) => {
    res.status(200).json({ pong: true, at: new Date().toISOString() });
  });
}
