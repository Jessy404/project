import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const MedicationDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // الحصول على id من الـ query params
  const [medication, setMedication] = useState<{
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

  // بيانات محاكاة للميديكشن
  const medications = [
    { id: "1", name: "Paracetamol", type: "Tablet", time: "08:00 AM", dose: "500mg", expiry: "12/2025", rating: 4, startDate: "01/01/2023", endDate: "12/2023" },
    { id: "2", name: "Vitamin C", type: "Syrup", time: "12:00 PM", dose: "1000mg", expiry: "06/2024", rating: 5, startDate: "01/01/2023", endDate: "06/2024" },
    { id: "3", name: "Ibuprofen", type: "Injection", time: "06:00 PM", dose: "400mg", expiry: "09/2026", rating: 3, startDate: "02/01/2023", endDate: "02/2024" },
  ];

  useEffect(() => {
    if (id) {
      // محاكاة تحميل البيانات بناءً على الـ id
      const medicationData = medications.find(med => med.id === id);
      setMedication(medicationData || null);
    }
  }, [id]);

  if (!id) return <Text>Loading...</Text>;

  if (!medication) return <Text>Loading medication details...</Text>;

  const handleEdit = () => {
    // router.push(`/screens/EditMedication?id=${id}`); // إنتقال إلى صفحة التعديل
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHalfCircle}></View> {/* نصف الدائرة الكحلي */}
      <View style={styles.card}>
        <Text style={styles.title}>{medication.name}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsTitle}>Type : </Text>
          <Text style={styles.details}>{medication.type}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsTitle}>Dose : </Text>
          <Text style={styles.details}>{medication.dose}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsTitle}>Start Date : </Text>
          <Text style={styles.details}>{medication.startDate}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsTitle}>End Date : </Text>
          <Text style={styles.details}>{medication.endDate}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsTitle}>Expiry : </Text>
          <Text style={styles.details}>{medication.expiry}</Text>
        </View>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.detailsTitle}>Rating : </Text>
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesome
              key={star}
              name={medication.rating >= star ? "star" : "star-o"}
              size={20}
              color={medication.rating >= star ? "#FFD700" : "#DDD"}
            />
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Text style={styles.editButtonText}>Edit Medication</Text>
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
    justifyContent: 'center',  // توسيط العنصر رأسياً
    alignItems: 'center',  // توسيط العنصر أفقيًا
  },
  topHalfCircle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: "#003366", // اللون الكحلي
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2265A2",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    width: '90%', // جعله يملأ عرض الشاشة مع بعض التباعد
    maxWidth: 400, // تحديد الحد الأقصى لعرض الكارد
  },
  detailsRow: {
    flexDirection: "row",
    // justifyContent: "space-between",
    marginBottom: 12,
  },
  details: {
    fontSize: 18,
    color: "#555",
    lineHeight: 22,
  },
  detailsTitle: {
    fontSize: 18,
    color: "#2265A2",
    fontWeight: "bold",
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
    marginTop: 20,
    elevation: 4,
  },
  editButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default MedicationDetail;
