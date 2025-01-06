const express = require("express");
const multer = require("multer");
const { uploadImage } = require("../controller/uploadController");
const db = require("../config");

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const router = express.Router();

// Маршрут для загрузки файла
router.post("/upload", upload.single("image"), (req, res) => {
    if (!req.body.hexCode) {
      return res.status(400).json({ error: "HEX-код не предоставлен" });
    }
    uploadImage(req, res, db);
  });
  
module.exports = router;
