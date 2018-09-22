import React, { Component } from 'react'
import InferData from './infer-data'

// printToScreen(JSON.stringify(InferData(), null, 2))

class App extends Component {
  constructor() {
    super()
    console.log('app loaded')
    console.log(InferData())
  }

  render() {
    return <pre> {JSON.stringify(InferData(), null, 2)} </pre>
  }
}

export default App
