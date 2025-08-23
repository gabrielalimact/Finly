import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

function App() {
  return (
    <View style={styles.container}>

      <View style={styles.banner}>
        <Image
          source={require('../assets/images/welcomebanner.png')}
          style={styles.bannerImg}
        />
      </View>

      <Text style={styles.text}>
        <Text style={styles.title}>Finly</Text>: Controle suas finanças de forma simples e rápida

      </Text>

      <Text style={styles.caption}>
        Gerencie suas finanças pessoais com praticidade e tenha controle total
        sobre seus gastos e ganhos. Simplifique sua vida financeira com o Finly!
      </Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => {
          router.push('/auth/login')
        }}
      >
        <Text style={styles.textButton}>Faça o login ou cadastre-se</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: Colors.light.bgPrimary,
    paddingVertical: 100
  },
  title: {
    fontSize: 36,
    fontFamily: 'Montserrat-Bold',
    color: Colors.light.text
  },
  text: {
    fontSize: 36,
    fontFamily: 'Montserrat',
    textAlign: 'justify',
    marginTop: 20,
  },
  caption: {
    fontFamily: 'Montserrat-Regular',
    color: Colors.light.textSecondary,
    lineHeight: 20,
    textAlign: 'justify',
    marginTop: 20,
    fontSize: 16,
  },

  banner: {
    backgroundColor: Colors.light.primaryButtonBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderRadius: 20,
  },
  bannerImg: {
    width: '100%',
    height: 280,
    borderRadius: 20,
    position: 'relative',
    top: 20,
  },
  icon: {
    width: 40,
    height: 40
  },
  loginButton: {
    backgroundColor: Colors.light.primaryButtonBg,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.light.black
  },
  textButton: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  }
})

export default App
