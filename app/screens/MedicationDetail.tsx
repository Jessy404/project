import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { db } from "../../config/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
// Removed unused imports related to storage

const { width } = Dimensions.get('window');

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
    imageUrl?: string;
  } | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

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
            
            // Removed image fetching logic as 'storage' is not available
            let imageUrl = '';

            setMedication({
              medicationName: data.medicationName || "",
              medicationType: data.medicationType || "",
              dose: data.dose || "",
              startDate: data.startDate || "",
              endDate: data.endDate || "",
              reminderType: data.reminderType || "",
              taken: data.taken || false,
              rating: data.rating || 0,
              imageUrl: imageUrl
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
        } finally {
          setImageLoading(false);
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
  if (!medication) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#062654" />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Section with Image */}
      <View style={styles.topSection}>
        <View style={styles.topHalfCircle} />
        
        <View style={styles.imageContainer}>
          {medication.imageUrl ? (
            <Image 
              source={{ uri: medication.imageUrl }}
              style={styles.medicationImage}
              resizeMode="contain"
              onLoadEnd={() => setImageLoading(false)}
            />
          ) : (
            <View style={styles.defaultImage}>
              <FontAwesome5 
                name="pills" 
                size={60} 
                color="#FFF" 
                style={{ opacity: 0.8 }}
              />
            </View>
          )}
          
          {imageLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#FFF" />
            </View>
          )}
        </View>
      </View>

      {/* Back Button */}
      <View style={styles.backButtonContainer}>
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
      </View>

      {/* Medication Title */}
      {!isEditing && (
        <Text style={styles.title}>
          {medication.medicationName}
        </Text>
      )}

      {/* Medication Details */}
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

      {/* Edit/Save Buttons */}
      {!isEditing ? (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#062654" }]}
          onPress={handleEdit}
        >
          <Text style={styles.actionButtonText}>Edit Medication</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.editButtonsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: "#E74C3C" }]}
            onPress={handleCancel}
          >
            <Text style={styles.actionButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: "#062654" }]}
            onPress={handleSave}
          >
            <Text style={styles.actionButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  topSection: {
    height: 250,
    position: 'relative',
    marginBottom: 20,
  },
  topHalfCircle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "#062654",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  imageContainer: {
    position: 'absolute',
    bottom: -50,
    alignSelf: 'center',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  medicationImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  defaultImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
    backgroundColor: '#2265A2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 75,
  },
  backButtonContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backText: {
    color: "#FFF",
    marginLeft: 5,
    fontSize: 20,
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#062654",
    textAlign: 'center',
    marginTop: 30,
    marginBottom: -20,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
    alignItems: 'center',
  },
  actionButton: {
    padding: 15,
    borderRadius: 25,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
  },
});

export default MedicationDetail;