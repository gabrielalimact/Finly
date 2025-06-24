import IconBack from '@/components/IconBack/IconBack'
import { Colors } from '@/constants/Colors'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  function handleLogin() {
    router.replace('/(tabs)')

    // if (!email || !password) {
    //   Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    //   return;
    // }
    // else {
    // }
  }

  function handleGoBack() {
    router.back()
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
          <IconBack onPress={handleGoBack} />
          <View style={{ flex: 1, justifyContent: 'center', marginBottom: 40 }}>
            <View style={{ marginBottom: 40 }}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 10}}>
                <Image
                source={require('../../assets/images/icon.png')}
                style={{
                  width: 50,
                  height: 50,
                }}
              />
              <Text style={styles.title}>Login</Text>
              </View>
              
              <Text style={styles.subtitle}>
                Pronto para assumir o controle das suas finanças?
              </Text>
            </View>

            <View>
              <View>
                <View style={styles.viewInput}>
                  <Text style={styles.labelInput}>Email</Text>
                  <TextInput
                    style={[styles.input, emailFocused && styles.inputFocused]}
                    placeholder="exemplo@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </View>

                <View style={styles.viewInput}>
                  <Text style={styles.labelInput}>Senha</Text>
                  <TextInput
                    style={[
                      styles.input,
                      passwordFocused && styles.inputFocused
                    ]}
                    placeholder="******"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                </View>
              </View>
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <Text style={styles.registerText}>
                Não tem uma conta? Cadastre-se
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.light.bgWhite
  },
  iconText: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
  },
  title: {
    fontSize: 40,
    fontFamily: 'Montserrat-Bold',
    color: '#2E2E2E'
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#2E2E2E'
  },
  viewInput: {
    gap: 8
  },
  labelInput: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    marginHorizontal: 8
  },
  input: {
    height: 48,
    borderColor: Colors.light.border,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    marginBottom: 20,
    fontSize: 16
  },
  inputFocused: {
    borderColor: Colors.light.positiveBg,
    borderWidth: 2
  },
  button: {
    backgroundColor: Colors.light.primaryButtonBg,
    height: 40,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16
  },
  registerText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    marginVertical: 20,
    textAlign: 'center',
    color: '#2E2E2E'
  }
})
