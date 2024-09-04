import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import "./styles.css";
import { RELIGION_IMG } from "./ReligionImg";

const Chart = ({
  data,
  setSelectedValue,
  setReligionInfo,
  religionInfoData,
  setSelectedReligion,
  width = 700,
  height = 700,
}) => {
  const [selectedSegment, setSelectedSegment] = useState(null);

  const radius = Math.min(width, height) / 2.1;
  const color = d3.scaleOrdinal(d3.schemeSet3);

  useEffect(() => {
    setSelectedSegment(null);
    setSelectedValue(null);
    setReligionInfo("データが選択されていません");
  }, [data]);

  if (!data) {
    return <div>No data available</div>;
  }

  const root = d3.hierarchy(data).sum((d) => d.value);

  const partition = d3.partition().size([2 * Math.PI, radius]);
  partition(root);

  const arc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .innerRadius((d) => d.y0)
    .outerRadius((d) => d.y1);

  const getColor = (d) => {
    if (d.depth === 0) return "transparent";
    while (d.depth > 1) d = d.parent;
    return color(d.data.name);
  };

  const getTextTransform = (d) => {
    const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
    const y = (d.y0 + d.y1) / 2;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const findReligionInfo = (name, infoData) => {
    if (infoData && infoData.children) {
      for (let key in infoData.children) {
        if (key === name) {
          return infoData.children[key].info;
        }
        const result = findReligionInfo(name, infoData.children[key]);
        if (result) return result;
      }
    }
    return null;
  };

  const handleClick = (event, d) => {
    event.stopPropagation();
    if (selectedSegment && selectedSegment.data.name === d.data.name) {
      setSelectedSegment(null);
      setSelectedValue(null);
      setReligionInfo("");
      setSelectedReligion(null);
    } else {
      setSelectedSegment(d);

      const value = formatNumber(d.value);
      console.log(value);
      const religion = RELIGION_IMG.filter(
        (religion) => religion.source == value
      );
      console.log(religion);
      setSelectedValue(formatNumber(d.value));
      // const info = findReligionInfo(d.data.name, religionInfoData.Religions);
      const info = findReligionInfo(d.data.name, religionInfoData.宗教);
      setReligionInfo(info || `No information available for ${d.data.name}`);
      setSelectedReligion(d.data.name);
    }
  };

  const handleChartClick = () => {
    setSelectedSegment(null);
    setSelectedValue(null);
    setReligionInfo("データが選択されていません");
  };

  return (
    <svg width={width} height={height} onClick={handleChartClick}>
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {root
          .descendants()
          .filter((d) => d.depth)
          .map((d, i) => (
            <path
              key={`${d.data.name}-${i}`}
              fill={getColor(d)}
              d={arc(d)}
              stroke="white"
              strokeWidth={
                selectedSegment && selectedSegment.data.name === d.data.name
                  ? 5
                  : 1
              }
              onClick={(event) => handleClick(event, d)}
            />
          ))}
      </g>
      <g
        textAnchor="middle"
        fontSize={13}
        transform={`translate(${width / 2}, ${height / 2})`}
      >
        {root
          .descendants()
          .filter((d) => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10)
          .map((d, i) => (
            <text
              key={`${d.data.name}-${i}`}
              transform={getTextTransform(d)}
              dy="0.35em"
            >
              {d.data.name}
            </text>
          ))}
      </g>
    </svg>
  );
};

export default Chart;
