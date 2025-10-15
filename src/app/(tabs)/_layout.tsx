import { Colors } from "@/constants/Colors"
import { AntDesign, FontAwesome } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import { StyleSheet, View } from "react-native"

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.light.text,
          tabBarInactiveTintColor: Colors.light.textSecondary,
          tabBarStyle: {
            position: 'absolute',
            bottom: 50,
            height: 70,
            backgroundColor: Colors.light.bgGray,
            borderRadius: 35,
            borderWidth: 1,
            borderColor: Colors.light.border,
            paddingBottom: 0,
            shadowColor: Colors.light.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 10,
            marginHorizontal: 60,
          },
          tabBarItemStyle: {
            paddingVertical: 15,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIcon, focused && styles.activeTabIcon]}>
                <AntDesign size={24} name="home" color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="new-transaction"
          options={{
            title: "Nova Transação",
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIcon, focused && styles.activeTabIcon]}>
                <FontAwesome name="plus" size={20} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIcon, focused && styles.activeTabIcon]}>
                <FontAwesome name="user-o" size={20} color={color} />
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  )
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabIcon: {
    backgroundColor: Colors.light.primaryButtonBg,
  },
  floatingButton: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    backgroundColor: Colors.light.primaryButtonBg,
    borderRadius: 999,
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
})
2