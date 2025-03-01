import React, { useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const days = [
  { id: 1, day: "Fr", date: "27" },
  { id: 2, day: "Sa", date: "28" },
  { id: 3, day: "Su", date: "29" },
  { id: 4, day: "Mo", date: "30" },
  { id: 5, day: "Tu", date: "31" },
];

const HomeScreen = () => {
  const [selectedDay, setSelectedDay] = useState("27");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Hello Yasmeen  👋</Text>
        <Ionicons name="settings-outline" size={24} color="black" />
      </View>

      {/* Medication Card */}
      <View style={styles.card}>
        <Image 
          source={{ uri: 'https://domf5oio6qrcr.cloudfront.net/medialibrary/15900/gettyimages-1342010434.jpg' }}
          style={styles.cardImage} 
        />
      </View>

      {/* Horizontal Date Picker */}
      <FlatList
        horizontal
        data={days}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedDay(item.date)}>
            <View style={[styles.dateBox, selectedDay == item.date && styles.selectedDate]}>
              <Text style={[styles.dayText, selectedDay == item.date && styles.selectedText]}>
                {item.day}
              </Text>
              <Text style={[styles.dateText, selectedDay == item.date && styles.selectedText]}>
                {item.date}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* No Medications Message */}
      <View style={styles.noMedsContainer}>
        <Image 
          source={{ uri: 'https://domf5oio6qrcr.cloudfront.net/medialibrary/15900/gettyimages-1342010434.jpg' }}
          style={styles.noMedsImage}
        />
        <Text style={styles.noMedsText}>No Medications!</Text>
        <Text style={styles.subText}>You have 0 medication setup, Kindly setup a new one</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold" },
  card: { backgroundColor: "#e0f7fa", borderRadius: 15, padding: 20, alignItems: "center", marginVertical: 15 },
  cardImage: { width: "100%", height: 120, resizeMode: "contain" },
  dateBox: { alignItems: "center", padding: 10, marginHorizontal: 5, borderRadius: 10 },
  selectedDate: { backgroundColor: "#007bff" },
  dayText: { fontSize: 14, color: "gray" },
  dateText: { fontSize: 18, fontWeight: "bold", color: "black" },
  selectedText: { color: "white" },
  noMedsContainer: { alignItems: "center", marginTop: 20 },
  noMedsImage: { width: 80, height: 80, resizeMode: "contain" },
  noMedsText: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  subText: { fontSize: 14, color: "gray", textAlign: "center", marginTop: 5 },
});

export default HomeScreen;
