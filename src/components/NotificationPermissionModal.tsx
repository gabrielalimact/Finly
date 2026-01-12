import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface NotificationPermissionModalProps {
  visible: boolean;
  onRequestPermission: () => Promise<boolean>;
  onClose: () => void;
}

export const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({
  visible,
  onRequestPermission,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAllowNotifications = async () => {
    try {
      setIsLoading(true);
      const granted = await onRequestPermission();
      
      if (granted) {
        Alert.alert(
          'Notificações Ativadas! 🎉',
          'Você receberá lembretes diários às 18h para manter suas finanças atualizadas.',
          [{ text: 'Entendi', onPress: onClose }]
        );
      } else {
        Alert.alert(
          'Permissão Negada',
          'Você pode ativar as notificações a qualquer momento nas configurações do seu dispositivo.',
          [{ text: 'Ok', onPress: onClose }]
        );
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      Alert.alert(
        'Erro',
        'Não foi possível solicitar permissão para notificações.',
        [{ text: 'Ok', onPress: onClose }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotNow = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="notifications-outline" size={48} color={Colors.light.green} />
              </View>
              <View style={styles.textContainer}>
              <Text style={styles.title}>Gastos em controle</Text>
              <Text style={styles.subtitle}>
                Receba lembretes diários para atualizar seus gastos e manter o controle total das suas finanças.
              </Text>
              </View>
            </View>

            <View style={styles.benefits}>
              <View style={styles.benefitItem}>
                <Ionicons name="trending-up-outline" size={20} color={Colors.light.green} />
                <Text style={styles.benefitText}>Melhor controle financeiro</Text>
              </View>
              
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle-outline" size={20} color={Colors.light.green} />
                <Text style={styles.benefitText}>Dados sempre atualizados</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleAllowNotifications}
                disabled={isLoading}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoading ? 'Solicitando...' : 'Permitir Notificações'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleNotNow}
                disabled={isLoading}
              >
                <Text style={styles.secondaryButtonText}>Agora Não</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.footer}>
              Você pode alterar isso a qualquer momento nas configurações do app ou do dispositivo.
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
  },
  modal: {
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.light.bgPrimary,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Montserrat-Bold',
    color: Colors.light.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  benefits: {
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.black,
    marginLeft: 12,
    flex: 1,
  },
  actions: {
    gap: 12,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.light.green,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.black,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: Colors.light.textSecondary,
  },
  footer: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});
