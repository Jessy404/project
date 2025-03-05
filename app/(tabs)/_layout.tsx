import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'react-native';
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>

      
      <Tabs.Screen
        name="home"
        options={{
          tabBarActiveTintColor: "#148B9C",
          tabBarInactiveTintColor: "#3A3535",
          title: 'home',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="home" color={color} size={25} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarActiveTintColor: "#148B9C",
          tabBarInactiveTintColor: "#3A3535",
          title: 'profile',
          tabBarIcon: () => (
            <Image 
              source={{ 
                uri: 'https://i.pinimg.com/736x/19/49/6b/19496bd082a517c236cbb4649608c541.jpg' 
              }}
              style={{
                width: 25, 
                height: 25, 
                borderRadius: 12.5, 
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
