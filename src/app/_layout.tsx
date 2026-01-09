import { UserProvider, useUserContext } from '@/contexts'
import { useFonts } from 'expo-font'
import { Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { SplashScreen } from './splash'

function RootLayoutContent() {
  const router = useRouter()
  const { user } = useUserContext()
  const [loaded] = useFonts({
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Medium': require('../assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-Light': require('../assets/fonts/Montserrat-Light.ttf')
  })

  useEffect(() => {
    if (loaded) {
      if (user) {
        router.replace('/(tabs)')
      } else {
        router.dismissAll()
        router.replace('/')
      }
    }
  }, [loaded, user])

  if (!loaded) {
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
        <Stack.Screen name="new-transactions/index" options={{
          presentation: 'modal',
        }} />
        <Stack.Screen name="accounts/index" options={{
          presentation: 'modal',
          title: 'Contas e Cartões'
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
