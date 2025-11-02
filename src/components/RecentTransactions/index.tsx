import { Colors } from '@/constants/Colors'
import { IAccounts } from '@/DTO/IAccounts'
import { ITransaction } from '@/DTO/ITransactions'
import { IUser } from '@/DTO/IUser'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { TextStyled } from '../TextStyled'
import { TransactionItem } from '../TransactionItem'
import { styles } from './styles'

interface RecentTransactionsProps {
  user: IUser
  maxItems?: number
  onViewAll?: () => void
}

interface TransactionWithAccount {
  transaction: ITransaction
  account: IAccounts
  isPaid: boolean
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  user, 
  maxItems = 5,
  onViewAll
}) => {
  const allTransactions: TransactionWithAccount[] = []
  
  user.accounts.forEach(account => {
    account.transactions.forEach(transaction => {
      const today = new Date()
      const payDate = new Date(transaction.dateToPay)
      const isPaid = payDate <= today
      
      allTransactions.push({
        transaction,
        account,
        isPaid
      })
    })
  })

  const recentTransactions = allTransactions
    .sort((a, b) => {
      const dateA = new Date(a.transaction.dateToPay)
      const dateB = new Date(b.transaction.dateToPay)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, maxItems)

  if (allTransactions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TextStyled 
            text="Transações Recentes"
            type="subtitle"
            fontWeight="bold"
          />
        </View>
        <View style={styles.emptyState}>
          <TextStyled 
            text="Nenhuma transação ainda"
            type="subtitle"
            color={Colors.light.textSecondary}
          />
          <TextStyled 
            text="Suas transações recentes aparecerão aqui"
            type="caption"
            color={Colors.light.textTertiary}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextStyled 
          text="Transaction"
          type="title"
          fontWeight="bold"
          size={18}
        />
        {onViewAll && allTransactions.length > maxItems && (
          <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
            <TextStyled 
              text="View all"
              type="caption"
              color={Colors.light.textSecondary}
              fontWeight="medium"
              size={14}
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.sectionHeader}>
        <TextStyled 
          text="TODAY"
          type="caption"
          color={Colors.light.textSecondary}
          fontWeight="medium"
          size={12}
        />
      </View>
      
      <View style={styles.transactionsList}>
        {recentTransactions.map((item) => (
          <TransactionItem
            key={`${item.transaction.id}-${item.account.id}`}
            transaction={item.transaction}
            account={item.account}
            isPaid={item.isPaid}
          />
        ))}
      </View>
    </View>
  )
}
