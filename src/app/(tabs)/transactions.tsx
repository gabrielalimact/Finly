import { TextStyled } from '@/components/TextStyled';
import { Colors } from '@/constants/Colors';
import { ITransacao, deleteTransacao, formatCurrency, formatDate, getTransacaoColor, transacoesAPI } from '@/services/transacoes-service';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionsScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'receita' | 'despesa'>('all');
  const [transacoes, setTransacoes] = useState<ITransacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<ITransacao | null>(null);

  const loadTransacoes = async () => {
    try {
      setLoading(true);
      const data = await transacoesAPI.getAll();
      setTransacoes(data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      setTransacoes([]);
    } finally {
      setLoading(false);
    }
  };

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

  const handleEditTransaction = (transaction: ITransacao) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    router.push({
      pathname: '/manual-transaction',
      params: { 
        transactionId: transaction.id.toString(),
        description: transaction.descricao,
        amount: transaction.valor.toString(),
        type: transaction.tipo,
        accountId: transaction.conta.id.toString(),
        categoryId: transaction.categoria?.id.toString() || '',
      }
    });
  }

  const handleDeleteTransaction = async () => {
    if (!selectedTransaction) return;

    try {
      await deleteTransacao(selectedTransaction.id);
      closeModal();
      loadTransacoes();
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      Alert.alert('Erro', 'Erro ao excluir transação. Tente novamente.');
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: handleDeleteTransaction,
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadTransacoes();
    }, [])
  );

  const filteredTransactions = selectedFilter === 'all' 
    ? transacoes 
    : transacoes.filter(t => t.tipo === selectedFilter);

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTransaction(null);
  };

  const renderTransactionItem = ({ item }: { item: ITransacao }) => (
    <TouchableOpacity style={styles.transactionCard} onPress={() => handleEditTransaction(item)}>
      <View style={styles.transactionLeft}>
        <View style={[styles.transactionIcon, { backgroundColor: getTransacaoColor(item.tipo, Colors.light) }]}>
          <Ionicons 
            name={item.tipo === 'receita' ? 'arrow-down' : 'arrow-up'} 
            size={20} 
            color="white" 
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{item.descricao.toUpperCase()}</Text>
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
        R$ {formatCurrency(item.valor)}
      </Text>
    </TouchableOpacity>
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

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle='pageSheet'
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.light.black} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Editar Transação</Text>
            <View style={{ width: 24 }} />
          </View>

          {selectedTransaction && (
            <View style={styles.modalContent}>
              <View style={styles.transactionPreview}>
                <View style={[styles.previewIcon, { backgroundColor: getTransacaoColor(selectedTransaction.tipo, Colors.light) }]}>
                  <Ionicons 
                    name={selectedTransaction.tipo === 'receita' ? 'arrow-down' : 'arrow-up'} 
                    size={24} 
                    color="white" 
                  />
                </View>
                <View style={styles.previewInfo}>
                  <Text style={styles.previewDescription}>{selectedTransaction.descricao}</Text>
                  <Text style={styles.previewAmount}>{formatCurrency(selectedTransaction.valor)}</Text>
                  <Text style={styles.previewDetails}>
                    {formatDate(selectedTransaction.dataTransacao)} • {selectedTransaction.conta.nome}
                  </Text>
                  {selectedTransaction.categoria && (
                    <Text style={styles.previewCategory}>{selectedTransaction.categoria.nome}</Text>
                  )}
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => {
                    closeModal();
                    // A função handleEditTransaction já navega para a tela de edição
                    handleEditTransaction(selectedTransaction);
                  }}
                >
                  <Ionicons name="create-outline" size={20} color={Colors.light.green} />
                  <Text style={styles.actionButtonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={confirmDelete}
                >
                  <Ionicons name="trash-outline" size={20} color={Colors.light.darkRed} />
                  <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
        </SafeAreaView>
      </Modal>
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
  // Estilos do Modal
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.bgPrimary,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.bgWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: Colors.light.black,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  transactionPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 24,
  },
  previewIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  previewInfo: {
    flex: 1,
  },
  previewDescription: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: Colors.light.black,
    marginBottom: 4,
  },
  previewAmount: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: Colors.light.black,
    marginBottom: 4,
  },
  previewDetails: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  previewCategory: {
    fontSize: 13,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.green,
  },
  modalActions: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 12,
  },
  deleteButton: {
    borderColor: Colors.light.lightRed,
    backgroundColor: Colors.light.lightRed + '10',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.black,
  },
  deleteButtonText: {
    color: Colors.light.darkRed,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  editForm: {
    gap: 16,
  },
  formLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.black,
    marginBottom: 8,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.light.bgGray,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.textSecondary,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.light.green,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.bgWhite,
    textAlign: 'center',
  },
  
});



