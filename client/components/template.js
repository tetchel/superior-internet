import React, { Component } from 'react'

class Template extends React.Component {

  constructor(args) {
    super(args);
    this.initializeLibrary = this.initializeLibrary.bind(this)
  }

  render() {
    return (
      <div ref={this.initializeLibrary}>
        {this.props.name}
      </div>
    )
  }

  initializeLibrary(el) {
    console.log('initialize', el)
  }
}

export default Template
