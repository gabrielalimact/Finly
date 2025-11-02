import { UserProvider, useUser } from '@/contexts'
import { useFonts } from 'expo-font'
import { Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { SplashScreen } from './splash'

function RootLayoutContent() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useUser()
  const [loaded] = useFonts({
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Medium': require('../assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-Light': require('../assets/fonts/Montserrat-Light.ttf')
  })

  useEffect(() => {
    if (loaded && !isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)')
      } else {
        router.replace('/')
      }
    }
  }, [loaded, isLoading, isAuthenticated])

  if (!loaded || isLoading) {
    return <SplashScreen />
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="auth"
        />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="new-transaction/index" options={{
          presentation: 'modal',
        }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="splash"
          options={{
            headerShown: false
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  )
}

export default function RootLayout() {
  return (
    <UserProvider>
      <RootLayoutContent />
    </UserProvider>
  )
}
