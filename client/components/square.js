import React, { Component } from 'react'

class Square extends React.Component {

  render() {
    return (
      <div ref={this.initializeLibrary}>
        {this.props.name}
        Square
      </div>
    )
  }

}

export default Square
