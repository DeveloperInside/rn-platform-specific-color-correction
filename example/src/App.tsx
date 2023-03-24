import React, { useEffect } from 'react'
import PSColorCorrectionModule, {
  ColorGrid,
} from 'platform-specific-color-correction'

const App = () => {
  function LINEAR_DISPLAY_P3_TO_LINEAR_SRGB(r: number, g: number, b: number) {
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

    const [r2, g2, b2] = P3.map((row) => row[0] * r + row[1] * g + row[2] * b)
    const [r3, g3, b3] = xyz_srgb.map(
      (row) => row[0] * r2 + row[1] * g2 + row[2] * b2
    )

    const [r6, g6, b6] = M.map((row) => row[0] * r + row[1] * g + row[2] * b)

    const [r7, g7, b7] = [r3 * 0.9903, g3 * 0.9966, b3 * 0.967]

    const [rd, gd, bd] = p3_xyz_srgb_3.map(
      (row) => row[0] * r + row[1] * g + row[2] * b
    )

    console.log('1-2-3', r3, g3, b3)
    console.log('1-3-c', r7, g7, b7)
    console.log('1-6', r6, g6, b6)
    console.log('p3_xyz_srgb_3', rd, gd, bd)

    const aa1 = 0.5151 * 3.1341864 + 0.292 * -0.9787485 + 0.1571 * 0.0719639

    console.log(aa1)
    return [255 * r3, 255 * g3, 255 * b3]
  }

  const lineerTest = LINEAR_DISPLAY_P3_TO_LINEAR_SRGB(0.8, 0.6, 0.4)
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
