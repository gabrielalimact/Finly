import { api, handleAuthError, isAuthError } from './api-service'

// ============= INTERFACES =============

export interface ICategoria {
  id: number
  nome: string
  descricao?: string
  criadoEm: string
  atualizadoEm: string
}

export interface ITransacao {
  id: string
  descricao: string
  valor: number
  tipo: 'receita' | 'despesa'
  tipoParcelamento: 'avista' | 'parcelado' | 'recorrente'
  quantidadeParcelas: number
  parcelaAtual: number
  grupoTransacaoId?: string
  dataTransacao: string
  conta: {
    id: number
    nome: string
    tipo: string
  }
  categoria?: ICategoria
  criadoEm: string
  atualizadoEm: string
}

export interface ICreateTransacao {
  descricao: string
  valor: number
  tipo: 'receita' | 'despesa'
  tipoParcelamento?: 'avista' | 'parcelado' | 'recorrente'
  quantidadeParcelas?: number
  contaId: number
  categoriaId?: number
}

export interface ICreateCategoria {
  nome: string
  descricao?: string
}

export interface IUpdateCategoria {
  nome?: string
  descricao?: string
}

// ============= CATEGORIAS API =============

export const categoriasAPI = {
  // Criar categoria
  async create(categoria: ICreateCategoria): Promise<ICategoria> {
    try {
      const response = await api.post('/categorias', categoria)
      return response.data
    } catch (error: any) {
      console.error('Erro ao criar categoria:', error)
      throw new Error(error.response?.data?.message || 'Erro ao criar categoria')
    }
  },

  // Listar categorias
  async getAll(): Promise<ICategoria[]> {
    try {
      const response = await api.get('/categorias')
      return response.data
    } catch (error: any) {
      console.error('Erro ao buscar categorias:', error)
      
      // Se erro de autenticação, redirecionar para login
      if (isAuthError(error)) {
        handleAuthError(error)
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao buscar categorias')
    }
  },

  // Buscar categoria por ID
  async getById(id: number): Promise<ICategoria> {
    try {
      const response = await api.get(`/categorias/${id}`)
      return response.data
    } catch (error: any) {
      console.error('Erro ao buscar categoria:', error)
      throw new Error(error.response?.data?.message || 'Erro ao buscar categoria')
    }
  },

  // Atualizar categoria
  async update(id: number, categoria: IUpdateCategoria): Promise<ICategoria> {
    try {
      const response = await api.put(`/categorias/${id}`, categoria)
      return response.data
    } catch (error: any) {
      console.error('Erro ao atualizar categoria:', error)
      throw new Error(error.response?.data?.message || 'Erro ao atualizar categoria')
    }
  },

  // Deletar categoria
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/categorias/${id}`)
    } catch (error: any) {
      console.error('Erro ao deletar categoria:', error)
      throw new Error(error.response?.data?.message || 'Erro ao deletar categoria')
    }
  }
}

// ============= TRANSAÇÕES API =============

export const transacoesAPI = {
  // Criar transação
  async create(transacao: ICreateTransacao): Promise<ITransacao[]> {
    try {
      const response = await api.post('/transacoes', transacao)
      return response.data
    } catch (error: any) {
      console.error('Erro ao criar transação:', error)
      
      // Se erro de autenticação, redirecionar para login
      if (isAuthError(error)) {
        handleAuthError(error)
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao criar transação')
    }
  },

  // Listar transações
  async getAll(contaId?: number): Promise<ITransacao[]> {
    try {
      const url = contaId ? `/transacoes?contaId=${contaId}` : '/transacoes'
      const response = await api.get(url)
      return response.data
    } catch (error: any) {
      console.error('Erro ao buscar transações:', error)
      
      // Se erro de autenticação, redirecionar para login
      if (isAuthError(error)) {
        handleAuthError(error)
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao buscar transações')
    }
  },

  // Buscar transação por ID
  async getById(id: string): Promise<ITransacao> {
    try {
      const response = await api.get(`/transacoes/${id}`)
      return response.data
    } catch (error: any) {
      console.error('Erro ao buscar transação:', error)
      throw new Error(error.response?.data?.message || 'Erro ao buscar transação')
    }
  },

  // Buscar transações por grupo (parcelas)
  async getByGroup(grupoId: string): Promise<ITransacao[]> {
    try {
      const response = await api.get(`/transacoes/grupo/${grupoId}`)
      return response.data
    } catch (error: any) {
      console.error('Erro ao buscar transações do grupo:', error)
      throw new Error(error.response?.data?.message || 'Erro ao buscar transações do grupo')
    }
  },

  // Deletar transação
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/transacoes/${id}`)
    } catch (error: any) {
      console.error('Erro ao deletar transação:', error)
      throw new Error(error.response?.data?.message || 'Erro ao deletar transação')
    }
  },

  // Deletar grupo de transações (todas as parcelas)
  async deleteGroup(grupoId: string): Promise<void> {
    try {
      await api.delete(`/transacoes/grupo/${grupoId}`)
    } catch (error: any) {
      console.error('Erro ao deletar grupo de transações:', error)
      throw new Error(error.response?.data?.message || 'Erro ao deletar grupo de transações')
    }
  },

  async createWithIA(texto: string, contaId: number): Promise<ITransacao[]> {
    try {
      const response = await api.post('/transacoes/ia', {
        texto,
        contaId
      })
      return response.data
    } catch (error: any) {
      console.error('Erro ao criar transação com IA:', error)
      throw new Error(error.response?.data?.message || 'Erro ao criar transação com IA')
    }
  }
}

