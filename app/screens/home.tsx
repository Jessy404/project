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

import { auth, db } from '../../config/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useContext } from 'react';
import { userDetailContext } from "../../context/userDetailContext";
import MedicineItem from "../../components/MedicineItem"; // تأكد من استيراد MedicineItem

interface CalendarProps {
    onSelectDate: (date: number) => void;
    selected: number;
}

const Calendar: React.FC<CalendarProps> = ({ onSelectDate, selected }) => {
    const days = Array.from({ length: 31 }, (_, i) =>
        ["THU", "FRI", "SAT", "SUN", "MON", "TUE", "WED"][i % 7]
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
                    onPress={() => {
                        console.log("Date selected in Calendar:", date);
                        onSelectDate(date);
                    }}
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

// Define challenges array
const challenges = [
    { id: '1', title: 'Drink Water', icon: 'water', color: '#4CAF50', progress: 75 },
    { id: '2', title: 'Walk 10,000 Steps', icon: 'walk', color: '#FF9800', progress: 50 },
    { id: '3', title: 'Sleep 8 Hours', icon: 'sleep', color: '#2196F3', progress: 90 },
];

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
    const [medicines, setMedicines] = useState<any[]>([]); // حالة لتخزين الأدوية

useEffect(() => {
    console.log("currentUser", auth.currentUser);
    console.log("Firestore:", db);

    const fetchUserData = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    console.log("User data fetched from Firestore:", userData);

                    // التحقق من التواريخ بشكل آمن
                    if (userData?.someDateField) {
                        const date = new Date(userData.someDateField);
                        if (isNaN(date.getTime())) {
                            console.error("Invalid date detected:", userData.someDateField);
                        }
                    }

                    setLoggedInUserName(userData?.name || 'Guest');
                    setLoggedInUserImage(userData?.photoURL || "https://i.pinimg.com/736x/3d/2f/ee/3d2feefd357b3cfd08b0f0b27b397ed4.jpg");
                } else {
                    console.log("User document not found in Firestore for UID:", user.uid);
                }
            } catch (error) {
                console.error("Error during fetching user data from Firestore:", error);
            }
        } else {
            console.log("No user is currently logged in.");
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

    // دالة لجلب الأدوية من Firestore بناءً على التاريخ المحدد
    const fetchMedicinesForDate = async (date: number) => {
        const user = auth.currentUser;
        if (user) {
            try {
                const medicinesRef = collection(db, "users", user.uid, "medicines");

                // الحصول على رقم الشهر (0-11)
                const monthNumber = new Date(Date.parse(currentMonth + " 1, " + currentYear)).getMonth();

                const startDate = new Date(currentYear, monthNumber, date, 0, 0, 0, 0);
                const endDate = new Date(currentYear, monthNumber, date, 23, 59, 59, 999);

                console.log("startDate:", startDate);
                console.log("endDate:", endDate);

                const q = query(medicinesRef,
                    where('scheduledDate', '>=', startDate),
                    where('scheduledDate', '<=', endDate)
                );

                const querySnapshot = await getDocs(q);
                const medicinesArray: any[] = [];
                querySnapshot.forEach((doc) => {
                    medicinesArray.push({ id: doc.id, ...doc.data() });
                });
                console.log("Medicines fetched for date:", date, medicinesArray);
                setMedicines(medicinesArray);
            } catch (error) {
                console.error("Error fetching medicines:", error);
                setMedicines([]);
            }
        } else {
            setMedicines([]);
        }
    };

    useEffect(() => {
        console.log("Value of selectedDate before fetching:", selectedDate);
        fetchMedicinesForDate(selectedDate);
    }, [selectedDate, currentMonth, currentYear]); 
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
                                <Image source={{ uri: loggedInUserImage || "https://i.pinimg.com/736x/19/49/6b/19496bd082a517c236cbb4649608c541.jpg" }} style={styles.userImage} />
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
                            data={item.data} // استخدام item.data الذي يحتوي على الأدوية من الحالة
                            horizontal
                            keyExtractor={(med) => med.id}
                            renderItem={({ item: med }) => (
                                <MedicineItem
                                    name={med.name}
                                    type={med.type}
                                    image={med.image}
                                    time={med.time}
                                    dose={med.dose}
                                    schedule={med.schedule}
                                    status={med.status}
                                />
                            )}
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
                            data={item.data}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
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
        padding: 14,
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
    headerActions: {
        flexDirection: "row",
        alignItems: "center",
        left: 50,
        gap: 16,
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
        backgroundColor: '#F5A623',},
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