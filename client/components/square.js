import React, { Component } from 'react'

class Square extends React.Component {
  props = {}

  constructor(args) {
    super(args);
    this.initializeLibrary = this.initializeLibrary.bind(this)
    console.log("Square!")
  }

  render() {
    return (
      <div ref={this.initializeLibrary}>
        {this.props.name}
        Square
      </div>
    )
  }

  initializeLibrary(el) {
    console.log('initialize', el)
  }
}

export default Square
