import { Image, StyleSheet, Platform ,Text } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={{ uri: 'https://domf5oio6qrcr.cloudfront.net/medialibrary/15900/gettyimages-1342010434.jpg' }}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome medicine Reminder !</ThemedText>
        <Text style={styles.content} > Welcome to medicine Reminder , your trusted companion for managing medications efficiently and effortlessly. Our app is designed to help users stay organized and take control of their health by providing essential features such as:

Medication Reminders – Get timely notifications to ensure you never miss a dose.
Dosage Tracking – Keep a record of the medications you have taken and their prescribed dosages.
Prescription Management – Store and access prescription details along with doctor’s instructions.
Refill Alerts – Receive reminders when your medication supply is running low.
Health Monitoring – Track symptoms and side effects over time for better health management.</Text>
        {/* <HelloWave /> */}
        
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  content:{
    fontSize: 16,
    color: '#0A505B',
    textAlign: 'center',
    padding: 10,
    fontWeight: 'bold',
  },
  reactLogo: {
    height: 300,
    width: 500,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
  },
});
