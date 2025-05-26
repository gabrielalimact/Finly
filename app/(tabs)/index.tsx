import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const imagePeople = require("@/assets/images/people.png");

export default function HomeScreen() {
  const user = {
    name: 'Gabriela',
    saldo: 1000,
  }
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.userInfosView}>
            <Image source={imagePeople} style={styles.userImage}/>
            <Text>Olá, {user.name}</Text>
          </View>

          <View style={styles.iconsView}>
            <IconSymbol name='magnifyingglass' size={24} color={Colors.light.icon}/>
            <IconSymbol name='line.3.horizontal' size={24} color={Colors.light.icon}/>
          </View>
        </View>


        
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.infoCardBg,
    // Box shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Box shadow for Android
    elevation: 4,
    borderRadius: 12,
    // padding: 12,
  },
  iconsView: {
    flexDirection: 'row',
    gap: 8,
  },
  userInfosView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  userImage: {
    width: 50,
    height: 50,
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
  }
});
