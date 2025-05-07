import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";
import { Pressable } from "react-native";
import { MotiPressable } from "moti/build/interactions";
import { Easing } from "react-native-reanimated";

const MedicationDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [medication, setMedication] = useState<{
    image: string;
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
    name: "",
    type: "",
    time: "",
    dose: "",
    startDate: "",
    endDate: "",
    expiry: "",
    rating: 0,
  });
  const medications = [
    {
      id: "1",
      name: "Paracetamol",
      type: "Tablet",
      time: "08:00 AM",
      dose: "500mg",
      expiry: "12/2025",
      rating: 4,
      startDate: "01/01/2023",
      endDate: "12/2023",
      image: "https://via.placeholder.com/150/2265A2/FFFFFF?text=P", 
    },
    {
      id: "2",
      name: "Vitamin C",
      type: "Syrup",
      time: "12:00 PM",
      dose: "1000mg",
      expiry: "06/2024",
      rating: 5,
      startDate: "01/01/2023",
      endDate: "06/2024",
      image: "https://cdn.shopify.com/s/files/1/0218/7873/4920/files/3600542524261_1-min_600x600.png?v=1707300884",},
    {
      id: "3",
      name: "Ibuprofen",
      type: "Injection",
      time: "06:00 PM",
      dose: "400mg",
      expiry: "09/2026",
      rating: 3,
      startDate: "02/01/2023",
      endDate: "02/2024",
      image: "https://via.placeholder.com/150/2265A2/FFFFFF?text=I",
    },
  ];
  
  useEffect(() => {
    if (id) {
      const medicationData = medications.find((med) => med.id === id);
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
          time: medicationData.time,
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
<View style={styles.topHalfCircle}></View>
{medication?.image && (
  // <View style={styles.imageContainer}>
    <Image
      source={{ uri: medication.image }}
      style={styles.medicationImage}
      // resizeMode="cover"
    />
  // </View>
)}

{/* Back Button */}
<View style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }}>
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
    style={{
      padding: 12, 
    }}
  >
    <FontAwesome5
      name="angle-double-left"
      size={28}
      color="#FFF"
      onPress={() => router.back()}
    />
  </MotiView>
</View>


      <View 
      style={styles.card}
      >
        <Text style={styles.title}>
          {isEditing ? (
            <TextInput
              style={[styles.input, { textAlign: "center" }]}
              value={editedMedication.name}
              onChangeText={(text) =>
                setEditedMedication({ ...editedMedication, name: text })
              }
            />
          ) : (
            medication.name
          )}
        </Text>

        {["type", "dose", "time", "startDate", "endDate", "expiry"].map((field) => (
          <View key={field} style={styles.detailsRow}>
            <Text style={styles.detailsTitle}>
              {field === "startDate"
                ? "Start Date: "
                : field === "endDate"
                ? "End Date: "
                : field[0].toUpperCase() + field.slice(1) + ": "}
            </Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={(editedMedication[field as keyof typeof editedMedication] || "").toString()}
                onChangeText={(text) =>
                  setEditedMedication({ ...editedMedication, [field as keyof typeof editedMedication]: text })
                }
              />
            ) : (
              <Text style={styles.details}>{medication[field as keyof typeof medication]}</Text>
            )}
          </View>
        ))}

        <View style={styles.ratingContainer}>
          <Text style={styles.detailsTitle}>Rating: </Text>
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesome
              key={star}
              name={editedMedication.rating >= star ? "star" : "star-o"}
              size={20}
              color={editedMedication.rating >= star ? "#FFD700" : "#DDD"}
              onPress={() =>
                isEditing && setEditedMedication({ ...editedMedication, rating: star })
              }
            />
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={isEditing ? handleSave : handleEdit}
      >
        <Text style={styles.editButtonText}>
          {isEditing ? "Save Changes" : "Edit Medication"}
        </Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  topHalfCircle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "#2265A2",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
 backButton: {
  position: "absolute",
  top: 50,
  left: 20,
  padding: 12,
  backgroundColor: "#000",
  borderRadius: 30,
  elevation: 5,
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
},
medicationImage: {
  width: 420,
  height: 420,
  // right: -10,
  bottom: -3,
  // top: 0,


},

imageContainer: {
  position: "absolute",
  top: 80,
  bottom: 90,
  alignSelf: "center",
  zIndex: 5,
},


  title: {
    fontSize: 40,
    fontWeight: "700",
    color: "#000",
    textAlign: 'left',
    marginBottom: 20,
  },
  card: {
    // backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 15,
    marginBottom: 10,
    // shadowColor: "#000",
    // shadowOpacity: 0.15,
    top: -40,
    // shadowRadius: 10,
    // shadowOffset: { width: 0, height: 2 },
    // elevation: 5,
    width: "99%",
    maxWidth: 350,
  },
  detailsRow: {
    flexDirection: "row",
    // borderRadius: 10,
    // borderWidth: 1,
    // borderColor: "#ccc",
    // justifyContent: "space-between",
    marginBottom: 12,
  },
  details: {
    fontSize: 16,
    color: "#000",
    lineHeight: 22,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  detailsTitle: {
    fontSize: 18,
    color: "#2265A2",
    lineHeight: 22,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16,
    color: "#333",
    width: "60%",
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
    // marginTop: 20,
    elevation: 4,
    top: -20,
  },
  editButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default MedicationDetail;