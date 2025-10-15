import { Card } from "@/components/Card"
import { TextStyled } from "@/components/TextStyled"
import { Colors } from "@/constants/Colors"
import { FontAwesome5 } from "@expo/vector-icons"
import { View } from "react-native"

type CardsBalance = {
  title: string
  amount: string
  isPositive: boolean
}

const CardsBalance = ({
  title,
  amount,
  isPositive
}: CardsBalance) => {
  return (
    <Card style={{
      flex: 1,
      gap: 10,
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      <View style={{
        backgroundColor: isPositive ? Colors.light.positiveText + '20' : Colors.light.negativeText + '20',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8
      }}>
        <FontAwesome5 name="dollar-sign" size={24} color={isPositive ? Colors.light.positiveText : Colors.light.negativeText} />
      </View>
      <View>
        <TextStyled text={title} type='caption' color={Colors.light.textSecondary} />
        <TextStyled fontWeight='bold' text={amount} color={Colors.light.text} />
      </View>
    </Card>
  )
}
         
export { CardsBalance }
