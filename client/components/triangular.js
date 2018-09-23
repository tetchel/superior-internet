import React, { Component } from 'react'
import p5 from 'p5'
import Trianglify from 'trianglify'
import { digest } from 'json-hash'

function createAnimation(element, data){
  var sketch = function( p )
  {

    var userdata = data;
    var randSeed = userdata;
    var funcSource = new p5();
    var pointCloud = new Array();
    funcSource.randomSeed(randSeed);
    var speed = 1.0;
    var directionx = funcSource.random(0, window.innerWidth);
    var directiony = funcSource.random(0, window.innerHeight);
    var distancex;
    var distancey;

    p.preload = function()
    {
    };

    p.setup = function()
    {
    };

    for (var i = 0; i < 100; i++)
    {
      var x = funcSource.random(0, window.innerWidth);
      var y = funcSource.random(0, window.innerHeight);
      pointCloud.push([x, y]);
    };

    var pattern = Trianglify({width:window.innerWidth, height:window.innerHeight, points:pointCloud, seed:randSeed});
    var tricanvas = element.appendChild(pattern.canvas());

    function newDirection()
    {
        directionx = funcSource.random(0, window.innerWidth);
        directiony = funcSource.random(0, window.innerHeight);
    };

    function movePoints()
    {

      for(var i = 0; i < pointCloud.length; i++)
      {

        if(pointCloud[i][0] < directionx && pointCloud[i][1] < directiony)
        {
          newDirection();
          distancex = directionx - pointCloud[i][0];
          distancey = directiony - pointCloud[i][1];

            pointCloud[i][0] += 0.5*speed;
            pointCloud[i][1] += 0.5*speed;
        }
        else if(pointCloud[i][0] > directionx && pointCloud[i][1] > directiony)
        {
          newDirection();
          distancex = pointCloud[i][0] - directionx;
          distancey = pointCloud[i][1] - directiony;

            pointCloud[i][0] += 0.5*speed;
            pointCloud[i][1] += 0.5*speed;

        }
        else if(pointCloud[i][0] > directionx && pointCloud[i][1] < directiony)
        {
          newDirection();
          distancex = pointCloud[i][0] - directionx;
          distancey = directiony - pointCloud[i][1];

            pointCloud[i][0] -= 0.5*speed;
            pointCloud[i][1] -= 0.5*speed;

        }
        else if(pointCloud[i][0] < directionx && pointCloud[i][1] > directiony)
        {
          newDirection();
          distancex = directionx - pointCloud[i][0];
          distancey = pointCloud[i][1] - directiony;

            pointCloud[i][0] -= 0.5*speed;
            pointCloud[i][1] -= 0.5*speed;

        };
      };
      pattern.canvas(tricanvas);
    };

    p.draw = function()
    {
      movePoints();
    };

  };

  var myp5 = new p5(sketch);
  }



class Triangles extends React.Component {
  constructor(args) {
    super(args);
    this.initializeLibrary = this.initializeLibrary.bind(this)
  }

  render() {
    return (
      <div>
        <div ref={this.initializeLibrary}>
        </div>
      </div>
    )
  }

  initializeLibrary(el) {
    const data = JSON.parse(document.getElementById('data').value);
    console.log('initialize', createAnimation(el, data))
  }
}

export default Triangles
