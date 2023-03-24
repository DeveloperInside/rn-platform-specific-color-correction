import { Platform, PlatformOSType } from 'react-native'

import { DISPLAYP3_SRGB_ADAPTED } from '../constants/conversionMatrix'
import {
  convert,
  detectColorFormat,
  hslArrayToString,
  rgbToHex,
  rgbToHsl,
} from './converters'

export function updateDeepValue(
  obj: { [x: string]: any; hasOwnProperty: (arg0: string) => any },
  updateFunction: Function
) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (typeof obj[prop] === 'object') {
        updateDeepValue(obj[prop], updateFunction)
      } else {
        obj[prop] = updateFunction(obj[prop])
      }
    }
  }
}

export function osColorBalance(
  color: string,
  platform: PlatformOSType = 'ios',
  balanceMatrix?: [[number], [number], [number]]
) {
  if (Platform.OS !== platform) {
    return color
  }
  const colorFormat = detectColorFormat(color)
  let [r, g, b]: number[] = convert(color).toRgb.map((rgb) => rgb / 255)

  const conversionMatrix = balanceMatrix
    ? balanceMatrix
    : DISPLAYP3_SRGB_ADAPTED

  ;[r, g, b] = conversionMatrix.map(
    (row: number[]) => row[0] * r + row[1] * g + row[2] * b
  )
  ;[r, g, b] = [r, g, b].map((rgb) =>
    Math.min(Math.max(Math.round(rgb * 255), 0), 255)
  )

  switch (colorFormat) {
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

export function osBalanceColors(
  colors: object
  // platform: PlatformOSType,
  // balanceMatrix?: [[number], [number], [number]]
) {
  updateDeepValue(colors, osColorBalance)
}
