import { Colors } from '@/constants/Colors'
import { View } from 'react-native'

const Divider = () => {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: Colors.light.border,
        marginVertical: 8
      }}
    />
  )
}

export default Divider
