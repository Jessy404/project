import React, { useEffect, useState } from "react";
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
  onPress
}) => {
  const [isTimeForMedication, setIsTimeForMedication] = useState(false);

  // تحديد لون البطاقة بناءً على حالة الدواء
  const cardColor = taken ? '#2E7D32' : '#062654';
  const iconColor = taken ? '#4CAF50' : '#FFD700';

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
        <View style={styles.medicineHeader}>
          <Text style={styles.medicineName}>{medicationName}</Text>
          <MaterialCommunityIcons 
            name={taken ? "check-circle" : isTimeForMedication ? "bell-ring" : "alert-circle"} 
            size={24} 
            color={taken ? "#4CAF50" : "#FFD700"} 
          />
        </View>

        <View style={styles.medicineInfoRow}>
          <MaterialCommunityIcons name={getMedicationIcon()} size={18} color={iconColor} />
          <Text style={styles.medicineInfoText}>النوع: {medicationType}</Text>
        </View>

        <View style={styles.medicineInfoRow}>
          <MaterialCommunityIcons name="numeric" size={18} color={iconColor} />
          <Text style={styles.medicineInfoText}>الجرعة: {dose}</Text>
        </View>

        <View style={styles.medicineInfoRow}>
          <MaterialCommunityIcons name="repeat" size={18} color={iconColor} />
          <Text style={styles.medicineInfoText}>الجرعات اليومية: {dosesPerDay}</Text>
        </View>

        <View style={styles.medicineInfoRow}>
          <MaterialCommunityIcons name={getTimeIcon()} size={18} color={iconColor} />
          <Text style={styles.medicineInfoText}>وقت التناول: {whenToTake}</Text>
        </View>

        {reminderType && (
          <View style={styles.medicineInfoRow}>
            <MaterialCommunityIcons name="bell" size={18} color={iconColor} />
            <Text style={styles.medicineInfoText}>نوع التذكير: {reminderType}</Text>
          </View>
        )}

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
            <Text style={styles.takenText}>تم التناول ✓</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  medicineItemContainer: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },
  medicineImage: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  medicineDetails: {
    flex: 1,
  },
  medicineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    flexShrink: 1,
  },
  medicineInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  medicineInfoText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 8,
    opacity: 0.9,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  takenText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
console.log(`Rendering medication item: ${item.medicationName} | Taken: ${item.taken}`);
export default MedicineItem;
