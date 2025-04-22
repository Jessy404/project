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
import { Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

const userName = "John";
const userImage = "https://randomuser.me/api/portraits/men/32.jpg";
const currentMonth = new Date().toLocaleString("default", { month: "long" });
const currentYear = new Date().getFullYear();

const sampleMedicines = [
  {
    id: "1",
    name: "Ibuprofen",
    type: "Tablet",
    time: "7:00 PM",
    dose: "2 Tablets",
    schedule: "Before Sleeping",
    icon: "pill",
    status: "done",
    image: "https://cdn.shopify.com/s/files/1/0218/7873/4920/files/3600542524261_1-min_600x600.png?v=1707300884"
  },
  {
    id: "2",
    name: "Paracetamol",
    type: "Tablet",
    time: "8:00 PM",
    dose: "1 Tablet",
    schedule: "After Dinner",
    icon: "pill",
    status: "done",
    image: "https://cdn.shopify.com/s/files/1/0218/7873/4920/files/3600542524261_1-min_600x600.png?v=1707300884"
  },
  {
    id: "3",
    name: "Vitamin C",
    type: "Capsule",
    time: "9:00 PM",
    dose: "1 Capsule",
    schedule: "Before Bed",
    icon: "pill",
    status: "missed",
    image: "https://cdn.shopify.com/s/files/1/0218/7873/4920/files/3600542524261_1-min_600x600.png?v=1707300884"
  },
];

const medicinesData: { [key: number]: typeof sampleMedicines } = {};
for (let i = 1; i <= 31; i++) {
  medicinesData[i] = sampleMedicines;
}

const challenges = [
  { id: "1", title: "Drink More Water", icon: "cup-water", progress: 80 },
  { id: "2", title: "Exercise Daily", icon: "run", progress: 65 },
  { id: "3", title: "Healthy Diet", icon: "food-apple", progress: 90 },
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
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarScrollView}>
      <View style={styles.calendarContainer}>
        {dates.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dayContainer, selected === date && styles.selectedDay]}
            onPress={() => onSelectDate(date)}
          >
            <Text style={[styles.dayText, selected === date && styles.selectedDayText]}>
              {days[index % 7]}
            </Text>
            <View style={[styles.dateCircle, selected === date && styles.selectedDate]}>
              <Text style={[styles.dateText, selected === date && styles.selectedDateText]}>
                {date}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

interface MedicineItemProps {
  name: string;
  type: string;
  time: string;
  dose: string;
  schedule: string;
  icon: string;
  status: string;
  image: string;
}

const MedicineItem: React.FC<MedicineItemProps> = ({ name, type, time, dose, schedule, icon, status, image }) => (
  <View style={styles.medicineItemContainer}>
    <Image source={{ uri: image }} style={styles.medicineImage} resizeMode="contain" />
    <View style={styles.medicineDetails}>
      <View style={styles.medicineHeader}>
        <Text style={styles.medicineName}>{name} ({type})</Text>
        {status === "done" ? (
          <MaterialCommunityIcons name="check-circle" size={24} color="#34A853" />
        ) : (
          <MaterialCommunityIcons name="alert-circle" size={24} color="#EA4335" />
        )}
      </View>
      
      <View style={styles.medicineInfoRow}>
        <MaterialCommunityIcons name="clock-outline" size={18} color="#5F6368" />
        <Text style={styles.medicineInfoText}>{time}</Text>
      </View>
      
      <View style={styles.medicineInfoRow}>
        <MaterialCommunityIcons name="pill" size={18} color="#5F6368" />
        <Text style={styles.medicineInfoText}>{dose}</Text>
      </View>
      
      <View style={styles.medicineInfoRow}>
        <MaterialCommunityIcons name="calendar-clock" size={18} color="#5F6368" />
        <Text style={styles.medicineInfoText}>{schedule}</Text>
      </View>
      
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesome
            key={star}
            name={star <= 3 ? "star" : "star-o"} // Default 3 stars rating
            size={16}
            color="#FFD700"
          />
        ))}
      </View>
    </View>
  </View>
);

