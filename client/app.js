import React, { Component } from 'react'
import InferData from './infer-data'
import Svg from './components/svg'
import Template from './components/template'

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
        <Template name="template component" />
        <pre>
          {JSON.stringify(InferData(), null, 2)}
        </pre>
      </div>
    )
  }
}

export default App
