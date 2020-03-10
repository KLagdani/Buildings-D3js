export default (svg, color1, color2) => {
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
};
