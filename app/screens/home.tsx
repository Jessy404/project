import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    useColorScheme,
    Platform,
    StatusBar,
} from "react-native";
import HamburgerMenu from "../../components/HamburgerMenu";
import { Ionicons, MaterialCommunityIcons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { auth, db, firestore   } from '../../config/firebaseConfig'; // تأكد من استيراد firestore
import { doc, getDoc, collection } from 'firebase/firestore'; // استيراد الدوال الصحيحة لـ Firestore
import { useContext } from 'react';
import { userDetailContext } from "../../context/userDetailContext";
// Sample data (خليه زي ما هو)
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
    { id: "1", title: "Hydration", icon: "cup-water", progress: 80, color: "#7fade0" },
    { id: "2", title: "Exercise", icon: "run", progress: 65, color: "#50E3C2" },
    { id: "3", title: "Nutrition", icon: "food-apple", progress: 90, color: "#F5A623" },
];

// Components (خليهم زي ما هما)
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
        <FlatList
            horizontal
            data={dates}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item: date, index }) => (
                <TouchableOpacity
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
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendarContainer}
        />
    );
};

interface MedicineItemProps {
    item: typeof sampleMedicines[0];
}

const MedicineItem: React.FC<MedicineItemProps> = ({ item }) => {
    const { name, type, time, dose, schedule, status, image } = item;

    const [isTimeForMedication, setIsTimeForMedication] = useState(false);

    useEffect(() => {
        const now = new Date();
        const [medHour, medMinute] = time.replace(/[APM]/g, '').split(':').map(Number);
        const isPM = time.includes('PM') && medHour !== 12;
        const hour24 = isPM ? medHour + 12 : medHour;

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

interface ChallengeItemProps {
    item: typeof challenges[0];
}

const ChallengeItem: React.FC<ChallengeItemProps> = ({ item }) => (
    <View style={styles.challengeContainer}>
        <View style={[styles.challengeIconContainer, { backgroundColor: `${item.color}20` }]}>

            <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
        </View>
        <Text style={styles.challengeTitle}>{item.title}</Text>
        <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${item.progress}%`, backgroundColor: item.color }]} />


        </View>
        <Text style={[styles.progressText, { color: item.color }]}>{item.progress}%</Text>
    </View>
);

// Main Screen
const HomeScreen = () => {
  const [loggedInUserName, setLoggedInUserName] = useState<string | null>('Guest');
  const [loggedInUserImage, setLoggedInUserImage] = useState<string | null>("https://via.placeholder.com/150");
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    console.log("المستخدم الحالي:", auth.currentUser);
    console.log("قاعدة البيانات Firestore:", db);

    const fetchUserData = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const userRef = doc(db, "users", user.uid); // الطريقة الصحيحة لجلب مستند المستخدم
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    console.log("تم جلب بيانات المستخدم من Firestore:", userData);

                    setLoggedInUserName(userData?.name || 'Guest'); 
                    setLoggedInUserImage(userData?.photoURL || "https://via.placeholder.com/150");
                } else {
                    console.log("لم يتم العثور على مستند المستخدم في Firestore للـ UID:", user.uid);
                }
            } catch (error) {
                console.error("خطأ أثناء جلب بيانات المستخدم من Firestore:", error);
            }
        } else {
            console.log("لا يوجد مستخدم مسجل حالياً.");
        }
    };

    fetchUserData();

    const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
            fetchUserData();
        }
    });

    return () => unsubscribe();
}, []);

useEffect(() => {
    const interval = setInterval(() => {
        setCurrentHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(interval);
}, []);
  const medicines = medicinesData[selectedDate] || [];
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";

  const sections = [
      { type: 'header', id: 'header' },
      { type: 'calendar', id: 'calendar' },
      { type: 'medications', id: 'medications', data: medicines },
      { type: 'challenges', id: 'challenges', data: challenges },
      { type: 'stats', id: 'stats' }
  ];

  const renderItem = ({ item }: { item: typeof sections[0] }) => {
      switch (item.type) {
          case 'header':
              return (
                  <View style={styles.headerContainer}>
                      <View style={styles.headerContent}>
                          <View style={styles.userInfo}>
                              <Image source={{ uri: loggedInUserImage }} style={styles.userImage} />
                              <View>
                                  <Text style={[styles.greetingText, isDarkMode && styles.darkText]}>{greeting}</Text>
                                  <Text style={[styles.userName, isDarkMode && styles.darkText]}>{loggedInUserName}</Text>
                              </View>
                          </View>
                          <View style={styles.headerActions}>
                              <TouchableOpacity onPress={() => router.push("/screens/AddNewMedication")}>
                                  <Ionicons name="add-circle-outline" size={35} color={isDarkMode ? "#fff" : "#062654"} />
                              </TouchableOpacity>
                              <HamburgerMenu />
                          </View>
                      </View>
                      <Text style={[styles.headerSubText, isDarkMode && styles.darkSubText]}>
                          Stay on track with your health goals!
                      </Text>
                  </View>
              );


                case 'calendar':
                  return (
                      <View style={styles.sectionContainer}>
                          <View style={styles.sectionHeader}>
                              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Calendar</Text>
                              <Text style={[styles.monthText, isDarkMode && styles.darkSubText]}>{`${currentMonth} ${currentYear}`}</Text>

                          </View>
                          <Calendar onSelectDate={setSelectedDate} selected={selectedDate} />
                      </View>
                  );
              case 'medications':
                  return (
                      <View style={styles.sectionContainer}>
                          <View style={styles.sectionHeader}>
                              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Today's Medication</Text>
                              <TouchableOpacity onPress={() => router.push('/(tabs)/new')}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                      <Text style={styles.viewAllText}>View All</Text>
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
                                          style={{ padding: 8 }}
                                      >
                                          <FontAwesome5
                                              name="angle-double-right"
                                              size={24}
                                              color="#FFD700"
                                          />
                                      </MotiView>
                                  </View>
                              </TouchableOpacity>
                          </View>
                          <FlatList
                              data={Array.isArray(item.data) && item.data.every((med) => 'name' in med) ? item.data : []}
                              horizontal
                              keyExtractor={(med) => med.id}
                              renderItem={({ item: med }) => <MedicineItem item={med} />}
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={styles.medicineList}
                          />
                      </View>
                  );
              case 'challenges':
                  return (
                      <View style={styles.sectionContainer}>
                          <View style={styles.sectionHeader}>
                              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Health Challenges</Text>
                              <TouchableOpacity onPress={() => router.push('/(tabs)/challenge')}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                      <Text style={styles.viewAllText}>View All</Text>
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
                                          style={{ padding: 8 }}
                                      >
                                          <FontAwesome5
                                              name="angle-double-right"
                                              size={24}
                                              color="#FFD700"
                                          />
                                      </MotiView>
                                  </View>
                              </TouchableOpacity>
                          </View>
                          <FlatList
                              data={Array.isArray(item.data) && item.data.every((challenge) => 'title' in challenge) ? item.data : []}
                              horizontal
                              keyExtractor={(challenge) => challenge.id}
                              renderItem={({ item }) => <ChallengeItem item={item} />}
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={styles.challengeList}
                          />
                      </View>
                  );
              case 'stats':
                  return (
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
                          <Text style={styles.statValue}>6</Text>
                          <Text style={[styles.statLabel, isDarkMode && styles.darkSubText]}>Pending</Text>
                      </View>
                  </View>
                  );
              default:
                  return null;
          }
      };
      return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#121212' : '#FFFFFF'} />
            <FlatList
                data={sections}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};
// Styles (نفس الـ Styles اللي عندك)
// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  lightContainer: {
    backgroundColor: "#FFFFFF",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  headerContainer: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    top: 20,
    bottom: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 24,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#2265A2",
  },
  greetingText: {
    fontSize: 14,
    color: "#062654",
    marginBottom: 2,
    fontFamily: 'Inter-Medium',
  },
  userName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#202124",
    fontFamily: 'Inter-SemiBold',
  },
  darkText: {
    color: "#FFFFFF",
  },
  headerSubText: {
    fontSize: 14,
    color: "#5F6368",
    marginTop: 8,
    fontFamily: 'Inter-Regular',
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
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F5A623',
  },
  sectionContainer: {
    marginBottom: 24,
    paddingHorizontal: 24,
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
    color: "#062654",
    fontFamily: 'Inter-SemiBold',
  },
  monthText: {
    fontSize: 14,
    color: "#5F6368",
    fontWeight: "500",
    fontFamily: 'Inter-Medium',
  },
  viewAllText: {
    fontSize: 14,
    color: "#062654",
    fontWeight: "500",
    fontFamily: 'Inter-Medium',
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
    fontFamily: 'Inter-Medium',
  },
  selectedDayText: {
    color: "#062654",
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
    backgroundColor: "#062654",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#202124",
    fontFamily: 'Inter-Medium',
  },
  selectedDateText: {
    color: "#FFFFFF",
  },
  medicineList: {
    paddingRight: 24,
  },
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
  challengeList: {
    paddingRight: 24,
  },
  challengeContainer: {
    backgroundColor: "#062654",
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  challengeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ffffff",
    marginBottom: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    textAlign: "right",
    fontFamily: 'Inter-Medium',
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 24,
    borderRadius: 16,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 56,
  },
  lightStatsContainer: {
    backgroundColor: "#062654",
  },
  darkStatsContainer: {
    backgroundColor: "#1E1E1E",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFD700",
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  statLabel: {
    fontSize: 12,
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: 'Inter-Medium',
  },
  statSeparator: {
    width: 1,
    backgroundColor: "#E0E0E0",
  },
});

export default HomeScreen;