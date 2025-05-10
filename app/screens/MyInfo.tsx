import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
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
  const [profileImage, setProfileImage] = useState(null);   
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

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
          setProfileImage(data.photoURL || 'https://i.pinimg.com/736x/3d/2f/ee/3d2feefd357b3cfd08b0f0b27b397ed4.jpg'); 
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSave = async () => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        name,
        email,
        age,
        photoURL: profileImage, 
      });
      console.log('Saved:', { name, email, age, profileImage });
      setIsEditing(false);
      setIsSaved(true);
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
      <View style={{ marginBottom: 20 }} /> 
      <Text style={styles.title}>My Info</Text>

      <View style={styles.profileContainer}>
        <Image
          source={{ uri: profileImage }}
          style={styles.profileImage}
        />
        <Text style={styles.changePhotoText}>Profile Picture</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        ) : (
          <Text style={styles.value}>{name}</Text>
        )}

        <Text style={styles.label}>Email</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        ) : (
          <Text style={styles.value}>{email}</Text>
        )}

        <Text style={styles.label}>Age</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        ) : (
          <Text style={styles.value}>{age}</Text>
        )}

      </View>

      {isEditing ? (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      )}

      {isSaved && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>Changes saved successfully!</Text>
        </View>
      )}
    </View>
  );
};


export default MyInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
    color: '#062654',  
    textAlign: 'center',
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#062654', 
    marginBottom: 10,
  },
  changePhotoText: {
    fontSize: 14,
    color: '#062654', 
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
    color: '#062654', 
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
  value: {
    backgroundColor: '#F0F4F8',
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#062654', 
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
  editButton: {
    backgroundColor: '#062654', 
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 30,
    alignItems: 'center',
  },
  editText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successMessage: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  successText: {
    color: '#fff',
    fontSize: 16,
  },
});
