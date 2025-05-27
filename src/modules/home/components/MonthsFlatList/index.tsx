import { useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { scrollToSelectedIndex } from './scrollToIndex'
import { styles } from './styles'

const ITEM_WIDTH = 60
const MARGIN_RIGHT = 10
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + MARGIN_RIGHT

interface Month {
  key: string
  name: string
}

const months: Month[] = [
  { key: '1', name: 'Janeiro' },
  { key: '2', name: 'Fevereiro' },
  { key: '3', name: 'Março' },
  { key: '4', name: 'Abril' },
  { key: '5', name: 'Maio' },
  { key: '6', name: 'Junho' },
  { key: '7', name: 'Julho' },
  { key: '8', name: 'Agosto' },
  { key: '9', name: 'Setembro' },
  { key: '10', name: 'Outubro' },
  { key: '11', name: 'Novembro' },
  { key: '12', name: 'Dezembro' }
]
const MonthsFlatList = () => {
  const flatListRef = useRef<FlatList<Month>>(null)
  const currentMonth = new Date().getMonth() + 1
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString())

  const renderItem = ({ item }: ListRenderItemInfo<Month>) => {
    const isSelected = item.key === selectedMonth
    return (
      <TouchableOpacity
        style={[styles.monthButton, isSelected && styles.selectedMonthButton]}
        onPress={() => handleMonthPress(item.key)}
        key={item.key}
      >
        <Text style={[styles.text]}>{item.name.slice(0, 3)}</Text>
      </TouchableOpacity>
    )
  }

  useEffect(() => {
    const selectedIndex = months.findIndex(
      (month) => month.key === selectedMonth
    )
    scrollToSelectedIndex(selectedIndex, flatListRef)
  }, [selectedMonth])

  useEffect(() => {
    const selectedIndex = months.findIndex(
      (month) => month.key === selectedMonth
    )
    setTimeout(() => scrollToSelectedIndex(selectedIndex, flatListRef), 100)
  }, [])

  const handleMonthPress = (monthKey: string) => {
    setSelectedMonth(monthKey)
  }

  const getItemLayout = (data: any, index: number) => ({
    length: TOTAL_ITEM_WIDTH,
    offset: TOTAL_ITEM_WIDTH * index,
    index
  })

  const { width: screenWidth } = Dimensions.get('window')
  const PADDING_HORIZONTAL = screenWidth / 2.5 - TOTAL_ITEM_WIDTH

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        extraData={selectedMonth}
        data={months}
        keyExtractor={(item) => item.key}
        getItemLayout={getItemLayout}
        initialScrollIndex={months.findIndex(
          (month) => month.key === selectedMonth
        )}
        contentContainerStyle={{ paddingHorizontal: PADDING_HORIZONTAL }}
      />
    </View>
  )
}

export default MonthsFlatList
