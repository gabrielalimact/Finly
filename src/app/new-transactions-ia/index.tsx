import { TextStyled } from '@/components/TextStyled'
import { Colors } from '@/constants/Colors'
import { contasAPI, getCorFromConta, getInitialsFromConta, IConta } from '@/services/contasAPI'
import { atualizarProgressoMetas } from '@/services/metas-service'
import { showMetaConcluida, showMultiplasMetasConcluidas } from '@/services/notification-service'
import { transacoesAPI } from '@/services/transacoes-service'
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

export default function IATransactionScreen() {
  const router = useRouter()
  
  const [contas, setContas] = useState<IConta[]>([])
  const [selectedConta, setSelectedConta] = useState<IConta | null>(null)
  const [loadingContas, setLoadingContas] = useState(false)
  
  // Estados para IA
  const [iaText, setIaText] = useState('')
  const [processingIA, setProcessingIA] = useState(false)

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
      setContas([])
      setSelectedConta(null)
    } finally {
      setLoadingContas(false)
    }
  }

  useEffect(() => {
    loadContas()
  }, [])

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
      
      // Após criar a transação, verifica se alguma meta foi concluída
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
      
      if (novasTransacoes.length > 0) {
        const transacao = novasTransacoes[0]
        
        // Mostrar preview dos dados processados
        Alert.alert(
          'Transação Criada com IA! 🎉',
          `A IA criou sua transação:\n\n• Descrição: ${transacao.descricao}\n• Valor: R$ ${transacao.valor.toFixed(2)}\n• Tipo: ${transacao.tipo}\n• Conta: ${selectedConta.nome}\n\n✅ A transação já foi salva!\n\nVocê pode revisar os dados se quiser fazer ajustes.`,
          [
            { 
              text: 'Revisar Dados', 
              onPress: () => {
                // Navegar para edição com os dados da IA
                router.push({
                  pathname: '/manual-transaction',
                  params: {
                    fromIA: 'true',
                    transactionId: transacao.id.toString(),
                    description: transacao.descricao,
                    amount: transacao.valor.toString(),
                    type: transacao.tipo,
                    accountId: selectedConta.id?.toString() || '',
                    categoryId: transacao.categoria?.id.toString() || '',
                  }
                })
              }
            },
            { 
              text: 'Pronto!', 
              onPress: () => {
                router.dismiss();
              }
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

  const handleManualInput = () => {
    router.push('/manual-transaction')
  }

  const handleCancel = () => {
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

        <View style={styles.content}>
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
              onPress={handleManualInput}
            >
              <Ionicons name="create-outline" size={20} color={Colors.light.textSecondary} />
              <Text style={styles.iaManualButtonText}>Inserir manualmente</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    gap: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.black,
  },
  // Header da IA
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
  // Grid de contas
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
  // Input da IA
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
  // Exemplos
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
  // Botões
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
})
