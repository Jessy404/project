import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image } from "react-native";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import { collection, getDocs, query, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db } from "@/config/firebaseConfig";

type Medication = {
  docID: string;
  medicationName: string;
  medicationType: string;
  dose: string;
  startDate: string;
  endDate: string;
  reminderType: string;
  userEmail: string;
  dosesPerDay: number;
  taken?: boolean;
  rating?: number;
  imageUrl?: string;
};
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
const MyMedication = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [medications, setMedications] = useState<Medication[]>([]);
  const storage = getStorage();
  const filteredMedications = medications.filter((medication) =>
    medication.medicationName.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) return;

    const q = query(collection(db, "medication"));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const medicationsData: Medication[] = [];
      
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        if (data.userEmail === currentUser.email) {
          let imageUrl = '';
          
          // Try to get medication image from Firebase Storage
          try {
            if (data.imagePath) {
              const imageRef = ref(storage, data.imagePath);
              imageUrl = await getDownloadURL(imageRef);
            }
          } catch (error) {
            console.log("Error getting medication image:", error);
          }

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
            dosesPerDay: data.dosesPerDay || 1,
            imageUrl: imageUrl || ''
          });
        }
      }
      setMedications(medicationsData);
    });

    return () => unsubscribe();
  }, []);

  const getNextDoseTime = (dosesPerDay: number) => {
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



  const renderItem = ({ item }: { item: Medication }) => {
    if (!item) return null;

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>

          <View style={styles.imageContainer}>
            {item.imageUrl ? (
              <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.medicationImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.defaultImage}>
                <FontAwesome5 name="pills" size={40} color="#2265A2" />
              </View>
            )}
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.header}>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <Text style={styles.medName}>
                  {item.medicationName} <Text style={styles.medType}>({item.medicationType})</Text>
                </Text>
              </View>
              {item.taken && (
                <FontAwesome name="check-circle" size={22} color="#4CAF50" style={{ marginLeft: 10 }} />
              )}
            </View>

            <Text style={styles.details}>Dose: {item.dose} mlg</Text>
            <Text style={styles.details}>
              Next Dose: {getNextDoseTime(item.dosesPerDay)}
            </Text>
            <Text style={styles.details}>
              Doses Per Day: {item.dosesPerDay}
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
          </View>
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
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: "row",
    padding: 15,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 15,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicationImage: {
    width: '100%',
    height: '100%',
  },
  defaultImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
  },
  infoContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  medName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2265A2",
    marginRight: 10,
  },
  medType: {
    fontSize: 14,
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
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
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