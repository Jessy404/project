import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from "../../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

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
        <ActivityIndicator size="large" color="#10439F" />
      </View>
    );
  }

  const RenderOption = ({ icon, text, onPress, color = "#10439F" }) => (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <View style={styles.optionContent}>
        {React.cloneElement(icon, { color })}
        <Text style={[styles.optionText, { color }]}>{text}</Text>
        <Feather name="chevron-right" size={20} color={color} style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={{ alignItems: 'center' }}>
      <View style={styles.headerBackground} />
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://i.pinimg.com/736x/3d/2f/ee/3d2feefd357b3cfd08b0f0b27b397ed4.jpg' }}
          style={styles.avatar}
        />
      </View>
      <Text style={styles.userName}>{userData?.name || 'Not Available'}</Text>
      <Text style={styles.email}>{userData?.email || 'No Email'}</Text>

      <RenderOption
        icon={<MaterialIcons name="person" size={22} />}
        text="My Info"
        onPress={() => router.push('/screens/MyInfo')}
      />

      <RenderOption
        icon={<FontAwesome5 name="pills" size={20} />}
        text="My Medications"
        onPress={() => router.push('/screens/my_medication')}
      />

      <RenderOption
        icon={<Ionicons name="trophy-outline" size={22} />}
        text="My Challenges"
        onPress={() => router.push('/screens/challenge')}
      />

      <RenderOption
        icon={<MaterialIcons name="logout" size={22} />}
        text="Log Out"
        onPress={handleLogout}
        color="#E63946"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerBackground: {
    backgroundColor: '#10439F',
    height: 120,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  avatarContainer: {
    marginTop: -60,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 10,
    color: '#10439F',
  },
  email: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  optionRow: {
    backgroundColor: '#F5F5F5',
    width: '85%',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 10,
  },
  chevron: {
    marginLeft: 10,
  },
  logoutButton: {
    display: 'none', // hide the old button style
  },
  logoutText: {
    display: 'none',
  },
});
