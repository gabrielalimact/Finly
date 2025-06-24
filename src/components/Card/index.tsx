import { Colors } from "@/constants/Colors"
import { LinearGradient } from "expo-linear-gradient"
type CardProps = {
  children?: React.ReactNode
  style?: React.CSSProperties
}
export const Card = (
  { children }: CardProps
) => {
  return (
    <LinearGradient
      colors={[Colors.light.infoCardBg, "#ff00e9"]}
      start={{ x: 0.7, y: 0.9 }}
      end={{ x: 2, y: -0.9 }}
      style={{ padding: 16, borderRadius: 8, backgroundColor: Colors.light.shadow, shadowColor: Colors.light.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}
    >
      {children}
    </LinearGradient>
  )
}