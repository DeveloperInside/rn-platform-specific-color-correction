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

/**
 * Applies the sRGB transfer function to the given linear RGB values.
 * @param linearRgb The linear RGB values to transform.
 * @returns The sRGB values.
 */
export function sRgbTransferFunc(linearRgb: number[]): number[] {
  const sRgbGamma = 2.4
  const sRgbThreshold = 0.04045
  return linearRgb.map((c) =>
    c <= sRgbThreshold ? c / 12.92 : Math.pow((c + 0.055) / 1.055, sRgbGamma)
  )
}

/**
 * Applies the inverse sRGB transfer function to the given sRGB values.
 * @param sRgb The sRGB values to transform.
 * @returns The linear RGB values.
 */
export function sRgbTransferFuncReverse(sRgb: number[]): number[] {
  const sRgbGamma = 2.4
  const sRgbThreshold = 0.0031308
  return sRgb.map((c) =>
    c <= sRgbThreshold
      ? 12.92 * c
      : (1 + 0.055) * Math.pow(c, 1 / sRgbGamma) - 0.055
  )
}

/**
 * Converts a color from the Display P3 color space to the sRGB color space
 * @param linearRgb The color to convert in linear RGB format
 * @returns The converted color in sRGB format
 */
export function shiftDisplayP3toSrgb(linearRgb: number[]) {
  // Gamma correction
  linearRgb = sRgbTransferFunc(linearRgb)
  // Convert P3 color space to sRGB color space
  linearRgb = applyColorConversionMatrix(
    linearRgb,
    DISPLAYP3_50_SRGB_50_ADAPTED
  )
  // Apply reverse gamma correction
  linearRgb = sRgbTransferFuncReverse(linearRgb)

  return linearRgb
}

/**
 * Converts a color from the sRGB color space to the Display P3 color space
 * @param linearRgb The color to convert in linear RGB format
 * @returns The converted color in Display P3 format
 */
export function shiftSrgbToDisplayP3(linearRgb: number[]) {
  // Apply reverse gamma correction
  linearRgb = sRgbTransferFuncReverse(linearRgb)
  // Convert P3 color space to sRGB color space
  linearRgb = applyColorConversionMatrix(
    linearRgb,
    SRGB_50_DISPLAYP3_50_ADAPTED
  )
  // Gamma correction
  linearRgb = sRgbTransferFunc(linearRgb)

  return linearRgb
}

/**
 * Applies a color conversion matrix to a linear RGB color to transform it to another color space.
 *
 * @param linearRgb An array of linear RGB values to transform.
 * @param conversionMatrix The conversion matrix to apply to the linear RGB color.
 * @returns An array of transformed color values.
 */
export function applyColorConversionMatrix(
  linearRgb: number[],
  conversionMatrix: number[][]
) {
  const [r, g, b] = linearRgb
  return conversionMatrix.map(
    (row: number[]) => row[0] * r + row[1] * g + row[2] * b
  )
}
