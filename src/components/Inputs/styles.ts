import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  viewInput: {
    gap: 8,
  },
  labelInput: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    marginHorizontal: 8
  },
  input: {
    height: 48,
    borderColor: Colors.light.border,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: Colors.light.positiveBg,
    borderWidth: 2
  },
});