const express = require("express");
const router = express.Router();
const { Duck } = require("../database");
const { authenticateJWT } = require("../auth");

// GET all ducks (public route)
router.get("/", async (req, res) => {
  try {
    const ducks = await Duck.findAll();
    res.json(ducks);
  } catch (error) {
    console.error("Error fetching ducks:", error);
    res.status(500).json({ error: "Failed to fetch ducks" });
  }
});

// POST new duck (protected route - requires authentication)
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name || !color) {
      return res.status(400).json({ error: "Name and color are required" });
    }

    const duck = await Duck.create({ name, color });
    res.status(201).json(duck);
  } catch (error) {
    console.error("Error creating duck:", error);
    res.status(500).json({ error: "Failed to create duck" });
  }
});

// PUT update duck (protected route - requires authentication)
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const duck = await Duck.findByPk(id);
    if (!duck) {
      return res.status(404).json({ error: "Duck not found" });
    }

    await duck.update({ name, color });
    res.json(duck);
  } catch (error) {
    console.error("Error updating duck:", error);
    res.status(500).json({ error: "Failed to update duck" });
  }
});

// DELETE duck (protected route - requires authentication)
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;

    const duck = await Duck.findByPk(id);
    if (!duck) {
      return res.status(404).json({ error: "Duck not found" });
    }

    await duck.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting duck:", error);
    res.status(500).json({ error: "Failed to delete duck" });
  }
});

module.exports = router;
