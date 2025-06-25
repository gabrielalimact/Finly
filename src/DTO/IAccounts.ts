import { ITransaction } from './ITransactions'

export interface IAccounts {
  id: number
  name: string
  type: 'creditCard' | 'debitCard' | 'bankAccount'
  userID: number
  balance: number
  transactions: ITransaction[]
}
