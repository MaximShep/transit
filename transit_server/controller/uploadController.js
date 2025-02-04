const fs = require("fs");
const path = require("path");
const generateHexCode = require("../utils/hexGenerator");
const db = require("../config");

const uploadImage = (req, res) => {
  try {
    const hexCode = req.body.hexCode || generateHexCode(); // Используем переданный код или генерируем новый
    const image = req.file;

    if (!image) {
      return res.status(400).json({ error: "Файл не найден" });
    }

    const folder1 = hexCode.substring(0, 2);
    const folder2 = hexCode.substring(2, 4);

    const targetFolder = path.join(__dirname, "../uploads/images", folder1, folder2);

    // Создаём недостающие папки
    fs.mkdirSync(targetFolder, { recursive: true });

    // Перемещаем файл
    const targetPath = path.join(targetFolder, image.originalname);
    fs.renameSync(image.path, targetPath);

    // Сохраняем путь в базе данных
    const dbPath = `uploads/images/${folder1}/${folder2}/${image.originalname}`;
    const query = `INSERT INTO images (path) VALUES (?)`;

    db.run(query, [dbPath], (err) => {
      if (err) {
        return res.status(500).json({ error: "Ошибка записи в базу данных" });
      }

      res.status(200).json({ message: "Файл загружен", path: dbPath });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

module.exports = { uploadImage };
