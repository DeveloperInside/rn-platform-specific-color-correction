import React, { useEffect } from 'react'
import PSColorCorrectionModule, { Counter } from 'platform-specific-color-correction'

const App = () => {
  useEffect(() => {
    console.log(PSColorCorrectionModule)
  })

  return <Counter />
}

export default App
