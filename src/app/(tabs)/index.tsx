import { Card } from '@/components/Card';
import { TextStyled } from '@/components/TextStyled';
import { Colors } from '@/constants/Colors';
import { mockUser } from '@/mocks/user';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [menuOpen, setMenuOpen] = useState(false)
  const date = new Date().toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
        <View style={styles.topBar}>
          <View style={styles.userInfosView}>
            <TextStyled
              text="Olá,"
              type='subtitle'
            />
            <TextStyled
              text={mockUser.name.split(' ')[0] + '!'}
              type='title'
              fontWeight="bold"
            />
          </View>

          <View style={styles.iconsView}>
            <TouchableOpacity onPress={toggleMenu} style={styles.iconButtonStyle}>
              <FontAwesome6
                name={menuOpen ? "grip-lines-vertical" : "grip-lines"}
                size={24}
                color={Colors.light.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.content}>
          {/* <Divider /> */}
          <Card>
            <View style={{
              flexDirection: 'column',
              gap: 8,
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
                <TextStyled text='Saldo' />
                <TextStyled text={date} type='caption' />
              </View>
              <TextStyled type='title' fontWeight='bold' text='R$ 2000,00' />
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.bgPrimary,
    padding: 20
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  iconsView: {
    flexDirection: 'row',
    gap: 8
  },
  iconButtonStyle: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: Colors.light.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2
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
  content: {
    gap: 16
  },
})