// ============= FUNÇÕES UTILITÁRIAS =============

export const formatTransacaoType = (tipo: string): string => {
  switch (tipo) {
    case 'receita': return 'Receita'
    case 'despesa': return 'Despesa'
    default: return tipo
  }
}

export const formatParcelamentoType = (tipo: string): string => {
  switch (tipo) {
    case 'avista': return 'À Vista'
    case 'parcelado': return 'Parcelado'
    case 'recorrente': return 'Recorrente'
    default: return tipo
  }
}

export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit',
    year: 'numeric'
  })
}

export const getTransacaoColor = (tipo: 'receita' | 'despesa', colors: any) => {
  return tipo === 'receita' ? colors.green : colors.darkRed
}

export const validateTransacao = (transacao: ICreateTransacao): string[] => {
  const errors: string[] = []

  if (!transacao.descricao?.trim()) {
    errors.push('Descrição é obrigatória')
  }

  if (!transacao.valor || transacao.valor <= 0) {
    errors.push('Valor deve ser maior que zero')
  }

  if (!['receita', 'despesa'].includes(transacao.tipo)) {
    errors.push('Tipo deve ser receita ou despesa')
  }

  if (transacao.tipoParcelamento === 'parcelado') {
    if (!transacao.quantidadeParcelas || transacao.quantidadeParcelas < 2 || transacao.quantidadeParcelas > 60) {
      errors.push('Quantidade de parcelas deve ser entre 2 e 60')
    }
  }

  if (!transacao.contaId) {
    errors.push('Conta é obrigatória')
  }

  return errors
}

export const validateCategoria = (categoria: ICreateCategoria): string[] => {
  const errors: string[] = []

  if (!categoria.nome?.trim()) {
    errors.push('Nome da categoria é obrigatório')
  }

  return errors
}

// ============= COMPATIBILIDADE (MANTER FUNÇÕES EXISTENTES) =============

export const getTransacoes = async (contaId?: number) => {
  return await transacoesAPI.getAll(contaId)
}

export const addTransacaoIA = async (texto: string, contaId: number) => {
  return await transacoesAPI.createWithIA(texto, contaId)
}

export const addTransacao = async (
  tipo: 'receita' | 'despesa',
  categoria: string,
  valor: number,
  data: string,
  descricao?: string
) => {
  // Esta função mantém a compatibilidade com o formato antigo
  // Seria necessário adaptar conforme a nova estrutura
  console.warn('Função addTransacao está obsoleta, use transacoesAPI.create')
  throw new Error('Função obsoleta, use transacoesAPI.create')
}

export const deleteTransacao = async (id: string) => {
  return await transacoesAPI.delete(id)
}