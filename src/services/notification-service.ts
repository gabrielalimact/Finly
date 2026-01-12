import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const NOTIFICATION_PERMISSION_KEY = 'notification_permission_requested';
const DAILY_NOTIFICATION_ID = 'daily_update_notification';

// Configurar como as notificações devem ser apresentadas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationService {
  requestPermission(): Promise<boolean>;
  scheduleDailyNotification(): Promise<void>;
  cancelDailyNotification(): Promise<void>;
  isPermissionRequested(): Promise<boolean>;
  hasPermission(): Promise<boolean>;
}

export const notificationService: NotificationService = {
  // Verificar se já foi solicitada permissão antes
  async isPermissionRequested(): Promise<boolean> {
    try {
      const requested = await AsyncStorage.getItem(NOTIFICATION_PERMISSION_KEY);
      return requested === 'true';
    } catch (error) {
      console.error('Erro ao verificar se permissão foi solicitada:', error);
      return false;
    }
  },

  // Verificar se tem permissão para notificações
  async hasPermission(): Promise<boolean> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Erro ao verificar permissão de notificação:', error);
      return false;
    }
  },

  // Solicitar permissão para notificações
  async requestPermission(): Promise<boolean> {
    try {
      // Marcar que a permissão foi solicitada
      await AsyncStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'true');

      if (!Device.isDevice) {
        console.warn('Notificações não funcionam no simulador');
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permissão de notificação negada');
        return false;
      }

      // No Android, configurar canal de notificação
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('daily-updates', {
          name: 'Lembretes Diários',
          description: 'Notificações para lembrar de atualizar os dados do app',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4ECDC4',
        });
      }

      return true;
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificação:', error);
      return false;
    }
  },

  // Agendar notificação diária às 18h
  async scheduleDailyNotification(): Promise<void> {
    try {
      // Primeiro, cancelar qualquer notificação existente
      await this.cancelDailyNotification();

      // Verificar se tem permissão
      const hasPermission = await this.hasPermission();
      if (!hasPermission) {
        console.log('Sem permissão para agendar notificações');
        return;
      }

      // Agendar notificação diária
      await Notifications.scheduleNotificationAsync({
        identifier: DAILY_NOTIFICATION_ID,
        content: {
          title: '💰 Finly - Lembrete Diário',
          body: 'Que tal atualizar seus gastos de hoje? Mantenha suas finanças sempre em dia!',
          data: {
            type: 'daily_reminder',
            action: 'open_app'
          },
          sound: true,
          badge: 1,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: 18, // 18:00
          minute: 0,
          repeats: true,
        },
      });

      console.log('Notificação diária agendada para 18:00');
    } catch (error) {
      console.error('Erro ao agendar notificação diária:', error);
    }
  },

  // Cancelar notificação diária
  async cancelDailyNotification(): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(DAILY_NOTIFICATION_ID);
      console.log('Notificação diária cancelada');
    } catch (error) {
      console.error('Erro ao cancelar notificação diária:', error);
    }
  },
};

// Função para lidar com notificações recebidas quando o app está aberto
export const handleNotificationReceived = (notification: Notifications.Notification) => {
  console.log('Notificação recebida:', notification);
  // Aqui você pode adicionar lógica adicional se necessário
};

// Função para lidar com toques em notificações
export const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
  console.log('Usuário tocou na notificação:', response);
  const data = response.notification.request.content.data;
  
  if (data?.type === 'daily_reminder') {
    // Aqui você pode navegar para uma tela específica ou executar uma ação
    console.log('Abrir app para atualizar dados');
  }
};
