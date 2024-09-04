import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PopulationChart = ({ data, selectedReligion }) => {
  if (!data || !selectedReligion) {
    return <div>データが選択されていません</div>;
  }

  const findReligionValue = (children, targetName) => {
    if (!children) return 0;
    let sum = 0;
    for (let child of children) {
      if (child.name === targetName) {
        return child.value || sumChildValues(child.children) || 0;
      }
      if (child.children) {
        const childValue = findReligionValue(child.children, targetName);
        if (childValue > 0) return childValue;
        sum += childValue;
      }
    }
    return sum;
  };

  const sumChildValues = (children) => {
    if (!children) return 0;
    return children.reduce(
      (sum, child) =>
        sum + (child.value || sumChildValues(child.children) || 0),
      0
    );
  };

  const chartData = data.children.map((yearData) => ({
    year: yearData.name,
    信者数: findReligionValue(yearData.children, selectedReligion),
  }));

  const formatYAxis = (value) => {
    return Math.round(value / 1000000) + "M";
  };

  return (
    <ResponsiveContainer width="100%" height={225}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="year"
          interval={0}
          angle={-30}
          dx={-10}
          dy={5}
          tick={{ fontSize: 13 }}
        />
        <YAxis tickFormatter={formatYAxis} />
        <Tooltip formatter={(value) => [formatYAxis(value), "信者数"]} />
        <Legend />
        <Line
          type="monotone"
          dataKey="信者数"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PopulationChart;
