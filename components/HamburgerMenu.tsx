import * as React from 'react';
import { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HamburgerMenu = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const [medications, setMedications] = useState([
{ id: 1, name: 'Alphintern', dose: '1 tablet', time: 'Today at 08:00 am' },

  { id: 2, name: 'Vitamin C', dose: '1 tablet (1000mg)', time: 'Today at 08:00 am' },

  { id: 3, name: 'Panadol Extra', dose: '2 tablets (500mg)', time: 'Today at 11:59 pm' },

  { id: 4, name: 'Alphintern', dose: '1 tablet', time: 'Yesterday at 08:00 am' },

  { id: 5, name: 'Vitamin C', dose: '1 tablet (1000mg)', time: 'Yesterday at 10:30 am' },

  { id: 6, name: 'Amoxicillin', dose: '1 capsule (500mg)', time: 'Today at 02:00 pm' },

  { id: 7, name: 'Omeprazole', dose: '1 capsule (20mg)', time: 'Today at 07:00 am' },

  { id: 8, name: 'Aspirin', dose: '1 tablet (81mg)', time: 'Yesterday at 09:00 pm' },

  { id: 9, name: 'Cetirizine', dose: '1 tablet (10mg)', time: 'Today at 09:30 pm' },
  
  { id: 10, name: 'Loratadine', dose: '1 tablet (10mg)', time: 'Yesterday at 07:15 pm' }
  ]);

  const markAsTaken = (id: number) => {
    setMedications(prev => prev.filter(item => item.id !== id));
  };

  const markAsSkipped = (id: number) => {
    setMedications(prev => prev.filter(item => item.id !== id));
  };

  const markAllAsTaken = () => {
    setMedications([]);
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={{ fontSize: 24 }}>🔔</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            {/* زر الإغلاق */}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>

       
            {medications.length > 0 && (
              <>
                <Text style={styles.title}>Have you taken these?</Text>
                <Text style={styles.subtitle}>Mark them Taken or Skipped</Text>
              </>
            )}
            {medications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-done-circle-outline" size={48} color="#4CAF50" />
                <Text style={styles.emptyText}>All medications taken 🎉</Text>
              </View>
            ) : (
              <>
                <ScrollView style={styles.scrollView}>
                  {medications.map((med) => (
                    <View key={med.id} style={styles.card}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.medicationName}>{med.name} • {med.dose}</Text>
                        {med.time ? <Text style={styles.medicationTime}>{med.time}</Text> : null}
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

                {/* زر "Taken all" يظهر فقط لما في عناصر */}
                <TouchableOpacity style={styles.takeAllButton} onPress={markAllAsTaken}>
                  <Text style={styles.takeAllText}>✓ Taken all</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={markAllAsTaken}>
                  <Text style={styles.skipAllText}>Skipped all</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default HamburgerMenu;
