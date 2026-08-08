const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // charge les variables de .env
const app = express();
// Middlewares globaux
app.use(express.json()); // lit le JSON du corps des requêtes
app.use(cors()); // autorise les requêtes cross-origin (React)
// Vérification de la présence de l'URI MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("MongoDB URI is undefined. Check your environment variables.");
  process.exit(1);
}

// Connexion à MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.log(err));
// Routes
const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/auth");
// app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
// Démarrage du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
