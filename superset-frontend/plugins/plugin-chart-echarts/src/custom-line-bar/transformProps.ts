import { DEFAULT_FORM_DATA, LineBarTransformProps, LineBarChartFormData } from "./types";
import { t } from "@superset-ui/core";

export default function transformProps(chartProps: LineBarTransformProps) {
    const { width, height, formData, queriesData } = chartProps;

    // Access the 'metrix' field
    var { metric, groupby } = formData;

    var data = queriesData[0]?.data || [];
    var metricLabel = metric.label;

    var metricValue = data[0][metricLabel];


  // Temporarily hardcode the dimension and metric keys
  const hardcodedDimension = 'day'; // Replace 'day' with your dimension field name
  const hardcodedMetric = 'profit'; // Replace 'profit' with your metric field name

  // Map data into x (dimension) and y (metric)
  const chartData = data.map((record: any) => ({
    x: record[hardcodedDimension], // Use hardcoded dimension
    y: record[hardcodedMetric],    // Use hardcoded metric
  }));
    console.log('Transformed Data:', chartData);

    var test_data = [
        { x: 'Category1', y: 10 },
        { x: 'Category2', y: 60 },
        { x: 'Category3', y: 20 },
        { x: 'Category4', y: 100 },
        { x: 'Category5', y: 5 },
    ];

    console.log({ metric, chartData });

    return {
        width,
        height,
        data: test_data,
    };
}
