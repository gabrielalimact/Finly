import Button from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const user = {
    name: 'Gabriela',
    saldo: 1000,
  }
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={{ marginBottom: 40 }}>
          <Text style={styles.title}>Olá, {user.name}</Text>
          <Text style={styles.subtitle}>Seu saldo é de R$ {user.saldo}</Text>
        </View>

        <Button
          label="Ver transações"
          onPress={() => console.log('Ver transações')}
          disabled={false}
          loading={false}
          variant="primary"
          size="medium"
        ></Button>

                <Button
          label="Ver transações"
          onPress={() => console.log('Ver transações')}
          disabled={false}
          loading={false}
          variant="secondary"
          size="medium"
        ></Button>

                <Button
          label="Ver transações"
          onPress={() => console.log('Ver transações')}
          disabled={false}
          loading={false}
          variant="tertiary"
          size="medium"
        ></Button>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.bgWhite,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
