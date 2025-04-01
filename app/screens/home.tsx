import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const medicinesData = {
  7: [
    { id: "1", name: "Ibrupain", time: "7:00 PM", dose: "2 Tablets", schedule: "Before Sleeping", icon: "pill", status: "done" },
  ],
  8: [
    { id: "2", name: "ABCD", time: "9:00 PM", dose: "3 Syrups", schedule: "After Dinner", icon: "bottle-tonic-plus", status: "missed" },
  ],
  9: [
    { id: "3", name: "Crocine", time: "9:00 PM", dose: "3 Capsules", schedule: "After Dinner", icon: "pill-multiple", status: "done" },
  ],
  10: [
    { id: "4", name: "CA738", time: "10:00 PM", dose: "1 Injection", schedule: "Before Sleeping", icon: "needle", status: "done" },
  ],
};

const Calendar = ({ onSelectDate, selected }) => {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.calendarScrollView}>
        <View style={styles.calendarContainer}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dayContainer, selected === dates[index] && styles.selectedDay]}
              onPress={() => onSelectDate(dates[index])}
            >
              <Text style={styles.dayText}>{day}</Text>
              <View style={[styles.dateCircle, selected === dates[index] && styles.selectedDate]}>
                <Text style={styles.dateText}>{dates[index]}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const MedicineItem = ({ name, time, dose, schedule, icon, status }) => (
  <View style={styles.item}>
    <MaterialCommunityIcons name={icon} size={30} color="#007BFF" style={styles.icon} />
    <View style={styles.details}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.schedule}>{schedule}</Text>
      <Text style={styles.dose}>{dose}</Text>
    </View>
    <View style={styles.rightSection}>
      <View style={styles.timeContainer}>
        <Ionicons name="time-outline" size={18} color="#666" />
        <Text style={styles.time}>{time}</Text>
      </View>
      <TouchableOpacity>
        <Ionicons
          name={status === "done" ? "checkmark-done-circle-outline" : "alert-circle-outline"}
          size={28}
          color={status === "done" ? "green" : "red"}
        />
      </TouchableOpacity>
    </View>
  </View>
);

const MedicineList = () => {
  const [selectedDate, setSelectedDate] = useState(7);
  const medicines = medicinesData[selectedDate] || [];

  return (
    <View style={styles.container}>
      <Calendar onSelectDate={setSelectedDate} selected={selectedDate} />
      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MedicineItem {...item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 10,
  },
  calendarScrollView: {
    marginBottom: 10,
  },
  calendarContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  dayContainer: {
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  selectedDay: {
    backgroundColor: "#f0f0f0",
  },
  dayText: {
    color: "gray",
    fontSize: 10,
  },
  dateCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#d3d3d3",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  selectedDate: {
    backgroundColor: "black",
  },
  dateText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  schedule: {
    fontSize: 12,
    color: "#666",
  },
  dose: {
    fontSize: 12,
    color: "#007BFF",
  },
  rightSection: {
    alignItems: "center",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  time: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default MedicineList;

