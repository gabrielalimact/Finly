import { Colors } from '@/constants/Colors'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.bgGray,
    padding: 8,
    borderRadius: 6,
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 4,
  },
  transactionsList: {
    gap: 0,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
})
