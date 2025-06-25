import { IUser } from '../DTO/IUser'

export const mockUser: IUser = {
  id: 1,
  name: 'Gabriela Cena',
  email: 'gabi.cena@email.com',
  saldo: 3500,
  valorTotalDespesas: 1200,
  valorTotalReceitas: 4700,
  accounts: [
    {
      id: 101,
      name: 'Banco do Brasil',
      type: 'bankAccount',
      userID: 1,
      balance: 2000,
      transactions: [
        {
          id: 1001,
          description: 'Salário',
          amount: 3000,
          dateToPay: '2025-05-10',
          createdAt: '2025-05-10',
          type: 'income',
          accountID: 101
        },
        {
          id: 1002,
          description: 'Aluguel',
          amount: 1200,
          dateToPay: '2025-05-11',
          createdAt: '2025-05-11',
          type: 'expense',
          accountID: 101
        },
        {
          id: 1003,
          description: 'Investimento',
          amount: 500,
          dateToPay: '2025-05-12',
          createdAt: '2025-05-12',
          type: 'expense',
          accountID: 101
        }
      ]
    },
    {
      id: 102,
      name: 'Nubank Débito',
      type: 'debitCard',
      userID: 1,
      balance: 1000,
      transactions: [
        {
          id: 1004,
          description: 'Supermercado',
          amount: 200,
          dateToPay: '2025-05-15',
          createdAt: '2025-05-15',
          type: 'expense',
          accountID: 102
        },
        {
          id: 1005,
          description: 'Farmácia',
          amount: 150,
          dateToPay: '2025-05-16',
          createdAt: '2025-05-16',
          type: 'expense',
          accountID: 102
        },
        {
          id: 1006,
          description: 'Depósito',
          amount: 1000,
          dateToPay: '2025-05-14',
          createdAt: '2025-05-14',
          type: 'income',
          accountID: 102
        }
      ]
    },
    {
      id: 103,
      name: 'Cartão Inter',
      type: 'creditCard',
      userID: 1,
      balance: 500,
      transactions: [
        {
          id: 1007,
          description: 'Assinatura Netflix',
          amount: 55,
          dateToPay: '2025-05-01',
          createdAt: '2025-05-01',
          type: 'expense',
          accountID: 103
        },
        {
          id: 1008,
          description: 'Gasolina',
          amount: 250,
          dateToPay: '2025-05-03',
          createdAt: '2025-05-03',
          type: 'expense',
          accountID: 103
        },
        {
          id: 1009,
          description: 'Cashback',
          amount: 50,
          dateToPay: '2025-05-04',
          createdAt: '2025-05-04',
          type: 'income',
          accountID: 103
        },
        {
          id: 1010,
          description: 'Compra online',
          amount: 300,
          dateToPay: '2025-05-05',
          createdAt: '2025-05-05',
          type: 'expense',
          accountID: 103
        }
      ]
    }
  ]
}
