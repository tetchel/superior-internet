import React, { Component } from 'react'

class NavGraph extends React.Component {
  props = {}

  constructor(...args) {
    super(...args);
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

export default NavGraph

