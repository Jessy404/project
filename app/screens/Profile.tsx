import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from "../../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const authInstance = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = authInstance.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData && typeof userData === 'object') {
            setUserData(userData);
          } else {
            console.log('Invalid data format');
            setUserData(null);      
          }
        } else {
          console.log('No user data found');
          setUserData(null);  
        }
      }
      setLoading(false); 
    };
  
    fetchUserData();
  }, []);
  
  

  const handleLogout = async () => {
    try {
      await signOut(authInstance);
      router.replace('/screens/Getstarted');
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://i.pinimg.com/736x/3d/2f/ee/3d2feefd357b3cfd08b0f0b27b397ed4.jpg' }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>
           {userData?.name || 'Not Available'}
        </Text>
      </View>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/screens/MyInfo')}>
        <Text style={styles.cardText}>My Info</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/screens/my_medication')}>
        <Text style={styles.cardText}>My Medications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/screens/challenge')}>
        <Text style={styles.cardText}>My Challenges</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2265A2',
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  userName: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingVertical: 20,
    borderRadius: 20,
    elevation: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2265A2',
  },
  logoutButton: {
    backgroundColor: '#E63946',
    paddingVertical: 15,
    borderRadius: 20,
    width: '100%',
    marginTop: 40,
    alignItems: 'center',
    elevation: 4,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
