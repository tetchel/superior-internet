import React, { Component } from 'react'
import { normalize } from '../normalize'

class Background extends Component {
  constructor(props) {
    super(props)
    var r = normalize(data['name'][0]);
    var g = normalize(data['name'][1]);
    var b = normalize(data['name'][2]);
    debugger
    console.log("background",r,g,b);

    document.querySelector('body').style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

  }
  render() {
    return <div>TEST BG</div>
  }
}

export default Background
