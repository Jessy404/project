import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

interface MedicationItem {
  docID: string;
  medicationName: string;
  medicationType: string;
  dose: string;
  dosesPerDay: number;
  taken: boolean;
  rating?: number;
}

const MedicineItem: React.FC<{ item: MedicationItem }> = ({ item }) => {
  const router = useRouter();

  const handleViewMedication = () => {
    router.push({ pathname: "/screens/MedicationDetail", params: { id: item.docID } });
  };

  const handleTaken = async () => {
    try {
      const docRef = doc(db, "medication", item.docID);
      await updateDoc(docRef, {
        taken: true,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "medication", item.docID));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleRating = async (rating: number) => {
    try {
      const docRef = doc(db, "medication", item.docID);
      await updateDoc(docRef, {
        rating,
      });
    } catch (error) {
      console.error("Error updating rating: ", error);
    }
  };

const getNextDoseTime = (dosesPerDay: number) => {
  if (typeof dosesPerDay !== 'number' || dosesPerDay <= 0) return "Invalid dose";

  const now = new Date();
  const doseTimes: Date[] = [];
  const intervalInMinutes = (24 * 60) / dosesPerDay;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  for (let i = 0; i < dosesPerDay; i++) {
    const doseTime = new Date(startOfDay.getTime() + i * intervalInMinutes * 60000);
    doseTimes.push(doseTime);
  }

  for (let dose of doseTimes) {
    if (dose > now) {
      return dose.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }

  const nextDayDose = new Date(doseTimes[0].getTime());
  nextDayDose.setDate(nextDayDose.getDate() + 1);
  return nextDayDose.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};


  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Text style={styles.medName}>
              {item.medicationName} <Text style={styles.medType}>({item.medicationType})</Text>
            </Text>
          </View>
          {item.taken && (
            <FontAwesome name="check-circle" size={22} color="#4CAF50" style={{ marginLeft: 10 }} />
          )}
          <FontAwesome5 name="pills" size={24} color="#2265A2" style={{ marginLeft: 10 }} />
        </View>

        <Text style={styles.details}>Dose: {item.dose}</Text>
        <Text style={styles.details}>Next Dose: {getNextDoseTime(item.dosesPerDay)}</Text>
        <Text style={styles.details}>dosesPerDay: {item.dosesPerDay}</Text>

        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleRating(star)}>
              <FontAwesome
                name={(item.rating ?? 0) >= star ? "star" : "star-o"}
                size={18}
                color={(item.rating ?? 0) >= star ? "#FFD700" : "#CCC"}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttons}>
          {!item.taken && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#062654" }]}
              onPress={handleTaken}
            >
              <Text style={styles.btnText}>Taken</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.edit]}
            onPress={handleViewMedication}
          >
            <Text style={styles.btnText}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.delete]}
            onPress={handleDelete}
          >
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardContent: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  medName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2265A2",
    marginRight: 10,
  },
  medType: {
    fontSize: 18,
    color: "#555",
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 5,
  },
  edit: {
    backgroundColor: "#062654",
  },
  delete: {
    backgroundColor: "#062654",
  },
  btnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default MedicineItem;
