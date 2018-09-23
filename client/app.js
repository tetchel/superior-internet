import React, { Component } from 'react'
import InferData from './infer-data'
import Svg from './components/svg'
import Template from './components/template'
import Square from './components/square'
import VoronoiChart from './components/voronoi'

// printToScreen(JSON.stringify(InferData(), null, 2))

class App extends Component {
  constructor() {
    super()
    console.log('app loaded')
    console.log(InferData())
  }

  render() {
    const data = InferData()
    const components = [
        Svg,
        VoronoiChart,
        Template,
    ]
    return (
      <div>
        {Object.keys(data).map(key => {
          return this.createComponent(key, data)
        })}
        <Triangles data={data} />
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
        <Svg></Svg>
        <Square data={data} />
      </div>
    )
  }

  createComponent(key, data) {
    return <Template key={key} name={`${key} = ${data[key]}`} />
  }
}

export default App
