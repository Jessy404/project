import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig'; // Make sure the path is correct.
const NotificationModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
const fetchMedications = async () => {
  try {
    setLoading(true);
    const user = auth.currentUser;
    
    if (!user) {
      console.error("❌ No user logged in!");
      return;
    }

    console.log("✅ Logged-in user:", user.email);

    const medsRef = collection(db, 'medication'); // ✅ Make sure of the group name.
    const q = query(medsRef, where('userEmail', '==', user.email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn("⚠️ No medications found for this user!");
    }

    const fetched = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.medicationName, // ✅ Using the correct field
        dose: `${data.dose} ${data.medicationType}`, // ✅ Show the dose with the type
        time: data.whenToTake || 'No time specified',
      };
    });

    console.log("📦 Fetched medications:", fetched);

    setMedications(fetched);
  } catch (error) {
    console.error('🔥 Error fetching meds:', error);
  } finally {
    setLoading(false);
  }
};



  const markAsTaken = (id) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
  };

  const markAsSkipped = (id) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
  };

  const markAllAsTaken = () => {
    setMedications([]);
  };

  useEffect(() => {
    if (modalVisible) {
      fetchMedications();
    }
  }, [modalVisible]);

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={{ fontSize: 24 }}>🔔</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>

            {loading ? (
              <ActivityIndicator size="large" color="#062654" style={{ marginTop: 40 }} />
            ) : medications.length > 0 ? (
              <>
                <Text style={styles.title}>Have you taken these?</Text>
                <Text style={styles.subtitle}>Mark them Taken or Skipped</Text>

                <ScrollView style={styles.scrollView}>
                  {medications.map((med) => (
                    <View key={med.id} style={styles.card}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.medicationName}>{med.name} • {med.dose}</Text>
                        <Text style={styles.medicationTime}>{med.time}</Text>
                      </View>
                      <View style={styles.actions}>
                        <TouchableOpacity style={styles.circleButton} onPress={() => markAsSkipped(med.id)}>
                          <Ionicons name="close" size={20} color="#FF5C5C" />
                          <Text style={styles.actionText}>Skipped</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.circleButton} onPress={() => markAsTaken(med.id)}>
                          <Ionicons name="checkmark" size={20} color="#000" />
                          <Text style={styles.actionText}>Taken</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity style={styles.takeAllButton} onPress={markAllAsTaken}>
                  <Text style={styles.takeAllText}>✓ Taken all</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={markAllAsTaken}>
                  <Text style={styles.skipAllText}>Skipped all</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-done-circle-outline" size={48} color="#4CAF50" />
                <Text style={styles.emptyText}>All medications taken 🎉</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
//The same styles you have exactly.  
 overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    paddingTop: 40,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  medicationTime: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 10,
  },
  circleButton: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionText: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  takeAllButton: {
    backgroundColor: '#062654',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  takeAllText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  skipAllText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
});

export default NotificationModal;
