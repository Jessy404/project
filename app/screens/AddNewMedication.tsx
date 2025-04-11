import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Image, Alert } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

interface Medication {
  medicationName: string;
  medicationType: string;
  dose: string;
  whenToTake: string;
  startDate: string;
  endDate: string;
}

const AddNewMedication = () => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [medicationType, setMedicationType] = useState<string>("");
  const [medicationName, setMedicationName] = useState<string>("");
  const [dose, setDose] = useState<string>("");
  const [whenToTake, setWhenToTake] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [medications, setMedications] = useState<Medication[]>([]);
  
  const medicationOptions = ["Tablet", "Capsules", "Drops", "Syrup", "Injection"];
  const router = useRouter();

  const saveMedication = () => {
    if (
      !medicationName.trim() ||
      !medicationType.trim() ||
      !dose.trim() ||
      !whenToTake.trim() ||
      !startDate.trim() ||
      !endDate.trim()
    ) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Please fill in all the fields!',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 50,
      });
      return;
    }

    Alert.alert(
      "Confirm Medication",
      "Are you sure you want to save this medication?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            const newMedication: Medication = {
              medicationName,
              medicationType,
              dose,
              whenToTake,
              startDate,
              endDate,
            };

            setMedications([...medications, newMedication]);
            setMedicationName("");
            setMedicationType("");
            setDose("");
            setWhenToTake("");
            setStartDate("");
            setEndDate("");

            Toast.show({
              type: 'success',
              position: 'top',
              text1: 'Medication added successfully!',
              visibilityTime: 4000,
              autoHide: true,
              topOffset: 50,
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back-sharp" size={24} color="#2265A2"/>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Add New Medication</Text>
      <Image source={require("../../assets/images/Dr.png")} style={styles.image} />

      <TextInput
        style={styles.input}
        placeholder="Medication Name"
        value={medicationName}
        onChangeText={setMedicationName}
      />

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>
          {medicationType ? medicationType : "Select Medication Type"}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Dose (e.g. 2, 15ml)"
        value={dose}
        onChangeText={setDose}
      />

      <TextInput
        style={styles.input}
        placeholder="When to Take (e.g. Morning)"
        value={whenToTake}
        onChangeText={setWhenToTake}
      />

      <TextInput
        style={styles.input}
        placeholder="Start Date (MM/DD/YYYY)"
        value={startDate}
        onChangeText={setStartDate}
      />

      <TextInput
        style={styles.input}
        placeholder="End Date (MM/DD/YYYY)"
        value={endDate}
        onChangeText={setEndDate}
      />

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Reminder</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={saveMedication}>
        <Text style={styles.saveButtonText}>Save Medication</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Medication Type</Text>

            {medicationOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => {
                  setMedicationType(option);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast config={{
        success: ({ text1 }: { text1?: string }) => (
          <View style={[styles.toastSuccess]}>
            <Text style={styles.toastText}>{text1 || "Success!"}</Text>
          </View>
        ),
        error: ({ text1 }: { text1?: string }) => (
          <View style={[styles.toastError]}>
            <Text style={styles.toastText}>{text1 || "An error occurred!"}</Text>
          </View>
        ),
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", justifyContent: "flex-start", alignItems: "center", padding: 20 },
  header: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginTop: 40, marginBottom: 10 },
  backButton: { flexDirection: "row", alignItems: "center" },
  backText: { fontSize: 18, color: "#2265A2", marginLeft: 5, fontWeight: "bold" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, alignSelf: "center" },
  image: { width: 220, height: 220, marginBottom: 0 },
  input: { width: "100%", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 25, marginBottom: 10 },
  button: { padding: 10, backgroundColor: "#2265A2", borderRadius: 25, width: "100%", alignItems: "center", marginBottom: 10 },
  buttonText: { color: "white", fontSize: 16 },
  addButton: { padding: 10, backgroundColor: "#2265A2", borderRadius: 25, width: "100%", alignItems: "center", marginBottom: 10 },
  addButtonText: { color: "white", fontSize: 16 },
  saveButton: { padding: 10, backgroundColor: "#062654", borderRadius: 25, width: "100%", alignItems: "center" },
  saveButtonText: { color: "white", fontSize: 16 },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContainer: { width: 300, backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  optionButton: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd", width: "100%", alignItems: "center" },
  optionText: { fontSize: 16 },
  closeButton: { marginTop: 10, padding: 10, backgroundColor: "#2265A2", borderRadius: 15 },
  closeButtonText: { color: "white", fontSize: 16 },
  toastSuccess: { padding: 10, backgroundColor: "green", borderRadius: 25, borderWidth: 2, borderColor: "green" },
  toastError: { padding: 10, backgroundColor: "crimson", borderRadius: 25, borderWidth: 2, borderColor: "darkred" },
  toastText: { color: "white", fontSize: 16, fontWeight: "bold" }
});

export default AddNewMedication;
