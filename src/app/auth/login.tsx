import IconBack from '@/components/IconBack/IconBack'
import { Input } from '@/components/Inputs/Input'
import { InputPassword } from '@/components/Inputs/InputPassword'
import { Colors } from '@/constants/Colors'
import { useUserContext } from '@/contexts'
import { login } from '@/services/auth-service'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Login() {
  const router = useRouter()
  const { setUser } = useUserContext()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin() {
    if (!username || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    try {
      await login(username, password).then((res) => {
        setUser({
          id: res.user.id,
          username: res.user.username,
          name: res.user.nome,
          email: res.user.email
        });
        router.replace('/(tabs)');
      });
    } catch (error: any) {
      let errorMessage = 'Falha ao fazer login. Tente novamente.';
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }

  }

  function handleGoBack() {
    router.back()
  }

  const handleChangeUsername = (text: string) => {
    setUsername(text)
  }

  const handleChangePassword = (text: string) => {
    setPassword(text)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            <IconBack onPress={handleGoBack} />
            <View style={{ flex: 1, justifyContent: 'center', marginBottom: 40 }}>
              <View style={{ marginBottom: 40 }}>
                <View style={{ alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Image
                    source={require('../../assets/images/img3.png')}
                    style={{
                      width: 150,
                      height: 150,
                    }}
                  />
                  <Text style={styles.title}>Login</Text>
                </View>

                <Text style={styles.subtitle}>
                  Pronto para assumir o controle das suas finanças?
                </Text>
              </View>

              <View style={styles.viewInput}>
                <Input 
                  label='Username' 
                  id='username-input' 
                  placeholder='digite seu nome de usuário' 
                  type='text' 
                  value={username}
                  onChange={handleChangeUsername}
                />
                <InputPassword 
                  label='Senha' 
                  id='password-input' 
                  placeholder='digite sua senha'
                  value={password}
                  onChange={handleChangePassword} 
                />
                <TouchableOpacity 
                  style={[styles.button, isLoading && styles.buttonDisabled]} 
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => router.push('/auth/register')}>
                <Text style={styles.registerText}>
                  Não tem uma conta? Cadastre-se
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: Colors.light.bgPrimary
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
    gap: 16
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
    borderColor: Colors.light.green,
    borderWidth: 2
  },
  button: {
    backgroundColor: Colors.light.green,
    height: 40,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.black
  },
  buttonDisabled: {
    backgroundColor: Colors.light.bgGray,
    opacity: 0.6
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
