import React from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";

const Chart = ({ data }) => {
  const leftMargin = 100;
  const rightMargin = 300;
  const bottomMargin = 100;
  const contentWidth = 800;
  const contentHeight = 50 * data.series.length * data.labels.length;
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data.series.flatMap((s) => s.values))])
    .range([0, contentWidth])
    .nice();

  const yScale = d3
    .scaleBand()
    .domain(data.labels)
    .range([0, contentHeight])
    .padding(0.15);

  const svgWidth = leftMargin + contentWidth + rightMargin;
  const svgHeight = contentHeight + bottomMargin;

  return (
    <svg width={svgWidth} height={svgHeight}>
      <g transform={`translate(${leftMargin},0)`}>
        {data.labels.map((label, i) => (
          <g key={label} transform={`translate(0, ${yScale(label)})`}>
            {data.series.map((series, j) => (
              <rect
                key={series.name}
                x={0}
                y={j * (yScale.bandwidth() / data.series.length)}
                width={xScale(series.values[i])}
                height={yScale.bandwidth() / data.series.length - 15}
                fill={color(series.name)}
              />
            ))}

            <text x={-10} y={yScale.bandwidth() / 2} textAnchor="end">
              {label}
            </text>
            <line
              x1={-10}
              y1={yScale.bandwidth() / 2 - 8}
              x2={0}
              y2={yScale.bandwidth() / 2 - 8}
              stroke="gray"
            />
          </g>
        ))}

        <g>
          {xScale.ticks().map((tick) => (
            <g key={tick} transform={`translate(${xScale(tick)},0)`}>
              <line y1={0} y2={contentHeight} stroke="gray" />
              <text y={contentHeight + 10} textAnchor="middle">
                {tick}
              </text>
            </g>
          ))}
        </g>

        <line
          x1={0}
          y1={contentHeight - 10}
          x2={contentWidth}
          y2={contentHeight - 10}
          stroke="gray"
        />

        {/* 凡例 */}
        <g transform={`translate(${contentWidth + 10},10)`}>
          {data.series.map((series, i) => (
            <g key={series.name} transform={`translate(0, ${i * 30})`}>
              <rect width={20} height={20} fill={color(series.name)} />
              <text x={25} y={15} textAnchor="start">
                {series.name}
              </text>
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
};

const App = () => {
  const data = {
    labels: ["A", "B", "C"],
    series: [
      {
        name: "data",
        values: [123, 456, 789],
      },
      {
        name: "another data",
        values: [234, 567, 891],
      },
    ],
  };

  return <Chart data={data} />;
};

ReactDOM.render(<App />, document.getElementById("root"));
