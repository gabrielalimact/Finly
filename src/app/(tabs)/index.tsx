import { Card } from '@/components/Card';
import { MonthsList } from '@/components/MonthsList';
import { TextStyled } from '@/components/TextStyled';
import { Colors } from '@/constants/Colors';
import { mockUser } from '@/mocks/user';
import { CardsBalance } from '@/modules/home-page/components/CardsBalance';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [eyeOpen, setEyeOpen] = useState(true)

  const date = new Date().toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const toggleMenu = () => {
    setEyeOpen(!eyeOpen)
  }

  return (
    <LinearGradient 
      colors={['#ffffffff', '#dcffeeff']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.topBar}>
            <View style={styles.userInfosView}>
              <TextStyled text="Olá," type='subtitle' color={Colors.light.textSecondary} />
              <TextStyled
                text={mockUser.name.split(' ')[0] + '!'}
                type='title'
                fontWeight="bold"
                color={Colors.light.text}
              />
            </View>

            <View style={styles.iconsView}>
              <TouchableOpacity onPress={toggleMenu} style={styles.iconButtonStyle}>
                <Ionicons
                  name={eyeOpen ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color={Colors.light.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButtonStyle}>
                <Ionicons name="notifications-outline" size={24} color={Colors.light.icon} />
              </TouchableOpacity>
            </View>
          </View>

          <MonthsList year={2025} />
          <View style={styles.content}>
            <View style={styles.balanceView}>
              <CardsBalance
                title="Receitas"
                amount={eyeOpen ? 'R$ 5.000,00' : 'R$ ****,**'}
                isPositive
              />
              <CardsBalance
                title="Despesas"
                amount={eyeOpen ? 'R$ 5.000,00' : 'R$ ****,**'}
                isPositive={false}
              />
            </View>

            <Card style={styles.card}>
              <View style={styles.iconDollarBox}>
                <FontAwesome5 name="dollar-sign" size={24} color={Colors.light.icon} />
              </View>
              <View style={styles.cardTexts}>
                <View style={styles.cardRow}>
                  <TextStyled
                    text="Saldo em"
                    color={Colors.light.textSecondary}
                  />
                  <TextStyled
                    text={date.split('/')[1] + "/" + date.split('/')[2]}
                    fontWeight='bold'
                    color={Colors.light.textSecondary}
                  />
                </View>
                <TextStyled
                  text={eyeOpen ? 'R$ 10.000,00' : 'R$ ****,**'}
                  fontWeight='bold'
                  color={Colors.light.text}
                />
              </View>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userInfosView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconsView: {
    flexDirection: 'row',
  },
  iconButtonStyle: {
    padding: 8,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    backgroundColor: Colors.light.bgPrimary,
  },
  content: {
    gap: 16,
  },
  balanceView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light.bgPrimary,
    borderColor: Colors.light.border,
  },
  iconDollarBox: {
    backgroundColor: Colors.light.positiveBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  cardTexts: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  }
});
