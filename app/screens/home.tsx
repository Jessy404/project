import { useState, useEffect } from "react";
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
    ActivityIndicator,
    ScrollView
} from "react-native";
import HamburgerMenu from "../../components/HamburgerMenu";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { auth, db } from '../../config/firebaseConfig';
import { doc, getDoc, collection, query, getDocs } from 'firebase/firestore';
import React from "react";

interface CalendarProps {
    onSelectDate: (date: number) => void;
    selected: number;
}

interface MedicineData {
    id: string;
    medicationName: string;
    medicationType: string;
    dose: string;
    dosesPerDay: string;
    whenToTake: string;
    image?: string;
    taken?: boolean;
    startDate?: string;
    endDate?: string;
    rating?: number;
}

interface ChallengeItemType {
    id: string;
    title: string;
    icon: string;
    color: string;
    progress: number;
}
const cardColor = '#2C2C2C';
const iconColor = '#888';
const textColor = '#EEE';
const Calendar: React.FC<CalendarProps> = ({ onSelectDate, selected }: CalendarProps) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

const MedicineItem: React.FC<{ item: MedicineData }> = (props: { item: MedicineData }) => {
    const { item } = props;
    const getIconColor = () => {
        switch (item.medicationType.toLowerCase()) {
            case 'tablet': return '#2265A2';
            case 'syrup': return '#4CAF50';
            case 'injection': return '#FF5722';
            case 'capsule': return '#FF9800';
            default: return '#2265A2';
        }
    };

    const iconColor = getIconColor();

    return (
        <View style={styles.challengeContainer}>
            <View style={[styles.challengeIconContainer, { backgroundColor: `${iconColor}20` }]}>
                <MaterialCommunityIcons
                    name={item.medicationType.toLowerCase() === 'syrup' ? 'cup' : 'pill'}
                    size={24}
                    color={iconColor}
                />
            </View>

            <Text style={styles.challengeTitle} numberOfLines={1}>
                {item.medicationName}
            </Text>

            <View style={styles.progressBar}>
                <View style={[styles.progressFill, {
                    width: item.taken ? '100%' : '50%',
                    backgroundColor: iconColor
                }]} />
            </View>

            <View style={styles.medicineDetails}>
                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="counter" size={14} color="#FFFFFF" />
                    <Text style={styles.detailText}>{item.dose}</Text>
                </View>
                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="clock-outline" size={14} color="#FFFFFF" />
                    <Text style={styles.detailText}>{item.whenToTake}</Text>
                </View>
            </View>

            {item.taken && (
                <View style={styles.takenBadge}>
                    <Text style={styles.takenText}>Taken</Text>
                </View>
            )}
        </View>
    );
};

