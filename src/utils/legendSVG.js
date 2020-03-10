import * as d3 from "d3";
import _ from "lodash";
import { strokeShape } from "./buildingShapes";
import { colorScale, shapeScale } from "./scales";
import legendData from "./legend";

export const shapesLegend = svg => {
  const g = svg.append("g").attr("transform", `translate(150, 350)`);

  const paths = g.selectAll("path").data(legendData.region);
  const pathG = paths.enter().append("g");
  pathG
    .append("path")
    .attr("fill", "#999596")
    .attr("class", (d, i) => `legend-region legend-region-${i}`)
    .attr("d", d => shapeScale(d))
    .attr("transform", (d, i) => `translate(${i * 150}, 0) scale(.15)`);

  pathG
    .append("text")
    .text(d => d)
    .attr("class", (d, i) => `paragraph legend-region legend-region-text-${i}`)
    .attr("transform", (d, i) => {
      var legendRegion = d3
        .select(`.legend-region-${i}`)
        .node()
        .getBoundingClientRect().width;
      var legendRegionText = d3
        .select(`.legend-region-text-${i}`)
        .node()
        .getBoundingClientRect().width;
      var x = i * 150 + (legendRegion / 2 - legendRegionText / 2);

      return "translate(" + [x, 95] + `)`;
    });
};

export const colorLegend = svg => {
  const g = svg.append("g").attr("transform", `translate(250, 490)`);

  svg
    .append("filter")
    .attr("id", "blurMe")
    .append("feGaussianBlur")
    .attr("in", "SourceGraphic")
    .attr("stdDeviation", "5");

  const paths = g.selectAll("path").data(legendData.purpose);
  const pathG = paths.enter().append("g");
  pathG
    .append("path")
    .attr("class", (d, i) => `legend-purpose legend-purpose-${i}`)
    .attr("d", strokeShape)
    .attr("fill", d => colorScale(d))
    .attr("filter", "url(#blurMe)")
    .attr("transform", (d, i) => `translate(${i * 150}, 0) scale(.5)`);

  pathG
    .append("text")
    .text(d => d)
    .attr(
      "class",
      (d, i) => `paragraph legend-purpose legend-purpose-text-${i}`
    )
    .attr("transform", (d, i) => {
      var legendPurpose = d3
        .select(`.legend-purpose-${i}`)
        .node()
        .getBoundingClientRect().width;
      var legendPurposeText = d3
        .select(`.legend-purpose-text-${i}`)
        .node()
        .getBoundingClientRect().width;
      var x = i * 150 + (legendPurpose / 2 - legendPurposeText / 2);

      return "translate(" + [x, 80] + `)`;
    });
};

export const heightLegend = svg => {
  d3.json("data/allTimesBuildings.json").then(data => {
    data.forEach(d => {
      d.height = +d.height;
    });
    data = _.chain(data)
      .sortBy(d => -d.height)
      .value();

    const heightScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.height)])
      .range([10, 60]);

    const g = svg.append("g").attr("transform", `translate(0, 10)`);
    const paths = g.selectAll("path").data(legendData.height);
    const pathG = paths.enter().append("g");
    pathG
      .append("path")
      .attr("d", shapeScale("Africa"))
      .attr("fill", "#999596")
      .attr("class", (d, i) => `legend-height-${i}`)
      .attr("transform", (d, i) => {
        var scale = heightScale(d);
        var maxScale = heightScale(d3.max(data, d => d.height));
        var hbet = ((maxScale - parseInt(scale)) * 266) / maxScale;
        var k7ez = ((maxScale - parseInt(scale)) * 189) / maxScale / 2;

        var x = (i % 5) * 180 * 1.25 + k7ez;
        var y = Math.floor(i / 5) * 210 * 1.5 + hbet;
        return "translate(" + [x, y] + `) scale(${parseInt(scale) / 100})`;
      });
    pathG
      .append("text")
      .text(d => `~ ${d}m`)
      .attr("class", (d, i) => `paragraph legend-height-text-${i}`)
      .attr("transform", (d, i) => {
        var legendHeight = d3
          .select(`.legend-height-${i}`)
          .node()
          .getBoundingClientRect().width;
        var legendHeightText = d3
          .select(`.legend-height-text-${i}`)
          .node()
          .getBoundingClientRect().width;
        var scale = heightScale(d);
        var maxScale = heightScale(d3.max(data, d => d.height));
        var k7ez = ((maxScale - parseInt(scale)) * 189) / maxScale / 2;
        var x =
          (i % 5) * 180 * 1.25 + k7ez + legendHeight / 2 - legendHeightText / 2;
        var y = Math.floor(i / 5) * 210 * 1.5 + 290;
        return "translate(" + [x, y] + `)`;
      });
  });
};
