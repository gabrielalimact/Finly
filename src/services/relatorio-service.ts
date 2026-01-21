import { api, handleAuthError, isAuthError } from './api-service'

// ============= INTERFACES =============

export interface IRelatorioCategoria {
  categoriaId: number
  categoriaNome: string
  totalReceitas: number
  totalDespesas: number
  totalTransacoes: number
  saldoLiquido: number
}

export interface IRelatorioTipo {
  tipo: string
  totalReceitas: number
  totalDespesas: number
  totalTransacoes: number
}

export interface IEvolucaoMensal {
  ano: number
  mes: number
  mesNome: string
  totalReceitas: number
  totalDespesas: number
  saldoLiquido: number
  totalTransacoes: number
}

export interface IRelatorioPeriodo {
  dataInicio: string
  dataFim: string
  totalReceitas: number
  totalDespesas: number
  saldoLiquido: number
  totalTransacoes: number
  relatoriosPorCategoria: IRelatorioCategoria[]
  relatoriosPorTipo: IRelatorioTipo[]
}

export interface IRelatorioFiltros {
  dataInicio?: string
  dataFim?: string
  categoriaId?: number
  tipo?: 'receita' | 'despesa'
}

export interface IDashboard {
  relatoriosPorCategoria: IRelatorioCategoria[]
  relatoriosPorTipo: IRelatorioTipo[]
  evolucaoMensal: IEvolucaoMensal[]
  resumoPeriodo: IRelatorioPeriodo
}

// ============= RELATÓRIO SERVICE =============

