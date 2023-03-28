import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'

import { osColorBalance } from '../utils/functions'

const colorMap = [
  'rgb(155, 34, 38)',
  'rgb(174, 32, 18)',
  'rgb(187, 62, 3)',
  'rgb(202, 103, 2)',
  'rgb(238, 155, 0)',
  'rgb(233, 216, 166)',
  'rgb(148, 210, 189)',
  'rgb(10, 147, 150)',
  'rgb(0, 95, 115)',
  'rgb(0, 18, 25)',
]

const ColorGrid = () => {
  const convertedColors = osColorBalance(colorMap, { clone: true })
  console.log(convertedColors)

  const renderItem = ({ item }: { item: string; index: number }) => {
    return (
      <View style={[styles.grid, { backgroundColor: item }]}>
        <Text>{item}</Text>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <FlatList numColumns={1} data={colorMap} renderItem={renderItem} />
      <FlatList numColumns={1} data={convertedColors} renderItem={renderItem} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  grid: {
    flexGrow: 1,
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 6,
  },
})

export default ColorGrid
