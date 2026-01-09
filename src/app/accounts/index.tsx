import { TextStyled } from '@/components/TextStyled'
import { Colors } from '@/constants/Colors'
import { useUserContext } from '@/contexts'
import { contasAPI, getCorFromConta, getInitialsFromConta, IConta, ICreateConta, validateConta } from '@/services/contas-service'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ContasScreen() {
  const router = useRouter()
  const { user } = useUserContext()
  const [contas, setContas] = useState<IConta[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingConta, setEditingConta] = useState<IConta | null>(null)
  const [formData, setFormData] = useState<ICreateConta>({
    nome: '',
  })

  useEffect(() => {
    if (!user) {
      Alert.alert(
        'Login Necessário',
        'Você precisa fazer login para gerenciar suas contas.',
        [
          {
            text: 'Fazer Login',
            onPress: () => router.replace('/auth/login')
          }
        ]
      )
      return
    }
    loadContas()
  }, [user])

  const loadContas = async () => {
    try {
      setLoading(true)
      const contasData = await contasAPI.getContas()
      setContas(contasData)
    } catch (error: any) {
      if (error.message.includes('sessão expirou') || error.message.includes('fazer login')) {
        Alert.alert(
          'Sessão Expirada',
          error.message,
          [
            {
              text: 'Fazer Login',
              onPress: () => router.replace('/auth/login')
            }
          ]
        )
      } else {
        Alert.alert('Erro', 'Falha ao carregar contas')
        console.error('Erro ao carregar contas:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingConta(null)
    setFormData({
      nome: '',
    })
    setModalVisible(true)
  }

  const openEditModal = (conta: IConta) => {
    setEditingConta(conta)
    setFormData({
      nome: conta.nome,
    })
    setModalVisible(true)
  }

  const handleSaveConta = async () => {
    try {
      const errors = validateConta(formData)
      if (errors.length > 0) {
        Alert.alert('Erro de Validação', errors.join('\n'))
        return
      }

      setLoading(true)

      if (editingConta) {
        await contasAPI.updateConta(editingConta.id!, formData)
      } else {
        await contasAPI.createConta(formData)
      }

      setModalVisible(false)
      await loadContas()
      Alert.alert('Sucesso', editingConta ? 'Conta atualizada!' : 'Conta criada!')
    } catch (error: any) {
      if (error.message.includes('sessão expirou') || error.message.includes('fazer login')) {
        setModalVisible(false)
        Alert.alert(
          'Sessão Expirada',
          error.message,
          [
            {
              text: 'Fazer Login',
              onPress: () => router.replace('/auth/login')
            }
          ]
        )
      } else {
        Alert.alert('Erro', error.message || 'Falha ao salvar conta')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteConta = (conta: IConta) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir a conta "${conta.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true)
              await contasAPI.deleteConta(conta.id!)
              await loadContas()
              Alert.alert('Sucesso', 'Conta excluída!')
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Falha ao excluir conta')
            } finally {
              setLoading(false)
            }
          },
        },
      ]
    )
  }

  const renderConta = ({ item }: { item: IConta }) => (
    <View style={styles.contaCard}>
      <View style={styles.contaHeader}>
        <View style={[styles.contaIcon, { backgroundColor: getCorFromConta(item.nome) }]}>
          <TextStyled 
            text={getInitialsFromConta(item.nome)}
            fontWeight="bold"
            color="#fff"
            type="caption"
          />
        </View>
        <View style={styles.contaInfo}>
          <TextStyled 
            text={item.nome}
            fontWeight="medium"
            color={Colors.light.black}
          />
        </View>
        <View style={styles.contaActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => openEditModal(item)}
          >
            <Ionicons name="pencil" size={16} color={Colors.light.green} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeleteConta(item)}
          >
            <Ionicons name="trash" size={16} color={Colors.light.darkRed} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextStyled 
          text="Contas e Cartões"
          type="title"
          fontWeight="bold"
          color={Colors.light.black}
        />
        <TouchableOpacity onPress={openCreateModal} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {contas.length === 0 && !loading ? (
        <View style={styles.emptyState}>
          <Ionicons name="card-outline" size={64} color={Colors.light.textSecondary} />
          <TextStyled 
            text="Nenhuma conta cadastrada"
            type="subtitle"
            color={Colors.light.textSecondary}
          />
          <TextStyled 
            text="Adicione sua primeira conta para começar"
            color={Colors.light.textSecondary}
          />
        </View>
      ) : (
        <FlatList
          data={contas}
          renderItem={renderConta}
          keyExtractor={(item) => item.id!.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadContas}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TextStyled 
                text={editingConta ? 'Editar Conta' : 'Adicionar uma nova conta'}
                type="subtitle"
                fontWeight="bold"
                color={Colors.light.black}
              />
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.light.black} />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <TextStyled 
                  text="Nome da Conta"
                  fontWeight="medium"
                  color={Colors.light.black}
                />
                <TextInput
                  style={styles.input}
                  value={formData.nome}
                  onChangeText={(text) => setFormData({ ...formData, nome: text })}
                  placeholder="Ex: Banco do Brasil - Conta Corrente"
                  maxLength={100}
                />
              </View>

              
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <TextStyled 
                  text="Cancelar"
                  color={Colors.light.black}
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveConta}
                disabled={loading}
              >
                <TextStyled 
                  text={editingConta ? 'Atualizar' : 'Criar'}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  addButton: {
    backgroundColor: Colors.light.green,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  contaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contaInfo: {
    flex: 1,
  },
  contaActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contaDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  typeSelector: {
    gap: 8,
  },
  typeOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  typeOptionSelected: {
    backgroundColor: Colors.light.green,
    borderColor: Colors.light.green,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: Colors.light.green,
  },
})
