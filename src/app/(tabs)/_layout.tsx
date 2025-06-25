import { Colors } from "@/constants/Colors"
import { AntDesign } from "@expo/vector-icons"
import { router, Tabs } from "expo-router"
import { StyleSheet, TouchableOpacity, View } from "react-native"

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.light.tint,
          tabBarIconStyle: { marginTop: 10 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <AntDesign size={28} name="home" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color }) => (
              <AntDesign size={28} name="user" color={color} />
            ),
          }}
        />
      </Tabs>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.floatingButton}
        onPress={() => router.push("/new-transaction")}
      >
        <AntDesign size={28} name="plus" color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: Colors.light.tint,
    borderRadius: 999,
    borderWidth: 3,
    height: 60,
    width: 60,
    borderColor: "white",
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