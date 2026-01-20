import { api, handleAuthError, isAuthError } from './api-service'

export enum TipoMeta {
  MENSAL = 'mensal',
  ANUAL = 'anual',
  PERSONALIZADA = 'personalizada',
}

export enum StatusMeta {
  ATIVA = 'ativa',
  PAUSADA = 'pausada',
  CONCLUIDA = 'concluida',
  VENCIDA = 'vencida',
}

export interface ICategoriaMeta {
  id: number
  nome: string
}

export interface IMeta {
  id: number
  nome: string
  descricao?: string
  valorAlvo: number
  valorAtual: number
  tipo: TipoMeta
  status: StatusMeta
  dataInicio: Date
  dataFim: Date
  porcentagemConcluida: number
  diasRestantes: number
  categoria?: ICategoriaMeta
  criadoEm: Date
  atualizadoEm: Date
}

export interface IProgressoMeta {
  metaId: number
  nomeMeta: string
  valorAlvo: number
  valorAtual: number
  porcentagemConcluida: number
  diasRestantes: number
  status: StatusMeta
}

export interface ICreateMeta {
  nome: string
  descricao?: string
  valorAlvo: number
  tipo?: TipoMeta
  dataInicio: string
  dataFim: string
  categoriaId?: number
}

export interface IUpdateMeta {
  nome?: string
  descricao?: string
  valorAlvo?: number
  tipo?: TipoMeta
  dataInicio?: string
  dataFim?: string
  categoriaId?: number
}

// ============= FUNÇÕES =============

/**
 * Busca todas as metas do usuário
 */
export async function listarMetas(): Promise<IMeta[]> {
  try {
    const response = await api.get<IMeta[]>('/metas')
    return response.data
  } catch (error: any) {
    if (isAuthError(error)) {
      throw handleAuthError(error)
    }
    console.error('Erro ao listar metas:', error)
    throw new Error(
      error?.response?.data?.message || 'Erro ao buscar metas. Tente novamente.'
    )
  }
}

/**
 * Busca uma meta específica pelo ID
 */
export async function buscarMetaPorId(id: number): Promise<IMeta> {
  try {
    const response = await api.get<IMeta>(`/metas/${id}`)
    return response.data
  } catch (error: any) {
    if (isAuthError(error)) {
      throw handleAuthError(error)
    }
    console.error('Erro ao buscar meta por ID:', error)
    throw new Error(
      error?.response?.data?.message || 'Erro ao buscar meta. Tente novamente.'
    )
  }
}

/**
 * Cria uma nova meta
 */
export async function criarMeta(dados: ICreateMeta): Promise<IMeta> {
  try {
    const response = await api.post<IMeta>('/metas', dados)
    return response.data
  } catch (error: any) {
    if (isAuthError(error)) {
      throw handleAuthError(error)
    }
    console.error('Erro ao criar meta:', error)
    throw new Error(
      error?.response?.data?.message || 'Erro ao criar meta. Tente novamente.'
    )
  }
}

/**
 * Atualiza uma meta existente
 */
export async function atualizarMeta(id: number, dados: IUpdateMeta): Promise<IMeta> {
  try {
    const response = await api.patch<IMeta>(`/metas/${id}`, dados)
    return response.data
  } catch (error: any) {
    if (isAuthError(error)) {
      throw handleAuthError(error)
    }
    console.error('Erro ao atualizar meta:', error)
    throw new Error(
      error?.response?.data?.message || 'Erro ao atualizar meta. Tente novamente.'
    )
  }
}

/**
 * Deleta uma meta
 */
export async function deletarMeta(id: number): Promise<void> {
  try {
    await api.delete(`/metas/${id}`)
  } catch (error: any) {
    if (isAuthError(error)) {
      throw handleAuthError(error)
    }
    console.error('Erro ao deletar meta:', error)
    throw new Error(
      error?.response?.data?.message || 'Erro ao deletar meta. Tente novamente.'
    )
  }
}

/**
 * Busca o progresso de todas as metas
 */
export async function obterProgressoMetas(): Promise<IProgressoMeta[]> {
  try {
    const response = await api.get<IProgressoMeta[]>('/metas/progresso')
    return response.data
  } catch (error: any) {
    if (isAuthError(error)) {
      throw handleAuthError(error)
    }
    console.error('Erro ao buscar progresso das metas:', error)
    throw new Error(
      error?.response?.data?.message || 'Erro ao buscar progresso das metas. Tente novamente.'
    )
  }
}

/**
 * Força a atualização do progresso das metas
 */
