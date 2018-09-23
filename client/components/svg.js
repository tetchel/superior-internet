import React, { Component } from 'react'
// import ioClient from 'socket.io-client'
import { normalize } from '../normalize'

class Svg extends Component {

  render() {
    const getKey = index => {
      const letter = this.props.name
        ? this.props.name[index]
        : index
      normalize(letter)
    }

    console.log("SVG", this.props.name, getKey(0), getKey(1), getKey(2))

    return <svg>
      <circle
        cx='50'
        cy='50'
        r='50'
        fill={`rgb(${getKey(0)}, ${getKey(1)}, ${getKey(2)})`}
      ></circle>
    </svg>
  }
}

export default Svg
