import { useFonts } from 'expo-font'
import { Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { SplashScreen } from './splash'

export default function RootLayout() {
  const router = useRouter()
  const [loaded] = useFonts({
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Medium': require('../assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-Light': require('../assets/fonts/Montserrat-Light.ttf')
  })

  const isLogged = false

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
      <StatusBar style="auto" />
    </>
  )
}
