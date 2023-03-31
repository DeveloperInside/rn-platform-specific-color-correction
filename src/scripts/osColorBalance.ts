import { Platform, PlatformOSType } from 'react-native'

import { shiftDisplayP3toSrgb, transformColor } from './functions'
import { updateDeepValue } from './utils'

interface OsColorBalanceOptions {
  platforms?: PlatformOSType[]
  balanceFunc?: (arg0: any) => number[]
  clone?: boolean
}

/**
 * Applies a color balance function to the specified colors based on the current platform.
 *
 * @typedef {string} ColorString - A color string in the format of 'rgb(255, 255, 255)', 'hsl(359, 100%, 50%)', or a six-digit hex value.
 *
 * @param colors - The colors to apply the color balance to. The colors can be specified as:
 * - A single color string in the format of 'rgb(255, 255, 255)', 'hsl(359, 100%, 50%)', or a six-digit hex value.
 * - An object with nested values, where the final value must be a color string.
 * - An array of color strings or objects with nested values, where the final value of each object must be a color string.
 *
 * @param {osColorBalanceOptions} [options={}] - An optional object containing options for the color balance.
 * @param {PlatformOSType[]} [options.platforms=['ios']] - An optional array of platform names to apply the color balance to.
 * @param {(arg0: any) => number[]} [options.balanceFunc=shiftDisplayP3toSrgb] - An optional color balance function to use.
 * @param {boolean} [options.clone=false] - An optional boolean indicating whether to clone the input colors before applying the color balance.
 *
 * @example
 *
 * // Example 1: Applying color balance to a single color string
 * const color = osColorBalance('rgb(113, 36, 161)');
 *
 * // Example 2: Applying color balance to an object with nested values
 * const colorsObj = {
 *   primary: 'rgb(0, 128, 0)',
 *   secondary: {
 *     light: 'hsl(359, 26%, 67%)',
 *     dark: 'hsl(206, 100%, 10%)'
 *   }
 * };
 *
 * osColorBalance(colorsObj); // It will update original colorsObj. You can initialize it once.
 *
 * // Example 3: Applying color balance to an array of color strings and objects with nested values
 * const colorsArr = [
 *   'rgb(43, 114, 164)',
 *   {
 *     light: 'hsl(275, 48%, 36%)',
 *     dark: 'hsl(136, 35%, 54%)'
 *   },
 *   '#1d781d'
 * ];
 *
 * // deep copy the original object
 * const updatedColorsArr = osColorBalance(colorsArr, {
 *   platforms: ['android', 'web'],
 *   balanceFunc: shiftSrgbToDisplayP3,
 *   clone: true
 * });
 */

function osColorBalance(
  colors: string | { [x: string]: any; hasOwnProperty: (arg0: string) => any },
  options: OsColorBalanceOptions = {}
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

export default osColorBalance
