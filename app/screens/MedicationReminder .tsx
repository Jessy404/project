// مثال لشاشة MedicationReminder.js
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const MedicationReminder = () => {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Have you taken these?
      </Text>
      <Text style={{ marginBottom: 20 }}>Mark them Taken or Skipped</Text>

      {/* Alphatern Today */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontWeight: 'bold' }}>Alphatern = 1.0 pill</Text>
        <Text>Today at 08:00 am</Text>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <TouchableOpacity style={{ marginRight: 10, padding: 5, backgroundColor: '#f0f0f0' }}>
            <Text>Skipped</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 5, backgroundColor: '#f0f0f0' }}>
            <Text>Taken</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Vitamin C Today */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontWeight: 'bold' }}>Vitamin c = 1.0 pill</Text>
        <Text>Today at 08:00 am</Text>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <TouchableOpacity style={{ marginRight: 10, padding: 5, backgroundColor: '#f0f0f0' }}>
            <Text>Skipped</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 5, backgroundColor: '#f0f0f0' }}>
            <Text>Taken</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Abe */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontWeight: 'bold' }}>Ibuprofen = 1.0 pill</Text>
        <Text>Today at 01:00 pm</Text>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <TouchableOpacity style={{ marginRight: 10, padding: 5, backgroundColor: '#f0f0f0' }}>
            <Text>Skipped</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 5, backgroundColor: '#f0f0f0' }}>
            <Text>Taken</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Alphatern Yesterday */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontWeight: 'bold' }}>Lisinopril = 1.0 tablet</Text>
        <Text>Today at 10:00 am</Text>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <TouchableOpacity style={{ marginRight: 10, padding: 5, backgroundColor: '#f0f0f0' }}>
            <Text>Skipped</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 5, backgroundColor: '#f0f0f0' }}>
            <Text>Taken</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Vitamin C Yesterday */}

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontWeight: 'bold' }}>Cetirizine = 1.0 tablet</Text>
        <Text>Yesterday at 05:30 pm</Text>
        <Text>✅ Taken all</Text>
      </View>

      {/* Skipped all button */}
      <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: '#f0f0f0', alignItems: 'center' }}>
        <Text>Skipped all</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MedicationReminder;