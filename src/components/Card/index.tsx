import { View, ViewStyle } from "react-native"
import { styles } from "./styles"
type CardProps = {
  children?: React.ReactNode
  style?: ViewStyle
}
export const Card = (
  { children, style }: CardProps

) => {
  return (
    <View style={[styles.cardContainer, style]}>
      {children}
    </View>
  )
}