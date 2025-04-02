import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const MedicationDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  const [medication, setMedication] = useState<{
    id: string;
    name: string;
    type: string;
    time: string;
    dose: string;
    expiry: string;
    rating: number;
    startDate: string;
    endDate: string;
  } | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedMedication, setEditedMedication] = useState({
    name: '',
    type: '',
    dose: '',
    startDate: '',
    endDate: '',
    expiry: '',
    rating: 0,
  });


  const medications = [
    { id: "1", name: "Paracetamol", type: "Tablet", time: "08:00 AM", dose: "500mg", expiry: "12/2025", rating: 4, startDate: "01/01/2023", endDate: "12/2023" },
    { id: "2", name: "Vitamin C", type: "Syrup", time: "12:00 PM", dose: "1000mg", expiry: "06/2024", rating: 5, startDate: "01/01/2023", endDate: "06/2024" },
    { id: "3", name: "Ibuprofen", type: "Injection", time: "06:00 PM", dose: "400mg", expiry: "09/2026", rating: 3, startDate: "02/01/2023", endDate: "02/2024" },
  ];

  useEffect(() => {
    if (id) {
  
      const medicationData = medications.find(med => med.id === id);
      setMedication(medicationData || null);
      if (medicationData) {
        setEditedMedication({
          name: medicationData.name,
          type: medicationData.type,
          dose: medicationData.dose,
          startDate: medicationData.startDate,
          endDate: medicationData.endDate,
          expiry: medicationData.expiry,
          rating: medicationData.rating,
        });
      }
    }
  }, [id]);

  if (!id) return <Text>Loading...</Text>;

  if (!medication) return <Text>Loading medication details...</Text>;

  const handleEdit = () => {
    setIsEditing(!isEditing); 
  };

  const handleSave = () => {

    setMedication({ ...medication, ...editedMedication });
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHalfCircle}></View> {/* نصف الدائرة الكحلي */}
      <View style={styles.card}>
        <Text style={styles.title}>{isEditing ? "Edit Medication" : medication.name}</Text>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailsTitle}>Type: </Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedMedication.type}
              onChangeText={(text) => setEditedMedication({ ...editedMedication, type: text })}
            />
          ) : (
            <Text style={styles.details}>{medication.type}</Text>
          )}
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailsTitle}>Dose: </Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedMedication.dose}
              onChangeText={(text) => setEditedMedication({ ...editedMedication, dose: text })}
            />
          ) : (
            <Text style={styles.details}>{medication.dose}</Text>
          )}
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailsTitle}>Start Date: </Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedMedication.startDate}
              onChangeText={(text) => setEditedMedication({ ...editedMedication, startDate: text })}
            />
          ) : (
            <Text style={styles.details}>{medication.startDate}</Text>
          )}
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailsTitle}>End Date: </Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedMedication.endDate}
              onChangeText={(text) => setEditedMedication({ ...editedMedication, endDate: text })}
            />
          ) : (
            <Text style={styles.details}>{medication.endDate}</Text>
          )}
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailsTitle}>Expiry: </Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedMedication.expiry}
              onChangeText={(text) => setEditedMedication({ ...editedMedication, expiry: text })}
            />
          ) : (
            <Text style={styles.details}>{medication.expiry}</Text>
          )}
        </View>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.detailsTitle}>Rating: </Text>
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesome
              key={star}
              name={editedMedication.rating >= star ? "star" : "star-o"}
              size={20}
              color={editedMedication.rating >= star ? "#FFD700" : "#DDD"}
              onPress={() => isEditing && setEditedMedication({ ...editedMedication, rating: star })}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={isEditing ? handleSave : handleEdit}>
        <Text style={styles.editButtonText}>{isEditing ? "Save Changes" : "Edit Medication"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
    paddingTop: 40,
    justifyContent: 'center',  
    alignItems: 'center', 
  },
  topHalfCircle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: "#2265A2", // اللون الكحلي
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2265A2",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    width: '90%', 
    maxWidth: 400, 
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  details: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
  detailsTitle: {
    fontSize: 18,
    color: "#2265A2",
    fontWeight: "600",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16,
    color: "#333",
    width: '60%',
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  editButton: {
    backgroundColor: "#2265A2",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    elevation: 4,
  },
  editButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default MedicationDetail;
