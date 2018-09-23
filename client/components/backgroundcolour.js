import React, { Component } from 'react'
import { normalize } from '../normalize'

class Background extends Component {
  constructor(props) {
    super(props)
    console.log(data);
    var r = normalize(data[0]);
    var g = normalize(data[1]);
    var b = normalize(data[2]);
    console.log("background",r,g,b);

    document.querySelector('body').style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

  }
  render() {
    return <div>TEST BG</div>
  }
}

export default Background
