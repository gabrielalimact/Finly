import { NewTransactionHeader, TransactionTypeModal } from '@/modules/new-transaction/components'
import { Stack, useRouter } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView, View } from 'react-native'

export default function NewTransactionScreen() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>('expense')
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleClose = () => {
    router.back()
  }

  const handleOpenModal = () => {
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
  }

  const handleSelectType = (type: 'income' | 'expense') => {
    setSelectedType(type)
  }

  const handleSave = () => {
    console.log('Salvar transação')
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1 }}>
        <NewTransactionHeader
          selectedType={selectedType}
          onClose={handleClose}
          onOpenModal={handleOpenModal}
          onSave={handleSave}
        />
        
        <View style={{ flex: 1 }}>
          {/* Aqui você pode adicionar o resto do formulário da transação */}
        </View>

        <TransactionTypeModal
          visible={isModalVisible}
          onClose={handleCloseModal}
          onSelect={handleSelectType}
        />
      </SafeAreaView>
    </>
  )
}
