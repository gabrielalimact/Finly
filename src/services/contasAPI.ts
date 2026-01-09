import { api, handleAuthError, isAuthError } from './api-service'

export interface IConta {
  id?: number
  nome: string
  tipo: 'conta_bancaria' | 'cartao_credito' | 'cartao_debito'
  saldo?: number | null
  limite?: number | null
  usuarioId?: number
  criadoEm?: string
  atualizadoEm?: string
}

export interface ICreateConta {
  nome: string
}

export interface IUpdateConta {
  nome?: string
}

export const contasAPI = {
  async createConta(conta: ICreateConta): Promise<IConta> {
    try {
      const response = await api.post('/contas', conta)
      return response.data
    } catch (error: any) {
      console.error('Erro ao criar conta:', error)
      
      // Se erro de autenticação, redirecionar para login
      if (isAuthError(error)) {
        handleAuthError(error)
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao criar conta')
    }
  },

  // Listar contas
  async getContas(): Promise<IConta[]> {
    try {
      const response = await api.get('/contas')
      return response.data
    } catch (error: any) {
      console.error('Erro ao buscar contas:', error)
      
      // Se erro de autenticação, redirecionar para login
      if (isAuthError(error)) {
        handleAuthError(error)
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao buscar contas')
    }
  },

  // Buscar conta por ID
  async getContaById(id: number): Promise<IConta> {
    try {
      const response = await api.get(`/contas/${id}`)
      return response.data
    } catch (error: any) {
      console.error('Erro ao buscar conta:', error)
      
      // Se erro de autenticação, redirecionar para login
      if (isAuthError(error)) {
        handleAuthError(error)
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao buscar conta')
    }
  },

  // Atualizar conta
  async updateConta(id: number, conta: IUpdateConta): Promise<IConta> {
    try {
      const response = await api.put(`/contas/${id}`, conta)
      return response.data
    } catch (error: any) {
      console.error('Erro ao atualizar conta:', error)
      
      // Se erro de autenticação, redirecionar para login
      if (isAuthError(error)) {
        handleAuthError(error)
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao atualizar conta')
    }
  },

  // Deletar conta
  async deleteConta(id: number): Promise<void> {
    try {
      await api.delete(`/contas/${id}`)
    } catch (error: any) {
      console.error('Erro ao deletar conta:', error)
      
      // Se erro de autenticação, redirecionar para login
      if (isAuthError(error)) {
        handleAuthError(error)
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao deletar conta')
    }
  },
}

// Funções de validação
export const validateConta = (conta: ICreateConta): string[] => {
  const errors: string[] = []

  if (!conta.nome || conta.nome.trim() === '') {
    errors.push('Nome da conta é obrigatório')
  }

  if (conta.nome && conta.nome.length > 100) {
    errors.push('Nome da conta deve ter no máximo 100 caracteres')
  }
  return errors
}

// Função para obter as iniciais da conta
export const getInitialsFromConta = (nome: string): string => {
  if (!nome || nome.trim() === '') return 'CO'
  
  const words = nome.trim().split(' ')
  let initials = ''
  
  // Pegar primeira letra da primeira palavra
  if (words[0]) {
    initials += words[0].charAt(0).toUpperCase()
  }
  
  // Pegar primeira letra da segunda palavra (se existir)
  if (words[1]) {
    initials += words[1].charAt(0).toUpperCase()
  } else {
    // Se não há segunda palavra, pegar segunda letra da primeira palavra
    if (words[0] && words[0].length > 1) {
      initials += words[0].charAt(1).toUpperCase()
    } else {
      initials += 'O' // fallback
    }
  }
  
  return initials
}

// Função para gerar cor aleatória baseada no nome da conta
export const getCorFromConta = (nome: string): string => {
  const cores = [
    '#FF6B6B', // Vermelho suave
    '#4ECDC4', // Verde azulado
    '#45B7D1', // Azul
    '#96CEB4', // Verde menta
    '#FECA57', // Amarelo dourado
    '#FF9FF3', // Rosa
    '#54A0FF', // Azul claro
    '#5F27CD', // Roxo
    '#00D2D3', // Ciano
    '#FF9F43', // Laranja
    '#6C5CE7', // Roxo claro
    '#A29BFE', // Lavanda
    '#FD79A8', // Rosa claro
    '#FDCB6E', // Amarelo claro
    '#6C5CE7', // Índigo
  ]
  
  // Usar hash simples do nome para sempre retornar a mesma cor para o mesmo nome
  let hash = 0
  for (let i = 0; i < nome.length; i++) {
    const char = nome.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Converter para 32bit integer
  }
  
  const index = Math.abs(hash) % cores.length
  return cores[index]
}
