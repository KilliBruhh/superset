import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { LineBarChartFormData } from './types';

const LineBarChart: React.FC<LineBarChartFormData> = (props: LineBarChartFormData) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const {
    data,
  } = props;

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);

      // Extract categories (x-axis) and values (y-axis)
      const categories = Array.from(new Set(data.map((item: { x: any; }) => item.x)));

      const barData = categories.map((category) => {
        const record = data.find((item: { x: unknown; }) => item.x === category);
        return record ? record.y : 0; // Default to 0 if no data exists
      });

      const lineData = [...barData]; // Use the same data for the line chart

      // Chart options
      const options = {
        title: {
          text: 'Bar and Line Chart',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['Bar Data', 'Line Data'],
          top: 'bottom',
        },
        xAxis: {
          type: 'category',
          data: categories, // Use categories for the x-axis
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: 'Bar Data',
            type: 'bar', // Bar chart
            data: barData,
            barWidth: '50%', // Adjust bar width
          },
          {
            name: 'Line Data',
            type: 'line', // Line chart
            data: lineData,
            lineStyle: {
              width: 2,
              type: 'solid',
            },
            smooth: false, // Optional: makes the line smoother
          },
        ],
      };

      // Set chart options
      chart.setOption(options);

      // Cleanup on component unmount
      return () => {
        chart.dispose();
      };
    }
  }, [data]);


  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        ref={chartRef}
        style={{
          width: '80%',
          height: '500px',
        }}
      />
    </div>
  );
};

export default LineBarChart;
