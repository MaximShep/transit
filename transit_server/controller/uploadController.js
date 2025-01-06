const fs = require("fs");
const path = require("path");

const uploadImage = (req, res, db) => {
  if (!req.file || !req.body.hexCode) {
    return res.status(400).json({ error: "Файл или HEX-код не предоставлены" });
  }

  const hexCode = req.body.hexCode;
  const subFolder1 = hexCode[0] + hexCode[1];
  const subFolder2 = hexCode[2] + hexCode[3];
  const uploadDir = path.join(__dirname, "../uploads/images", subFolder1, subFolder2);

  // Создание вложенных папок, если они не существуют
  fs.mkdirSync(uploadDir, { recursive: true });

  // Перемещение файла в нужную папку
  const newFilePath = path.join(uploadDir, req.file.filename);
  fs.renameSync(req.file.path, newFilePath);

  const imagePath = `/uploads/images/${subFolder1}/${subFolder2}/${req.file.filename}`;

  // Сохранение пути в базе данных
  const query = "INSERT INTO images (path) VALUES (?)";
  db.run(query, [imagePath], (err) => {
    if (err) {
      console.error("Ошибка сохранения в БД:", err.message);
      return res.status(500).json({ error: "Ошибка сохранения в БД" });
    }

    res.status(200).json({ message: "Файл успешно загружен", path: imagePath });
  });
};

module.exports = { uploadImage };
