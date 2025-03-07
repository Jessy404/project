import { Tabs } from 'expo-router';
import React from 'react';
import { View, Image, Text } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { HapticTab } from '@/components/HapticTab';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2265a2",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
          height: 70,  // زودت الارتفاع ليكون مناسب للأيقونات والنصوص
          position: 'absolute',
          paddingBottom: 10,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginBottom: 5,
        },
      }}>

      {/* شاشة Home */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <AntDesign name="home" color={color} size={focused ? 28 : 24} />
            </View>
          ),
        }}
      />

      {/* شاشة Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Image 
                source={{ 
                  uri: 'https://i.pinimg.com/736x/19/49/6b/19496bd082a517c236cbb4649608c541.jpg' 
                }}
                style={{
                  width: focused ? 32 : 28, 
                  height: focused ? 32 : 28, 
                  borderRadius: 16,
                  borderWidth: focused ? 2 : 1,
                  borderColor: color,
                }}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
