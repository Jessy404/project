import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { db } from '../../config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const MedicationReminder = () => {
  const markStatus = async (medName: string, date: string, status: string) => {
    try {
      const docId = `${medName}_${date}`;
      await setDoc(doc(db, 'medications', docId), {
        name: medName,
        date: date,
        status: status,
        timestamp: new Date()
      });
      Alert.alert(`${medName} marked as ${status}`);
    } catch (error) {
      console.error('Error writing document: ', error);
      Alert.alert('Error', 'Something went wrong while saving.');
    }
  };

  const renderMedication = (name: string, dateLabel: string) => (
    <View style={{ marginBottom: 15 }}>
      <Text style={{ fontWeight: 'bold' }}>{name} = 1.0 pill</Text>
      <Text>{dateLabel}</Text>
      <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <TouchableOpacity
          onPress={() => markStatus(name, dateLabel, 'Skipped')}
          style={{ marginRight: 10, padding: 5, backgroundColor: '#f0f0f0' }}
        >
          <Text>Skipped</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => markStatus(name, dateLabel, 'Taken')}
          style={{ padding: 5, backgroundColor: '#f0f0f0' }}
        >
          <Text>Taken</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Have you taken these?
      </Text>
      <Text style={{ marginBottom: 20 }}>Mark them Taken or Skipped</Text>

      {renderMedication('Alphatern', 'Today at 08:00 am')}
      {renderMedication('Vitamin C', 'Today at 08:00 am')}
      {renderMedication('Abe', 'Today at 11:59 pm')}
      {renderMedication('Alphatern', 'Yesterday at 08:00 am')}

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontWeight: 'bold' }}>Vitamin C = 1.0 pill</Text>
        <Text>Yesterday at 08:00 am</Text>
        <Text>✅ Taken all</Text>
      </View>

      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: '#f0f0f0',
          alignItems: 'center'
        }}
      >
        <Text>Skipped all</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MedicationReminder;
