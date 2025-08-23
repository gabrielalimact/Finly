import { Colors } from "@/constants/Colors"
import { useEffect, useRef, useState } from "react"
import { Dimensions, LayoutChangeEvent, ScrollView, TouchableOpacity, View } from "react-native"
import Divider from "../Divider"
import { TextStyled } from "../TextStyled"
import { styles } from "./styles"

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

type Props = {
  year: number
}
export const MonthsList = (
  { year }: Props
) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const currentYear = new Date().getFullYear()
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())

  const allItems = [year].flatMap((year) =>
    months.map((month, index) => ({
      key: `${year}-${index}`,
      label: `${month.slice(0, 3).toLowerCase()}/${year}`,
      year,
      index,
    }))
  )

  const [layoutMap, setLayoutMap] = useState<Record<string, number>>({})
  const screenWidth = Dimensions.get("window").width

  const handleScrollToCurrentMonth = (key: string) => (event: LayoutChangeEvent) => {
    const x = event.nativeEvent.layout.x
    setLayoutMap(prev => ({
      ...prev,
      [key]: x,
    }))
  }

  const handleMonthPress = (key: string) => {
    const [year, monthIndex] = key.split('-').map(Number)
    setCurrentMonth(monthIndex)
    const layoutX = layoutMap[key]
    if (layoutX !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: layoutX - screenWidth / 2 + 50, animated: true })
    }
  }

  useEffect(() => {
    if (Object.keys(layoutMap).length === allItems.length) {
      const key = `${currentYear}-${currentMonth}`
      if (scrollViewRef.current && layoutMap[key] !== undefined) {
        scrollViewRef.current.scrollTo({ x: layoutMap[key] - screenWidth / 2 + 50, animated: true })
      }
    }
  }, [layoutMap])

  return (
    <View style={styles.container}>
      <Divider />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollViewRef}
        contentContainerStyle={styles.contentContainer}
      >
        {allItems.map(({ key, label, year, index }) => (
          <TouchableOpacity
            key={key}
            onLayout={handleScrollToCurrentMonth(key)}
            style={[styles.monthItem, {
              backgroundColor: year === currentYear && index === currentMonth ? Colors.light.bgGray : 'transparent',
            }]}
            onPress={() => {
              handleMonthPress(key)
            }}
          >
            <TextStyled
              text={label}
              type="text"
              color={year === currentYear && index === currentMonth ? '#000' : '#888'}
              fontWeight={year === currentYear && index === currentMonth ? 'bold' : 'normal'}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Divider />
    </View>
  )
}

