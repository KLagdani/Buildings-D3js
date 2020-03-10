import * as d3 from "d3";

import {
  asiaShape,
  middleEastShape,
  americaShape,
  europeShape,
  africaShape
} from "./buildingShapes";

export const colorScale = d3
  .scaleOrdinal()
  .domain(["Politic", "Religion", "Urban", "Economy"])
  .range(d3.schemePastel1);

export const shapeScale = d3
  .scaleOrdinal()
  .domain(["Europe", "Africa", "Asia", "Middle East", "America"])
  .range([europeShape, africaShape, asiaShape, middleEastShape, americaShape]);
