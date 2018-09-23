import React from 'react';
import { extent } from 'd3-array';
import { Group } from '@vx/group';
import { GradientOrangeRed, GradientPinkRed } from '@vx/gradient';
import { RectClipPath } from '@vx/clip-path';
import { scaleLinear } from '@vx/scale';
import { getCoordsFromEvent } from '@vx/brush';
import { digest } from 'json-hash';
import { normalize } from '../normalize'

import { voronoi, VoronoiPolygon } from '@vx/voronoi';

const neighborRadius = 50;

var data = Array(15).fill(null).map(() => ({
  x: Math.random(),
  y: Math.random(),
  id:Math.random().toString(36).slice(2),
}));


function getRGBFromName(name) {
  name = digest(name)
  var r = normalize(name[0]);
  var g = normalize(name[1]);
  var b = normalize(name[2]);
  return {r, g, b}
}

class VoronoiChart extends React.PureComponent {

  static getUpdatedState(props) {
    let { width, height, margin, name} = props;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    data = Array(15).fill(null).map(() => ({
      x: Math.random(),
      y: Math.random(),
      id:name,
    }));

    const xScale = scaleLinear({
      domain: extent(data, d => d.x),
      range: [0, innerWidth],
    });

    const yScale = scaleLinear({
      domain: extent(data, d => d.y),
      range: [innerHeight, 0],
    });

    const voronoiDiagram = voronoi({
      x: d => xScale(d.x),
      y: d => yScale(d.y),
      width: innerWidth,
      height: innerHeight,
    })(data);

    return {
      selected: null,
      selectedNeighbors: null,
      xScale,
      yScale,
      voronoiDiagram,
      innerWidth,
      innerHeight,
    };
  }

  constructor(props) {
    super(props);
    this.state = VoronoiChart.getUpdatedState(props);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height
    ) {
      this.setState(VoronoiChart.getUpdatedState(nextProps));
    }
  }

  render() {
    const { width, height, margin } = this.props;

    const {
      voronoiDiagram,
      innerWidth,
      innerHeight,
      xScale,
      yScale,
      selected,
      neighbors,
    } = this.state;
    //console.log(r,g,b);
    const polygons = voronoiDiagram.polygons();
    console.log('voronoi', name)
    const {r, g, b} = getRGBFromName(this.props.name)
    return (
      <svg
        width={width}
        height={height}
        ref={(ref) => { this.svg = ref; }}
      >
        <GradientOrangeRed id="voronoi_orange_red" />
        <GradientPinkRed id="voronoi_pink_red" />
        <RectClipPath
          id="voronoi_clip"
          width={innerWidth}
          height={innerHeight}
          fill={`rgb(${r}, ${g}, ${b})`}
          rx={14}
        />
        <Group
          top={margin.top}
          left={margin.left}
          clipPath="url(#voronoi_clip)"

        >
          {polygons.map((polygon) => (
            <VoronoiPolygon
              key={digest(polygon)}
              polygon={polygon}
              fill={`rgb(${r}, ${g}, ${b})`}
              stroke="#fff"
              strokeWidth={1}
            />
          ))}
          {data.map((d) => (
            <circle
              key={digest(d)}
              r={2}
              cx={xScale(d.x)}
              cy={yScale(d.y)}
              fill="#ffffff"
              fillOpacity={0.5}
            />
          ))}
        </Group>
      </svg>
    );
  }
}

const MyVoronoi = ({ data, name }) => {
  return <VoronoiChart data={data} name={name} width={400} height={400} margin={{top:0, bottom:0, left:0, right: 0}} />
}

export default MyVoronoi
