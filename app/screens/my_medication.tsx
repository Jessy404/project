import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image, Pressable } from "react-native";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type User = {
  id: string | number;
  name: string;
  username: string;
  mutualFriends: number;
  imageUrl?: string;
};

const initialUsers: User[] = [
  { id: 1, name: "Leanne Graham", username: "Bret", mutualFriends: 32, imageUrl: "https://placehold.co/345" },
  { id: 2, name: "Ervin Howell", username: "Antonette", mutualFriends: 18, imageUrl: "https://placehold.co/287" },
  { id: 3, name: "Clementine Bauch", username: "Samantha", mutualFriends: 51, imageUrl: "https://placehold.co/482" },
  { id: 4, name: "Patricia Lebsack", username: "Karianne", mutualFriends: 9, imageUrl: "https://placehold.co/234" },
  { id: 5, name: "Chelsey Dietrich", username: "Kamren", mutualFriends: 63, imageUrl: "https://placehold.co/512" },
  { id: 6, name: "Mrs. Dennis Schulist", username: "Leopoldo_Corkery", mutualFriends: 27, imageUrl: "https://placehold.co/456" },
  { id: 7, name: "Kurtis Weissnat", username: "Elwyn.Skiles", mutualFriends: 42, imageUrl: "https://placehold.co/398" },
  { id: 8, name: "Nicholas Runolfsdottir V", username: "Maxime_Nienow", mutualFriends: 5, imageUrl: "https://placehold.co/189" },
  { id: 9, name: "Glenna Reichert", username: "Delphine", mutualFriends: 71, imageUrl: "https://placehold.co/573" },
  { id: 10, name: "Clementina DuBuque", username: "Moriah.Stanton", mutualFriends: 12, imageUrl: "https://placehold.co/297" },
];

const UserScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState<User[]>(initialUsers);

  const handleViewProfile = useCallback((id: string | number) => {
    setUsers((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleDeleteUser = useCallback((id: string | number) => {
    setUsers((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleRefresh = useCallback(() => {
    setUsers(initialUsers);
    // يمكنك هنا إضافة منطق إضافي لإعادة جلب البيانات من مصدر خارجي إذا لزم الأمر
  }, []);

  const filteredUsers = users.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }: { item: User }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          {item.imageUrl && (
            <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.mutualFriends}>
              {item.mutualFriends} mutual friends
            </Text>
          </View>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={[styles.button, styles.view]} onPress={() => handleViewProfile(item.id)}>
            <Text style={styles.btnText}>confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.delete]} onPress={() => handleDeleteUser(item.id)}>
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>
          frinds requests
        </Text>

        <Pressable onPress={() => router.push("/screens/MedicationDetail")}>
          <FontAwesome5 name="info" size={18} color="#888" style={styles.searchIcon} />
        </Pressable>

      </View>
      <View style={styles.searchContainer}>
        <FontAwesome5 name="search" size={18} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchText}
          onChangeText={(text) => setSearchText(text.trimStart())}
          placeholderTextColor="#AAA"
        />
      </View>
      <TouchableOpacity style={[styles.button1, styles.view]} onPress={handleRefresh} >
        <Text style={styles.btnText}>refresh</Text>
      </TouchableOpacity>
      {filteredUsers.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>No users found.</Text>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 20,
    gap : 10,
    textAlign: "left",
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2265A2",
    textAlign: "center",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2265A2",
  },
  username: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  mutualFriends: {
    fontSize: 14,
    color: "#555",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,

  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",

  },
  button1: {

    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",

  },
  view: {
    backgroundColor: "#2265A2",
  },
  delete: {
    backgroundColor: "#333",
  },
  btnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  refresh: {
    height: 50,
  }
});

export default UserScreen;