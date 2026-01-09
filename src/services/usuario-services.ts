import { api } from './api-service'

export async function register(name: string, username: string, email: string, senha: string) {
  const params = new URLSearchParams()
  params.append('nome', name)
  params.append('username', username)
  params.append('email', email)
  params.append('senha', senha)
  
  const response = await api.post('/usuarios', params)

  return response.status
}