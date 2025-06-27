import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.bgPrimary,
  },
  form: {
    padding: 20,
    gap: 20,
  },
  viewInput: {
    gap: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelColumn: {
    width: '15%',
  },
  inputColumn: {
    width: '85%',
    flexDirection: 'row',
  },

});
