import { CircularChart } from '@/components/CircularChart';
import { MonthsList } from '@/components/MonthsList';
import { TextStyled } from '@/components/TextStyled';
import { Colors } from '@/constants/Colors';
import { useUserContext } from '@/contexts';
import { contasAPI, getCorFromConta, getInitialsFromConta, IConta } from '@/services/contas-service';
import { ITransacao, transacoesAPI } from '@/services/transacoes-service';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter()
  const { user } = useUserContext()
  const [eyeOpen, setEyeOpen] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [contas, setContas] = useState<IConta[]>([])
  const [loadingContas, setLoadingContas] = useState(false)
  const [transacoes, setTransacoes] = useState<ITransacao[]>([])
  const [loadingTransacoes, setLoadingTransacoes] = useState(false)

  const toggleMenu = () => {
    setEyeOpen(!eyeOpen)
  }

  const loadContas = async () => {
    try {
      setLoadingContas(true)
      const contasData = await contasAPI.getContas()
      setContas(contasData)
    } catch (error) {
      console.error('Erro ao carregar contas:', error)
      // Em caso de erro, usar dados mockados vazios
      setContas([])
    } finally {
      setLoadingContas(false)
    }
  }

  const loadTransacoes = async () => {
    try {
      setLoadingTransacoes(true)
      const transacoesData = await transacoesAPI.getLastThree()
      setTransacoes(transacoesData)
    } catch (error) {
      console.error('Erro ao carregar transações:', error)
      // Em caso de erro, usar dados mockados vazios
      setTransacoes([])
    } finally {
      setLoadingTransacoes(false)
    }
  }

  useEffect(() => {
    loadContas()
    loadTransacoes()
  }, [])

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

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  const renderAccountCard = ({ item }: { item: IConta }) => (
    <View style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View style={[styles.accountIcon, { backgroundColor: getCorFromConta(item.nome) }]}>
          <TextStyled 
            text={getInitialsFromConta(item.nome)}
            fontWeight="bold"
            color="#fff"
            type="caption"
          />
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>{item.nome}</Text>
        </View>
      </View>
    </View>
  )

  const renderTransactionItem = ({ item }: { item: ITransacao }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionLeft}>
        <View style={[styles.transactionIcon, { backgroundColor: item.tipo === 'receita' ? Colors.light.green : Colors.light.darkRed }]}>
          <Ionicons 
            name={item.tipo === 'receita' ? 'arrow-down' : 'arrow-up'} 
            size={16} 
            color="white" 
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{item.descricao}</Text>
          <Text style={styles.transactionDate}>{formatDate(item.dataTransacao)} • {item.conta.nome}</Text>
        </View>
      </View>
      <Text style={[styles.transactionAmount, { color: item.tipo === 'receita' ? Colors.light.green : Colors.light.darkRed }]}>
        R$ {formatCurrency(item.valor)}
      </Text>
    </View>
  )

  const handleGoToTransactions = () => {
    router.push('/transactions')
  }

  const handleAddTransaction = () => {
    router.push('/new-transactions-ia')
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

        <MonthsList year={2026} onMonthChange={handleMonthChange} />
        <View style={styles.content}>
          <CircularChart
            income={currentMonthData.income}
            expenses={currentMonthData.expenses}
            hideValues={!eyeOpen}
            selectedMonth={selectedMonth}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.addTransactionButton} 
          onPress={handleAddTransaction}
        >
          <View style={styles.addTransactionIcon}>
            <Ionicons name="add" size={20} color="white" />
          </View>
          <Text style={styles.addTransactionText}>Adicionar transação</Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.light.green} />
        </TouchableOpacity>

        {/* Seção de Contas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Minhas Contas</Text>
            <TouchableOpacity onPress={() => router.push('/accounts')}>
              <Text style={styles.sectionAction}>{contas.length > 0 ? 'Ver todas' : 'Adicionar conta'}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={contas}
            renderItem={renderAccountCard}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.accountsList}
            ListEmptyComponent={<Text style={styles.emptyListText}>Nenhuma conta encontrada.</Text>}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Últimas Transações</Text>
            <TouchableOpacity onPress={handleGoToTransactions}>
              <Text style={styles.sectionAction}>{transacoes.length > 0 ? 'Ver todas' : ''}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={transacoes}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            ListEmptyComponent={<Text style={styles.emptyListText}>Nenhuma transação encontrada.</Text>}
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
    paddingBottom: 140, // Espaço extra para a bottom bar
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
    marginBottom: 20,
  },
  // Estilos das seções
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.black,
  },
  sectionAction: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.green,
  },
  // Estilos dos cards de conta
  accountsList: {
    paddingRight: 20,
  },
  accountCard: {
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 160,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.black,
  },
  bankName: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.textSecondary,
  },
  accountBalance: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'right',
  },
  // Estilos dos cards de transação
  transactionCard: {
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.black,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
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
  // Estilos do botão de adicionar transação
  addTransactionButton: {
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 16,
    padding: 18,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  addTransactionIcon: {
    backgroundColor: Colors.light.green,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTransactionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.black,
    marginLeft: 16,
  },
  emptyListText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.textSecondary,
  },
});
