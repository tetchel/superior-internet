import React, { Component } from 'react'
import InferData from './infer-data'
import Svg from './components/svg'

// printToScreen(JSON.stringify(InferData(), null, 2))

class App extends Component {
  constructor() {
    super()
    console.log('app loaded')
    console.log(InferData())
  }

  render() {
    return (
      <div>
        <Svg></Svg>
        <pre>
          {JSON.stringify(InferData(), null, 2)}
        </pre>
      </div>
    )
  }
}

export default App
