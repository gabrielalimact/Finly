import Divider from '@/components/Divider'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { Colors } from '@/constants/Colors'
import { mockUser } from '@/src/mocks/user'
import MonthsFlatList from '@/src/modules/home/components/MonthsFlatList'
import PieChartHome from '@/src/modules/home/components/PieChartHome'
import { getAllBanks } from '@/src/services/brasilAPI'
import { useEffect, useState } from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
const imagePeople = require('@/assets/images/people.png')

export default function HomeScreen() {
  const [banks, setBanks] = useState([])

  useEffect(() => {
    getAllBanks().then((data) => {
      console.log('Banks fetched:', data?.loadPages())
    })
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.topBar}>
          <View style={styles.userInfosView}>
            <Image source={imagePeople} style={styles.userImage} />
            <Text>Olá, {mockUser.name}</Text>
          </View>

          <View style={styles.iconsView}>
            <TouchableOpacity onPress={() => {}}>
              <IconSymbol
                name="magnifyingglass"
                size={24}
                color={Colors.light.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <IconSymbol
                name="line.3.horizontal"
                size={24}
                color={Colors.light.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.content}>
          <MonthsFlatList />
          <PieChartHome user={mockUser} />
          <Divider />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.bgWhite
  },
  topBar: {
    borderColor: Colors.light.border,
    borderBottomWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12
  },
  iconsView: {
    flexDirection: 'row',
    gap: 8
  },
  userInfosView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  userImage: {
    width: 50,
    height: 50
  },
  text: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    textShadowColor: Colors.light.shadow,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },

  content: {
    gap: 16
  }
})
