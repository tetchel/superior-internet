import React, { Component } from 'react'
import InferData from './infer-data'
import Svg from './components/svg'
import NavGraph from './components/nav-graph'
import Template from './components/template'
import Triangles from './components/triangular'

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
        Triangles,
        Template,
    ]
    return (
      <div>
        {/*
        *
        this.renderComponents(data)
        /*
        */}
        <NavGraph data={data} />
        <Triangles data={data} />
      </div>
    )
  }

  renderComponents(data) {
    return Object.keys(data)
      .map(key => {
        return this.createComponent(key, data)
      })
  }

  createComponent(key, data) {
    return <Template key={key} name={`${key} = ${data[key]}`} />
  }
}

export default App
