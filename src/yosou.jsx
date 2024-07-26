import React from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";

const Chart = ({ data }) => {
  const contentWidth = 600;
  const contentHeight = 600;
  const radius = contentWidth / 2;
  // 年代を設定するボタンをおけたらな
  const bottomMargin = 300;
  // 豆知識か、樹形図みたいなのおけたらな
  const rightMargin = 400;
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // 半径のスケールを定義
  const rScale = d3
    .scaleLinear()
    .domain([0, radius])
    .range([0.4 * radius, radius])
    .nice();

  const svgWidth = contentWidth + rightMargin;
  const svgHeight = contentHeight + bottomMargin;

  const root = d3.hierarchy(data);
  root.sum(function(d) { return d.value; })
    .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

  const partition = d3.partition()
    .size([2 * Math.PI, radius]);

  const arc = d3.arc()
    .startAngle(function(d) { return d.x0; })
    .endAngle(function(d) { return d.x1; })
    .innerRadius(function(d) { return rScale(d.y0); })
    .outerRadius(function(d) { return rScale(d.y1); });

  partition(root);

  const getColor = d => {
    if (d.depth === 0) return 'transparent';
    while (d.depth > 1) d = d.parent;
    return color(d.data.name);
  };

  const format = d3.format(",d");

  const getTextTransform = d => {
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = (rScale(d.y0) + rScale(d.y1)) / 2;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  };

  return (
    <svg width={svgWidth} height={svgHeight}>
      <g fillOpacity={0.6}>
        {root
          .descendants()
          .filter(d => d.depth)
          .map((d, i) => (
            <path key={`${d.data.name}-${i}`} fill={getColor(d)} d={arc(d)}>
              <text dy="0.35em">
                {d
                  .ancestors()
                  .map(d => d.data.name)
                  .reverse()
                  .join("/")}
                {"\n"}
                {format(d.value)}
              </text>
            </path>
          ))}
      </g>
      <g pointerEvents="none" textAnchor="middle" fontSize={10} fontFamily="sans-serif">
        {root
          .descendants()
          .filter(d => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10)
          .map((d, i) => (
            <text key={`${d.data.name}-${i}`} transform={getTextTransform(d)} dy="0.35em">
              {d.data.name}
            </text>
          ))}
      </g>
    </svg>
  );
};

const App = () => {
  const data = {
    name: "A",
    children: [
      { name: "B", value: 25 },
      {
        name: "C",
        children: [
          { name: "D", value: 10 },
          { name: "E", value: 15 },
          { name: "F", value: 10 },
        ],
      },
      { name: "G", value: 15 },
      {
        name: "H",
        children: [
          { name: "I", value: 20 },
          { name: "J", value: 10 },
        ],
      },
      { name: "K", value: 10 },
    ],
  };

  return <Chart data={data} />;
};

ReactDOM.render(<App />, document.getElementById("root"));
