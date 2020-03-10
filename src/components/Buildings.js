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

export class Buildings extends Component {
  componentDidMount() {
    const margins = { left: 100, right: 100, top: 100, bottom: 100 };

    //Create the svg and the buildings group
    const svg = d3
      .select(this.refs.buildingsArea)
      .append("svg")
      .attr("left", "100px")
      .attr("width", "1100")
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
      paths
        .enter()
        .append("path")
        .attr("d", d => shapeScale(d.region))
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
            const grad = this.performGradient(
              svg,
              colorScale(d.purpose[0]),
              colorScale(d.purpose[1])
            );
            return `url(#${grad})`;
          } else {
            return colorScale(d.purpose[0]);
          }
        })
        .append("text")
        .attr("text", d => d.name);

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

      //Displaying the names
      const allnames = data.map(d => d.name);

      const names = d3
        .select(this.refs.buildingsNames)
        .selectAll(".bname ")
        .data(allnames);

      names
        .enter()
        .append("p")
        .attr("class", "year buildings-names_p")
        .style("position", "absolute")
        .style("top", (d, i) => {
          return Math.floor(i / 5) * 210 * 1.5 + 380 + "px";
        })
        .style("left", (d, i) => {
          return (i % 5) * 180 * 1.2 + 189 + "px";
        })
        .text(d => d);
    });
  }

  performGradient(svg, color1, color2) {
    const gradName = `grad-${color1}-${color2}`;
    const defs = svg.append("defs");

    const grad1 = defs
      .append("linearGradient")
      .attr("id", gradName)
      .attr("gradientTransform", "rotate(90)");

    grad1
      .append("stop")
      .attr("offset", "5%")
      .attr("style", `stop-color:${color1};stop-opacity:1`);

    grad1
      .append("stop")
      .attr("offset", "95%")
      .attr("style", `stop-color:${color2};stop-opacity:1`);

    return gradName;
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
