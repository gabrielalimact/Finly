import { TextStyled } from '@/components/TextStyled'
import { Colors } from '@/constants/Colors'
import { contasAPI, getCorFromConta, getInitialsFromConta, IConta } from '@/services/contasAPI'
import { atualizarProgressoMetas } from '@/services/metas-service'
import { showMetaConcluida, showMultiplasMetasConcluidas } from '@/services/notification-service'
import { categoriasAPI, ICategoria, ICreateTransacao, transacoesAPI, validateTransacao } from '@/services/transacoes-service'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ManualTransactionScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  
  // Estados do formulário
  const [transferDescription, setTransferDescription] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [transferType, setTransferType] = useState<'receita' | 'despesa'>('despesa')
  const [contas, setContas] = useState<IConta[]>([])
  const [selectedConta, setSelectedConta] = useState<IConta | null>(null)
  const [loadingContas, setLoadingContas] = useState(false)
  const [categorias, setCategorias] = useState<ICategoria[]>([])
  const [selectedCategoria, setSelectedCategoria] = useState<ICategoria | null>(null)
  const [tipoParcelamento, setTipoParcelamento] = useState<'avista' | 'parcelado' | 'recorrente'>('avista')
  const [quantidadeParcelas, setQuantidadeParcelas] = useState('2')
  const [loadingCategorias, setLoadingCategorias] = useState(false)
  const [savingTransaction, setSavingTransaction] = useState(false)
  
  // Estados para modals
  const [showContaModal, setShowContaModal] = useState(false)
  const [showCategoriaModal, setShowCategoriaModal] = useState(false)
  
  const isEditMode = !!params.transactionId
  const isFromIA = params.fromIA === 'true'

  // Estados para carregamento de dados
  const [dataLoaded, setDataLoaded] = useState(false)


  const formatCurrency = (value: string): string => {
    const numericValue = value.replace(/\D/g, '')
    if (!numericValue) return ''
    const numberValue = parseInt(numericValue) / 100
    return numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const parseAmount = (formattedValue: string): number => {
    const cleanValue = formattedValue.replace(/[R$\s.]/g, '').replace(',', '.')
    return parseFloat(cleanValue) || 0
  }

  const loadContas = async () => {
    try {
      setLoadingContas(true)
      const contasData = await contasAPI.getContas()
      setContas(contasData)
      
      if (contasData.length > 0 && !selectedConta) {
        setSelectedConta(contasData[0])
      }
    } catch (error) {
      console.error('Erro ao carregar contas:', error)
      setContas([])
    } finally {
      setLoadingContas(false)
    }
  }

  // Carregar categorias
  const loadCategorias = async () => {
    try {
      setLoadingCategorias(true)
      const categoriasData = await categoriasAPI.getAll()
      setCategorias(categoriasData)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
      setCategorias([])
    } finally {
      setLoadingCategorias(false)
    }
  }

  // Carregar dados para edição ou pré-preenchimento
  const loadTransactionData = async () => {
    if (isEditMode && params.transactionId) {
      try {
        const transaction = await transacoesAPI.getById(params.transactionId as string)
        
        setTransferDescription(transaction.descricao)
        setTransferAmount(formatCurrency((transaction.valor * 100).toString()))
        setTransferType(transaction.tipo as 'receita' | 'despesa')
        
        // Encontrar e selecionar conta
        const contaEncontrada = contas.find(conta => conta.id === transaction.conta.id)
        if (contaEncontrada) {
          setSelectedConta(contaEncontrada)
        }
        
        // Encontrar e selecionar categoria
        if (transaction.categoria) {
          const categoriaEncontrada = categorias.find(cat => cat.id === transaction.categoria?.id)
          if (categoriaEncontrada) {
            setSelectedCategoria(categoriaEncontrada)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar transação:', error)
        Alert.alert('Erro', 'Não foi possível carregar os dados da transação.')
        router.dismiss()
      }
    } else if (isFromIA) {
      // Pré-preencher com dados da IA
      if (params.description) setTransferDescription(params.description as string)
      if (params.amount) setTransferAmount(formatCurrency((parseFloat(params.amount as string) * 100).toString()))
      if (params.type) setTransferType(params.type as 'receita' | 'despesa')
      
      // Selecionar conta
      if (params.accountId) {
        const contaEncontrada = contas.find(conta => conta.id === parseInt(params.accountId as string))
        if (contaEncontrada) {
          setSelectedConta(contaEncontrada)
        }
      }
      
      // Selecionar categoria
      if (params.categoryId) {
        const categoriaEncontrada = categorias.find(cat => cat.id === parseInt(params.categoryId as string))
        if (categoriaEncontrada) {
          setSelectedCategoria(categoriaEncontrada)
        }
      }
    }
  }

  useEffect(() => {
    loadContas()
    loadCategorias()
  }, [])

  useEffect(() => {
    // Carregar dados após carregar contas e categorias
    if (!dataLoaded && contas.length > 0 && categorias.length > 0) {
      loadTransactionData()
      setDataLoaded(true)
    }
  }, [contas, categorias, dataLoaded])

  const handleSave = async () => {
    console.log('Dados da transação:', {
      descricao: transferDescription,
      valor: parseAmount(transferAmount),
      tipo: transferType,
      contaId: selectedConta?.id || 0,
      categoriaId: selectedCategoria?.id || undefined,
    })
    try {
      // Validação
      const errors = validateTransacao({
        descricao: transferDescription,
        valor: parseAmount(transferAmount),
        tipo: transferType,
        contaId: selectedConta?.id || 0,
        categoriaId: selectedCategoria?.id || undefined,
      })

      if (errors.length > 0) {
        Alert.alert('Erro de Validação', errors.join('\n'))
        return
      }

      setSavingTransaction(true)
      
      const transacaoData: ICreateTransacao = {
        descricao: transferDescription.trim(),
        valor: parseAmount(transferAmount),
        tipo: transferType,
        contaId: selectedConta!.id!,
        categoriaId: selectedCategoria?.id || undefined,
      }

      if (isEditMode && params.transactionId) {
        await transacoesAPI.update(params.transactionId as string, transacaoData)
      } else {
        await transacoesAPI.create(transacaoData)
      }
      
      // Após salvar a transação, verifica se alguma meta foi concluída
      try {
        const resultadoMetas = await atualizarProgressoMetas()
        
        // Se houve metas concluídas, exibe notificações
        if (resultadoMetas.metasConcluidas && resultadoMetas.metasConcluidas.length > 0) {
          if (resultadoMetas.metasConcluidas.length === 1) {
            await showMetaConcluida(resultadoMetas.metasConcluidas[0])
          } else {
            await showMultiplasMetasConcluidas(resultadoMetas.metasConcluidas)
          }
        }
      } catch (metaError) {
        console.warn('Erro ao verificar metas concluídas:', metaError)
        // Não interrompe o fluxo se houver erro nas metas
      }
      
      router.dismiss()
    } catch (error: any) {
      console.error('Erro ao salvar transação:', error)
      Alert.alert('Erro', error.message || 'Erro ao salvar transação')
    } finally {
      setSavingTransaction(false)
    }
  }

  const handleCancel = () => {
    router.dismiss()
  }

  const getScreenTitle = () => {
    if (isEditMode) return 'Editar Transação'
    if (isFromIA) return 'Revisar Transação da IA'
    return 'Nova Transação Manual'
  }

  const getSaveButtonText = () => {
    if (isEditMode) return 'Atualizar'
    return 'Salvar'
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.black} />
          </TouchableOpacity>
          <Text style={styles.title}>{getScreenTitle()}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          {/* Descrição */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Descrição</Text>
            <TextInput
              style={styles.textInput}
              value={transferDescription}
              onChangeText={setTransferDescription}
              placeholder="Ex: Almoço no restaurante"
              placeholderTextColor={Colors.light.textSecondary}
            />
          </View>

          {/* Valor */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Valor</Text>
            <TextInput
              style={styles.textInput}
              value={transferAmount}
              onChangeText={(text) => setTransferAmount(formatCurrency(text))}
              placeholder="R$ 0,00"
              placeholderTextColor={Colors.light.textSecondary}
              keyboardType="numeric"
            />
          </View>

          {/* Tipo */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Tipo</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  transferType === 'despesa' && styles.typeButtonActive
                ]}
                onPress={() => setTransferType('despesa')}
              >
                <Ionicons 
                  name="arrow-down" 
                  size={20} 
                  color={transferType === 'despesa' ? Colors.light.black : Colors.light.textSecondary} 
                />
                <Text style={[
                  styles.typeButtonText,
                  transferType === 'despesa' && styles.typeButtonTextActive
                ]}>
                  Despesa
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  transferType === 'receita' && styles.typeButtonActive
                ]}
                onPress={() => setTransferType('receita')}
              >
                <Ionicons 
                  name="arrow-up" 
                  size={20} 
                  color={transferType === 'receita' ? Colors.light.black : Colors.light.textSecondary} 
                />
                <Text style={[
                  styles.typeButtonText,
                  transferType === 'receita' && styles.typeButtonTextActive
                ]}>
                  Receita
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Conta */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Conta</Text>
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={() => setShowContaModal(true)}
            >
              {selectedConta ? (
                <View style={styles.selectButtonContent}>
                  <View style={[
                    styles.contaIcon, 
                    { backgroundColor: getCorFromConta(selectedConta.nome) }
                  ]}>
                    <TextStyled 
                      text={getInitialsFromConta(selectedConta.nome)}
                      fontWeight="bold"
                      color="#fff"
                      type="caption"
                    />
                  </View>
                  <Text style={styles.selectButtonText}>{selectedConta.nome}</Text>
                </View>
              ) : (
                <Text style={styles.selectButtonPlaceholder}>Selecione uma conta</Text>
              )}
              <Ionicons name="chevron-down" size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Categoria */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Categoria</Text>
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={() => setShowCategoriaModal(true)}
            >
              {selectedCategoria ? (
                <View style={styles.selectButtonContent}>
                  <Ionicons name="folder" size={20} color={Colors.light.green} />
                  <Text style={styles.selectButtonText}>{selectedCategoria.nome}</Text>
                </View>
              ) : (
                <Text style={styles.selectButtonPlaceholder}>Selecione uma categoria (opcional)</Text>
              )}
              <Ionicons name="chevron-down" size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Parcelamento (só para despesas) */}
          {transferType === 'despesa' && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Parcelamento</Text>
              <View style={styles.parcelamentoContainer}>
                <TouchableOpacity
                  style={[
                    styles.parcelamentoButton,
                    tipoParcelamento === 'avista' && styles.parcelamentoButtonActive
                  ]}
                  onPress={() => setTipoParcelamento('avista')}
                >
                  <Text style={[
                    styles.parcelamentoButtonText,
                    tipoParcelamento === 'avista' && styles.parcelamentoButtonTextActive
                  ]}>
                    À vista
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.parcelamentoButton,
                    tipoParcelamento === 'parcelado' && styles.parcelamentoButtonActive
                  ]}
                  onPress={() => setTipoParcelamento('parcelado')}
                >
                  <Text style={[
                    styles.parcelamentoButtonText,
                    tipoParcelamento === 'parcelado' && styles.parcelamentoButtonTextActive
                  ]}>
                    Parcelado
                  </Text>
                </TouchableOpacity>
              </View>
              
              {tipoParcelamento === 'parcelado' && (
                <View style={styles.parcelasInputContainer}>
                  <Text style={styles.parcelasLabel}>Quantidade de parcelas:</Text>
                  <TextInput
                    style={styles.parcelasInput}
                    value={quantidadeParcelas}
                    onChangeText={setQuantidadeParcelas}
                    keyboardType="numeric"
                    placeholder="2"
                  />
                </View>
              )}
            </View>
          )}

          {/* Botão Salvar */}
          <TouchableOpacity 
            style={[
              styles.saveButton,
              savingTransaction && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={savingTransaction}
          >
            {savingTransaction ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.saveButtonText}>{getSaveButtonText()}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Seleção de Conta */}
      <Modal
        visible={showContaModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowContaModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowContaModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Selecionar Conta</Text>
                  <TouchableOpacity onPress={() => setShowContaModal(false)}>
                    <Ionicons name="close" size={24} color={Colors.light.black} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalList}>
                  {contas.map((conta) => (
                    <TouchableOpacity
                      key={conta.id?.toString() || conta.nome}
                      style={[
                        styles.modalListItem,
                        selectedConta?.id === conta.id && styles.modalListItemSelected
                      ]}
                      onPress={() => {
                        setSelectedConta(conta)
                        setShowContaModal(false)
                      }}
                    >
                      <View style={[
                        styles.contaIcon, 
                        { backgroundColor: getCorFromConta(conta.nome) }
                      ]}>
                        <TextStyled 
                          text={getInitialsFromConta(conta.nome)}
                          fontWeight="bold"
                          color="#fff"
                          type="caption"
                        />
                      </View>
                      <View style={styles.modalListItemContent}>
                        <Text style={styles.modalListItemTitle}>{conta.nome}</Text>
                        <Text style={styles.modalListItemSubtitle}>
                          Saldo: R$ {conta.saldo?.toFixed(2) || '0.00'}
                        </Text>
                      </View>
                      {selectedConta?.id === conta.id && (
                        <Ionicons name="checkmark" size={20} color={Colors.light.green} />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal de Seleção de Categoria */}
      <Modal
        visible={showCategoriaModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoriaModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCategoriaModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Selecionar Categoria</Text>
                  <TouchableOpacity onPress={() => setShowCategoriaModal(false)}>
                    <Ionicons name="close" size={24} color={Colors.light.black} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalList}>
                  <TouchableOpacity
                    style={[
                      styles.modalListItem,
                      !selectedCategoria && styles.modalListItemSelected
                    ]}
                    onPress={() => {
                      setSelectedCategoria(null)
                      setShowCategoriaModal(false)
                    }}
                  >
                    <View style={styles.categoriaIcon}>
                      <Ionicons name="close" size={20} color={Colors.light.textSecondary} />
                    </View>
                    <View style={styles.modalListItemContent}>
                      <Text style={styles.modalListItemTitle}>Sem categoria</Text>
                    </View>
                    {!selectedCategoria && (
                      <Ionicons name="checkmark" size={20} color={Colors.light.green} />
                    )}
                  </TouchableOpacity>
                  
                  {categorias.map((categoria) => (
                    <TouchableOpacity
                      key={categoria.id}
                      style={[
                        styles.modalListItem,
                        selectedCategoria?.id === categoria.id && styles.modalListItemSelected
                      ]}
                      onPress={() => {
                        setSelectedCategoria(categoria)
                        setShowCategoriaModal(false)
                      }}
                    >
                      <View style={styles.categoriaIcon}>
                        <Ionicons name="folder" size={20} color={Colors.light.green} />
                      </View>
                      <View style={styles.modalListItemContent}>
                        <Text style={styles.modalListItemTitle}>{categoria.nome}</Text>
                      </View>
                      {selectedCategoria?.id === categoria.id && (
                        <Ionicons name="checkmark" size={20} color={Colors.light.green} />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.bgPrimary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: Colors.light.black,
  },
  content: {
    flex: 1,
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.black,
  },
  textInput: {
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.black,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 16,
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: Colors.light.green,
    borderColor: Colors.light.green,
  },
  typeButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.textSecondary,
  },
  typeButtonTextActive: {
    color: Colors.light.black,
  },
  selectButton: {
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.black,
  },
  selectButtonPlaceholder: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.textSecondary,
  },
  contaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.bgPrimary,
  },
  parcelamentoContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  parcelamentoButton: {
    flex: 1,
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 16,
    alignItems: 'center',
  },
  parcelamentoButtonActive: {
    backgroundColor: Colors.light.green,
    borderColor: Colors.light.green,
  },
  parcelamentoButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.textSecondary,
  },
  parcelamentoButtonTextActive: {
    color: Colors.light.black,
  },
  parcelasInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  parcelasLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.black,
  },
  parcelasInput: {
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.black,
    width: 80,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: Colors.light.green,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.black,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.light.bgWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: Colors.light.black,
  },
  modalList: {
    flex: 1,
  },
  modalListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalListItemSelected: {
    backgroundColor: Colors.light.bgPrimary,
  },
  modalListItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  modalListItemTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.black,
  },
  modalListItemSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
})
