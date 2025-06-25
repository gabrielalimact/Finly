import { LinearGradient } from "expo-linear-gradient"
import { styles } from "./styles"
type CardProps = {
  children?: React.ReactNode
  style?: React.CSSProperties
}
export const Card = (
  { children }: CardProps
) => {
  return (
    <LinearGradient
      colors={['#ffffff', 'rgba(87,199,133,1)']}
      start={{ x: 1.5, y: 1 }}
      end={{ x: 0.4, y: 0.5 }}
      style={styles.cardContainer}
    >
      {children}
    </LinearGradient >
  )
}