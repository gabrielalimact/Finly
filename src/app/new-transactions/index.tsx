import { TextStyled } from '@/components/TextStyled'
import { Colors } from '@/constants/Colors'
import { contasAPI, getCorFromConta, getInitialsFromConta, IConta } from '@/services/contasAPI'
import { categoriasAPI, ICategoria, ICreateTransacao, transacoesAPI, validateTransacao } from '@/services/transacoes-service'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function NewTransactionScreen() {
  const router = useRouter()
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
  const [writeDetails, setWriteDetails] = useState(false)
  
  // Estados para IA
  const [iaText, setIaText] = useState('')
  const [processingIA, setProcessingIA] = useState(false)
  const [iaProcessed, setIaProcessed] = useState(false)
  const [iaSavedTransactions, setIaSavedTransactions] = useState<any[]>([])
  const [isFromIA, setIsFromIA] = useState(false)

  // Carregar contas
  const loadContas = async () => {
    try {
      setLoadingContas(true)
      const contasData = await contasAPI.getContas()
      setContas(contasData)
      // Selecionar primeira conta por padrão se existir
      if (contasData.length > 0) {
        setSelectedConta(contasData[0])
      }
    } catch (error) {
      console.error('Erro ao carregar contas:', error)
      // Em caso de erro, usar dados vazios em vez de mostrar erro
      setContas([])
      setSelectedConta(null)
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

  useEffect(() => {
    loadContas()
    loadCategorias()
  }, [])

  const formatCurrency = (value: string) => {
    // Remove tudo que não for número
    const numericValue = value.replace(/\D/g, '')
    
    // Se não tem valor, retorna vazio
    if (!numericValue) return ''
    
    // Converte para número e divide por 100 para ter centavos
    const numberValue = parseInt(numericValue) / 100
    
    // Formata como moeda brasileira
    return numberValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const handleAmountChange = (value: string) => {
    const formatted = formatCurrency(value)
    setTransferAmount(formatted)
  }

  const handleSaveTransfer = async () => {
    // Se a transação veio da IA, apenas finalizar sem salvar novamente
    if (isFromIA && iaSavedTransactions.length > 0) {
      const quantidade = iaSavedTransactions.length
      const mensagem = quantidade === 1 
        ? `Transação salva com sucesso!`
        : `${quantidade} transações salvas com sucesso!`

      Alert.alert(
        'Sucesso!',
        mensagem,
        [
          { 
            text: 'OK', 
            onPress: () => {
              handleCancel()
            }
          }
        ]
      )
      return
    }

    if (!transferDescription.trim() || !transferAmount.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.')
      return
    }

    if (contas.length === 0) {
      Alert.alert('Erro', 'Você precisa criar uma conta primeiro para registrar transações.')
      return
    }

    if (!selectedConta) {
      Alert.alert('Erro', 'Por favor, selecione uma conta.')
      return
    }

    // Converte o valor formatado de volta para número
    const numericValue = transferAmount.replace(/\./g, '').replace(',', '.')
    const amount = parseFloat(numericValue)
    
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.')
      return
    }

    // Preparar dados da transação
    const transacaoData: ICreateTransacao = {
      descricao: transferDescription,
      valor: amount,
      tipo: transferType,
      tipoParcelamento: tipoParcelamento,
      contaId: selectedConta.id!,
      categoriaId: selectedCategoria?.id,
    }

    // Adicionar quantidade de parcelas se for parcelado
    if (tipoParcelamento === 'parcelado') {
      transacaoData.quantidadeParcelas = parseInt(quantidadeParcelas)
    }

    // Validar dados antes de enviar
    const errors = validateTransacao(transacaoData)
    if (errors.length > 0) {
      Alert.alert('Erro de Validação', errors.join('\n'))
      return
    }

    try {
      setSavingTransaction(true)
      
      // Criar transação via API
      const novasTransacoes = await transacoesAPI.create(transacaoData)
      
      const quantidade = novasTransacoes.length
      const mensagem = quantidade === 1 
        ? `Transação criada com sucesso!`
        : `${quantidade} transações criadas com sucesso! ${tipoParcelamento === 'recorrente' ? '(12 parcelas mensais)' : `(${quantidade} parcelas)`}`

      Alert.alert(
        'Sucesso!',
        mensagem,
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Limpar campos após salvar
              setTransferDescription('')
              setTransferAmount('')
              setTransferType('despesa')
              setSelectedConta(contas.length > 0 ? contas[0] : null)
              setSelectedCategoria(null)
              setTipoParcelamento('avista')
              setQuantidadeParcelas('2')
              // Voltar para a home
              router.dismiss()
            }
          }
        ]
      )
    } catch (error: any) {
      console.error('Erro ao salvar transação:', error)
      Alert.alert(
        'Erro ao Salvar',
        error.message || 'Não foi possível salvar a transação. Tente novamente.'
      )
    } finally {
      setSavingTransaction(false)
    }
  }

  const handleProcessIA = async () => {
    if (!iaText.trim()) {
      Alert.alert('Erro', 'Por favor, escreva algo para processar.')
      return
    }

    if (!selectedConta) {
      Alert.alert('Erro', 'Por favor, selecione uma conta antes de processar.')
      return
    }

    try {
      setProcessingIA(true)
      
      // Processar transação com IA
      const novasTransacoes = await transacoesAPI.createWithIA(iaText, selectedConta.id!)
      
      if (novasTransacoes.length > 0) {
        const transacao = novasTransacoes[0]
        
        // Preencher campos com os dados processados pela IA
        setTransferDescription(transacao.descricao)
        setTransferAmount(transacao.valor.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        setTransferType(transacao.tipo)
        setTipoParcelamento(transacao.tipoParcelamento || 'avista')
        
        // Se há categoria, selecionar
        if (transacao.categoria) {
          setSelectedCategoria(transacao.categoria)
        }
        
        // Se há parcelas
        if (transacao.quantidadeParcelas > 1) {
          setQuantidadeParcelas(transacao.quantidadeParcelas.toString())
        }
        
        setIaProcessed(true)
        setIsFromIA(true)
        setIaSavedTransactions(novasTransacoes)
        
        // Mostrar preview dos dados processados
        Alert.alert(
          'Transação Criada com IA! 🎉',
          `A IA criou sua transação:\n\n• Descrição: ${transacao.descricao}\n• Valor: R$ ${transacao.valor.toFixed(2)}\n• Tipo: ${transacao.tipo}\n• Conta: ${selectedConta.nome}\n\n✅ A transação já foi salva!\n\nVocê pode revisar os dados se quiser fazer ajustes.`,
          [
            { text: 'Revisar Dados', onPress: () => setWriteDetails(true) },
            { 
              text: 'Pronto!', 
              onPress: () => handleSaveIADirect(novasTransacoes) 
            }
          ]
        )
      }
    } catch (error: any) {
      console.error('Erro ao processar IA:', error)
      Alert.alert(
        'Erro na IA',
        error.message || 'Não foi possível processar a transação. Tente reformular o texto.'
      )
    } finally {
      setProcessingIA(false)
    }
  }

  const handleSaveIADirect = async (transacoes: any[]) => {
    try {
      const quantidade = transacoes.length
      const mensagem = quantidade === 1 
        ? `Transação criada com sucesso!`
        : `${quantidade} transações criadas com sucesso!`

      Alert.alert(
        'Sucesso!',
        mensagem,
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Limpar campos e voltar
              handleCancel()
            }
          }
        ]
      )
    } catch (error: any) {
      console.error('Erro ao confirmar transação IA:', error)
      Alert.alert('Erro', 'Houve um problema inesperado.')
    }
  }

  const handleCancel = () => {
    setTransferDescription('')
    setTransferAmount('')
    setTransferType('despesa')
    setSelectedConta(contas.length > 0 ? contas[0] : null)
    setSelectedCategoria(null)
    setTipoParcelamento('avista')
    setQuantidadeParcelas('2')
    setIaText('')
    setIaProcessed(false)
    setWriteDetails(false)
    setIsFromIA(false)
    setIaSavedTransactions([])
    router.dismiss()
  }

  return (
    <SafeAreaView style={styles.container}>
       
      <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.light.black} />
            </TouchableOpacity>
            <Text style={styles.title}>Nova Transação</Text>
            <View style={{ width: 24 }} />
          </View>
        
        
         {writeDetails ? (
        <View style={styles.content}>
          {/* Aviso quando veio da IA */}
          {isFromIA && (
            <View style={styles.iaNotice}>
              <View style={styles.iaNoticeIcon}>
                <Ionicons name="sparkles" size={16} color={Colors.light.green} />
              </View>
              <Text style={styles.iaNoticeText}>
                Dados preenchidos pela IA. Revise e confirme os dados abaixo.
              </Text>
            </View>
          )}

          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                transferType === 'receita' && styles.typeButtonActive
              ]}
              onPress={() => setTransferType('receita')}
            >
              <Text style={[
                styles.typeButtonText,
                transferType === 'receita' && styles.typeButtonTextActive
              ]}>
                Receita
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                transferType === 'despesa' && styles.typeButtonActiveDespesa
              ]}
              onPress={() => setTransferType('despesa')}
            >
              <Text style={[
                styles.typeButtonText,
                transferType === 'despesa' && styles.typeButtonTextActive
              ]}>
                Despesa
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Descrição</Text>
            <TextInput
              style={styles.textInput}
              value={transferDescription}
              onChangeText={setTransferDescription}
              placeholder="Ex: Compra no supermercado"
              placeholderTextColor={Colors.light.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Valor (R$)</Text>
            <TextInput
              style={styles.textInput}
              value={transferAmount}
              onChangeText={handleAmountChange}
              placeholder="0,00"
              placeholderTextColor={Colors.light.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Conta</Text>
            {contas.length > 0 ? (
              <View style={styles.contasGrid}>
                {contas.map((conta) => (
                  <TouchableOpacity
                    key={conta.id?.toString() || conta.nome}
                    style={[
                      styles.contaGridItem,
                      selectedConta?.id === conta.id && styles.contaGridItemSelected
                    ]}
                    onPress={() => setSelectedConta(conta)}
                  >
                    <View style={[
                      styles.contaGridIcon, 
                      { backgroundColor: getCorFromConta(conta.nome) },
                      selectedConta?.id === conta.id && styles.contaGridIconSelected
                    ]}>
                      <TextStyled 
                        text={getInitialsFromConta(conta.nome)}
                        fontWeight="bold"
                        color="#fff"
                        type="caption"
                      />
                    </View>
                    <Text style={styles.contaGridName} numberOfLines={1}>
                      {conta.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.noContasContainer}>
                <Text style={styles.noContasText}>
                  Nenhuma conta encontrada. Vá para "Contas" para criar uma conta primeiro.
                </Text>
                <TouchableOpacity 
                  style={[styles.createContaButton, transferType === 'despesa' ? styles.tipoParcelamentoButtonActiveDespesa : null]}
                  onPress={() => router.push('/accounts')}
                >
                  <Text style={styles.createContaButtonText}>Criar Conta</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Categoria (Opcional)</Text>
            {categorias.length > 0 ? (
              <View style={styles.categoriasGrid}>
                <TouchableOpacity
                  style={[
                    styles.categoriaGridItem,
                    !selectedCategoria && styles.categoriaGridItemSelected
                  ]}
                  onPress={() => setSelectedCategoria(null)}
                >
                  <View style={[
                    styles.categoriaGridIcon,
                    { backgroundColor: Colors.light.textSecondary }
                  ]}>
                    <Ionicons name="close" size={16} color="#fff" />
                  </View>
                  <Text style={styles.categoriaGridName} numberOfLines={1}>
                    Sem categoria
                  </Text>
                </TouchableOpacity>
                {categorias.map((categoria) => (
                  <TouchableOpacity
                    key={categoria.id}
                    style={[
                      styles.categoriaGridItem,
                      selectedCategoria?.id === categoria.id && styles.categoriaGridItemSelected
                    ]}
                    onPress={() => setSelectedCategoria(categoria)}
                  >
                    <View style={[
                      styles.categoriaGridIcon,
                      { backgroundColor: getCorFromConta(categoria.nome) },
                      selectedCategoria?.id === categoria.id && styles.categoriaGridIconSelected
                    ]}>
                      <TextStyled 
                        text={categoria.nome.substring(0, 2).toUpperCase()}
                        fontWeight="bold"
                        color="#fff"
                        type="caption"
                      />
                    </View>
                    <Text style={styles.categoriaGridName} numberOfLines={1}>
                      {categoria.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.noCategoriaContainer}>
                <Text style={styles.noCategoriaText}>
                  Nenhuma categoria encontrada. As categorias são opcionais.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Tipo de Pagamento</Text>
            <View style={styles.tipoParcelamentoContainer}>
              <TouchableOpacity
                style={[
                  styles.tipoParcelamentoButton,
                  tipoParcelamento === 'avista' && (transferType === 'despesa' ? styles.tipoParcelamentoButtonActiveDespesa : styles.tipoParcelamentoButtonActive)
                ]}
                onPress={() => setTipoParcelamento('avista')}
              >
                <Text style={[
                  styles.tipoParcelamentoText,
                  tipoParcelamento === 'avista' && styles.tipoParcelamentoTextActive
                ]}>
                  À Vista
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tipoParcelamentoButton,
                  tipoParcelamento === 'parcelado' && (transferType === 'despesa' ? styles.tipoParcelamentoButtonActiveDespesa : styles.tipoParcelamentoButtonActive)
                ]}
                onPress={() => setTipoParcelamento('parcelado')}
              >
                <Text style={[
                  styles.tipoParcelamentoText,
                  tipoParcelamento === 'parcelado' && styles.tipoParcelamentoTextActive
                ]}>
                  Parcelado
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tipoParcelamentoButton,
                  tipoParcelamento === 'recorrente' && (transferType === 'despesa' ? styles.tipoParcelamentoButtonActiveDespesa : styles.tipoParcelamentoButtonActive)
                ]}
                onPress={() => setTipoParcelamento('recorrente')}
              >
                <Text style={[
                  styles.tipoParcelamentoText,
                  tipoParcelamento === 'recorrente' && styles.tipoParcelamentoTextActive
                ]}>
                  Recorrente
                </Text>
              </TouchableOpacity>
            </View>

            {tipoParcelamento === 'parcelado' && (
              <View style={styles.parcelasContainer}>
                <Text style={styles.parcelasLabel}>Quantidade de Parcelas</Text>
                <TextInput
                  style={styles.parcelasInput}
                  value={quantidadeParcelas}
                  onChangeText={setQuantidadeParcelas}
                  keyboardType="numeric"
                  placeholder="2"
                />
                <Text style={styles.parcelasHelper}>Entre 2 e 60 parcelas</Text>
              </View>
            )}

            {tipoParcelamento === 'recorrente' && (
              <View style={styles.recorrenteInfo}>
                <Ionicons name="information-circle" size={16} color={Colors.light.green} />
                <Text style={styles.recorrenteText}>
                  Transações recorrentes criam automaticamente 12 parcelas mensais
                </Text>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                transferType === 'despesa' ? styles.saveButtonDespesa : styles.saveButton, 
                savingTransaction && styles.saveButtonDisabled
              ]} 
              onPress={handleSaveTransfer}
              disabled={savingTransaction}
            >
              {savingTransaction ? (
                <ActivityIndicator size="small" color={Colors.light.black} />
              ) : (
                <Text style={styles.saveButtonText}>
                  {isFromIA ? 'Confirmar' : 'Salvar'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          
        </View>
        ) : (
          <View style={styles.iaContainer}>
            {/* Header da IA */}
            <View style={styles.iaHeader}>
              <View style={styles.iaIconContainer}>
                <Ionicons name="sparkles" size={24} color={Colors.light.green} />
              </View>
              <View style={styles.iaHeaderText}>
                <Text style={styles.iaTitle}>Transação com IA</Text>
                <Text style={styles.iaSubtitle}>
                  Descreva sua transação naturalmente e deixe a IA fazer o resto
                </Text>
              </View>
            </View>

            {/* Seleção de Conta para IA */}
            <View style={styles.iaContaSelection}>
              <Text style={styles.inputLabel}>Selecione uma conta primeiro</Text>
              {contas.length > 0 ? (
                <View style={styles.contasGrid}>
                  {contas.map((conta) => (
                    <TouchableOpacity
                      key={conta.id?.toString() || conta.nome}
                      style={[
                        styles.contaGridItem,
                        selectedConta?.id === conta.id && styles.contaGridItemSelected
                      ]}
                      onPress={() => setSelectedConta(conta)}
                    >
                      <View style={[
                        styles.contaGridIcon, 
                        { backgroundColor: getCorFromConta(conta.nome) },
                        selectedConta?.id === conta.id && styles.contaGridIconSelected
                      ]}>
                        <TextStyled 
                          text={getInitialsFromConta(conta.nome)}
                          fontWeight="bold"
                          color="#fff"
                          type="caption"
                        />
                      </View>
                      <Text style={styles.contaGridName} numberOfLines={1}>
                        {conta.nome}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.noContasContainer}>
                  <Text style={styles.noContasText}>
                    Você precisa ter pelo menos uma conta para usar a IA.
                  </Text>
                  <TouchableOpacity 
                    style={styles.createContaButton}
                    onPress={() => router.push('/accounts')}
                  >
                    <Text style={styles.createContaButtonText}>Criar Conta</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Input de Texto da IA */}
            <View style={styles.iaInputContainer}>
              <Text style={styles.inputLabel}>Digite sua transação</Text>
              <View style={styles.iaInputWrapper}>
                <TextInput
                  style={styles.iaTextInput}
                  value={iaText}
                  onChangeText={(text) => {
                    if (text.length <= 500) {
                      setIaText(text)
                    }
                  }}
                  placeholder="Ex: Gastei 25 reais no almoço hoje, comprei um café de 8 reais ontem..."
                  placeholderTextColor={Colors.light.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={500}
                />
                <View style={styles.iaInputFooter}>
                  <Text style={styles.iaInputHelper}>
                    💡 Seja específico: mencione valor, local e quando foi
                  </Text>
                  <Text style={styles.iaInputCounter}>
                    {iaText.length}/500
                  </Text>
                </View>
              </View>
            </View>

            {/* Exemplos */}
            <View style={styles.iaExamples}>
              <Text style={styles.iaExamplesTitle}>Exemplos:</Text>
              {[
                'Comprei um café de 5 reais ontem',
                'Gastei 150 reais no supermercado hoje',
                'Recebi 50 reais de freelance na sexta'
              ].map((example, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.iaExampleItem}
                  onPress={() => setIaText(example)}
                >
                  <Text style={styles.iaExampleText}>{example}</Text>
                  <Ionicons name="arrow-forward" size={16} color={Colors.light.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Botões */}
            <View style={styles.iaButtonContainer}>
              <TouchableOpacity 
                style={[
                  styles.iaProcessButton,
                  (!iaText.trim() || !selectedConta || processingIA) && styles.iaProcessButtonDisabled
                ]}
                onPress={handleProcessIA}
                disabled={!iaText.trim() || !selectedConta || processingIA}
              >
                {processingIA ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="sparkles" size={20} color="white" />
                    <Text style={styles.iaProcessButtonText}>Processar com IA</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.iaManualButton}
                onPress={() => setWriteDetails(true)}
              >
                <Ionicons name="create-outline" size={20} color={Colors.light.textSecondary} />
                <Text style={styles.iaManualButtonText}>Inserir manualmente</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
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
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.bgWhite,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: Colors.light.green,
    borderColor: Colors.light.green,
  },
   typeButtonActiveDespesa: {
    backgroundColor: Colors.light.negativeBg,
    borderColor: Colors.light.negativeBg,
  },
  typeButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.textSecondary,
  },
  typeButtonTextActive: {
    color: Colors.light.black,
    fontFamily: 'Montserrat-SemiBold',
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
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.black,
    backgroundColor: Colors.light.bgWhite,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 40,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.bgWhite,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.textSecondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: Colors.light.green,
    alignItems: 'center',
  },
  saveButtonDespesa: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: Colors.light.negativeBg,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.black,
  },
  // Estilos do grid de contas
  contasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contaGridItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    minWidth: 80,
    maxWidth: 100,
  },
  contaGridItemSelected: {
    backgroundColor: Colors.light.bgWhite,
    borderWidth: 2,
    borderColor: Colors.light.green,
  },
  contaGridIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  contaGridIconSelected: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  contaGridName: {
    fontSize: 11,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.black,
    textAlign: 'center',
  },
  // Estilos para quando não há contas
  noContasContainer: {
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  noContasText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  createContaButton: {
    backgroundColor: Colors.light.green,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createContaButtonText: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.black,
  },
  // Estilos do grid de categorias
  categoriasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoriaGridItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    minWidth: 80,
    maxWidth: 100,
  },
  categoriaGridItemSelected: {
    backgroundColor: Colors.light.bgWhite,
    borderWidth: 2,
    borderColor: Colors.light.green,
  },
  categoriaGridIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoriaGridIconSelected: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  categoriaGridName: {
    fontSize: 11,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.black,
    textAlign: 'center',
  },
  noCategoriaContainer: {
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  noCategoriaText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  // Estilos do tipo de parcelamento
  tipoParcelamentoContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tipoParcelamentoButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.bgWhite,
    alignItems: 'center',
  },
  tipoParcelamentoButtonActive: {
    backgroundColor: Colors.light.green,
    borderColor: Colors.light.green,
  },
  tipoParcelamentoButtonActiveDespesa: {
    backgroundColor: Colors.light.negativeBg,
    borderColor: Colors.light.negativeBg,
  },
  tipoParcelamentoText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.textSecondary,
  },
  tipoParcelamentoTextActive: {
    color: Colors.light.black,
    fontFamily: 'Montserrat-SemiBold',
  },
  // Estilos das parcelas
  parcelasContainer: {
    marginTop: 16,
    gap: 8,
  },
  parcelasLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.black,
  },
  parcelasInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.black,
    backgroundColor: Colors.light.bgWhite,
  },
  parcelasHelper: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.textSecondary,
  },
  recorrenteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  recorrenteText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.textSecondary,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.light.border,
    opacity: 0.7,
  },
  // Estilos da interface de IA
  iaContainer: {
    flex: 1,
    gap: 24,
  },
  iaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.light.bgWhite,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  iaIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.light.bgPrimary,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iaHeaderText: {
    flex: 1,
  },
  iaTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: Colors.light.black,
    marginBottom: 4,
  },
  iaSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  iaContaSelection: {
    gap: 12,
  },
  iaInputContainer: {
    gap: 12,
  },
  iaInputWrapper: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 16,
    backgroundColor: Colors.light.bgWhite,
    overflow: 'hidden',
  },
  iaTextInput: {
    padding: 16,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.black,
    minHeight: 120,
    maxHeight: 200,
  },
  iaInputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.light.bgPrimary,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  iaInputHelper: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.textSecondary,
    flex: 1,
  },
  iaInputCounter: {
    fontSize: 12,
    marginLeft: 8,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.textSecondary,
  },
  iaExamples: {
    gap: 12,
  },
  iaExamplesTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.black,
  },
  iaExampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.bgWhite,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  iaExampleText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.black,
    flex: 1,
  },
  iaButtonContainer: {
    gap: 12,
    marginTop: 12,
  },
  iaProcessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.green,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  iaProcessButtonDisabled: {
    backgroundColor: Colors.light.border,
    opacity: 0.7,
  },
  iaProcessButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.black,
  },
  iaManualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.bgWhite,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 8,
  },
  iaManualButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.textSecondary,
  },
  // Estilos do aviso da IA
  iaNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.bgWhite,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.green,
    borderLeftWidth: 4,
    gap: 12,
  },
  iaNoticeIcon: {
    width: 32,
    height: 32,
    backgroundColor: Colors.light.bgPrimary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iaNoticeText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.black,
    lineHeight: 20,
  },
})
