/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native'

import { osBalanceColors, osColorBalance } from '../utils/functions'

const colorMap = {
  0: 'rgb(128, 128, 128)',
  1: 'rgb(128, 205, 128)',
  2: 'rgb(99, 208, 119)',
  3: 'rgb(217, 38, 38)',
  4: 'rgb(204, 51, 51)',
  5: 'rgb(191, 64, 64)',
  6: 'rgb(179, 77, 77)',
  7: 'rgb(166, 89, 89)',
  8: 'rgb(153, 102, 102)',
  9: 'rgb(140, 115, 115)',
  10: 'rgb(128, 128, 128)',
  11: 'rgb(255, 0, 0)',
}

const ColorGrid = () => {

  // const conversionTest = osColorBalance('rgb(128, 205, 128)')

  // console.log('conversionTest: ', conversionTest)

  osBalanceColors(colorMap)
  // console.log('converted colorMap: ', colorMap)

  const renderItem = ({ item }: { item: string }) => {
    return (
      <View style={[styles.grid, { backgroundColor: item }]}>
        <Text>{item}</Text>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <FlatList
        numColumns={2}
        data={Object.values(colorMap)}
        renderItem={renderItem}
      />
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
