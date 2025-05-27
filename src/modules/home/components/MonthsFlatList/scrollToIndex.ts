import React from 'react'
import { FlatList } from 'react-native'

export const scrollToSelectedIndex = (
  index: number,
  flatListRef: React.RefObject<FlatList<any> | null>
) => {
  if (flatListRef.current && index >= 0) {
    flatListRef.current.scrollToIndex({
      index: index,
      animated: true,
      viewPosition: 0.5 // centralizado
    })
  }
}
