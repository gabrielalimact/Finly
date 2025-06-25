export interface ITransaction {
  id: number
  description: string
  amount: number
  dateToPay: string
  createdAt: string
  type: 'income' | 'expense'
  accountID: number
}
