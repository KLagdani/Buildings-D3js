import React, { Component } from "react";
import _ from "lodash";
import * as d3 from "d3";

import { colorScale, shapeScale } from "../utils/scales";
import { shapesLegend, colorLegend, heightLegend } from "../utils/legendSVG";
import performGradient from "../utils/gradient";
import displayYears from "../utils/displayYears";

export class Buildings extends Component {
  buildLegend() {
    const svg = d3
      .select(this.refs.buildingLegend)
      .append("svg")
      .attr("class", "buildings-legend-svg")
      .attr("width", "1000")
      .attr("height", "600");

    shapesLegend(svg);
    colorLegend(svg);
    heightLegend(svg);
  }
  componentDidMount() {
    this.buildLegend();
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

      //Scale
      const heightScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.height)])
        .range([10, 60]);

      //Drawing the buildings
      const paths = g.selectAll("path").data(data);
      const pathG = paths
        .enter()
        .append("g")
        .attr("class", "building-path")
        .on("click", d => {
          window.open(d.link);
        });
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
        .attr("class", (d, i) => `paragraph building-name-${i}`)
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
      displayYears(data, this.refs.buildingsYears);
    });
  }

  render() {
    return (
      <div className="buildings">
        <div className="header heading-primary heading-primary--main u-margin-top-big">
          {" "}
          5 Tallest buildings throughout the years
        </div>
        <div className="header u-center-text u-margin-bottom-small">
          <div className="header-presentation">
            <p className="paragraph u-margin-bottom-xsmall">
              This project showcases the 5 tallest buildings in the world
              through the history, their heights, their regions and why they
              were built.
            </p>
            <p className="paragraph-smol ">
              This project was built using the D3.js library and was inspired by{" "}
              <a
                href="https://sxywu.com/filmflowers/"
                target="_blank"
                class="paragraph-smol-a"
              >
                shirley wu
              </a>
              's flowers
            </p>
          </div>

          <div className="paragraph u-margin-top-medium header-link">
            <a
              href="http://lagdani.com"
              target="_blank"
              class="paragraph-smol-a"
            >
              Kaoutar LAGDANI
            </a>
          </div>
        </div>

        <div className="buildings-legend">
          <div className="building-legend-filler" ref="buildingLegend"></div>
        </div>
        <div className="buildings-content">
          <div className="buildings-content-svgs">
            <div className="buildings-years" ref="buildingsYears"></div>
            <div className="buildings-names" ref="buildingsNames"></div>
            <div className="buildings-area" ref="buildingsArea"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Buildings;
