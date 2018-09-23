import React, { Component } from 'react'
import {Sigma, RandomizeNodePositions, RelativeSize} from 'react-sigma';


class NavGraph extends React.Component {
  state = {
    graph: {
      nodes:[{id:"n1", label:"Alice"}, {id:"n2", label:"Rabbit"}],
      edges:[{id:"e1",source:"n1",target:"n2",label:"SEES"}]
    }
  }

  constructor(props) {
    super(props);

    function getGraph() {
      return fetch('/g')
        .then(d => d.json())
    }

    getGraph()
      .then(data => {
        this.setState({
          graph: data
        })
      })
  }

  render() {
    console.log("Graph", this.state.graph)
    return (
      <Sigma graph={this.state.graph} settings={{drawEdges: true, clone: false}}>
        <RelativeSize initialSize={15}/>
        <RandomizeNodePositions/>
      </Sigma>
    )
  }
}

export default NavGraph