const ChallengeItem: React.FC<{ item: ChallengeItemType }> = ({ item }: { item: ChallengeItemType }) => (
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

const HomeScreen: React.FC = () => {
    const [loggedInUserName, setLoggedInUserName] = useState<string>('Guest');
    const [loggedInUserImage, setLoggedInUserImage] = useState<string>("https://via.placeholder.com/150");
    const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
    const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === "dark";
    const [currentMonth, setCurrentMonth] = useState<string>(new Date().toLocaleString('default', { month: 'long' }));
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
    const [medicines, setMedicines] = useState<MedicineData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const challenges: ChallengeItemType[] = [
        { id: '1', title: 'Drink Water', icon: 'water', color: '#4CAF50', progress: 75 },
        { id: '2', title: 'Walk 10,000 Steps', icon: 'walk', color: '#FF9800', progress: 50 },
        { id: '3', title: 'Sleep 8 Hours', icon: 'sleep', color: '#2196F3', progress: 90 },
    ];


    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const userRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setLoggedInUserName(userData?.name || 'Guest');
                        setLoggedInUserImage(userData?.photoURL || "https://i.pinimg.com/736x/3d/2f/ee/3d2feefd357b3cfd08b0f0b27b397ed4.jpg");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();
    }, []);

    const fetchMedicinesForDate = async (day: number) => {
        setLoading(true);
        setTimeout(() => {

            const mockMedicines: MedicineData[] = [];


            mockMedicines.push({
                id: "vitamin-d-" + day,
                medicationName: "Vitamin D",
                medicationType: "Drops",
                dose: "1000 IU",
                dosesPerDay: "1",
                whenToTake: "Morning",
                startDate: "05/01/2025",
                endDate: "05/31/2025",
                taken: day % 3 !== 0, // يتم تناوله كل يومين (لم يتم تناوله كل 3 أيام)
                rating: 4
            });

            // دواء إضافي من 10 إلى 20 مايو
            if (day >= 10 && day <= 20) {
                mockMedicines.push({
                    id: "pain-reliever-" + day,
                    medicationName: "Ibuprofen",
                    medicationType: "Tablet",
                    dose: "200 mg",
                    dosesPerDay: "2",
                    whenToTake: "After Meal",
                    startDate: "05/10/2025",
                    endDate: "05/20/2025",
                    taken: day % 2 === 0, // يتم تناوله كل يومين
                    rating: 3
                });
            }

            // دواء آخر من 15 مايو إلى نهاية الشهر
            if (day >= 15) {
                mockMedicines.push({
                    id: "antibiotic-" + day,
                    medicationName: "Amoxicillin",
                    medicationType: "Capsule",
                    dose: "500 mg",
                    dosesPerDay: "3",
                    whenToTake: "Every 8 Hours",
                    startDate: "05/15/2025",
                    endDate: "05/31/2025",
                    taken: true, // يتم تناوله بانتظام
                    rating: 5
                });
            }

            // دواء إضافي في أيام محددة (يوم 5، 10، 15، 20، 25، 30)

            setMedicines(mockMedicines);
            setLoading(false);
        }, 500);
    };
    useEffect(() => {
        const today = new Date();
        setCurrentMonth(today.toLocaleString('default', { month: 'long' }));
        setCurrentYear(today.getFullYear());
        fetchMedicinesForDate(today.getDate());
    }, []);

    useEffect(() => {
        fetchMedicinesForDate(selectedDate);
    }, [selectedDate]);

    const renderMedicationsSection = () => (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
                    {selectedDate === new Date().getDate() ? "Today's Medication" : "Medication"}
                </Text>
                <TouchableOpacity onPress={() => router.push({ pathname: "/screens/my_medication" })}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.viewAllText}>View All</Text>
                        <FontAwesome5 name="angle-double-right" size={24} color="#FFD700" />
                    </View>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#FFD700" />
            ) : medicines.length > 0 ? (
                <FlatList
                    data={medicines}
                    horizontal
                    keyExtractor={(med) => med.id}
                    renderItem={({ item }) => <MedicineItem item={item} />}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.challengeList}
                />
            ) : (
                <View style={[styles.noMedicationsContainer, { backgroundColor: cardColor }]}>
                    <MaterialCommunityIcons
                        name="pill"
                        size={40}
                        color={iconColor}
                        style={styles.icon}
                    />
                    <Text style={[styles.text, { color: textColor }]}>
                        No medications for {selectedDate} {currentMonth}
                    </Text>
                </View>
            )}
        </View>
    );

    return (
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
    <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

    <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Image source={{ uri: loggedInUserImage }} style={styles.userImage} />
            <View>
              <Text style={[styles.greetingText, isDarkMode && styles.darkText]}>
                {currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening"}
              </Text>
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

      {/* Calendar */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Calendar</Text>
          <Text style={[styles.monthText, isDarkMode && styles.darkSubText]}>
            {`${currentMonth} ${currentYear}`}
          </Text>
        </View>
        <Calendar onSelectDate={setSelectedDate} selected={selectedDate} />
      </View>

      {/* Medications */}
      {renderMedicationsSection()}

      {/* Challenges */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Health Challenges</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: "/screens/challenge" })}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.viewAllText}>View All</Text>
              <FontAwesome5 name="angle-double-right" size={24} color="#FFD700" />
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          data={challenges}
          horizontal
          keyExtractor={(challenge) => challenge.id}
          renderItem={({ item }) => <ChallengeItem item={item} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.challengeList}
        />
      </View>

      {/* Stats */}
      <View style={[styles.statsContainer, isDarkMode ? styles.darkStatsContainer : styles.lightStatsContainer]}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{medicines.length}</Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkSubText]}>Medications</Text>
        </View>
        <View style={styles.statSeparator} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{medicines.filter(m => m.taken).length}</Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkSubText]}>Taken</Text>
        </View>
        <View style={styles.statSeparator} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{medicines.filter(m => !m.taken).length}</Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkSubText]}>Pending</Text>
        </View>
      </View>

    </ScrollView>
  </View>
);
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    darkContainer: {
        backgroundColor: "#121212",
    },
    headerContainer: {
        padding: 14,
        paddingBottom: 16,
        backgroundColor: "#FFFFFF",
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
    },
    darkText: {
        color: "#FFFFFF",
    },
    userName: {
        fontSize: 22,
        fontWeight: "600",
        color: "#202124",
    },
    headerSubText: {
        fontSize: 14,
        color: "#5F6368",
        marginTop: 8,
    },
    darkSubText: {
        color: "#9AA0A6",
    },
    headerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        left: 90,
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
    },
    monthText: {
        fontSize: 14,
        color: "#5F6368",
        fontWeight: "500",
    },
    viewAllText: {
        fontSize: 14,
        color: "#062654",
        fontWeight: "500",
    },
    noMedicationsContainer: {
        flexDirection: "row",
        padding: 16,
        margin: 16,
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 5,
    },
     icon: {
    marginRight: 12,
    color: "#fff",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    flexShrink: 1,
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
    },
    selectedDateText: {
        color: "#FFFFFF",
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
    },
    progressBar: {
        height: 4,
        borderRadius: 2,
        backgroundColor: "#FFFFFF20",
        marginBottom: 12,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    progressText: {
        fontSize: 12,
        textAlign: "right",
    },
    medicineDetails: {
        gap: 6,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 12,
        color: "#FFFFFF",
    },
    takenBadge: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        paddingVertical: 2,
        paddingHorizontal: 8,
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    takenText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: 'bold',
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
    },
    statLabel: {
        fontSize: 12,
        color: "#ffffff",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    statSeparator: {
        width: 1,
        backgroundColor: "#E0E0E0",
    },
});

export default HomeScreen;