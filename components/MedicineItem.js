// components/MedicineItem.js

import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const MedicineItem = ({ name, type, image, time, dose, schedule, status }) => {
  const [isTimeForMedication, setIsTimeForMedication] = useState(false);

  useEffect(() => {
    const now = new Date();
    const [medHour, medMinute] = time.replace(/[APM]/gi, '').split(':').map(Number);
    const isPM = time.includes('PM') && medHour !== 12;
    const isAM12 = time.includes('AM') && medHour === 12;
    const hour24 = isAM12 ? 0 : (isPM ? medHour + 12 : medHour);

    const medicationTime = new Date();
    medicationTime.setHours(hour24, medMinute, 0, 0);

    const timeDiff = Math.abs(now.getTime() - medicationTime.getTime());
    const isWithin30Minutes = timeDiff <= 30 * 60 * 1000;

    setIsTimeForMedication(isWithin30Minutes);

    if (isWithin30Minutes && status !== 'done') {
      console.log(`Time to take ${name}!`);
    }
  }, [time, status, name]);

  return (
    <View style={styles.medicineItemContainer}>
      <Image source={{ uri: image }} style={styles.medicineImage} resizeMode="contain" />
      <View style={styles.medicineDetails}>
        <View style={styles.medicineHeader}>
          <Text style={styles.medicineName}>{name} ({type})</Text>
          {status === "done" ? (
            <MaterialCommunityIcons name="check-circle" size={24} color="#34A853" />
          ) : (
            <MaterialCommunityIcons
              name={isTimeForMedication ? "bell-ring" : "alert-circle"}
              size={24}
              color={isTimeForMedication ? "#FFA000" : "#062654"}
            />
          )}
        </View>

        <View style={styles.medicineInfoRow}>
          <MaterialCommunityIcons name="clock-outline" size={18} color="#ffffff" />
          <Text style={styles.medicineInfoText}>{time}</Text>
        </View>

        <View style={styles.medicineInfoRow}>
          <MaterialCommunityIcons name="pill" size={18} color="#ffffff" />
          <Text style={styles.medicineInfoText}>{dose}</Text>
        </View>

        <View style={styles.medicineInfoRow}>
          <MaterialCommunityIcons name="calendar-clock" size={18} color="#ffffff" />
          <Text style={styles.medicineInfoText}>{schedule}</Text>
        </View>

        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesome
              key={star}
              name={star <= 3 ? "star" : "star-o"}
              size={16}
              color="#FFD700"
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  medicineItemContainer: {
    flexDirection: "row",
    backgroundColor: "#062654",
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 10,
  },
  medicineImage: {
    width: 70,
    height: 70,
    marginRight: 16,
  },
  medicineDetails: {
    flex: 1,
  },
  medicineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    fontFamily: 'Inter-SemiBold',
  },
  medicineInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  medicineInfoText: {
    fontSize: 14,
    color: "#ffffff",
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
});

export default MedicineItem;
