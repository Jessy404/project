import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const userName = "John"; // اسم المستخدم
const userImage = "https://randomuser.me/api/portraits/men/32.jpg"; // رابط صورة واضحة
const currentMonth = new Date().toLocaleString("default", { month: "long" }); // الشهر الحالي
const currentYear = new Date().getFullYear(); // السنة الحالية

const medicinesData = {
  7: [
    { id: "1", name: "Ibuprofen", time: "7:00 PM", dose: "2 Tablets", schedule: "Before Sleeping", icon: "pill", status: "done" },
    { id: "2", name: "Paracetamol", time: "8:00 PM", dose: "1 Tablet", schedule: "After Dinner", icon: "pill", status: "done" },
    { id: "3", name: "Vitamin C", time: "9:00 PM", dose: "1 Capsule", schedule: "Before Bed", icon: "pill", status: "missed" },
    { id: "4", name: "Aspirin", time: "6:00 AM", dose: "1 Tablet", schedule: "Morning Dose", icon: "pill", status: "done" },
    { id: "5", name: "Cough Syrup", time: "10:00 AM", dose: "2 ml", schedule: "After Breakfast", icon: "bottle-tonic-plus", status: "missed" },
    { id: "6", name: "Antibiotics", time: "2:00 PM", dose: "1 Tablet", schedule: "Afternoon Dose", icon: "pill", status: "done" },
    { id: "7", name: "Pain Reliever", time: "4:00 PM", dose: "1 Capsule", schedule: "Evening Dose", icon: "pill", status: "done" },
    { id: "8", name: "Eye Drops", time: "8:00 PM", dose: "2 Drops", schedule: "Before Bed", icon: "eye", status: "missed" },
    { id: "9", name: "Vitamin D", time: "12:00 PM", dose: "1 Tablet", schedule: "After Lunch", icon: "pill", status: "done" },
  ],
};

const challenges = [
  { id: "1", title: "Drink More Water", icon: "cup-water" },
  { id: "2", title: "Exercise Daily", icon: "run" },
  { id: "3", title: "Healthy Diet", icon: "food-apple" },
  { id: "4", title: "Sleep 7 Hours", icon: "bed" },
  { id: "5", title: "Avoid Sugar", icon: "food-off" },
  { id: "6", title: "Read Books", icon: "book-open-page-variant" },
  { id: "7", title: "Meditation", icon: "yoga" },
  { id: "8", title: "Walk 5 KM", icon: "walk" },
  { id: "9", title: "Stretching", icon: "human-handsdown" },
  { id: "10", title: "Play a Sport", icon: "soccer" },
  { id: "11", title: "Learn Cooking", icon: "chef-hat" },
  { id: "12", title: "Practice Yoga", icon: "human-yoga" },
  { id: "13", title: "Reduce Screen Time", icon: "laptop-off" },
  { id: "14", title: "Volunteer", icon: "hand-heart" },
  { id: "15", title: "Spend Time in Nature", icon: "pine-tree" },
  { id: "16", title: "Write a Journal", icon: "notebook-outline" },
  { id: "17", title: "Learn a New Skill", icon: "school" },
  { id: "18", title: "Create Art", icon: "palette" },
  { id: "19", title: "Listen to Music", icon: "music-circle" },
  { id: "20", title: "Dance", icon: "dance-ballroom" },
];


const Calendar = ({ onSelectDate, selected }) => {
  const days = Array.from({ length: 31 }, (_, i) => ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][i % 7]); // توزيع الأيام
  const dates = Array.from({ length: 31 }, (_, i) => i + 1); // إنشاء 31 يومًا

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.calendarScrollView}>
      <View style={styles.calendarContainer}>
        {dates.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dayContainer, selected === date && styles.selectedDay]}
            onPress={() => onSelectDate(date)}
          >
            <Text style={styles.dayText}>{days[index % 7]}</Text>
            <View style={[styles.dateCircle, selected === date && styles.selectedDate]}>
              <Text style={styles.dateText}>{date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};




const MedicineItem = ({ name, time, dose, schedule, icon, status }) => (
  <View style={styles.medicineItemContainer}>
    <MaterialCommunityIcons name={icon} size={40} color="#3B8C94" style={styles.icon} />
    <View style={styles.details}>
      <Text style={styles.medicineName}>{name}</Text>
      <Text style={styles.scheduleText}>{schedule}</Text>
      <Text style={styles.doseText}>{dose}</Text>
    </View>
    <View style={styles.statusContainer}>
      <Text style={styles.timeText}>{time}</Text>
      <Ionicons
        name={status === "done" ? "checkmark-done-circle-outline" : "alert-circle-outline"}
        size={30}
        color={status === "done" ? "#4CAF50" : "#FF5733"}
      />
    </View>
  </View>
);

const ChallengeItem = ({ title, icon }) => (
  <View style={styles.itemContainer}>
    <MaterialCommunityIcons name={icon} size={30} color="#3B8C94" />
    <Text style={styles.itemText}>{title}</Text>
  </View>
);

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState(7);
  const medicines = medicinesData[selectedDate] || [];

  return (
    <ScrollView style={styles.container}>
      {/* الهيدر */}
      <View style={styles.headerContainer}>
        <Image source={{ uri: userImage }} style={styles.userImage} />
        <View style={styles.textContainer}>
          <Text style={styles.headerText}>Hello, {userName}</Text>
          <Text style={styles.headerSubText}>Stay on track with your health goals!</Text>
        </View>
      </View>

      {/* الكاليندر */}
      <View style={styles.calendarHeader}>
        <Text style={styles.sectionTitle}>Calendar</Text>
        <Text style={styles.dateText}>{`${currentMonth} ${currentYear}`}</Text>
      </View>
      <Calendar onSelectDate={setSelectedDate} selected={selectedDate} />

      {/* قسم الأدوية */}
      <View>
        <Text style={styles.sectionTitle}>My Medication</Text>
        <FlatList
          data={medicines}
          horizontal={true}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MedicineItem {...item} />}
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
      </View>

      {/* قسم التحديات */}
      <View>
        <Text style={styles.sectionTitle}>My Challenges</Text>
        <FlatList
          data={challenges}
          horizontal={true}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChallengeItem {...item} />}
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
   // backgroundColor: "#1976D2",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  headerSubText: {
    fontSize: 16,
    color: "black",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1565C0",
  },
  dateText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0D47A1",
  },
  calendarScrollView: {
    marginVertical: 10,
  },
  calendarContainer: {
    flexDirection: "row",
  },
  dayContainer: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  selectedDay: {
    backgroundColor: "#1976D2",
    borderRadius: 20,
    padding: 5,
  },
  dayText: {
    fontSize: 20,
    color: "#0D47A1",
  },
  dateCircle: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
  },
  medicineItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemContainer: {
    backgroundColor: "#BBDEFB",
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default HomeScreen;

