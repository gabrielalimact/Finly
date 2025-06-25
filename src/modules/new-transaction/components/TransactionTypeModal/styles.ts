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
    backgroundColor: Colors.light.positiveBg,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonNegative: {
    padding: 10,
    backgroundColor: Colors.light.negativeBg,
    borderRadius: 5,
  },
})