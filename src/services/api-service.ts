import AsyncStorage from '@react-native-async-storage/async-storage'
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { router } from 'expo-router'
import { jwtDecode } from 'jwt-decode'


interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const baseURL = process.env.EXPO_PUBLIC_API_URL

export const api = axios.create({
  baseURL: `${baseURL}`
})

export const apiCep = axios.create({
  baseURL: 'https://viacep.com.br/ws'
})

interface JWTPayload {
  exp: number
}


async function setAuthorizationHeader(config: InternalAxiosRequestConfig) {
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/auth/login', '/auth/register', '/auth/refresh']
  const isPublicRoute = publicRoutes.some(route => config.url?.includes(route))
  
  if (!isPublicRoute) {
    if (await isTokenExpiringSoon()) {
      try {
        await refreshToken()
      } catch (error) {
        console.error('Erro ao renovar token proativamente:', error)
      }
    }
  }

  const token = await AsyncStorage.getItem('access_token')
  if (token && !isPublicRoute) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}

const setErrorRequest = (error: AxiosError) => Promise.reject(error)

export async function refreshToken() {
  const refresh_token = await AsyncStorage.getItem('refresh_token')

  if (!refresh_token) {
    logout()
    throw new Error('No refresh token available')
  }

  try {
    const { data } = await axios.post(
      `${baseURL}/auth/refresh`,
      {
        refresh_token: refresh_token
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    const accessToken = data.access_token

    await AsyncStorage.setItem('access_token', accessToken)

    return data
  } catch (error) {
    logout()
    throw error
  }
}
export async function isTokenExpiringSoon(): Promise<boolean> {
  const token = await AsyncStorage.getItem('access_token')
  if (!token) return false

  try {
    const decoded = jwtDecode<JWTPayload>(token)
    const currentTime = Math.floor(Date.now() / 1000)

    return decoded.exp - currentTime < 300
  } catch {
    return false
  }
}
export async function refreshTokenIfNeeded(): Promise<void> {
  if (await isTokenExpiringSoon()) {
    try {
      await refreshToken()
    } catch (error) {
      console.error('Erro ao renovar token proativamente:', error)
    }
  }
}

let isRefreshing = false
let refreshQueue: ((token: string) => void)[] = []

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshQueue.push(cb)
}

function onRefreshed(token: string) {
  refreshQueue.forEach(cb => cb(token))
  refreshQueue = []
}

export function logout() {
  AsyncStorage.removeItem('user')
  AsyncStorage.removeItem('access_token')
  AsyncStorage.removeItem('refresh_token')
  
  // Navegar para página de login no React Native
  try {
    router.dismissAll()
    router.replace('/')
  } catch (error) {
    console.warn('Erro ao navegar para login:', error)
  }
}

// Função auxiliar para lidar com erros de autenticação
export function handleAuthError(error: any): never {
  console.error('Erro de autenticação:', error)
  logout()
  throw new Error('Sessão expirada. Você será redirecionado para o login.')
}

// Função auxiliar para verificar se é erro de autenticação
export function isAuthError(error: any): boolean {
  return (
    error.message?.includes('refresh token') ||
    error.message?.includes('Unauthorized') ||
    error.response?.status === 401 ||
    error.response?.status === 403
  )
}

function setAxiosResponseInterceptor(response: AxiosResponse) {
  return response
}

async function setErrorResponseInteceptor(error: AxiosError) {
  const originalRequest = error.config as ExtendedAxiosRequestConfig

  if (
    error.response?.status === 401 &&
    !originalRequest._retry &&
    !originalRequest.url?.includes('/auth/refresh')
  ) {
    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise(resolve => {
        subscribeTokenRefresh(token => {
          originalRequest.headers!['Authorization'] = `Bearer ${token}`
          resolve(api(originalRequest))
        })
      })
    }

    isRefreshing = true

    try {
      const data = await refreshToken()
      const newToken = data.access_token

      onRefreshed(newToken)

      originalRequest.headers!['Authorization'] = `Bearer ${newToken}`
      return api(originalRequest)
    } catch (err) {
      logout()
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }

  return Promise.reject(error)
}


api.interceptors.request.use(setAuthorizationHeader, setErrorRequest)
api.interceptors.response.use(setAxiosResponseInterceptor, setErrorResponseInteceptor)
