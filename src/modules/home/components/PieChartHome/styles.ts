import { Colors } from '@/constants/Colors'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  chartContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  positiveText: {
    color: Colors.light.positiveText
  },
  negativeText: {
    color: Colors.light.negativeBg
  },
  text: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18
  }
})
