/* eslint-disable prettier/prettier */
import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'

import { osColorBalance } from '../utils/functions'

const colorMap = [
  'rgb(128, 205, 128)',
  'rgb(99, 208, 119)',
  'rgb(217, 38, 38)',
  'rgb(204, 51, 51)',
  'rgb(191, 64, 64)',
  'rgb(179, 77, 77)',
  'rgb(166, 89, 89)',
  'rgb(153, 102, 102)',
  'rgb(140, 115, 115)',
  'rgb(128, 128, 128)',
  'rgb(255, 0, 0)',
  'rgb(128, 128, 128)',

]

const colorTexts = [
  'rgb(128, 205, 128)',
  'rgb(99, 208, 119)',
  'rgb(217, 38, 38)',
  'rgb(204, 51, 51)',
  'rgb(191, 64, 64)',
  'rgb(179, 77, 77)',
  'rgb(166, 89, 89)',
  'rgb(153, 102, 102)',
  'rgb(140, 115, 115)',
  'rgb(128, 128, 128)',
  'rgb(255, 0, 0)',
  'rgb(128, 128, 128)',
]

const colors = [
  'rgb(255, 0, 0)',
  'rgb(255, 154, 0)',
  'rgb(208, 222, 33)',
  'rgb(79, 220, 74)',
  'rgb(63, 218, 216)',
  'rgb(47, 201, 226)',
  'rgb(28, 127, 238)',
  'rgb(95, 21, 242)',
  'rgb(186, 12, 248)',
  'rgb(251, 7, 217)',
]

const ColorGrid = () => {
  osColorBalance(colorMap)
  const renderItem = ({ item, index }: { item: string; index: number }) => {
    return (
      <View style={[styles.grid, { backgroundColor: item }]}>
        <Text>{item}</Text>
        <Text>{colorTexts[index]}</Text>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={[styles.grid, { backgroundColor: colorTexts[0] }]}>
        <Text>{colorTexts[0]}</Text>
      </View>
      <View style={[styles.grid, { backgroundColor: colorTexts[1] }]}>
        <Text>{colorTexts[1]}</Text>
      </View>
      <FlatList numColumns={2} data={colorMap} renderItem={renderItem} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexGrow: 1,
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
})

export default ColorGrid
