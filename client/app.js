import React, { Component } from 'react'
import InferData from './infer-data'
// Components
import Svg from './components/svg'
import Template from './components/template'
import Square from './components/square'
import VoronoiChart from './components/voronoi'
import Lines from './components/lines'

import { digest } from 'json-hash'

// printToScreen(JSON.stringify(InferData(), null, 2))

class App extends Component {
  constructor() {
    super()
    console.log('app loaded')
    console.log(InferData())
  }

  render() {
    const data = InferData()
    return (
      <div>
        {Object.keys(data).map(key => {
          return this.createComponent(key, data)
        })}
      </div>
    )
  }

  createComponent(key, data) {
    const components = [
      Svg,
      VoronoiChart,
      Lines,
      Square,
      Template,
    ]

    let ThisComponent = components[Math.floor(Math.random()*components.length)]

    return <ThisComponent
      key={key}
      data={data}
      name={digest(key)} />
  }
}

export default App
