import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
    borderRadius: 12,
    borderColor: Colors.light.border,
    borderWidth: 1,
    backgroundColor: Colors.light.bgPrimary,
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  }
})