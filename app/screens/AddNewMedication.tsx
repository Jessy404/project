import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Image,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { Animated } from "react-native";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { getAuth } from "firebase/auth";

interface Medication {
  medicationName: string;
  medicationType: string;
  dose: string;
  whenToTake: string;
  startDate: string;
  endDate: string;
  reminderType: string;
}

const AddNewMedication = () => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [reminderModalVisible, setReminderModalVisible] = useState<boolean>(false);
  const [medicationType, setMedicationType] = useState<string>("");
  const [medicationName, setMedicationName] = useState<string>("");
  const [dose, setDose] = useState<string>("");
  const [whenToTake, setWhenToTake] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [reminderType, setReminderType] = useState<string>("");
  const [medications, setMedications] = useState<Medication[]>([]);
  const [whenToTakeModalVisible, setWhenToTakeModalVisible] = useState(false);
  const medicationOptions = ["Tablet", "Capsules", "Drops", "Syrup", "Injection"];
  const router = useRouter();
  const [moveLeft] = useState(new Animated.Value(0));   
  const [moveBack] = useState(new Animated.Value(0)); 
  const auth = getAuth();
  useEffect(() => {
    const animateArrow = () => {
      Animated.sequence([
        Animated.timing(moveLeft, {
          toValue: -10,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(moveLeft, {
          toValue: 10,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(moveBack, {
          toValue: -10,   
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(moveBack, {
          toValue: 10,   
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => animateArrow());
    };
    animateArrow();
  }, [moveLeft, moveBack]);

  const saveMedication = async () => {
    const docID = Date.now().toString();
    const userEmail = auth.currentUser?.email;

    if (
      !medicationName.trim() ||
      !medicationType.trim() ||
      !dose.trim() ||
      !whenToTake.trim() ||
      !startDate.trim() ||
      !endDate.trim()
    ) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Please fill in all the fields!",
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 50,
      });
      return;
    }

    Alert.alert("Confirm Medication", "Are you sure you want to save this medication?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          const newMedication: Medication = {
            medicationName,
            medicationType,
            dose,
            whenToTake,
            startDate,
            endDate,
            reminderType,
          };

          try {
            await setDoc(doc(db, "medication", docID), {
              ...newMedication,
              userEmail,
              docID,
            });
            setMedications([...medications, newMedication]);
            setMedicationName("");
            setMedicationType("");
            setDose("");
            setWhenToTake("");
            setStartDate("");
            setEndDate("");
            setReminderType("");
            Toast.show({
              type: "success",
              position: "top",
              text1: "Medication added successfully!",
              visibilityTime: 4000,
              autoHide: true,
              topOffset: 50,
            });
          } catch (e) {
            console.log(e);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
    <View style={styles.header}>
    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
  <Animated.View style={{ flexDirection: "row", alignItems: "center", transform: [{ translateX: moveBack }] }}>
    <FontAwesome5 name="angle-double-left" size={30} color="#2265A2" />
    <Text style={styles.backText}>Back</Text>
  </Animated.View>
</TouchableOpacity>

    </View>

      <Text style={styles.title}>Add New Medication</Text>
      <Image source={require("../../assets/images/MED.png")} style={styles.image} />

      <View style={styles.inputWrapper}>
        <Ionicons name="medkit" size={20} color="black" style={styles.iconLeft} />
        <TextInput
          style={styles.input}
          placeholder="Medication Name"
          value={medicationName}
          onChangeText={setMedicationName}
        />
      </View>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
        <Fontisto name="drug-pack" size={24} color="black" />
        <Text style={styles.buttonText}>{medicationType || "Select Medication Type"}</Text>
      </TouchableOpacity>

      <View style={styles.inputWrapper}>
        <FontAwesome name="eyedropper" size={24} color="black" style={styles.iconLeft} />
        <TextInput
          style={styles.input}
          placeholder="Dose (e.g. 2, 15ml)"
          value={dose}
          onChangeText={setDose}
        />
      </View>

      <TouchableOpacity onPress={() => setWhenToTakeModalVisible(true)} style={styles.button}>
        <Fontisto name="clock" size={20} color="black" style={styles.iconLeft} />
        <Text style={styles.buttonText}>{whenToTake || "Select Time to Take"}</Text>
      </TouchableOpacity>

      <View style={styles.inputWrapper}>
        <Ionicons name="calendar-outline" size={24} color="black" style={styles.iconLeft} />
        <TextInput
          style={styles.input}
          placeholder="Start Date (MM/DD/YYYY)"
          value={startDate}
          onChangeText={setStartDate}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="calendar-outline" size={24} color="black" style={styles.iconLeft} />
        <TextInput
          style={styles.input}
          placeholder="End Date (MM/DD/YYYY)"
          value={endDate}
          onChangeText={setEndDate}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => setReminderModalVisible(true)}>
        <AntDesign name="bells" size={20} color="black" style={styles.iconLeft} />
        <Text style={styles.addButtonText}>Add Reminder</Text>
      </TouchableOpacity>

      {reminderType ? <Text style={{ marginBottom: 10, color: '#2265A2' }}>Reminder: {reminderType}</Text> : null}

      <TouchableOpacity style={styles.saveButton} onPress={saveMedication}>
        <Text style={styles.saveButtonText}>Save Medication</Text>
      </TouchableOpacity>

      {/* Medication Type Modal */}
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

      {/* When To Take Modal */}
      <Modal visible={whenToTakeModalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Time to Take</Text>
            {["Morning", "Before Lunch", "After Lunch", "Afternoon", "Evening", "Before Dinner", "After Dinner", "Before Sleeping"].map(
              (option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => {
                    setWhenToTake(option);
                    setWhenToTakeModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              )
            )}
            <TouchableOpacity onPress={() => setWhenToTakeModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Reminder Modal */}
      <Modal visible={reminderModalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Reminder Type</Text>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                setReminderType("Daily");
                setReminderModalVisible(false);
              }}
            >
              <Text style={styles.optionText}>Daily</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                setReminderType("Weekly");
                setReminderModalVisible(false);
              }}
            >
              <Text style={styles.optionText}>Weekly</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setReminderModalVisible(false)} style={styles.closeButton}>
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
            <Text style={styles.toastText}>{text1 || "Error!"}</Text>
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
  backText: { fontSize: 20, color: "#2265A2", marginLeft: 5, fontWeight: "bold" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, alignSelf: "center" },
  image: { width: 272, height: 195, marginBottom: 0, marginLeft: 12 },
  input1: { width: "100%", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 25, marginBottom: 10 },
  button: { padding: 10, backgroundColor: "#2265A2", borderRadius: 25, marginBottom: 10, width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, marginLeft: 10 },
  iconLeft1: { marginRight: 10 },
  addButton: { padding: 10, backgroundColor: "#2265A2", borderRadius: 25, marginBottom: 10, width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" },
  addButtonText: { color: "white", fontSize: 16, marginLeft: 10 },
  saveButton: { backgroundColor: "#062654", padding: 10, borderRadius: 25, width: "100%", marginBottom: 10 },
  saveButtonText: { color: "white", fontSize: 18, fontWeight: "bold", textAlign: "center" },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.7)" },
  modalContainer: { backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  optionButton: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd", width: "100%", alignItems: "center" },
  optionText: { fontSize: 16 },
  closeButton: { marginTop: 10, padding: 11, backgroundColor: "#2265A2", borderRadius: 25  },
  closeButtonText: { color: "white", fontSize: 17 , textAlign: "center"},
  toastSuccess: { padding: 10, backgroundColor: "green", borderRadius: 25, borderWidth: 2, borderColor: "green" },
  toastError: { padding: 10, backgroundColor: "crimson", borderRadius: 25, borderWidth: 2, borderColor: "darkred" },
  toastText: { color: "white", fontSize: 16, fontWeight: "bold" },
  inputWrapper: {
    width: '100%',
    flexDirection: 'row',  
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    marginBottom: 10,
  },
  input: {
    flex: 1, 
    padding: 10,
    fontSize: 16,
  },
  iconLeft: {
    marginLeft: 10,   
    marginRight: 10,  
  },
});

export default AddNewMedication;