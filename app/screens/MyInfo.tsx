import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from "../../config/firebaseConfig";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const MyInfo = () => {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setEmail(data.email || "");
          setAge(data.age || "");
        }
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        name,
        email,
        age,
      });
      console.log('Saved:', { name, email, age });
      router.back(); 
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit My Info</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2265A2',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2265A2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F0F4F8',
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 30,
    alignItems: 'center',
  },
  saveText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});