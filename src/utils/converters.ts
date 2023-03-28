// Color to rgb
export function hslToRgb([h, s, l]: number[]): number[] {
  const hDecimal = h / 360
  const sDecimal = s / 100
  const lDecimal = l / 100

  let r, g, b

  if (s === 0) {
    r = g = b = Math.round(lDecimal)
    return [r, g, b]
  }

  const HueToRGB = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  let q =
    lDecimal < 0.5
      ? lDecimal * (1 + sDecimal)
      : lDecimal + sDecimal - lDecimal * sDecimal
  let p = 2 * lDecimal - q

  const rDecimal = HueToRGB(p, q, hDecimal + 1 / 3)
  const gDecimal = HueToRGB(p, q, hDecimal)
  const bDecimal = HueToRGB(p, q, hDecimal - 1 / 3)

  ;[r, g, b] = [
    Math.round(rDecimal * 255),
    Math.round(gDecimal * 255),
    Math.round(bDecimal * 255),
  ]

  return [r, g, b]
}

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  if (result) {
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ]
  }
  console.warn(`invalid hex string: ${hex}`)
  return [0, 0, 0]
}

export function rgbToHsl([r, g, b]: number[]): number[] {
  r /= 255
  g /= 255
  b /= 255

  let max = Math.max(r, g, b)
  let min = Math.min(r, g, b)

  let h = (max + min) / 2
  let s = h
  let l = h

  if (max === min) {
    // Achromatic
    return [0, 0, l]
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
  h = Math.round(h)
  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return [h, s, l]
}

export function rgbToHex(rgb: number[]) {
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

export const hslStringToArray = (hslStr: string) => {
  let hslArr = hslStr?.match(/\d+/g)?.map(Number)

  if (!hslArr) {
    console.warn(`Invalid hsl string: ${hslStr}`)
    hslArr = [0, 0, 0]
  }
  return hslArr
}

export function hslArrayToString([h, s, l]: number[]) {
  return `hsl(${h},${s}%,${l}%)`
}

export function rgbStringToArray(rgbString: string) {
  const result = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)

  if (result) {
    return [
      parseInt(result[1], 10),
      parseInt(result[2], 10),
      parseInt(result[3], 10),
    ]
  }
  console.warn(`Invalid rgb string ${rgbString}`)
  return [0, 0, 0]
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

export function linearTo8bit(linearRgb: number[]) {
  return linearRgb.map((c) => Math.max(Math.min(Math.round(c * 255), 255), 0))
}

export function rgbArrayToString([r, g, b]: number[]) {
  return `rgb(${r}, ${g}, ${b})`
}

export function stringColorToRgbArray(color: string): number[] {
  const colorFormat = detectColorFormat(color)

  switch (colorFormat) {
    case 'rgb':
      const rgbArr = rgbStringToArray(color)
      return rgbArr
    case 'hsl':
      const hslArr = hslStringToArray(color)
      return hslToRgb(hslArr)
    case 'hex':
      return hexToRgb(color)
  }
}

export function convert(color: string) {
  // rgb format -> array --> [255, 255, 255]
  const rgb = stringColorToRgbArray(color)

  const format = {
    toRgb: rgb,
    toHsl: rgbToHsl(rgb),
    toHex: rgbToHex(rgb),
  }
  return format
}
