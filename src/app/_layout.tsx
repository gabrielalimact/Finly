import { NotificationPermissionModal } from '@/components/NotificationPermissionModal'
import { UserProvider, useUserContext } from '@/contexts'
import { handleNotificationReceived, handleNotificationResponse, notificationService } from '@/services/notification-service'
import { useFonts } from 'expo-font'
import * as Notifications from 'expo-notifications'
import { Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import 'react-native-reanimated'
import { SplashScreen } from './splash'

function RootLayoutContent() {
  const router = useRouter()
  const { user } = useUserContext()
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [loaded] = useFonts({
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Medium': require('../assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-Light': require('../assets/fonts/Montserrat-Light.ttf')
  })

  // Configurar notificações quando app carrega
  useEffect(() => {
    const setupNotifications = async () => {
      // Configurar listeners de notificação
      const notificationListener = Notifications.addNotificationReceivedListener(handleNotificationReceived);
      const responseListener = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

      return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
      };
    };

    if (loaded) {
      setupNotifications();
    }
  }, [loaded]);

  // Verificar se deve mostrar modal de permissão quando usuário faz login
  useEffect(() => {
    const checkNotificationPermission = async () => {
      if (user && loaded) {
        // Aguardar um pouco para a navegação se estabelecer
        setTimeout(async () => {
          try {
            const permissionRequested = await notificationService.isPermissionRequested();
            const hasPermission = await notificationService.hasPermission();
            
            // Se nunca solicitou permissão, mostrar modal
            if (!permissionRequested) {
              setShowNotificationModal(true);
            }
            // Se já tem permissão, configurar notificação diária
            else if (hasPermission) {
              await notificationService.scheduleDailyNotification();
            }
          } catch (error) {
            console.error('Erro ao verificar permissão de notificação:', error);
          }
        }, 2000); // Aguarda 2 segundos após o login
      }
    };

    checkNotificationPermission();
  }, [user, loaded]);

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

  const handleRequestNotificationPermission = async (): Promise<boolean> => {
    try {
      const granted = await notificationService.requestPermission();
      if (granted) {
        await notificationService.scheduleDailyNotification();
      }
      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  };

  const handleCloseNotificationModal = () => {
    setShowNotificationModal(false);
  };

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
        <Stack.Screen name="new-transactions-ia/index" options={{
          presentation: 'modal',
        }} />
        <Stack.Screen name="manual-transaction/index"/>
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
      
      {/* Modal de Permissão de Notificações */}
      <NotificationPermissionModal
        visible={showNotificationModal}
        onRequestPermission={handleRequestNotificationPermission}
        onClose={handleCloseNotificationModal}
      />
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
