import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.send("Sandbox Node.js + Docker opérationnel");
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "nodejs-docker-sandbox",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get("/version", (_req, res) => {
  res.status(200).json({
    node: process.version,
    env: process.env.NODE_ENV || "development"
  });
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