export async function atualizarProgressoMetas(): Promise<{ metasConcluidas: IMeta[] }> {
  try {
    const response = await api.post<{ metasConcluidas: IMeta[] }>('/metas/atualizar-progresso')
    return response.data
  } catch (error: any) {
    if (isAuthError(error)) {
      throw handleAuthError(error)
    }
    console.error('Erro ao atualizar progresso das metas:', error)
    throw new Error(
      error?.response?.data?.message || 'Erro ao atualizar progresso das metas. Tente novamente.'
    )
  }
}

/**
 * Busca todas as categorias disponíveis
 */
export async function listarCategorias(): Promise<ICategoriaMeta[]> {
  try {
    const response = await api.get<ICategoriaMeta[]>('/categorias')
    return response.data
  } catch (error: any) {
    if (isAuthError(error)) {
      throw handleAuthError(error)
    }
    console.error('Erro ao listar categorias:', error)
    throw new Error(
      error?.response?.data?.message || 'Erro ao buscar categorias. Tente novamente.'
    )
  }
}

// ============= FUNÇÕES AUXILIARES =============

/**
 * Verifica se uma meta está vencida
 */
export function isMetaVencida(meta: IMeta): boolean {
  return meta.status === StatusMeta.VENCIDA || new Date(meta.dataFim) < new Date()
}

/**
 * Verifica se uma meta está concluída
 */
export function isMetaConcluida(meta: IMeta): boolean {
  return meta.status === StatusMeta.CONCLUIDA || meta.porcentagemConcluida >= 100
}

/**
 * Formata a porcentagem de conclusão da meta
 */
export function formatarPorcentagem(porcentagem: number): string {
  return `${Math.round(porcentagem)}%`
}

/**
 * Formata o valor da meta
 */
export function formatarValorMeta(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

/**
 * Calcula quantos dias restam para a meta
 */
export function calcularDiasRestantes(dataFim: Date | string): number {
  const fim = new Date(dataFim)
  const hoje = new Date()
  const diferenca = fim.getTime() - hoje.getTime()
  return Math.ceil(diferenca / (1000 * 3600 * 24))
}

/**
 * Retorna a cor baseada no status da meta
 */
export function getCorStatusMeta(status: StatusMeta): string {
  switch (status) {
    case StatusMeta.ATIVA:
      return '#10B981' // Verde
    case StatusMeta.PAUSADA:
      return '#F59E0B' // Amarelo
    case StatusMeta.CONCLUIDA:
      return '#059669' // Verde escuro
    case StatusMeta.VENCIDA:
      return '#EF4444' // Vermelho
    default:
      return '#6B7280' // Cinza
  }
}

/**
 * Retorna o texto amigável para o tipo de meta
 */
export function getTipoMetaTexto(tipo: TipoMeta): string {
  switch (tipo) {
    case TipoMeta.MENSAL:
      return 'Meta Mensal'
    case TipoMeta.ANUAL:
      return 'Meta Anual'
    case TipoMeta.PERSONALIZADA:
      return 'Meta Personalizada'
    default:
      return 'Meta'
  }
}

/**
 * Retorna o texto amigável para o status da meta
 */
export function getStatusMetaTexto(status: StatusMeta): string {
  switch (status) {
    case StatusMeta.ATIVA:
      return 'Ativa'
    case StatusMeta.PAUSADA:
      return 'Pausada'
    case StatusMeta.CONCLUIDA:
      return 'Concluída'
    case StatusMeta.VENCIDA:
      return 'Vencida'
    default:
      return 'Indefinido'
  }
}

/**
 * Valida os dados de criação de meta
 */
export function validarDadosMeta(dados: ICreateMeta): string | null {
  if (!dados.nome || dados.nome.trim() === '') {
    return 'Nome da meta é obrigatório'
  }
  
  if (dados.nome.length > 255) {
    return 'Nome deve ter no máximo 255 caracteres'
  }
  
  if (dados.descricao && dados.descricao.length > 500) {
    return 'Descrição deve ter no máximo 500 caracteres'
  }
  
  if (!dados.valorAlvo || dados.valorAlvo <= 0) {
    return 'Valor alvo deve ser maior que zero'
  }
  
  if (!dados.dataInicio) {
    return 'Data de início é obrigatória'
  }
  
  if (!dados.dataFim) {
    return 'Data de fim é obrigatória'
  }
  
  const dataInicio = new Date(dados.dataInicio)
  const dataFim = new Date(dados.dataFim)
  
  if (dataFim <= dataInicio) {
    return 'Data de fim deve ser posterior à data de início'
  }
  
  // Cria a data de hoje no timezone local, sem horário
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  
  // Cria a data de início garantindo que seja no timezone local
  const [year, month, day] = dados.dataInicio.split('-')
  const dataInicioLocal = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  
  if (dataInicioLocal < hoje) {
    return 'Data de início não pode ser no passado'
  }
  
  return null
}
