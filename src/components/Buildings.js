import React, { Component } from "react";
import _ from "lodash";
import * as d3 from "d3";

import {
  asiaShape,
  middleEastShape,
  americaShape,
  europeShape,
  africaShape
} from "../utils/buildingShapes";
import performGradient from "../utils/gradient";

export class Buildings extends Component {
  componentDidMount() {
    const margins = { left: 100, right: 100, top: 100, bottom: 100 };

    //Create the svg and the buildings group
    const svg = d3
      .select(this.refs.buildingsArea)
      .append("svg")
      .attr("left", "100px")
      .attr("width", "1200")
      .attr("height", "10900")
      .attr("transform", `translate(${margins.left},${margins.top})`);

    const g = svg.append("g").attr("transform", `translate(20, 20)`);

    d3.json("data/allTimesBuildings.json").then(data => {
      //Parsing data
      data.forEach(d => {
        d.year = +d.year;
        d.height = +d.height;
      });

      //Sorting the years
      data = _.chain(data)
        .sortBy(d => -d.year)
        .value();

      //Scales
      const heightScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.height)])
        .range([10, 60]);

      const colorScale = d3
        .scaleOrdinal()
        .domain(["Politic", "Religion", "Urban", "Economy"])
        .range(d3.schemePastel1);

      const shapeScale = d3
        .scaleOrdinal()
        .domain(["Europe", "Africa", "Asia", "Middle East", "America"])
        .range([
          europeShape,
          africaShape,
          asiaShape,
          middleEastShape,
          americaShape
        ]);

      //Drawing the buildings
      const paths = g.selectAll("path").data(data);
      const pathG = paths.enter().append("g");
      pathG
        .append("path")
        .attr("d", d => shapeScale(d.region))
        .attr("class", (d, i) => `building-${i}`)
        .attr("transform", (d, i) => {
          var scale = heightScale(d.height);
          var maxScale = heightScale(d3.max(data, d => d.height));
          var hbet = ((maxScale - parseInt(scale)) * 266) / maxScale;
          var k7ez = ((maxScale - parseInt(scale)) * 189) / maxScale / 2;

          var x = (i % 5) * 180 * 1.25 + k7ez;
          var y = Math.floor(i / 5) * 210 * 1.5 + hbet;
          return "translate(" + [x, y] + `) scale(${parseInt(scale) / 100})`;
        })
        .attr("height", d => heightScale(d.height))
        .attr("width", "30px")
        .attr("fill", d => {
          if (d.purpose.length > 1) {
            const grad = performGradient(
              svg,
              colorScale(d.purpose[0]),
              colorScale(d.purpose[1])
            );
            return `url(#${grad})`;
          } else {
            return colorScale(d.purpose[0]);
          }
        });

      //Displaying the names
      pathG
        .append("text")
        .text(d => d.name)
        .attr("class", (d, i) => `building-name-${i}`)
        .attr("transform", (d, i) => {
          var buildingWidth = d3
            .select(`.building-${i}`)
            .node()
            .getBoundingClientRect().width;
          var buildingNameWidth = d3
            .select(`.building-name-${i}`)
            .node()
            .getBoundingClientRect().width;
          var scale = heightScale(d.height);
          var maxScale = heightScale(d3.max(data, d => d.height));
          var k7ez = ((maxScale - parseInt(scale)) * 189) / maxScale / 2;

          var x =
            (i % 5) * 180 * 1.25 +
            k7ez +
            buildingWidth / 2 -
            buildingNameWidth / 2;
          var y = Math.floor(i / 5) * 210 * 1.5 + 290;

          return "translate(" + [x, y] + `)`;
        });

      //Displaying the years by row of 5 buildings
      const allyears = data.map(d => d.year);
      const yearsData = _.uniq(_.map(allyears));

      const years = d3
        .select(this.refs.buildingsYears)
        .selectAll(".year")
        .data(yearsData);

      years
        .enter()
        .append("h2")
        .attr("class", "year buildings-years_h2")
        .style("position", "absolute")
        .style("top", (d, i) => {
          console.log("data.indexOf(d) ", d, "is", allyears.indexOf(d));
          return Math.floor(allyears.indexOf(d) / 5) * 210 * 1.5 + 340 + "px";
        })
        .text(d => d);
    });
  }

  render() {
    return (
      <div className="buildings">
        <div className="buildings-years" ref="buildingsYears"></div>
        <div className="buildings-names" ref="buildingsNames"></div>
        <div className="buildings-area" ref="buildingsArea"></div>
      </div>
    );
  }
}

export default Buildings;
