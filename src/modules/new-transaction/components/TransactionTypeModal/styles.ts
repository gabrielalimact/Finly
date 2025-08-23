import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: Colors.light.bgPrimary,
    padding: 20,
    borderRadius: 10,
  },
  buttonPositive: {
    padding: 10,
    backgroundColor: Colors.light.primaryButtonBg,
    borderRadius: 30,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: "black",
  },
  buttonNegative: {
    padding: 10,
    backgroundColor: Colors.light.negativeBg,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "black",
  },
})