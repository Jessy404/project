import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Image } from "react-native";

interface AddNewMedicationProps {
  onSave: (newMedication: Medication) => void;
}

interface Medication {
  medicationName: string;
  medicationType: string;
  dose: string;
  whenToTake: string;
  startDate: string;
  endDate: string;
}

const AddNewMedication = ({ onSave }: AddNewMedicationProps) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [medicationType, setMedicationType] = useState<string>("");
  const [medicationName, setMedicationName] = useState<string>("");
  const [dose, setDose] = useState<string>("");
  const [whenToTake, setWhenToTake] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const medicationOptions = ["Tablet", "Capsules", "Drops", "Syrup", "Injection"];

  const saveMedication = () => {
    const newMedication: Medication = {
      medicationName,
      medicationType,
      dose,
      whenToTake,
      startDate,
      endDate,
    };
    onSave(newMedication);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Medication</Text>
      <Image source={require("../../assets/images/consult.png")} style={styles.image} />

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
    </View>
  );
};const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    image: { width: 150, height: 150, marginBottom: 20 },
    input: { width: "100%", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginBottom: 10 },
    button: { padding: 10, backgroundColor: "#007bff", borderRadius: 5, width: "100%", alignItems: "center", marginBottom: 10 },
    buttonText: { color: "white", fontSize: 16 },
    addButton: { padding: 10, backgroundColor: "#28a745", borderRadius: 5, width: "100%", alignItems: "center", marginBottom: 10 },
    addButtonText: { color: "white", fontSize: 16 },
    saveButton: { padding: 10, backgroundColor: "#007bff", borderRadius: 5, width: "100%", alignItems: "center" },
    saveButtonText: { color: "white", fontSize: 16 },
    modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    modalContainer: { width: 300, backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
    modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    optionButton: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd", width: "100%", alignItems: "center" },
    optionText: { fontSize: 16 },
    closeButton: { marginTop: 10, padding: 10, backgroundColor: "#dc3545", borderRadius: 5 },
    closeButtonText: { color: "white", fontSize: 16 },
  });
  
  export default AddNewMedication;