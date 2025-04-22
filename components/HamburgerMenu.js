import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NotificationModal = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const [medications, setMedications] = useState([
    { id: 1, name: 'Alphatern', dose: '1.0 pill', time: 'Today at 08:00 am' },
    { id: 2, name: 'Vitamin c', dose: '1.0 pill', time: 'Today at 08:00 am' },
    { id: 3, name: 'Abc', dose: '2.0 pills', time: 'Today at 11:59 pm' },
    { id: 4, name: 'Alphatern', dose: '1.0 pill', time: 'Yesterday at 08:00 am' },
    { id: 5, name: 'Vitamin c', dose: '1.0 pill', time: '' },
  ]);

  const markAsTaken = (id) => {
    setMedications(prev => prev.filter(item => item.id !== id));
  };

  const markAsSkipped = (id) => {
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

            {/* العنوان يظهر فقط إذا القائمة غير فاضية */}
            {medications.length > 0 && (
              <>
                <Text style={styles.title}>Have you taken these?</Text>
                <Text style={styles.subtitle}>Mark them Taken or Skipped</Text>
              </>
            )}

            {/* المحتوى */}
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

                <TouchableOpacity>
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
    backgroundColor: '#000',
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
