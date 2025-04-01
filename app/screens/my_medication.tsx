import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';

const MyMedication = () => {
  const [medications, setMedications] = useState([
    { id: "1", name: "Paracetamol", time: "08:00 AM", dose: "500mg", taken: false },
    { id: "2", name: "Vitamin C", time: "12:00 PM", dose: "1000mg", taken: false },
    { id: "3", name: "Ibuprofen", time: "06:00 PM", dose: "400mg", taken: false },
  ]);

  const handleTaken = (id) => {
    setMedications((prev) => prev.map((item) => (item.id === id ? { ...item, taken: true } : item)));
  };

  const handleDelete = (id) => {
    setMedications((prev) => prev.filter((item) => item.id !== id));
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <FontAwesome5 name="pills" size={20} color="#007AFF" style={styles.icon} />
          <Text style={styles.medName}>{item.name}</Text>
        </View>
        <Text style={styles.details}><FontAwesome5 name="clock" /> {item.time}</Text>
        <Text style={styles.details}><FontAwesome5 name="capsules" /> {item.dose}</Text>
        <View style={styles.buttons}>
          {!item.taken && (
            <TouchableOpacity style={[styles.button, styles.taken]} onPress={() => handleTaken(item.id)}>
              <Text style={styles.btnText}>Taken</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.button, styles.edit]}>
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.delete]} onPress={() => handleDelete(item.id)}>
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: "#FFF",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#062654",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    marginRight: 8,
  },
  medName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#062654",
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
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
    backgroundColor: "#2265A2",
  },
  edit: {
    backgroundColor: "#7FADE0",
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
