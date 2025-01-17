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
    dataChartOuterRadius,
    dataChartInnerRadius,
    segmentChartOuterRadius,
    segmentChartInnerRadius,
  } = props;
  // Assuming props includes segmentChartFormData

  // Decalre state variable
  var calculatedData = progress

  

  // Hardcoded values for 2nd chart
  const segments2 = controlledSegments
  
  useEffect(() => {
    const chart = echarts.init(chartRef.current!);
    console.log("Render SpeedoChart")
    
    const options = {
      title: {
        text: `${calculatedData} %`,
        left: 'center',
        top: '45%',
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
          left: '20%',
          top: '70%',
          style: {
            text: `${minValue}`,
            fontSize: 28,
            fontWeight: 'bold',
          }
        },
        {
          type: 'text',
          left: '75%',
          top: '70%',
          style: {
            text: `${maxValue}`,
            fontSize: 28,
            fontWeight: 'bold',
          }
        },
        {
          type: 'text',
          left: 750,
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
            left: 750,
            top: 210 + index * 60,
            style: {
              text: `S${index+1}Start: ${segment.start}`,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          {
            type: 'text',
            left: 750,
            top: 230 + index * 60,
            style: {
              text: `S${index+1}End: ${segment.end}`,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          {
            type: 'text',
            left: 750,
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
          // BackGround Chart
          type: 'custom',
          legendHoverLink: false,
          animation: false,
          silent: true,
          renderItem: (params: any, api: any) => {
            const startAngle = (160 * Math.PI) / 180;
            const endAngle = startAngle + ((220 / 360) * 2 * Math.PI * 1);
            const largeArcFlag = (endAngle - startAngle) > Math.PI ? 1 : 0;
            
            const [cx, cy] = api.coord([0, 1]);


            return {
              type: 'path',
              shape: {
                pathData: `
                  M ${cx + dataChartInnerRadius * Math.cos(startAngle)} ${cy + dataChartInnerRadius * Math.sin(startAngle)}
                  A ${dataChartInnerRadius} ${dataChartInnerRadius} 0 ${largeArcFlag} 1
                    ${cx + dataChartInnerRadius * Math.cos(endAngle)} ${cy + dataChartInnerRadius * Math.sin(endAngle)}
                  L ${cx + dataChartOuterRadius * Math.cos(endAngle)} ${cy + dataChartOuterRadius * Math.sin(endAngle)}
                  A ${dataChartOuterRadius} ${dataChartOuterRadius} 0 ${largeArcFlag}  0
                    ${cx + dataChartOuterRadius * Math.cos(startAngle)} ${cy + dataChartOuterRadius * Math.sin(startAngle)}
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
        legendHoverLink: false,
        animation: true, // Enable animation
        animationDuration: 1000,  // Animation duration (in ms)
        animationEasing: 'cubicInOut', // Smooth easing
        silent: true,
        renderItem: (params: any, api: any) => {
          const startAngle = (160 * Math.PI) / 180; // Convert 170° to radians
          var hardCap = Math.min(calculatedData, 100); // Ensure hardCap does not exceed 100
          const endAngleRaw = startAngle + ((220 / 360) * 2 * Math.PI * (hardCap / 100));
          const endAngle = endAngleRaw > 2 * Math.PI ? endAngleRaw - 2 * Math.PI : endAngleRaw;          
          const [cx, cy] = api.coord([0, 1]);
          const largeArcFlag = (endAngleRaw - startAngle) > Math.PI ? 1 : 0;

          return {
            type: 'path',
            shape: {
              pathData: `
                M ${cx + dataChartInnerRadius * Math.cos(startAngle)} ${cy + dataChartInnerRadius * Math.sin(startAngle)}
                A ${dataChartInnerRadius} ${dataChartInnerRadius} 0 ${largeArcFlag} 1
                  ${cx + dataChartInnerRadius * Math.cos(endAngle)} ${cy + dataChartInnerRadius * Math.sin(endAngle)}
                L ${cx + dataChartOuterRadius * Math.cos(endAngle)} ${cy + dataChartOuterRadius * Math.sin(endAngle)}
                A ${dataChartOuterRadius} ${dataChartOuterRadius} 0 ${largeArcFlag} 0
                  ${cx + dataChartOuterRadius * Math.cos(startAngle)} ${cy + dataChartOuterRadius * Math.sin(startAngle)}
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
            const [cx, cy] = api.coord([0, 1]);
        
            const startAngleOffset = (160 * Math.PI) / 180;  
            const arcSpan = (220 * Math.PI) / 180;           
        
            var segmentArcs = segments2.map((segment) => {
              // Calculate start and end angles for each segment
              const startAngle = startAngleOffset + (arcSpan * (segment.start / 100)); // Map start percentage to radians
              const endAngle = startAngleOffset + (arcSpan * (segment.end / 100));     // Map end percentage to radians
              
              return {
                  type: 'path',
                  shape: {
                      pathData: `
                        M ${cx + segmentChartInnerRadius * Math.cos(startAngle)} ${cy + segmentChartInnerRadius * Math.sin(startAngle)}
                        A ${segmentChartInnerRadius} ${segmentChartInnerRadius} 0 0 1
                          ${cx + segmentChartInnerRadius * Math.cos(endAngle)} ${cy + segmentChartInnerRadius * Math.sin(endAngle)}
                        L ${cx + segmentChartOuterRadius * Math.cos(endAngle)} ${cy + segmentChartOuterRadius * Math.sin(endAngle)}
                        A ${segmentChartOuterRadius} ${segmentChartOuterRadius} 0 0 0
                          ${cx + segmentChartOuterRadius * Math.cos(startAngle)} ${cy + segmentChartOuterRadius * Math.sin(startAngle)}
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
  
  return (
    <div
      style={{        
      }}
    >
      <div
        ref={chartRef}
        style={{
          margin: '0px auto',
          width: '50%',
          height: '500px',
        }}
      />
    </div>
  );
  
};

export default SpeedoChart;
