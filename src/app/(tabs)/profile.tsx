import { TextStyled } from '@/components/TextStyled'
import { Colors } from '@/constants/Colors'
import { useUserContext } from '@/contexts'
import { notificationService } from '@/services/notification-service'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Alert, FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ProfileScreen() {
  const router = useRouter()
  const { user, logout } = useUserContext()

  const handleLogout = async () => {
    Alert.alert(
      'Confirmar Logout',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout()
              setTimeout(() => {
                router.replace('/')
              }, 100)
            } catch (error) {
              Alert.alert('Erro', 'Falha ao fazer logout')
            }
          },
        },
      ]
    )
  }
  const handleGoToAccounts = () => {
    router.push('/accounts')
  }

  const handleNotificationSettings = async () => {
    try {
      const hasPermission = await notificationService.hasPermission();
      
      Alert.alert(
        'Configurações de Notificação',
        hasPermission 
          ? 'Você receberá lembretes diários às 18h para atualizar seus dados financeiros.'
          : 'As notificações estão desativadas. Você pode ativá-las para receber lembretes diários.',
        [
          { text: 'Cancelar', style: 'cancel' },
          hasPermission 
            ? {
                text: 'Desativar',
                style: 'destructive',
                onPress: async () => {
                  await notificationService.cancelDailyNotification();
                  Alert.alert('Notificações Desativadas', 'Você não receberá mais lembretes diários.');
                }
              }
            : {
                text: 'Ativar',
                onPress: async () => {
                  const granted = await notificationService.requestPermission();
                  if (granted) {
                    await notificationService.scheduleDailyNotification();
                    Alert.alert('Notificações Ativadas!', 'Você receberá lembretes diários às 18h.');
                  } else {
                    Alert.alert('Permissão Negada', 'Ative as notificações nas configurações do seu dispositivo.');
                  }
                }
              }
        ]
      );
    } catch (error) {
      console.error('Erro ao gerenciar notificações:', error);
      Alert.alert('Erro', 'Não foi possível alterar as configurações de notificação.');
    }
  }

  const profileSections = [
    {
      title: 'Dados Pessoais',
      items: [
        { icon: 'person-outline', title: 'Informações Pessoais', subtitle: 'Nome, email, telefone' },
        { icon: 'shield-outline', title: 'Segurança', subtitle: 'Senha, autenticação' },
        { icon: 'notifications-outline', title: 'Notificações', subtitle: 'Alertas e lembretes', onPress: handleNotificationSettings },
      ]
    },
    {
      title: 'Dados Financeiros',
      items: [
        { icon: 'card-outline', title: 'Contas e Cartões', subtitle: 'Gerenciar contas vinculadas', onPress: handleGoToAccounts },
        { icon: 'analytics-outline', title: 'Relatórios', subtitle: 'Histórico e análises' },
        { icon: 'receipt-outline', title: 'Categorias', subtitle: 'Personalizar categorias' },
      ]
    },
    {
      title: 'Configurações',
      items: [
        { icon: 'help-outline', title: 'Ajuda', subtitle: 'Suporte e FAQ' },
        { icon: 'information-outline', title: 'Sobre', subtitle: 'Versão e informações' },
      ]
    }
  ]

  const renderMenuItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
      <View style={styles.menuLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon as any} size={24} color={Colors.light.green} />
        </View>
        <View style={styles.menuInfo}>
          <TextStyled 
            text={item.title}
            fontWeight="medium"
            color={Colors.light.black}
          />
          <TextStyled 
            text={item.subtitle}
            type="caption"
            color={Colors.light.textSecondary}
          />
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.light.textSecondary} />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.content}>
        <View style={styles.userInfo}>
          {user && (
            <>
              <View style={styles.avatarSection}>
                <View style={styles.avatarContainer}>
                  <Ionicons name="person" size={40} color={Colors.light.green} />
                </View>
                <View style={styles.userDetails}>
                  <TextStyled 
                    text={user.name} 
                    color={Colors.light.black}
                    fontWeight='bold'
                    type="subtitle"
                  />
                  <TextStyled 
                    text={user.email} 
                    color={Colors.light.textSecondary}
                    type="caption"
                  />
                </View>
                <TouchableOpacity style={styles.editProfileButton}>
                  <Ionicons name="pencil" size={16} color={Colors.light.green} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <View style={styles.sectionHeader}>
              <TextStyled 
                text={section.title}
                fontWeight="bold"
                color={Colors.light.black}
                type="subtitle"
              />
            </View>
            <FlatList
              data={section.items}
              renderItem={renderMenuItem}
              keyExtractor={(item, index) => `${sectionIndex}-${index}`}
              scrollEnabled={false}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.light.darkRed} style={{ marginRight: 8 }} />
          <TextStyled 
            text="Fazer Logout" 
            fontWeight="medium"
            color={Colors.light.darkRed}
          />
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  userInfo: {
    gap: 20,
    marginTop: 40,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
    gap: 4,
  },
  editProfileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    padding: 16,
    paddingBottom: 12,
    backgroundColor: '#fafafa',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuInfo: {
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.light.negativeText,
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
})
