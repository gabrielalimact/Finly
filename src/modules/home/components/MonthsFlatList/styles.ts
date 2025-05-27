import { Colors } from '@/constants/Colors'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.bgGray,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingVertical: 10
  },
  monthButton: {
    marginRight: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    width: 50,
    alignItems: 'center'
  },
  selectedMonthButton: {
    backgroundColor: Colors.light.warningBg
  },
  text: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12
  }
})
