import React, { Component } from "react";
import * as d3 from "d3";

export class Revenues extends Component {
  componentDidMount() {
    const margins = { left: 100, top: 100, right: 100, bottom: 100 };

    const width = 900 - margins.left - margins.right;
    const height = 600 - margins.top - margins.bottom;

    const g = d3
      .select(this.refs.chartArea)
      .append("svg")
      .attr("width", width + margins.left + margins.right)
      .attr("height", height + margins.top + margins.bottom)
      .append("g")
      .attr("transform", `translate(${margins.left},${margins.top})`);

    g.append("text")
      .attr("class", "x axis-label")
      .attr("x", width / 2)
      .attr("y", height + 50)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text("Month");

    g.append("text")
      .attr("class", "y axis-label")
      .attr("x", -(height / 2))
      .attr("y", -60)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Revenue");

    d3.json("data/revenues.json")
      .then(data => {
        data.forEach(d => {
          d.revenue = +d.revenue;
        });

        const x = d3
          .scaleBand()
          .domain(data.map(d => d.month))
          .range([0, width])
          .paddingInner(0.3)
          .paddingOuter(0.3);

        const y = d3
          .scaleLinear()
          .domain([0, d3.max(data, d => d.revenue)])
          .range([height, 0]);

        const xAxisCall = d3.axisBottom(x); //we initiate an x Call with the x scale

        g.append("g")
          .attr("class", "x axis")
          //putting th x axis in the bottom
          .attr("transform", `translate(0, ${height})`)
          .call(xAxisCall);

        const yAxisCall = d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat(d => `${d} $`);

        g.append("g")
          .attr("class", "y axis")
          .call(yAxisCall);

        const rects = g.selectAll("rect").data(data);
        rects
          .enter()
          .append("rect")
          .attr("x", d => x(d.month))
          .attr("y", d => y(d.revenue))
          .attr("width", x.bandwidth)
          .attr("height", d => height - y(d.revenue))
          .attr("fill", "pink");
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="chart-area" ref="chartArea"></div>
        </div>
      </div>
    );
  }
}

export default Revenues;
