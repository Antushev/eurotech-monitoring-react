import React from 'react';
import { PieChart, Pie, Sector, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const COLORS = ['#ff4f4f', '#6ace34', '#f4fb25'];
const COLORS = ['#309898', '#FF9F00', '#FF4F4F', '#d9d9d9'];

const PieChartGraph = (props) => {
  const { data } = props;


  return (
    <ResponsiveContainer >
      <PieChart height="100">
        <Pie
          data={ data }
          dataKey="value"
          outerRadius={70}
          cx="50%"
          cy="50%"
          unit="%"
          labelLine={ false }
          label={ renderCustomizedLabel }
          fill="#8884d8"
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y + 5} fill="#ffffff" fontSize="18" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default PieChartGraph;
