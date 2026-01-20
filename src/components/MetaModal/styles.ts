import { Colors } from '@/constants/Colors';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  modalBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.85,
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 24,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fee2e2', // light red background
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.bgGray,
  },
  formContainer: {
    gap: 10,
    marginBottom: 24,
  },
  selectContainer: {
  },
  selectLabel: {
    color: Colors.light.text,
    marginBottom: 8, 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.light.bgGray,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.light.green,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: Colors.light.textSecondary,
    opacity: 0.7,
  },
  customSelectWrapper: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    backgroundColor: Colors.light.bgWhite,
  },
  customSelectButton: {
    padding: 16,
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  selectedOption: {
    backgroundColor: Colors.light.bgGray,
  },
  selectorOption: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'space-between',
  },
  selectorModal: {
    backgroundColor: Colors.light.bgWhite,
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
});
