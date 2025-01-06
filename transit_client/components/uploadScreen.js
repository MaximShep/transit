// components/uploadScreen.js
import React, { useState } from "react";
import { View, Button, Alert, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToServer } from "../utils/utilities";

const UploadScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Ошибка", "Разрешение на доступ к галерее необходимо.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert("Ошибка", "Сначала выберите изображение.");
      return;
    }

    try {
      const filePath = await uploadImageToServer(selectedImage);
      Alert.alert("Успех", `Файл загружен: ${filePath}`);
    } catch (error) {
      Alert.alert("Ошибка", error.message || "Не удалось загрузить файл");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Выбрать изображение" onPress={pickImage} />
      {selectedImage && (
              <Image source={{ uri: selectedImage.uri }} style={styles.image} />
            )}
      <Button title="Загрузить изображение" onPress={uploadImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 16,
  },
});

export default UploadScreen;
