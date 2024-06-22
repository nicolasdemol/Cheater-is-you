const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static("public"));

// Route pour initialiser un niveau
app.get("/api/level/:level/init", async (req, res) => {
  const level = req.params.level;
  const keyParam = req.query.key
    ? `key=${encodeURIComponent(req.query.key)}&`
    : "";
  try {
    const response = await axios.get(
      `https://www.newbiecontest.org/epreuves/javascript/cheaterisyou/api/level${level}.php?${keyParam}init`
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des données pour le niveau ${level}:`,
      error.message
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des données" });
  }
});

// Route pour terminer un niveau
app.get("/api/level/:level/finish", async (req, res) => {
  const level = req.params.level;
  const keyParam = req.query.key
    ? `key=${encodeURIComponent(req.query.key)}&`
    : "";
  try {
    const response = await axios.get(
      `https://www.newbiecontest.org/epreuves/javascript/cheaterisyou/api/level${level}.php?${keyParam}finish`
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      `Erreur lors de la finition du niveau ${level}:`,
      error.message
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des données" });
  }
});

app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
