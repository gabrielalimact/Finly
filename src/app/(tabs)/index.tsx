import { CircularChart } from '@/components/CircularChart';
import { MonthsList } from '@/components/MonthsList';
import { TextStyled } from '@/components/TextStyled';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/contexts';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user } = useUser()
  const [eyeOpen, setEyeOpen] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())

  const toggleMenu = () => {
    setEyeOpen(!eyeOpen)
  }

  // Dados mockados por mês (Janeiro = 0, Dezembro = 11)
  const monthlyData = {
    0: { income: 4200, expenses: 2800 }, // Janeiro
    1: { income: 3800, expenses: 3200 }, // Fevereiro
    2: { income: 4500, expenses: 2900 }, // Março
    3: { income: 4000, expenses: 3100 }, // Abril
    4: { income: 5000, expenses: 3000 }, // Maio (dados atuais)
    5: { income: 4300, expenses: 2700 }, // Junho
    6: { income: 4600, expenses: 3400 }, // Julho
    7: { income: 4100, expenses: 2600 }, // Agosto
    8: { income: 4700, expenses: 3200 }, // Setembro
    9: { income: 4400, expenses: 2900 }, // Outubro
    10: { income: 4800, expenses: 3100 }, // Novembro
    11: { income: 5200, expenses: 3500 }, // Dezembro
  }

  const currentMonthData = monthlyData[selectedMonth as keyof typeof monthlyData] || monthlyData[4]

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month)
  }

  useEffect(() => {
    setSelectedMonth(new Date().getMonth())
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <View style={styles.userInfosView}>
            <TextStyled text="Olá," type='subtitle' color={Colors.light.textSecondary} />
            <TextStyled
              text={user?.name?.split(' ')[0] + '!' || 'Usuário!'}
              type='title'
              fontWeight="bold"
              color={Colors.light.black}
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

        <MonthsList year={2025} onMonthChange={handleMonthChange} />
        <View style={styles.content}>
          <CircularChart
            income={currentMonthData.income}
            expenses={currentMonthData.expenses}
            hideValues={!eyeOpen}
            selectedMonth={selectedMonth}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.bgPrimary,
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
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: Colors.light.green,
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
  },
});