export const relatorioService = {
  // Obter relatório por categoria
  async obterPorCategoria(filtros?: IRelatorioFiltros): Promise<IRelatorioCategoria[]> {
    try {
      const params = new URLSearchParams()
      if (filtros?.dataInicio) params.append('dataInicio', filtros.dataInicio)
      if (filtros?.dataFim) params.append('dataFim', filtros.dataFim)
      if (filtros?.categoriaId) params.append('categoriaId', filtros.categoriaId.toString())
      if (filtros?.tipo) params.append('tipo', filtros.tipo)

      const response = await api.get(`/relatorios/categorias?${params.toString()}`)
      return response.data
    } catch (error: any) {
      console.error('Erro ao obter relatório por categoria:', error)
      
      if (isAuthError(error)) {
        handleAuthError(error)
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao obter relatório por categoria')
    }
  },

  // Obter relatório por tipo
  async obterPorTipo(filtros?: IRelatorioFiltros): Promise<IRelatorioTipo[]> {
    try {
      const params = new URLSearchParams()
      if (filtros?.dataInicio) params.append('dataInicio', filtros.dataInicio)
      if (filtros?.dataFim) params.append('dataFim', filtros.dataFim)
      if (filtros?.categoriaId) params.append('categoriaId', filtros.categoriaId.toString())
      if (filtros?.tipo) params.append('tipo', filtros.tipo)

      const response = await api.get(`/relatorios/tipos?${params.toString()}`)
      return response.data
    } catch (error: any) {
      console.error('Erro ao obter relatório por tipo:', error)
      
      if (isAuthError(error)) {
        handleAuthError(error)
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao obter relatório por tipo')
    }
  },

  // Obter evolução mensal
  async obterEvolucaoMensal(filtros?: IRelatorioFiltros): Promise<IEvolucaoMensal[]> {
    try {
      const params = new URLSearchParams()
      if (filtros?.dataInicio) params.append('dataInicio', filtros.dataInicio)
      if (filtros?.dataFim) params.append('dataFim', filtros.dataFim)
      if (filtros?.categoriaId) params.append('categoriaId', filtros.categoriaId.toString())
      if (filtros?.tipo) params.append('tipo', filtros.tipo)

      const response = await api.get(`/relatorios/evolucao-mensal?${params.toString()}`)
      return response.data
    } catch (error: any) {
      console.error('Erro ao obter evolução mensal:', error)
      
      if (isAuthError(error)) {
        handleAuthError(error)
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao obter evolução mensal')
    }
  },

  // Obter relatório do período
  async obterRelatorioPeriodo(filtros: IRelatorioFiltros): Promise<IRelatorioPeriodo> {
    try {
      const params = new URLSearchParams()
      if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio)
      if (filtros.dataFim) params.append('dataFim', filtros.dataFim)
      if (filtros.categoriaId) params.append('categoriaId', filtros.categoriaId.toString())
      if (filtros.tipo) params.append('tipo', filtros.tipo)

      const response = await api.get(`/relatorios/periodo?${params.toString()}`)
      return response.data
    } catch (error: any) {
      console.error('Erro ao obter relatório do período:', error)
      
      if (isAuthError(error)) {
        handleAuthError(error)
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao obter relatório do período')
    }
  },

  // Obter dashboard completo
  async obterDashboard(filtros?: IRelatorioFiltros): Promise<IDashboard> {
    try {
      const params = new URLSearchParams()
      if (filtros?.dataInicio) params.append('dataInicio', filtros.dataInicio)
      if (filtros?.dataFim) params.append('dataFim', filtros.dataFim)
      if (filtros?.categoriaId) params.append('categoriaId', filtros.categoriaId.toString())
      if (filtros?.tipo) params.append('tipo', filtros.tipo)

      const response = await api.get(`/relatorios/dashboard?${params.toString()}`)
      return response.data
    } catch (error: any) {
      console.error('Erro ao obter dashboard:', error)
      
      if (isAuthError(error)) {
        handleAuthError(error)
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao obter dashboard')
    }
  },

  // Obter dados do mês atual
  async obterMesAtual(): Promise<IEvolucaoMensal | null> {
    try {
      const agora = new Date()
      const dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1).toISOString().split('T')[0]
      const dataFim = new Date(agora.getFullYear(), agora.getMonth() + 1, 0).toISOString().split('T')[0]
      
      const evolucao = await this.obterEvolucaoMensal({ dataInicio, dataFim })
      return evolucao.length > 0 ? evolucao[0] : null
    } catch (error: any) {
      console.error('Erro ao obter dados do mês atual:', error)
      return null
    }
  },

  // Obter relatório por categoria com percentuais
  async obterRelatorioCategorias(filtros?: IRelatorioFiltros): Promise<any[]> {
    try {
      const params = new URLSearchParams()
      if (filtros?.dataInicio) params.append('dataInicio', filtros.dataInicio)
      if (filtros?.dataFim) params.append('dataFim', filtros.dataFim)
      if (filtros?.tipo) params.append('tipo', filtros.tipo)

      const response = await api.get(`/relatorios/categorias/percentuais?${params.toString()}`)
      return response.data
    } catch (error: any) {
      console.error('Erro ao obter relatório de categorias:', error)
      
      if (isAuthError(error)) {
        handleAuthError(error)
      }
      
      // Em caso de erro, retornar dados mockados para desenvolvimento
      return []
    }
  },

  // Calcular métricas do dashboard
  calcularMetricas(dadosMensais: IEvolucaoMensal[]): any[] {
    if (!dadosMensais || dadosMensais.length === 0) return []

    const mesAtual = dadosMensais[dadosMensais.length - 1]
    const mesAnterior = dadosMensais.length > 1 ? dadosMensais[dadosMensais.length - 2] : null

    const calcularVariacao = (atual: number, anterior: number) => {
      if (anterior === 0) return atual > 0 ? 100 : 0
      return ((atual - anterior) / anterior) * 100
    }

    const metricas = [
      {
        title: 'Receitas do Mês',
        value: mesAtual.totalReceitas,
        percentage: mesAnterior ? calcularVariacao(mesAtual.totalReceitas, mesAnterior.totalReceitas) : 0,
        icon: 'trending-up' as const,
        type: 'positive' as const,
      },
      {
        title: 'Despesas do Mês',
        value: mesAtual.totalDespesas,
        percentage: mesAnterior ? calcularVariacao(mesAtual.totalDespesas, mesAnterior.totalDespesas) : 0,
        icon: 'trending-down' as const,
        type: 'negative' as const,
      },
      {
        title: 'Saldo Líquido',
        value: mesAtual.saldoLiquido,
        percentage: mesAnterior ? calcularVariacao(mesAtual.saldoLiquido, mesAnterior.saldoLiquido) : 0,
        icon: 'wallet' as const,
        type: mesAtual.saldoLiquido >= 0 ? 'positive' as const : 'negative' as const,
      },
      {
        title: 'Transações',
        value: mesAtual.totalTransacoes,
        percentage: mesAnterior ? calcularVariacao(mesAtual.totalTransacoes, mesAnterior.totalTransacoes) : 0,
        icon: 'swap-horizontal' as const,
        type: 'neutral' as const,
      },
    ]

    return metricas
  }
}
