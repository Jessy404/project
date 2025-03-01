import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const AboutUs = () => {
  const teamMembers = [
    { name: 'Yasmeen Ibrahim', code: '2027275', role: 'Team Leader' },
    { name: 'Marwa Rabiaa', code: '2027275', role: 'Team Member' },
    { name: 'Nada Mohamed', code: '2027275', role: 'Team Member' },
    { name: 'Radwa Omar', code: '2027275', role: 'Team Member' },
    { name: 'Rawan Ahmed', code: '2227564', role: 'Team Member' },
    { name: 'Alaa Nasser', code: '2127454', role: 'Team Member' },
    { name: 'Rawan Ahmed', code: '2227564', role: 'Team Member' },
    { name: 'Alaa Nasser', code: '2127454', role: 'Team Member' }, 

];


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#0A505B" />
        </TouchableOpacity>
        <Text style={styles.title}>About Us</Text>
      </View>

      <View style={styles.teamContainer}>
        {teamMembers.map((member, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberRole}>{member.role}</Text>
            <Text style={styles.memberCode}>Code: {member.code}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flexGrow: 1,
    backgroundColor: '#F5F5F5',
    paddingBottom: 20,
    flex :1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    elevation: 2,
  },
  backButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#E5FCFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A505B',
    textAlign: 'center',
    flex: 1,
  },
  teamContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 15,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A505B',
  },
  memberRole: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  memberCode: {
    fontSize: 14,
    color: '#777',
  },
});

export default AboutUs;
