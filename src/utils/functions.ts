import { Platform, PlatformOSType } from 'react-native'

import { matrices } from '../constants/conversionMatrix'
import {
  convert,
  detectColorFormat,
  hslArrayToString,
  rgbToHex,
  rgbToHsl,
} from './converters'

export function updateDeepValue(
  value:
    | { [x: string]: any; hasOwnProperty: (arg0: string) => any }
    | string
    | number,
  updateFunction: Function,
  clone: boolean = false
) {
  if (typeof value === 'string' || typeof value === 'number') {
    return updateFunction(value)
  }

  const updateObj = clone ? JSON.parse(JSON.stringify(value)) : value

  function updateCycle(obj: {
    [x: string]: any
    hasOwnProperty: (arg0: string) => any
  }) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (typeof obj[prop] === 'object') {
          updateCycle(obj[prop])
        } else {
          obj[prop] = updateFunction(obj[prop])
        }
      }
    }
  }

  updateCycle(updateObj)

  return updateObj
}

export function osColorBalance(
  colors: string | Object,
  platforms: PlatformOSType[] = ['ios'],
  balanceFunction: (arg0: any) => number[] = shiftDisplayP3toSrgb
) {
  if (!platforms.includes(Platform.OS)) {
    return colors
  }

  const updateColor = (color: string) => {
    const colorFormat = detectColorFormat(color)
    const linearRgb = convert(color).toRgb.map((c) => c / 255)
    const convertedColor = balanceFunction(linearRgb).map((c) => c * 255)
    return rgbArrayToStringFormat(convertedColor, colorFormat)
  }

  if (typeof colors === 'string') {
    return updateColor(colors)
  }

  if (typeof colors === 'object') {
    const updatedColors = updateDeepValue(colors, (color: string) =>
      updateColor(color)
    )
    return updatedColors
  }
}

export function rgbArrayToStringFormat(
  rgb: number[],
  format: 'rgb' | 'hsl' | 'hex' = 'rgb'
) {
  const [r, g, b] = rgb
  switch (format) {
    case 'rgb':
      return `rgb(${r}, ${g}, ${b})`
    case 'hsl':
      const hsl = rgbToHsl([r, g, b])
      const hslString = hslArrayToString(hsl)
      return hslString
    case 'hex':
      const hex = rgbToHex([r, g, b])
      return hex
  }
}

export function colorSpaceTransform(
  linearRgb: number[],
  conversionMatrix: number[][]
) {
  const [r, g, b] = linearRgb
  return conversionMatrix.map(
    (row: number[]) => row[0] * r + row[1] * g + row[2] * b
  )
}

export function shiftDisplayP3toSrgb(linearRgb: number[]) {
  return colorSpaceTransform(linearRgb, matrices.displayP3.srgb)
}

export function osBalanceColors(
  colors: object
  // platform: PlatformOSType,
  // balanceMatrix?: [[number], [number], [number]]
) {
  updateDeepValue(colors, osColorBalance)
}
