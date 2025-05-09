import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { doc, setDoc, getDoc, getDocs, collection, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from "firebase/auth";

interface Challenge {
  id: string;
  title: string;
  icon: string;
  rating: number;
  joinedUsers?: string[];
  maxUsers?: number;
}

const ChallengeScreen: React.FC = () => {
  const [challengeList, setChallengeList] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const challenges: Challenge[] = [
    { id: "1", title: "Drink 2 liters of water 💧", icon: "water", rating: 0, maxUsers: 5 },
    { id: "2", title: "Eat 5 servings of fruits 🍎", icon: "nutrition", rating: 0, maxUsers: 3 },
    { id: "3", title: "Sleep for 7 hours 😴", icon: "bed", rating: 0 },
    // باقي التحديات بنفس الشكل...
  ];

  const uploadChallengesToFirestore = async () => {
    try {
      const challengesRef = collection(db, "challenges");
      for (const challenge of challenges) {
        const challengeDocRef = doc(challengesRef, challenge.id);
        await setDoc(challengeDocRef, challenge, { merge: true });
      }
    } catch (e) {
      console.error('Error uploading challenges', e);
    }
  };

  useEffect(() => {
    (async () => {
      await uploadChallengesToFirestore();
      try {
        const snapshot = await getDocs(collection(db, "challenges"));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Challenge[];
        setChallengeList(data);
      } catch (e) {
        console.error('Error loading challenges', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleJoinChallenge = async (challengeId: string) => {
    const userId = getAuth().currentUser?.uid;
    if (!userId) return;

    const challengeDocRef = doc(db, "challenges", challengeId);
    const snap = await getDoc(challengeDocRef);
    const data = snap.data() as Challenge;
    const joinedUsers = data.joinedUsers || [];

    if (!joinedUsers.includes(userId) && (!data.maxUsers || joinedUsers.length < data.maxUsers)) {
      joinedUsers.push(userId);
      await updateDoc(challengeDocRef, { joinedUsers });
      setChallengeList(prev =>
        prev.map(ch =>
          ch.id === challengeId ? { ...ch, joinedUsers } : ch
        )
      );
    }
  };

  const renderChallengeItem = ({ item }: { item: Challenge }) => {
    const userId = getAuth().currentUser?.uid;
    const joined = item.joinedUsers?.includes(userId || '') || false;
    const isFull = item.maxUsers && item.joinedUsers && item.joinedUsers.length >= item.maxUsers;

    return (
      <View style={styles.challengeItem}>
        <Ionicons name={item.icon as any} size={30} color="#fff" style={styles.iconContainer} />
        <View style={styles.textContainer}>
          <Text style={styles.challengeText}>{item.title}</Text>
          {item.maxUsers && (
            <Text style={styles.counterText}>
              {item.joinedUsers?.length || 0}/{item.maxUsers} joined
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.button, joined || isFull ? styles.buttonJoined : {}]}
          onPress={() => handleJoinChallenge(item.id)}
          disabled={joined || Boolean(isFull)}
        >
          <Text style={styles.buttonText}>
            {isFull ? "Done" : joined ? "Joined" : "Join"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingBottom: 80 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Challenges</Text>
        <Image
          source={{ uri: "https://i.pinimg.com/736x/19/49/6b/19496bd082a517c236cbb4649608c541.jpg" }}
          style={styles.headerImage}
        />
      </View>
      <FlatList
        data={challengeList}
        renderItem={renderChallengeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 20,
    paddingTop: 45,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "900",
    color: "#062654",
  },
  headerImage: {
    width: 40,
    height: 40,
  },
  challengeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 12,
    marginBottom: 12,
    borderRadius: 20,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: "#062654",
    padding: 14,
    borderRadius: 20,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  challengeText: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    color: "#062654",
  },
  counterText: {
    fontSize: 12,
    color: "#888",
  },
  button: {
    backgroundColor: "#062654",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 15,
  },
  buttonJoined: {
    backgroundColor: "#a3c0e0",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  loading: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
});

export default ChallengeScreen;
