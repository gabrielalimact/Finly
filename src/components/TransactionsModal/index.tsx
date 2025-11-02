import { Colors } from '@/constants/Colors'
import { IAccounts } from '@/DTO/IAccounts'
import { ITransaction } from '@/DTO/ITransactions'
import { IUser } from '@/DTO/IUser'
import React from 'react'
import {
    ScrollView,
    View
} from 'react-native'
import { TextStyled } from '../TextStyled'
import { TransactionItem } from '../TransactionItem'
import { styles } from './styles'

interface TransactionsModalProps {
  user: IUser
}

interface TransactionWithAccount {
  transaction: ITransaction
  account: IAccounts
  isPaid: boolean
}

export const TransactionsModal: React.FC<TransactionsModalProps> = ({
  user
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

  const sortedTransactions = allTransactions.sort((a, b) => {
    const dateA = new Date(a.transaction.dateToPay)
    const dateB = new Date(b.transaction.dateToPay)
    return dateB.getTime() - dateA.getTime()
  })

  const today = new Date()
  const todayTransactions = sortedTransactions.filter(item => {
    const transactionDate = new Date(item.transaction.dateToPay)
    return transactionDate.toDateString() === today.toDateString()
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.handle} />
        <View style={styles.headerContent}>
          <TextStyled 
            text="Transaction"
            type="title"
            fontWeight="bold"
            size={18}
          />
        </View>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
          {todayTransactions.length > 0 ? (
            todayTransactions.map((item) => (
              <TransactionItem
                key={`${item.transaction.id}-${item.account.id}`}
                transaction={item.transaction}
                account={item.account}
                isPaid={item.isPaid}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <TextStyled 
                text="Nenhuma transação hoje"
                type="text"
                color={Colors.light.textSecondary}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
