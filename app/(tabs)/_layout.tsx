import { Tabs } from 'expo-router';
import React from 'react';
import { View, Image, Text } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { HapticTab } from '@/components/HapticTab';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

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
          height: 70,
          position: 'absolute',
          paddingBottom: 10,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginBottom: 18,
        },
      }}>

      {/* شاشة Home */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <AntDesign name="home" color={color}  size={focused ? 28 : 20} />
            </View>
          ),
        }}
      />

      {/* شاشة New */}
      <Tabs.Screen
        name="new"
        options={{
          tabBarLabel: "New",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <MaterialIcons
                name={focused ? "add-circle" : "add-circle-outline"}
                color={color}

                
                size={focused ? 30 : 25}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="challenge"
        options={{
          tabBarLabel: "challenge",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <MaterialCommunityIcons
                name={focused ? "lightning-bolt" : "lightning-bolt-outline"}
                color={color}
                size={focused ? 32 : 25}
              />
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
                  width: focused ? 30 : 28, 
                  height: focused ? 30 : 28, 
                  borderRadius: 16,
                  borderWidth: focused ? 2 : 0,
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
