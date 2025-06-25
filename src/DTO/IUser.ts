import { IAccounts } from './IAccounts'

export interface IUser {
  id: number
  name: string
  email: string
  saldo: number
  valorTotalDespesas: number
  valorTotalReceitas: number
  accounts: IAccounts[]
}
