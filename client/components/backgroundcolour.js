import React, { Component } from 'react'
import { normalize } from '../normalize'
import { digest } from 'json-hash'

class Background extends Component {
  constructor(props) {
    super(props);
    const data = digest(props.data);

    var r = normalize(data[0]);
    var g = normalize(data[1]);
    var b = normalize(data[2]);

    document.querySelector('body').style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

  }
  render() {
    return null
  }
}

export default Background
