import AsyncStorage from '@react-native-async-storage/async-storage'
import { api } from './api-service'

interface LoginResponse {
  access_token: string
  refresh_token: string
  user: {
    id: number
    username: string
    nome: string
    email: string
  }
}

interface RegisterRequest {
  nome: string
  username: string
  email: string
  senha: string
}

export async function register(userData: RegisterRequest): Promise<any> {
  const response = await api.post('/usuarios', userData)
  return response.data
}

export async function login(username: string, senha: string): Promise<LoginResponse> {
  const response = await api.post('/auth/login', {
    username,
    senha
  })

  await AsyncStorage.setItem('access_token', response.data.access_token)
  await AsyncStorage.setItem('refresh_token', response.data.refresh_token)
  await AsyncStorage.setItem('user', JSON.stringify(response.data.user))

  return response.data
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem('access_token')
  await AsyncStorage.removeItem('refresh_token')
  await AsyncStorage.removeItem('user')
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await AsyncStorage.getItem('access_token')
  return token !== null
}

export async function getCurrentUser(): Promise<any> {
  const userData = await AsyncStorage.getItem('user')
  return userData ? JSON.parse(userData) : null
}


