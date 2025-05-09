import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
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
}

const ChallengeScreen: React.FC = () => {
  
  const [challengeList, setChallengeList] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 

  
  const challenges: Challenge[] = [
    { id: "1", title: "Drink 2 liters of water today 💧", icon: "tint", rating: 0 },
    { id: "2", title: "Eat 5 servings of fruits or vegetables 🍎🥦", icon: "apple", rating: 0 },
    { id: "3", title: "Sleep for 7 hours straight 😴", icon: "bed", rating: 0 },
    { id: "4", title: "Meditate for 10 minutes 🧘‍♀", icon: "leaf", rating: 0  },
    { id: "5", title: "No phone use 1 hour before bed 📵", icon: "mobile", rating: 0  },
    { id: "6", title: "Read for 30 minutes 📖", icon: "book", rating: 0  },
    { id: "7", title: "Do 15 minutes of stretching 🏋‍♀", icon: "heartbeat", rating: 0 },
    { id: "8", title: "Drink a healthy smoothie 🥤", icon: "glass", rating: 0  },
    { id: "9", title: "Spend 30 minutes outdoors 🌳", icon: "tree", rating: 0  },
    { id: "10", title: "Practice deep breathing for 5 minutes 🌬", icon: "cloud", rating: 0 },
    { id: "11", title: "Limit caffeine intake ☕", icon: "coffee", rating: 0 },
  ];

  
  const uploadChallengesToFirestore = async () => {
    try {
      const challengesRef = collection(db, "challenges");

      
      for (const challenge of challenges) {
        const challengeDocRef = doc(challengesRef, challenge.id);
        await setDoc(challengeDocRef, challenge);
        console.log(`Challenge "${challenge.title}" added to Firestore.`);
      }
    } catch (e) {
      console.error('Error uploading challenges to Firestore', e);
    }
  };

  
useEffect(() => {
  (async () => {
  
    await uploadChallengesToFirestore();

    
    try {
      const challengesRef = collection(db, "challenges");
      const snapshot = await getDocs(challengesRef);
      
      
      console.log("Challenges data:", snapshot.docs.map(doc => doc.data()));

      const challengesData = snapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data()
      }));
      setChallengeList(challengesData as Challenge[]);
    } catch (e) {
      console.error('Error loading challenges', e);
    } finally {
      setLoading(false); 
    }
  })();
}, []);


  
  const renderChallengeItem = ({ item }: { item: Challenge }) => (
    <View style={styles.challengeItem}>
      <Ionicons name={item.icon as any} size={30} color="#2265A2" style={styles.iconContainer} />
      <View style={styles.textContainer}>
        <Text style={styles.challengeText}>{item.title}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => await handleJoinChallenge(item.id)}
        >
          <Text style={styles.buttonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  
  const handleJoinChallenge = async (challengeId: string) => {
    const userId = getAuth().currentUser?.uid; 

    if (!userId) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const challengeDocRef = doc(db, "challenges", challengeId);

    
      const challengeSnap = await getDoc(challengeDocRef);
      const challengeData = challengeSnap.data() as Challenge;

      
      const joinedUsers = challengeData.joinedUsers || [];
      if (!joinedUsers.includes(userId)) {
        joinedUsers.push(userId);
      }

      
      await updateDoc(challengeDocRef, { joinedUsers });

      console.log(`User ${userId} joined challenge ${challengeId}`);
      setChallengeList(prevList =>
        prevList.map(challenge =>
          challenge.id === challengeId
            ? { ...challenge, joinedUsers }
            : challenge
        )
      );
    } catch (error) {
      console.error("Error joining challenge: ", error);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <FlatList
      data={challengeList}
      renderItem={renderChallengeItem}
      keyExtractor={(item) => item.id}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 70,
  },
  header: {
    fontSize: 20,
    paddingTop: 20,
    fontWeight: '900',
    textAlign: "center",
    marginTop: 15,
    marginBottom: 5,
    color: "#062654",
  },
  challengeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 10,
    margin: 5,
    marginVertical: 8,
    borderRadius: 25,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: "#2265A2",
    padding: 15,
    width: 70,
    height: 70,
    borderRadius: 23,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 3,
  },
  challengeText: {
    fontSize: 14,
    color: "#000",
    marginBottom: 5,
    fontWeight: '500',
  },
  button: {
    backgroundColor: "#2265A2",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  doneText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "bold",
  },
});


export default ChallengeScreen;
