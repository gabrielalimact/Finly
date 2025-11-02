import { Colors } from '@/constants/Colors'
import { Dimensions, StyleSheet } from 'react-native'

const { height } = Dimensions.get('window')

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: Colors.light.bgWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.light.bgGray,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
  },
  transactionsList: {
    gap: 0,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
})
