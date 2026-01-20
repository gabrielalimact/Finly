import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';
import { IMeta } from './metas-service';

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

/**
 * Exibe uma notificação comemorativa quando uma meta é concluída
 * @param meta Meta que foi concluída
 */
export const showMetaConcluida = async (meta: IMeta) => {
  try {
    // Executa feedback háptico para celebração
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Agenda notificação imediata
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 Meta Concluída!',
        body: `Parabéns! Você atingiu sua meta "${meta.nome}"! 🏆`,
        data: { 
          type: 'META_CONCLUIDA',
          metaId: meta.id,
          metaNome: meta.nome 
        },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Notificação imediata
    });

    // Exibe alerta visual também
    Alert.alert(
      '🎉 Meta Concluída!',
      `Parabéns! Você atingiu sua meta "${meta.nome}"!\n\nContinue assim, você está indo muito bem! 🏆`,
      [
        {
          text: 'Continuar',
          style: 'default',
          onPress: () => {
            // Segunda vibração de celebração
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        },
      ]
    );

    console.log(`✅ Notificação de meta concluída enviada: ${meta.nome}`);
  } catch (error) {
    console.error('❌ Erro ao exibir notificação de meta concluída:', error);
  }
};

/**
 * Exibe notificações para múltiplas metas concluídas simultaneamente
 * @param metas Array de metas que foram concluídas
 */
export const showMultiplasMetasConcluidas = async (metas: IMeta[]) => {
  try {
    if (metas.length === 0) return;

    // Executa feedback háptico para múltiplas celebrações
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    if (metas.length === 1) {
      // Se for apenas uma meta, usa o método individual
      await showMetaConcluida(metas[0]);
      return;
    }

    const nomesMetas = metas.map(meta => `"${meta.nome}"`).join(', ');
    
    // Agenda notificação para múltiplas metas
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎊 Múltiplas Metas Concluídas!',
        body: `Incrível! Você concluiu ${metas.length} metas: ${nomesMetas}`,
        data: { 
          type: 'MULTIPLAS_METAS_CONCLUIDAS',
          metasIds: metas.map(m => m.id),
          quantidade: metas.length
        },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null,
    });

    // Exibe alerta para múltiplas metas
    Alert.alert(
      '🎊 Múltiplas Metas Concluídas!',
      `Incrível! Você concluiu ${metas.length} metas hoje:\n\n${metas.map(m => `• ${m.nome}`).join('\n')}\n\nVocê está arrasando! Continue assim! 🚀`,
      [
        {
          text: 'Celebrar! 🎉',
          style: 'default',
          onPress: async () => {
            // Sequência de vibrações para celebração especial
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            setTimeout(async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }, 200);
            setTimeout(async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }, 400);
          },
        },
      ]
    );

    console.log(`✅ Notificação de múltiplas metas concluídas enviada: ${metas.length} metas`);
  } catch (error) {
    console.error('❌ Erro ao exibir notificações de múltiplas metas concluídas:', error);
  }
};

// Função para lidar com toques em notificações
export const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
  console.log('Usuário tocou na notificação:', response);
  const data = response.notification.request.content.data;
  
  if (data?.type === 'daily_reminder') {
    // Aqui você pode navegar para uma tela específica ou executar uma ação
    console.log('Abrir app para atualizar dados');
  } else if (data?.type === 'META_CONCLUIDA') {
    console.log('Usuário tocou na notificação de meta concluída:', data.metaNome);
    // Pode navegar para a tela de metas ou exibir detalhes
  } else if (data?.type === 'MULTIPLAS_METAS_CONCLUIDAS') {
    console.log('Usuário tocou na notificação de múltiplas metas concluídas');
    // Pode navegar para a tela de metas
  }
};
