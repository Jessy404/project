import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { db } from "../../config/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const MedicationDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [medication, setMedication] = useState<{
    medicationName: string;
    medicationType: string;
    dose: string;
    startDate: string;
    endDate: string;
    reminderType: string;
    taken?: boolean;
    rating?: number;
  } | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const [editedMedication, setEditedMedication] = useState({
    medicationName: "",
    medicationType: "",
    dose: "",
    startDate: "",
    endDate: "",
    reminderType: "",
    rating: 0,
  });

  useEffect(() => {
    if (id && typeof id === "string") {
      const fetchMedication = async () => {
        try {
          const docRef = doc(db, "medication", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setMedication({
              medicationName: data.medicationName || "",
              medicationType: data.medicationType || "",
              dose: data.dose || "",
              startDate: data.startDate || "",
              endDate: data.endDate || "",
              reminderType: data.reminderType || "",
              taken: data.taken || false,
              rating: data.rating || 0,
            });

            setEditedMedication({
              medicationName: data.medicationName || "",
              medicationType: data.medicationType || "",
              dose: data.dose || "",
              startDate: data.startDate || "",
              endDate: data.endDate || "",
              reminderType: data.reminderType || "",
              rating: data.rating || 0,
            });
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching document: ", error);
        }
      };

      fetchMedication();
    }
  }, [id]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    if (id && medication) {
      Alert.alert(
        "Confirm Changes",
        "Are you sure you want to save these changes?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Confirm",
            onPress: async () => {
              try {
                const docRef = doc(db, "medication", id as string);
                await updateDoc(docRef, editedMedication);
                setMedication({ ...medication, ...editedMedication });
                setIsEditing(false);
                Alert.alert("Success", "Medication updated successfully!");
                router.back();
              } catch (error) {
                console.error("Error updating document: ", error);
                Alert.alert("Error", "Failed to update medication.");
              }
            },
          },
        ]
      );
    }
  };

  const handleCancel = () => {
    setEditedMedication({
      medicationName: medication?.medicationName || "",
      medicationType: medication?.medicationType || "",
      dose: medication?.dose || "",
      startDate: medication?.startDate || "",
      endDate: medication?.endDate || "",
      reminderType: medication?.reminderType || "",
      rating: medication?.rating || 0,
    });
    setIsEditing(false);
  };

  if (!id) return <Text>Loading...</Text>;
  if (!medication) return <Text>Loading medication details...</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.topHalfCircle} />

      <View style={{ position: "absolute", top: 70, left: 20, zIndex: 10 }}>
        { (
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
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <FontAwesome5
              name="angle-double-left"
              size={30}
              color="#FFD700" 
              onPress={() => router.back()}
            />
            <Text style={styles.backText}>Back</Text>
          </MotiView>
        ) }
      </View>

      
{!isEditing && (
  <Text style={[styles.title, { color: "#062654" }]}>
    {medication.medicationName}
  </Text>
)}


      <View style={styles.card}>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsTitle}>Name: </Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedMedication.medicationName}
              onChangeText={(text) =>
                setEditedMedication({
                  ...editedMedication,
                  medicationName: text,
                })
              }
            />
          ) : (
            <Text style={styles.details}>{medication.medicationName}</Text>
          )}
        </View>

        {["medicationType", "dose", "startDate", "endDate", "reminderType"].map(
          (field) => (
            <View key={field} style={styles.detailsRow}>
              <Text style={styles.detailsTitle}>
                {field === "startDate"
                  ? "Start Date: "
                  : field === "endDate"
                  ? "End Date: "
                  : field === "reminderType"
                  ? "Reminder Type: "
                  : field === "medicationType"
                  ? "Type: "
                  : field[0].toUpperCase() + field.slice(1) + ": "}
              </Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={(
                    editedMedication[field as keyof typeof editedMedication] ||
                    ""
                  ).toString()}
                  onChangeText={(text) =>
                    setEditedMedication({ ...editedMedication, [field]: text })
                  }
                />
              ) : (
                <Text style={styles.details}>
                  {medication[field as keyof typeof medication]}
                </Text>
              )}
            </View>
          )
        )}

        <View style={styles.ratingContainer}>
          <Text style={styles.detailsTitle}>Rating: </Text>
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesome
              key={star}
              name={editedMedication.rating >= star ? "star" : "star-o"}
              size={20}
              color={editedMedication.rating >= star ? "#FFD700" : "#DDD"}
              onPress={() =>
                isEditing &&
                setEditedMedication({ ...editedMedication, rating: star })
              }
            />
          ))}
        </View>
      </View>

      {!isEditing && (
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: "#062654" }]}
          onPress={handleEdit}
        >
          <Text style={styles.saveButtonText}>Edit Medication</Text>
        </TouchableOpacity>
      )}

      {isEditing && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
    paddingTop: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  topHalfCircle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "60%",
    backgroundColor: "#062654",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    zIndex: 1,
    
  },
  title: {
    fontSize: 35,
    fontWeight: "700",
    color: "#062654", 
    marginTop: 100, 
    marginBottom: 2,
    lineHeight: 45,
  },
  card: {
    padding: 25,
    borderRadius: 15,
    marginBottom: 9,
    width: "99%",
    maxWidth: 350,
  },
  detailsRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  detailsTitle: {
    
    fontSize: 18,
    color: "#062654",
    width: "35%",
    fontWeight: "bold",
  },
  details: {
    fontSize: 17,
    color: "black",
    width: "65%",
    padding: 3,
  },
  input: {
    fontSize: 16,
    width: "70%",
    height: 35,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 25,
    borderWidth: 0.5, 
    borderColor: "#062654", 
    
    
  
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#062654",
    padding: 15,
    borderRadius: 25,
    marginTop: -30,
    width: "80%",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  backText: {
    color: "#FFF",
    marginLeft: 5,
    fontSize: 20,
    fontWeight: "600",
  },
  cancelText: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
  },
});

export default MedicationDetail;
