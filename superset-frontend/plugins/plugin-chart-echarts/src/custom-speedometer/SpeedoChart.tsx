import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { DEFAULT_FORM_DATA, SpeedometerChartProps, SpeedometerChartFormData } from './types';


const SpeedoChart: React.FC<SpeedometerChartFormData> = (props: SpeedometerChartFormData) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const { minValue, 
    maxValue, 
    progress,
    segmentAmt, 
    controlledSegments,
    dataChartColor,
    dataChartLineThickness,
    outerRadius,
    innerRadius,
  } = props;
  // Assuming props includes segmentChartFormData

  var calculatedData = progress

  // Hardcoded values for 2nd chart
  var outerRadiusSecondChart = 195;
  var innerRadiusSecondChart = 205;
  const segments2 = controlledSegments
  
  useEffect(() => {
    const chart = echarts.init(chartRef.current!);

    const options = {
      title: {
        text: `${calculatedData} %`,
        left: 'center',
        top: '75%',
        textStyle: {
          fontSize: 58,
          fontWeight: 'bold',
        },
      },
      grid: {
        left: '50%',
        top: '50%',
      },
      xAxis: { show: false, }, 
      yAxis: { show: false, },
      /*tooltip: {        
        shoz: true,
        trigger: 'item',
        triggerOn: 'mousemove',
        axisPointer: {
          type: 'line',
          label: {
            show: true,
            parals: 10,
            backgroundColor: '#333'
          }
        }
      },*/
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: '90%',
          style: {
            text: 'MIN Profit',
            fontSize: 20,
            fontWeight: 100, 
          }
        },
        {
          type: 'text',
          left: 1200,
          top: 150,
          style: {
            text: `minValue: ${minValue}`,
            fontSize: 16,
            fontWeight: 'bold',
          }
        },
        {
          type: 'text',
          left: 1200,
          top: 170,
          style: {
            text: `maxValue: ${maxValue}`,
            fontSize: 16,
            fontWeight: 'bold',
          }
        },
        {
          type: 'text',
          left: 1200,
          top: 190,
          style: {
            text: `Segment Amt: ${segmentAmt}`,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        // Loop here             
        ...segments2.flatMap((segment, index) => [
          {
            type: 'text',
            left: 1200,
            top: 210 + index * 60,
            style: {
              text: `S${index+1}Start: ${segment.start}`,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          {
            type: 'text',
            left: 1200,
            top: 230 + index * 60,
            style: {
              text: `S${index+1}End: ${segment.end}`,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          {
            type: 'text',
            left: 1200,
            top: 250 + index * 60,
            style: {
              text: `S${index+1}Colorcode: ${segment.color}`,
              fontSize: 16,
              fontWeight: 'bold',
            },
          }
        ])            
      ],
      series: [
        {
          // backGround Chart
          type: 'custom',
          renderItem: (params: any, api: any) => {
            const startAngle = (160 * Math.PI) / 180;
            const endAngle = startAngle + ((220 / 360) * 2 * Math.PI * 1);
            const largeArcFlag = (endAngle - startAngle) > Math.PI ? 1 : 0;
            
            const [cx, cy] = api.coord([0, 0]);


            return {
              type: 'path',
              shape: {
                pathData: `
                  M ${cx + innerRadius * Math.cos(startAngle)} ${cy + innerRadius * Math.sin(startAngle)}
                  A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1
                    ${cx + innerRadius * Math.cos(endAngle)} ${cy + innerRadius * Math.sin(endAngle)}
                  L ${cx + outerRadius * Math.cos(endAngle)} ${cy + outerRadius * Math.sin(endAngle)}
                  A ${outerRadius} ${outerRadius} 0 ${largeArcFlag}  0
                    ${cx + outerRadius * Math.cos(startAngle)} ${cy + outerRadius * Math.sin(startAngle)}
                  Z         
                `,
              },
              style: {
                fill: '#dedede', 
              },
            };
          },
          data: [[]],
        },
        {
        // Data Showcase Chart
        type: 'custom',
        renderItem: (params: any, api: any) => {
          const startAngle = (160 * Math.PI) / 180; // Convert 170° to radians
          var hardCap = Math.min(calculatedData, 100); // Ensure hardCap does not exceed 100
          const endAngleRaw = startAngle + ((220 / 360) * 2 * Math.PI * (hardCap / 100));
          const endAngle = endAngleRaw > 2 * Math.PI ? endAngleRaw - 2 * Math.PI : endAngleRaw;
          
          const [cx, cy] = api.coord([0, 0]);

          const largeArcFlag = (endAngleRaw - startAngle) > Math.PI ? 1 : 0;

          return {
            type: 'path',
            shape: {
              pathData: `
                M ${cx + innerRadius * Math.cos(startAngle)} ${cy + innerRadius * Math.sin(startAngle)}
                A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1
                  ${cx + innerRadius * Math.cos(endAngle)} ${cy + innerRadius * Math.sin(endAngle)}
                L ${cx + outerRadius * Math.cos(endAngle)} ${cy + outerRadius * Math.sin(endAngle)}
                A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0
                  ${cx + outerRadius * Math.cos(startAngle)} ${cy + outerRadius * Math.sin(startAngle)}
                Z         
              `,
            },
            style: {
              fill: dataChartColor || DEFAULT_FORM_DATA.dataChartColor, 
              stroke: '#000',
              lineWidth: dataChartLineThickness || DEFAULT_FORM_DATA.data, 
            },
          };
        },
        data: [{}], // Single data item to trigger renderItem
      },
      {
        // Segments Chart
        type: 'custom',
        renderItem: (params: any, api: any) => {
            const [cx, cy] = api.coord([0, 0]);
        
            const startAngleOffset = (160 * Math.PI) / 180;  // 170° in radians
            const arcSpan = (220 * Math.PI) / 180;           // 200° in radians
        
            const segmentArcs = segments2.map((segment) => {
            // Calculate start and end angles for each segment
            const startAngle = startAngleOffset + (arcSpan * (segment.start / 100)); // Map start percentage to radians
            const endAngle = startAngleOffset + (arcSpan * (segment.end / 100));     // Map end percentage to radians
              
            return {
                type: 'path',
                shape: {
                    pathData: `
                      M ${cx + innerRadiusSecondChart * Math.cos(startAngle)} ${cy + innerRadiusSecondChart * Math.sin(startAngle)}
                      A ${innerRadiusSecondChart} ${innerRadiusSecondChart} 0 0 1
                        ${cx + innerRadiusSecondChart * Math.cos(endAngle)} ${cy + innerRadiusSecondChart * Math.sin(endAngle)}
                      L ${cx + outerRadiusSecondChart * Math.cos(endAngle)} ${cy + outerRadiusSecondChart * Math.sin(endAngle)}
                      A ${outerRadiusSecondChart} ${outerRadiusSecondChart} 0 0 0
                        ${cx + outerRadiusSecondChart * Math.cos(startAngle)} ${cy + outerRadiusSecondChart * Math.sin(startAngle)}
                      Z
                    `,
                },
                style: {
                    fill: segment.color,
                    stroke: '#000',
                    lineWidth: 1,
                },
            };
            });
          
            return {
                type: 'group',
                children: segmentArcs, // Add all arcs as children of the group
            };
        },
        data: [{}]
      }],      
    };

    chart.setOption(options);


    return () => {
      chart.dispose();
    };
  }, [calculatedData]);

  return <div ref={chartRef} style={{ 
    width: '100%', height: '520px',    
  }} 
  />;
};

export default SpeedoChart;
