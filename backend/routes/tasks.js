const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Créer une tâche
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = new Task({
      title,
      description,
      user: req.userId,
    });

    await task.save();

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
});

// Récupérer les tâches de l'utilisateur connecté
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.userId,
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
});

// Modifier une tâche
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      {
        title,
        description,
        completed,
      },
      {
        new: true,
      },
    );

    if (!task) {
      return res.status(404).json({
        message: "Tâche introuvable",
      });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
});

// Supprimer une tâche
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Tâche introuvable",
      });
    }

    res.json({
      message: "Tâche supprimée",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
});

module.exports = router;
