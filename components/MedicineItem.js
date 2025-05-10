import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

const MedicineItem = ({
  id,
  medicationName,
  medicationType,
  dose,
  dosesPerDay,
  whenToTake,
  image = "https://via.placeholder.com/150",
  taken = false,
  startDate = "",
  endDate = "",
  reminderType = "",
  rating = 0,
  nextDoseTime = "", // ✅ نضيف وقت الجرعة القادمة
  onPress,
}) => {
  const cardColor = taken ? '#E8F5E9' : '#E3F2FD';
  const iconColor = taken ? '#2E7D32' : '#1976D2';
  const textColor = taken ? '#1B5E20' : '#0D47A1';

  const getMedicationIcon = () => {
    switch ((medicationType || '').toLowerCase()) {
      case 'syrup': return 'bottle-tonic';
      case 'tablet': return 'pill';
      case 'injection': return 'needle';
      case 'capsule': return 'capsule';
      default: return 'pill';
    }
  };

  const getTimeIcon = () => {
    const when = (whenToTake || '').toLowerCase();
    if (when.includes('dinner')) return 'silverware-fork-knife';
    if (when.includes('lunch')) return 'food-turkey';
    if (when.includes('breakfast')) return 'food-croissant';
    return 'clock-outline';
  };

  return (
    <TouchableOpacity 
      style={[styles.medicineItemContainer, { backgroundColor: cardColor }]}
      onPress={onPress}
    >
      <Image source={{ uri: image }} style={styles.medicineImage} resizeMode="cover" />

      <View style={styles.medicineDetails}>
        <View style={styles.headerRow}>
          <Text style={[styles.medicineName, { color: textColor }]}>{medicationName}</Text>
          <MaterialCommunityIcons 
            name={taken ? "check-circle" : "alert-circle"} 
            size={24} 
            color={iconColor}
          />
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name={getMedicationIcon()} size={18} color={iconColor} />
          <Text style={[styles.infoText, { color: textColor }]}>Type: {medicationType}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="numeric" size={18} color={iconColor} />
          <Text style={[styles.infoText, { color: textColor }]}>Dose: {dose}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="repeat" size={18} color={iconColor} />
          <Text style={[styles.infoText, { color: textColor }]}>Doses/Day: {dosesPerDay}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name={getTimeIcon()} size={18} color={iconColor} />
          <Text style={[styles.infoText, { color: textColor }]}>When: {whenToTake}</Text>
        </View>

        {nextDoseTime ? (
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clock-check" size={18} color={iconColor} />
            <Text style={[styles.infoText, { color: textColor }]}>Next: {nextDoseTime}</Text>
          </View>
        ) : null}

        {reminderType ? (
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="bell" size={18} color={iconColor} />
            <Text style={[styles.infoText, { color: textColor }]}>Reminder: {reminderType}</Text>
          </View>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome
                key={star}
                name={star <= rating ? "star" : "star-o"}
                size={16}
                color="#FFD700"
              />
            ))}
          </View>
          {taken && (
            <Text style={styles.doneText}>✓ Taken</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  medicineItemContainer: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
    alignItems: "center",
  },
  medicineImage: {
    width: 70,
    height: 70,
    marginRight: 14,
    borderRadius: 12,
  },
  medicineDetails: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  medicineName: {
    fontSize: 17,
    fontWeight: "700",
    flexShrink: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    opacity: 0.85,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  doneText: {
    color: '#388E3C',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default MedicineItem;
