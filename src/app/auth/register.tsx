import IconBack from '@/components/IconBack/IconBack'
import { Input } from '@/components/Inputs/Input'
import { InputPassword } from '@/components/Inputs/InputPassword'
import { Colors } from '@/constants/Colors'
import { useUserContext } from '@/contexts'
import { register } from '@/services/usuario-services'
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

export default function Register() {
  const router = useRouter()
  const { setUser } = useUserContext()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [nameFocused, setNameFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleRegister() {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, username, email, password).then(() => {
        Alert.alert(
        'Sucesso', 
        'Conta criada com sucesso! Agora você pode fazer login.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/auth/login')
          }
        ]
      );
      });
      
    } catch (error: any) {
      let errorMessage = 'Falha ao criar conta. Tente novamente.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoBack() {
    router.back()
  }

  const handleChangeName = (text: string) => {
    setName(text)
  }

  const handleChangeUsername = (text: string) => {
    setUsername(text)
  }

  const handleChangeEmail = (text: string) => {
    setEmail(text)
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
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <View style={{ marginBottom: 40 }}>
                <View style={{ alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Image
                    source={require('../../assets/images/img1.png')}
                    style={{
                      width: 150,
                      height: 150,
                    }}
                  />
                  <Text style={styles.title}>Cadastro</Text>
                </View>

                <Text style={styles.subtitle}>
                  Cadastre-se e explore todas as ferramentas para assumir o controle das suas finanças.
                </Text>
              </View>

              <View style={styles.viewInput}>
                <Input 
                  label='Nome' 
                  placeholder='Digite seu nome completo'
                  id='name-input' 
                  type='text'
                  value={name}
                  onChange={handleChangeName}
                />
                <Input 
                  label='Nome de Usuário' 
                  placeholder='Escolha um nome de usuário'
                  id='username-input' 
                  type='text'
                  value={username}
                  onChange={handleChangeUsername}
                />
                <Input 
                  label='Email' 
                  placeholder='Digite seu email'
                  id='email-input' 
                  type='email'
                  value={email}
                  onChange={handleChangeEmail}
                />
                <InputPassword 
                  label='Senha' 
                  id='password-input'
                  value={password}
                  onChange={handleChangePassword}
                />
                <TouchableOpacity 
                  style={[styles.button, isLoading && styles.buttonDisabled]} 
                  onPress={handleRegister}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Criando conta...' : 'Concluir'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={styles.registerText}>
                  Já tem uma conta? Faça login
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
