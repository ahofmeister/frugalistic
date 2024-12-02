import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

type CategoryData = {
  category: string;
  total: number;
  fill: string;
};

interface HorizontalBarProps {
  groupedCategories: CategoryData[];
}

const HorizontalBarChart: React.FC<HorizontalBarProps> = ({
  groupedCategories,
}) => {
  const onlyUnique = (value: string, index: number, array: string[]) =>
    array.indexOf(value) === index;

  const names = groupedCategories
    .filter((transaction) => transaction.category != null)
    .map((transaction) => transaction.category)
    .filter(onlyUnique);

  const colors = groupedCategories
    .map((transaction) => transaction.fill)
    .filter(onlyUnique);

  console.log(names);

  return (
    <ResponsiveContainer width="100%" height="50%">
      <BarChart width={500} height={300} data={groupedCategories}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis dataKey="total" />
        <Tooltip />
        <Legend />
        {names.map((name, index) => (
          <Bar
            key={index}
            dataKey={name}
            // stackId="a"
            fill={colors[index]}
            // onMouseOver={() => (tooltip = name)}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HorizontalBarChart;
