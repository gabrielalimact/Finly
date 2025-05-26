// SplashScreen.js
import { Colors } from "@/constants/Colors";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

const Logo = require("@/assets/images/icon.png");

interface Props {
  absolute?: boolean;
}
export function SplashScreen({ absolute }: Props) {
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.image} />
      <ActivityIndicator style={styles.spinner} size="large" color="#FDBD1A" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.bgWhite,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 20,
  },
  spinner: {
    position: "absolute",
    bottom: 100,
  },
});

export default SplashScreen;
