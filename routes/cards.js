const express = require("express");
const router = express.Router();
const cardSchema = require("../models/cards");
const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG/PNG images are allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const ensureUploadsDir = async () => {
  const dir = path.join(__dirname, "../uploads");
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    console.error("Error creating uploads directory:", error);
  }
};
ensureUploadsDir();

router.get("/", async (req, res) => {
  try {
    const cards = await cardSchema.find();
    console.log("Documents found:", cards.length, cards);
    res.json(cards);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const card = new cardSchema({
      name: req.body.name,
      description: req.body.description,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      status: req.body.status,
    });
    const savedCard = await card.save();
    res.status(201).json(savedCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  console.log(req, "rrrrr ppp");

  try {
    const card = await cardSchema.findOne({ _id: req.params.id });
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (req.file && card.imageUrl) {
      try {
        await fs.unlink(path.join(__dirname, "../", card.imageUrl));
      } catch (error) {
        console.error("Error deleting old image:", error);
      }
    }

    card.name = req.body.name || card.name;
    card.description = req.body.description || card.description;
    card.imageUrl = req.file ? `/uploads/${req.file.filename}` : card.imageUrl;
    card.status = req.body.status || card.status;

    const updatedCard = await card.save();
    res.json(updatedCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  console.log(req, "rrrrr");

  try {
    const card = await cardSchema.findOne({ _id: req.params.id });
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (card.imageUrl) {
      try {
        await fs.unlink(path.join(__dirname, "../", card.imageUrl));
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }

    await card.deleteOne();
    res.json({ message: "Card deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
