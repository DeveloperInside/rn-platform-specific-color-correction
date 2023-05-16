import React, { useEffect } from 'react'
import PSColorCorrectionModule, {
  ColorGrid,
} from 'platform-specific-color-correction'

const App = () => {
  
  useEffect(() => {
    console.log(PSColorCorrectionModule)
  })

  return <ColorGrid />
}

export default App