interface ChallengeItemProps {
  title: string;
  icon: string;
  progress: number;
}

const ChallengeItem: React.FC<ChallengeItemProps> = ({ title, icon, progress }) => (
  <View style={styles.challengeContainer}>
    <View style={styles.challengeIconContainer}>
      <MaterialCommunityIcons name={icon as any} size={24} color="#1A73E8" />
    </View>
    <Text style={styles.challengeTitle}>{title}</Text>
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: `${progress}%` }]} />
    </View>
    <Text style={styles.progressText}>{progress}%</Text>
  </View>
);

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
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
    <ScrollView style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Image source={{ uri: userImage }} style={styles.userImage} />
            <View>
              <Text style={[styles.greetingText, isDarkMode && styles.darkText]}>{greeting}</Text>
              <Text style={[styles.userName, isDarkMode && styles.darkText]}>{userName}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={isDarkMode ? "#fff" : "#1A73E8"} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.headerSubText, isDarkMode && styles.darkSubText]}>
          Stay on track with your health goals!
        </Text>
      </View>

      {/* Calendar Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Calendar</Text>
          <Text style={[styles.monthText, isDarkMode && styles.darkSubText]}>{`${currentMonth} ${currentYear}`}</Text>
        </View>
        <Calendar onSelectDate={setSelectedDate} selected={selectedDate} />
      </View>

      {/* Medication Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Today's Medication</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={medicines}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MedicineItem {...item} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.medicineList}
        />
      </View>

      {/* Challenges Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Health Challenges</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={challenges}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChallengeItem {...item} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.challengeList}
        />
      </View>

      {/* Stats Section */}
      <View style={[styles.statsContainer, isDarkMode ? styles.darkStatsContainer : styles.lightStatsContainer]}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>24</Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkSubText]}>Medications</Text>
        </View>
        <View style={styles.statSeparator} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>18</Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkSubText]}>Completed</Text>
        </View>
        <View style={styles.statSeparator} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>85%</Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkSubText]}>Success Rate</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: "#F8FAFD",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  headerContainer: {
    padding: 24,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#1A73E8",
  },
  greetingText: {
    fontSize: 16,
    color: "#5F6368",
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#202124",
  },
  darkText: {
    color: "#FFFFFF",
  },
  headerSubText: {
    fontSize: 14,
    color: "#5F6368",
    marginTop: 8,
  },
  darkSubText: {
    color: "#9AA0A6",
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(26, 115, 232, 0.1)",
  },
  sectionContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#202124",
  },
  monthText: {
    fontSize: 14,
    color: "#5F6368",
    fontWeight: "500",
  },
  viewAllText: {
    fontSize: 14,
    color: "#1A73E8",
    fontWeight: "500",
  },
  calendarScrollView: {
    marginBottom: 8,
  },
  calendarContainer: {
    flexDirection: "row",
    paddingBottom: 8,
  },
  dayContainer: {
    alignItems: "center",
    marginHorizontal: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  selectedDay: {
    backgroundColor: "rgba(26, 115, 232, 0.1)",
    borderRadius: 12,
  },
  dayText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#5F6368",
    marginBottom: 6,
  },
  selectedDayText: {
    color: "#1A73E8",
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  selectedDate: {
    backgroundColor: "#1A73E8",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#202124",
  },
  selectedDateText: {
    color: "#FFFFFF",
  },
  medicineList: {
    paddingRight: 16,
  },
  medicineItemContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  medicineImage: {
    width: 80,
    height: 80,
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
    color: "#202124",
  },
  medicineInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  medicineInfoText: {
    fontSize: 14,
    color: "#5F6368",
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  challengeList: {
    paddingRight: 16,
  },
  challengeContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  challengeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(26, 115, 232, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#202124",
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E8F0FE",
    marginBottom: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1A73E8",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: "#5F6368",
    textAlign: "right",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    paddingVertical: 20,
  },
  lightStatsContainer: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  darkStatsContainer: {
    backgroundColor: "#1E1E1E",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1A73E8",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#5F6368",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statSeparator: {
    width: 1,
    backgroundColor: "#E0E0E0",
  },
});

export default HomeScreen;