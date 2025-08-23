import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectBox: {
    padding: 12,
    height: 48,
    borderColor: Colors.light.border,
    borderWidth: 1,
    borderRadius: 16,
    fontSize: 16
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: 250,
    borderRadius: 8,
    padding: 8,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});