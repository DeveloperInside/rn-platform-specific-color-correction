import { Platform, PlatformOSType } from 'react-native'

import {
  DISPLAYP3_50_SRGB_50_ADAPTED,
  SRGB_50_DISPLAYP3_50_ADAPTED,
} from '../constants/conversionMatrix'
import {
  convert,
  detectColorFormat,
  linearTo8bit,
  rgbArrayToStringFormat,
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

/**
 * Updates a color by converting it from its original format to lineaar RGB, applying a
 * transform function, and then converting it back to the original format.
 *
 * @param color - string -> 'rgb(255,255,255)', 'hsl(359, 100%, 50%)', '#ff0000'
 * @param transformFunc - A function that accepts an array of RGB values and
 *                          returns an array of modified RGB values. -> [1, 1, 1]
 * @returns The updated color, in the same format as the input color.
 */
export const transformColor = (
  color: string,
  transformFunc: (arg0: any) => number[]
) => {
  const colorFormat = detectColorFormat(color)
  const linearRgb = convert(color).toRgb.map((c) => c / 255)
  const convertedColor = transformFunc(linearRgb)
  const rgb8bit = linearTo8bit(convertedColor)

  return rgbArrayToStringFormat(rgb8bit, colorFormat)
}

interface osColorBalanceOptions {
  platforms?: PlatformOSType[]
  balanceFunc?: (arg0: any) => number[]
  clone?: boolean
}

export function osColorBalance(
  colors: string | Object,
  options: osColorBalanceOptions = {}
) {
  const {
    platforms = ['ios'],
    balanceFunc = shiftDisplayP3toSrgb,
    clone = false,
  } = options

  if (!platforms.includes(Platform.OS)) {
    return colors
  }

  const updatedColors = updateDeepValue(
    colors,
    (color: string) => transformColor(color, balanceFunc),
    clone
  )

  return updatedColors
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

export function gammaCorrection22(linearRgb: number[]) {
  //Display P3 transfer function gamma correction
  const GAMMA = 2.2
  return linearRgb.map((c) => Math.pow(c, GAMMA))
}

export function sRgbTransferFunc(linearRgb: number[]) {
  const GAMMA = 2.4
  return linearRgb.map((c) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, GAMMA)
  )
}

export function sRgbTransferFuncReverse(linearRgb: number[]) {
  const GAMMA = 2.4
  return linearRgb.map((c) =>
    c <= 0.0031308 ? 12.92 * c : (1 + 0.055) * Math.pow(c, 1 / GAMMA) - 0.055
  )
}

export function shiftDisplayP3toSrgb(linearRgb: number[]) {
  let color = linearRgb
  // Gamma correction
  color = sRgbTransferFunc(color)
  // Convert P3 color space to sRGB color space
  color = colorSpaceTransform(color, DISPLAYP3_50_SRGB_50_ADAPTED)
  // Apply reverse gamma correction
  color = sRgbTransferFuncReverse(color)

  return color
}

export function shiftSrgbToDisplayP3(linearRgb: number[]) {
  let color = linearRgb
  // Apply reverse gamma correction
  color = sRgbTransferFuncReverse(color)
  // Convert P3 color space to sRGB color space
  color = colorSpaceTransform(color, SRGB_50_DISPLAYP3_50_ADAPTED)
  // Gamma correction
  color = sRgbTransferFunc(color)

  return color
}
