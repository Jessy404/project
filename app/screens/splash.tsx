import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function GetStarted() {
  const [logoScale, setLogoScale] = useState(new Animated.Value(1)); // Animated value for scaling the logo
  const [logoOpacity, setLogoOpacity] = useState(new Animated.Value(1)); // Animated value for opacity (fading effect)

  useEffect(() => {
    // Animation for logo scaling and fading
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1.5, // Scale the logo to 1.5x size
        duration: 1000, // Duration of 1 second for scaling
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoOpacity, {
            toValue: 0, // Fade out
            duration: 3000, 
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacity, {
            toValue: 1, // Fade in
            duration:3000,
            useNativeDriver: true,
          })
        ])
      )
    ]).start();

    // Navigate to the home/login screen after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/screens/Getstarted');
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/images/Logo.png')}
        style={[styles.logo, { transform: [{ scale: logoScale }] }, { opacity: logoOpacity }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
  logo: {
    width: 100,
    height: 100,
  },
});
