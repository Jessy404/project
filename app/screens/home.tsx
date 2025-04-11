import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  useColorScheme,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// Removed invalid import
const userName = "John";
const userImage = "https://randomuser.me/api/portraits/men/32.jpg";
const currentMonth = new Date().toLocaleString("default", { month: "long" });
const currentYear = new Date().getFullYear();

const sampleMedicines = [
  {
    id: "1",
    name: "Ibuprofen",
    time: "7:00 PM",
    dose: "2 Tablets",
    schedule: "Before Sleeping",
    icon: "pill",
    status: "done",
  },
  {
    id: "2",
    name: "Paracetamol",
    time: "8:00 PM",
    dose: "1 Tablet",
    schedule: "After Dinner",
    icon: "pill",
    status: "done",
  },
  {
    id: "3",
    name: "Vitamin C",
    time: "9:00 PM",
    dose: "1 Capsule",
    schedule: "Before Bed",
    icon: "pill",
    status: "missed",
  },
];

const medicinesData: { [key: number]: typeof sampleMedicines } = {};
for (let i = 1; i <= 31; i++) {
  medicinesData[i] = sampleMedicines;
}

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
  { id: "12", title: "Practice Yoga", icon: "human-handsdown" },
  { id: "13", title: "Reduce Screen Time", icon: "laptop-off" },
  { id: "14", title: "Volunteer", icon: "hand-heart" },
  { id: "15", title: "Spend Time in Nature", icon: "pine-tree" },
  { id: "16", title: "Write a Journal", icon: "notebook-outline" },
  { id: "17", title: "Learn a New Skill", icon: "school" },
  { id: "18", title: "Create Art", icon: "palette" },
  { id: "19", title: "Listen to Music", icon: "music-circle" },
  { id: "20", title: "Dance", icon: "dance-ballroom" },
];

interface CalendarProps {
  onSelectDate: (date: number) => void;
  selected: number;
}

const Calendar: React.FC<CalendarProps> = ({ onSelectDate, selected }) => {
  const days = Array.from({ length: 31 }, (_, i) =>
    ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][i % 7]
  );
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator style={styles.calendarScrollView}>
      <View style={styles.calendarContainer}>
        {dates.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dayContainer, selected === date && styles.selectedDay]}
            onPress={() => onSelectDate(date)}
          >
            <Text style={[styles.dayText, selected === date && styles.selectedDayText]}>{days[index % 7]}</Text>
            <View style={[styles.dateCircle, selected === date && styles.selectedDate]}>
              <Text style={[styles.dateText, selected === date && styles.selectedDateText]}>{date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};



interface MedicineItemProps {
  name: string;
  time: string;
  dose: string;
  schedule: string;
  icon: string;
  status: string;
}

const MedicineItem: React.FC<MedicineItemProps> = ({ name, time, dose, schedule, icon, status }) => (
  <View style={styles.medicineItemContainer}>
    <MaterialCommunityIcons name={icon as any } size={40} color="#3B8C94" style={styles.icon} />
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

interface ChallengeItemProps {
  title: string;
  icon: string;
}

const ChallengeItem: React.FC<ChallengeItemProps> = ({ title, icon }) => (
  <View style={styles.challengeContainer}>
    <MaterialCommunityIcons name={icon as any} size={30} color="#3B8C94" />
    <Text style={styles.itemText}>{title}</Text>
  </View>
);

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState(1);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const medicines = medicinesData[selectedDate] || [];

  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.darkMode : styles.lightMode]}>
      <View style={styles.headerContainer}>
        <Image source={{ uri: userImage }} style={styles.userImage} />
        <View style={styles.textContainer}>
          <Text style={[styles.headerText, isDarkMode && { color: "#fff" }]}>{greeting}, {userName}</Text>
          <Text style={[styles.headerSubText, isDarkMode && { color: "#ccc" }]}>Stay on track with your health goals!</Text>
        </View>
      </View>

      <View style={styles.calendarHeader}>
        <Text style={[styles.sectionTitle, isDarkMode && { color: "#fff" }]}>Calendar</Text>
        <Text style={[styles.dateText, isDarkMode && { color: "#ccc" }]}>{`${currentMonth} ${currentYear}`}</Text>
      </View>

      <Calendar onSelectDate={setSelectedDate} selected={selectedDate} />

      <View>
        <Text style={[styles.sectionTitle, isDarkMode && { color: "#fff" }]}>My Medication</Text>
        <FlatList
          data={medicines}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MedicineItem {...item} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
      </View>

      <View>
        <Text style={[styles.sectionTitle, isDarkMode && { color: "#fff" }]}>My Challenges</Text>
        <FlatList
          data={challenges}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChallengeItem {...item} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightMode: {
    backgroundColor: "#FFFFFF",
  },
  darkMode: {
    backgroundColor: "#121212",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubText: {
    fontSize: 14,
    color: "#777",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1565C0",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D47A1",
  },
  calendarScrollView: {
    marginVertical: 10,
  },
  calendarContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  dayContainer: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  selectedDay: {
    borderRadius: 10,
    padding: 5,
  },
  dayText: {
    fontSize: 14,
    color: "#0D47A1",
  },
  selectedDayText: {
    color: "#fff",
  },
  dateCircle: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 10,
    marginTop: 5,
  },
  selectedDate: {
    backgroundColor: "#1976D2",
  },
  selectedDateText: {
    color: "#fff",
  },
  medicineItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    minWidth: 280,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  scheduleText: {
    fontSize: 14,
    color: "#555",
  },
  doseText: {
    fontSize: 13,
    color: "#777",
  },
  statusContainer: {
    alignItems: "center",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  challengeContainer: {
    backgroundColor: "#BBDEFB",
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 140,
  },
  itemText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    color: "#1565C0",
  },
});

export default HomeScreen;