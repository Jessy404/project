import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated } from "react-native";

const MyMedication = () => {
  const [medications, setMedications] = useState([
    { id: "1", name: "Paracetamol", time: "08:00 AM", dose: "500mg", taken: false },
    { id: "2", name: "Vitamin C", time: "12:00 PM", dose: "1000mg", taken: false },
    { id: "3", name: "Ibuprofen", time: "06:00 PM", dose: "400mg", taken: false },
  ]);

  const handleTaken = (id : string) => {
    setMedications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, taken: true } : item))
    );
  };

  const handleDelete = (id : string) => {
    setMedications((prev) => prev.filter((item) => item.id !== id));
  };
  type Medication = {
    id: string;
    name: string;
    time: string;
    dose: string;
    taken: boolean;
  };
  
  const renderItem = ({ item }: { item: Medication }) => {
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    };

    return (
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        {item.taken && <Text style={styles.takenLabel}>✅ Taken</Text>}
        <View style={styles.info}>
          <Text style={styles.medName}>{item.name}</Text>
          <Text style={styles.details}>Time: {item.time}</Text>
          <Text style={styles.details}>Dose: {item.dose}</Text>
        </View>
        <View style={styles.buttons}>
          {!item.taken && (
            <TouchableOpacity style={[styles.button, styles.taken]} onPress={() => handleTaken(item.id)}>
              <Text style={styles.btnText}>Taken</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.button, styles.edit]}>
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.delete]}
            onPress={() => handleDelete(item.id)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Medication 💊</Text>
      <FlatList data={medications} keyExtractor={(item) => item.id} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#162447",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#E1EAF5",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1F4068",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    position: "relative",
  },
  takenLabel: {
    position: "absolute",
    top: 8,
    right: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#21BF73",
  },
  info: {
    marginBottom: 10,
  },
  medName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  details: {
    fontSize: 14,
    color: "#A9C1D9",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  taken: {
    backgroundColor: "#21BF73",
  },
  edit: {
    backgroundColor: "#F4A261",
  },
  delete: {
    backgroundColor: "#E63946",
  },
  btnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default MyMedication;
