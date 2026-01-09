import { TextStyled } from '@/components/TextStyled';
import { Colors } from '@/constants/Colors';
import { ITransacao, formatCurrency, formatDate, getTransacaoColor, transacoesAPI } from '@/services/transacoes-service';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'receita' | 'despesa'>('all');
  const [transacoes, setTransacoes] = useState<ITransacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Carregar transações
  const loadTransacoes = async () => {
    try {
      setLoading(true);
      const data = await transacoesAPI.getAll();
      setTransacoes(data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      // Em caso de erro, manter array vazio
      setTransacoes([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para refresh separada
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await transacoesAPI.getAll();
      setTransacoes(data);
    } catch (error) {
      console.error('Erro ao recarregar transações:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Usar useFocusEffect para recarregar quando a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadTransacoes();
    }, [])
  );

  const filteredTransactions = selectedFilter === 'all' 
    ? transacoes 
    : transacoes.filter(t => t.tipo === selectedFilter);

  const renderTransactionItem = ({ item }: { item: ITransacao }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionLeft}>
        <View style={[styles.transactionIcon, { backgroundColor: getTransacaoColor(item.tipo, Colors.light) }]}>
          <Ionicons 
            name={item.tipo === 'receita' ? 'arrow-down' : 'arrow-up'} 
            size={20} 
            color="white" 
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{item.descricao}</Text>
          <Text style={styles.transactionDetails}>
            {formatDate(item.dataTransacao)} • {item.conta.nome}
            {item.quantidadeParcelas > 1 && ` (${item.parcelaAtual}/${item.quantidadeParcelas})`}
          </Text>
          {item.categoria && (
            <Text style={styles.transactionCategory}>{item.categoria.nome}</Text>
          )}
        </View>
      </View>
      <Text style={[styles.transactionAmount, { color: getTransacaoColor(item.tipo, Colors.light) }]}>
        {formatCurrency(item.valor)}
      </Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TextStyled
            text="Transações"
            type="title"
            fontWeight="bold"
            color={Colors.light.black}
          />
          
          {/* Filtros */}
          <View style={styles.filterContainer}>
            <TouchableOpacity 
              style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
                Todas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, selectedFilter === 'receita' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('receita')}
            >
              <Text style={[styles.filterText, selectedFilter === 'receita' && styles.filterTextActive]}>
                Receitas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, selectedFilter === 'despesa' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('despesa')}
            >
              <Text style={[styles.filterText, selectedFilter === 'despesa' && styles.filterTextActive]}>
                Despesas
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.green} />
            <Text style={styles.loadingText}>Carregando transações...</Text>
          </View>
        ) : filteredTransactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color={Colors.light.textSecondary} />
            <Text style={styles.emptyTitle}>Nenhuma transação encontrada</Text>
            <Text style={styles.emptyMessage}>
              {selectedFilter === 'all' 
                ? 'Você ainda não tem nenhuma transação registrada.'
                : `Você não tem ${selectedFilter === 'receita' ? 'receitas' : 'despesas'} registradas.`
              }
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.bgPrimary,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.bgWhite,
  },
  filterButtonActive: {
    backgroundColor: Colors.light.green,
    borderColor: Colors.light.green,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.textSecondary,
  },
  filterTextActive: {
    color: Colors.light.black,
    fontFamily: 'Montserrat-SemiBold',
  },
  listContent: {
    paddingBottom: 140, // Espaço para a bottom bar
  },
  transactionCard: {
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.black,
    marginBottom: 4,
  },
  transactionDetails: {
    fontSize: 13,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.textTertiary,
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    marginLeft: 12,
  },
  // Estados de loading e vazio
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.textSecondary,
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});