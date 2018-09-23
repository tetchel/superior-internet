import React, { Component } from 'react'
import ioClient from 'socket.io-client'

class Svg extends Component {
  constructor() {
    super()

    let io = ioClient.connect('http://localhost:3000', {
      // 'path': '/'
    });
    io.on("new-user", data => console.log("newuser " + data));
    io.on("new-user", data => console.log("newvisit " + data));
    console.log("IO INIT'D");
  }

  render() {
    return <svg>
      <circle cx='50' cy='50' r='50'></circle>
    </svg>
  }
}

export default Svg
