import { IconSymbol } from '@/components/ui/IconSymbol'
import { Colors } from '@/constants/Colors'
import MonthsFlatList from '@/src/modules/home/components/MonthsFlatList'
import PieChartHome from '@/src/modules/home/components/PieChartHome'
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
  const user = {
    name: 'Gabriela',
    saldo: 400,
    valorTotalDespesas: 300,
    valorTotalReceitas: 700
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.topBar}>
          <View style={styles.userInfosView}>
            <Image source={imagePeople} style={styles.userImage} />
            <Text>Olá, {user.name}</Text>
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
          <PieChartHome user={user} />
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
