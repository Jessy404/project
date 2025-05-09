import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs, query, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { getAuth } from "firebase/auth";


type Medication = {
  docID: string;
  medicationName: string;
  medicationType: string;
  dose: string;
  startDate: string;
  endDate: string;
  reminderType: string;
  userEmail: string;
  taken?: boolean;
  rating?: number;
};

const MyMedication = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
  
    if (!currentUser) return;
  
    const q = query(collection(db, "medication"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const medicationsData: Medication[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userEmail === currentUser.email) {
          medicationsData.push({
            docID: doc.id,
            medicationName: data.medicationName,
            medicationType: data.medicationType,
            dose: data.dose,
            startDate: data.startDate,
            endDate: data.endDate,
            reminderType: data.reminderType,
            userEmail: data.userEmail,
            taken: data.taken !== undefined ? data.taken : false,
            rating: data.rating || 0,
          });
        }
      });
      setMedications(medicationsData);
    });
  
    return () => unsubscribe();
  }, []);
  
     

  const handleViewMedication = (docID: string) => {
    router.push({ pathname: "/screens/MedicationDetail", params: { id: docID } });


  };

  const handleDelete = async (docID: string) => {
    try {
      await deleteDoc(doc(db, "medication", docID));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleTaken = async (docID: string) => {
    try {
      const docRef = doc(db, "medication", docID);
      await updateDoc(docRef, {
        taken: true,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleRating = async (docID: string, rating: number) => {
    try {
      const docRef = doc(db, "medication", docID);
      await updateDoc(docRef, {
        rating,
      });
    } catch (error) {
      console.error("Error updating rating: ", error);
    }
  };
const getNextDoseTime = (frequencyPerDay: number) => {
  const now = new Date();

  // ضبط أول جرعة على اليوم الحالي الساعة 8:00 صباحًا
  const firstDose = new Date(now);
  firstDose.setHours(8, 0, 0, 0); // 8:00 صباحًا

  const intervalInMinutes = (24 * 60) / frequencyPerDay;

  for (let i = 0; i < frequencyPerDay; i++) {
    const doseTime = new Date(firstDose.getTime() + i * intervalInMinutes * 60000);
    if (doseTime > now) {
      return doseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }

  // إذا مرّ اليوم، نعرض أول جرعة لليوم التالي
  const nextDayDose = new Date(firstDose.getTime() + 24 * 60 * 60000);
  return nextDayDose.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
  const filteredMedications = medications.filter((item) =>
    item.medicationName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.medicationType.toLowerCase().includes(searchText.toLowerCase()) ||
    item.dose.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }: { item: Medication }) => {
    if (!item) return null;

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
<Text style={styles.details}>
  Next Dose: {getNextDoseTime(item.frequencyPerDay)}
</Text>

         <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRating(item.docID, star)}>
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
                onPress={() => handleTaken(item.docID)}
              >
                <Text style={styles.btnText}>Taken</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.edit]}
              onPress={() => handleViewMedication(item.docID)}
            >
              <Text style={styles.btnText}>View</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.delete]}
              onPress={() => handleDelete(item.docID)}
            >
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>My Medication</Text>
        <View style={styles.searchContainer}>
          <FontAwesome5 name="search" size={18} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchText}
            onChangeText={(text) => setSearchText(text.trimStart())}
            placeholderTextColor="#AAA"
          />
        </View>
      </View>
      {filteredMedications.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>No medications found.</Text>
      ) : (
        <FlatList
          data={filteredMedications}
          keyExtractor={(item) => item.docID}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/screens/AddNewMedication")}>
        <Text style={styles.addButtonText}>Add New Medication</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#062654",
    textAlign: "center",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
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
  ratingContainer: {
    flexDirection: "row",
    marginTop: 10,
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#062654",
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 60,
    marginTop: 10,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MyMedication;