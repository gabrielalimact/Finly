import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  cardContainer: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: Colors.light.shadow,
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2

  }
})