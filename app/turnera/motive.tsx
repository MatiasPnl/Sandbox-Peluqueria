import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../styles/motivestyle";

const Motive = () => {
  const [extras, setExtras] = useState<string[]>([]); // Lista de extras
  const [newExtra, setNewExtra] = useState<string>(""); // Nuevo extra

  // Cargar los datos desde AsyncStorage al iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedExtras = await AsyncStorage.getItem("extraOptions");
        if (storedExtras) setExtras(JSON.parse(storedExtras));
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    loadData();
  }, []);

  // Guardar los datos en AsyncStorage cada vez que cambian
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("extraOptions", JSON.stringify(extras));
      } catch (error) {
        console.error("Error al guardar datos:", error);
      }
    };
    saveData();
  }, [extras]);

  // Funciones para gestionar extras
  const handleAddExtra = () => {
    if (newExtra.trim() && extras.length < 15 && newExtra !== "undefined") {
      setExtras([...extras, newExtra.trim()]);
      setNewExtra("");
    } else if (extras.length >= 15) {
      Alert.alert("Límite alcanzado", "No puedes agregar más de 15 extras.");
    }
  };

  const handleEditExtra = (index: number) => {
    const currentExtra = extras[index];
    const editedExtra = prompt("Editar extra", currentExtra) || currentExtra;
    if (editedExtra.trim()) {
      const updatedExtras = [...extras];
      updatedExtras[index] = editedExtra.trim();
      setExtras(updatedExtras);
    }
  };

  const handleDeleteExtra = (index: number) => {
    Alert.alert(
      "Eliminar extra",
      "¿Estás seguro de que deseas eliminar este extra?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            const updatedExtras = extras.filter((_, i) => i !== index);
            setExtras(updatedExtras);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestionar Adicionales</Text>

      <TextInput
        style={styles.input}
        placeholder="Agregar nueva opción extra"
        value={newExtra}
        onChangeText={setNewExtra}
      />
      <Button title="Agregar Extra" onPress={handleAddExtra} disabled={extras.length >= 15 || !newExtra.trim()} />
      <FlatList
        data={extras}
        keyExtractor={(item, index) => `extra-${index}`}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => handleEditExtra(index)}>
                <Text style={styles.editButton}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteExtra(index)}>
                <Text style={styles.deleteButton}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {extras.length >= 15 && <Text style={styles.limitText}>Has alcanzado el máximo de 15 extras.</Text>}
    </View>
  );
};

export default Motive;
