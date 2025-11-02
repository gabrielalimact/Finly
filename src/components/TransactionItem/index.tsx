import { Colors } from '@/constants/Colors'
import { IAccounts } from '@/DTO/IAccounts'
import { ITransaction } from '@/DTO/ITransactions'
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { View } from 'react-native'
import { TextStyled } from '../TextStyled'
import { styles } from './styles'

interface TransactionItemProps {
  transaction: ITransaction
  account: IAccounts
  isPaid?: boolean
}

const getCategoryIcon = (description: string, type: 'income' | 'expense') => {
  if (type === 'income') {
    return { name: 'arrow-down', library: 'Ionicons' }
  } else {
    return { name: 'arrow-up', library: 'Ionicons' }
  }
}

const getAccountTypeIcon = (accountType: 'creditCard' | 'debitCard' | 'bankAccount') => {
  switch (accountType) {
    case 'creditCard':
      return { name: 'credit-card', library: 'FontAwesome5' }
    case 'debitCard':
      return { name: 'credit-card', library: 'FontAwesome5' }
    case 'bankAccount':
      return { name: 'bank', library: 'FontAwesome5' }
    default:
      return { name: 'account-balance-wallet', library: 'MaterialIcons' }
  }
}

const renderIcon = (iconInfo: { name: string, library: string }, color: string, size: number = 20) => {
  switch (iconInfo.library) {
    case 'FontAwesome5':
      return <FontAwesome5 name={iconInfo.name as any} size={size} color={color} />
    case 'MaterialIcons':
      return <MaterialIcons name={iconInfo.name as any} size={size} color={color} />
    case 'Ionicons':
      return <Ionicons name={iconInfo.name as any} size={size} color={color} />
    default:
      return <FontAwesome5 name="receipt" size={size} color={color} />
  }
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction, 
  account, 
  isPaid = false 
}) => {
  const categoryIcon = getCategoryIcon(transaction.description, transaction.type)
  const accountIcon = getAccountTypeIcon(account.type)
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    }
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    })
  }

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const formattedAmount = amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    return type === 'income' ? `+${formattedAmount}` : `-${formattedAmount}`
  }

  const getAmountColor = () => {
    if (transaction.type === 'income') {
      return '#4CAF50' 
    }
    return '#000000'
  }

  return (
    <View style={styles.transactionItem}>
      <View style={styles.leftSection}>
        <View style={[
          styles.iconContainer, 
          { backgroundColor: transaction.type === 'income' ? '#E8F5E8' : '#FFF0F0' }
        ]}>
          {renderIcon(categoryIcon, transaction.type === 'income' ? '#4CAF50' : '#F44336', 18)}
        </View>
        
        <View style={styles.transactionInfo}>
          <TextStyled 
            text={transaction.description} 
            type="text" 
            fontWeight="medium"
            size={16}
          />
          <TextStyled 
            text={formatDate(transaction.dateToPay)}
            type="caption" 
            color={Colors.light.textSecondary}
            size={12}
          />
        </View>
      </View>

      <View style={styles.rightSection}>
        <TextStyled 
          text={formatAmount(transaction.amount, transaction.type)}
          type="text"
          fontWeight="bold"
          color={getAmountColor()}
          size={16}
        />
      </View>
    </View>
  )
}
