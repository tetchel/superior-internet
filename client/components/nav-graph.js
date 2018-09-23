import React, { Component } from 'react'
import {Sigma, ForceAtlas2, EdgeShapes, NodeShapes, RandomizeNodePositions, RelativeSize, LoadJSON} from 'react-sigma';

function getGraph() {
  return fetch('/g')
    .then(d => d.json())
}

class NavGraph extends React.Component {
  render() {
    return (
      <Sigma
        settings={{
          drawEdges: true,
          minNodeSize: 8,
          maxNodeSize: 15,
          labelThreshold: 1
        }}
        style={{
          height: `${window.innerHeight / 2}px`,
        }}
        onClickNode={navigateToNode}
      >
        <EdgeShapes default="tapered"/>
        <NodeShapes default="star"/>
        <LoadJSON path={'/g/'}>
          <RandomizeNodePositions>
            <RelativeSize initialSize={8}/>
          </RandomizeNodePositions>
        </LoadJSON>
      </Sigma>
    )
  }
}

export default NavGraph

function navigateToNode(event) {
  const {id} = event.data.node
  window.location = `/u/${id}`
}
