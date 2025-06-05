import React from 'react';

import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  CartesianAxis,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line
} from 'recharts'

const Graph = (props) => {
  const {
    data,

  } = props;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }}
        padding={{left: 10, right: 10}}
      >
        <CartesianGrid
          strokeDasharray="5 3"
        />
        <CartesianAxis

        />
        <XAxis
          dataKey="date"
          tick={false}
          type="category"
          orientation="middle"
          padding={{right: 10}}
        />
        <YAxis
          domain={[-50, 50]}
          unit=" %"
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="index"
          stroke="#be1622"
          unit=" %"
          strokeWidth={2}
          dot={{r: 0}}
          activeDot={{r: 8}}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default Graph;
