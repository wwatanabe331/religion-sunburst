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
    population: findReligionValue(yearData.children, selectedReligion),
  }));

  const formatYAxis = (value) => {
    return Math.round(value / 1000000) + "M";
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={formatYAxis} />
        <Tooltip formatter={(value) => [formatYAxis(value), "Population"]} />
        <Legend />
        <Line
          type="monotone"
          dataKey="population"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PopulationChart;
