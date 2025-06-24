import { Tabs } from 'expo-router'
import React from 'react'

import TabBarBackground from '@/components/ui/TabBarBackground'
import { Colors } from '@/constants/Colors'
import { AntDesign } from '@expo/vector-icons'

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.light.icon,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          marginHorizontal: 30,
          height: 64,
          borderRadius: 30,
          backgroundColor: Colors.light.tint,
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 8,
          elevation: 8,
          overflow: 'hidden',
        },
        tabBarIconStyle: {
          marginTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <AntDesign size={28} name="home" color={color} />
          )
        }}
      />


      <Tabs.Screen
        name="explore"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <AntDesign size={28} name="user" color={color} />
          )
        }}
      />
    </Tabs >
  )
}
