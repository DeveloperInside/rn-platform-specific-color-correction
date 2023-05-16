import { Platform } from 'react-native'

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null
}
export function rgb2hex(r: number, g: number, b: number): string {
  const hex =
    '#' +
    [r, g, b]
      .map((x) =>
        Math.round(x * 255)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  return hex
}

export function rgbToHex(rgb: any[]) {
  return (
    '#' +
    rgb
      .map((x) => {
        const hex = x.toString(16)

        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

export function HSLToHexOld(hsl: { h: number; s: number; l: number }): string {
  const { h, s, l } = hsl

  const hDecimal = l / 100
  const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)

    // Convert to Hex and prefix with "0" if required
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}
export function rgbToStyle(c: number[]) {
  return `rgb(${c[0] * 255},${c[1] * 255},${c[2] * 255})`
}

export function hsl2rgb(h: number, s: number, l: number): number[] {
  let a = s * Math.min(l, 1 - l)
  let f = (n: number, k = (n + h / 30) % 12) =>
    l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
  return [f(0), f(8), f(4)]
}

export function hsl2hex(h: number, s: number, l: number): string {
  const [r, g, b] = hsl2rgb(h, s, l)
  const hex = rgb2hex(r, g, b)
  return hex
}

export function hsl2rgb_wiki(h: number, s: number, l: number): number[] {
  let c = (1 - Math.abs(2 * l - 1)) * s
  let k = h / 60
  let x = c * (1 - Math.abs((k % 2) - 1))

  let r1 = 0,
    g1 = 0,
    b1 = 0

  if (k >= 0 && k <= 1) {
    r1 = c
    g1 = x
  }
  if (k > 1 && k <= 2) {
    r1 = x
    g1 = c
  }
  if (k > 2 && k <= 3) {
    g1 = c
    b1 = x
  }
  if (k > 3 && k <= 4) {
    g1 = x
    b1 = c
  }
  if (k > 4 && k <= 5) {
    r1 = x
    b1 = c
  }
  if (k > 5 && k <= 6) {
    r1 = c
    b1 = x
  }

  let m = l - c / 2

  return [r1 + m, g1 + m, b1 + m]
}

export function hslToHex(h: number, s: number, l: number): string {
  // Convert HSL values to RGB values
  s = s / 100
  l = l / 100
  console.log('hslToHex:', h, s, l)
  let r, g, b
  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  // Convert RGB values to HEX string
  const toHex = (num: number) =>
    Math.round(num * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  if (!result) {
    throw new Error('Could not parse Hex Color')
  }

  const rHex = parseInt(result[1], 16)
  const gHex = parseInt(result[2], 16)
  const bHex = parseInt(result[3], 16)

  const r = rHex / 255
  const g = gHex / 255
  const b = bHex / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  let h = (max + min) / 2
  let s = h
  let l = h

  if (max === min) {
    // Achromatic
    return { h: 0, s: 0, l }
  }

  const d = max - min
  s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0)
      break
    case g:
      h = (b - r) / d + 2
      break
    case b:
      h = (r - g) / d + 4
      break
  }
  h /= 6

  // s = s * 100
  // s = Math.round(s)
  // l = l * 100
  // l = Math.round(l)
  h = Math.round(360 * h)

  return { h, s, l }
}

export function hslToRgb(h: number, s: number, l: number): string {
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  r = Math.round(r * 255)
  g = Math.round(g * 255)
  b = Math.round(b * 255)

  return `rgb(${r}, ${g}, ${b}`
  // return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

export function rgbStringToArray(rgbString: string) {
  const result = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)

  return result
    ? [
        parseInt(result[1], 10),
        parseInt(result[2], 10),
        parseInt(result[3], 10),
      ]
    : null
}

const linearInterpolate = (before: number, after: number, atPoint: number) => {
  return before + (after - before) * atPoint
}

export function increaseSaturation(col: any, saturation = 0, lightness = 0) {
  let color
  if (typeof col === 'string') {
    color = rgbStringToArray(col)
  } else {
    color = col
  }

  const r = color[0] / 255
  const g = color[1] / 255
  const b = color[2] / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  // s = s * (1 + saturation / 100);
  // s = s + saturation;

  if (s > 1) {
    s = 1
  }

  h = linearInterpolate(0, 359.9, h)

  s = linearInterpolate(0, 100, s)
  s = s + saturation
  l = linearInterpolate(0, 100, l)
  l = l + lightness
  console.log([h, s, l])

  return `hsl(${h},${s}%,${l}%)`
  // return [h, s, l];
}
export const toHSLObject = (hslStr: string) => {
  let numbers = hslStr?.match(/\d+/g)?.map(Number)
  if (!numbers) {
    numbers = [0, 0, 0]
  }
  const [h, s, l] = [...numbers]
  return { h, s, l }
}

// export interface colors {}
export interface StringMap {
  [key: string]: string
}

export function hslCorrection([h, s, l]: [number, number, number]) {
  const all = h + s + l
  return all
}

export function colorCorrection(
  color: string,
  saturation: number,
  lightness: number
): string {
  const colorFormat = detectColorFormat(color)
  let { h, s, l } = { h: 0, s: 0, l: 0 }
  switch (colorFormat) {
    case 'hex':
      console.log('hex color: ' + color)
      ;({ h, s, l } = hexToHSL(color))
      break
    case 'rgb':
      console.log('rgb color: ' + color)
      ;({ h, s, l } = rgbToHSL(color))
      break
    case 'hsl':
      console.log('hsl color: ' + color)
      ;({ h, s, l } = toHSLObject(color))
      break
  }
  console.log(`hsl ${h} - ${s} - ${l} ? color: ${color}`)

  s = s + saturation
  l = l + lightness

  switch (colorFormat) {
    case 'hsl':
      return `hsl(${h},${s}%,${l}%)`
    case 'hex':
      // return hslToHex(h, s, l)
      return hsl2hex(h, s, l)
    case 'rgb':
      return hslToRgb(h, s, l)
  }
}

export function pscc(
  colors: StringMap,
  platform: string = 'ios',
  saturation = 0,
  lightness = 0
): StringMap {
  if (Platform.OS !== platform) return colors

  const ccObj = Object.fromEntries(
    Object.entries(colors).map(([key, value]) => [
      key,
      colorCorrection(value, saturation, lightness),
    ])
  )

  return ccObj
}

export function psccorrection(
  colors: StringMap,
  platform = 'ios',
  saturation = 0,
  lightness = 0
) {
  if (Platform.OS !== platform) return

  let correction = {}

  Object.keys(colors).map((key) => {
    const color = colors[key]
    const colorFormat = detectColorFormat(color)
    let { h, s, l } = { h: 0, s: 0, l: 0 }
    switch (colorFormat) {
      case 'hex':
        ;({ h, s, l } = hexToHSL(color))
        break
      case 'rgb':
        ;({ h, s, l } = rgbToHSL(color))
        break
      case 'hsl':
        ;({ h, s, l } = toHSLObject(color))
        break
      default:
        break
    }
    console.log('colorFormat:', colorFormat)
    console.log('h:' + h, 's:' + s, 'l:' + l)
    s = s + saturation
    l = l + lightness
    console.log('after interpolation', [h, s, l])

    switch (colorFormat) {
      case 'hsl':
        return `hsl(${h},${s}%,${l}%)`
      case 'hex':
        return hslToHex(h, s, l)
      case 'rgb':
        return hslToRgb(h, s, l)
    }
    // return `hsl(${h},${s}%,${l}%)`
    // return [h, s, l];
  })
}

export function detectColorFormat(color: string) {
  if (color.startsWith('#')) {
    return 'hex'
  } else if (color.startsWith('rgb')) {
    return 'rgb'
  } else if (color.startsWith('hsl')) {
    return 'hsl'
  }
  throw new Error('Unsupported color format')
}

export function rgbToHSL(rgb: string): { h: number; s: number; l: number } {
  let r = 0,
    g = 0,
    b = 0,
    a = 1,
    h = 0,
    s = 0,
    l = 0
  if (rgb.startsWith('rgb')) {
    ;[r, g, b] = rgb
      .substring(4, rgb.length - 1)
      .split(',')
      .map((str) => parseInt(str.trim(), 10))
    a = 1
  } else if (rgb.startsWith('rgba')) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ;[r, g, b, a] = rgb
      .substring(5, rgb.length - 1)
      .split(',')
      .map((str) => parseFloat(str.trim()))
  }

  r /= 255
  g /= 255
  b /= 255
  const cmin = Math.min(r, g, b)
  const cmax = Math.max(r, g, b)
  const delta = cmax - cmin

  h = 60 * (((g - b) / delta) % 6)
  l = (cmax + cmin) / 2
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

  h = Math.round(h)
  s = Math.round(s * 100)
  l = Math.round(l * 100)

  // return `hsl(${h}, ${s}%, ${l}%)`
  return { h, s, l }
}

export function manipulateHSL(
  h: number,
  s: number,
  l: number,
  hue: number,
  sat: number,
  lit: number
): string {
  h = (h + hue) % 360
  s = Math.max(0, Math.min(100, s + sat))
  l = Math.max(0, Math.min(100, l + lit))
  return `hsl(${h}, ${s}%, ${l}%)`
}

export function RGBToHSLNum(rgb: { r: number; g: number; b: number }): {
  h: number
  s: number
  l: number
} {
  const { r: r255, g: g255, b: b255 } = rgb

  const r = r255 / 255
  const g = g255 / 255
  const b = b255 / 255

  let max = Math.max(r, g, b)
  let min = Math.min(r, g, b)

  let h = (max + min) / 2
  let s = h
  let l = h

  if (max === min) {
    // Achromatic
    return { h: 0, s: 0, l }
  }

  const d = max - min
  s = l >= 0.5 ? d / (2 - (max + min)) : d / (max + min)
  switch (max) {
    case r:
      h = ((g - b) / d + 0) * 60
      break
    case g:
      h = ((b - r) / d + 2) * 60
      break
    case b:
      h = ((r - g) / d + 4) * 60
      break
  }

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}
const rgbColor = [255, 0, 0]

// Normalize the input color to the range 0-1
const srgbColorNormalized = rgbColor.map((c) => c / 255)

// Convert the color to sRGB using the formula from the sRGB specification
const srgbColor = srgbColorNormalized.map((c) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
)
// Denormalize the sRGB color to the range 0-255
const srgbColorDenormalized = srgbColor.map((c) => Math.round(c * 255))
// Convert the sRGB color back to an RGB string

const srgbColorString = `rgb(${srgbColorDenormalized.join(', ')})`

// 0: 'hsl(351.5, 100%, 50%)' // hue is 0

// const colorMap2: StringMap = pscc(
//   {
//     0: 'hsl(0, 100%, 50%)',
//     1: 'hsl(0, 90%, 50%)',
//     2: 'hsl(0, 80%, 50%)',
//     3: 'hsl(0, 70%, 50%)',
//     4: 'hsl(0, 60%, 50%)',
//     5: 'hsl(0, 50%, 50%)',
//     6: 'hsl(0, 40%, 50%)',
//     7: 'hsl(0, 30%, 50%)',
//     8: 'hsl(0, 20%, 50%)',
//     9: 'hsl(0, 10%, 50%)',
//     10: 'hsl(0, 0%, 50%)',
//   },
//   'ios',
//   0,
//   0
// )

// const colorsObjNormal: StringMap = {
//   primary: 'hsl(2, 44%, 51%)',
//   lightPrimary2: '#E27773',
//   secondary: '#9d4548',
//   tertiary: '#d98f8f',
//   lightTertiary: '#E27773',
//   lightPrimary: '#FCF6F6',
//   greyLight: '#999999',
//   naturalGrey1: '#49465F',
//   darkPrimary: '#660012',
//   naturalGrey2: '#858494',
//   naturalGrey4: '#E6E6E6',
//   naturalGrey5: '#FCF6F6',
// }

const colors = [
  '#000000',
  '#ffffff',
  '#b9514d',
  '#ff3300',
  '#bff803',
  '#2803f8',
]
const colorsHsl = [
  'hsl(0, 0%, 0%)',
  'hsl(0, 0%, 100%)',
  'hsl(2, 44%, 51%)',
  'hsl(12, 100%, 50%)',
  'hsl(74, 98%, 49%)',
  'hsl(249, 98%, 49%)',
]
const colorsRgb = [
  'rgb(0, 0, 0)',
  'rgb(255, 255, 255)',
  'rgb(185, 79, 75)',
  'rgb(255, 51, 0)',
  'rgb(190, 247, 2)',
  'rgb(39, 2, 247)',
]

// function LINEAR_DISPLAY_P3_TO_LINEAR_SRGB(r, g, b) {
//   const M = [
//     [1.2249, -0.2247, 0],
//     [-0.042, 1.0419, 0],
//     [-0.0197, -0.0786, 1.0979],
//   ]

//   const [r2, g2, b2] = M.map((row) => row[0] * r + row[1] * g + row[2] * b)

//   console.log('m', r2, g2, b2)

//   return [255 * r2, 255 * g2, 255 * b2]
// }

// const convertionTest = LINEAR_DISPLAY_P3_TO_LINEAR_SRGB(0.8, 0.6, 0.4)

// console.log('conversionTest', convertionTest)

// const testObj = {
//   a: { b: { c: 3, f:{ d: { e: 8, e2: 9 } } } },
// }

// const testArray = [2,'',3,4,[5,6,[8,7, { a: 80}]]]

// function updateDeepValue(obj, value) {
//   for (var prop in obj) {
//     if (obj.hasOwnProperty(prop)) {
//       if (typeof obj[prop] === 'object') {
//         updateDeepValue(obj[prop], value)
//       } else {
//         obj[prop] = value
//       }
//     }
//   }
// }
// console.log('typeof', typeof testArray[1])

// updateDeepValue(testArray, 20)

// console.log(JSON.stringify(testArray))

// const convertFuncTest = convert('#8ad737')

// console.log('convertFuncTest', convertFuncTest)




const M = [
  [1.2249, -0.2247, 0],
  [-0.042, 1.0419, 0],
  [-0.0197, -0.0786, 1.0979],
]

const srgb_xyz = [
  [0.436, 0.385, 0.143],
  [0.222, 0.717, 0.061],
  [0.014, 0.097, 0.714],
]

const xyz_srgb = [
  [3.1341864, -1.617209, -0.4906941],
  [-0.9787485, 1.9161301, 0.0334334],
  [0.0719639, -0.2289939, 1.4057537],
]

const P3 = [
  [0.5151, 0.292, 0.1571],
  [0.2412, 0.6922, 0.0666],
  [-0.0011, 0.0419, 0.7841],
]

const P3_wide = [
  [0.5151187, 0.2919778, 0.1571035],
  [0.2411892, 0.6922441, 0.0665668],
  [-0.0010505, 0.0418791, 0.7840713],
]

const p3_xyz_srgb_3 = [
  [1.2249, -0.22494, 6.4142e-8],
  [-0.042057, 1.0421, 3.5723e-9],
  [-0.019638, -0.078636, 1.0983],
]