// utils/utilities.js
import SERVER_IP from "./config";

export const generateHexCode = () => {
  return [...Array(4)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
};

export const uploadImageToServer = async (image) => {
  const hexCode = generateHexCode();
  const formData = new FormData();

  formData.append("image", {
    uri: image.uri,
    type: image.type,
    name: image.fileName || "image.jpg",
  });
  formData.append("hexCode", hexCode);

  try {
    const response = await fetch(`${SERVER_IP}/upload`, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Ошибка загрузки файла");
    }

    return result.path; // Возвращает путь к загруженному файлу
  } catch (error) {
    console.error("Ошибка загрузки:", error.message);
    throw error;
  }
};
