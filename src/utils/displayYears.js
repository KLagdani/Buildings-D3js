import _ from "lodash";
import * as d3 from "d3";

export default (data, buildingsRef) => {
  const allyears = data.map(d => d.year);
  const yearsData = _.uniq(_.map(allyears));

  const years = d3
    .select(buildingsRef)
    .selectAll(".year")
    .data(yearsData);

  years
    .enter()
    .append("h2")
    .attr("class", "year buildings-years_h2")
    .style("position", "absolute")
    .style("top", (d, i) => {
      return Math.floor(allyears.indexOf(d) / 5) * 210 * 1.5 + 340 + "px";
    })
    .text(d => d);
};
