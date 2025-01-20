import { DEFAULT_FORM_DATA, LineBarTransformProps, LineBarChartFormData } from "./types";
import { t } from "@superset-ui/core";

export default function transformProps(chartProps: LineBarTransformProps) {
  const { width, height, formData, queriesData } = chartProps;

  // Access the 'metric' and 'groupby' fields from the formData
  const { metric, groupby } = formData;

  // Default groupby to an empty array if undefined
  const groupByColumns = groupby || [];

  // Retrieve the data from the query response
  const data = queriesData[0]?.data || [];

  // Ensure the metric label exists in the data
  const metricLabel = metric ? metric.label : '';

  // Map the data to the format required for the chart
  const chartData = data.map((record: any) => {
      // Group by selected dimension(s)
      const x = groupByColumns.map((group: string) => record[group]).join(' - '); // Join multiple columns if needed
      const y = record[metricLabel]; // Get the value for the selected metric

      return { x, y };
  });

  console.log('Transformed Data:', chartData);

  // Return the transformed data along with other chart properties
  return {
      width,
      height,
      data: chartData,
  };
}
