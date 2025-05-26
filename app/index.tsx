import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function App() {
  return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Image 
            source={require("../assets/images/icon.png")}
            style={styles.icon} />
          <Text style={styles.title}>Finly</Text>
        </View>
        <Text style={styles.text}>Controle suas finanças de forma simples e rápida</Text>
        <Text style={styles.caption}>
          Gerencie suas finanças pessoais com praticidade e tenha controle total sobre seus gastos e ganhos. Simplifique sua vida financeira com o Finly!
        </Text>

        <TouchableOpacity style={styles.loginButton} onPress={() => {router.push("/auth/login")}}>
          <Text style={styles.textButton}>Faça o login</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: Colors.light.bgPrimary,
    paddingVertical: 100,
  },
  text: {
    fontSize: 50,
    fontFamily: "Montserrat-Bold",
    lineHeight: 70,

  },
  caption: {
    fontFamily: "Montserrat-Regular",
    color: Colors.light.textSecondary,
    lineHeight: 20,
    textAlign: 'justify',
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontFamily: "Montserrat",
    color: Colors.light.text,
  },
  titleView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 50,
  },
  icon: {
    width: 40,
    height: 40,
  },
  loginButton: {
    backgroundColor: Colors.light.primaryButtonBg,
    height: 40,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  textButton: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
  },
})

export default App;