import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  cardContainer: {
    padding: 10,
    borderRadius: 8,
    borderColor: Colors.light.border,
    borderWidth: 1.5,
    backgroundColor: Colors.light.bgWhite,
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