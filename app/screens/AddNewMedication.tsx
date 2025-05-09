import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import { Easing } from "react-native-reanimated";
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
import { MotiView } from "moti";

interface Medication {
  medicationName: string;
  medicationType: string;
  dose: string;
  whenToTake: string;
  startDate: string;
  endDate: string;
  reminderType: string;
  frequencyPerDay: string;
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
  const [frequencyPerDay, setFrequencyPerDay] = useState<string>("");
  const medicationOptions = ["Tablet", "Capsules", "Drops", "Syrup", "Injection"];
  const router = useRouter();
  const [moveLeft] = useState(new Animated.Value(0));
  const [moveBack] = useState(new Animated.Value(0));
  const auth = getAuth();
  const frequency = parseInt(frequencyPerDay);
  const intervalHours = Math.floor(24 / frequency);
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
            frequencyPerDay,
            reminderType,
          };

          try {
            await setDoc(doc(db, "medication", docID), {
              ...newMedication,
              userEmail,
              docID,
              intervalHours,
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

  const renderItem = ({ item }: { item: Medication }) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.input}>{item.medicationName}</Text>
      <Text style={styles.input}>{item.dose}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={medications}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <>
            <View style={styles.header}>

              <TouchableOpacity onPress={() => router.back()} >
                <View style={{ flexDirection: 'row', alignItems: 'center' , top:-25}}>
             
                  <MotiView
                    from={{ translateX: -10 }}
                    animate={{ translateX: 10 }}
                    transition={{
                      type: "timing",
                      duration: 800,
                      loop: true,
                      repeatReverse: true,
                      easing: Easing.inOut(Easing.ease),
                    }}
                    style={{ padding: 8, top: 40 }}
                  >
                    <FontAwesome5
                      name="angle-double-left"
                      size={30}
                      color="#FFD700"
                    />
                     <Text style={styles.viewAllText}>Back</Text>
                  </MotiView>
                </View>
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
            <View style={styles.inputWrapper}>
              <Ionicons name="repeat" size={24} color="black" style={styles.iconLeft} />
              <TextInput
                style={styles.input}
                placeholder="Times per day (e.g. 2)"
                value={frequencyPerDay}
                onChangeText={setFrequencyPerDay}
                keyboardType="numeric"
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

            {/* <TouchableOpacity style={styles.addButton} onPress={() => setReminderModalVisible(true)}>
              <AntDesign name="bells" size={20} color="black" style={styles.iconLeft} />
              <Text style={styles.addButtonText}>Add Reminder</Text>
            </TouchableOpacity> */}

            {/* {reminderType ? <Text style={{ marginBottom: 10, color: '#2265A2' }}>Reminder: {reminderType}</Text> : null} */}

            <TouchableOpacity style={styles.saveButton} onPress={saveMedication}>
              <Text style={styles.saveButtonText}>Save Medication</Text>
            </TouchableOpacity>
          </>
        }
        keyboardShouldPersistTaps="handled"
      />

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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    marginLeft: 5,
    fontSize: 18,
    color: "#2265A2",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#062654",
    textAlign: "center",
    marginBottom: 10,
    // top: -20,
  },
  image: {
    alignSelf: "center",
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingLeft: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  iconLeft: {
    marginRight: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    marginLeft: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#2265A2",
    borderRadius: 8,
    marginBottom: 15,
  },
  addButtonText: {
    marginLeft: 10,
    color: "#2265A2",
  },
  saveButton: {
    backgroundColor: "#062654",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  
    viewAllText: {
        fontSize: 14,
        color: "#062654",
        fontWeight: "500",
        fontFamily: 'Inter-Medium',
    },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  optionButton: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  closeButtonText: {
    color: "#2265A2",
    fontWeight: "bold",
  },
});

export default AddNewMedication;