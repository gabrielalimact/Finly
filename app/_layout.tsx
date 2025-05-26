import { useFonts } from 'expo-font'
import { Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'
import { useEffect } from 'react'
import { SplashScreen } from './splash'

export default function RootLayout() {
  const router = useRouter()
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Medium': require('../assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-Light': require('../assets/fonts/Montserrat-Light.ttf')
  })

  const isLogged = true

  useEffect(() => {
    if (loaded && isLogged) {
      router.replace('/(tabs)')
    }
  }, [loaded, isLogged])

  if (!loaded) {
    // Async font loading only occurs in development.
    return <SplashScreen />
  }

  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="auth"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="splash"
          options={{
            headerShown: false
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  )
}
