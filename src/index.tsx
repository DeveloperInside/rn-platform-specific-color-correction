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
import { updateDeepValue } from './scripts/utils'

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
  updateDeepValue,
}

export default NativeModules.PSColorCorrectionModule
