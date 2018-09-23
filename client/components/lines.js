import React from 'react';
import { Group } from '@vx/group';
import { LinePath } from '@vx/shape';
import { curveMonotoneX } from '@vx/curve';
import { genDateValue } from '@vx/mock-data';
import { scaleTime, scaleLinear } from '@vx/scale';
import { extent, max } from 'd3-array';
import { normalize } from '../normalize'
import { digest } from 'json-hash'

function genLines(num) {
  return new Array(num).fill(1).map(() => {
    return genDateValue(25);
  })
}

// const series = genLines(12);
// const _data = series.reduce((rec, d) => {
//   return rec.concat(d)
// }, []);
//
// // accessors
// const x = d => d.date;
// const y = d => d.value;

export default ({
  width=500,
  height=500,
  name,
  data
}) => {

  const series = genLines(12);
  const _data = series.reduce((rec, d) => {
    return rec.concat(d)
  }, []);

  // accessors
  const x = d => d.date;
  const y = d => d.value;
  // bounds
  const xMax = width;
  const yMax = height / 8;
  const r = normalize(name[0]),
        g = normalize(name[1]),
        b = normalize(name[2]);
  //console.log(r, g, b);
  // scales
  const xScale = scaleTime({
    range: [0, xMax],
    domain: extent(_data, x),
  });
  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, max(_data, y)],
  });

  return (
    <svg width={width} height={height}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={`rgb(${r}, ${g}, ${b})`}
        rx={14}
      />
      {xMax > 8 && series.map((d, i) => {
        const offset = i * yMax / 2;
        const curve = i % 2 == 0
          ? curveMonotoneX
          : undefined;
        return (
          <Group
            key={`lines-${i}`}
            top={offset}
          >
            <LinePath
              data={d}
              xScale={xScale}
              yScale={yScale}
              x={x}
              y={y}
              stroke="#ffffff"
              strokeWidth={1}
              curve={curve}
            />
          </Group>
        );
      })}
    </svg>
  );
}
