import React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const GetStarted = () => {
  const router = useRouter();

  return (
    <ImageBackground 
      source={require('../../assets/images/gradiant.jpeg')} 
      style={styles.background}
    >
      <View style={styles.overlay} />
      <View style={styles.content}>
      <Image source={require('../../assets/images/logo1.png')} style={{width: 100, height: 100}} />
        <Text style={styles.title}>Welcome to MedReminder</Text>
        <Text style={styles.subtitle}>Stay on track with your medications and never miss a dose again.</Text>
        
        <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/home')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#E5FCFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default GetStarted;
