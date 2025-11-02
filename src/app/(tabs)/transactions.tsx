import { TextStyled } from '@/components/TextStyled';
import { Colors } from '@/constants/Colors';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionsScreen() {
  return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TextStyled
              text="Transações"
              type="title"
              fontWeight="bold"
              color={Colors.light.black}
            />
          </View>
          
          <View style={styles.content}>
            <TextStyled
              text="Lista de transações aparecerá aqui"
              color={Colors.light.textSecondary}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.bgPrimary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});