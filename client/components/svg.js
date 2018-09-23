import React, { Component } from 'react'
import ioClient from 'socket.io-client'

class Svg extends Component {
  constructor() {
    super()

    let io = ioClient.connect();
    io.on("new-user", data => console.log("newuser " + JSON.stringify(data)));
    io.on("new-visit", data => console.log("newvisit " + JSON.stringify(data)));
  }

  render() {
    return <svg>
      <circle cx='50' cy='50' r='50'></circle>
    </svg>
  }
}

export default Svg
