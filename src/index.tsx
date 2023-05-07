import { NativeModules } from 'react-native'

import ColorGrid from './components/ColorGrid'
import { convert } from './scripts/converters'
import {
  applyColorConversionMatrix,
  shiftDisplayP3toSrgb,
  shiftSrgbToDisplayP3,
  sRgbTransferFunc,
  sRgbTransferFuncReverse,
  transformColor,
} from './scripts/functions'
import osColorBalance from './scripts/osColorBalance'

export {
  applyColorConversionMatrix,
  ColorGrid,
  convert,
  osColorBalance,
  shiftDisplayP3toSrgb,
  shiftSrgbToDisplayP3,
  sRgbTransferFunc,
  sRgbTransferFuncReverse,
  transformColor,
}

export default NativeModules.PSColorCorrectionModule
