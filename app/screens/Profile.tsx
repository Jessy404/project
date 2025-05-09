import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/screens/Getstarted');
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>Soso</Text>
      </View>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/screens/my_medication')}>
        <Text style={styles.cardText}>My Medications</Text>
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
