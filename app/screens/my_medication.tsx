import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const MyMedication = () => {
  const router = useRouter();
  const [medications, setMedications] = useState([
    { id: "1", name: "Paracetamol", type: "Tablet", time: "08:00 AM", dose: "500mg", expiry: "12/2025", taken: false, rating: 0 },
    { id: "2", name: "Vitamin C", type: "Syrup", time: "12:00 PM", dose: "1000mg", expiry: "06/2024", taken: false, rating: 0 },
    { id: "3", name: "Ibuprofen", type: "Injection", time: "06:00 PM", dose: "400mg", expiry: "09/2026", taken: false, rating: 0 },
  ]);

  const handleTaken = (id: string) => {
    setMedications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, taken: true } : item))
    );
  };

  const handleDelete = (id: string) => {
    setMedications((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddMedication = () => {
    router.push("/screens/AddNewMedication");
  };

  const handleRating = (id: string, rating: number) => {
    setMedications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, rating } : item))
    );
  };

  const handleViewDetails = (id: string) => {
    router.push(`/screens/MedicationDetail?id=${id}`);
  };

  const renderItem = ({ item }: { item: { id: string; name: string; type: string; time: string; dose: string; expiry: string; taken: boolean; rating: number } }) => {
    // Ensure item is defined before using it
    if (!item) {
      return null; // Return null if the item is undefined
    }

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.medName}>{item.name} ({item.type})</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRating(item.id, star)}>
                <FontAwesome name={item.rating >= star ? "star" : "star-o"} size={20} color={item.rating >= star ? "#FFD700" : "#CCC"} />
              </TouchableOpacity>
            ))}
          </View>
          {item.taken ? (
            <FontAwesome5 name="check-double" size={20} color="green" style={styles.icon} />
          ) : (
            <FontAwesome5 name="pills" size={20} color="#2265A2" style={styles.icon} />
          )}
        </View>
        <Text style={styles.details}>Time : <FontAwesome5 name="clock" /> {item.time}</Text>
        <Text style={styles.details}>Dose : <FontAwesome5 name="capsules" /> {item.dose}</Text>
        
        <View style={styles.buttons}>
          {!item.taken && (
            <TouchableOpacity style={[styles.button, styles.taken]} onPress={() => handleTaken(item.id)}>
              <Text style={styles.btnText}>Taken</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.button, styles.edit]} onPress={() => handleViewDetails(item.id)}>
            <Text style={styles.btnText}>View</Text>
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
      <Text style={styles.title}>My Medication</Text>
      <FlatList 
        data={medications} 
        keyExtractor={(item) => item.id} 
        renderItem={renderItem} 
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <TouchableOpacity style={styles.addButton} onPress={handleAddMedication}>
            <FontAwesome5 name="plus" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Add Medication</Text>
          </TouchableOpacity>
        }
      />
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
    backgroundColor: "#EAF0F7",
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  icon: {
    marginLeft: 10,
  },
  medName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2265A2",
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#062654",
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 60,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default MyMedication;
