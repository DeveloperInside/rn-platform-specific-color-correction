import React, { useEffect } from 'react'
import PSColorCorrectionModule, {
  ColorGrid,
} from 'platform-specific-color-correction'
import { updateDeepValue } from '../../src/utils/functions'
import { BRADFORD_D50_D65, BRADFORD_D65_D50, DISPLAYP3_50_SRGB_50_ADAPTED, DISPLAYP3_50_SRGB_65_ADAPTED, DISPLAYP3_50_XYZ_ADAPTED, DISPLAYP3_65_XYZ_ADAPTED, SRGB_50_DISPLAYP3_50_ADAPTED, SRGB_50_XYZ_ADAPTED, XYZ_SRGB_50_ADAPTED, XYZ_SRGB_65_ADAPTED } from '../../src/constants/conversionMatrix'
import { multiplyMatrices } from '../../src/utils/jsUtils.js'
const App = () => {
  function LINEAR_DISPLAY_P3_TO_LINEAR_SRGB(r: number, g: number, b: number) {
    ;[r, g, b] = [r, g, b].map(c => c/255)

    ;[r, g, b] = [r, g, b].map(c => Math.pow(c, 2.2))
    ;[r, g, b] = DISPLAYP3_50_XYZ_ADAPTED.map((row) => row[0] * r + row[1] * g + row[2] * b)
    console.log('DISPLAYP3_XYZ', r, g, b)

    ;[r, g, b] = XYZ_SRGB_50_ADAPTED.map((row) => row[0] * r + row[1] * g + row[2] * b)
    console.log('XYZ_SRGB', r, g, b)

    var gamma = 2.4;
    ;[r, g, b] = [r, g, b].map(c => (c <= 0.0031308) ? 12.92*c : (1 + 0.055)*Math.pow(c, 1/gamma) - 0.055)

    console.log('gamma_srgb', r, g, b)



    // const [rb, gb, bb] = [rdx, gdx, bdx]

    // const multiplyTest = multiplyMatrices(XYZ_SRGB_50_ADAPTED, DISPLAYP3_50_XYZ_ADAPTED)
    // console.log('multiplyTest', multiplyTest)

    // ;[r, g, b] = BRADFORD_D65_D50.map((row) => row[0] * r + row[1] * g + row[2] * b)
    // console.log('BRADFORD_D50_D65', r, g, b)

    // ;[r, g, b] = XYZ_SRGB_65_ADAPTED.map((row) => row[0] * r + row[1] * g + row[2] * b)
    // console.log('XYZ_SRGB_65_ADAPTED', r, g, b)

    return [255 * r, 255 * g, 255 * b]

    // 0.38, 0.81, 0.46

    // const [r2, g2, b2] = P3.map((row) => row[0] * r + row[1] * g + row[2] * b)
    // const [r3, g3, b3] = xyz_srgb.map(
    //   (row) => row[0] * r2 + row[1] * g2 + row[2] * b2
    // )

    // const [r6, g6, b6] = M.map((row) => row[0] * r + row[1] * g + row[2] * b)

    // const [r7, g7, b7] = [r3 * 0.9903, g3 * 0.9966, b3 * 0.967]

    // const [rd, gd, bd] = p3_xyz_srgb_3.map(
    //   (row) => row[0] * r + row[1] * g + row[2] * b
    // )

    // console.log('1-2-3', r3, g3, b3)
    // console.log('1-3-c', r7, g7, b7)
    // console.log('1-6', r6, g6, b6)
    // console.log('p3_xyz_srgb_3', rd, gd, bd)

    // const aa1 = 0.5151 * 3.1341864 + 0.292 * -0.9787485 + 0.1571 * 0.0719639

    // console.log(aa1)
    // return [255 * r3, 255 * g3, 255 * b3]
  }

  const lineerTest = LINEAR_DISPLAY_P3_TO_LINEAR_SRGB(128, 205, 128)
  console.log('mlinear', lineerTest)

  console.log(
    '----------------------------------------------------------------'
  )

  useEffect(() => {
    console.log(PSColorCorrectionModule)
  })

  return <ColorGrid />
}

export default App
