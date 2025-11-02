import { TextStyled } from '@/components/TextStyled'
import { Colors } from '@/constants/Colors'
import { useUser } from '@/contexts'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ProfileScreen() {
  const { user, signOut } = useUser()

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
              await signOut()
            } catch (error) {
              Alert.alert('Erro', 'Falha ao fazer logout')
            }
          },
        },
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.userInfo}>
          <TextStyled 
            text="Perfil do Usuário" 
            type="title" 
            fontWeight="bold"
            color={Colors.light.black}
          />
          
          {user && (
            <>
              <TextStyled 
                text={`Nome: ${user.name}`} 
                color={Colors.light.black}
              />
              <TextStyled 
                text={`Email: ${user.email}`} 
                color={Colors.light.black}
              />
            </>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <TextStyled 
            text="Fazer Logout" 
            fontWeight="bold"
            color={Colors.light.negativeText}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.bgPrimary,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  userInfo: {
    gap: 16,
    marginTop: 40,
  },
  logoutButton: {
    backgroundColor: Colors.light.darkRed,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
})
