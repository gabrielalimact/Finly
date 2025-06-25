import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.replace('/')}><Text>Fazer logout</Text></TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.bgPrimary,
  }
})
